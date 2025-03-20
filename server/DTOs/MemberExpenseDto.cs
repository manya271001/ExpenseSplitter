using System.ComponentModel.DataAnnotations;
namespace server.DTOs
{
    public class MemberExpenseDto
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "User name must be between 2 and 100 characters.")]
        public string UserName { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "TotalPaid must be a positive number.")]
        public decimal TotalPaid { get; set; }

        [Range(double.MinValue, double.MaxValue, ErrorMessage = "AmountOwed must be a valid number.")]
        public decimal AmountOwed { get; set; }
    }
}
