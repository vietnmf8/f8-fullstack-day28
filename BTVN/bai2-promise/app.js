/* ==========================================================
 * 2.1. Tạo Promise wrapper cho XHR
 * ========================================================== */

/* Hàm gửi yêu cầu
    -  Tham số của callback: (error, data)
*/

function sendRequest(method, url) {
    // Trả về một Promise mới.
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.send();
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 400) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    resolve(data); // Resolve Promise
                } catch (error) {
                    reject(new Error("Lỗi định dạng JSON!"));
                }
            } else {
                reject(new Error(`Lỗi! HTTP Code: ${xhr.status}`));
            }
        };

        // Bắt lỗi mạng
        xhr.onerror = () => {
            reject(new Error("Lỗi mạng!"));
        };
    });
}

/* ==========================================================
 * 2.2. Refactor lại 3 chức năng sử dụng Promise
 * ==========================================================*/

/* Tạo URL chung */
const API_BASE_URL = "https://jsonplaceholder.typicode.com";

/**
 *  Chức năng 1: User Pro le Card
 */

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

/* Click: Nút tìm kiếm Users */
searchUserBtn.addEventListener("click", () => {
    const userId = userIdInput.value;
    if (!userId) {
        userProfileCard.classList.remove("show");
        userError.classList.add("show");
        userError.textContent = "Vui lòng nhập User ID";
        return;
    }

    // Hiển thị loading, ẩn lỗi và card cũ
    userLoading.classList.add("show");
    userError.classList.remove("show");
    userProfileCard.classList.remove("show");

    // Gửi request
    const userUrl = `${API_BASE_URL}/users/${userId}`;
    sendRequest("GET", userUrl)
        .then((user) => {
            // Khi thành công! (Resolve)
            userProfileCard.classList.add("show");
            userAvatar.textContent = user.name.charAt(0);
            userName.textContent = user.name;
            userEmail.textContent = user.email;
            userPhone.textContent = user.phone;
            userWebsite.textContent = user.website;
            userCompany.textContent = user.company.name;
            userAddress.textContent = `${user.address.street}, ${user.address.city}`;
        })
        .catch((error) => {
            // Khi thất bại (Reject)
            userError.classList.add("show");
            userError.textContent = `Lỗi: ${error.message}`;
        })
        .finally(() => {
            // Luôn được gọi dù thành công hay thất bại
            // Ẩn loading
            userLoading.classList.remove("show");
        });
});

/**
 *  Chức năng 2: Posts với Comments
 */
// Lấy các DOM element
const postsContainer = document.querySelector("#posts-container");
const postsError = document.querySelector("#posts-error");
const postsLoading = document.querySelector("#posts-loading");
const loadMoreBtn = document.querySelector("#load-more-posts-btn"); // Bổ sung
const postItemTemplate = document.querySelector(".post-item[data-post-id='']");

/* Biến */
let currentPage = 1; // Biến để theo dõi trang posts hiện tại

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

/* Hàm render bài post */
function renderPost(post) {
    const postItem = postItemTemplate.cloneNode(true);

    // Điền dữ liệu cơ bản của post
    postItem.dataset.postId = post.id;
    postItem.querySelector(".post-title").textContent = post.title;
    postItem.querySelector(".post-body").textContent = post.body;

    const authorName = postItem.querySelector(".author-name");
    const commentsContainer = postItem.querySelector(".comments-container");
    const showCommentsBtn = postItem.querySelector(".show-comments-btn");
    showCommentsBtn.dataset.postId = post.id;

    // Lấy thông tin tác giả
    const userUrl = `${API_BASE_URL}/users/${post.userId}`;
    sendRequest("GET", userUrl)
        .then((user) => {
            authorName.textContent = user.name;
        })
        .catch(() => {
            authorName.textContent = "Tên tác giả không tồn tại!";
        });

    // Xem thêm comment
    showCommentsBtn.addEventListener("click", () => {
        const isShown = commentsContainer.classList.toggle("show");
        showCommentsBtn.textContent = isShown ? "Ẩn comments" : "Xem comments";

        if (isShown && commentsContainer.children.length === 0) {
            commentsContainer.innerHTML = `<p>🔄 Đang tải comments...</p>`;
            const commentsUrl = `${API_BASE_URL}/posts/${post.id}/comments`;
            sendRequest("GET", commentsUrl)
                .then((comments) => {
                    commentsContainer.innerHTML = ""; // Xóa lỗi và render các comment
                    comments.forEach((comment) => {
                        renderComment(comment, commentsContainer);
                    });
                })
                .catch(() => {
                    commentsContainer.innerHTML = `<p class="error-message show">Lỗi khi tải comments.</p>`;
                });
        }
    });

    // Thêm post vào container
    postsContainer.appendChild(postItem);
}

