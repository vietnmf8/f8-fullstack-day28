// /* Hàm gửi request */
// const xhr = new XMLHttpRequest();
// xhr.open("GET", "https://jsonplaceholder.typicode.com/posts", true);
// xhr.onload = function () {
//     if (this.status >= 200 && this.status < 400) {
//         const posts = JSON.parse(this.responseText);
//         renderPosts(posts);
//     }
// };
// xhr.send();

// /* Hàm render danh sách các bài posts */
// function renderPosts(posts) {
//     const list = document.querySelector("#list");
//     list.innerHTML = posts
//         .map(
//             (post) => `
//         <li><a>${post.id}. ${post.title}</a></li>
//         `
//         )
//         .join("");
// }

/**
 * Callback: (Hàm gọi lại):
 * - Là một hàm.
 * - Được truyền vào dưới dạng "đối số" của một hàm khác.
 * - Được gọi bên trong thân hàm đó.
 */

function add(a, b) {} // a, b: Tham số
add(1, 2); // 1, 2: Đối số

setTimeout(() => {
    console.log("Done");
}, 1000);

/* 
() => {
    console.log("Done");
}

=> Là callback vì:
- Là một hàm (hàm ẩn danh)
- Là đối số của hàm setTimeout (đang gọi hàm setTimeout)
- Được gọi bên trong thân hàm (log ra "Done")
*/

const colors = ["red", "green", "blue"];
colors.forEach((color) => {
    console.log(color);
});

/* 
(color) => {
    console.log(color);
}
    => Là callback
*/

function run(callback) {
    callback();
}
// handle là hàm callback
function handle() {
    console.log("Done!");
}
run(handle);

// function log(data) {
//     console.log(data);
// }

// function add(a, b) {
//     return a + b;
// }

// log(add(2 + 3)); //5
/* 
Nhưng add(2 + 3) không phải là callback vì hàm này đã được gọi là trả ra giá trị. Nói cách khác add(2 + 3) = 5 (kiểu number không phải một hàm)
- Và nó cũng không đáp ứng được 1 trong 3 điều kiện để trở thành Callback:
    + Là một hàm -> OK
    + Được truyền vào dưới dạng "đối số" của một hàm khác -> Không phải (vì đối số trong log là một giá trị number chứ không phải hàm)
    + Được gọi bên trong thân hàm đó. -> Không phải (vì đã gọi ngay trong đối số và trả về giá trị là 5)
*/



function log(callback, a, b) {
    console.log(callback(a, b));
}

function add(a, b) {
    return a + b;
}


log(add, 1, 2); //5
/* add chính là callback */