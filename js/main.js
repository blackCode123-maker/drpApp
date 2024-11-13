// Make sure this code runs first
document.addEventListener("DOMContentLoaded", function () {
  const preloaderContainer = document.querySelector(".preloader-container");

  // Function to handle the transition
  function handleTransition() {
    // Small delay to ensure display: block has taken effect
    setTimeout(() => {
      // Remove preloader
      preloaderContainer.style.opacity = "0";

      // Remove preloader from DOM after fade
      setTimeout(() => {
        preloaderContainer.remove();
      }, 500);
    }, 50);
  }

  // Start transition after 5 seconds
  setTimeout(handleTransition, 5000);
});

window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");

  // Add loading class to body
  document.body.classList.add("loading");

  setTimeout(() => {
    // Remove loading class from body
    document.body.classList.remove("loading");

    // Remove preloader completely after fade animation
    setTimeout(() => {
      preloader.style.display = "none";
      preloader.remove();
    }, 500);
  }, 5000);
});

// Scroll Animation
document.addEventListener("DOMContentLoaded", function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  });

  const noteSection = document.querySelector(".note-section");
  if (noteSection) {
    noteSection.classList.add("animate");
    observer.observe(noteSection);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const track = document.querySelector(".carousel-track");
  const slides = track.querySelectorAll(".carousel-slide");

  // Clone slides for infinite effect
  slides.forEach((slide) => {
    const clone = slide.cloneNode(true);
    track.appendChild(clone);
  });

  // Optional: Adjust animation speed based on screen width
  function updateAnimationSpeed() {
    const screenWidth = window.innerWidth;
    const speed = screenWidth < 768 ? "12s" : "15s";
    track.style.animationDuration = speed;
  }

  // Update on resize
  window.addEventListener("resize", updateAnimationSpeed);
  updateAnimationSpeed();
});
