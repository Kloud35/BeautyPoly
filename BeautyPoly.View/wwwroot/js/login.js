
$(document).ready(function () {
    checkUser()
    //var prevScrollpos = window.pageYOffset;
    $("#btn-register").click(function () {
        let name = $('#r_nameCustomer').val();
        let phone = $('#r_phoneNumber').val();
        let email = $('#r_emailCustomer').val();
        let password1 = $('#r_Password1').val();
        let password2 = $('#r_Password2').val();
        //let sex = $('input[name="gender"]:checked').val();
        let dateOfBirth = $('#r_datebirth').val();
        //let address = $('#r_address').val();

        // Validate name field
        if (name == '') {
            $('#nameHelp').html('Vui lòng nhập tên của bạn.');
            $('#nameHelp').removeClass('d-none');
            return false;
        } else {
            $('#nameHelp').addClass('d-none');
        }

        // Validate phone field
        let phonePattern = /(03|05|07|08|09)+([0-9]{8})\b/g;
        if (!phonePattern.test(phone)) {
            $('#phoneHelp').html('Số điện thoại không hợp lệ!');
            $('#phoneHelp').removeClass('d-none');
            return false;
        } else {
            $('#phoneHelp').addClass('d-none');
        }

        // Validate email field
        if (email == '') {
            $('#emailHelp').html('Vui lòng nhập địa chỉ email của bạn.');
            $('#emailHelp').removeClass('d-none');
            return false;
        } else if (!isValidEmail(email)) {
            $('#emailHelp').html('Vui lòng nhập địa chỉ email hợp lệ.');
            $('#emailHelp').removeClass('d-none');
            return false;
        } else {
            $('#emailHelp').addClass('d-none');
        }
        const regex = /\s/; // Biểu thức chính quy để tìm ký tự khoảng trắng
        if (regex.test(password1)) {
            // Nếu chuỗi chứa khoảng trắng, trả về false
            swal("Warning !", "Mật khẩu không được chứa khoảng trắng", "warning");
            return false;
        }
        // Validate password fields
        if (password1 == '') {
            $('#passwordHelp').html('Vui lòng nhập mật khẩu.');
            $('#passwordHelp').removeClass('d-none');
            return false;
        } else if (password1 != password2) {
            $('#passwordHelp').html('Mật khẩu nhập lại không khớp.');
            $('#passwordHelp').removeClass('d-none');
            return false;
        } else {
            $('#passwordHelp').addClass('d-none');
        }

        // Validate address field
        //if (address == "") {
        //    $("#addressHelp").html("Vui lòng nhập địa chỉ của bạn");
        //    $("#addresssHelp").removeClass("d-none");
        //    return false;
        //} else {
        //    $("#addressHelp").addClass("d-none");
        //}

        // Validate date of birth field
        if (dateOfBirth == "") {
            $("#datebirthHelp").html("Vui lòng chọn ngày sinh của bạn");
            $("#datebirthHelp").removeClass("d-none");
            return false;
        } else {
            $("#datebirthHelp").addClass("d-none");
        }

        // Validate gender field
        //if (sex === undefined) {
        //    $("#sexHelp").html("Vui lòng chọn giới tính của bạn");
        //    $("#sexHelp").removeClass("d-none");
        //    return false;
        //}
        //else {
        //    $("#sexHelp").addClass("d-none");
        //}


        let obj = {
            FullName: name,
            Phone: phone,
            Email: email,
            Password: password1,
            DateBirth: dateOfBirth,
            //Sex: sex == 'true' ? true : false,
            //Address: address,
        };
        // Send data to server using AJAX in JSON format
        $.ajax({
            type: 'POST',
            url: '/account/register',
            contentType: 'application/json',
            data: JSON.stringify(obj),
            success: function (response) {
                if (response.success == true) {
                    swal({
                        title: "Đăng ký thành công",
                        text: "Chúc mừng bạn đã đăng ký thành công",
                        icon: "success",
                    });
                    setTimeout(function () {
                        location.reload();
                    }, 1500); // 5000 milliseconds = 5 seconds

                } else {
                    swal({
                        title: "Đăng ký thất bại",
                        text: "Tài khoản đã tồn tại",
                        icon: "error",
                    });
                    setTimeout(function () {
                        location.reload();
                    }, 1500); // 5000 milliseconds = 5 seconds

                }

            },
            error: function (xhr, status, error) {
                // Handle error response from server
                // ...
            }
        });
    });
    $("#btn-login").click(function () {
        var email = $('#login_email').val();
        var password = $('#login_password').val();
        // Validate 
        if (email == '' && password == '') {
            swal("Error !", "Vui lòng nhập Email và Password!");
            return false;
        }
        if (email == '') {
            swal("Error !", "Vui lòng nhập Email!");
            return false;
        } if (password == '') {
            swal("Error !", "Vui lòng nhập Password!");
            return false;
        }

        // Send data to server using AJAX in JSON format
        $.ajax({
            type: 'POST',
            url: '/account/login',
            contentType: 'application/json',
            data: JSON.stringify({
                Email: email,
                Password: password
            }),
            success: function (response) {
                if (response.success == true) {
                    localStorage.setItem("Token", response.token)
                    swal("Success", "Đăng nhập thành công", "success");
                    setTimeout(function () {
                        //location.reload();
                        window.location.href = '/Customer/Index';

                    }, 1000); // 5000 milliseconds = 5 seconds
                }
                else {
                    swal("Error !", "Thông tin đăng nhập không chính xác", "error");
                }
            },
            error: function (xhr, status, error) {
                // Handle error response from server
                // ...
            }
        });

        // Check info user login


    });

    $("#btn-change-password").click(function () {

        var oldPass = $("#password-old").val();
        var newPass = $("#password-new").val();
        var newPassConfirm = $("#password-new2").val();
        var userId = GetUserId();

        console.log("old pass: ", oldPass, " new pass: ", newPass, " new pass confirm: ", newPassConfirm, "user id: ", userId);

        // call api ở đây /account/changepass

        // Validate name field
        if (oldPass == '') {
            swal("Error !", "Vui lòng nhập mật khẩu cũ");
            return false;
        } if (newPass == '') {
            swal("Error !", "Vui lòng nhập mật mới");
            return false;
        }
        const regex = /\s/; // Biểu thức chính quy để tìm ký tự khoảng trắng
        if (regex.test(newPass)) {
            // Nếu chuỗi chứa khoảng trắng, trả về false
            swal("Warning !", "Mật khẩu không được chứa khoảng trắng", "warning");
            return false;
        }
        if (newPassConfirm == '') {
            swal("Error !", "Vui lòng nhập mật khẩu xác nhận");
            return false;
        }
        if (newPass != newPassConfirm) {
            swal("Warning !", "Mật khẩu mới và mật khẩu xác nhận không khớp", "warning");
            return false;
        }

        // Send data to server using AJAX in JSON format
        $.ajax({
            type: 'POST',
            url: '/account/changepass',

            data: {
                passwordnew: newPass,
                passwordold: oldPass,
            },
            headers: { Authorization: "Bearer " + localStorage.getItem("Token") },
            success: function (response) {
                if (response == 1) {
                    swal("Success", "Đổi mật khẩu thành công", "success");
                    $('#password-old').val('');
                    $('#password-new').val('');
                    $('#password-new2').val('');
                    $('#modal-chage-pass').modal('hide');
                    //setTimeout(function () {
                    //    location.reload();
                    //}, 1500); // 5000 milliseconds = 5 seconds
                } else if (response == 2) {
                    //Swal.fire("Vui lòng nhập mật khẩu mới, mật khẩu bạn vừa nhập là mật khẩu cũ");
                    swal("Error", "Mật khẩu mới không được giống mật khẩu cũ", "warning");

                }
                else if (response == 3) {
                    //Swal.fire("");
                    swal("Đổi mật khẩu thất bại", "Mật khẩu cũ không đúng", "error");


                }
                else {
                    swal("Đổi mật khẩu thất bại", "Đổi mật khẩu không thành công", "error");


                }
            },
            error: function (xhr, status, error) {
                // Handle error response from server
                // ...
            }
        });
    });
    function isValidEmail(email) {
        var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
        return pattern.test(email);
    }
});


