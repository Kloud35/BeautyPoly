using BeautyPoly.Common;
using BeautyPoly.Data.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace BeautyPoly.View.Controllers
{
    public class ProductDetailsController : Controller
    {
        [Route("product-detail/{id}")]
        public IActionResult Index(int id)
        {
            var model = SQLHelper<ProductViewModel>.ProcedureToModel("spGetProductToView", new string[] { "@ProductID" }, new object[] { id });
            return View(model);
        }
    }
}
