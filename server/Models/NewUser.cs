using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace server.Models
{
    // The IndexAttribute should be used in the model builder for EF Core 5+
    // [Index(nameof(Email), IsUnique = true)] should be moved to OnModelCreating in the DbContext

    public class NewUser
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid Email Format")]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        public decimal InitialBalance { get; set; } = 0;
        public int NumberOfGroups { get; set; } = 0;
        public bool HasSetup { get; set; } = false;

        public List<Invitation> Invitations { get; set; } = new List<Invitation>();

        [JsonIgnore]
        public ICollection<Expense> Expenses { get; set; }

        [JsonIgnore]
        public ICollection<Settlement> Settlements { get; set; } = new List<Settlement>();

        // Corrected ReceivedPaymentFlows to be a collection of PaymentFlow
        [JsonIgnore]
        public ICollection<PaymentFlow> ReceivedPaymentFlows { get; set; } = new List<PaymentFlow>();

        [JsonIgnore]
        public ICollection<PaymentFlow> PaidPaymentFlows { get; set; }

        public virtual UserBalance Balance { get; set; }

    }
}
