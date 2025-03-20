using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace server.Models
{
    public class Group
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public required string Name { get; set; } 

        [Required]
        public int CreatedBy { get; set; }

        public List<UserGroup> Members { get; set; } = new List<UserGroup>();

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Range(2, 50, ErrorMessage = "Group size must be between 2 and 50 members.")]
        public int MaxMembers { get; set; }

        [Required]
        public decimal TotalBalance { get; set; } = 0;

        [Required]
        public bool IsActive { get; set; } = true;

        public string? Description { get; set; }

        [JsonIgnore]
        public List<Invitation> Invitations { get; set; } = new List<Invitation>();

        [JsonIgnore]
        public ICollection<Expense> Expenses { get; set; }

        [JsonIgnore]
        public ICollection<Settlement> Settlements { get; set; } = new List<Settlement>();
    }
}
