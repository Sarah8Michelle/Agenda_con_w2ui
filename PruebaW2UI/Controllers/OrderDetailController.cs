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
    public class OrderDetailController : Controller
    {
        private readonly PruebaW2uiDbContext _context;

        public OrderDetailController(PruebaW2uiDbContext context)
        {
            _context = context;
        }

        // GET: OrderDetail
        public IActionResult Index()
        {
            return View("Index");
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrEdit(string request)
        {
            dynamic response = JsonConvert.DeserializeObject(request);

            OrderDetail input = response.ToObject<OrderDetail>();

            try
            {
                if (input.Id != 0)
                {
                    var orderDetail = _context.OrderDetails.FirstOrDefault(f => f.Id == input.Id);

                    orderDetail.UnitPrice = input.UnitPrice;
                    orderDetail.Quantity = input.Quantity;
                    orderDetail.ProductId = input.ProductId;
                    orderDetail.OrderId = input.OrderId;

                    _context.Entry(orderDetail).State = EntityState.Modified;
                    await _context.SaveChangesAsync();

                    return Json(new { status = "success" });
                }

                else
                {
                    var orderDetail = new OrderDetail
                    {
                        UnitPrice = input.UnitPrice,
                        Quantity = input.Quantity,
                        ProductId = input.ProductId,
                        OrderId = input.OrderId
                    };

                    _context.Add(orderDetail);
                    await _context.SaveChangesAsync();

                    return Json(new { status = "success" });
                }
            }

            catch (Exception ex)
            {
                return Json(new { status = "error", message = $"La operación no ha podido realizarse debido a un error en el servidor. {ex}" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var orderDetail = await _context.OrderDetails.SingleOrDefaultAsync(s => s.Id == id);

                if (orderDetail.Id > 0)
                {
                    _context.Remove(orderDetail);
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
            var data = _context.OrderDetails.FromSql("SELECT * FROM dbo.OrderDetails");

            List<OrderDetail> orderDetails = new List<OrderDetail>();

            foreach (var orderDetail in data)
            {
                var productName = _context.Products.Find(orderDetail.ProductId);
                var orderCode = _context.Orders.Find(orderDetail.OrderId);

                orderDetails.Add(new OrderDetail
                {
                    Id = orderDetail.Id,
                    UnitPrice = orderDetail.UnitPrice,
                    Quantity = orderDetail.Quantity,
                    Product = new Product { Name = productName.Name },
                    Order = new Order { Code = orderCode.Code }
                });
            }

            var output = new { status = "success", total = orderDetails.Count, records = orderDetails };

            return Json(output);
        }

        [HttpGet]
        public JsonResult DropdownProduct(string request)
        {
            try
            {
                dynamic response = JsonConvert.DeserializeObject(request);

                ProductSearch input = response.ToObject<ProductSearch>();

                List<W2uiItem> productList = GetProductList(input);

                var output = new { status = "success", records = productList };

                return Json(output);
            }

            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpGet]
        public JsonResult DropdownOrder(string request)
        {
            try
            {
                dynamic response = JsonConvert.DeserializeObject(request);

                OrderSearch input = response.ToObject<OrderSearch>();

                List<W2uiItem> orderList = GetOrderList(input);

                var output = new { status = "success", records = orderList };

                return Json(output);
            }

            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<W2uiItem> GetProductList(ProductSearch input)
        {
            var list = new List<W2uiItem>();

            if (!string.IsNullOrEmpty(input.Search))
            {
                return list = _context.Products.Where(w => w.Name.Contains(input.Search)).Select(s => new W2uiItem { Id = s.Id.ToString(), Text = s.Name.ToString() }).Take(input.Max).ToList();
            }

            return list = _context.Products.Select(s => new W2uiItem { Id = s.Id.ToString(), Text = s.Name.ToString() }).Take(input.Max).ToList();
        }

        public List<W2uiItem> GetOrderList(OrderSearch input)
        {
            var list = new List<W2uiItem>();

            if (!string.IsNullOrEmpty(input.Search))
            {
                return list = _context.Orders.Where(w => w.Code.Contains(input.Search)).Select(s => new W2uiItem { Id = s.Id.ToString(), Text = s.Code.ToString() }).Take(input.Max).ToList();
            }

            return list = _context.Orders.Select(s => new W2uiItem { Id = s.Id.ToString(), Text = s.Code.ToString() }).Take(input.Max).ToList();
        }
    }
}
