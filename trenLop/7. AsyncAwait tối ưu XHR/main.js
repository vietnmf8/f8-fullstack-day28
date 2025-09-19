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
// send("GET", "https://jsonplaceholder.typicode.com/posts").then(renderPosts);

/* Hàm async */
async function run() {
    const url = "https://jsonplaceholder.typicode.com/posts";
    const posts = await send("GET", url);
    renderPosts(posts);
}

run();

/* Hàm render danh sách các bài posts */
function renderPosts(posts) {
    const list = document.querySelector("#list-posts");
    list.innerHTML = posts
        .map(
            (post) => `
        <li><a>${post.id}. ${post.title}</a></li>
        `
        )
        .join("");
}
