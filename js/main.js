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
});

// Form Handling
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("applicationForm");

  // Initialize phone input
  const phoneInput = window.intlTelInput(document.querySelector("#phone"), {
    utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
    preferredCountries: ["us", "gb", "ca"],
    separateDialCode: true,
  });

  // Form validation
  function validateForm() {
    let isValid = true;
    const inputs = form.querySelectorAll("input[required]");

    inputs.forEach((input) => {
      const errorElement = input.nextElementSibling;
      if (!input.value.trim()) {
        input.classList.add("error");
        errorElement.textContent = "This field is required";
        isValid = false;
      } else {
        input.classList.remove("error");
        errorElement.textContent = "";
      }
    });

    // Validate email
    const emailInput = form.querySelector("#email");
    if (
      emailInput.value &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)
    ) {
      emailInput.classList.add("error");
      emailInput.nextElementSibling.textContent =
        "Please enter a valid email address";
      isValid = false;
    }

    // Validate phone
    if (!phoneInput.isValidNumber()) {
      const phoneElement = form.querySelector("#phone");
      phoneElement.classList.add("error");
      phoneElement.nextElementSibling.textContent =
        "Please enter a valid phone number";
      isValid = false;
    }

    return isValid;
  }

  // Form submission
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please check all required fields",
        confirmButtonColor: "#c81533",
      });
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector(".submit-btn");
    const btnText = submitBtn.querySelector(".btn-text");
    const btnLoader = submitBtn.querySelector(".btn-loader");

    btnText.style.opacity = "0";
    btnLoader.style.display = "block";
    submitBtn.disabled = true;

    try {
      const formData = {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        email: form.email.value,
        phone: phoneInput.getNumber(),
        address: form.address.value,
        city: form.city.value,
        state: form.state.value,
        zipCode: form.zipCode.value,
        carMake: form.carMake.value,
        carModel: form.carModel.value,
        carYear: form.carYear.value,
      };

      const response = await fetch("http://localhost:3000/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Something went wrong. Please try again.",
        confirmButtonColor: "#c81533",
      });
    } finally {
      // Reset button state
      btnText.style.opacity = "1";
      btnLoader.style.display = "none";
      submitBtn.disabled = false;
    }
  });

  // Initialize form elements
  function initializePhoneInput() {
    const phoneElement = document.querySelector("#phone");
    if (phoneElement) {
      window.intlTelInput(phoneElement, {
        utilsScript:
          "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
        preferredCountries: ["us", "gb", "ca"],
        separateDialCode: true,
      });
    }
  }

  // Initialize on load
  initializePhoneInput();
});
