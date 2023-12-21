using BeautyPoly.Data.Models.DTO;
using BeautyPoly.Data.Repositories;
using BeautyPoly.Models;
using Microsoft.AspNetCore.Mvc;

namespace BeautyPoly.View.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class SaleController : Controller
    {
        SaleRepo saleRepo;
        CategoryRepo categoryRepo;
        ProductRepo productRepo;
        SaleItemCateRepo saleItemCateRepo;
        SaleItemProductRepo saleItemProductRepo;

        public SaleController(SaleRepo saleRepo, CategoryRepo categoryRepo, ProductRepo productRepo, SaleItemCateRepo saleItemCateRepo, SaleItemProductRepo saleItemProductRepo)
        {
            this.saleRepo = saleRepo;
            this.categoryRepo = categoryRepo;
            this.productRepo = productRepo;
            this.saleItemCateRepo = saleItemCateRepo;
            this.saleItemProductRepo = saleItemProductRepo;
        }

        [Route("admin/sale")]
        public IActionResult Index()
        {
            if (HttpContext.Session.GetInt32("AccountID") == null)
                return RedirectToRoute("Login");
            return View();
        }

        [HttpGet("admin/sale/getall")]
        public IActionResult GetAll(string filter)
        {
            List<Sale> list = saleRepo.GetAllSale(filter);
            return Json(list);
        }
        [HttpGet("admin/cate/getall")]
        public IActionResult GetAllCate()
        {
            List<Category> list = saleRepo.GetAllCateIsSale();
            List<TreeNode> treeNodes = ConvertToTreeNodes(list, null);
            return Json(treeNodes);
        }

        private List<TreeNode> ConvertToTreeNodes(List<Category> categories, int? parentId)
        {
            var nodes = new List<TreeNode>();

            foreach (var category in categories.Where(c => c.ParentID == parentId))
            {
                var node = new TreeNode
                {
                    id = category.CateId,
                    text = $"{category.CateCode} - {category.CateName}",
                    children = ConvertToTreeNodes(categories, category.CateId)
                };
                nodes.Add(node);
            }

            return nodes;
        }
        [HttpGet("admin/salecate/getall")]
        public IActionResult GetAllSaleCate(int Id)
        {
            List<SaleItemCategory> list = saleItemCateRepo.GetAllSaleItemCate(Id);
            return Json(list);
        }
        [HttpGet("admin/product/getall")]
        public IActionResult GetAllProduct(string filter)
        {
            List<Product> list = saleRepo.GetAllProductIsSale(filter);
            return Json(list);
        }
        [HttpGet("admin/saleproduct/getall")]
        public IActionResult GetAllSaleProduct(int Id)
        {
            List<SaleItemProduct> list = saleItemProductRepo.GetAllSaleItemProduct(Id);
            return Json(list);
        }
        [HttpPost("admin/sale/create-update")]
        public async Task<IActionResult> CreateOrUpdate([FromBody] SaleDTO saleDTO)
        {
            var checkExists = await saleRepo.FirstOrDefaultAsync(p => p.SaleCode.ToUpper().Trim() == saleDTO.Sale.SaleCode.ToUpper().Trim() && p.SaleID != saleDTO.Sale.SaleID && p.IsDelete == false);
            if (checkExists != null)
            {
                return Json("Mã Sale đã tồn tại! Vui lòng nhập lại.", new System.Text.Json.JsonSerializerOptions());
            }
            if (saleDTO.Sale.SaleName == null || saleDTO.Sale.SaleName == "")
            {
                return Json("Vui lòng nhập tên chương trình Sale", new System.Text.Json.JsonSerializerOptions());
            }
            if (saleDTO.Sale.SaleCode == null || saleDTO.Sale.SaleCode == "")
            {
                return Json("Vui lòng nhập mã Sale", new System.Text.Json.JsonSerializerOptions());
            }
            if (saleDTO.Sale.Quantity <= 0 || saleDTO.Sale.Quantity.ToString().Length > 10)
            {
                return Json("Vui lòng nhập lại số lượng Sale", new System.Text.Json.JsonSerializerOptions());
            }
            if (saleDTO.Sale.StartDate == null)
            {
                return Json("Vui lòng nhập ngày áp dụng Sale", new System.Text.Json.JsonSerializerOptions());
            }
            if (saleDTO.Sale.EndDate == null)
            {
                return Json("Vui lòng nhập ngày kết thúc Sale", new System.Text.Json.JsonSerializerOptions());
            }
            if (saleDTO.Sale.SaleType == 0)
            {
                if (saleDTO.Sale.DiscountValue <= 0 || saleDTO.Sale.DiscountValue > 100)
                {
                    return Json("Vui lòng nhập lại giá trị giảm", new System.Text.Json.JsonSerializerOptions());
                }
            }
            if (saleDTO.Sale.SaleType == 1)
            {
                if (saleDTO.Sale.DiscountValue <= 0 || saleDTO.Sale.DiscountValue.ToString().Length > 10)
                {
                    return Json("Vui lòng nhập lại giá trị giảm", new System.Text.Json.JsonSerializerOptions());
                }
            }
            Sale sale = new Sale();
            sale.SaleCode = saleDTO.Sale.SaleCode;
            sale.Quantity = saleDTO.Sale.Quantity;
            sale.SaleName = saleDTO.Sale.SaleName;
            sale.StartDate = saleDTO.Sale.StartDate;
            sale.EndDate = saleDTO.Sale.EndDate;
            sale.DiscountValue = saleDTO.Sale.DiscountValue;
            sale.SaleType = saleDTO.Sale.SaleType;
            sale.Description = saleDTO.Sale.Description;
            sale.IsDelete = false;
            if (saleDTO.Sale.SaleID > 0)
            {
                sale.SaleID = saleDTO.Sale.SaleID;
                await saleRepo.UpdateAsync(sale);

                var saleItemCate = saleItemCateRepo.GetAllAsync().Result.Where(p => p.SaleID == saleDTO.Sale.SaleID);
                await saleItemCateRepo.DeleteRangeAsync(saleItemCate);
                var saleItemProduct = saleItemProductRepo.GetAllAsync().Result.Where(p => p.SaleID == saleDTO.Sale.SaleID);
                await saleItemProductRepo.DeleteRangeAsync(saleItemProduct);
            }
            else
            {
                sale.CreateDate = DateTime.Now;
                await saleRepo.InsertAsync(sale);
                saleDTO.Sale.SaleID = sale.SaleID;
            }
            foreach (var item in saleDTO.SaleItemCategories)
            {
                var obj = new SaleItemCategory()
                {
                    SaleID = saleDTO.Sale.SaleID,
                    CateID = item.CateID
                };
                await saleItemCateRepo.InsertAsync(obj);
            }
            foreach (var cate in await categoryRepo.GetAllAsync())
            {
                var count = 0;
                foreach (var catesale in await saleItemCateRepo.GetAllAsync())
                {
                    if (cate.CateId == catesale.CateID) count++;
                }
                if (count > 0) cate.IsSale = true;
                else cate.IsSale = false;
                await categoryRepo.UpdateAsync(cate);
            }
            foreach (var item in saleDTO.SaleItemProducts)
            {
                var obj = new SaleItemProduct()
                {
                    SaleID = saleDTO.Sale.SaleID,
                    ProductID = item.ProductID
                };
                await saleItemProductRepo.InsertAsync(obj);
            }
            foreach (var product in await productRepo.GetAllAsync())
            {
                var count = 0;
                foreach (var productsale in await saleItemProductRepo.GetAllAsync())
                {
                    if (product.ProductID == productsale.ProductID) count++;
                }
                if (count > 0) product.IsSale = true;
                else product.IsSale = false;
                await productRepo.UpdateAsync(product);
            }
            return Json(1);
        }
        [HttpPost("admin/sale/delete")]
        public async Task<IActionResult> Delete([FromBody] int saleID)
        {
            var obj = await saleRepo.GetByIdAsync(saleID);
            obj.IsDelete = true;
            await saleRepo.UpdateAsync(obj);
            return Json(1);
        }
    }
}
