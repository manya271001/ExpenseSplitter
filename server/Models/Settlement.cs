using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using server.DTOs;
 
 namespace server.Models
{

    public class Settlement
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "GroupId is required.")]
        public int GroupId { get; set; }  // Foreign Key

        [Required(ErrorMessage = "Group is required.")]
        public Group Group { get; set; }   // Navigation Property

        [Required(ErrorMessage = "SettledAt is required.")]
        public DateTime SettledAt { get; set; }

        [Required(ErrorMessage = "IsSettled flag is required.")]
        public bool IsSettled { get; set; } // To track if the settlement is done

        [MinLength(1, ErrorMessage = "At least one payment flow is required.")]
        public ICollection<PaymentFlow> PaymentFlows { get; set; }  // Navigation Property to track all related payment flows
    }
}
