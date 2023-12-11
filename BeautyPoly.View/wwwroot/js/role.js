var arrRole = [];
$(document).ready(function () {
    GetAll();

});

function GetAll() {
    var keyword = $('#role_keyword').val();
    $.ajax({
        url: '/admin/role/getall',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: { filter: keyword },
        success: function (result) {
            arrRole = result;
            var html = '';
            $.each(result, function (key, item) {
                var isDelete = item.isDelete ? "checked" : ""
                html += `<tr>
                           <td class="text-center">
                               <button class="btn btn-success btn-sm" onclick="edit(${item.roleID})">
                                    <i class="bx bx-pencil"></i>
                               </button>
                                <button class="btn btn-danger btn-sm" onclick="Delete(${item.roleID})">
                                    <i class="bx bx-trash"></i>
                                </button>
                            </td>
                            <td class="text-center">${item.roleCode}</td>
                            <td>${item.roleName}</td>
                            <td>${item.description}</td>
                            <td style="width:10%">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked" ${isDelete}>
                                </div>
                            </td>
                        </tr>`;
            });
            $('#tbody_role').html(html);
        },
        error: function (err) {
            console.log(err)
        }
    });
}

function validate() {
    var count = 0;
    var roleName = $('#role_name_role').val();
    var roleCode = $('#role_code_role').val();
    if (roleName == '') {

        count++;
    }
    if (count > 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Không được để trống tên chức vụ',
            showConfirmButton: false,
            timer: 1000
        })
        return false;
    }

    if (roleCode == '') {

        count++;
    }
    if (count > 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Không được để trống mã chức vụ',
            showConfirmButton: false,
            timer: 1000
        })
        return false;
    }
    return true;
}

function create() {
    if (!validate()) return;
    var id = parseInt($('#roleid_role').val());
    var roleCode = $('#role_code_role').val();
    var roleName = $('#role_name_role').val();
    var roleDescription = $('#role_description_role').val();
    var isdelete = $('#isdelete_role').prop('checked');

    
    var obj = {
        RoleID: id,
        RoleCode: roleCode,
        RoleName: roleName,
        Description: roleDescription,
        IsDelete: isdelete
    }
    $.ajax({
        url: '/admin/role/create',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify(obj),
        success: function (result) {
            if (result == 1) {
                Swal.fire('Thành công', '', 'success')
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
    $('#roleid_role').val(0)
    $('#role_code_role').val('')
    $('#role_name_role').val('');
    $('#role_description_role').val('');
    $('#modal_role').modal('show');
}
function edit(id) {
    var role = arrRole.find(p => p.roleID == id);
    $('#roleid_role').val(role.roleID);
    $('#role_code_role').val(role.roleCode);
    $('#role_name_role').val(role.roleName);
    $('#role_description_role').val(role.description);
    $('#isdelete_role').prop('checked', role.isDelete).trigger('change');
    $('#modal_role').modal('show');
}
//Hiện tại chưa check điều kiện đã có hàng mua đợi sau khi làm xong luông bán hàng sẽ check lại
//function Delete(id) {
//    Swal.fire({
//        title: 'Bạn có chắc muốn xóa chức vụ này không?',
//        showDenyButton: true,
//        confirmButtonText: 'Yes',

//    }).then((result) => {
//        if (result.isConfirmed) {
//            $.ajax({
//                url: '/admin/role/delete',
//                type: 'DELETE',
//                dataType: 'json',
//                contentType: 'application/json;charset=utf-8',
//                data: JSON.stringify(id),
//                success: function (result) {
//                    Swal.fire('Chức vụ đã được xóa !', '', 'success')
//                    GetAll();
//                },
//                error: function (err) {
//                    disableRole(id);
//                    console.log(err)
//                }
//            });
//        }
//    })
//}
function disableRole(roleID) {
    Swal.fire({
        title: 'Chức vụ này đã được sử dụng, chỉ được phép tắt. Bạn muốn tắt không?',
        showDenyButton: true,
        confirmButtonText: 'Yes',

    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/admin/role/disablerole',
                type: 'PUT',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(roleID),  // Gửi roleID để xác định chức vụ cần tắt
                success: function (result) {
                    Swal.fire('Chức vụ đã được tắt hoạt động.', '', 'success');
                    GetAll();
                },
                error: function (err) {
                    console.log(err);
                    Swal.fire('Có lỗi xảy ra. Không thể tắt hoạt động chức vụ.', '', 'error');
                }
            });
        }
    })
    
}

function Delete(id) {
    $.ajax({
        url: `/admin/role/checkUsage?roleId=${id}`,
        type: 'GET',
        dataType: 'json',
        success: function (result) {
            if (result) {
               
                disableRole(id);
            } else {
                Swal.fire({
                    title: 'Bạn có chắc muốn xóa chức vụ này không?',
                    showDenyButton: true,
                    confirmButtonText: 'Yes',
                }).then((result) => {
                    if (result.isConfirmed) {
                        $.ajax({
                            url: '/admin/role/delete',
                            type: 'DELETE',
                            dataType: 'json',
                            contentType: 'application/json;charset=utf-8',
                            data: JSON.stringify(id),
                            success: function (result) {
                                Swal.fire('Chức vụ đã được xóa.', '', 'success');
                                GetAll();
                            },
                            error: function (err) {
                                console.log(err);
                            }
                        });
                    }
                });
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}
