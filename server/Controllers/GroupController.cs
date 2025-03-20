using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace server.Controllers
{
    [Route("api/group")]
    [ApiController]
    public class GroupController : ControllerBase
    {
        private readonly FullStackDbContext _context;

        public GroupController(FullStackDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Creates a new group with specified members.
        /// </summary>
        [HttpPost("createGroup")]
        public async Task<IActionResult> CreateGroup([FromBody] CreateGroupModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var user = await _context.NewUsers.FindAsync(model.CreatedBy);
                if (user == null)
                    return BadRequest(new { message = "User not found" });

                // Create a new group
                var group = new server.Models.Group
                {
                    Name = model.Name,
                    CreatedBy = model.CreatedBy,
                    MaxMembers = model.MaxMembers,
                    TotalBalance = model.TotalBalance,
                    IsActive = model.IsActive,
                    Description = model.Description,
                    Members = new List<UserGroup>()
                };

                // Fetch valid members from the database
                var members = await _context.NewUsers
                                            .Where(u => model.MemberIds.Contains(u.Id))
                                            .ToListAsync();

                var existingUserGroupIds = new HashSet<int>();

                foreach (var member in members)
                {
                    if (!existingUserGroupIds.Contains(member.Id))
                    {
                        group.Members.Add(new UserGroup { UserId = member.Id, Group = group });
                        existingUserGroupIds.Add(member.Id);
                    }
                }

                // Ensure creator is added to the group
                if (!existingUserGroupIds.Contains(model.CreatedBy))
                {
                    group.Members.Add(new UserGroup { UserId = model.CreatedBy, Group = group });
                }

                if (members.Count != model.MemberIds.Count)
                {
                    return BadRequest(new { message = "Some member(s) not found" });
                }

                _context.Groups.Add(group);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Group created successfully!",
                    group
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the group.", error = ex.Message });
            }
        }

        /// <summary>
        /// Retrieves the count of groups a user is part of.
        /// </summary>
        [HttpGet("userGroups/{userId}")]
        public async Task<IActionResult> GetUserGroups(int userId)
        {
            var userGroups = await _context.UserGroups
                .Where(ug => ug.UserId == userId)
                .Select(ug => ug.GroupId)
                .Distinct()
                .ToListAsync();

            return Ok(new { numberOfGroups = userGroups.Count });
        }

        /// <summary>
        /// Retrieves detailed information about groups a user is part of.
        /// </summary>
        [HttpGet("userGroups/details/{userId}")]
        public async Task<IActionResult> GetUserGroupsWithDetails(int userId)
        {
            var userGroups = await _context.UserGroups
                .Where(ug => ug.UserId == userId)
                .Include(ug => ug.Group)
                .Select(ug => new
                {
                    ug.Group.Id,
                    ug.Group.Name,
                    ug.Group.MaxMembers,
                    ug.Group.TotalBalance,
                    ug.Group.IsActive,
                    ug.Group.Description,
                    ug.Group.CreatedAt
                })
                .ToListAsync();

            if (!userGroups.Any())
            {
                return NotFound(new { message = "No groups found for this user." });
            }

            return Ok(userGroups);
        }

        /// <summary>
        /// Retrieves all groups created by a specific user.
        /// </summary>
        [HttpGet("createdBy/{userId}")]
        public async Task<IActionResult> GetCreatedGroups(int userId)
        {
            var groups = await _context.Groups
                .Where(g => g.CreatedBy == userId)
                .ToListAsync();

            return Ok(groups);
        }

        /// <summary>
        /// Allows a user to leave a group they are a part of but did not create.
        /// </summary>
        [HttpDelete("leaveGroup/{groupId}/{userId}")]
        public async Task<IActionResult> LeaveGroup(int groupId, int userId)
        {
            var group = await _context.Groups.FindAsync(groupId);
            if (group == null)
            {
                return NotFound(new { message = "Group not found" });
            }

            // Ensure user is not the creator
            if (group.CreatedBy == userId)
            {
                return BadRequest(new { message = "Group creators cannot leave their own group." });
            }

            var userGroup = await _context.UserGroups
                .FirstOrDefaultAsync(ug => ug.GroupId == groupId && ug.UserId == userId);

            if (userGroup == null)
            {
                return BadRequest(new { message = "User is not a member of this group." });
            }

            _context.UserGroups.Remove(userGroup);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User successfully left the group." });
        }

        /// <summary>
        /// Deletes a group, only allowed by the creator.
        /// </summary>
        [HttpDelete("deleteGroup/{groupId}/{userId}")]
        public async Task<IActionResult> DeleteGroup(int groupId, int userId)
        {
            var group = await _context.Groups.FindAsync(groupId);

            if (group == null)
            {
                return NotFound(new { message = "Group not found" });
            }

            if (group.CreatedBy != userId)
            {
                return Unauthorized(new { message = "You are not authorized to delete this group." });
            }

            _context.Groups.Remove(group);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Group deleted successfully!" });
        }

        /// <summary>
        /// Retrieves members of a specific group.
        /// </summary>
        [HttpGet("members/{groupId}")]
        public async Task<IActionResult> GetGroupMembers(int groupId)
        {
            var group = await _context.Groups.FindAsync(groupId);
            if (group == null)
            {
                return NotFound(new { message = "Group not found." });
            }

            var members = await _context.UserGroups
                .Where(ug => ug.GroupId == groupId)
                .Select(ug => new
                {
                    ug.UserId,
                    UserName = _context.NewUsers
                        .Where(u => u.Id == ug.UserId)
                        .Select(u => u.Name)
                        .FirstOrDefault()
                })
                .ToListAsync();

            if (!members.Any())
            {
                return NotFound(new { message = "No members found in this group." });
            }

            return Ok(members);
        }

        /// <summary>
        /// Retrieves the current number of members in all groups a user is part of.
        /// </summary>
        [HttpGet("userGroups/memberCounts/{userId}")]
        public async Task<IActionResult> GetUserGroupMemberCounts(int userId)
        {
            var userGroups = await _context.UserGroups
                .Where(ug => ug.UserId == userId)
                .Include(ug => ug.Group)
                .Select(ug => new
                {
                    GroupId = ug.Group.Id,
                    GroupName = ug.Group.Name,
                    MemberCount = _context.UserGroups.Count(gm => gm.GroupId == ug.Group.Id)
                })
                .Distinct()
                .ToListAsync();

            if (!userGroups.Any())
            {
                return NotFound(new { message = "No groups found for this user." });
            }

            return Ok(userGroups);
        }

        /// <summary>
        /// Retrieves the actual number of members in a specific group (including the user).
        /// </summary>
        [HttpGet("memberCount/{groupId}")]
        public async Task<IActionResult> GetGroupMemberCount(int groupId)
        {
            var memberCount = await _context.UserGroups
                .Where(ug => ug.GroupId == groupId)
                .Select(ug => ug.UserId)
                .Distinct()
                .CountAsync();

            return Ok(new { memberCount });
        }


    }
}
