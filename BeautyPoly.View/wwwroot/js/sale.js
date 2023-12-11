var arrSale = [];
var arrCate = [];
var arrSaleItemCate = [];
var arrProduct = [];
var arrSaleItemProduct = [];
$(document).ready(function () {
    GetAll();
    // Cập nhật thời gian
    var enddate;
    setInterval(function () {
        updateCountdown(enddate);
        GetAll();
    }, 1000);
});
function updateCountdown(endDate) {
    var nowDate = new Date();
    endDate = new Date(endDate);
    var timeRemaining = endDate - nowDate;

    if (timeRemaining <= 0) {
        countdowntext = 'Khuyến mãi đã kết thúc';
        return countdowntext;
    } else {
        var days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        var hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        var color = days >= 5 ? 'green' : (days > 3 ? '#e6b800' : 'red');
        countdowntext = `<span class="fw-bold" style="color: ${color};">${days}</span> ngày <span class="fw-bold" style="color: ${color};">${hours}</span> giờ <span class="fw-bold" style="color: ${color};">${minutes}</span> phút <span class="fw-bold" style="color: ${color};">${seconds}</span> giây`;
        return countdowntext;
    }
}
function GetAll() {
    var keyword = $('#sale_keyword').val();
    $.ajax({
        url: '/admin/sale/getall',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: { filter: keyword },
        success: function (result) {
            arrSale = result;
            var html = '';
            var countdowntext = '';
            $.each(result, function (key, item) {
                var saleType = item.saleType == 0 ? "Giảm theo phần trăm" : "Giảm trực tiếp"
                var startDate = new Date(item.startDate);
                var endDate = new Date(item.endDate);
                var discountValue = item.saleType === 0 ? `${item.discountValue} %` : `${item.discountValue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`;
                enddate = item.endDate;
                countdowntext = updateCountdown(enddate);
                if (item.isDelete == false) {
                    html += `<tr>
                           <td>
                                <button class="btn btn-success btn-sm" onclick="editSale(${item.saleID})">
                                <i class="bx bx-pencil"></i>
                            </button>
                                <button class="btn btn-danger btn-sm" onclick="deleteSale(${item.saleID})">
                                    <i class="bx bx-trash"></i>
                                </button>
                            </td>
                            <td>${item.saleName}</td>
                            <td>${item.saleCode}</td>
                            <td>${item.quantity}</td>
                            <td>${startDate.getDate() + '/' + (startDate.getMonth() + 1) + '/' + startDate.getFullYear()}</td>
                            <td>${endDate.getDate() + '/' + (endDate.getMonth() + 1) + '/' + endDate.getFullYear()}</td>
                            <td>${discountValue}</td>
                            <td>${countdowntext}</td>
                        </tr>`;
                }
            });
            $('#tbody_sale').html(html);
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function GetAllCate() {
    var keyword = $('#cate_keyword').val();
    $.ajax({
        url: '/admin/cate/getall',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: { filter: keyword },
        success: function (result) {
            arrCate = result;
            $('#category-list').tree({
                data: arrCate
            });
            $.each(arrSaleItemCate, function (index, item) {
                var node = $('#category-list').tree('find', item.cateID);
                if (node) {
                    $('#category-list').tree('check', node.target);
                }
            });
        },
        error: function (err) {
            console.log(err);
        }
    });  
}
function GetAllSaleCate(id) {
    $.ajax({
        url: '/admin/salecate/getall',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: { Id: id },
        success: function (result) {
            arrSaleItemCate = result;
        },
        error: function (err) {
            console.log(err);
        }
    });
}
function GetAllProduct() {
    var keyword = $('#product_keyword').val();
    $.ajax({
        url: '/admin/product/getall',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: { filter: keyword },
        success: function (result) {
            arrProduct = result;
            var html = '';
            var stt = 1;
            $.each(result, function (key, item) {
                var checked = arrSaleItemProduct.some(obj => obj.productID === item.productID) ? 'checked' : '';
                var table;
                if (checked === 'checked') {
                    table = 'table-primary';
                }
                var nodes = $('#category-list').tree('getChecked');
                var cateName = '';
                for (var i = 0; i < nodes.length; i++) {
                    if (cateName !== '') cateName += ', ';
                    cateName += nodes[i].text;
                }
                if (cateName !== '') {
                    $('#notifi_product').html(`<div class="alert alert-danger alert-dismissible fade show" role="alert">
                                               <i class="bi bi-exclamation-octagon me-1"></i>
                                               Tất cả sản phẩm thuộc thể loại <span class="fw-bold text-success">${cateName}</span> sẽ mặc định được áp dụng
                                               <button id="btn_notifi" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                           </div>`);
                    $('#notifi_product').show();
                } else {
                    $('#notifi_product').hide();
                }
                var disabled = nodes.some(p => p.id === item.cateID) ? 'disabled' : '';
                if (disabled === 'disabled') {
                    table = 'table-success';
                    checked = 'checked';
                }
                html += `<tr class="${table}">
                           <td>
                                <input id="status_product" class="form-check-input" type="checkbox" onchange="ChangeProduct('${item.productID}', this.checked)" ${checked} ${disabled}/>
                            </td>
                            <td>${stt++}</td>
                            <td>${item.productCode}</td>
                            <td>${item.productName}</td>
                        </tr>`;
            });
            $('#tbody_product').html(html);
        },
        error: function (err) {
            console.log(err);
        }
    });
}
function GetAllSaleProduct(id) {
    $.ajax({
        url: '/admin/saleproduct/getall',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: { Id: id },
        success: function (result) {
            arrSaleItemProduct = result;
        },
        error: function (err) {
            console.log(err);
        }
    });
}
function validate() {
    var id = parseInt($('#sale_id_sale').val());
    var saleName = $('#sale_name_sale').val();
    var saleCode = $('#sale_code_sale').val();
    var quantity = parseInt($('#sale_quantity_sale').val());
    var startDate = $('#sale_start_date_sale').val();
    var endDate = $('#sale_end_date_sale').val();
    var type = $('#sale_type_sale').val();
    var discountValue = parseInt($("#sale_discount_value_sale").val());
    if (saleName == '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Vui lòng nhập tên chương trình Sale!',
            showConfirmButton: false,
            timer: 3000
        })
        return false;
    }
    if (saleCode == '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Vui lòng nhập mã Sale!',
            showConfirmButton: false,
            timer: 3000
        })
        return false;
    }
    if (quantity == '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Vui lòng nhập số lượng Sale!',
            showConfirmButton: false,
            timer: 3000
        })
        return false;
    }
    if (isNaN(quantity) || quantity <= 0 || quantity.toString().length > 10) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Vui lòng nhập lại số lượng Sale!',
            showConfirmButton: false,
            timer: 3000
        })
        return false;
    }
    if (startDate == '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Vui lòng nhập ngày áp dụng Sale!',
            showConfirmButton: false,
            timer: 3000
        })
        return false;
    }
    if (endDate == '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Vui lòng nhập ngày kết thúc Sale!',
            showConfirmButton: false,
            timer: 3000
        })
        return false;
    }
    if (startDate >= endDate) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ngày kết thúc phải lớn hơn ngày bắt đầu!',
            showConfirmButton: false,
            timer: 3000
        })
        return false;
    }
    //if (id == 0) {
    //    var nowDate = new Date();
    //    startDate = new Date(startDate);
    //    if (startDate < nowDate) {
    //        Swal.fire({
    //            icon: 'error',
    //            title: 'Oops...',
    //            text: 'Ngày bắt đầu phải lớn hơn hoặc bằng hiện tại!',
    //            showConfirmButton: false,
    //            timer: 3000
    //        })
    //        return false;
    //    }
    //}
    if (type == 0) {
        if (isNaN(discountValue) || discountValue <= 0 || discountValue > 100) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Vui lòng nhập lại giá trị giảm!',
                showConfirmButton: false,
                timer: 3000
            })
            return false;
        }
    }
    if (type == 1) {
        if (isNaN(discountValue) || discountValue <= 0 || discountValue.toString().length > 10) {
            Swal.fire({
                icon: 'error',
                title: 'oops...',
                text: 'vui lòng nhập lại giá trị giảm!',
                showconfirmbutton: false,
                timer: 3000
            })
            return false;
        }
    }
    return true;
}
function checkDiscountValue(value) {
    var discountType = $("#sale_type_sale").val();
    if (discountType == 0) {
        if (isNaN(value) || value <= 0 || value > 100) {
            $("#discountValueError").html("Giá trị giảm phải từ 0 đến 100");
            $("#discountValueError").show();
        } else {
            $("#discountValueError").hide();
        }
    } else if (discountType == 1) {
        if (isNaN(value) || value <= 0) {
            $("#discountValueError").html("Giá trị giảm phải lớn hơn 0");
            $("#discountValueError").show();
        } else if (value.toString().length > 10) {
            $("#discountValueError").html("Giá trị giảm không vượt quá 10 ký tự");
            $("#discountValueError").show();
        } else {
            $("#discountValueError").hide();
        }
    }
}
function check() {
    var discountValueFirst = parseInt($("#sale_discount_value_sale").val());
    checkDiscountValue(discountValueFirst);
    $("#sale_discount_value_sale").on("input", function () {
        var discountValue = parseInt($(this).val());
        checkDiscountValue(discountValue);
    });

    $("#sale_type_sale").on("change", function () {
        checkDiscountValue(parseInt($("#sale_discount_value_sale").val()));
    });
}

