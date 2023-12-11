using BeautyPoly.Common;
using BeautyPoly.Data.Repositories;
using BeautyPoly.Data.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace BeautyPoly.View.Controllers
{
    public class ShopController : Controller
    {
        ProductRepo productRepo;
        public ShopController(ProductRepo productRepo)
        {
            this.productRepo = productRepo;
        }
        [Route("shop")]
        public IActionResult Index()
        {
            return View();
        }
        [HttpGet("shop/get-product")]
        public IActionResult GetProduct(string keyword, int min, int max, string listCateId)
        {
            var list = SQLHelper<ProductViewModel>.ProcedureToList("spGetProductToView", new string[] { "@Keyword", "@MinPrice", "@MaxPrice", "@ListCateID" }, new object[] { keyword, min, max, listCateId });
            return Json(list, new System.Text.Json.JsonSerializerOptions());
        }
    }
}
