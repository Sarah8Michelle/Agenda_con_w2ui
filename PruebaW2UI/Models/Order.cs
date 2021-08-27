using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PruebaW2UI.Models
{
    public class Order
    {
        public int Id { get; set; }

        public int PersonId { get; set; }

        [Required]
        [StringLength(56)]
        public string Code { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime OrderDate { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime ArrivalDate { get; set; }

        [Required]
        [StringLength(128, MinimumLength = 3)]
        public string ShipCompany { get; set; }

        [StringLength(256, MinimumLength = 3)]
        public string ShipAddress { get; set; }

        [StringLength(128, MinimumLength = 3)]
        public string ShipCity { get; set; }

        [StringLength(128, MinimumLength = 3)]
        public string ShipRegion { get; set; }

        [StringLength(10, MinimumLength = 3)]
        public string ShipPostalCode { get; set; }

        [StringLength(60, MinimumLength = 4)]
        public string ShipCountry { get; set; }

        [ForeignKey("PersonId")]
        public virtual Person Person { get; set; }
    }
}
