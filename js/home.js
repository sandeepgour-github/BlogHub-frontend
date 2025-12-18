document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  await loadStats();
  await loadPosts();
  loadFeaturedPosts();
  setupSearch();
});

let allPosts = [];
let allAuthors = [];

// Fetch helper
async function apiGet(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch " + url);
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// Toast notification
function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `toast ${type} show`;

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Fetch and display stats
async function loadStats() {
  const posts = await apiGet("http://localhost:8082/api/posts/getAll");
  const authors = await apiGet("http://localhost:8082/api/users");
  const categories = await apiGet("http://localhost:8082/api/categories");

  allPosts = posts || [];
  allAuthors = authors || [];

  document.getElementById("total-posts").innerText = allPosts.length;
  document.getElementById("total-authors").innerText = allAuthors.length;
  document.getElementById("total-categories").innerText = categories.length;
}

// Display featured posts (top 3)
function loadFeaturedPosts() {
  const container = document.getElementById("featured-posts-grid");
  if (!container) return;

  container.innerHTML = "";

  if (!allPosts || allPosts.length === 0) {
    container.innerHTML = "<p>No posts available</p>";
    return;
  }
  console.log(allPosts);
  container.innerHTML = allPosts
    .slice(0, 3) // show first 3 featured posts
    .map(
      (post) => `
      <div class="post-card" onclick="window.location.href='post.html?id=${
        post.id
      }'">
          <div class="post-info">
              <div class="post-meta">
                  <span class="post-category">${post.categoryName}</span>
                  <span class="post-date">${
                    post.createdAt
                      ? new Date(
                          post.createdAt.split(".")[0]
                        ).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      : "Unknown date"
                  }</span>
              </div>
              <h3 class="post-title">${post.title}</h3>
              <p class="post-excerpt">${post.content.substring(0, 100)}...</p>
              <div class="post-author">
                  <span class="author-name">By  ${
                    post.authorName.substring(0, 1).toUpperCase() +
                      post.authorName.substring(1).toLowerCase() || "Unknown"
                  }</span>
              </div>
          </div>
      </div>
      `
    )
    .join("");
}

// Fetch all posts and display in main list
async function loadPosts() {
  if (!allPosts || allPosts.length === 0) {
    allPosts = (await apiGet("http://localhost:8082/api/posts/getAll")) || [];
  }
  displayPosts(allPosts);
}

// Display posts in a container
function displayPosts(posts) {
  const container = document.getElementById("posts-list");
  if (!container) return;

  container.innerHTML = "";

  if (!posts || posts.length === 0) {
    container.innerHTML = "<p>No posts found</p>";
    return;
  }

  posts.forEach((post) => {
    const card = document.createElement("div");
    card.className = "post-card";

    const createdAt = post.createdAt
      ? new Date(post.createdAt.split(".")[0]).toLocaleString()
      : "Unknown date";

    card.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content.substring(0, 120)}...</p>
      <small>Posted on: ${createdAt}</small>
      <p>Post ID: ${post.id}</p>
      <br>
      <a href="post.html?id=${post.id}" class="read-more">Read More</a>
    `;

    container.appendChild(card);
  });
}

// Setup search functionality
function setupSearch() {
  const searchInput = document.getElementById("search-input");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim().toLowerCase();
    const filtered = allPosts.filter((post) =>
      post.title.toLowerCase().includes(query)
    );
    displayPosts(filtered);
  });
}
