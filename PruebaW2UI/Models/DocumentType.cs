using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

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
