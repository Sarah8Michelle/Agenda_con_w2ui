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
    public class DocumentTypeController : Controller
    {
        private readonly PruebaW2uiDbContext _context;

        public DocumentTypeController(PruebaW2uiDbContext context)
        {
            _context = context;
        }

        // GET: DocumentType
        public IActionResult Index()
        {
            return View("Index");
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrEdit (string request)
        {
            dynamic response = JsonConvert.DeserializeObject(request);

            DocumentType input = response.ToObject<DocumentType>();

            try
            {
                if (input.Id != 0)
                {
                    await EditDocumentType(input);

                    return Json(new { status = "success" });
                }

                else
                {
                    await CreateDocumentType(input);

                    return Json(new { status = "success" });
                }
            }

            catch
            {
                return Json(new { status = "error", message = "La operación no ha podido realizarse debido a un error en el servidor." });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Delete (int id)
        {
            try
            {
                var documentType = await _context.DocumentTypes.SingleOrDefaultAsync(s => s.Id == id);

                if (documentType.Id > 0)
                {
                    _context.Remove(documentType);
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
        public JsonResult GetAllRecords ()
        {
            var data = _context.DocumentTypes.FromSql("SELECT * FROM dbo.DocumentTypes");

            List<DocumentType> documentTypes = new List<DocumentType>();

            foreach (var documentType in data)
            {
                documentTypes.Add(new DocumentType { Id = documentType.Id, Description = documentType.Description });
            }

            var output = new { status = "success", total = documentTypes.Count, records = documentTypes };

            return Json(output);
        }

        protected async Task CreateDocumentType(DocumentType input)
        {
            var documentType = new DocumentType
            {
                Description = input.Description
            };

            _context.Add(documentType);
            await _context.SaveChangesAsync();
        }

        protected async Task EditDocumentType(DocumentType input)
        {
            var documentType = _context.DocumentTypes.FirstOrDefault(f => f.Id == input.Id);

            documentType.Description = input.Description;

            _context.Entry(documentType).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
    }
}
