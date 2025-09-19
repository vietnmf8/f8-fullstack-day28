/* ==========================================================
 * Promise: Lời hứa
- Là object đặc biệt trong JavaScript.
- Giải quyết Callback Hell
- Sinh ra để quản lý các công việc bất đồng bộ (công việc mất thời gian & không biết kết quả ngay). Khi mà biết kết quả sẽ có 2 trạng thái là Thành công / Thất bại

Lời hứa: Cứ chờ đi, khi nào có kết quả tôi sẽ báo cho anh biết là thành công hay thất bại

Object Promise gồm có 3 trạng thái:
- Chờ: Pending (không gọi resolve hoặc reject)
- Thành công: Fulfilled (Khi gọi resolve)
- Thất bại: Rejected (Khi gọi reject) (Đi kèm với rejected là văng ra lỗi đỏ: Uncaught (in promise))

 resolve(); // Gọi hàm resolve khi Thành công!
 reject(); // Gọi hàm reject khi thất bại!
})
 * ==========================================================*/

/* Tạo một object Promise
VD: Anh hứa mua Iphone 17 ProMax tặng em! (Lời hứa)
*/
const promise = new Promise((resolve, reject) => {
    // 3s sau mới resolve thì lúc đó mới .then được -> thao tác bất đồng bộ
    // => chúng ta có thể dùng hàm send để gửi dữ liệu, khi nào nhận thành công chúng ta resolve
    setTimeout(() => {
        resolve("Iphone 17 Pro max"); // Chàng trai thực hiện lời hứa và mua thật
    }, 3000);
    // reject('Không mua'); // Chàng trai không mua
    //? Làm sao để lấy được phần quà (giá trị trong resolve)
});

/* Sau khi thực hiện lời hứa sẽ có 2 trạng thái ứng với 2 callback là Thành công hoặc Thất bại
- Nếu thành công: gọi vào callback .then thứ 1, thất bại thì lọt vào callback thứ 2
*/
/* Sử dụng 2 callback Thành công/ Thất bại */
// promise.then((gift) => {
//     // Thành công
//     console.log(gift); // Cô gái nhận quà
// }, (error) => {
//     // Thất bại
//     // Xử lý lỗi để tránh văng lỗi (in promise)
//     console.log(error);
// })

/* Sử dụng .then/.catch tương ứng với Thành công/Thất bại */
promise
    .then((gift) => {
        // Thành công
        console.log(gift); // Cô gái nhận quà
    })
    .catch((error) => {
        // Thất bại -> Bẫy lỗi
        console.log(error);
    });
