using BeautyPoly.Data.Repositories;
using BeautyPoly.Data.ViewModels;
using BeautyPoly.View.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using System.Text;

namespace BeautyPoly.View.Controllers
{
    public class CheckoutController : Controller
    {
        private readonly HttpClient _httpClient;
        CouponRepo couponRepo;
        VoucherRepo voucherRepo;

        public CheckoutController(CouponRepo couponRepo, VoucherRepo voucherRepo)
        {
            this.couponRepo = couponRepo;
            this.voucherRepo = voucherRepo;
            _httpClient = new HttpClient();

            _httpClient.DefaultRequestHeaders.Add("token", "4984199c-febd-11ed-8a8c-6e4795e6d902");
        }
        //Lấy địa chỉ quận huyện
        public JsonResult GetListDistrict(int idProvin)
        {

            HttpResponseMessage responseDistrict = _httpClient.GetAsync("https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=" + idProvin).Result;

            District lstDistrict = new District();

            if (responseDistrict.IsSuccessStatusCode)
            {
                string jsonData2 = responseDistrict.Content.ReadAsStringAsync().Result;

                lstDistrict = JsonConvert.DeserializeObject<District>(jsonData2);
            }
            return Json(lstDistrict, new System.Text.Json.JsonSerializerOptions());
        }
        //Lấy địa chỉ phường xã
        public JsonResult GetListWard(int idWard)
        {


            HttpResponseMessage responseWard = _httpClient.GetAsync("https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=" + idWard).Result;

            Ward lstWard = new Ward();

            if (responseWard.IsSuccessStatusCode)
            {
                string jsonData2 = responseWard.Content.ReadAsStringAsync().Result;

                lstWard = JsonConvert.DeserializeObject<Ward>(jsonData2);
            }
            return Json(lstWard, new System.Text.Json.JsonSerializerOptions());
        }
        public async Task<JsonResult> GetTotalShipping([FromBody] ShippingOrder shippingOrder)
        {
            try
            {
                _httpClient.DefaultRequestHeaders.Add("shop_id", "4189080");

                var apiUrl = "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee";

                var queryString = new StringBuilder();
                queryString.Append($"from_district_id={3440}");
                queryString.Append($"&from_ward_code=13010");
                queryString.Append($"&service_id={shippingOrder.service_id}");
                //queryString.Append($"&service_type_id=");
                queryString.Append($"&to_district_id={shippingOrder.to_district_id}");
                queryString.Append($"&to_ward_code={shippingOrder.to_ward_code}");
                queryString.Append($"&height={shippingOrder.height}");
                queryString.Append($"&length={shippingOrder.length}");
                queryString.Append($"&weight={shippingOrder.weight}");
                queryString.Append($"&width={shippingOrder.width}");
                queryString.Append($"&insurance_value={shippingOrder.insurance_value}");
                queryString.Append($"&cod_failed_amount={2000}");
                queryString.Append($"&coupon=");

                // Add other parameters

                var fullUrl = $"{apiUrl}?{queryString}";

                HttpResponseMessage responseWShipping = await _httpClient.GetAsync(fullUrl);

                if (responseWShipping.IsSuccessStatusCode)
                {
                    string jsonData = await responseWShipping.Content.ReadAsStringAsync();
                    var shipping = JsonConvert.DeserializeObject<Shipping>(jsonData);

                    HttpContext.Session.SetInt32("shiptotal", shipping.data.total);

                    // Update the total order value
                    shipping.data.totaloder = shipping.data.total + 10;

                    return Json(shipping, new System.Text.Json.JsonSerializerOptions());
                }
                else
                {
                    // Log or handle the error appropriately
                    var errorMessage = $"Error: {responseWShipping.StatusCode} - {responseWShipping.ReasonPhrase}";
                    Console.WriteLine(errorMessage);

                    return Json(new { error = errorMessage });
                }
            }
            catch (Exception ex)
            {
                // Log or handle the exception
                Console.WriteLine(ex.Message);

                return Json(new { error = "An error occurred while processing the request." });
            }
        }

        public IActionResult Index()
        {
            HttpResponseMessage responseProvin = _httpClient.GetAsync("https://online-gateway.ghn.vn/shiip/public-api/master-data/province").Result;

            Provin lstprovin = new Provin();

            if (responseProvin.IsSuccessStatusCode)
            {
                string jsonData2 = responseProvin.Content.ReadAsStringAsync().Result;


                lstprovin = JsonConvert.DeserializeObject<Provin>(jsonData2);
                ViewBag.Provin = new SelectList(lstprovin.data, "ProvinceID", "ProvinceName");
            }
            return View();
        }

