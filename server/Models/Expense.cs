using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;

public enum ExpenseCategory
{
    Food,
    Travel,
    Shopping,
    Utilities,
    Rent,
    Other
}

public class Expense
{
    public int Id { get; set; }

    [Required]
    public int GroupId { get; set; }
    public Group Group { get; set; }  // Navigation Property

    [Required]
    public int PaidBy { get; set; }
    public NewUser User { get; set; } // Navigation Property

    [Required]
    [Range(1, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
    public decimal Amount { get; set; }

    [Required]
    [EnumDataType(typeof(ExpenseCategory), ErrorMessage = "Invalid category")]
    [JsonConverter(typeof(JsonStringEnumConverter))] // Converts string to enum automatically
    public ExpenseCategory Category { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}