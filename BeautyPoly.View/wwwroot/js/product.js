var arrCategory = [];
var arrOption = [];
var arrOptionValue = [];
var arrProduct = [];
var arrProductImage = [];
var arrProductSku = [];
var index = 1;
class DynamicArrayCombiner {
    constructor() {
        this.arrays = [];
        this.combinations = [];
    }

    addArray(array) {
        this.arrays.push(array);
        this.generateCombinations();
    }

    removeArray(array) {
        const index = this.arrays.indexOf(array);
        if (index !== -1) {
            this.arrays.splice(index, 1);
            this.generateCombinations();
        }
    }
    removeAllArrays() {
        this.arrays = [];
        this.generateCombinations();
    }
    generateCombinations() {
        const result = [];

        const combineArrays = (currentCombo, arrayIndex) => {
            if (arrayIndex === this.arrays.length) {
                result.push(currentCombo.join(" - "));
                return;
            }

            const currentArray = this.arrays[arrayIndex];
            for (const item of currentArray) {
                currentCombo.push(item);
                combineArrays(currentCombo, arrayIndex + 1);
                currentCombo.pop();
            }
        };

        combineArrays([], 0);
        this.combinations = result;
    }
}



const arrayCombiner = new DynamicArrayCombiner();
const arrayCombinerText = new DynamicArrayCombiner();

$(document).ready(function () {
    //GetCategory();
    GetOption();
    GetAllOptionValue();
    GetProduct();
    GetProductSku();
    $('#uploadBtn').click(function () {
        $('#fileInput').click();
    });

    $('#fileInput').change(function () {
        displayImages(this.files);
    });

})

function GetProduct() {
    $.ajax({
        url: '/admin/product/get-product',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        //   data: JSON.stringify(objProduct),
        success: function (result) {
            arrProduct = result;
            var html = '';
            var htmlCombo = '<option value="0">--Chọn sản phẩm</option>';

            $.each(result, (key, item) => {
                var classColor = ''
                if (item.IsDelete) {
                    classColor = 'bg-danger'
                }
                html += `<tr class="${classColor} text-wrap">
                            <td class='text-center'>  <button class="btn btn-success btn-sm" onclick="editProduct(${item.ProductID})">
                                <i class="bx bx-pencil"></i>
                                </button>
                                <button class="btn btn-danger btn-sm" onclick="DeleteProduct(${item.ProductID})">
                                    <i class="bx bx-trash"></i>
                                </button>
                                 <button class="btn btn-info btn-sm" onclick="loadImage(${item.ProductID})">
                                    <i class="bx bx-image"></i>
                                </button>
                                </td>
                            <td class='text-center'>${item.STT}</td>
                            <td class='text-center'>${item.ProductCode}</td>
                            <td>${item.ProductName}</td>
                            <td class='text-end'>${item.TotalQuantity}</td>
                            <td class='text-center'>${item.StatusInventoryText}</td>
                        </tr>`;
                htmlCombo += `<option value="${item.ProductID}">${item.ProductCode}</option>`
            });
            $('#tbody_product').html(html);
            $('#product_id_product_sku').html(htmlCombo);
            $('#product_id_product_sku').select2({
                dropdownParent: $("#modal_product_sku"),
                theme: "bootstrap-5",
                width: 'resolve'
            });
        },
        error: function (err) {
            console.log(err)
        }
    });
}

function GetProductSku() {
    $.ajax({
        url: '/admin/product/get-product-sku',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        //   data: JSON.stringify(objProduct),
        success: function (result) {
            arrProductSku = result;
            var html = '';

            $.each(result, (key, item) => {
                var classColor = ''
                if (item.IsDelete) {
                    classColor = 'bg-danger'
                }
                html += `<tr class="${classColor} text-wrap">
                            <td class='text-center'>  <button class="btn btn-success btn-sm" onclick="editProductSku(${item.ProductSkusID})">
                                <i class="bx bx-pencil"></i>
                                </button>
                                <button class="btn btn-danger btn-sm" onclick="DeleteProductSku(${item.ProductSkusID})">
                                    <i class="bx bx-trash"></i>
                                </button>
                                </td>
                            <td class='text-center'>${item.STT}</td>
                            <td class='text-center'>${item.Sku}</td>
                            <td>${item.ProductSkuName}</td>
                            <td class='text-end'>${item.Quantity}</td>
                            <td class='text-center'>${item.CapitalPrice}</td>
                            <td class='text-center'>${item.Price}</td>
                        </tr>`
            });
            $('#tbody_product_sku').html(html);
        },
        error: function (err) {
            console.log(err)
        }
    });
}

