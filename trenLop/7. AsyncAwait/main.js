/**
 * Async: Bất đồng bộ / Await: Chờ
 * - Khai báo hàm bất đồng bộ: async function
 * - Khi gọi hàm -> nó là một promise (Fulfilled) resolve giá trị được return.
 *
 * - Await chỉ hợp lệ khi dùng trong async function thôi!
 * - Cứ cái gì là promise (chờ đợi mất thời gian)
 * - VD: thay vì viết fakeSend(1000, 1).then((result1)...
 * => const result1 = await fakeSend(1000,1)
 * - Tức là chờ (await) lời hứa (promise) hoàn thành!
 * Đọc rất tự nhiên
 */
/* 3 cách viết async function */
// async function run() {
//     return 123;
// }
// // const run = async function () {};
// // const run = async () => { };

// console.log(run());

/* Hàm giả lập gửi request */
function fakeSend(time, data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, time);
    });
}

// /* Task 1 */
// fakeSend(1000, 1).then((result1) => {
//     console.log(result1);
// });

/* Hàm bất đồng bộ */
async function handle() {
    try {
        // Chờ 1s và resolve(1) -> lưu 1 vào biến result1
        const result1 = await fakeSend(1000, 1);
        const result2 = await fakeSend(1000, 2);
        const result3 = await fakeSend(1000, 3);

        // "_": Biến này có tồn tại nhưng tôi không quan tâm, không dùng đến nó

        /* Fake lỗi */
        // Khi có lỗi -> Dừng ngay tại dòng báo lỗi vào không đi xuống các dòng tiếp -> lọt vào catch
        await new Promise((_, reject) => {
            reject("Lỗi");
        });

        console.log(result1 + result2 + result3);
    } catch (error) {
        console.log(error);
    }
}

handle();
