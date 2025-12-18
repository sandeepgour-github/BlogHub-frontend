document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("category-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const catName = document.getElementById("catName").value.trim();
    const descr = document.getElementById("descr").value.trim();

    if (!catName) {
      showAlert("Category name is required!", "error");
      return;
    }

    try {
      const response = await fetch("http://localhost:8082/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ catName, descr }),
      });

      if (!response.ok) throw new Error("Failed to create category");

      showAlert("✅ Category created successfully!", "success");

      // Clear form fields
      form.reset();

      // Optionally redirect back to categories page after 1s
      setTimeout(() => (window.location.href = "categories.html"), 1000);
    } catch (error) {
      showAlert(`❌ ${catName} Category Already Exists`, "error");
    }
  });
});

// Simple alert display function
function showAlert(message, type) {
  const alertContainer = document.getElementById("alert-container");
  alertContainer.innerHTML = `<p style="color:${
    type === "error" ? "red" : "green"
  };text-align:center;">${message}</p>`;
}
