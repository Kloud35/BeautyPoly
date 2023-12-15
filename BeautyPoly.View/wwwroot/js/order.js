var productList = [];
var orderList = [];
$(document).ready(function () {
    $.ajax({
        url: '/admin/order/get-product',
        type: 'Get',
        success: function (result) {
            if (result.length > 0) {
                productList = result;
            }
           
        },
        error: function (err) {
            console.log(err)
        }
    });
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('bx-trash')) {
            var clickedTrashButton = event.target;
            var parentRow = clickedTrashButton.closest('.pick-prod');

            if (parentRow) {
                parentRow.remove(); // Remove the entire row
            }
        }
    });
    
    $("#home-tab").on("click", function () {
        $.ajax({
            url: '/admin/order/status/1',
            type: 'Get',
            success: function (result) {
                $("#tbody_order_hc").empty();
                var html = ``;
                var index = 0;
                result.forEach(function (element) {


                    
                    var date = new Date(element.OrderDate);
                    var ShipDate = new Date(element.ShipDate);

                    // Format the date to 'dd/MM/yyyy'
                    var OrderDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                    var _shipDate = `${ShipDate.getDate().toString().padStart(2, '0')}/${(ShipDate.getMonth() + 1).toString().padStart(2, '0')}/${ShipDate.getFullYear()}`;
                    html += `
                    <tr>
                                            <th style="vertical-align: top;"> <input class="form-check-input gridCheck" type="checkbox" data-id="${element.OrderID}"></th>
                                            <th style="vertical-align: top;">${++index}</th>
                                            <th style="vertical-align: top;"><a href="#" onclick="addHDOrder(${element.OrderID})" class="card-link">${element.OrderCode}</a></th>
                                            <th style="vertical-align: top;">Admin</th>
                                            <th style="vertical-align: top;">${element.CustomerName}</th>
                                            <th style="vertical-align: top;">${element.CustomerPhone}</th>
                                            <th style="vertical-align: top;white-space: nowrap;">${element.Address}</th>
                                            <th style="vertical-align: top;"></th>
                                            <th style="vertical-align: top;"></th>
                                            <th style="vertical-align: top;">${element.TotalMoney}</th>
                                            <th style="vertical-align: top;">${element.MedthodPayment}</th>
                                            <th style="vertical-align: top;">${OrderDate}</th>
                                            <th style="vertical-align: top;">${_shipDate}</th>
                                            <th style="vertical-align: top;">${element.PaymentDate}</th>
                                            <th style="vertical-align: top;white-space: nowrap;">${element.Note}</th>
                                            <th style="vertical-align: top;">
                                               <button type="button" style="margin-left:50px" class="btn btn-info" onclick="Edit(${element.OrderID})">Sửa</button>
                                               <button type="button" style="margin-left:50px" onclick="removeOrder(${element.OrderID})" class="btn btn-danger">Xóa</button>
                                            </th>
                                        </tr>`;
                });
                $("#tbody_order_hc").append(html);
                console.log(result);
            },
            error: function (err) {
                console.log(err)
            }
        });
    });
    $("#profile-tab").on("click", function () {
        $.ajax({
            url: '/admin/order/status/2',
            type: 'Get',
            success: function (result) {
                $("#tbody_order_dd").empty();
                var html = ``;

                if (result.length > 0) {
                    var index = 0;
                    result.forEach(function (element) {
                        
                        var date = new Date(element.OrderDate);
                        var ShipDate = new Date(element.ShipDate);

                        // Format the date to 'dd/MM/yyyy'
                        var OrderDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                        var _shipDate = `${ShipDate.getDate().toString().padStart(2, '0')}/${(ShipDate.getMonth() + 1).toString().padStart(2, '0')}/${ShipDate.getFullYear()}`;

                        html += `
                                        <tr>
                                            <th style="vertical-align: top;"><input class="form-check-input gridCheck" type="checkbox" data-id="${element.OrderID}"> </th>
                                            <th style="vertical-align: top;">${++index}  </th>
                                            <th style="vertical-align: top;"><a href="#" onclick="addHDOrder(${element.OrderID})" class="card-link">${element.OrderCode}</a></th>
                                            <th style="vertical-align: top;">Admin</th>
                                            <th style="vertical-align: top;">${element.CustomerName}</th>
                                            <th style="vertical-align: top;">${element.CustomerPhone}</th>
                                            <th style="vertical-align: top;white-space: nowrap;">${element.Address}</th>
                                            <th style="vertical-align: top;"></th>
                                            <th style="vertical-align: top;"></th>
                                            <th style="vertical-align: top;">${element.TotalMoney}</th>
                                            <th style="vertical-align: top;">${element.MedthodPayment}</th>
                                            <th style="vertical-align: top;">${OrderDate}</th>
                                            <th style="vertical-align: top;">${_shipDate}</th>
                                            <th style="vertical-align: top;">${element.PaymentDate}</th>
                                            <th style="vertical-align: top;white-space: nowrap;">${element.Note}</th>
                                            <th style="vertical-align: top;">
                                               <button type="button" style="margin-left:50px" class="btn btn-info" onclick="Edit(${element.OrderID})">Sửa</button>
                                               <button type="button" style="margin-left:50px" onclick="removeOrder(${element.OrderID})" class="btn btn-danger">Xóa</button>
                                            </th>
                                        </tr>`;
                    });
                } 
                $("#tbody_order_dd").append(html);
            },
            error: function (err) {
                console.log(err)
            }
        });
    });
    $("#contact-tab").on("click", function () {
        $.ajax({
            url: '/admin/order/status/3',
            type: 'Get',
            success: function (result) {
                $("#tbody_order_cgh").empty();
                var html = ``;
                var index = 0;
                result.forEach(function (element) {
                    // Create a Date object from the input string
                    var date = new Date(element.OrderDate);
                    var ShipDate = new Date(element.ShipDate);

                    // Format the date to 'dd/MM/yyyy'
                    var OrderDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                    var _shipDate = `${ShipDate.getDate().toString().padStart(2, '0')}/${(ShipDate.getMonth() + 1).toString().padStart(2, '0')}/${ShipDate.getFullYear()}`;

                    html += `
                    <tr>
                                            <th style="vertical-align: top;"><input class="form-check-input gridCheck" type="checkbox" data-id="${element.OrderID}"></th>
                                            <th style="vertical-align: top;">${++index} </th>
                                            <th style="vertical-align: top;"><a href="#" onclick="addHDOrder(${element.OrderID})" class="card-link">${element.OrderCode}</a></th>
                                            <th style="vertical-align: top;">Admin</th>
                                            <th style="vertical-align: top;">${element.CustomerName}</th>
                                            <th style="vertical-align: top;">${element.CustomerPhone}</th>
                                            <th style="vertical-align: top;white-space: nowrap;">${element.Address}</th>
                                            <th style="vertical-align: top;"></th>
                                            <th style="vertical-align: top;"></th>
                                            <th style="vertical-align: top;">${element.TotalMoney}</th>
                                            <th style="vertical-align: top;">${element.MedthodPayment}</th>
                                            <th style="vertical-align: top;">${OrderDate}</th>
                                            <th style="vertical-align: top;">${_shipDate}</th>
                                            <th style="vertical-align: top;">${element.PaymentDate}</th>
                                            <th style="vertical-align: top;white-space: nowrap;">${element.Note}</th>
                                            <th style="vertical-align: top;">
                                               <button type="button" style="margin-left:50px" class="btn btn-info" onclick="Edit(${element.OrderID})">Sửa</button>
                                               <button type="button" style="margin-left:50px" onclick="removeOrder(${element.OrderID})" class="btn btn-danger">Xóa</button>
                                            </th>
                                        </tr>`;
                });
                $("#tbody_order_cgh").append(html);
            },
            error: function (err) {
                console.log(err)
            }
        });
    });
    $("#home-tab1").on("click", function () {
        $.ajax({
            url: '/admin/order/status/4',
            type: 'Get',
            success: function (result) {
                $("#tbody_order_hd").empty();
                var html = ``;
                var index = 0;
                result.forEach(function (element) {
                    // Create a Date object from the input string
                    var date = new Date(element.OrderDate);
                    var ShipDate = new Date(element.ShipDate);

                    // Format the date to 'dd/MM/yyyy'
                    var OrderDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                    var _shipDate = `${ShipDate.getDate().toString().padStart(2, '0')}/${(ShipDate.getMonth() + 1).toString().padStart(2, '0')}/${ShipDate.getFullYear()}`;

                    html += `
                    <tr>
                                            <th style="vertical-align: top;"><input class="form-check-input gridCheck" type="checkbox" data-id="${element.OrderID}"></th>
                                            <th style="vertical-align: top;">${++index} </th>
                                            <th style="vertical-align: top;"><a href="#" onclick="addHDOrder(${element.OrderID})" class="card-link">${element.OrderCode}</a></th>
                                            <th style="vertical-align: top;">Admin</th>
                                            <th style="vertical-align: top;">${element.CustomerName}</th>
                                            <th style="vertical-align: top;">${element.CustomerPhone}</th>
                                            <th style="vertical-align: top;white-space: nowrap;">${element.Address}</th>
                                            <th style="vertical-align: top;"></th>
                                            <th style="vertical-align: top;"></th>
                                            <th style="vertical-align: top;">${element.TotalMoney}</th>
                                            <th style="vertical-align: top;">${element.MedthodPayment}</th>
                                            <th style="vertical-align: top;">${OrderDate}</th>
                                            <th style="vertical-align: top;">${_shipDate}</th>
                                            <th style="vertical-align: top;">${element.PaymentDate}</th>
                                            <th style="vertical-align: top;white-space: nowrap;">${element.Note}</th>
                                            <th style="vertical-align: top;">
                                               <button type="button" style="margin-left:50px" class="btn btn-info" onclick="Edit(${element.OrderID})">Sửa</button>
                                               <button type="button" style="margin-left:50px" onclick="removeOrder(${element.OrderID})" class="btn btn-danger">Xóa</button>
                                            </th>
                                        </tr>`;
                });
                $("#tbody_order_hd").append(html);
            },
            error: function (err) {
                console.log(err)
            }
        });
    });
    $("#home-tab2").on("click", function () {
        $.ajax({
            url: '/admin/order/status/5',
            type: 'Get',
            success: function (result) {
                $("#tbody_order_gtc").empty();
                var html = ``;
                var index = 0;
                result.forEach(function (element) {
                    // Create a Date object from the input string
                    var date = new Date(element.OrderDate);
                    var ShipDate = new Date(element.ShipDate);

                    // Format the date to 'dd/MM/yyyy'
                    var OrderDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                    var _shipDate = `${ShipDate.getDate().toString().padStart(2, '0')}/${(ShipDate.getMonth() + 1).toString().padStart(2, '0')}/${ShipDate.getFullYear()}`;

                    html += `
                    <tr>
                                            <th style="vertical-align: top;"><input class="form-check-input gridCheck" type="checkbox" data-id="${element.OrderID}"></th>
                                            <th style="vertical-align: top;">${++index} </th>
                                            <th style="vertical-align: top;"><a href="#" onclick="addHDOrder(${element.OrderID})" class="card-link">${element.OrderCode}</a></th>
                                            <th style="vertical-align: top;">Admin</th>
                                            <th style="vertical-align: top;">${element.CustomerName}</th>
                                            <th style="vertical-align: top;">${element.CustomerPhone}</th>
                                            <th style="vertical-align: top;white-space: nowrap;">${element.Address}</th>
                                            <th style="vertical-align: top;"></th>
                                            <th style="vertical-align: top;"></th>
                                            <th style="vertical-align: top;">${element.TotalMoney}</th>
                                            <th style="vertical-align: top;">${element.MedthodPayment}</th>
                                            <th style="vertical-align: top;">${OrderDate}</th>
                                            <th style="vertical-align: top;">${_shipDate}</th>
                                            <th style="vertical-align: top;">${element.PaymentDate}</th>
                                            <th style="vertical-align: top;white-space: nowrap;">${element.Note}</th>
                                            <th style="vertical-align: top;">
                                               <button type="button" style="margin-left:50px" class="btn btn-info" onclick="Edit(${element.OrderID})">Sửa</button>
                                               <button type="button" style="margin-left:50px" onclick="removeOrder(${element.OrderID})" class="btn btn-danger">Xóa</button>
                                            </th>
                                        </tr>`;
                });
                $("#tbody_order_gtc").append(html);
            },
            error: function (err) {
                console.log(err)
            }
        });
    });
    $("#modal_order").on("hidden.bs.modal", function () {
        $('#tbody_product').empty();
        $('#orderid_order').val(0);
        $('#order_code').val("");
        $('#customer_name').val("");
        $('#customer_address').val("");
        $('#order_note').val("");
        $('#customer_phone').val("");
        $("#payment_method").val("");
    });
});
function confirmOrder()
{
    var ids = [];
    $(".gridCheck:checked").each(function () {
        // Perform actions on each checked element with class 'gridCheck'
        // For example, you can access attributes or perform operations
        var checkedElement = $(this); // 'checkedElement' refers to the current checked element in the loop

        // Accessing attributes or performing operations on the checked element
        var elementId = checkedElement.data('id'); // Get the ID of the checked element
        ids.push(elementId);

    });
    $.ajax({
        url: '/admin/order/confirm',
        type: 'Post',
        contentType: 'application/json',
        data: JSON.stringify(ids),
        success: function (result) {
            if (result == 1) {
                Swal.fire({
                    icon: 'success',
                    title: 'Oops...',
                    text: `Thành công`,
                    showConfirmButton: false,
                    timer: 1000
                });
                $("#borderedTab").find(".active").click();

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `Thất bại`,
                    showConfirmButton: false,
                    timer: 1000
                })
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function cancelOrder() {
    var ids = [];
    $(".gridCheck:checked").each(function () {
        // Perform actions on each checked element with class 'gridCheck'
        // For example, you can access attributes or perform operations
        var checkedElement = $(this); // 'checkedElement' refers to the current checked element in the loop

        // Accessing attributes or performing operations on the checked element
        var elementId = checkedElement.data('id'); // Get the ID of the checked element
        ids.push(elementId);

    });
    var dataToSend = JSON.stringify({ orderIDs: ids });
    $.ajax({
        url: '/admin/order/cancel',
        type: 'Post',
        contentType: 'application/json',
        data: JSON.stringify(ids),
        success: function (result) {
            if (result == 1) {
                Swal.fire({
                    icon: 'success',
                    title: 'Oops...',
                    text: `Thành công`,
                    showConfirmButton: false,
                    timer: 1000
                });
                $("#borderedTab").find(".active").click();

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `Thất bại`,
                    showConfirmButton: false,
                    timer: 1000
                })
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function payOrder() {
    var ids = [];
    $(".gridCheck:checked").each(function () {
        // Perform actions on each checked element with class 'gridCheck'
        // For example, you can access attributes or perform operations
        var checkedElement = $(this); // 'checkedElement' refers to the current checked element in the loop

        // Accessing attributes or performing operations on the checked element
        var elementId = checkedElement.data('id'); // Get the ID of the checked element
        ids.push(elementId);

    });
    var dataToSend = JSON.stringify({ orderIDs: ids });
    $.ajax({
        url: '/admin/order/payorder',
        type: 'Post',
        contentType: 'application/json',
        data: JSON.stringify(ids),
        success: function (result) {
            if (result == 1) {
                Swal.fire({
                    icon: 'success',
                    title: 'Oops...',
                    text: `Thành công`,
                    showConfirmButton: false,
                    timer: 1000
                });
                $("#borderedTab").find(".active").click();

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `Thất bại`,
                    showConfirmButton: false,
                    timer: 1000
                })
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function add() {
    $('#modal_order').modal('show');
}
function Edit(id) {
    $.ajax({
        url: '/admin/order/' + id,
        type: 'get',
        success: function (result) {
            if (result)
            {
                $('#orderid_order').val(result.OrderID);
                $('#order_code').val(result.OrderCode);
                $('#customer_name').val(result.CustomerName);
                $('#customer_address').val(result.Address);
                $('#order_note').val(result.Note);
                $('#customer_phone').val(result.CustomerPhone);
                $("#payment_method").val(result.MedthodPayment);

                if (result.prods.length > 0) {
                    result.prods.forEach(function (ele) {
                        addSanPham();
                        var newRow = $('#tbody_product').find('tr').last(); 
                        $(newRow).find(".item-prod").val(ele.ProductID);
                        $(newRow).find(".item-quantity").val(ele.Quantity);
                        $(newRow).find(".item-price").val(ele.Price);
                    });
                }
            }
          
            console.log(result);
        },
        error: function (err) {
            console.log(err)
        }
    });

    $('#modal_order').modal('show');
}
function addHDOrder(id) {
    $.ajax({
        url: '/admin/order/' + id,
        type: 'get',
        success: function (result) {
            if (result) {
                // Create a Date object from the input string
                var date = new Date(result.OrderDate);

                // Format the date to 'dd/MM/yyyy'
                var OrderDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

                // Initialize invoiceDetails object with basic details
                var invoiceDetails = {
                    date: OrderDate,
                    orderCode: result.OrderCode,
                    customerName: result.CustomerName,
                    customerPhone: result.CustomerPhone,
                    customerAddress: result.Address,
                    products: [],
                    totalPrice: 0,
                    totalPayment: 0
                };

                // Process products if available
                if (result.prods && result.prods.length > 0) {
                    result.prods.forEach(function (ele) {
                        // Push individual product details into products array
                        invoiceDetails.products.push({
                            name: ele.Name + " | " + ele.Skus,
                            quantity: ele.Quantity,
                            price: ele.Price
                        });
                    });

                    // Calculate total price for products
                    invoiceDetails.totalPrice = invoiceDetails.products.reduce(function (accumulator, product) {
                        return accumulator + product.price;
                    }, 0);

                    // Set totalPayment same as totalPrice initially
                    invoiceDetails.totalPayment = invoiceDetails.totalPrice;
                }

                // Populate invoice details in the modal
                populateInvoiceDetails(invoiceDetails);
            }

            console.log(result);
        },
        error: function (err) {
            console.log(err);
        }
    });
    $('#showHD').modal('show');
}

function validate() {
    var count = 0;
    var orderCode = $('#order_code').val();
    if (orderCode == '') {
        count++;
    }
    //if (count > 0) {
    //    Swal.fire({
    //        icon: 'error',
    //        title: 'Oops...',
    //        text: 'Không thể lưu',
    //        showConfirmButton: false,
    //        timer: 1000
    //    })
    //    return false;
    //}
    return true;
}

function createOrder() {
    if (!validate()) return;
    var order = {
        OrderID: parseInt($('#orderid_order').val()),
        CustomerName: $('#customer_name').val(),
        Address: $('#customer_address').val(),
        Note: $('#order_note').val(),
        CustomerPhone: $('#customer_phone').val(),
        MedthodPayment: $("#payment_method").val(),
    }
    var prods = [];
    $(".pick-prod").each(function (index) {
        prods.push({
            ProductID: $(this).find(".item-prod").val(),
            Quantity: $(this).find(".item-quantity").val(),
            Price: $(this).find(".item-price").val()
        });
    });
    order.prods = prods;
    console.log(prods);
    $.ajax({
        url: '/admin/order/create',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify(order),
        success: function (result) {
            if (result == 1) {
                Swal.fire({
                    icon: 'success',
                    title: 'Oops...',
                    text: `Thành công`,
                    showConfirmButton: false,
                    timer: 1000
                })
                $("#modal_order").modal("hide");
                $("#borderedTab").find(".active").click();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `Thất bại`,
                    showConfirmButton: false,
                    timer: 1000
                })
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function remove(event) {
    //// Get the element that was clicked
    //var clickedElement = event.target;
    //console.log($(event).parent().parent());

    //// Perform actions on the clicked element
    //// For instance, you can remove the parent element of the clicked button
    ////$(clickedElement.parentNode.parentNode).parent().remove();
    //clickedElement.parentNode.parentNode.remove();
}
function addSanPham() {
    // Tạo HTML cho sản phẩm mới
    var htmlOption = '<option value="0" selected disabled>--Chọn sản phẩm--</option>';
    var select2Prod = "";
    if (productList.length > 0) {
        productList.forEach(function (element) {
            select2Prod += ` <option value="${element.ProductSkuID}" data-price="${element.Price}" >${element.ProductName} | ${element.Sku}| ${element.Price}</option>`;
        });
    }
    var html = `
     <tr class="pick-prod">
        <td class="text-center" onclick="remove(event)"><a class="btn btn-sm btn-danger trash-button" ><i class="bx bx-trash"></i></a></td>
        <td class="text-start">
            <select class="form-control item-prod" onchange="changeProd(this)">
            ${select2Prod}
            </select>
        </td>
        <td class="text-end ">
            <input type="number" class="form-control item-quantity" onchange="changeProd(this)"/>
        </td>
        <td class="text-end ">
            <input type="number" class="form-control item-price" readonly style="background-color: #f9f4ee;" />
        </td>

    </tr>`;

    // Thêm HTML sản phẩm mới vào tbody_product
    $('#tbody_product').append(html);

    // Thêm option vào select2
    $(`#abc`).html(htmlOption);
    $(`#abc`).select2({
        dropdownParent: $("#modal_order"),
        theme: "bootstrap-5",
    });

    // Tăng giá trị index
    // index++;
}

//function addOrder() {
//    // Tạo HTML cho sản phẩm mới
//    var htmlOption = '<option value="0" selected disabled>--Chọn sản phẩm--</option>';

//    var html = `
//     <th><button class="nav-link active" id="home-tabs" data-bs-toggle="tab" data-bs-target="#bordered-home" type="button" role="tab" aria-controls="home" aria-selected="true">Hoán đơn 1</button></th>`;

//    // Thêm HTML sản phẩm mới vào tbody_product
//    $('#tbody_add_order').append(html);

//    // Thêm option vào select2


//    // Tăng giá trị index
//    index++;
//}

function removeOrder(id)
{
    $.ajax({
        url: '/admin/order/delete/'+ id,
        type: 'Post',
        success: function (result) {
            if (result == 1) {
                Swal.fire({
                    icon: 'success',
                    title: 'Oops...',
                    text: `Thành công`,
                    showConfirmButton: false,
                    timer: 1000
                });
                $("#borderedTab").find(".active").click();

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `Thất bại`,
                    showConfirmButton: false,
                    timer: 1000
                })
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function changeProd(element) {
    var parentCurrent = $(element).parent().parent();
    var selectedPrice = parentCurrent.find('option:selected').data('price'); // Get the data-price attribute of the selected option
    console.log("Selected price: " + selectedPrice);
    var quantity = parentCurrent.find(".item-quantity").val();
    if (quantity > 0 && selectedPrice >0) {
        parentCurrent.find(".item-price").val(quantity * selectedPrice);
    }
}
// Function to populate the invoice details
function populateInvoiceDetails(data) {
    document.getElementById('dateExport').textContent = data.date;
    document.getElementById('orderCodeExport').textContent = data.orderCode;
    document.getElementById('customerNameExport').textContent = data.customerName;
    document.getElementById('customerPhoneExport').textContent = data.customerPhone;
    document.getElementById('customerArdessExport').textContent = data.customerAddress;

    var prodTable = document.querySelector('.prodOrderExport');
    prodTable.innerHTML = ''; // Clear existing rows

    data.products.forEach(function (product) {
        var row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>${product.price}</td>
        `;
        prodTable.appendChild(row);
    });

    document.getElementById('totalPriceExport').textContent = data.totalPrice;
    document.getElementById('totalPayport').textContent = data.totalPayment;
}
setTimeout(function () {
    $("#home-tab").click();
}, 500)
