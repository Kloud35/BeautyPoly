var arrLocationCustomer = [];
var listProvin = []
var listDistrict = []
var listWard = []
var locationIndex = 0;
var index = 2;
$(document).ready(function () {
    $("#user_name").text(GetUserName());
    $("#user_name_manager").text(GetUserName());
    $("#user_name_managers").text(GetUserName());
    GetProvin();
    GetDistrict();

});

function GetProvin() {
    return $.ajax({
        url: '/admin/potentialcustomer/getlistprovin',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (result) {
            if (result.code === 200) {
                listProvin = result.data;
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}
function GetDistrict() {
    return $.ajax({
        url: '/admin/potentialcustomer/getlistcistrict',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (result) {
            if (result.code === 200) {
                listDistrict = result.data;
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function GetAllLocation() {
    $.ajax({
        url: `/admin/potentialcustomer/locations?CustomerID=${GetUserId()}`,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (result) {
            arrLocationCustomer = result;
            $("#list-location tr").remove();
            $("#locationContainer div").remove();
            $.each(arrLocationCustomer, function (key, item) {
                locationIndex = key;
                var html = `
                    <tr>
                        <td>${item.provinceName}</td>    
                        <td>${item.districtName}</td>    
                        <td>${item.wardName}</td>    
                        <td>${item.address}</td>
                        <td>
                            <button class="btn btn-success" onclick="UpdateLocation(${item.locationCustomerID})">
                                <i class="bx bx-pencil"></i>
                            </button>
                            <button class="btn btn-danger" onclick="deleteLocation(${item.locationCustomerID})">
                                    <i class="bx bx-trash"></i>
                            </button>
                        </td>
                    </tr>
                `
                $("#list-location").append(html);
            });
        },
        error: function (err) {
            console.log(err)
        }
    });
}

function addLocation() {
    $("#locationContainer div").remove();
    locationIndex++;
    var html = `
                 <div class="card border border-end-0 border-bottom-0 border-start-0 border-success mt-2">
                    <div class="row p-1 m-1">
                        <div class="col-md-4 col-12">
                            <span>Tỉnh thành</span><span class="text-danger">(*)</span>
                            <span class="text-danger" id="mess_provin"></span>
                            <select class="form-select" id="provin_location" aria-label="Default select example" onchange="change(this)">
                                <option selected value="0">Chọn tỉnh thành</option>`
    listProvin.forEach(el => {
        html += `<option value="${el.ProvinceID}">${el.ProvinceName}</option>`
    })
    html += `</select>
                        </div>
                        <div class="col-md-4 col-12">
                            Quận huyện<span class="text-danger">(*)</span>
                            <span class="text-danger" id="mess_district"></span>
                            <select class="form-select" id="district_location" aria-label="Default select example" onchange="districtChange(this)">
                                <option selected value="0">Chọn quận huyện </option>
                            </select>
                        </div>
                        <div class="col-md-4 col-12">
                            <span>Phường xã<span class="text-danger">(*)</span></span>
                            <span class="text-danger" id="mess_ward"></span>
                            <select class="form-select" id="ward_location" name="ward" aria-label="Default select example">
                                <option selected value="0">Chọn Phường Xã</option>
                            </select>
                        </div>
                        <div class="col-12 mt-2">
                            <div class="form-floating md-3">
                                <input type="email" class="form-control" id="customer_address_location" placeholder="Địa chỉ cụ thể">
                                <label for="customer_address_location">Địa chỉ cụ thể</label>
                            </div>
                        </div>
                    </div>
                <div class="d-flex justify-content-end">
                    <button onclick="createLocation()">Save</button>
                </div>
                 </div>
            `;
    $("#locationContainer").append(html);
    locationIndex++; // Tăng index cho việc tạo ID và Name duy nhất
}
function UpdateLocation(id) {
    console.log("ID: ",id);
    $("#locationContainer div").remove();
    locationIndex++;
    arrLocationCustomer.forEach(item => {
        if (item.locationCustomerID == id) {
            var html = `
                 <div class="card border border-end-0 border-bottom-0 border-start-0 border-success mt-2">
                    <input id="locationCustomerID" value="${id}" hidden />
                    <div class="row p-1 m-1">
                        <div class="col-md-4 col-12">
                            <span>Tỉnh thành</span><span class="text-danger">(*)</span>
                            <span class="text-danger" id="mess_provin"></span>
                            <select class="form-select" id="provin_location" aria-label="Default select example" onchange="change(this)">
                                <option value="0">Chọn tỉnh thành</option>`
            listProvin.forEach(el => {
                html += `<option `;
                if (el.ProvinceID === item.provinceID) {
                    html += ` selected `;
                }
                html += ` value = "${el.ProvinceID}" > ${el.ProvinceName}</option >`
            })
            html += `
                    </select>
                        </div>
                        <div class="col-md-4 col-12">
                            Quận huyện<span class="text-danger">(*)</span>
                            <span class="text-danger" id="mess_district"></span>
                            <select class="form-select" id="district_location" aria-label="Default select example" onchange="districtChange(this)">
                                <option value="0">Chọn quận huyện </option>`;
            listDistrict.forEach(el => {
                if (el.ProvinceID == item.provinceID) {
                    html += `<option `;
                    if (el.DistrictID == item.districtID) {
                        html += ` selected `;
                    }
                    html += ` value = "${el.DistrictID}" > ${el.DistrictName}</option >`
                }
            });
            html += `
                    </select>
                        </div>
                            <div class="col-md-4 col-12">
                            <span>Phường xã<span class="text-danger">(*)</span></span>
                            <span class="text-danger" id="mess_ward"></span>
                            <select class="form-select" id="ward_location" name="ward" aria-label="Default select example">
                                <option selected value="0">Chọn Phường Xã</option>
                            </select >
                        </div>
                        <div class="col-12 mt-2">
                            <div class="form-floating md-3">
                                <input type="text" class="form-control" id="customer_address_location" placeholder="Địa chỉ cụ thể" value="${item.address}">
                                <label for="customer_address_location">Địa chỉ cụ thể</label>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-end">
                        <button onclick="updateLocation()">Update</button>
                    </div>
                 </div>
            `;
            $("#locationContainer").append(html);
            GenarateWardSelected(item.districtID, item.WardID)
        }
    });
    locationIndex++; // Tăng index cho việc tạo ID và Name duy nhất
}
function GenarateWardSelected(id_ward, id_selected) {
    return $.ajax({
        url: '/admin/potentialcustomer/getlistward',
        type: 'GET',
        dataType: 'json',
        data: {
            idWard: id_ward
        },
        contentType: 'application/json',
        success: function (result) {
            $(`#ward_location option`).remove();
            $(`#ward_location`).append(new Option("-- Chọn phường/xã --", 0));
            $.each(result.data, function (key, val) {
                if (val.WardID === id_selected) {
                    $(`#ward_location`).append(new Option(val.WardName, val.WardCode, false, true));
                }
                else {
                    $(`#ward_location`).append(new Option(val.WardName, val.WardCode, false, false));
                }
            });
        }
    });
}
function change(el) {
    var id_provin = parseInt(el.value);
    GenarateDistrict(id_provin);
}
function GenarateDistrict(id_provin) {
    return $.ajax({
        url: '/admin/potentialcustomer/getlistcistrict',
        type: 'GET',
        dataType: 'json',
        data: {
            idProvin: id_provin
        },
        contentType: 'application/json',
        success: function (result) {
            $(`#district_location option`).remove();
            $(`#district_location`).append(new Option("-- Chọn quận/huyện --", 0));
            $.each(result.data, function (key, val) {
                $(`#district_location`).append(new Option(val.DistrictName, val.DistrictID));
            });
        },
        error: function (err) {
            console.log(err);
        }
    });
}
function GenarateWard(id_ward) {
    return $.ajax({
        url: '/admin/potentialcustomer/getlistward',
        type: 'GET',
        dataType: 'json',
        data: {
            idWard: id_ward
        },
        contentType: 'application/json',
        success: function (result) {
            $(`#ward_location option`).remove();
            $(`#ward_location`).append(new Option("-- Chọn phường/xã --", 0));
            $.each(result.data, function (key, val) {
                $(`#ward_location`).append(new Option(val.WardName, val.WardCode));
            });
        }
    });
}
function districtChange(el) {
    //loadTotal();
    var id_district = parseInt(el.value);
    GenarateWard(id_district);
}
function updateLocation() {
    var locationCustomerID = parseInt($(`#locationCustomerID`).val());
    var provin = parseInt($(`#provin_location`).val());
    var distric = parseInt($(`#district_location`).val());
    var ward = parseInt($(`#ward_location`).val());
    var addss = $(`#customer_address_location`).val();
    var obj = {
        LocationCustomerID: locationCustomerID,
        PotentialCustomerID: GetUserId(),
        ProvinceID: provin,
        DistrictID: distric,
        WardID: ward,
        address: addss,
        IsDefault: true,
        IsDelete: true
    }
    $.ajax({
        url: '/admin/potentialcustomer/locations',
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify(obj),
        success: function (result) {
            if (result == 1) {
                GetAllLocation();
                //Swal.fire('Thành công !', '', 'success')
                $('#modal_customer').modal('hide');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `${result}`,
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
function deleteLocation(id) {
    $.ajax({
        url: `/admin/potentialcustomer/deletelocation?id_location=${id}`,
        type: 'DELETE',
        success: function (result) {
            if (result == 1) {
                GetAllLocation();
                //Swal.fire('Thành công !', '', 'success')
                $('#modal_customer').modal('hide');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `${result}`,
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
function createLocation() {
    var provin = parseInt($(`#provin_location`).val());
    var distric = parseInt($(`#district_location`).val());
    var ward = parseInt($(`#ward_location`).val());
    var addss = $(`#customer_address_location`).val();
    var obj = {
        PotentialCustomerID: GetUserId(),
        ProvinceID: provin,
        DistrictID: distric,
        WardID: ward,
        address: addss,
        IsDefault: true,
        IsDelete: true
    }
    $.ajax({
        url: '/admin/potentialcustomer/locations',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify(obj),
        success: function (result) {
            if (result == 1) {
                GetAllLocation();
                //Swal.fire('Thành công !', '', 'success')
                $('#modal_customer').modal('hide');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `${result}`,
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

/// JWT 

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}




function GetUserEmail() {
    const token = localStorage.getItem("Token");
    const decodedToken = parseJwt(token);
    var userId = decodedToken['Id'];
    return userId;
}