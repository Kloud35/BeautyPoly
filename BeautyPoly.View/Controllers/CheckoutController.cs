using BeautyPoly.Data.Repositories;
using BeautyPoly.Models;
using BeautyPoly.View.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BeautyPoly.View.Controllers
{
    public class CheckoutController : Controller
    {
        CouponRepo couponRepo;
        VoucherRepo voucherRepo;

        public CheckoutController(CouponRepo couponRepo, VoucherRepo voucherRepo)
        {
            this.couponRepo = couponRepo;
            this.voucherRepo = voucherRepo;
        }

        public IActionResult Index()
        {
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
