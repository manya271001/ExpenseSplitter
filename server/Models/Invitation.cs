using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace server.Models
{
    public class Invitation
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int GroupId { get; set; }

        [ForeignKey("GroupId")]
        public virtual Group Group { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public int InvitedUserId { get; set; } // ID of the user being invited

        [Required]
        public string Status { get; set; } = "Pending"; // Possible values: "Pending", "Accepted", "Rejected"

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public NewUser User { get; set; }
    }
}
