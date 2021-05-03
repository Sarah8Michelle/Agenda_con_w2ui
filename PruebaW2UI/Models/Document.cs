using PruebaW2UI.Models.Helpers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

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
        public virtual Person Person { get; set; }

        [ForeignKey("DocumentTypeId")]
        public virtual DocumentType DocumentType { get; set; }

        //public string Person_FullName { get { return Person.FirstName + " " + Person.LastName; } }

        //public string DocumentType_Description { get { return DocumentType.Description; } }
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