        [HttpGet("checkout/addcoupon")]
        public async Task<IActionResult> AddCoupon(string couponCode)
        {
            try
            {
                CheckoutViewModel _couponViewModel = new CheckoutViewModel();
                //Tổng tiền của Cart tạm thời fix cứng
                var total = 500000;
                var coupons = await couponRepo.GetAllAsync();
                if (couponCode == null)
                {
                    _couponViewModel.TotalValue = total;
                    _couponViewModel.Value = 0;
                    _couponViewModel.Note = "Vui lòng nhập mã giảm giá để áp dụng!";
                    return Json(_couponViewModel);
                }
                foreach (var item in coupons)
                {
                    if (item.CouponCode == couponCode)
                    {
                        _couponViewModel.TotalValue = total;
                        _couponViewModel.Value = 0;
                        if (item.EndDate < DateTime.Now)
                        {
                            _couponViewModel.Note = "Mã giảm giá đã hết hạn!";
                            return Json(_couponViewModel);
                        }
                        if (item.Quantity <= 0)
                        {
                            _couponViewModel.Note = "Đã hết mã giảm giá!";
                            return Json(_couponViewModel);
                        }
                        if (item.CouponType == 0)
                        {
                            _couponViewModel.Coupon = item;
                            _couponViewModel.TotalValue = (int)(total * (1 - (item.DiscountValue / (double)100)));
                            _couponViewModel.Value = (int)(total * (item.DiscountValue / (double)100));
                            _couponViewModel.Note = $"Giảm {item.DiscountValue}% cho toàn bộ đơn hàng";
                        }
                        else
                        {
                            if (total - item.DiscountValue < 0)
                            {
                                _couponViewModel.Note = "Mã giảm giá không phù hợp!";
                                return Json(_couponViewModel);
                            }
                            _couponViewModel.Coupon = item;
                            _couponViewModel.TotalValue = (int)(total - item.DiscountValue);
                            _couponViewModel.Value = (int)item.DiscountValue;
                            _couponViewModel.Note = $"Giảm {item.DiscountValue:#,0} VND cho toàn bộ đơn hàng";
                        }
                        return Json(_couponViewModel);
                    }
                }
                _couponViewModel.TotalValue = total;
                _couponViewModel.Value = 0;
                _couponViewModel.Note = "Mã giảm giá không tồn tại!";
                return Json(_couponViewModel);
            }
            catch (Exception)
            {

                return Json(null);
            }
        }
        [HttpGet("checkout/getvoucher-by-customer")]
        public IActionResult GetVoucherByCustomer(int customerID)
        {
            var list = voucherRepo.GetVoucherByCustomer(customerID);
            return Json(list);
        }
        [HttpGet("checkout/addvoucher")]
        public async Task<IActionResult> AddVoucher(int voucherID)
        {
            try
            {
                CheckoutViewModel _voucherViewModel = new CheckoutViewModel();
                //Tổng tiền của Cart tạm thời fix cứng
                var total = 500000;
                var voucher = await voucherRepo.GetByIdAsync(voucherID);
                _voucherViewModel.TotalValue = total;
                _voucherViewModel.Value = 0;
                if (voucher != null)
                {
                    if (voucher.VoucherType == 0)
                    {
                        _voucherViewModel.Voucher = voucher;
                        _voucherViewModel.TotalValue = (int)(total * (1 - (voucher.DiscountValue / (double)100)));
                        _voucherViewModel.Value = (int)(total * (voucher.DiscountValue / (double)100));
                        if (_voucherViewModel.Value >= voucher.MaxValue)
                        {
                            _voucherViewModel.TotalValue = (int)(total - voucher.MaxValue);
                            _voucherViewModel.Value = (int)voucher.MaxValue;
                        }
                        _voucherViewModel.Note = $"Giảm {voucher.DiscountValue}% cho toàn bộ đơn hàng";
                    }
                    else
                    {
                        if (total - voucher.DiscountValue < 0)
                        {
                            _voucherViewModel.Note = "Phiếu giảm giá không phù hợp!";
                            return Json(_voucherViewModel);
                        }
                        _voucherViewModel.Voucher = voucher;
                        _voucherViewModel.TotalValue = (int)(total - voucher.DiscountValue);
                        _voucherViewModel.Value = (int)voucher.DiscountValue;
                        _voucherViewModel.Note = $"Giảm {voucher.DiscountValue:#,0} VND cho toàn bộ đơn hàng";
                    }
                }
                return Json(_voucherViewModel);
            }
            catch (Exception)
            {

                return Json(null);
            }
        }
    }
}
