using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using PruebaW2UI.Data;
using PruebaW2UI.Models;
using PruebaW2UI.Models.Helpers;

namespace PruebaW2UI.Controllers
{
    public class OrderController : Controller
    {
        private readonly PruebaW2uiDbContext _context;

        public OrderController(PruebaW2uiDbContext context)
        {
            _context = context;
        }

        // GET: Order
        public IActionResult Index()
        {
            return View("Index");
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrEdit(string request)
        {
            dynamic response = JsonConvert.DeserializeObject(request);

            Order input = response.ToObject<Order>();

            try
            {
                if (input.Id != 0)
                {
                    var order = _context.Orders.FirstOrDefault(f => f.Id == input.Id);

                    order.Code = input.Code;
                    order.OrderDate = input.OrderDate;
                    order.ArrivalDate = input.ArrivalDate;
                    order.ShipCompany = input.ShipCompany;
                    order.ShipAddress = input.ShipAddress;
                    order.ShipCity = input.ShipCity;
                    order.ShipRegion = input.ShipRegion;
                    order.ShipPostalCode = input.ShipPostalCode;
                    order.ShipCountry = input.ShipCountry;
                    order.PersonId = input.PersonId;

                    _context.Entry(order).State = EntityState.Modified;
                    await _context.SaveChangesAsync();

                    return Json(new { status = "success" });
                }

                else
                {
                    var order = new Order
                    {
                        Code = input.Code,
                        OrderDate = input.OrderDate,
                        ArrivalDate = input.ArrivalDate,
                        ShipCompany = input.ShipCompany,
                        ShipAddress = input.ShipAddress,
                        ShipCity = input.ShipCity,
                        ShipRegion = input.ShipRegion,
                        ShipPostalCode = input.ShipPostalCode,
                        ShipCountry = input.ShipCountry,
                        PersonId = input.PersonId
                    };

                    _context.Add(order);
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
                var order = await _context.Orders.SingleOrDefaultAsync(s => s.Id == id);

                if (order.Id > 0)
                {
                    _context.Remove(order);
                    await _context.SaveChangesAsync();

                    return Json(new { status = "success" });
                }

                return Json(new { status = "error", message = "Valores enviados no válidos." });
            }

            catch (Exception ex)
            {
                return Json(new { status = "error", message = $"Ha ocurrido un error al realizar la operación. {ex}" });
            }
        }

        [HttpGet]
        public JsonResult GetAllRecords()
        {
            var data = _context.Orders.FromSql("SELECT * FROM dbo.Orders");

            List<Order> orders = new List<Order>();

            foreach (var order in data)
            {
                var personName = _context.People.Find(order.PersonId);

                orders.Add(new Order
                {
                    Id = order.Id,
                    Code = order.Code,
                    OrderDate = order.OrderDate,
                    ArrivalDate = order.ArrivalDate,
                    ShipCompany = order.ShipCompany,
                    ShipAddress = order.ShipAddress,
                    ShipCity = order.ShipCity,
                    ShipRegion = order.ShipRegion,
                    ShipPostalCode = order.ShipPostalCode,
                    ShipCountry = order.ShipCountry,
                    Person = new Person { FullName = personName.FullName }
                });
            }

            var output = new { status = "success", total = orders.Count, records = orders };

            return Json(output);
        }

        [HttpGet]
        public JsonResult DropdownPerson(string request)
        {
            try
            {
                dynamic response = JsonConvert.DeserializeObject(request);

                PersonSearch input = response.ToObject<PersonSearch>();

                List<W2uiItem> personList = GetPersonList(input);

                var output = new { status = "success", records = personList };

                return Json(output);
            }

            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<W2uiItem> GetPersonList(PersonSearch input)
        {
            var list = new List<W2uiItem>();

            if (!string.IsNullOrEmpty(input.Search))
            {
                return list = _context.People.Where(w => w.FullName.Contains(input.Search)).Select(s => new W2uiItem { Id = s.Id.ToString(), Text = s.FullName.ToString() }).Take(input.Max).ToList();
            }

            return list = _context.People.Select(s => new W2uiItem { Id = s.Id.ToString(), Text = s.FullName.ToString() }).Take(input.Max).ToList();
        }
    }
}
