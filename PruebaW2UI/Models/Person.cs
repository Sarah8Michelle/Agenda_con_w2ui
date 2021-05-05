using System;
using System.ComponentModel.DataAnnotations;

namespace PruebaW2UI.Models
{
    public class Person
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string LastName { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime DateOfBirth { get; set; }

        public string FullName { get; set; }
    }
}
