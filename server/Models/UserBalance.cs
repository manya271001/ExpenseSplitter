using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models
{
    public class UserBalance
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("NewUser")]
        public int UserId { get; set; }

        public decimal TotalOwed { get; set; } = 0; // Total amount the user owes
        public decimal TotalLent { get; set; } = 0; // Total amount the user has lent

        public virtual NewUser User { get; set; }
    }
}
