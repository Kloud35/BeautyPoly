using BeautyPoly.Common;
using BeautyPoly.Data.Models.DTO;
using BeautyPoly.Data.Repositories;
using BeautyPoly.Data.ViewModels;
using BeautyPoly.Models;
using BeautyPoly.View.Helper;
using Microsoft.AspNetCore.Mvc;

namespace BeautyPoly.View.Controllers
{
    public class CartController : Controller
    {
        ProductSkuRepo productSkuRepo;

        CartDetailsRepo cartDetailsRepo;
        public CartController(ProductSkuRepo productSkuRepo, CartDetailsRepo cartDetailsRepo)
        {
            this.productSkuRepo = productSkuRepo;
            this.cartDetailsRepo = cartDetailsRepo;
        }

        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> AddToCart([FromBody] ProductSkusDTO model)
        {
            var customerID = HttpContext.Session.GetInt32("CustommerID");
            if (customerID == null)
            {
                var list = HttpContext.Session.GetObject<List<CartDetails>>("CartDetail");
                var productSku = await productSkuRepo.GetByIdAsync(model.ID);
                CartDetails cartDetails = new CartDetails();
                cartDetails = list.FirstOrDefault(p => p.ProductSkusID == model.ID);
                if (cartDetails != null)
                {
                    list.Remove(cartDetails);
                    cartDetails.ProductSkusID = model.ID;
                    cartDetails.Quantity = model.Quantity + cartDetails.Quantity;
                }
                else
                {
                    cartDetails = new CartDetails();
                    cartDetails.ProductSkusID = model.ID;
                    cartDetails.Quantity = model.Quantity;
                }
                if (cartDetails.Quantity > productSku.Quantity)
                {
                    cartDetails.Quantity = productSku.Quantity;
                }
                list.Add(cartDetails);
                HttpContext.Session.SetObject<List<CartDetails>>("CartDetail", list);
            }
            else
            {
                var list = cartDetailsRepo.FindAsync(p => p.CartID == customerID).Result.ToList();

                var productSku = await productSkuRepo.GetByIdAsync(model.ID);
                CartDetails cartDetails = new CartDetails();
                if (list != null)
                {
                    cartDetails = list.FirstOrDefault(p => p.ProductSkusID == model.ID);
                    if (cartDetails != null)
                    {
                        cartDetails.ProductSkusID = model.ID;
                        cartDetails.Quantity = model.Quantity + cartDetails.Quantity;
                        if (cartDetails.Quantity > productSku.Quantity)
                        {
                            cartDetails.Quantity = productSku.Quantity;
                        }

                        await cartDetailsRepo.UpdateAsync(cartDetails);
                    }
                    else
                    {
                        cartDetails = new CartDetails();
                        cartDetails.ProductSkusID = model.ID;
                        cartDetails.Quantity = model.Quantity;
                        cartDetails.CartID = customerID;
                        if (cartDetails.Quantity > productSku.Quantity)
                        {
                            cartDetails.Quantity = productSku.Quantity;
                        }
                        await cartDetailsRepo.InsertAsync(cartDetails);
                    }
                }
                else
                {
                    cartDetails = new CartDetails();
                    cartDetails.ProductSkusID = model.ID;
                    cartDetails.Quantity = model.Quantity;
                    cartDetails.CartID = customerID;
                    await cartDetailsRepo.InsertAsync(cartDetails);
                }
            }
            return Json(1);
        }

        public IActionResult GetProductInCart()
        {
            var customerID = HttpContext.Session.GetInt32("CustommerID");
            var listCart = new List<CartDetails>();
            if (customerID == null)
            {
                listCart = HttpContext.Session.GetObject<List<CartDetails>>("CartDetail");
            }
            else
            {
                listCart = cartDetailsRepo.FindAsync(p => p.CartID == customerID).Result.ToList();
            }
            List<ProductSkusViewModel> listSkuCart = new List<ProductSkusViewModel>();

            foreach (var item in listCart)
            {
                var model = SQLHelper<ProductSkusViewModel>.ProcedureToModel("spGetProductToCart", new string[] { "@SkuID", "@Quantity" }, new object[] { item.ProductSkusID, item.Quantity });
                listSkuCart.Add(model);
            }

            return Json(listSkuCart, new System.Text.Json.JsonSerializerOptions());
        }
    }
}
