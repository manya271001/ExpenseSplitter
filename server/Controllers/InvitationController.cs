using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Controllers
{
    [Route("api/invitations")]
    [ApiController]
    public class InvitationController : ControllerBase
    {
        private readonly FullStackDbContext _context;

        public InvitationController(FullStackDbContext context)
        {
            _context = context;
        }


        [HttpPost("send")]
        public async Task<IActionResult> SendInvitation([FromBody] SendInvitationRequest request)
        {
            if (request.GroupId <= 0 || request.InvitedUserId <= 0 || string.IsNullOrWhiteSpace(request.InvitedUserName))
            {
                return BadRequest(new { message = "GroupId, InvitedUserId, and InvitedUserName are required" });
            }

            // Check if the invited user exists
            var userExists = await _context.NewUsers.AnyAsync(u => u.Id == request.InvitedUserId && u.Name == request.InvitedUserName);
            if (!userExists)
            {
                return BadRequest(new { message = "The invited user does not exist" });
            }

            // Check if the user is already in the group
            var existingMember = await _context.UserGroups
                .FirstOrDefaultAsync(m => m.GroupId == request.GroupId && m.UserId == request.InvitedUserId);
            if (existingMember != null)
            {
                return BadRequest(new { message = "User is already in the group" });
            }

            // Get the group details
            var group = await _context.Groups.FirstOrDefaultAsync(g => g.Id == request.GroupId);
            if (group == null)
            {
                return BadRequest(new { message = "Group not found" });
            }

            // Check if the group has space
            var currentMemberCount = await _context.UserGroups.CountAsync(m => m.GroupId == request.GroupId);
            if (currentMemberCount >= group.MaxMembers)
            {
                return BadRequest(new { message = "Group is full. Cannot send invitation." });
            }

            // Create and save the invitation
            var invitation = new Invitation
            {
                GroupId = request.GroupId,
                InvitedUserId = request.InvitedUserId,
                Name = request.InvitedUserName, // Ensure the invitation stores username
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.Invitations.Add(invitation);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Invitation sent successfully" });
        }



        [HttpGet("pending/{userId}")]
        public async Task<IActionResult> GetPendingInvitations(int userId)
        {
            var invitations = await _context.Invitations
                .Where(i => i.InvitedUserId == userId && i.Status == "Pending")
                .Select(i => new
                {
                    i.Id,
                    i.GroupId,
                    GroupName = i.Group.Name,

                    // Fetching group creator details
                    CreatedBy = i.Group.CreatedBy,
                    CreatedByName = _context.NewUsers
                        .Where(u => u.Id == i.Group.CreatedBy)
                        .Select(u => u.Name)
                        .FirstOrDefault(),

                    // Fetching invited user details
                    InvitedUserId = i.InvitedUserId,
                    InvitedUserName = i.Name,

                    i.CreatedAt
                })
                .ToListAsync();

            return Ok(invitations);
        }



        // ✅ Respond to Invitation (Accept/Reject)
        [HttpPost("respond")]
        public async Task<IActionResult> RespondToInvitation([FromBody] RespondToInvitationRequest request)
        {
            var invitation = await _context.Invitations
                .Include(i => i.Group)
                .FirstOrDefaultAsync(i => i.Id == request.InvitationId);

            if (invitation == null)
                return NotFound("Invitation not found.");

            if (request.IsAccepted)
            {
                // Check if group has space for more members
                var group = await _context.Groups
                    .Include(g => g.Members)
                    .FirstOrDefaultAsync(g => g.Id == invitation.GroupId);

                if (group == null)
                    return NotFound("Group not found.");

                if (group.Members.Count >= group.MaxMembers)
                    return BadRequest("Group is already full.");

                // Add user to UserGroup table
                var userGroup = new UserGroup
                {
                    UserId = invitation.InvitedUserId,
                    GroupId = invitation.GroupId
                };
                _context.UserGroups.Add(userGroup);

                // Mark invitation as accepted
                invitation.Status = "Accepted";
            }
            else
            {
                // Simply delete the invitation if rejected
                invitation.Status = "Rejected";
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = request.IsAccepted ? "Invitation accepted!" : "Invitation rejected." });
        }
    }
}