function checkUser() {
    $("#user_info_option").remove();
    var token = localStorage.getItem("Token");
    if (token != null && token.length > 0) {
        let html = `
            <ul id="user_info_option" class="submenu-nav">
                <li>
                    <a class="dropdown-item" href="/Customer/Index">Thông tin cá nhân</a>
                </li>
                <li>
                    <a class="dropdown-item" onclick="openmodalchangepass()">Đổi mật khẩu</a>
                </li>
                <li>
                    <a class="dropdown-item" onclick="logout()">Đăng xuất</a>
                </li>
            </ul>
        `
        $("#user_info").append(html);
        $("#user_name").text(GetUserName());
    }
    else {
        let html = `

            <ul id="user_info_option" class="submenu-nav">
                <li>
                    <a class="dropdown-item" onclick="openmodallogin()">Login</a>
                </li>
                <li>
                    <a class="dropdown-item" onclick="openmodalregister()">Register </a>
                </li>
            </ul>
        `
        $("#user_info").append(html);
    }
}

function logout() {
    localStorage.clear();
    location.href = '/';
}

function openmodallogin() {
    $('#modallogin').modal('show');
}
function openmodalregister() {
    $('#modaldangky').modal('show');
}
function openmodalchangepass() {
    $('#modal-chage-pass').modal('show');
}


