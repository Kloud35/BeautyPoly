$(document).ready(function () {
    GetCart();
});

function GetCart() {
    $.ajax({
        url: '/Cart/GetProductInCart',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (result) {
            var groupedData = {};
            $.each(result, function (key, item) {
                const productName = item.ProductName;

                if (!groupedData[productName]) {
                    groupedData[productName] = [];
                }

                groupedData[productName].push(item);
            });

            var html = '';
            var totalMoney = 0;

            for (const productName in groupedData) {
                if (groupedData.hasOwnProperty(productName)) {
                    const productList = groupedData[productName];
                    const groupId = generateUniqueId(); // Function to generate a unique identifier

                    // Hiển thị tên sản phẩm nhóm
                    html += `<tr class="tbody-item group-title" data-group-id="${groupId}">
                                <td colspan="6" class="product-group-title text-start fw-bolder fs-5" style="background-color:wheat">
                                   Sản phẩm: ${productName}
                                </td>
                            </tr>`;

                    // Hiển thị sản phẩm trong nhóm
                    $.each(productList, function (index, product) {
                        html += `<tr class="tbody-item group-content ${groupId}" >
                                <td class="product-remove">
                                    <a class="remove" href="javascript:void(0)">×</a>
                                </td>
                                <td class="product-thumbnail">
                                    <div class="thumb">
                                        <a href="single-product.html">
                                            <img src="/images/${product.Image}" width="68" height="84" style="height: 84px !important;" alt="">
                                        </a>
                                    </div>
                                </td>
                                <td class="product-name">
                                    <a class="title" href="single-product.html">${product.ProductSkuName}</a>
                                </td>
                                <td class="product-price">
                                    <span class="price">${formatCurrency.format(product.Price)}</span>
                                </td>
                                <td class="product-quantity">
                                    <div class="pro-qty">
                                        <input type="text" class="quantity" title="Quantity" value="${product.QuantityCart}">
                                    </div>
                                </td>
                                <td class="product-subtotal">
                                    <span class="price">${formatCurrency.format(product.QuantityCart * product.Price)}</span>
                                </td>
                            </tr>`;
                        totalMoney += product.QuantityCart * product.Price;
                    });
                }
            }

            $('#total_amount').text(formatCurrency.format(totalMoney));

            $('#tbody_cart').html(html);

            $(document).on('click', '.group-title', function () {
                const groupId = $(this).data('group-id');
                $(`.group-content.${groupId}`).toggle();
            });
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// Function to generate a unique identifier
function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
}