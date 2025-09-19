/**
 * XHR: Gửi yêu cầu qua internet để lấy dữ liệu về:
 * JSONPlaceholder: Web Fake REST API
 * XHR: XML HttpRequest: Giúp chúng ta tương tác với máy chủ, gọi yêu cầu -> máy chủ trả về dữ liệu -> chúng ta nhận về dữ liệu dưới dạng JSON
 *
 * Ứng dụng: Một trang web đã tải xong -> Thay vì phải f5 để lấy dữ liệu mới -> XHR cho phép hiển thị thêm dữ liệu mà không cần tải lại trang. VD: trong phần bình luận, có nút XEM THÊM -> nhấn vào để xem thêm bình luận thay vì tải lại trang
 *
 * TÓM LẠI:
 * - Giúp cập nhật trang web mà không cần tải lại trang
 * - Gửi nhận dữ liệu khi trang web đã tải xong
 * - Có thể tiếp tục gửi nhận dữ liệu âm thầm
 *
 *
 * HTTP response state Code: thể hiện trang thái response là thành công hay thất bại
 * 200 - 299: Đầu mã thành công!
 *  + 201: Thành công khi tạo mới
 *  + 204: Thành công nhưng không trả về gì
 * 300 - 399: Đầu mã chuyển hướng
 * 400 - 499: Lỗi từ phía máy khách
 * 500 - 599: Lỗi từ phía máy chủ
 *
 * =>> Vậy kiểm tra thành công bằng cách kiểm tra status >= 200 và < 400
 *
 */
/* Ví dụ mối quan hệ Máy khách - Máy chủ:
Hãy tưởng tượng bạn đi ăn phở:
- Bạn = Máy khách (Client)
- Quán phở + nhân viên nấu = Máy chủ (Server)

Diễn biến:

1. Bạn gọi món → Gửi yêu cầu:
"Cho tôi một tô phở tái gầu!"
→ Đây chính là request từ client gửi đến server.

2. Quán nấu phở → Xử lý yêu cầu:
Nhân viên bếp lấy thịt, nấu nước lèo, làm phở.
→ Đây là server-side processing.

3. Nhân viên mang phở ra cho bạn → Gửi phản hồi:
Bạn nhận được tô phở, ăn thôi!
→ Đây là response từ server trả về client.

Các loại lỗi (HTTP code):
- 200: Quán làm xong phở, bưng ra cho bạn ngon lành ✅
- 300: Nhân viên bảo: "Bàn này hết phở, mời bạn qua bàn số 5!" ➡ (chuyển hướng)
- 400: Bạn gọi món không có trong menu → Quán báo lỗi: "Không có phở bò Kobe ở đây!" 🚫 (lỗi client)
- 500: Quán bị mất điện, bếp cháy → Quán không nấu được phở 😵 (lỗi server)

Cách nhớ nhanh:
- Client = Người đi gọi món
- Server = Quán phục vụ món
- Request = Lời gọi món
- Response = Món ăn được mang ra


*/

/* readyState:
    - Giá trị 0: UNSET - Máy khách được tạo, open() chưa được gọi
    - Giá trị 1: OPENED - open() được gọi
    - Giá trị 2: HEADERS_RECEIVED - send() được gọi là tiêu đề và trạng thái đã có sẵn
    - Giá trị 3: LOADING - Đang tải xuống, responseText lưu trữ một phần dữ liệu
    - Giá trị 4: DONE - Hoạt động đã hoàn tất (nhưng chưa biết thành công hay thất bại) =>> Chỉ làm việc với cái này
 */

/* Hàm gửi request */
const xhr = new XMLHttpRequest();
xhr.open("GET", "https://jsonplaceholder.typicode.com/posts", true); // true: bất đồng bộ | false: đồng bộ

// // Khi mã code readyState thay đổi => gọi vào callback
// // onreadystatechange sẽ đi qua trạng thái 2 - 3 - 4 nên sẽ chạy 3 lần
// xhr.onreadystatechange = function () {
//     if (this.readyState === 4 && this.status >= 200 && this.status < 400) {
//         // trả rả dữ liệu responseText dưới dạng JSON
//         const posts = JSON.parse(this.responseText);
//         renderPosts(posts);
//     }
// };


// onload: luôn trả về trạng thái 4 nên chỉ chạy 1 lần
xhr.onload = function () {
    if (this.status >= 200 && this.status < 400) {
        // trả rả dữ liệu responseText dưới dạng JSON
        const posts = JSON.parse(this.responseText);
        renderPosts(posts);
    }
};

// Gửi request
xhr.send();

/* Hàm render danh sách các bài posts */
function renderPosts(posts) {
    const list = document.querySelector("#list");
    list.innerHTML = posts.map(
        (post) => `
        <li><a>${post.id}. ${post.title}</a></li>
        `
    ).join("");
}
