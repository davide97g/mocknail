document.addEventListener("DOMContentLoaded", () => {
  // Toggle menu button
  const menuBtn = document.querySelector(".menu-btn");
  const sidebar = document.querySelector(".sidebar");

  menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("expanded");
  });

  // Category buttons
  const categoryBtns = document.querySelectorAll(".category-btn");

  categoryBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons
      categoryBtns.forEach((b) => b.classList.remove("active"));
      // Add active class to clicked button
      this.classList.add("active");
    });
  });

  // Video card hover effect
  const videoCards = document.querySelectorAll(".video-card");

  videoCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)";
      this.style.transition = "transform 0.3s ease";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });

  // Search form submission
  const searchForm = document.querySelector(".search-form");

  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const searchTerm = this.querySelector("input").value;
    alert(`You searched for: ${searchTerm}`);
  });

  // Simulate loading videos
  function simulateVideoLoading() {
    const thumbnails = document.querySelectorAll(".thumbnail img");

    thumbnails.forEach((img, index) => {
      // Simulate staggered loading
      setTimeout(() => {
        img.style.opacity = "1";
      }, index * 200);
    });
  }

  // Initialize with a slight delay to simulate loading
  setTimeout(simulateVideoLoading, 500);
});