function ChangeProduct(id, isCheck) {
    var saleID = parseInt($('#sale_id_sale').val());
    var productID = parseInt(id);

    var obj = (saleID !== 0) ? { saleID: saleID, productID: productID } : { productID: productID };

    if (isCheck) {
        arrSaleItemProduct.push(obj);
    } else {
        arrSaleItemProduct = arrSaleItemProduct.filter(item => item.productID !== productID);
    }
    GetAllProduct();
}
function createUpdate() {
    if (!validate()) return;
    var id = parseInt($('#sale_id_sale').val());
    var name = $('#sale_name_sale').val();
    var code = $('#sale_code_sale').val();
    var quantity = $('#sale_quantity_sale').val();
    debugger
    var start_date = $('#sale_start_date_sale').val();
    var end_date = $('#sale_end_date_sale').val();
    var type = $('#sale_type_sale').val();
    var discount_value = parseInt($("#sale_discount_value_sale").val());

    arrSaleItemCate = []
    var nodes = $('#category-list').tree('getChecked');
    for (var i = 0; i < nodes.length; i++) {
        var obj = {
            cateID: nodes[i].id
        };
        if (id !== 0) {
            obj.saleID = id;
        }
        arrSaleItemCate.push(obj)
    }
    $.each(arrProduct, function (key, item) {
        var checkProduct = arrSaleItemCate.some(p => p.cateID === item.cateID);
        if (checkProduct) {
            arrSaleItemProduct = arrSaleItemProduct.filter(p => p.productID !== item.productID);
        }
    });

    var sale = {
        SaleID: id,
        SaleName: name,
        SaleCode: code,
        Quantity: quantity,
        StartDate: start_date,
        EndDate: end_date,
        SaleType: type,
        DiscountValue: discount_value
    }
    if (start_date == "") {
        sale.StartDate = null;
    }
    if (end_date == "") {
        sale.EndDate = null;
    }

    var obj = {
        Sale: sale,
        SaleItemCategories: arrSaleItemCate,
        SaleItemProducts: arrSaleItemProduct
    }
    $.ajax({
        url: '/admin/sale/create-update',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify(obj),
        success: function (result) {
            if (result == 1) {
                GetAll();
                $('#modal_sale').modal('hide');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `${result}`,
                    showConfirmButton: false,
                    timer: 3000
                })
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function addSale() {
    $('#sale_id_sale').val(0);
    $('#sale_name_sale').val('');
    $('#sale_code_sale').val('');
    $('#sale_quantity_sale').val(0);
    $('#sale_start_date_sale').val('');
    $('#sale_end_date_sale').val('');
    $('#sale_type_sale').val(0);
    $('#sale_discount_value_sale').val(0);
    arrSaleItemCate = [];
    arrSaleItemProduct = [];
    GetAllCate();
    GetAllProduct();
    check();
    $('#modal_sale').modal('show');
}
function editSale(id) {
    $('#sale_id_sale').val(id);
    var sale = arrSale.find(p => p.saleID == id);
    $('#sale_name_sale').val(sale.saleName);
    $('#sale_code_sale').val(sale.saleCode);
    $('#sale_quantity_sale').val(sale.quantity);
    $('#sale_start_date_sale').val(sale.startDate);
    $('#sale_end_date_sale').val(sale.endDate);
    $('#sale_type_sale').val(sale.saleType);
    $('#sale_discount_value_sale').val(sale.discountValue);
    GetAllSaleCate(id);
    GetAllSaleProduct(id);
    GetAllCate();
    GetAllProduct();
    check();
    $('#modal_sale').modal('show');
}
function deleteSale(id) {
    var countcate = 0;
    var countproduct = 0;
    $.each(arrCate, function (index, item) {
        var checkExistsCate = arrSaleItemCate.some(p => p.cateID !== item.cateId && p.saleID === id);
        if (checkExistsCate) {
            countcate++;
        }

    });
    $.each(arrProduct, function (index, item) {
        var checkExistsProduct = arrSaleItemProduct.some(p => p.productID !== item.productID && p.saleID === id);
        if (checkExistsProduct) {
            countproduct++;
        }
    });
    var tb = countcate > 0 ? 'Đã có thể loại áp dụng Sale này' : (countproduct > 0 ? 'Đã có sản phẩm áp dụng Sale này' : '');
    Swal.fire({
        title: tb,
        text: 'Bạn có chắc muốn xóa không?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/admin/sale/delete',
                type: 'DELETE',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(id),
                success: function (result) {
                    if (result == 1) {
                        GetAll();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: `${result}`,
                            showConfirmButton: false,
                            timer: 10000
                        });
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }
    });
}


