using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using PruebaW2UI.Data;
using PruebaW2UI.Models;

namespace PruebaW2UI.Controllers
{
    public class ProductController : Controller
    {
        private readonly PruebaW2uiDbContext _context;

        public ProductController(PruebaW2uiDbContext context)
        {
            _context = context;
        }

        // GET: Product
        public IActionResult Index()
        {
            return View("Index");
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrEdit(string request)
        {
            dynamic response = JsonConvert.DeserializeObject(request);

            Product input = response.ToObject<Product>();

            try
            {
                if (input.Id != 0)
                {
                    var product = _context.Products.FirstOrDefault(f => f.Id == input.Id);

                    product.Name = input.Name;
                    product.Category = input.Category;
                    product.QuantityPerUnit = input.QuantityPerUnit;
                    product.UnitPrice = input.UnitPrice;
                    product.UnitsInStock = input.UnitsInStock;
                    product.UnitsInOrder = input.UnitsInOrder;
                    product.Discontinued = input.Discontinued;

                    _context.Entry(product).State = EntityState.Modified;
                    await _context.SaveChangesAsync();

                    return Json(new { status = "success" });
                }

                else
                {
                    var product = new Product
                    {
                        Name = input.Name,
                        Category = input.Category,
                        QuantityPerUnit = input.QuantityPerUnit,
                        UnitPrice = input.UnitPrice,
                        UnitsInStock = input.UnitsInStock,
                        UnitsInOrder = input.UnitsInOrder,
                        Discontinued = input.Discontinued
                    };

                    _context.Add(product);
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
                var product = await _context.Products.SingleOrDefaultAsync(s => s.Id == id);

                if (product.Id > 0)
                {
                    _context.Remove(product);
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
            var data = _context.Products.FromSql("SELECT * FROM dbo.Products");

            List<Product> products = new List<Product>();

            foreach (var product in data)
            {
                products.Add(new Product {
                    Id = product.Id,
                    Name = product.Name,
                    Category = product.Category,
                    QuantityPerUnit = product.QuantityPerUnit,
                    UnitPrice = product.UnitPrice,
                    UnitsInStock = product.UnitsInStock,
                    UnitsInOrder = product.UnitsInOrder,
                    Discontinued = product.Discontinued
                });
            }

            var output = new { status = "success", total = products.Count, records = products };

            return Json(output);
        }
    }
}
