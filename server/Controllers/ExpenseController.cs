using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.DTOs;
using server.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

[Route("api/expenses")]
[ApiController]
public class ExpenseController : ControllerBase
{
    private readonly FullStackDbContext _context;

    public ExpenseController(FullStackDbContext context)
    {
        _context = context;
    }

    //  Add Expense
    [HttpPost("addExpense")]
    public async Task<IActionResult> AddExpense([FromBody] AddExpenseDto model)
    {
        try
        {
            // Validate the DTO (this happens automatically via ModelState)
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if the user exists
            var user = await _context.NewUsers.FindAsync(model.PaidBy);
            if (user == null)
            {
                return BadRequest(new { message = "User not found." });
            }

            // Check if the user is part of the group
            var isMember = await _context.UserGroups
                .AnyAsync(ug => ug.UserId == model.PaidBy && ug.GroupId == model.GroupId);

            if (!isMember)
            {
                return BadRequest(new { message = "User is not a member of the group." });
            }

            // Map DTO to the Expense entity
            var expense = new Expense
            {
                GroupId = model.GroupId,
                PaidBy = model.PaidBy,
                Amount = model.Amount,
                Category = model.Category,
                CreatedAt = DateTime.UtcNow
            };

            // Add the expense to the database
            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Expense added successfully!" });
        }
        catch (Exception ex)
        {
            // Return a server error if something goes wrong
            return StatusCode(500, new { message = "An error occurred.", details = ex.Message });
        }
    }


    // Get All Expenses for a Group
    [HttpGet("group/{groupId}")]
    public async Task<IActionResult> GetExpensesByGroup(int groupId)
    {
        var expenses = await _context.Expenses
            .Where(e => e.GroupId == groupId)
            .Include(e => e.User) 
            .ToListAsync();

        if (expenses.Count == 0)
        {
            return NotFound(new { message = "No expenses found for this group." });
        }

        return Ok(expenses);
    }


    //  Get All Expenses for a Specific User
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetExpensesByUser(int userId)
    {
        var expenses = await _context.Expenses
            .Where(e => e.PaidBy == userId)
            .ToListAsync();

        if (expenses.Count == 0)
        {
            return NotFound(new { message = "No expenses found for this user." });
        }

        return Ok(expenses);
    }
    [HttpGet("group/{groupId}/totalExpense")]
    public async Task<IActionResult> GetTotalExpenseForGroup(int groupId)
    {
        var expenses = await _context.Expenses
            .Where(e => e.GroupId == groupId)
            .Include(e => e.User)
            .ToListAsync();

        if (!expenses.Any())
        {
            return NotFound(new { message = "No expenses found for this group." });
        }

        decimal totalExpense = expenses.Sum(e => e.Amount);
        var members = await _context.UserGroups
            .Where(ug => ug.GroupId == groupId)
            .Include(ug => ug.User)
            .ToListAsync();

        int memberCount = members.Count;
        decimal amountPerPerson = totalExpense / memberCount;

        var results = new List<MemberExpenseDto>();
        var paymentFlows = new List<PaymentFlowDto>();

        // Calculating member expenses
        foreach (var member in members)
        {
            var totalPaidByMember = expenses.Where(e => e.PaidBy == member.UserId).Sum(e => e.Amount);
            var amountOwed = totalPaidByMember - amountPerPerson;

            var memberExpenseDto = new MemberExpenseDto
            {
                UserId = member.UserId,
                UserName = member.User.Name,
                TotalPaid = totalPaidByMember,
                AmountOwed = amountOwed
            };

            // Validate MemberExpenseDto
            var validationResults = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(memberExpenseDto, new ValidationContext(memberExpenseDto), validationResults, true);
            if (!isValid)
            {
                return BadRequest(validationResults); // Return validation errors if any
            }

            results.Add(memberExpenseDto);
        }

        // Create payment flow for each user
        var payees = results.Where(m => m.AmountOwed < 0).ToList();  // Those who need to receive money
        var payers = results.Where(m => m.AmountOwed > 0).ToList();  // Those who need to pay money

        // Generate payment flows
        foreach (var payer in payers)
        {
            foreach (var payee in payees)
            {
                decimal amountToPay = Math.Min(payer.AmountOwed, Math.Abs(payee.AmountOwed));

                if (amountToPay > 0)
                {
                    var paymentFlowDto = new PaymentFlowDto
                    {
                        Payer = payer.UserName,
                        Payee = payee.UserName,
                        Amount = amountToPay
                    };

                    // Validate PaymentFlowDto
                    var paymentFlowValidationResults = new List<ValidationResult>();
                    var isPaymentFlowValid = Validator.TryValidateObject(paymentFlowDto, new ValidationContext(paymentFlowDto), paymentFlowValidationResults, true);
                    if (!isPaymentFlowValid)
                    {
                        return BadRequest(paymentFlowValidationResults); // Return validation errors if any
                    }

                    paymentFlows.Add(paymentFlowDto);

                    // Adjust amounts after payment
                    payer.AmountOwed -= amountToPay;
                    payee.AmountOwed += amountToPay;
                }
            }
        }

        return Ok(paymentFlows);  // Return the payment flow to the frontend
    }








    [HttpGet("user/{userId}/balances")]
    public async Task<IActionResult> GetUserTotalBalance(int userId)
    {
        // Get all groups the user is part of
        var userGroups = await _context.UserGroups
            .Where(ug => ug.UserId == userId)
            .Select(ug => ug.GroupId)
            .ToListAsync();

        if (!userGroups.Any())
        {
            return NotFound(new { message = "User is not part of any groups." });
        }

        decimal totalOwed = 0; // Amount user has to pay
        decimal totalReceivable = 0; // Amount user should receive
        List<UserBalanceDto> userBalances = new List<UserBalanceDto>();

        foreach (var groupId in userGroups)
        {
            var expenses = await _context.Expenses
                .Where(e => e.GroupId == groupId)
                .ToListAsync();

            if (!expenses.Any()) continue;

            decimal totalExpense = expenses.Sum(e => e.Amount);
            var members = await _context.UserGroups
                .Where(ug => ug.GroupId == groupId)
                .ToListAsync();

            int memberCount = members.Count;
            decimal amountPerPerson = totalExpense / memberCount;

            var totalPaidByUser = expenses.Where(e => e.PaidBy == userId).Sum(e => e.Amount);
            decimal netAmount = totalPaidByUser - amountPerPerson;

            if (netAmount < 0)
            {
                totalOwed += Math.Abs(netAmount); // User owes money
            }
            else
            {
                totalReceivable += netAmount; // User should receive money
            }

            userBalances.Add(new UserBalanceDto
            {
                GroupId = groupId,
                AmountOwed = totalOwed,
                AmountReceivable = totalReceivable
            });
        }

        return Ok(new { totalOwed, totalReceivable, userBalances });
    }
}

