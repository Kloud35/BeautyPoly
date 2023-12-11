$(document).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);
    var postId = urlParams.get('postId');
    if (postId) {
        GetDetailPost(postId);
    } else {
        console.error('Missing postId in the URL.');
    }
});

function GetDetailPost(postId) {
    $.ajax({
        url: '/post/detail-post',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: { postId: postId },
        success: function (result) {
            var html = '';
            console.log(result);
            html += `<div class="blog-detail">
                            <h3 class="blog-detail-title">${result.title}</h3>
                            <div class="blog-detail-category" >
                                <a class="category"><i class="fa fa-calendar-o">${result.tags}</i></a>
                            </div>
                            <img class="blog-detail-img mb-7 mb-lg-10" src="${result.img}" width="1170" height="1012" alt="Image">
                            <div class="row justify-content-center">
                                <div class="col-lg-10">
                                    <p class="desc mt-4 mt-lg-7">${result.contents}</p>
                                </div>
                            </div>
                        </div>`;
            $('#tbody_post_view').html(html);
        },
        error: function (err) {
            console.log(err);
        }

    });
}

