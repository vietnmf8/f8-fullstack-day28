/* ==========================================================
 * 3.1. Tạo async function wrapper với Fetch API
 * ========================================================== */

/* 
Hàm gửi yêu cầu
    -  Tham số của callback: (error, data)
*/

async function sendRequest(method, url) {
    const response = await fetch(url, { method: method });

    // Nếu response lỗi!
    if (!response.ok) {
        const error = new Error(`Lỗi! HTTP Code: ${response.status}`);
        error.status = response.status;
        throw error;
    }

    // Nếu response.ok -> parse JSON
    return response.json();
}

/* ==========================================================
 * 3.2. Refactor lại 3 chức năng sử dụng async/await
 * 3.3. Error Handling với try/catch
 * ==========================================================*/

/* Tạo URL chung */
const API_BASE_URL = "https://jsonplaceholder.typicode.com";

/**
 * Chức năng 1: User Profile Card
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
searchUserBtn.addEventListener("click", async () => {
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

    try {
        const userUrl = `${API_BASE_URL}/users/${userId}`;
        const user = await sendRequest("GET", userUrl);

        // Khi thành công! (Resolve)
        userProfileCard.classList.add("show");
        userAvatar.textContent = user.name.charAt(0);
        userName.textContent = user.name;
        userEmail.textContent = user.email;
        userPhone.textContent = user.phone;
        userWebsite.textContent = user.website;
        userCompany.textContent = user.company.name;
        userAddress.textContent = `${user.address.street}, ${user.address.city}`;
    } catch (error) {
        // Khi thất bại, hiển thị lỗi
        userError.classList.add("show");
        if (error.status === 404) {
            userError.textContent = `Lỗi: Không tìm thấy user với ID ${userId}.`;
        } else {
            userError.textContent = `Lỗi: ${error.message}`;
        }
    } finally {
        userLoading.classList.remove("show");
    }
});

/**
 * Chức năng 2: Posts với Comments
 */

/* Lấy các DOM element */
const postsContainer = document.querySelector("#posts-container");
const postsError = document.querySelector("#posts-error");
const postsLoading = document.querySelector("#posts-loading");
const loadMoreBtn = document.querySelector("#load-more-posts-btn");
const postItemTemplate = document.querySelector(".post-item[data-post-id='']");

/* Biến */
let currentPage = 1;

/* Hàm render Comment */
function renderComment(comment, commentsContainer) {
    const commentItemTemplate = document.querySelector(".comment-item");
    const commentItem = commentItemTemplate.cloneNode(true);

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
    (async () => {
        try {
            const userUrl = `${API_BASE_URL}/users/${post.userId}`;
            const user = await sendRequest("GET", userUrl);
            authorName.textContent = user.name;
        } catch (error) {
            authorName.textContent = "Tên tác giả không tồn tại!";
        }
    })(); // gọi hàm ẩn danh

    // Sự kiện click để xem/ẩn comments
    showCommentsBtn.addEventListener("click", async () => {
        const isShown = commentsContainer.classList.toggle("show");
        showCommentsBtn.textContent = isShown ? "Ẩn comments" : "Xem comments";

        if (isShown && commentsContainer.children.length === 0) {
            commentsContainer.innerHTML = `<p>🔄 Đang tải comments...</p>`;
            try {
                const commentsUrl = `${API_BASE_URL}/posts/${post.id}/comments`;
                const comments = await sendRequest("GET", commentsUrl);
                commentsContainer.innerHTML = ""; // Xóa loading và render comments
                comments.forEach((comment) => {
                    renderComment(comment, commentsContainer);
                });
            } catch (error) {
                commentsContainer.innerHTML = `<p class="error-message show">Lỗi khi tải comments.</p>`;
            }
        }
    });

    // Thêm post vào container
    postsContainer.appendChild(postItem);
}

/* Hàm tải posts theo trang */
async function loadPosts(page, limit = 5) {
    postsLoading.classList.add("show");
    loadMoreBtn.style.display = "none";
    postsError.classList.remove("show");

    try {
        const postsUrl = `${API_BASE_URL}/posts?_page=${page}&_limit=${limit}`;
        const posts = await sendRequest("GET", postsUrl);

        if (posts && posts.length > 0) {
            posts.forEach(renderPost);
            loadMoreBtn.style.display = "block";
        } else {
            loadMoreBtn.style.display = "none"; // Không còn post để tải
        }
    } catch (error) {
        postsError.classList.add("show");
        postsError.textContent = `Lỗi: ${error.message}`;
    } finally {
        postsLoading.classList.remove("show");
    }
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
 * Chức năng 3: Todo List với Filter
 */

/* Get DOM Element */
const loadTodosBtn = document.querySelector("#load-todos-btn");
const todoUserIdInput = document.querySelector("#todo-user-id-input");
const todoList = document.querySelector("#todo-list");
const todoFilters = document.querySelector("#todo-filters");
const todoError = document.querySelector("#todos-error");
const todoItemTemplate = document.querySelector(".todo-item[data-todo-id='']");
const todosLoading = document.querySelector("#todos-loading");
const totalTodos = document.querySelector("#total-todos");
const completedTodos = document.querySelector("#completed-todos");
const incompleteTodos = document.querySelector("#incomplete-todos");

/* Khởi tạo biến */
let allTodos = [];
let currentFilter = "all";

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
loadTodosBtn.addEventListener("click", async () => {
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

    try {
        const todosUrl = `${API_BASE_URL}/users/${userId}/todos`;
        const todos = await sendRequest("GET", todosUrl);
        allTodos = todos;
        filterTodos(); // Hiển thị dữ liệu mới
    } catch (error) {
        todoError.classList.add("show");
        if (error.status === 404) {
            todoError.textContent = `Lỗi: Không tìm thấy todos cho user ID ${userId}.`;
        } else {
            todoError.textContent = `Lỗi: ${error.message}`;
        }
    } finally {
        todosLoading.classList.remove("show");
    }
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