function addProductSku() {
    $('#product_id_product_sku').val(0);

    $('#modal_product_sku').modal('show');

}

function editProductSku(id) {
    $.ajax({
        url: '/admin/product/get-product-sku-by-id',
        type: 'GET',
        dataType: 'json',
        //contentType: 'application/json;charset=utf-8',
        data: { productSkuID: id },
        success: function (result) {
            $.ajax({
                url: '/admin/product/get-product-detail',
                type: 'GET',
                dataType: 'json',
                //contentType: 'application/json;charset=utf-8',
                data: { productSkuID: id, productID: result.ProductID },
                success: function (result1) {
                    $('#product_id_product_sku').val(result.ProductID).trigger('change');
                    $('#product_sku_id_product_sku').val(id);
                    $.each(result1.Item2, (key,item) => {
                        addOption();
                        var idx = index - 1;
                        $(`#option_product_${idx}`).val(item.OptionID).trigger('change');
                        GetOptionValue(item.OptionID, `option_product_${idx}`)
                            .then(() => {
                                var optionValue = result1.Item1.find(p => p.OptionDetailsID == item.OptionDetailsID).OptionValueID;
                                $(`#option_value_product_${idx}`).select2({
                                    maximumSelectionLength: 1
                                })
                                $(`#option_value_product_${idx}`).val(optionValue).trigger('change');
                            })
                            .catch(error => {
                                console.error("Error fetching option value:", error);
                            });
                    });
                    
                    $('#modal_product_sku').modal('show');
                },
                error: function (err) {
                    console.log(err)
                }
            });
        },
        error: function (err) {
            console.log(err)
        }
    });
   
}


function DeleteProductSku(id) {

}

function loadImage(id) {
    $('#modal_product_image').modal('show');
    $('#product_id_product_image');
    GetProductImage(id);
}

function saveImage() {

}

