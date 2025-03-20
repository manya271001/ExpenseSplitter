using System.ComponentModel.DataAnnotations;

namespace server.DTOs
{
    public class AddExpenseDto
    {
        [Required]
        public int GroupId { get; set; }

        [Required]
        public int PaidBy { get; set; }

        [Required]
        [Range(1, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public decimal Amount { get; set; }

        [Required]
        [EnumDataType(typeof(ExpenseCategory), ErrorMessage = "Invalid category")]
        public ExpenseCategory Category { get; set; }
    }
}
