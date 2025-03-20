using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace server.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly FullStackDbContext _context;

        public UserController(FullStackDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NewUser>>> GetUsers()
        {
            var users = await _context.NewUsers.ToListAsync();
            return Ok(users);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<NewUser>> GetUserById(int id)
        {
            var user = await _context.NewUsers.FindAsync(id);
            if (user == null) return NotFound(new { message = "User not found" });

            return Ok(new
            {
                user.Id,
                user.Name,
                user.Email,
                user.InitialBalance,
                user.NumberOfGroups,
                user.HasSetup
            });
        }
    }
}