function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


function GetUserName() {
    const token = localStorage.getItem("Token");
    const decodedToken = parseJwt(token);
    var userName = decodedToken['Name'];
    return userName;
}
function GetUserId() {
    const token = localStorage.getItem("Token");
    const decodedToken = parseJwt(token);
    var userId = decodedToken['Id'];
    return userId;
}

$(document).ready(function () {
    checkUser()
    //var prevScrollpos = window.pageYOffset;
    $("#btn-register").click(function () {
        let name = $('#r_nameCustomer').val();
        let phone = $('#r_phoneNumber').val();
        let email = $('#r_emailCustomer').val();
        let password1 = $('#r_Password1').val();
        let password2 = $('#r_Password2').val();
        //let sex = $('input[name="gender"]:checked').val();
        let dateOfBirth = $('#r_datebirth').val();
        //let address = $('#r_address').val();

        // Validate name field
        if (name == '') {
            $('#nameHelp').html('Vui lòng nhập tên của bạn.');
            $('#nameHelp').removeClass('d-none');
            return false;
        } else {
            $('#nameHelp').addClass('d-none');
        }

        // Validate phone field
        let phonePattern = /(03|05|07|08|09)+([0-9]{8})\b/g;
        if (!phonePattern.test(phone)) {
            $('#phoneHelp').html('Số điện thoại không hợp lệ!');
            $('#phoneHelp').removeClass('d-none');
            return false;
        } else {
            $('#phoneHelp').addClass('d-none');
        }

        // Validate email field
        if (email == '') {
            $('#emailHelp').html('Vui lòng nhập địa chỉ email của bạn.');
            $('#emailHelp').removeClass('d-none');
            return false;
        } else if (!isValidEmail(email)) {
            $('#emailHelp').html('Vui lòng nhập địa chỉ email hợp lệ.');
            $('#emailHelp').removeClass('d-none');
            return false;
        } else {
            $('#emailHelp').addClass('d-none');
        }

        // Validate password fields
        if (password1 == '') {
            $('#passwordHelp').html('Vui lòng nhập mật khẩu.');
            $('#passwordHelp').removeClass('d-none');
            return false;
        } else if (password1 != password2) {
            $('#passwordHelp').html('Mật khẩu nhập lại không khớp.');
            $('#passwordHelp').removeClass('d-none');
            return false;
        } else {
            $('#passwordHelp').addClass('d-none');
        }

        // Validate address field
        //if (address == "") {
        //    $("#addressHelp").html("Vui lòng nhập địa chỉ của bạn");
        //    $("#addresssHelp").removeClass("d-none");
        //    return false;
        //} else {
        //    $("#addressHelp").addClass("d-none");
        //}

        // Validate date of birth field
        if (dateOfBirth == "") {
            $("#datebirthHelp").html("Vui lòng chọn ngày sinh của bạn");
            $("#datebirthHelp").removeClass("d-none");
            return false;
        } else {
            $("#datebirthHelp").addClass("d-none");
        }

        // Validate gender field
        //if (sex === undefined) {
        //    $("#sexHelp").html("Vui lòng chọn giới tính của bạn");
        //    $("#sexHelp").removeClass("d-none");
        //    return false;
        //}
        //else {
        //    $("#sexHelp").addClass("d-none");
        //}


        let obj = {
            FullName: name,
            Phone: phone,
            Email: email,
            Password: password1,
            DateBirth: dateOfBirth,
            //Sex: sex == 'true' ? true : false,
            //Address: address,
        };
        // Send data to server using AJAX in JSON format
        $.ajax({
            type: 'POST',
            url: '/account/register',
            contentType: 'application/json',
            data: JSON.stringify(obj),
            success: function (response) {
                if (response.success == true) {
                    swal({
                        title: "Đăng ký thành công",
                        text: "Chúc mừng bạn đã đăng ký thành công",
                        icon: "success",
                    });
                    setTimeout(function () {
                        location.reload();
                    }, 1500); // 5000 milliseconds = 5 seconds

                } else {
                    swal({
                        title: "Đăng ký thất bại",
                        text: "Tài khoản đã tồn tại",
                        icon: "error",
                    });
                    setTimeout(function () {
                        location.reload();
                    }, 1500); // 5000 milliseconds = 5 seconds

                }

            },
            error: function (xhr, status, error) {
                // Handle error response from server
                // ...
            }
        });
    });
    $("#btn-login").click(function () {
        var email = $('#login_email').val();
        var password = $('#login_password').val();
        // Validate 
        if (email == '' && password == '') {
            swal("Error !", "Vui lòng nhập Email và Password!");
            return false;
        }
        if (email == '') {
            swal("Error !", "Vui lòng nhập Email!");
            return false;
        } if (password == '') {
            swal("Error !", "Vui lòng nhập Password!");
            return false;
        }

        // Send data to server using AJAX in JSON format
        $.ajax({
            type: 'POST',
            url: '/account/login',
            contentType: 'application/json',
            data: JSON.stringify({
                Email: email,
                Password: password
            }),
            success: function (response) {
                if (response.success == true) {
                    localStorage.setItem("Token", response.token)
                    swal("Success", "Đăng nhập thành công", "success");
                    setTimeout(function () {
                        //location.reload();
                        window.location.href = '/Customer/Index';

                    }, 1000); // 5000 milliseconds = 5 seconds
                }
                else {
                    swal("Error !", "Thông tin đăng nhập không chính xác", "error");
                }
            },
            error: function (xhr, status, error) {
                // Handle error response from server
                // ...
            }
        });

        // Check info user login


    });

    $("#btn-change-password").click(function () {

        var oldPass = $("#password-old").val();
        var newPass = $("#password-new").val();
        var newPassConfirm = $("#password-new2").val();
        var userId = GetUserId();

        console.log("old pass: ", oldPass, " new pass: ", newPass, " new pass confirm: ", newPassConfirm, "user id: ", userId);

        // call api ở đây /account/changepass

        // Validate name field
        if (oldPass == '') {
            swal("Error !", "Vui lòng nhập mật khẩu cũ");
            return false;
        } if (newPass == '') {
            swal("Error !", "Vui lòng nhập mật mới");
            return false;
        }
        if (newPassConfirm == '') {
            swal("Error !", "Vui lòng nhập mật khẩu xác nhận");
            return false;
        }
        if (newPass != newPassConfirm) {
            swal("Warning !", "Mật khẩu mới và mật khẩu xác nhận không khớp", "warning");
            return false;
        }

        // Send data to server using AJAX in JSON format
        $.ajax({
            type: 'POST',
            url: '/account/changepass',

            data: {
                passwordnew: newPass,
                passwordold: oldPass,
            },
            headers: { Authorization: "Bearer " + localStorage.getItem("Token") },
            success: function (response) {
                if (response == 1) {
                    swal("Success", "Đổi mật khẩu thành công", "success");
                    $('#password-old').val('');
                    $('#password-new').val('');
                    $('#password-new2').val('');
                    $('#modal-chage-pass').modal('hide');
                    //setTimeout(function () {
                    //    location.reload();
                    //}, 1500); // 5000 milliseconds = 5 seconds
                } else if (response == 2) {
                    //Swal.fire("Vui lòng nhập mật khẩu mới, mật khẩu bạn vừa nhập là mật khẩu cũ");
                    swal("Error", "Mật khẩu mới không được giống mật khẩu cũ", "warning");

                }
                else if (response == 3) {
                    //Swal.fire("");
                    swal("Đổi mật khẩu thất bại", "Mật khẩu cũ không đúng", "error");


                }
                else {
                    swal("Đổi mật khẩu thất bại", "Đổi mật khẩu không thành công", "error");


                }
            },
            error: function (xhr, status, error) {
                // Handle error response from server
                // ...
            }
        });
    });
    function isValidEmail(email) {
        var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
        return pattern.test(email);
    }
});


