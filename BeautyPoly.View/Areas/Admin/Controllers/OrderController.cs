using BeautyPoly.Data.Models.DTO;
using BeautyPoly.Data.Repositories;
using BeautyPoly.Models;
using Microsoft.AspNetCore.Mvc;

namespace BeautyPoly.View.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class OrderController : Controller
    {
        OrderRepo orderRepo;
        ProductRepo prodRepo;
        DetailOrderRepo detailOrderRepo;
        ProductSkuRepo productSkuRepo;
        CustomerRepository customerRepository;
        public OrderController(OrderRepo orderRepo, ProductRepo prodRepo, DetailOrderRepo detailOrderRepo, ProductSkuRepo productSkuRepo)
        {
            this.orderRepo = orderRepo;
            this.prodRepo = prodRepo;
            this.detailOrderRepo = detailOrderRepo;
            this.productSkuRepo = productSkuRepo;
        }
        [Route("admin/order")]
        public IActionResult Index()
        {
            return View();
        }
        [HttpGet("admin/order/getall")]
        public async Task<IActionResult> GetAllOrder()
        {
            return Json(await orderRepo.GetAllAsync(), new System.Text.Json.JsonDocumentOptions());
        }
        [HttpGet("admin/order/{orderId}")]
        public async Task<IActionResult> GetOrder(int orderId)
        {
            var itemOrder = await orderRepo.FirstOrDefaultAsync(x => x.OrderID == orderId);
            var itemOrderDetail = await detailOrderRepo.FindAsync(x => x.OrderID == orderId);

            var order = new OrderDTO();
            if (itemOrder != null)
            {
                var productSkus = await productSkuRepo.GetAllAsync();
                var products = await prodRepo.GetAllAsync();

                order.OrderID = itemOrder.OrderID;
                order.OrderCode = itemOrder.OrderCode;
                order.CustomerName = itemOrder.CustomerName;
                order.Note = itemOrder.Note;
                order.Address = itemOrder.Address;
                order.MedthodPayment = itemOrder.MedthodPayment;
                order.CustomerPhone = itemOrder.CustomerPhone;
                if (itemOrderDetail.Count() > 0)
                {
                    var prodPick = new List<productPick>();
                    foreach (var productPickItem in itemOrderDetail)
                    {
                        var prodSkus = productSkus.FirstOrDefault(x => x.ProductSkusID == productPickItem.ProductSkusID);
                        var prod = products.FirstOrDefault(x => x.ProductID == prodSkus.ProductID);
                        prodPick.Add(new productPick
                        {
                            Name = prod.ProductName,
                            Skus = prodSkus.Sku,
                            Price = (double)productPickItem.Price,
                            ProductID = productPickItem.ProductSkusID,
                            Quantity = (int)productPickItem.Quantity
                        });
                    }
                    order.prods = prodPick;
                }
            }


            return Json(order, new System.Text.Json.JsonSerializerOptions());
        }
        [HttpGet("admin/order/status/{statusId}")]
        public async Task<IActionResult> GetOrderStatus(int statusId)
        {
            var result = await orderRepo.FindAsync(x => x.TransactStatusID == statusId);
            return Json(result.ToList(), new System.Text.Json.JsonSerializerOptions());
        }
        [HttpGet("admin/order/get-product")]
        public async Task<IActionResult> GetProduct()
        {
            var productSkus = await productSkuRepo.GetAllAsync();
            var products = await prodRepo.GetAllAsync();
            var result = new List<ProductSkuResponse>();
            foreach (var product in productSkus)
            {
                var itemProd = products.FirstOrDefault(s => s.ProductID == product.ProductID);
                result.Add(new ProductSkuResponse(itemProd, product));
            }
            return Json(result.ToList(), new System.Text.Json.JsonSerializerOptions());
        }

        [HttpPost("admin/order/create")]
        public async Task<IActionResult> CreateOrder([FromBody] OrderDTO orderDTO)
        {
            try
            {
                if (orderDTO != null)
                {

                    //if (!string.IsNullOrEmpty(orderDTO.CustomerName) && !string.IsNullOrEmpty(orderDTO.CustomerPhone) && !string.IsNullOrEmpty(orderDTO.Address))
                    //{
                    //    var user = await customerRepository.FirstOrDefaultAsync(x => x.Phone == orderDTO.CustomerPhone.Trim());
                    //    if (user != null)
                    //    {
                    //        user.FullName = orderDTO.CustomerName;
                    //        await customerRepository.UpdateAsync(user);
                    //    }
                    //}
                    if (orderDTO.prods.Count() < 0)
                    {

                        return Json("Đơn hàng bắt buộc phải có sản phẩm. Vui lòng thử lại!");
                    }
                    Order order = new Order();

                    if (orderDTO.OrderID > 0)
                    {
                        order = await orderRepo.FirstOrDefaultAsync(p => p.OrderID == orderDTO.OrderID);
                        var orderID = orderDTO.OrderID;
                        order.OrderID = orderID;
                        order.TransactStatusID = 1;
                        order.AccountID = 2;
                        order.AccountName = "ACNAME";
                        order.PotentialCustomerID = 1;
                        order.CustomerName = orderDTO.CustomerName;
                        order.OrderDate = DateTime.Now;
                        order.ShipDate = DateTime.Now.AddDays(3);
                        order.PaymentDate = DateTime.Now;
                        order.Note = orderDTO.Note;
                        order.TotalMoney = orderDTO.prods.Sum(x => x.Price);
                        order.Address = orderDTO.Address;
                        order.MedthodPayment = orderDTO.MedthodPayment;
                        order.CustomerPhone = orderDTO.CustomerPhone;
                        await orderRepo.UpdateAsync(order);
                    }
                    else
                    {
                        order.OrderCode = "HD_" + DateTime.Now.Ticks;
                        order.TransactStatusID = 1;
                        order.AccountID = 2;
                        order.AccountName = "ACNAME";
                        order.PotentialCustomerID = 1;
                        order.CustomerName = orderDTO.CustomerName;
                        order.OrderDate = DateTime.Now;
                        order.ShipDate = DateTime.Now.AddDays(3);
                        order.PaymentDate = orderDTO.PaymentDate;
                        order.Note = orderDTO.Note;
                        order.TotalMoney = orderDTO.prods.Sum(x => x.Price);
                        order.Address = orderDTO.Address;
                        order.MedthodPayment = orderDTO.MedthodPayment;
                        order.CustomerPhone = orderDTO.CustomerPhone;
                        await orderRepo.InsertAsync(order);

                    }
                    var checkExistCode = await orderRepo.FirstOrDefaultAsync(p => p.OrderCode == order.OrderCode);

                    if (checkExistCode != null)
                    {
                        foreach (var prod in orderDTO.prods)
                        {
                            var checkExistDetailOrder = await detailOrderRepo.FirstOrDefaultAsync(p => p.ProductSkusID == prod.ProductID && p.OrderID == checkExistCode.OrderID);

                            if (checkExistDetailOrder != null)
                            {
                                checkExistDetailOrder.Price = (int)prod.Price;
                                checkExistDetailOrder.Quantity = prod.Quantity;
                                await detailOrderRepo.UpdateAsync(checkExistDetailOrder);

                            }
                            else
                            {
                                OrderDetails orderDetail = new OrderDetails
                                {
                                    OrderID = checkExistCode.OrderID,
                                    Price = (int)prod.Price,
                                    Quantity = prod.Quantity,
                                    ProductSkusID = prod.ProductID
                                };
                                await detailOrderRepo.InsertAsync(orderDetail);

                            }
                        }
                    }
                    else
                    {
                        return Json(0);
                    }


                    return Json(1);
                }
                return Json(0);
            }
            catch (Exception ex)
            {
                return Json(0);
            }

        }

        [HttpPost("admin/order/delete/{orderID}")]
        public async Task<IActionResult> DeleteOrder(int orderID)
        {
            var order = await orderRepo.GetByIdAsync(orderID);
            if (order != null)
            {
                var orderDetail = await detailOrderRepo.FindAsync(x => x.OrderID == orderID);
                foreach (var itemDetail in orderDetail)
                {
                    await detailOrderRepo.DeleteAsync(itemDetail);
                }
                try
                {
                    await orderRepo.DeleteAsync(order);

                }
                catch (Exception ex)
                {

                }
                return Json(1);

            }
            else
            {
                return Json(2);

            }
        }
        [HttpPost("admin/order/confirm")]
        public async Task<IActionResult> Confirm([FromBody] List<int> orderIDs)
        {
            if (orderIDs.Count() > 0)
            {
                foreach (var item in orderIDs)
                {
                    var order = await orderRepo.GetByIdAsync(item);
                    if (order != null)
                    {
                        var statusCurrent = order.TransactStatusID;
                        if (statusCurrent == 4)
                        {
                            order.TransactStatusID = 1;

                        }
                        else
                        {
                            if (statusCurrent == 3)
                            {
                                order.TransactStatusID = 5;
                            }
                            else
                            {
                                order.TransactStatusID = statusCurrent + 1;

                            }
                        }
                        if (order.TransactStatusID <= 5)
                        {
                            await orderRepo.UpdateAsync(order);
                        }
                    }
                }
                return Json(1);
            }
            return Json(0);
        }
        [HttpPost("admin/order/cancel")]
        public async Task<IActionResult> Cancel([FromBody] List<int> orderIDs)
        {
            if (orderIDs.Count() > 0)
            {
                foreach (var item in orderIDs)
                {
                    var order = await orderRepo.GetByIdAsync(item);
                    if (order != null)
                    {
                        order.TransactStatusID = 4;
                        await orderRepo.UpdateAsync(order);
                    }
                }
                return Json(1);
            }
            return Json(0);
        }
        [HttpPost("admin/order/payorder")]
        public async Task<IActionResult> PayOrder([FromBody] List<int> orderIDs)
        {
            if (orderIDs.Count() > 0)
            {
                foreach (var item in orderIDs)
                {
                    var order = await orderRepo.GetByIdAsync(item);
                    if (order != null)
                    {
                        order.TransactStatusID = 5;
                        await orderRepo.UpdateAsync(order);
                    }
                }
                return Json(1);
            }
            return Json(0);
        }
    }
}
