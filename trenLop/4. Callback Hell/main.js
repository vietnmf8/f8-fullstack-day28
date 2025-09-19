/* Hàm gửi request */
// function send(method, url, callback) {
//     const xhr = new XMLHttpRequest();
//     xhr.open(method, url, true);
//     xhr.onload = function () {
//         if (this.status >= 200 && this.status < 400) {
//             const data = JSON.parse(this.responseText);
//             //Bản chất callback là “hẹn giờ”: "Khi nào request xong, hãy gọi hàm này."
//             callback(data);
//         }
//     };
//     xhr.send();
// }

/**
 * Những công việc không phụ thuộc nhau
 */

// /* Lấy danh sách các bài posts */
// send("GET", "https://jsonplaceholder.typicode.com/posts", (posts) => {
//     console.log("posts: ", posts.length);
// });

// /* Lấy danh sách các bài comments */
// send("GET", "https://jsonplaceholder.typicode.com/comments", (comments) => {
//     console.log("comments: ", comments.length);
// });

// /* Lấy danh sách các bài albums */
// send("GET", "https://jsonplaceholder.typicode.com/albums", (albums) => {
//     console.log("albums: ", albums.length);
// });

/**
 * Những công việc phụ thuộc nhau:
 * - Kết quả của công việc trước là đầu vào của công việc sau
 *
 * VD: Muốn lấy ra được phường/xã của thành phố Hà Nội:
 * - Bước 1: Lấy danh sách thành phố => Lấy ra danh sách Hà Nội
 * - Bước 2: Lấy ra danh sách quận huyện của Hà Nội => Lấy ra Ba Đình
 * - Bước 3: Lấy ra phường/xã của Ba Đình
 *
 * =>> Công việc phụ thuộc/gối đầu nhau. Đầu ra của công việc trước là đầu vào của công việc sau
 */

/* Hàm giả lập gửi request */
function send(time, data, callback) {
    setTimeout(() => {
        callback(data);
    }, time);
}


/* Callback hell: Callback lồng callback, cứ đi các cấp sâu vào..
    => Promise
*/
/* Task 1 */
send(1000, 1, (result1) => {

    /* Task 2 */
    send(1000, 2, (result2) => {

        /* Task 3 */
        send(1000, 3, (result3) => {
            console.log(result1 + result2 + result3); // Sau 3s -> log ra 6
        });
    });
});

// Kỳ vọng: Tổng = 6
