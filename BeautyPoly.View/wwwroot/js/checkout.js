var countdowntext = '';
var coupon = [];
var voucher = [];
var voucherID = 0;

$(document).ready(function () {
    var customerID = 1;
    if (customerID != undefined) {
        GetVoucher(customerID);

        var enddate;
        setInterval(function () {
            updateCountdown(enddate);
            GetVoucher(customerID); 
        }, 1000 * 60 * 60);
    }
});
function updateCountdown(endDate) {
    var nowDate = new Date();
    endDate = new Date(endDate);
    var timeRemaining = endDate - nowDate;

    if (timeRemaining <= 0) {
        countdowntext = 'Đã hết hạn';
        return countdowntext;
    } else {
        var days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        var hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        if (days > 0) {
            countdowntext = '';
        }else if (hours > 0) {
            countdowntext = `Hết hạn sau ${hours} giờ nữa`;
        } else{
            countdowntext = `<span clas="text_denger">Chỉ còn chưa tới 1 giờ nữa<span>`;
        }
        return countdowntext;
    }
}
function addCoupon() {
    var code = $('#coupon_code').val();
    if (voucher.length > 0) {
        alert("Bạn chỉ áp dụng được 1 chương trình khuyến mãi. Đơn hàng của bạn đã áp dụng Voucher!");
        return;
    }
    $.ajax({
        url: '/checkout/addcoupon',
        type: 'GET',
        dataType: "json",
        contentType: 'application/json;charset=utf-8',
        data: { couponCode: code },

        success: function (result) {
            if (result !== null) {
                if (result.coupon !== null) {
                    coupon.push(result.coupon);
                } else {
                    coupon = [];
                }
                var value = result.value === 0 ? '0' : `-${result.value.toLocaleString({ style: 'currency', currency: 'VND' })} VNĐ`;
                $('#value').text(value);
                $('#total_value').text(`${result.totalValue.toLocaleString({ style: 'currency', currency: 'VND' })} VNĐ`);
                $('#coupon_note').html(`<div class="alert alert-danger alert-dismissible fade show" role="alert">
                                    ${result.note}
                                </div>`);
            } else {
                alert("Đã xảy ra lỗi. Vui lòng thử lại sau!");
            }
        },
        error: function () {
            alert("Đã xảy ra lỗi. Vui lòng thử lại sau!");
        }
    });
}
function GetVoucher(customerID) {
        var total = 500000;

        $.ajax({
            url: '/checkout/getvoucher-by-customer',
            type: 'GET',
            dataType: "json",
            contentType: 'application/json;charset=utf-8',
            data: { customerID: customerID },

            success: function (result) {
                var html = '';
                $.each(result, function (key, item) {
                    var disabled = '';
                    if (customerID === 0 || total <= 0 || total < item.minValue) {
                        disabled = 'disabled';
                    }
                    var notifi = customerID === 0 ? 'Vui lòng đăng nhập để áp dụng Voucher!' : (total <= 0 ? 'Vui lòng mua sản phẩm để áp dụng Voucher!' : (total < item.minValue ? `<a href="#">Mua thêm <span class="fw-bold">${(item.minValue - total).toLocaleString({ style: 'currency', currency: 'VND' })} VNĐ</span> để áp dụng được Voucher!</a>` : ''));
                    var discount = item.voucherType === 0 ? `Giảm ${item.discountValue} %` : `Giảm ${item.discountValue.toLocaleString({ style: 'currency', currency: 'VND' }) } VNĐ`;
                    var condition = item.voucherType === 0 ? `Đơn tối thiểu ${item.minValue.toLocaleString({ style: 'currency', currency: 'VND' })} VNĐ, giảm tối đa ${item.maxValue.toLocaleString({ style: 'currency', currency: 'VND' })} VNĐ` : `Đơn tối thiểu ${item.minValue.toLocaleString({ style: 'currency', currency: 'VND' })} VNĐ`;
                    var percentuse = item.useQuantity / item.quantity * 100;
                    var endDate = new Date(item.endDate);
                    enddate = item.endDate;
                    countdowntext = updateCountdown(enddate) === '' ? `HSD: ${endDate.getDate()}.${(endDate.getMonth() + 1)}.${endDate.getFullYear()}` : updateCountdown(enddate);
                    html += `<div class="card" data-bg-img=" assets /images/photos/bg1.webp" style="background-image: url('assets/images/photos/bg1.webp'); background-size: 200%;">
                                 <div class="card-body">
                                 <input hidden id="voucherID" value="${item.voucherID}"/>
                                     <div class="row">
                                         <div class="col-md-10">
                                             <h5 class="card-title">${discount}</h5>
                                         </div>
                                         <div class="col-md-2">
                                             <input id="input_voucher_${item.voucherID}" type="radio" name="voucher" class="form-check-input" ${disabled}>
                                         </div>
                                         <p class="card-text">${condition}</p>
                                         <div class="d-flex justify-content-between align-items-center">
                                             <span class="text-muted">Đã dùng ${parseInt(percentuse)}%</span>
                                             <span class="text-muted">${countdowntext}</span>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                             <div class="bg-danger text-white">
                                ${notifi}                           
                             </div>
                             <br />`
                });
                $('#checkout_voucher').html(html);
            },
            error: function () {
                alert("Đã xảy ra lỗi. Vui lòng thử lại sau!");
            }
        });
}
function onVoucher() {
    $('input[name="voucher"]').prop('checked', false);
    $(`#input_voucher_${voucherID}`).prop('checked', true);
    $('#modal_voucher').modal('show');
}
function addVoucher() {
    if (coupon.length > 0) {
        alert("Bạn chỉ áp dụng được 1 chương trình khuyến mãi. Đơn hàng của bạn đã áp dụng Coupon!");
        $('#modal_voucher').modal('hide');
        return;
    }
    var checkedRadio = $('input[type="radio"][name="voucher"]:checked');
    if (checkedRadio.length > 0) {
        voucherID = checkedRadio.closest('.card').find('#voucherID').val();
    }
    $.ajax({
        url: '/checkout/addvoucher',
        type: 'GET',
        dataType: "json",
        contentType: 'application/json;charset=utf-8',
        data: { voucherID: voucherID },

        success: function (result) {
            if (result !== null) {
                if (result.voucher !== null) {
                    voucher.push(result.voucher);
                } else {
                    voucher = [];
                }
                var value = result.value === 0 ? '0' : `-${result.value.toLocaleString({ style: 'currency', currency: 'VND' })} VNĐ`;
                $('#value').text(value);
                $('#total_value').text(`${result.totalValue.toLocaleString({ style: 'currency', currency: 'VND' })} VNĐ`);
                $('#voucher_note').html(`<div class="alert alert-danger alert-dismissible fade show" role="alert">
                                            ${result.note}
                                        </div>`);
                if (result.note === null) {
                    $('#voucher_note').hide();
                }                     
                $('#modal_voucher').modal('hide');
            } else {
                alert("Đã xảy ra lỗi. Vui lòng thử lại sau!");
            }
        },
        error: function () {
            alert("Đã xảy ra lỗi. Vui lòng thử lại sau!");
        }
    });
}
function clearVoucher() {
    if (coupon.length > 0) {
        $('#modal_voucher').modal('hide');
        return;
    }
    voucherID = 0;
    $.ajax({
        url: '/checkout/addvoucher',
        type: 'GET',
        dataType: "json",
        contentType: 'application/json;charset=utf-8',
        data: { voucherID: voucherID },

        success: function (result) {
            if (result !== null) {
                voucher = [];
                $('#value').text(result.value);
                $('#total_value').text(`${result.totalValue} VNĐ`);
                $('#voucher_note').hide();
                $('#modal_voucher').modal('hide');
            } else {
                alert("Đã xảy ra lỗi. Vui lòng thử lại sau!");
            }
        },
        error: function () {
            alert("Đã xảy ra lỗi. Vui lòng thử lại sau!");
        }
    });
}