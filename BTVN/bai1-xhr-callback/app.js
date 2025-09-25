/* ==========================================================
 * 1.1. Tạo utility function để gọi API với XHR
 * ==========================================================*/

/* Hàm gửi yêu cầu
    -  Tham số của callback: (error, data)
*/
function sendRequest(method, url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true); // true: thực hiện bất đồng bộ
    xhr.send(); // gửi request
    // onload: được gọi khi request hoàn thành & nhận response
    xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 400) {
            if (typeof callback === "function") {
                // Khi thành công
                try {
                    const data = JSON.parse(xhr.responseText);
                    callback(null, data);
                } catch (error) {
                    // Khi thất bại -> Nếu lỗi ở JSON.parse
                    callback(new Error("Lỗi định dạng JSON!"), null);
                }
            }
        } else {
            // lỗi từ server -> cần in ra mã lỗi 4xx,, 5xx
            callback(new Error(`Lỗi! HTTP Code: ${xhr.status}`), null);
        }
    };

    // Lỗi mạng
    xhr.onerror = () => {
        callback(new Error("Lỗi mạng!"), null);
    };
}

/* ==========================================================
 * 1.2. Implement 3 chức năng sử dụng JSONPlaceholder API
 * ==========================================================*/

/**
 *  Chức năng 1: User Pro le Card
 */

/* Tạo URL chung */
const API_BASE_URL = "https://jsonplaceholder.typicode.com";

/* Get DOM Element */
const userIdInput = document.querySelector("#user-id-input");
const searchUserBtn = document.querySelector("#search-user-btn");
const userProfileCard = document.querySelector("#user-profile-card");
const userAvatar = document.getElementById("user-avatar");
const userName = document.querySelector("#user-name");
const userEmail = document.querySelector("#user-email");
const userPhone = document.querySelector("#user-phone");
const userWebsite = document.querySelector("#user-website");
const userCompany = document.querySelector("#user-company");
const userAddress = document.querySelector("#user-address");
const userError = document.querySelector("#user-error");
const userLoading = document.querySelector("#user-loading");

/* "Click": Nút Tìm kiếm User */
searchUserBtn.addEventListener("click", () => {
    // Kiểm tra input có được nhập không?
    const usedId = userIdInput.value;
    if (!usedId) {
        // Hiển thị lỗi & ẩn card
        userProfileCard.classList.remove("show");
        userError.classList.add("show");
        userError.textContent = "Vui lòng nhập User ID";
        return;
    }

    userLoading.classList.add("show"); // Hiển thị trạng thái loading
    userError.classList.remove("show"); //Ẩn lỗi
    userProfileCard.classList.remove("show"); // Ẩn Profile Card

    // Tạo URL API
    const userUrl = `${API_BASE_URL}/users/${usedId}`;

    // Gửi request
    sendRequest("GET", userUrl, (error, user) => {
        userLoading.classList.remove("show"); //Ẩn loading khi sendRequest hoàn thành

        if (error) {
            // Hiển thị thông báo lỗi
            userError.classList.add("show");
            userError.textContent = `Lỗi: ${error.message}`;
            return;
        }

        // Hiện card
        userProfileCard.classList.add("show");
        userAvatar.textContent = user.name.charAt(0); // Lấy ký tự đầu tiên
        userName.textContent = user.name;
        userEmail.textContent = user.email;
        userPhone.textContent = user.phone;
        userWebsite.textContent = user.website;
        userCompany.textContent = user.company.name;
        userAddress.textContent = `${user.address.street}, ${user.address.city}`;
    });
});

/**
 *  Chức năng 2: Posts với Comments
 */

/* Get DOM Element */
const postsContainer = document.querySelector("#posts-container");
const postsError = document.querySelector("#posts-error");
const postItemTemplate = document.querySelector(".post-item[data-post-id='']"); // template
const postsLoading = document.querySelector("#posts-loading");

/* Hàm render Comment */
function renderComment(comment, commentsContainer) {
    // Clone Node commentsContainer
    const commentItemTemplate = document.querySelector(".comment-item");
    const commentItem = commentItemTemplate.cloneNode(true);

    // Hiển thị comments bên dưới post (name, email, body)
    commentItem.querySelector(".comment-author").textContent = comment.name;
    commentItem.querySelector(".comment-email").textContent = comment.email;
    commentItem.querySelector(".comment-body").textContent = comment.body;

    commentsContainer.appendChild(commentItem);
}

/* Hàm render bài Post */
function renderPost(post) {
    // Clone template để tạo post item mới
    const postItem = postItemTemplate.cloneNode(true);

    // Fill dữ liệu cho từng bài post
    postItem.dataset.postId = post.id;
    postItem.querySelector(".post-title").textContent = post.title;
    postItem.querySelector(".post-body").textContent = post.body;

    // Get Dom Element
    const authorName = postItem.querySelector(".author-name");
    const commentsContainer = postItem.querySelector(".comments-container");
    const showCommentsBtn = postItem.querySelector(".show-comments-btn");
    showCommentsBtn.dataset.postId = post.id;

    // Lấy thông tin tác giả
    const userUrl = `${API_BASE_URL}/users/${post.userId}`;
    sendRequest("GET", userUrl, (error, user) => {
        if (error) {
            authorName.textContent = "Tên tác giả không tồn tại!";
            return;
        }
        authorName.textContent = user.name;
    });

    // Click: Nút "Xem Comment"
    showCommentsBtn.addEventListener("click", () => {
        // Nếu comments đang hiển thị thì ẩn đi
        // if (commentsContainer.classList.contains("show")) {
        //     commentsContainer.classList.remove("show");
        //     return;
        // }
        // commentsContainer.innerHTML = `<p>🔄 Đang tải comments...</p>`;
        // commentsContainer.classList.add("show");

        showCommentsBtn.disabled = true;
        commentsContainer.innerHTML = `<p>Đang tải comments...</p>`;
        const commentsUrl = `${API_BASE_URL}/posts/${post.id}/comments`;
        sendRequest("GET", commentsUrl, (error, comments) => {
            if (error) {
                commentsContainer.innerHTML = `<p class="error-message show">Lỗi khi tải comments.</p>`;
                return;
            }

            // Xóa lỗi và render các comment
            commentsContainer.innerHTML = "";
            comments.forEach((comment) => {
                renderComment(comment, commentsContainer);
            });

            // Hiển thị container
            const isShown = commentsContainer.classList.toggle("show");
            showCommentsBtn.textContent = isShown
                ? "Ẩn comments"
                : "Xem comments";
        });
    });

    // Thêm post vào container
    postsContainer.appendChild(postItem);
}

