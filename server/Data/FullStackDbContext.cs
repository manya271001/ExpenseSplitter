using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Data
{
    public class FullStackDbContext : DbContext
    {
        public FullStackDbContext(DbContextOptions<FullStackDbContext> options) : base(options)
        {
        }

        // Existing DbSets
        public DbSet<NewUser> NewUsers { get; set; }
        public DbSet<UserGroup> UserGroups { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Invitation> Invitations { get; set; }
        public DbSet<Expense> Expenses { get; set; }
        public DbSet<Settlement> Settlements { get; set; }
        public DbSet<PaymentFlow> PaymentFlows { get; set; }

        // New DbSet for UserBalance
        public DbSet<UserBalance> UserBalances { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Existing relationships
            modelBuilder.Entity<UserGroup>()
                .HasKey(ug => new { ug.UserId, ug.GroupId });

            // Invitation relationships
            modelBuilder.Entity<Invitation>()
                .HasOne(i => i.Group)
                .WithMany(g => g.Invitations)
                .HasForeignKey(i => i.GroupId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Invitation>()
                .HasOne(i => i.User)
                .WithMany(u => u.Invitations)
                .HasForeignKey(i => i.InvitedUserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Expense relationships
            modelBuilder.Entity<Expense>()
                .HasOne(e => e.Group)
                .WithMany(g => g.Expenses)
                .HasForeignKey(e => e.GroupId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Expense>()
                .HasOne(e => e.User)
                .WithMany(u => u.Expenses)
                .HasForeignKey(e => e.PaidBy)
                .OnDelete(DeleteBehavior.Restrict); // Prevents user deletion from removing expenses

            // Settlement relationships
            modelBuilder.Entity<Settlement>()
                .HasOne(s => s.Group)
                .WithMany(g => g.Settlements)
                .HasForeignKey(s => s.GroupId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Settlement>()
                .HasMany(s => s.PaymentFlows)
                .WithOne(pf => pf.Settlement)
                .HasForeignKey(pf => pf.SettlementId)
                .OnDelete(DeleteBehavior.Cascade);

            // PaymentFlow relationships
            modelBuilder.Entity<PaymentFlow>()
                .HasOne(pf => pf.Payer)
                .WithMany(u => u.PaidPaymentFlows)
                .HasForeignKey(pf => pf.PayerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PaymentFlow>()
                .HasOne(pf => pf.Payee)
                .WithMany(u => u.ReceivedPaymentFlows)
                .HasForeignKey(pf => pf.PayeeId)
                .OnDelete(DeleteBehavior.Restrict);

            // UserBalance relationship (One-to-One with NewUser)
            modelBuilder.Entity<UserBalance>()
                .HasOne(ub => ub.User)
                .WithOne(u => u.Balance)
                .HasForeignKey<UserBalance>(ub => ub.UserId)
                .OnDelete(DeleteBehavior.Cascade); // If user is deleted, their balance record is also deleted
        }
    }
}
