document.getElementById("user-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    about: document.getElementById("about").value,
  };

  try {
    await apiPost("http://localhost:8082/api/users", user);
    showAlert("✅ User created successfully!", "success");
    setTimeout(() => (window.location.href = "users.html"), 1500);
  } catch {
    showAlert("❌ Failed to create user.", "error");
  }
});

async function apiPost(url, data) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

function showAlert(msg, type) {
  document.getElementById(
    "alert-container"
  ).innerHTML = `<p class="${type}">${msg}</p>`;
}