/* Hàm tải page */
function loadPosts(page, limit = 5) {
    // Hiện loading
    postsLoading.classList.add("show");
    loadMoreBtn.style.display = "none";
    postsError.classList.remove("show");

    /* 
        Lần 1: _page=1&_limit=5 → 5 posts.
        Lần 2: _page=2&_limit=5 → 5 posts tiếp theo (post 6–10).
        Lần 3: _page=3&_limit=5 → 5 posts tiếp theo (post 11–15).
    */
    const postsUrl = `${API_BASE_URL}/posts?_limit=5&_page=${page}&_limit=${limit}`;
    sendRequest("GET", postsUrl)
        .then((posts) => {
            if (posts.length > 0) {
                posts.forEach(renderPost);
                loadMoreBtn.style.display = "block"; // Hiển thị lại nút
            } else {
                loadMoreBtn.style.display = "none"; // Ẩn nút
            }
        })
        .catch((error) => {
            postsError.classList.add("show");
            postsError.textContent = `Lỗi: ${error.message}`;
        })
        .finally(() => {
            postsLoading.classList.remove("show");
        });
}

/* Tải 5 posts đầu tiên khi trang được load */
document.addEventListener("DOMContentLoaded", () => {
    loadPosts(currentPage);
});

/* Sự kiện click nút "Xem thêm" */
loadMoreBtn.addEventListener("click", () => {
    currentPage++;
    loadPosts(currentPage);
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

/* Hàm filter trạng thái: Tất cả | Đã hoàn thành | Chưa hoàn thành -> sau đó render */
function filterTodos() {
    let filterTodos = allTodos;
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
        const todoItem = todoItemTemplate.cloneNode(true);
        todoItem.dataset.todoId = todo.id;
        todoItem.dataset.completed = todo.completed;
        todoItem.querySelector(".todo-text").textContent = todo.title;
        todoItem.classList.add(todo.completed ? "completed" : "incomplete");
        todoList.appendChild(todoItem);
    });

    // Cập nhật thống kê
    const completedCount = allTodos.filter((todo) => todo.completed).length;
    totalTodos.textContent = allTodos.length;
    completedTodos.textContent = completedCount;
    incompleteTodos.textContent = allTodos.length - completedCount;
}

/* "Click": Nút loadTodosBtn */
loadTodosBtn.addEventListener("click", () => {
    const userId = todoUserIdInput.value;
    if (!userId) {
        todoError.classList.add("show");
        todoError.textContent = "Vui lòng nhập User ID.";
        return;
    }

    // Reset và hiển thị loading
    todosLoading.classList.add("show");
    todoError.classList.remove("show");
    todoList.innerHTML = "";
    allTodos = [];
    renderTodos([]);

    // Gửi request để nhận todos
    const todosUrl = `${API_BASE_URL}/users/${userId}/todos`;
    sendRequest("GET", todosUrl)
        .then((todos) => {
            allTodos = todos;
            filterTodos();
        })
        .catch((error) => {
            todoError.classList.add("show");
            todoError.textContent = `Lỗi: ${error.message}`;
        })
        .finally(() => {
            todosLoading.classList.remove("show");
        });
});

/* Click: Các nút filter */
todoFilters.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
        document.querySelector(".filter-btn.active").classList.remove("active");
        e.target.classList.add("active");
        currentFilter = e.target.dataset.filter;
        filterTodos(); // Cập nhật trạng thái của filter hiện tại
    }
});
