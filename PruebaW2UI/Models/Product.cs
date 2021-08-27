using System.ComponentModel.DataAnnotations;

namespace PruebaW2UI.Models
{
    public class Product
    {
        public int Id { get; set; }

        [Required]
        [StringLength(128, MinimumLength = 3)]
        public string Name { get; set; }

        [Required]
        [StringLength(128, MinimumLength = 3)]
        public string Category { get; set; }

        public string QuantityPerUnit { get; set; }

        public decimal UnitPrice { get; set; }

        public int UnitsInStock { get; set; }

        public int UnitsInOrder { get; set; }

        public bool Discontinued { get; set; }
    }
}