function checkUser() {
    $("#user_info_option").remove();
    var token = localStorage.getItem("Token");
    if (token != null && token.length > 0) {
        let html = `
            <ul id="user_info_option" class="submenu-nav">
                <li>
                    <a class="dropdown-item" href="/Customer/Index">Thông tin cá nhân</a>
                </li>
                <li>
                    <a class="dropdown-item" onclick="openmodalchangepass()">Đổi mật khẩu</a>
                </li>
                <li>
                    <a class="dropdown-item" onclick="logout()">Đăng xuất</a>
                </li>
            </ul>
        `
        $("#user_info").append(html);
        $("#user_name").text(GetUserName());
    }
    else {
        let html = `

            <ul id="user_info_option" class="submenu-nav">
                <li>
                    <a class="dropdown-item" onclick="openmodallogin()">Login</a>
                </li>
                <li>
                    <a class="dropdown-item" onclick="openmodalregister()">Register </a>
                </li>
            </ul>
        `
        $("#user_info").append(html);
    }
}

function logout() {
    localStorage.clear();
    location.href = '/';
}

function openmodallogin() {
    $('#modallogin').modal('show');
}
function openmodalregister() {
    $('#modaldangky').modal('show');
}
function openmodalchangepass() {
    $('#modal-chage-pass').modal('show');
}


function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


function GetUserName() {
    const token = localStorage.getItem("Token");
    const decodedToken = parseJwt(token);
    var userName = decodedToken['Name'];
    return userName;
}
