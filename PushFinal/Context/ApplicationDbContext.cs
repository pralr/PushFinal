using Microsoft.EntityFrameworkCore;
using PushFinal.Models;
using WebPush;

namespace PushFinal.Context
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
        public DbSet<Subscription> Subscriptions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Subscription>().HasKey(p => p.UserId);
        }
    }
}
