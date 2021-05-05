using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using PruebaW2UI.Data;
using PruebaW2UI.Models;

namespace PruebaW2UI.Controllers
{
    public class PersonController : Controller
    {
        private readonly PruebaW2uiDbContext _context;

        public PersonController(PruebaW2uiDbContext context)
        {
            _context = context;
        }

        // GET: Person
        public IActionResult Index()
        {
            return View("Index");
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrEdit (string request)
        {
            dynamic response = JsonConvert.DeserializeObject(request);

            Person input = response.ToObject<Person>();

            try
            {                
                if (input.Id != 0)
                {
                    var people = _context.People.FirstOrDefault(f => f.Id == input.Id);

                    people.FirstName = input.FirstName;
                    people.LastName = input.LastName;
                    people.FullName = input.FullName;
                    people.DateOfBirth = input.DateOfBirth;

                    _context.Entry(people).State = EntityState.Modified;
                    await _context.SaveChangesAsync();

                    return Json(new { status = "success" });
                }

                else
                {
                    var person = new Person
                    {
                        FirstName = input.FirstName,
                        LastName = input.LastName,
                        FullName = input.FullName,
                        DateOfBirth = input.DateOfBirth
                    };

                    _context.Add(person);
                    await _context.SaveChangesAsync();

                    return Json(new { status = "success" });
                }                
            }

            catch
            {
                return Json(new { status = "error", message = "La operación no ha podido realizarse debido a un error en el servidor." });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var person = await _context.People.SingleOrDefaultAsync(s => s.Id == id);

                if (person.Id > 0)
                {                    
                    _context.Remove(person);
                    await _context.SaveChangesAsync();

                    return Json(new { status = "success" });
                }

                return Json(new { status = "error", message = "Valores enviados no válidos." });
            }

            catch(Exception ex)
            {
                return Json(new { status = "error", message = $"Ha ocurrido un error al realizar la operación. {ex}" });
            }
        }

        [HttpGet]
        public JsonResult GetAllRecords ()
        {
            var data = _context.People.FromSql("SELECT * FROM dbo.People");

            List<Person> people = new List<Person>();

            foreach (var person in data)
            {
                people.Add(new Person { Id = person.Id, FirstName = person.FirstName, LastName = person.LastName, DateOfBirth = person.DateOfBirth });
            }

            var output = new { status = "success", total = people.Count, records = people };

            return Json(output);
        }
    }
}
