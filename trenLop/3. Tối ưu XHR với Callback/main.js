/* 
    - Những giá trị cần tách ra làm tham số:
        + Giá trị có thể thay đổi giữa các lần gọi khác nhau
    - Mục đích tạo ra callback để biết được kết quả của một cái bất đồng bộ trả về. (Bao giờ xong -> thì báo cho tôi biết)
    - Bản chất callback là “hẹn giờ”: "Khi nào request xong, hãy gọi hàm này."
*/

/* Hàm gửi request */
function send(method, url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            const data = JSON.parse(this.responseText);
            //Bản chất callback là “hẹn giờ”: "Khi nào request xong, hãy gọi hàm này."
            callback(data);
        }
    };
    xhr.send();
}


/* Cách xác định để refactor
    - Xác định điểm chung:
        + Lấy element từ querySelector()
        + Dùng ".map" đê biến đổi HTML
        + Gán ".innerHTML"
    - Xác định điểm khác nhau:
        + Selector của querySelector (#list-posts, #list-comments, #list-albums)
        + Dữ liêu đầu vào (posts, comments, albums).
        + Thuộc tính ,các hiển thị
*/

/* Lấy danh sách các bài post */
send("GET", "https://jsonplaceholder.typicode.com/posts", function (posts) {
    renderList(
        "#list-posts",
        posts,
        (post) => `<li><a>${post.id}. ${post.title}</a></li>`
    );
});

/* Lấy danh sách các bài comment */
send("GET", "https://jsonplaceholder.typicode.com/comments", function (comments) {
    renderList(
        "#list-comments",
        comments,
        (comment) => `<li><a>${comment.id}. ${comment.email}</a></li>`
    );
});

/* Lấy danh sách các bài album */
send("GET", "https://jsonplaceholder.typicode.com/albums", function (albums) {
    renderList(
        "#list-albums",
        albums,
        (album) => `<li><a>${album.id}. ${album.title}</a></li>`
    );
});

/* Hàm render chung */
function renderList(selector, data, callback) {
    const list = document.querySelector(selector);
    list.innerHTML = data.map(callback).join("");
}

// /* Hàm render danh sách các bài posts */
// function renderPosts(posts) {
//     const list = document.querySelector("#list-posts");
//     list.innerHTML = posts
//         .map(
//             (post) => `
//         <li><a>${post.id}. ${post.title}</a></li>
//         `
//         )
//         .join("");
// }

// /* Hàm render danh sách các bài comments */
// function renderComments(comments) {
//     const list = document.querySelector("#list-comments");
//     list.innerHTML = comments
//         .map(
//             (comment) => `
//         <li><a>${comment.id}. ${comment.email}</a></li>
//         `
//         )
//         .join("");
// }

// /* Hàm render danh sách các bài albums */
// function renderAlbums(albums) {
//     const list = document.querySelector("#list-albums");
//     list.innerHTML = albums
//         .map(
//             (album) => `
//         <li><a>${album.id}. ${album.title}</a></li>
//         `
//         )
//         .join("");
// }


