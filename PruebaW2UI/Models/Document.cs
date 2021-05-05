using PruebaW2UI.Models.Helpers;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PruebaW2UI.Models
{
    public class Document
    {
        public int Id { get; set; }

        public int PersonId { get; set; }

        public int DocumentTypeId { get; set; }

        [Required]
        [StringLength(256)]
        public string Description { get; set; }

        [ForeignKey("PersonId")]
        public virtual Person People { get; set; }

        [ForeignKey("DocumentTypeId")]
        public virtual DocumentType DocumentTypes { get; set; }
    }

    public class PersonSearch : W2uiSearch
    {
        public int? PersonId { get; set; }
    }

    public class DocumentTypeSearch : W2uiSearch
    {
        public int? DocumentTypeId { get; set; }
    }
}
