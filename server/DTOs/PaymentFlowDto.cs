using System.ComponentModel.DataAnnotations;

public class PaymentFlowDto
{
    [Required(ErrorMessage = "Payer is required")]
    [StringLength(100, ErrorMessage = "Payer name can't be longer than 100 characters")]
    public string Payer { get; set; }

    [Required(ErrorMessage = "Payee is required")]
    [StringLength(100, ErrorMessage = "Payee name can't be longer than 100 characters")]
    public string Payee { get; set; }

    [Required(ErrorMessage = "Amount is required")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
    public decimal Amount { get; set; }
}