function GetProductImage(id) {
    $('.imagePreviewContainer').empty();
    $.ajax({
        url: '/admin/product/get-product-image',
        type: 'GET',
        dataType: 'json',
        //contentType: 'application/json;charset=utf-8',
        data: { productID: id },
        success: function (result) {
            arrProductImage = result;
            console.log(result)
            $.each(arrProductImage, (key, item) => {
                var stringPath = `/images/${item.Image}`;
                convertImagePathToBase64(stringPath, function (base64) {
                    var html = `<div class="col-4 ps-1 pe-1 mb-4 image-container" style="max-height:370px;position: relative;">
                            <a class="btn text-danger" onclick="removeImage(this)" style="cursor:pointer; position: absolute; top: 4px; right: 4px;"><i class="bi bi-trash"></i></a>
                            <img src="${base64}" width="100%" height="100%" />
                        </div>`;
                    $('.imagePreviewContainer').append(html);
                });
            });
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function convertImagePathToBase64(imagePath, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
            // Chuỗi Base64 được lưu trong reader.result
            callback(reader.result);
        };
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', imagePath);
    xhr.responseType = 'blob';
    xhr.send();
}

function editProduct(id) {
    $.ajax({
        url: '/admin/product/get-product-by-id',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: { ID: id },
        success: function (result) {
            $('#product_id_product').val(result.ProductID);
            $('#product_code_product').val(result.ProductCode);
            $('#product_name_product').val(result.ProductName);
            $('#cate_id_product').val(result.CateID);
            GetProductImage(result.ProductID);
            $('#modal_product').modal('show');
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function DeleteProduct(id) {
    var product = arrProduct.find(p => p.ProductID == id);
    Swal.fire({
        title: `Bạn có chắc muốn xóa Mã sản phẩm [${product.ProductCode}] này không?`,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Có',
        denyButtonText: 'Không'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/admin/product/delete-product',
                type: 'DELETE',
                dataType: 'json',
                //contentType: 'application/json;charset=utf-8',
                data: { productID: product.ProductID },
                success: function (result) {
                    if (result == 1) {
                        GetProduct();
                    }
                },
                error: function (err) {
                    console.log(err)
                }
            });
        }
    });
  
}

function displayImages(files) {
    var previewContainer = $('#imagePreviewContainer');
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var reader = new FileReader();
        reader.onload = function (e) {
            var html = `<div class="col-4 ps-1 pe-1 mb-4 image-container" style="max-height:370px;position: relative;">
                            <a class="btn text-danger" onclick="removeImage(this)" style="cursor:pointer; position: absolute; top: 4px; right: 4px;"><i class="bi bi-trash"></i></a>
                            <img src="${e.target.result}" width="100%" height="100%" />
                        </div>`;
            previewContainer.append(html);
        };
        reader.readAsDataURL(file);
    }
}
function removeImage(button) {
    $(button).closest('.col-4').remove();
    $('#fileInput').val(null);
}
function addProduct() {
    $('#imagePreviewContainer').empty();
    $('#product_code_product').val('');
    $('#product_name_product').val('');
    $('#cate_id_product').val(0);
    $('#product_id_product').val(0);
    $('#modal_product').modal('show');
}


//function GetCategory() {
//    $.ajax({
//        url: '/admin/category/getall',
//        type: 'GET',
//        dataType: 'json',
//        contentType: 'application/json;charset=utf-8',
//        success: function (result) {
//            arrCategory = result;
//            var html = '<option selected disabled>--Chọn danh mục--</option>';
//            $.each(result, function (key, item) {
//                html += ` <option value="${item.cateId}">${item.cateName}</option>`
//            });

//            $('#cate_id_product').html(html);
//        },
//        error: function (err) {
//            console.log(err)
//        }
//    });
//}



function addOption() {
    var htmlOption = '<option value="0" selected disabled>--Chọn thuộc tính--</option>';
    $.each(arrOption, function (key, item) {
        htmlOption += `<option value="${item.OptionID}">${item.OptionName}</option>`
    });

    var html = `<div class="row mt-2">
                    <div class="col-12 col-md-4">
                        <select class="form-control" id="option_product_${index}" onchange="GetOptionValue(this.value,this.id)" >
                        </select>
                    </div>
                    <div class="col-12 col-md-4" id="div_option_value_${index}">
                    </div>
                      <div class="col-12 col-md-4">
                        <div class="d-flex justify-content-end">
                            <button class="btn text-danger" onclick="deleteRow(this)"><i class="bi bi-trash"></i></button>
                        </div>
                    </div>
                </div>`
    $('#option_value_product').append(html);
    $(`#option_product_${index}`).html(htmlOption);
    $(`#option_product_${index}`).select2({
        dropdownParent: $("#modal_product_sku"),
        theme: "bootstrap-5",
    })
    index++;
}


function GetOptionValue(id, selectID) {
    var i = selectID.split('_')[2];
    return $.ajax({
        url: '/admin/option/getallvalue',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: { optionID: id },
        success: function (result) {
            $(`#option_value_product_${i}`).select2('destroy');
            var html = ` <select class="form-control" id="option_value_product_${i}" state="states" multiple="multiple">
                </select> `
            $(`#div_option_value_${i}`).html(html);
            var htmlValue = ''
            $.each(result, function (key, item) {
                htmlValue += `<option value="${item.OptionValueID}" >${item.OptionValueName}</option>`
            })
            $(`#option_value_product_${i}`).html(htmlValue);
            $(`#option_value_product_${i}`).select2({
                dropdownParent: $("#modal_product_sku"),
                placeholder: '---Chọn giá trị---',
                theme: "classic"
            });
            $(`#option_value_product_${i}`).on('change', function () {
                optionValueChange();
            });
        },
        error: function (err) {
            console.log(err)
        }
    });
}


function GetOption() {
    $.ajax({
        url: '/admin/product/get-option',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (result) {
            arrOption = result;
        },
        error: function (err) {
            console.log(err)
        }
    });
}

function deleteRow(button) {
    // Find the parent row element and remove it
    const row = button.closest('.row');
    if (row) {
        row.remove();
        optionValueChange()
    }
}

function addOption1() {
    $('#modal_option').modal('show');
}

function GetAllOptionValue() {
    $.ajax({
        url: '/admin/product/get-option-value',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (result) {
            arrOptionValue = result;
        },
        error: function (err) {
            console.log(err)
        }
    });
}


function optionValueChange() {
    arrayCombiner.removeAllArrays();
    arrayCombinerText.removeAllArrays();
    var allSelectedValues = [];
    var allSelectText = [];
    for (var j = 1; j <= index; j++) {
        var values = $(`#option_value_product_${j}`).val();

        if (values && values.length > 0) {
            var texts = arrOptionValue.filter(p => values.map(Number).includes(p.OptionValueID)).map(o => o.OptionValueName);

            allSelectedValues.push(values);
            allSelectText.push(texts);
        }
    }

    for (var j = 0; j < allSelectedValues.length; j++) {
        arrayCombiner.addArray(allSelectedValues[j]);
        arrayCombinerText.addArray(allSelectText[j]);
    }
    var productVariants = arrayCombinerText.combinations;
    var combinedArray = [];

    for (var i = 0; i < arrayCombinerText.combinations.length; i++) {
        var combinedObject = {
            value: arrayCombiner.combinations[i],
            text: arrayCombinerText.combinations[i]
        };
        combinedArray.push(combinedObject);
    }


    var html = '';


    var indexRow = 1;
    $.each(combinedArray, function (key, item) {
        html += `<tr id="row_option_value_product_${indexRow}">
                    <td>${item.text}</td>
                    <td><input type="number" id="capital_price_sku_${indexRow}" class="text-end form-control" value="0" /></td>
                    <td><input type="number" id="price_sku_${indexRow}" class="text-end form-control" value="0" /></td>
                    <td><input type="number" id="quantity_sku_${indexRow}" class="text-end form-control" value="0" /></td>
                    <td><input type="text" id="option_value_sku_${indexRow}" class="text-end form-control" value="${item.value}" hidden/></td>
                </tr>`
        indexRow++;
    });
    $("#tbody_product_detail").html(html);
}

function validate() {
    var productCode = $('#product_code_product');
    var productName = $('#product_name_product');
    var cateId = $('#cate_id_product');

    productCode.removeClass('is-invalid');
    productName.removeClass('is-invalid');
    cateId.removeClass('is-invalid');

    var productCodeValue = productCode.val().trim();
    var productNameValue = productName.val().trim();
    var cateIdValue = parseInt(cateId.val());

    if (productCodeValue === '') {

        productCode.addClass('is-invalid');
    }
    if (productNameValue === '') {

        productName.addClass('is-invalid');
    }
    if (isNaN(cateIdValue) || cateIdValue <= 0) {

        cateId.addClass('is-invalid');
    }
    if (productCodeValue === '' || productNameValue === '' || isNaN(cateIdValue) || cateIdValue <= 0) {
        return false;
    }
    var uniqueOptionIDs = [];

    $('select[id*="option_product_"]').each(function () {
        var optionID = parseInt($(this).val());

        if (uniqueOptionIDs.includes(optionID)) {
            $(this).addClass('is-invalid');
            return false;
        } else {
            uniqueOptionIDs.push(optionID);
            $(this).removeClass('is-invalid');
        }
    });

    return true;
}

function saveProduct() {
    var productCode = $('#product_code_product').val();
    var productName = $('#product_name_product').val();
    var cateId = parseInt($('#cate_id_product').val());
    var selectedImages = [];
    var id = parseInt($('#product_id_product').val());
    $('.image-container').each(function () {
        var imageSource = $(this).find('img').attr('src');
        selectedImages.push(imageSource);

    });
    var objProduct = {
        ProductCode: productCode,
        ProductName: productName,
        CateID: cateId,
        Images: selectedImages,
        ID: id
    }
    $.ajax({
        url: '/admin/product/create',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify(objProduct),
        success: function (result) {
            $('#modal_product').modal('hide');
            GetProduct();
        },
        error: function (err) {
            console.log(err)
        }
    });
}

function save() {
    var listOptionID = [];
    var listSku = [];
    var productID = parseInt( $('#product_id_product_sku').val());
    var id = parseInt($('#product_sku_id_product_sku').val());
    $('select[id*="option_product_"]').each(function () {
        var optionID = parseInt($(this).val());
        listOptionID.push(optionID);
    });

    $('tr[id*="row_option_value_product_"]').each(function () {
        var id = $(this).attr('id');
        var numberId = id.substring(id.lastIndexOf('_') + 1);
        var capitalPrice = parseFloat($(`#capital_price_sku_${numberId}`).val());
        var price = parseFloat($(`#price_sku_${numberId}`).val());
        var quantity = parseInt($(`#quantity_sku_${numberId}`).val());
        var optionValueID = $(`#option_value_sku_${numberId}`).val();
        var objSku = {
            CapitalPrice: capitalPrice,
            Price: price,
            Quantity: quantity,
            OptionValueID: optionValueID
        }
        listSku.push(objSku);
    });
    var obj = {
        ListOptionID: listOptionID,
        ListSku: listSku,
        ProductID: productID,
        ID: id
    }
    $.ajax({
        url: '/admin/product/create-sku',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify(obj),
        success: function (result) {
            if (result == 1) {
                $('#modal_product_sku').modal('hide');
                GetProductSku();
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}

