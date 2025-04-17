document.addEventListener("DOMContentLoaded", () => {
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

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const fileInput = document.getElementById("fileInput");
  const previewContainer = document.getElementById("previewContainer");
  const imagePreview = document.getElementById("imagePreview");
  const removeBtn = document.getElementById("removeBtn");
  const validationResults = document.getElementById("validationResults");
  const resultsList = document.getElementById("resultsList");

  // Requirement elements
  const sizeReq = document.getElementById("sizeReq");
  const widthReq = document.getElementById("widthReq");
  const ratioReq = document.getElementById("ratioReq");
  const fileSizeReq = document.getElementById("fileSizeReq");
  const fileTypeReq = document.getElementById("fileTypeReq");

  // Requirements
  const requirements = {
    size: {
      width: 1280,
      height: 720,
      element: sizeReq,
    },
    minWidth: {
      value: 640,
      element: widthReq,
    },
    ratio: {
      value: 16 / 9,
      tolerance: 0.1, // 10% tolerance
      element: ratioReq,
    },
    fileSize: {
      max: 2 * 1024 * 1024, // 2MB in bytes
      element: fileSizeReq,
    },
    fileType: {
      types: [".jpg", ".jpeg", ".png", ".gif", ".bmp"],
      element: fileTypeReq,
    },
  };

  // Handle file selection via input
  fileInput.addEventListener("change", handleFileSelect);

  // Remove button functionality
  removeBtn?.addEventListener("click", () => {
    resetUpload();
  });

  function handleFileSelect(e) {
    const file = fileInput.files[0];

    if (!file) return;

    // Reset previous validation
    resetValidation();

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.src = e.target.result;
      previewContainer.style.display = "block";

      // Create a temporary image to get dimensions
      const img = new Image();
      img.onload = () => {
        validateImage(file, img.width, img.height);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function validateImage(file, width, height) {
    const results = [];
    let allPassed = true;

    // 1. Check image dimensions (1280x720 recommended)
    const idealWidth = requirements.size.width;
    const idealHeight = requirements.size.height;
    const isIdealSize = width === idealWidth && height === idealHeight;

    updateRequirementStatus(
      requirements.size.element,
      isIdealSize ? "success" : "warning"
    );

    results.push({
      type: isIdealSize ? "success" : "warning",
      title: "Image Dimensions",
      message: isIdealSize
        ? `Perfect! Your image is exactly ${idealWidth}x${idealHeight} pixels.`
        : `Your image is ${width}x${height} pixels. Recommended size is ${idealWidth}x${idealHeight} pixels.`,
    });

    // 2. Check minimum width (640px)
    const minWidth = requirements.minWidth.value;
    const hasMinWidth = width >= minWidth;

    updateRequirementStatus(
      requirements.minWidth.element,
      hasMinWidth ? "success" : "error"
    );

    results.push({
      type: hasMinWidth ? "success" : "error",
      title: "Minimum Width",
      message: hasMinWidth
        ? `Your image width (${width}px) meets the minimum requirement of ${minWidth}px.`
        : `Your image width (${width}px) is below the minimum requirement of ${minWidth}px.`,
    });

    if (!hasMinWidth) allPassed = false;

    // 3. Check aspect ratio (16:9 recommended)
    const idealRatio = requirements.ratio.value;
    const tolerance = requirements.ratio.tolerance;
    const actualRatio = width / height;
    const ratioLowerBound = idealRatio * (1 - tolerance);
    const ratioUpperBound = idealRatio * (1 + tolerance);
    const hasIdealRatio =
      actualRatio >= ratioLowerBound && actualRatio <= ratioUpperBound;

    updateRequirementStatus(
      requirements.ratio.element,
      hasIdealRatio ? "success" : "warning"
    );

    results.push({
      type: hasIdealRatio ? "success" : "warning",
      title: "Aspect Ratio",
      message: hasIdealRatio
        ? `Your image has a good aspect ratio (${actualRatio.toFixed(
            2
          )}, close to 16:9).`
        : `Your image aspect ratio is ${actualRatio.toFixed(
            2
          )}. Recommended ratio is 16:9 (${idealRatio.toFixed(2)}).`,
    });

    // 4. Check file size (max 2MB)
    const maxSize = requirements.fileSize.max;
    const fileSize = file.size;
    const isValidSize = fileSize <= maxSize;

    updateRequirementStatus(
      requirements.fileSize.element,
      isValidSize ? "success" : "error"
    );

    results.push({
      type: isValidSize ? "success" : "error",
      title: "File Size",
      message: isValidSize
        ? `Your file size (${formatFileSize(
            fileSize
          )}) is within the limit of ${formatFileSize(maxSize)}.`
        : `Your file size (${formatFileSize(
            fileSize
          )}) exceeds the maximum limit of ${formatFileSize(maxSize)}.`,
    });

    if (!isValidSize) allPassed = false;

    // 5. Check file type (.JPG, .GIF, .BMP, or .PNG)
    const validTypes = requirements.fileType.types;
    const fileExt = "." + file.name.split(".").pop().toLowerCase();
    const isValidType = validTypes.includes(fileExt);

    updateRequirementStatus(
      requirements.fileType.element,
      isValidType ? "success" : "error"
    );

    results.push({
      type: isValidType ? "success" : "error",
      title: "File Type",
      message: isValidType
        ? `Your file type (${fileExt}) is supported.`
        : `Your file type (${fileExt}) is not supported. Accepted types: ${validTypes.join(
            ", "
          )}.`,
    });

    if (!isValidType) allPassed = false;

    // Display results
    displayResults(results, allPassed);
  }

  function updateRequirementStatus(element, status) {
    // Remove existing status classes
    element.querySelector("i").className = "";

    // Add appropriate icon class
    if (status === "success") {
      element.querySelector("i").className = "fas fa-check-circle";
    } else if (status === "error") {
      element.querySelector("i").className = "fas fa-times-circle";
    } else if (status === "warning") {
      element.querySelector("i").className = "fas fa-exclamation-circle";
    } else {
      element.querySelector("i").className = "fas fa-circle-notch";
    }
  }

  function displayResults(results, allPassed) {
    // Clear previous results
    resultsList.innerHTML = "";

    // Add overall status
    const overallResult = document.createElement("div");
    overallResult.className = `result-item ${allPassed ? "success" : "error"}`;
    overallResult.innerHTML = `
      <i class="fas ${allPassed ? "fa-check-circle" : "fa-times-circle"}"></i>
      <div class="result-content">
        <h4>Overall Status</h4>
        <p>${
          allPassed
            ? "Your image meets all required specifications!"
            : "Your image does not meet all required specifications."
        }</p>
      </div>
    `;
    resultsList.appendChild(overallResult);

    // Add individual results
    results.forEach((result) => {
      const resultItem = document.createElement("div");
      resultItem.className = `result-item ${result.type}`;
      resultItem.innerHTML = `
        <i class="fas ${
          result.type === "success"
            ? "fa-check-circle"
            : result.type === "warning"
            ? "fa-exclamation-circle"
            : "fa-times-circle"
        }"></i>
        <div class="result-content">
          <h4>${result.title}</h4>
          <p>${result.message}</p>
        </div>
      `;
      resultsList.appendChild(resultItem);
    });

    // Show results section
    validationResults.style.display = "block";
  }

  function resetUpload() {
    // Clear file input
    fileInput.value = "";

    // Hide preview
    previewContainer.style.display = "none";
    imagePreview.src = "";

    // Reset validation
    resetValidation();

    // Hide results
    validationResults.style.display = "none";
  }

  function resetValidation() {
    // Reset requirement indicators
    const requirementElements = [
      requirements.size.element,
      requirements.minWidth.element,
      requirements.ratio.element,
      requirements.fileSize.element,
      requirements.fileType.element,
    ];

    requirementElements.forEach((element) => {
      updateRequirementStatus(element, "pending");
    });
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) {
      return bytes + " bytes";
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + " KB";
    } else {
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    }
  }
});
