using server.Models;
using System.ComponentModel.DataAnnotations;

public class PaymentFlow
{
    public int Id { get; set; }

    [Required]
    public int PayerId { get; set; }

    [Required]
    public int PayeeId { get; set; }

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
    public decimal Amount { get; set; }

    [Required]
    public int SettlementId { get; set; }

    public Settlement Settlement { get; set; }

    public NewUser Payer { get; set; }  
    public NewUser Payee { get; set; }
}
