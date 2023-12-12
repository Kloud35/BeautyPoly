using BeautyPoly.Common;
using BeautyPoly.Data.Models.DTO;
using BeautyPoly.Data.Repositories;
using BeautyPoly.Data.ViewModels;
using BeautyPoly.Helper;
using BeautyPoly.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Text.Json;
namespace BeautyPoly.View.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class ProductController : Controller
    {
        OptionRepo optionRepo;
        CategoryRepo categoryRepo;
        OptionValueRepo optionValueRepo;
        ProductRepo productRepo;
        ProductSkuRepo productSkuRepo;
        ProductDetailRepo productDetailRepo;
        OptionDetailRepo optionDetailRepo;
        ProductImagesRepo productImagesRepo;

        public ProductController(OptionRepo optionRepo, CategoryRepo categoryRepo, OptionValueRepo optionValueRepo, ProductRepo productRepo, ProductSkuRepo productSkuRepo, ProductDetailRepo productDetailRepo, OptionDetailRepo optionDetailRepo, ProductImagesRepo productImagesRepo)
        {
            this.optionRepo = optionRepo;
            this.categoryRepo = categoryRepo;
            this.optionValueRepo = optionValueRepo;
            this.productRepo = productRepo;
            this.productSkuRepo = productSkuRepo;
            this.productDetailRepo = productDetailRepo;
            this.optionDetailRepo = optionDetailRepo;
            this.productImagesRepo = productImagesRepo;
        }

        [Route("admin/product")]
        public async Task<IActionResult> IndexAsync()
        {
            if (HttpContext.Session.GetString("AccountID") == null)
                return RedirectToRoute("Login");
            var listCate = await categoryRepo.GetAllAsync();
            List<SelectListItem> list = new List<SelectListItem>();
            list = listCate.Select(cate => new SelectListItem
            {
                Text = cate.CateName,
                Value = cate.CateId.ToString()
            }).ToList();
            list.Insert(0, new SelectListItem("Chọn danh mục", "0"));
            ViewBag.Category = list;
            return View();
        }
        [HttpPost("admin/product/create")]
        public async Task<IActionResult> AddProduct([FromBody] ProductDTO productDTO)
        {
            try
            {
                Product product = new Product();
                if (productDTO.ID > 0)
                {
                    product = await productRepo.GetByIdAsync(productDTO.ID);
                    product.ProductName = productDTO.ProductName;
                    product.ProductCode = productDTO.ProductCode;
                    product.CateID = productDTO.CateID;
                    await productRepo.UpdateAsync(product);

                    await productImagesRepo.DeleteRangeAsync(await productImagesRepo.FindAsync(p => p.ProductID == product.ProductID));

                    for (int i = 0; i < productDTO.Images.Count; i++)
                    {
                        string fileName = product.ProductCode + "_" + i + ".png";
                        Utilities.ConvertAndSaveImage(productDTO.Images[i], fileName);
                        ProductImages productImages = new ProductImages();
                        productImages.ProductID = product.ProductID;
                        productImages.Image = fileName;
                        productImages.IsDefault = false;
                        if (i == 0)
                        {
                            productImages.IsDefault = true;
                        }
                        await productImagesRepo.InsertAsync(productImages);
                    }
                }
                else
                {
                    product.ProductName = productDTO.ProductName;
                    product.ProductCode = productDTO.ProductCode;
                    product.CateID = productDTO.CateID;
                    await productRepo.InsertAsync(product);

                    await productImagesRepo.DeleteRangeAsync(await productImagesRepo.FindAsync(p => p.ProductID == product.ProductID));

                    for (int i = 0; i < productDTO.Images.Count; i++)
                    {
                        string fileName = product.ProductCode + "_" + i + ".png";
                        Utilities.ConvertAndSaveImage(productDTO.Images[i], fileName);
                        ProductImages productImages = new ProductImages();
                        productImages.ProductID = product.ProductID;
                        productImages.Image = fileName;
                        productImages.IsDefault = false;
                        if (i == 0)
                        {
                            productImages.IsDefault = true;
                        }
                        await productImagesRepo.InsertAsync(productImages);
                    }
                }
                return Json(1);
            }
            catch (Exception ex)
            {

                return Json(ex);
            }

        }
        [HttpGet("admin/product/get-product-by-id")]
        public async Task<IActionResult> GetProductById(int ID)
        {
            Product product = await productRepo.GetByIdAsync(ID);
            return Json(product, new JsonSerializerOptions());
        }
        [HttpGet("admin/product/get-product-image")]
        public async Task<IActionResult> GetProductImages(int productID)
        {
            return Json(await productImagesRepo.FindAsync(p => p.ProductID == productID), new JsonSerializerOptions());
        }

        [HttpPost("admin/product/update-sku")]
        public async Task<IActionResult> UpdateProductSku([FromBody] ProductSkuEditDTO productSkuDTO)
        {

            var optionDetails = await optionDetailRepo.FindAsync(p => p.ProductID == productSkuDTO.ProductID);
            if (optionDetails.Count() > productSkuDTO.ListOptionID.Count())
            {
                var product = await productRepo.GetByIdAsync(productSkuDTO.ProductID);

            }
            else if (optionDetails.Count() < productSkuDTO.ListOptionID.Count())
            {
                var product = await productRepo.GetByIdAsync(productSkuDTO.ProductID);
                List<int> defferentID = productSkuDTO.ListOptionID.Where(id => !optionDetails.Any(opt => opt.OptionID == id)).ToList();

                if (productSkuDTO.ListOptionID.Count() - defferentID.Count() == optionDetails.Count())
                {

                    for (int i = 0; i < defferentID.Count(); i++)
                    {
                        OptionDetails optionD = new OptionDetails();
                        optionD.OptionID = defferentID[1];
                        optionD.ProductID = product.ProductID;
                        await optionDetailRepo.InsertAsync(optionD);
                    }


                    string[] stringID = productSkuDTO.OptionValueID.Split('-');
                    string sku = product.ProductCode;
                    for (int i = 0; i < stringID.Length; i++)
                    {
                        var resultValue = await optionValueRepo.GetByIdAsync(TextUtils.ToInt(stringID[i].Trim()));
                        if (resultValue != null)
                        {
                            var resultOption = await optionRepo.GetByIdAsync((int)resultValue.OptionID);
                            sku += TextUtils.ToString(resultOption.OptionName[0]).ToUpper();
                            var values = resultValue.OptionValueName.Trim().Split(' ');
                            foreach (var value in values)
                            {
                                sku += TextUtils.ToString(value[0]).ToUpper();
                            }
                        }
                    }
                    ProductSkus productSkus = await productSkuRepo.GetByIdAsync(productSkuDTO.ID);
                    productSkus.Sku = sku;
                    productSkus.CapitalPrice = productSkuDTO.CapitalPrice;
                    productSkus.Price = productSkuDTO.Price;
                    productSkus.Quantity = productSkuDTO.Quantity;
                    await productSkuRepo.UpdateAsync(productSkus);
                    for (int i = 0; i < stringID.Length; i++)
                    {
                        var resultValue = await optionValueRepo.GetByIdAsync(TextUtils.ToInt(stringID[i].Trim()));
                        if (resultValue != null)
                        {
                            await productDetailRepo.DeleteRangeAsync(await productDetailRepo.FindAsync(p => p.ProductSkusID == productSkus.ProductSkusID));
                            ProductDetails productDetails = new ProductDetails();
                            productDetails.OptionValueID = resultValue.OptionValueID;
                            var resultOptionDetail = optionDetailRepo.FindAsync(p => p.ProductID == product.ProductID && p.OptionID == resultValue.OptionID).Result.FirstOrDefault();
                            productDetails.OptionDetailsID = resultOptionDetail.OptionDetailsID;
                            productDetails.ProductSkusID = productSkus.ProductSkusID;
                            await productDetailRepo.InsertAsync(productDetails);
                        }
                    }
                }
                else
                {

                }
            }
            else
            {
                bool checkSameValue = productSkuDTO.ListOptionID.All(optionID => optionDetails.Any(p => p.OptionID == optionID));
                if (checkSameValue)
                {
                    var product = await productRepo.GetByIdAsync(productSkuDTO.ProductID);

                    string[] stringID = productSkuDTO.OptionValueID.Split('-');
                    string sku = product.ProductCode;
                    for (int i = 0; i < stringID.Length; i++)
                    {
                        var resultValue = await optionValueRepo.GetByIdAsync(TextUtils.ToInt(stringID[i].Trim()));
                        if (resultValue != null)
                        {
                            var resultOption = await optionRepo.GetByIdAsync((int)resultValue.OptionID);
                            sku += TextUtils.ToString(resultOption.OptionName[0]).ToUpper();
                            var values = resultValue.OptionValueName.Trim().Split(' ');
                            foreach (var value in values)
                            {
                                sku += TextUtils.ToString(value[0]).ToUpper();
                            }
                        }
                    }
                    ProductSkus productSkus = await productSkuRepo.GetByIdAsync(productSkuDTO.ID);
                    productSkus.Sku = sku;
                    productSkus.CapitalPrice = productSkuDTO.CapitalPrice;
                    productSkus.Price = productSkuDTO.Price;
                    productSkus.Quantity = productSkuDTO.Quantity;
                    await productSkuRepo.UpdateAsync(productSkus);
                    for (int i = 0; i < stringID.Length; i++)
                    {
                        var resultValue = await optionValueRepo.GetByIdAsync(TextUtils.ToInt(stringID[i].Trim()));
                        if (resultValue != null)
                        {
                            await productDetailRepo.DeleteRangeAsync(await productDetailRepo.FindAsync(p => p.ProductSkusID == productSkus.ProductSkusID));
                            ProductDetails productDetails = new ProductDetails();
                            productDetails.OptionValueID = resultValue.OptionValueID;
                            var resultOptionDetail = optionDetailRepo.FindAsync(p => p.ProductID == product.ProductID && p.OptionID == resultValue.OptionID).Result.FirstOrDefault();
                            productDetails.OptionDetailsID = resultOptionDetail.OptionDetailsID;
                            productDetails.ProductSkusID = productSkus.ProductSkusID;
                            await productDetailRepo.InsertAsync(productDetails);
                        }
                    }
                }
                else
                {

                }
            }
            return Json(1);
        }

        [HttpPost("admin/product/create-sku")]
        public async Task<IActionResult> AddProductSku([FromBody] ProductSkuDetailDTO productSkuDTO)
        {
            try
            {
                var product = await productRepo.GetByIdAsync(productSkuDTO.ProductID);
                foreach (int id in productSkuDTO.ListOptionID)
                {
                    OptionDetails optionDetails = new OptionDetails();
                    optionDetails.OptionID = id;
                    optionDetails.ProductID = productSkuDTO.ProductID;
                    await optionDetailRepo.InsertAsync(optionDetails);
                }
                foreach (var s in productSkuDTO.ListSku)
                {
                    string[] stringID = s.OptionValueID.Split('-');
                    string sku = product.ProductCode;
                    for (int i = 0; i < stringID.Length; i++)
                    {
                        var resultValue = await optionValueRepo.GetByIdAsync(TextUtils.ToInt(stringID[i].Trim()));
                        if (resultValue != null)
                        {
                            var resultOption = await optionRepo.GetByIdAsync((int)resultValue.OptionID);
                            sku += TextUtils.ToString(resultOption.OptionName[0]).ToUpper();
                            var values = resultValue.OptionValueName.Trim().Split(' ');
                            foreach (var value in values)
                            {
                                sku += TextUtils.ToString(value[0]).ToUpper();
                            }
                        }
                    }
                    ProductSkus productSkus = new ProductSkus();
                    productSkus.ProductID = product.ProductID;
                    productSkus.Sku = sku;
                    productSkus.CapitalPrice = s.CapitalPrice;
                    productSkus.Price = s.Price;
                    productSkus.Quantity = s.Quantity;
                    await productSkuRepo.InsertAsync(productSkus);
                    for (int i = 0; i < stringID.Length; i++)
                    {
                        var resultValue = await optionValueRepo.GetByIdAsync(TextUtils.ToInt(stringID[i].Trim()));
                        if (resultValue != null)
                        {
                            ProductDetails productDetails = new ProductDetails();
                            productDetails.OptionValueID = resultValue.OptionValueID;
                            var resultOptionDetail = optionDetailRepo.FindAsync(p => p.ProductID == product.ProductID && p.OptionID == resultValue.OptionID).Result.FirstOrDefault();
                            productDetails.OptionDetailsID = resultOptionDetail.OptionDetailsID;
                            productDetails.ProductSkusID = productSkus.ProductSkusID;
                            await productDetailRepo.InsertAsync(productDetails);
                        }
                    }
                }
                return Json(1);
            }
            catch (Exception ex)
            {
                return Json(ex);
            }
        }
        [HttpGet("admin/product/get-option")]
        public async Task<IActionResult> GetOption()
        {
            var result = await optionRepo.GetAllAsync();
            return Json(result.Where(p => p.IsDelete == false || p.IsDelete == null).ToList(), new System.Text.Json.JsonSerializerOptions());
        }
        [HttpGet("admin/product/get-option-value")]
        public async Task<IActionResult> GetAllOptionValues()
        {
            var result = await optionValueRepo.GetAllAsync();
            return Json(result.Where(p => p.IsDelete == false || p.IsDelete == null).ToList(), new JsonSerializerOptions());
        }
        [HttpGet("admin/product/get-product")]
        public IActionResult GetAllProduct()
        {
            var result = SQLHelper<ProductViewModel>.ProcedureToList("spGetProduct", new string[] { }, new object[] { });
            return Json(result, new System.Text.Json.JsonSerializerOptions());
        }
        [HttpDelete("admin/product/delete-product")]
        public async Task<IActionResult> DeleteProduct(int productID)
        {
            try
            {
                var check = await productSkuRepo.FindAsync(p => p.ProductID == productID);
                if (check.Count() > 0)
                {
                    return Json("Không thể xóa sản phẩm!");
                }
                await productImagesRepo.DeleteRangeAsync(await productImagesRepo.FindAsync(p => p.ProductID == productID));
                await productRepo.DeleteAsync(await productRepo.GetByIdAsync(productID));
                return Json(1);
            }
            catch (Exception ex)
            {
                return Json(ex);
            }
        }
        [HttpGet("admin/product/get-product-sku")]
        public IActionResult GetProdutcSku()
        {
            List<ProductSkusViewModel> list = SQLHelper<ProductSkusViewModel>.ProcedureToList("spGetProductSku", new string[] { }, new object[] { });
            return Json(list, new JsonSerializerOptions());
        }
        [HttpGet("admin/product/get-product-sku-by-id")]
        public async Task<IActionResult> GetProductSkuByID(int productSkuID)
        {
            return Json(await productSkuRepo.GetByIdAsync(productSkuID), new JsonSerializerOptions());
        }

        [HttpGet("admin/product/get-product-detail")]
        public async Task<IActionResult> GetProductDetailByProductSkuID(int productSkuID, int productID)
        {
            var productDetails = await productDetailRepo.FindAsync(p => p.ProductSkusID == productSkuID);
            List<OptionDetailViewModel> optionDetails = SQLHelper<OptionDetailViewModel>.ProcedureToList("spGetOptionDetail", new string[] { "@ProductID" }, new object[] { productID });

            var list = new Tuple<IEnumerable<ProductDetails>, List<OptionDetailViewModel>>(productDetails, optionDetails);
            return Json(list, new JsonSerializerOptions());
        }
    }
}
