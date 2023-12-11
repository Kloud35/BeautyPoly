var arrAccount = [];
var arrRole = [];
$(document).ready(function () {
    GetAll();
    GetRole();
});

function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}
function GetAll() {
    var keyword = $('#account_keyword').val();
    $.ajax({
        url: '/admin/account/getall',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: { filter: keyword },
        success: function (result) {
            arrAccount = result;
            var html = '';
            $.each(result, function (key, item) {
                var isActive = item.isActive ? "checked" : ""
                var formattedDate = formatDate(item.createDate);
                html += `<tr>
                           <td>
                               <button class="btn btn-success btn-sm" onclick="edit(${item.accountID})">
                                    <i class="bx bx-pencil"></i>
                               </button>
                                <button class="btn btn-danger btn-sm" onclick="Delete(${item.accountID})">
                                    <i class="bx bx-trash"></i>
                                </button>
                            </td>
                            <td>${item.accountCode}</td>
                            <td>${item.fullName}</td>
                            <td>${item.roleName}</td>
                            <td>${item.email}</td>
                            <td>${item.phone}</td>
                            <td>${formattedDate}</td> <!-- Thay đổi ở đây -->
                            <td>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked" ${isActive}>
                                </div>
                            </td>
                        </tr>`;
            });
            $('#tbody_account').html(html);
        },
        error: function (err) {
            console.log(err)
        }
    });
}


function GetRole() {
    $.ajax({
        url: '/admin/role/getall',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: { filter: '' },
        success: function (result) {
            arrRole = result;
            var html = '';
            $.each(result, function (key, item) {
                if (!item.isDelete) {
                    html += `<option value="${item.roleID}">${item.roleName}</option>`
                }
            });
            $('#id_roleaccount').html(html);
        },
        error: function (err) {
            console.log(err)
        }
    });
}

function validate() {
    var count = 0;
    var fullName = $('#account_fullname_account').val();
    var accountCode = $('#account_code_account').val();
    if (fullName == '') {

        count++;
    }
    if (count > 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Không được để trống tên tài khoản',
            showConfirmButton: false,
            timer: 1000
        })
        return false;
    }

    if (accountCode == '') {

        count++;
    }
    if (count > 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Không được để trống mã tài khoản',
            showConfirmButton: false,
            timer: 1000
        })
        return false;
    }
    return true;
}

function create() {
    if (!validate()) return;
    var id = parseInt($('#accountid_account').val());
    var accountCode = $('#account_code_account').val();
    var fullName = $('#account_fullname_account').val();
    var accountRole = parseInt($('#id_roleaccount').val());
    var email = $('#account_email_account').val();
    var phone = $('#account_phone_account').val();
    var isActive = $('#isactive_account').prop('checked');
    var roleID = $('#id_roleaccount').val();

    debugger;
    var obj = {
        AccountID: id,
        AccountCode: accountCode,
        FullName: fullName,
        AccountRole: accountRole,
        Email: email,
        Phone: phone,
        isActive: isActive,
        RoleID: roleID

    }
    $.ajax({
        url: '/admin/account/create',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify(obj),
        success: function (result) {
            if (result == 1) {
                Swal.fire('Success', '', 'success')
                GetAll();
                $('#modal_role').modal('hide');
            }
            else {
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

//Hiện tại chưa check điều kiện đã có hàng mua đợi sau khi làm xong luông bán hàng sẽ check lại

function add() {
    $('#accountid_account').val(0)
    $('#id_roleaccount').val(0)
    $('#account_code_account').val('')
    $('#account_fullname_account').val('');
    $('#account_email_account').val('');
    $('#account_phone_account').val('');
    $('#modal_account').modal('show');
}
function edit(id) {
    var account = arrAccount.find(p => p.accountID == id);
    var formattedDate = formatDate(account.createDate);
    $('#accountid_account').val(account.accountID);
    $('#id_roleaccount').val(account.roleID);
    $('#account_code_account').val(account.accountCode);
    $('#account_fullname_account').val(account.fullName);
    $('#account_email_account').val(account.email);
    $('#account_phone_account').val(account.phone);
    $('#account_createdate_account').val(formattedDate);
    $('#account_createdate_account').prop('readonly', true);
    $('#isactive_account').prop('checked', account.isActive).trigger('change');
    $('#modal_account').modal('show');
    debugger;
}
//Hiện tại chưa check điều kiện đã có hàng mua đợi sau khi làm xong luông bán hàng sẽ check lại
function Delete(id) {
    Swal.fire({
        title: 'Bạn có chắc muốn xóa tài khoản này không?',
        showDenyButton: true,
        confirmButtonText: 'Yes',

    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/admin/account/delete',
                type: 'DELETE',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(id),
                success: function (result) {
                    Swal.fire('Delete!', '', 'success')
                    GetAll();
                },
                error: function (err) {
                    console.log(err)
                }
            });
        }
    })


}