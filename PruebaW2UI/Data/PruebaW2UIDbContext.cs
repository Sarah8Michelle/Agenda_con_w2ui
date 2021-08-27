using Microsoft.EntityFrameworkCore;
using PruebaW2UI.Models;

namespace PruebaW2UI.Data
{
    public class PruebaW2uiDbContext : DbContext
    {
        public PruebaW2uiDbContext(DbContextOptions<PruebaW2uiDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Person> People { get; set; }

        public virtual DbSet<DocumentType> DocumentTypes { get; set; }

        public virtual DbSet<Document> Documents { get; set; }

        public virtual DbSet<Product> Products { get; set; }

        public virtual DbSet<Order> Orders { get; set; }

        public virtual DbSet<OrderDetail> OrderDetails { get; set; }
    }
}
