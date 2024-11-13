// Preloader Animation
document.addEventListener("DOMContentLoaded", function () {
  const preloaderContainer = document.querySelector(".preloader-container");

  function handleTransition() {
    setTimeout(() => {
      preloaderContainer.style.opacity = "0";
      setTimeout(() => {
        preloaderContainer.remove();
      }, 500);
    }, 50);
  }

  setTimeout(handleTransition, 5000);
});

window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  document.body.classList.add("loading");

  setTimeout(() => {
    document.body.classList.remove("loading");
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

// Carousel Animation
document.addEventListener("DOMContentLoaded", function () {
  const track = document.querySelector(".carousel-track");
  if (track) {
    const slides = track.querySelectorAll(".carousel-slide");

    slides.forEach((slide) => {
      const clone = slide.cloneNode(true);
      track.appendChild(clone);
    });

    function updateAnimationSpeed() {
      const screenWidth = window.innerWidth;
      const speed = screenWidth < 768 ? "12s" : "15s";
      track.style.animationDuration = speed;
    }

    window.addEventListener("resize", updateAnimationSpeed);
    updateAnimationSpeed();
  }
});

// Form Handling
document.addEventListener("DOMContentLoaded", function () {
  console.log("Script loaded");

  const form = document.getElementById("applicationForm");
  if (!form) {
    console.error("Form not found");
    return;
  }

  // Initialize phone input
  let phoneInput;
  const phoneElement = document.querySelector("#phone");
  if (phoneElement) {
    phoneInput = window.intlTelInput(phoneElement, {
      utilsScript:
        "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
      preferredCountries: ["us", "gb", "ca"],
      separateDialCode: true,
    });
  }

  // Form validation
  function validateForm() {
    let isValid = true;

    // Validate required fields
    const inputs = form.querySelectorAll("input[required]");
    inputs.forEach((input) => {
      const errorDiv = input.parentElement.querySelector(".error-message");
      if (!input.value.trim()) {
        input.classList.add("error");
        if (errorDiv) {
          errorDiv.textContent = "This field is required";
          errorDiv.style.display = "block";
        }
        isValid = false;
      } else {
        input.classList.remove("error");
        if (errorDiv) {
          errorDiv.textContent = "";
          errorDiv.style.display = "none";
        }
      }
    });

    // Validate email
    const emailInput = form.querySelector("#email");
    const emailError =
      emailInput?.parentElement.querySelector(".error-message");
    if (
      emailInput?.value &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)
    ) {
      emailInput.classList.add("error");
      if (emailError) {
        emailError.textContent = "Please enter a valid email address";
        emailError.style.display = "block";
      }
      isValid = false;
    }

    // Validate phone
    if (phoneInput && !phoneInput.isValidNumber()) {
      const phoneError =
        phoneElement?.parentElement.querySelector(".error-message");
      phoneElement.classList.add("error");
      if (phoneError) {
        phoneError.textContent = "Please enter a valid phone number";
        phoneError.style.display = "block";
      }
      isValid = false;
    }

    // Validate ZIP code
    const zipInput = form.querySelector("#zipCode");
    const zipError = zipInput?.parentElement.querySelector(".error-message");
    if (zipInput?.value && !/^\d{5}(-\d{4})?$/.test(zipInput.value)) {
      zipInput.classList.add("error");
      if (zipError) {
        zipError.textContent = "Please enter a valid ZIP code";
        zipError.style.display = "block";
      }
      isValid = false;
    }

    // Validate car year
    const yearInput = form.querySelector("#carYear");
    const yearError = yearInput?.parentElement.querySelector(".error-message");
    const currentYear = new Date().getFullYear();
    if (yearInput?.value) {
      const year = parseInt(yearInput.value);
      if (isNaN(year) || year < 1900 || year > currentYear + 1) {
        yearInput.classList.add("error");
        if (yearError) {
          yearError.textContent = "Please enter a valid car year";
          yearError.style.display = "block";
        }
        isValid = false;
      }
    }

    return isValid;
  }

  // Form submission
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    console.log("Form submitted");

    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please check all required fields",
        confirmButtonColor: "#c81533",
      });
      return;
    }

    const submitBtn = form.querySelector(".submit-btn");
    const btnText = submitBtn.querySelector(".btn-text");
    const btnLoader = submitBtn.querySelector(".btn-loader");

    if (btnText && btnLoader) {
      btnText.style.opacity = "0";
      btnLoader.style.display = "block";
      submitBtn.disabled = true;
    }

    try {
      const formData = new FormData(form);
      if (phoneInput) {
        formData.append("phone", phoneInput.getNumber());
      }

      // Log form data for debugging
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const response = await fetch("http://localhost:3000/send-email", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: data.message,
          confirmButtonColor: "#c81533",
        });
        form.reset();
        phoneInput.destroy();
        initializePhoneInput(); // Reinitialize phone input after form reset
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Something went wrong. Please try again.",
        confirmButtonColor: "#c81533",
      });
    } finally {
      // Reset button state
      if (btnText && btnLoader) {
        btnText.style.opacity = "1";
        btnLoader.style.display = "none";
        submitBtn.disabled = false;
      }
    }
  });

  // Initialize form elements
  function initializePhoneInput() {
    const phoneElement = document.querySelector("#phone");
    if (phoneElement) {
      return window.intlTelInput(phoneElement, {
        utilsScript:
          "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
        preferredCountries: ["us", "gb", "ca"],
        separateDialCode: true,
      });
    }
  }
});
