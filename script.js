const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const toast = document.querySelector(".toast");

const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector(".theme-toggle__icon");
const themeLabel = document.querySelector(".theme-toggle__label");
const root = document.documentElement;


menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "بستن منو" : "باز کردن منو");
  menuToggle.textContent = isOpen ? "×" : "☰";
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    if (menuToggle) {
      menuToggle.textContent = "☰";
      menuToggle.setAttribute("aria-label", "باز کردن منو");
    }
  });
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copy;
    try {
      await navigator.clipboard.writeText(value);
      showToast("شماره تماس کپی شد.");
    } catch {
      // Fallback for browsers that block clipboard access on local files.
      const field = document.createElement("textarea");
      field.value = value;
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      const copied = document.execCommand("copy");
      field.remove();
      showToast(copied ? "شماره تماس کپی شد." : "شماره: " + value);
    }
  });
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

document.querySelector("#year").textContent = new Date().getFullYear();


function applyTheme(theme) {
  const isDark = theme === "dark";

  root.dataset.theme = theme;

  if (themeIcon) {
    themeIcon.textContent = isDark ? "☀" : "☾";
  }

  if (themeLabel) {
    themeLabel.textContent = isDark ? "پوسته روشن" : "پوسته تیره";
  }

  if (themeToggle) {
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "تغییر به پوسته روشن" : "تغییر به پوسته تیره"
    );

    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.title = isDark
      ? "تغییر به پوسته روشن"
      : "تغییر به پوسته تیره";
  }

  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", isDark ? "#191411" : "#f4f0e9");
}

let savedTheme = "light";

try {
  const preference = localStorage.getItem("levitage-theme");

  if (preference === "dark" || preference === "light") {
    savedTheme = preference;
  }
} catch {
}

applyTheme(savedTheme);

themeToggle?.addEventListener("click", () => {
  const nextTheme =
    root.dataset.theme === "dark" ? "light" : "dark";

  applyTheme(nextTheme);

  try {
    localStorage.setItem("levitage-theme", nextTheme);
  } catch {
  }
});