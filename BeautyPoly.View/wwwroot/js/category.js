var arrCate = [];

$(document).ready(function () {
    GetAll();
    GetAllToTree();
});
function GetAll() {
    var keyword = $('#category_keyword').val();
    $.ajax({
        url: '/admin/category/getall',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: { filter: keyword },
        success: function (result) {
            arrCate = result;
        },
        error: function (err) {
            console.log(err);
        }
    });
}
function GetAllToTree() {
    var keyword = $('#category_keyword').val();
    $.ajax({
        url: '/admin/category-to-tree/getall',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: { filter: keyword },
        success: function (result) {
            $('#category-list').tree({
                data: result,
                //animate: true,
                //onContextMenu: function (e, node) {
                //    e.preventDefault();
                //    $('#category-list').tree('select', node.target);
                //    $('#category-menu').menu('show', {
                //        left: e.pageX,
                //        top: e.pageY
                //    });
                //},
            });
        },
        error: function (err) {
            console.log(err);
        }
    });
}
function createUpdate() {
    var id = parseInt($('#cate_id_cate').val());
    var parentid = parseInt($('#cate_parent_id_cate').val());
    var name = $('#cate_name_cate').val();
    var code = $('#cate_code_cate').val();

    var category = {
        cateId: id,
        parentID: parentid,
        cateName: name,
        cateCode: code,
    }
    console.log(category)
    $.ajax({
        url: '/admin/cate/create-update',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify(category),
        success: function (result) {
            if (result == 1) {
                GetAll();
                $('#modal_cate').modal('hide');
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

function addCate() {
    var node = $('#category-list').tree('getSelected');
    if (node) {
        $('#cate_id_cate').val(0);
        $('#cate_parent_id_cate').val(node.id);
        if (node) {
            $('#parent_cate').text(node.text);
        } else {
            $('#parent_cate').text('Không - Danh mục lớn nhất');
        }
        $('#cate_name_cate').val('');
        $('#cate_code_cate').val('');
        $('#modal_cate').modal('show');
    }   
}

function editCate() {
    var node = $('#category-list').tree('getSelected');
    if (node) {
        $('#cate_id_cate').val(node.id);
        var cate = arrCate.find(p => p.cateId == parseInt(node.id));
        $('#cate_parent_id_cate').val(cate.parentID);
        var cateDependent = arrCate.find(p => p.cateId == cate.parentID);
        if (cateDependent) {
            $('#parent_cate').html(`${cateDependent.cateCode} - ${cateDependent.cateName}`);
        } else {
            $('#parent_cate').text('Không - Danh mục lớn nhất');
        }
        $('#cate_name_cate').val(cate.cateName);
        $('#cate_code_cate').val(cate.cateCode);
        $('#modal_cate').modal('show');
    }
}
//function deletecate(id) {
//    Swal.fire({
//        title: 'Bạn có chắc muốn xóa không?',
//        showDenyButton: true,
//        showCancelButton: true,
//        confirmButtonText: 'Save',

//    }).then((result) => {

//        if (result.isConfirmed) {
//            $.ajax({
//                url: '/admin/cate/delete',
//                type: 'DELETE',
//                dataType: 'json',
//                contentType: 'application/json;charset=utf-8',
//                data: JSON.stringify(id),
//                success: function (result) {
//                    GetAll();
//                },
//                error: function (err) {
//                    console.log(err)
//                }
//            });
//        }
//    })


//}