/* Tự động load 5 posts đầu tiên khi vào trang */
document.addEventListener("DOMContentLoaded", () => {
    // Loading
    postsLoading.classList.add("show");
    postsError.classList.remove("show");
    postsContainer.style.display = "none";

    const postsUrl = `${API_BASE_URL}/posts?_limit=5`;
    sendRequest("GET", postsUrl, (error, posts) => {
        if (error) {
            postsError.classList.add("show");
            postsError.textContent = `Lỗi: ${error.message}`;
            return;
        }
        postsContainer.style.display = "grid";
        postsLoading.classList.remove("show");
        postsError.classList.remove("show");
        // Render từng post
        posts.forEach(renderPost);
    });
});

/**
 *  Chức năng 3: Todo List với Filter
 */

/* Get DOM Element */
const loadTodosBtn = document.querySelector("#load-todos-btn");
const todoUserIdInput = document.querySelector("#todo-user-id-input");
const todoList = document.querySelector("#todo-list");
const todoFilters = document.querySelector("#todo-filters");
const todoError = document.querySelector("#todos-error");
const todoItemTemplate = document.querySelector(".todo-item[data-todo-id='']");
const todosLoading = document.querySelector("#todos-loading");

// Các element hiển thị thống kê
const totalTodos = document.querySelector("#total-todos");
const completedTodos = document.querySelector("#completed-todos");
const incompleteTodos = document.querySelector("#incomplete-todos");

/* Khởi tạo biến */
let allTodos = []; // Mảng chứa các todo
let currentFilter = "all"; // Trạng thái filter

/* Hàm filter trạng thái: Tất cả | Đã hoàn thành | Chưa hoàn thành */
function filterTodos() {
    let filterTodos = [];
    if (currentFilter === "completed") {
        filterTodos = allTodos.filter((todo) => todo.completed);
    } else if (currentFilter === "incomplete") {
        filterTodos = allTodos.filter((todo) => !todo.completed);
    } else {
        filterTodos = allTodos;
    }

    renderTodos(filterTodos);
}

/* Hàm render danh sách todos */
function renderTodos(todos) {
    todoList.innerHTML = ""; // Reset todo-list
    if (!todos) return;

    todos.forEach((todo) => {
        // Clone Node
        const todoItem = todoItemTemplate.cloneNode(true);

        todoItem.dataset.todoId = todo.id;
        todoItem.dataset.completed = todo.completed;

        todoItem.querySelector(".todo-text").textContent = todo.title;

        if (todo.completed) {
            todoItem.classList.add("completed");
        } else {
            todoItem.classList.add("incomplete");
        }

        todoList.appendChild(todoItem);
    });

    // Cập nhật thống kê
    const completedCount = allTodos.filter((todo) => todo.completed).length;
    const incompleteCount = allTodos.length - completedCount;

    totalTodos.textContent = allTodos.length;
    completedTodos.textContent = completedCount;
    incompleteTodos.textContent = incompleteCount;
}

/* "Click": Nút loadTodosBtn */
loadTodosBtn.addEventListener("click", () => {
    const userId = todoUserIdInput.value;
    if (!userId) {
        todoError.classList.add("show");
        todoError.textContent = "Vui lòng nhập User ID.";
        return;
    }

    // Loading
    todosLoading.classList.add("show");
    todoError.classList.remove("show");
    todoList.innerHTML = "";
    allTodos = [];
    renderTodos([]);

    const todosUrl = `${API_BASE_URL}/users/${userId}/todos`;
    todoError.classList.remove("show"); // Ẩn lỗi cũ

    // Gửi request để nhận todos
    sendRequest("GET", todosUrl, (error, todos) => {
        todosLoading.classList.remove("show");
        if (error) {
            todoError.classList.add("show");
            todoError.textContent = `Lỗi: ${error.message}`;
            return;
        }
        allTodos = todos;
        // Render todos theo filter
        filterTodos();
    });
});

/* Click: Các nút filter */
todoFilters.addEventListener("click", (e) => {
    // Kiểm tra xem có phải button không
    const isButton = e.target.tagName === "BUTTON";
    if (isButton) {
        // Active button
        const activeBtn = document.querySelector(".filter-btn.active");
        const currentBtn = e.target;
        // Bỏ active ở button cũ
        activeBtn.classList.remove("active");
        // Thêm active cho button mới
        currentBtn.classList.add("active");

        // Cập nhật trạng thái của filter hiện tại
        currentFilter = currentBtn.dataset.filter;
        filterTodos();
    }
});
