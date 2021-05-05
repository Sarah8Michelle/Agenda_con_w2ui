using System.ComponentModel.DataAnnotations;

namespace PruebaW2UI.Models
{
    public class DocumentType
    {
        public int Id { get; set; }

        [Required]
        [StringLength(256)]
        public string Description { get; set; }
    }
}
