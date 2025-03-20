using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using server.Data;
using server.Models;
using server.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace server.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly FullStackDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(FullStackDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // **REGISTER NewUser**
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(new { message = "Invalid input data" });

                if (await _context.NewUsers.AnyAsync(u => u.Email == model.Email))
                    return Conflict(new { message = "Email already exists" });

                var hashedPassword = PasswordHasher.HashPassword(model.Password);
                var newUser = new NewUser
                {
                    Email = model.Email,
                    Name = model.Name,
                    PasswordHash = hashedPassword,
                    InitialBalance = 0, // Default
                    NumberOfGroups = 0, // Default
                    HasSetup = false    // Default
                };

                _context.NewUsers.Add(newUser);
                await _context.SaveChangesAsync();

                // ?? Generate JWT Token for the new user
                var token = GenerateJwtToken(newUser);

                // ?? Return user details + token
                return CreatedAtAction(nameof(Register), new
                {
                    message = "NewUser registered successfully!",
                    user = new
                    {
                        newUser.Id,
                        newUser.Name,
                        newUser.Email,
                        newUser.InitialBalance,
                        newUser.NumberOfGroups,
                        newUser.HasSetup
                    },
                    token
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred",
                    error = ex.Message,
                    stackTrace = ex.StackTrace
                });
            }
        }



        // **LOGIN NewUser**
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var NewUser = await _context.NewUsers.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (NewUser == null) return Unauthorized(new { message = "Invalid credentials" });

            // Verify Password
            if (!PasswordHasher.VerifyPassword(model.Password, NewUser.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid credentials" });
            }

            var token = GenerateJwtToken(NewUser);
            return Ok(new
            {
                token,
                NewUser = new
                {
                    NewUser.Id,
                    NewUser.Name,
                    NewUser.Email,
                    NewUser.InitialBalance,
                    NewUser.NumberOfGroups,
                    NewUser.HasSetup
                }
            });
        }

        // **JWT TOKEN GENERATION**
        private string GenerateJwtToken(NewUser NewUser)
        {
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]);

            var claims = new[]
{
                    new Claim(JwtRegisteredClaimNames.Sub, NewUser.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Email, NewUser.Email),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
};

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; 
            if (userId == null) return Unauthorized(new { message = "Invalid token" });

            var NewUser = await _context.NewUsers.FindAsync(int.Parse(userId));
            if (NewUser == null) return NotFound(new { message = "User not found" });

            return Ok(new
            {
                NewUser.Name,
                NewUser.Email,
                NewUser.InitialBalance,
                NewUser.NumberOfGroups,
                NewUser.HasSetup
            });

        }

        [HttpGet("user/{id}")]
        public async Task<IActionResult> GetUserById(int id)
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