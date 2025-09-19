/* Hàm gửi request */
function send(method, url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                const data = JSON.parse(this.responseText);
                resolve(data);
            } else {
                reject(`Lỗi! HTTP Code: ${this.status}`);
            }
        };
        xhr.send();
    });
}

// /* Lấy danh sách các bài posts */
// send("GET", "https://jsonplaceholder.typicode.com/posts").then((posts) => {
//     console.log("posts:", posts.length);
// });

// /* Lấy danh sách các bài comments */
// send("GET", "https://jsonplaceholder.typicode.com/comments").then(
//     (comments) => {
//         console.log("comments:", comments.length);
//     }
// );

// /* Lấy danh sách các bài albums */
// send("GET", "https://jsonplaceholder.typicode.com/albums").then((albums) => {
//     console.log("albums:", albums.length);
// });

/* Hàm giả lập gửi request */
function fakeSend(time, data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, time);
    });
}

/* Promise hell: Promise lồng Promise, cứ đi các cấp sâu vào..
 */
/* Task 1 */
fakeSend(1000, 1)
    .then((result1) => {
        return fakeSend(1000, result1 + 2);
    })
    .then((result2) => {
        return fakeSend(1000, result2 + 3);
    })
    .then((result3) => {
        console.log(result3);
    });
// Kỳ vọng: Tổng = 6

/* Nếu trong callback của .then mà return giá trị, thì giá trị này chính là đầu vào tham số của callback .then tiếp theo 

=> Tóm lại:
- Trong callback của thằng .then đằng trước nó return cái gì thì thằng callback của thằng .then đằng sau sẽ nhận được cái đó!
- Nếu 2 then đứng cạnh nhau. Thì thằng đằng trước phải chạy xong rồi mới chạy thằng thứ 2. Nếu thằng đằng trước không return gì -> undefined -> .then tiếp theo được chạy ngay
- Chỉ khi return một Promise, .then tiếp theo sẽ đợi Promise đó resolve hay reject. Nếu resolve() rồi mới chạy .then tiếp theo, reject thì lọt vào catch


*/

// const promise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve("Iphone 17 Pro max");
//     }, 3000);
// });

// promise
//     .then((gift) => {
//         console.log(gift);
//         // return 123; // return giá trị
//         return new Promise((resolve, reject) => {
//             setTimeout(() => {
//                 // resolve('Gì đó....');
//                 reject('Lỗi gì đó')
//             }, 2000);
//         });
//     })
//     .then((gift) => {
//         console.log(gift);
//     })
//     .catch((error) => {
//         console.log(error);
//     });
