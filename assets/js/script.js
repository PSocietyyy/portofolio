document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("active");
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const skills = document.querySelectorAll(".skill");
  const modal = document.getElementById("skillModal");
  const modalTitle = document.getElementById("modal-title");
  const modalDescription = document.getElementById("modal-description");
  const closeButton = document.querySelector(".close-btn");

  // Ensure the modal is hidden initially
  modal.style.display = "none";

  const skillData = {
    tensorflow: {
      title: "TensorFlow",
      description:
        "TensorFlow is an open-source framework by Google for building and training machine learning models, especially deep learning. It excels in NLP models like Transformers.",
    },
    sklearn: {
      title: "Scikit-Learn",
      description:
        "Scikit-Learn is a lightweight and easy-to-use machine learning library in Python, featuring classification, regression, and clustering algorithms.",
    },
    pandas: {
      title: "Pandas",
      description:
        "Pandas is a powerful Python library for data manipulation and analysis. It is widely used in AI and ML for handling structured data efficiently.",
    },
    python: {
      title: "Python",
      description:
        "Python is the primary programming language for AI and Machine Learning. It is easy to learn, flexible, and has extensive NLP libraries.",
    },
    matplotlib: {
      title: "Matplotlib",
      description:
        "Matplotlib is a Python data visualization library used for creating statistical charts and plots in data analysis.",
    },
    numpy: {
      title: "NumPy",
      description:
        "NumPy is a fundamental library for numerical computing in Python, widely used for vector and matrix processing in AI and ML.",
    },
  };

  skills.forEach((skill) => {
    skill.addEventListener("click", function () {
      const skillKey = skill
        .querySelector("img")
        .getAttribute("src")
        .split("/")
        .pop()
        .split(".")[0];

      if (skillData[skillKey]) {
        modalTitle.textContent = skillData[skillKey].title;
        modalDescription.textContent = skillData[skillKey].description;
        modal.style.display = "flex"; // Show modal only when clicked
      }
    });
  });

  closeButton.addEventListener("click", function () {
    modal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});
