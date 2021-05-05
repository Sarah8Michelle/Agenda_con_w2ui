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
using PruebaW2UI.Models.Helpers;

namespace PruebaW2UI.Controllers
{
    public class DocumentController : Controller
    {
        private readonly PruebaW2uiDbContext _context;

        public DocumentController(PruebaW2uiDbContext context)
        {
            _context = context;
        }

        // GET: Document
        public IActionResult Index()
        {
            return View("Index");
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrEdit(string request)
        {
            dynamic response = JsonConvert.DeserializeObject(request);

            Document input = response.ToObject<Document>();

            try
            {
                if (input.Id != 0)
                {
                    var document = _context.Documents.FirstOrDefault(f => f.Id == input.Id); //.Include(i => i.DocumentType).Include(i => i.Person)

                    document.Description = input.Description;
                    document.PersonId = input.PersonId;
                    document.DocumentTypeId = input.DocumentTypeId;

                    _context.Entry(document).State = EntityState.Modified;
                    await _context.SaveChangesAsync();

                    return Json(new { status = "success" });
                }

                else
                {
                    var document = new Document
                    {
                        Description = input.Description,
                        PersonId = input.PersonId,
                        DocumentTypeId = input.DocumentTypeId
                    };

                    _context.Add(document);
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
        public async Task<IActionResult> Delete (int id)
        {
            try
            {
                var document = await _context.Documents.SingleOrDefaultAsync(s => s.Id == id);

                if (document.Id > 0)
                {
                    _context.Remove(document);
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
            var data = _context.Documents.FromSql("SELECT * FROM dbo.Documents");

            List<Document> documents = new List<Document>();            

            foreach (var document in data)
            {
                var personName = _context.People.Find(document.PersonId);
                var documentTypeDescription = _context.DocumentTypes.Find(document.DocumentTypeId);

                documents.Add(new Document { Id = document.Id, Description = document.Description, PersonId = document.PersonId, DocumentTypeId = document.DocumentTypeId, People = new Person { FullName = personName.FullName }, DocumentTypes = new DocumentType { Description = documentTypeDescription.Description } });
            }

            var output = new { status = "success", total = documents.Count, records = documents };

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

            catch(Exception ex)
            {
                throw ex;
            }
        }

        [HttpGet]
        public JsonResult DropdownDocumentType(string request)
        {
            try
            {
                dynamic response = JsonConvert.DeserializeObject(request);

                DocumentTypeSearch input = response.ToObject<DocumentTypeSearch>();

                List<W2uiItem> documentTypeList = GetDocumentTypeList(input);

                var output = new { status = "success", records = documentTypeList };

                return Json(output);
            }

            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<W2uiItem> GetPersonList (PersonSearch input)
        {
            var list = new List<W2uiItem>();

            if (!string.IsNullOrEmpty(input.Search))
            {
                return list = _context.People.Where(w => w.FullName.Contains(input.Search)).Select(s => new W2uiItem { Id = s.Id.ToString(), Text = s.FullName.ToString() }).Take(input.Max).ToList();
            }

            return list = _context.People.Select(s => new W2uiItem { Id = s.Id.ToString(), Text = s.FullName.ToString() }).Take(input.Max).ToList();
        }

        public List<W2uiItem> GetDocumentTypeList(DocumentTypeSearch input)
        {
            var list = new List<W2uiItem>();

            if (!string.IsNullOrEmpty(input.Search))
            {
                return list = _context.DocumentTypes.Where(w => w.Description.Contains(input.Search)).Select(s => new W2uiItem { Id = s.Id.ToString(), Text = s.Description.ToString() }).Take(input.Max).ToList();
            }

            return list = _context.DocumentTypes.Select(s => new W2uiItem { Id = s.Id.ToString(), Text = s.Description.ToString() }).Take(input.Max).ToList();
        }

        //var data = _context.Documents
        //        .Join(
        //        _context.People,
        //        document => document.PersonId,
        //        person => person.Id,
        //        (document, person) => new { document, person }
        //        )
        //        .Join(
        //        _context.DocumentTypes,
        //        documentWithPerson => documentWithPerson.document.DocumentTypeId,
        //        documentType => documentType.Id,
        //        (documentWithPerson, documentType) => new
        //        {
        //            documentWithPerson.document.Id,
        //            documentWithPerson.document.Description,
        //            documentWithPerson.document.PersonId,
        //            documentWithPerson.document.DocumentTypeId,
        //            FullName = documentWithPerson.person.FirstName + "" + documentWithPerson.person.LastName,
        //            DocumentTypeName = documentType.Description
        //        }
        //        )
        //        .ToList();

        // GET: Document/Details/5
        //public async Task<IActionResult> Details(int? id)
        //{
        //    if (id == null)
        //    {
        //        return NotFound();
        //    }

        //    var document = await _context.Documents
        //        .Include(d => d.DocumentType)
        //        .Include(d => d.Person)
        //        .FirstOrDefaultAsync(m => m.Id == id);
        //    if (document == null)
        //    {
        //        return NotFound();
        //    }

        //    return View(document);
        //}

        //// GET: Document/Create
        //public IActionResult Create()
        //{
        //    ViewData["DocumentTypeId"] = new SelectList(_context.DocumentTypes, "Id", "Description");
        //    ViewData["PersonId"] = new SelectList(_context.People, "Id", "FirstName");
        //    return View();
        //}

        //// POST: Document/Create
        //// To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        //// more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public async Task<IActionResult> Create([Bind("Id,PersonId,DocumentTypeId,Description")] Document document)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        _context.Add(document);
        //        await _context.SaveChangesAsync();
        //        return RedirectToAction(nameof(Index));
        //    }
        //    ViewData["DocumentTypeId"] = new SelectList(_context.DocumentTypes, "Id", "Description", document.DocumentTypeId);
        //    ViewData["PersonId"] = new SelectList(_context.People, "Id", "FirstName", document.PersonId);
        //    return View(document);
        //}

        //// GET: Document/Edit/5
        //public async Task<IActionResult> Edit(int? id)
        //{
        //    if (id == null)
        //    {
        //        return NotFound();
        //    }

        //    var document = await _context.Documents.FindAsync(id);
        //    if (document == null)
        //    {
        //        return NotFound();
        //    }
        //    ViewData["DocumentTypeId"] = new SelectList(_context.DocumentTypes, "Id", "Description", document.DocumentTypeId);
        //    ViewData["PersonId"] = new SelectList(_context.People, "Id", "FirstName", document.PersonId);
        //    return View(document);
        //}

        //// POST: Document/Edit/5
        //// To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        //// more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public async Task<IActionResult> Edit(int id, [Bind("Id,PersonId,DocumentTypeId,Description")] Document document)
        //{
        //    if (id != document.Id)
        //    {
        //        return NotFound();
        //    }

        //    if (ModelState.IsValid)
        //    {
        //        try
        //        {
        //            _context.Update(document);
        //            await _context.SaveChangesAsync();
        //        }
        //        catch (DbUpdateConcurrencyException)
        //        {
        //            if (!DocumentExists(document.Id))
        //            {
        //                return NotFound();
        //            }
        //            else
        //            {
        //                throw;
        //            }
        //        }
        //        return RedirectToAction(nameof(Index));
        //    }
        //    ViewData["DocumentTypeId"] = new SelectList(_context.DocumentTypes, "Id", "Description", document.DocumentTypeId);
        //    ViewData["PersonId"] = new SelectList(_context.People, "Id", "FirstName", document.PersonId);
        //    return View(document);
        //}

        //// GET: Document/Delete/5
        //public async Task<IActionResult> Delete(int? id)
        //{
        //    if (id == null)
        //    {
        //        return NotFound();
        //    }

        //    var document = await _context.Documents
        //        .Include(d => d.DocumentType)
        //        .Include(d => d.Person)
        //        .FirstOrDefaultAsync(m => m.Id == id);
        //    if (document == null)
        //    {
        //        return NotFound();
        //    }

        //    return View(document);
        //}

        //// POST: Document/Delete/5
        //[HttpPost, ActionName("Delete")]
        //[ValidateAntiForgeryToken]
        //public async Task<IActionResult> DeleteConfirmed(int id)
        //{
        //    var document = await _context.Documents.FindAsync(id);
        //    _context.Documents.Remove(document);
        //    await _context.SaveChangesAsync();
        //    return RedirectToAction(nameof(Index));
        //}

        //private bool DocumentExists(int id)
        //{
        //    return _context.Documents.Any(e => e.Id == id);
        //}
    }
}
