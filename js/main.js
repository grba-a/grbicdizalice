(function () {
  const htmlEl = document.documentElement;

  // =========================
  // THEME (dark / light only) + HOTKEY
  // =========================
  const THEME_KEY = "theme";

  const getSavedTheme = () => {
    const v = localStorage.getItem(THEME_KEY);
    return v === "light" ? "light" : "dark";
  };

  const applyTheme = (mode) => {
    if (mode === "light") {
      htmlEl.setAttribute("data-theme", "light");
    } else {
      htmlEl.removeAttribute("data-theme");
    }

    const btn = document.getElementById("themeToggle");
    if (btn) {
      const isDark = mode === "dark";
      btn.setAttribute("aria-pressed", String(isDark));
      btn.innerHTML = isDark ? "🌙" : "☀️";
      btn.title = "Promijeni temu (T)";
    }
  };

  const setTheme = (mode) => {
    localStorage.setItem(THEME_KEY, mode);
    applyTheme(mode);
  };

  const toggleTheme = () => {
    const current = getSavedTheme();
    setTheme(current === "dark" ? "light" : "dark");
  };

  // init
  applyTheme(getSavedTheme());

  // click
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  // hotkeys: T toggle, D dark, L light
  window.addEventListener("keydown", (e) => {
    const tag = e.target?.tagName?.toLowerCase();
    const isTyping =
      tag === "input" ||
      tag === "textarea" ||
      tag === "select" ||
      e.target?.isContentEditable;

    if (isTyping || e.ctrlKey || e.metaKey || e.altKey) return;

    const k = e.key.toLowerCase();

    if (k === "t") {
      e.preventDefault();
      toggleTheme();
    }
    if (k === "d") {
      e.preventDefault();
      setTheme("dark");
    }
    if (k === "l") {
      e.preventDefault();
      setTheme("light");
    }
  });

  // =========================
  // Footer year
  // =========================
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // =========================
  // Smooth scroll
  // =========================
  document.querySelectorAll("[data-scroll]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const href = el.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // =========================
  // Mobile menu
  // =========================
  const burger = document.getElementById("burger");
  const mobile = document.getElementById("mobile");

  const setMobileOpen = (open) => {
    if (!burger || !mobile) return;
    burger.setAttribute("aria-expanded", String(open));
    mobile.hidden = !open;
    document.documentElement.style.overflow = open ? "hidden" : "";
  };

  if (burger && mobile) {
    burger.addEventListener("click", () => {
      const isOpen = burger.getAttribute("aria-expanded") === "true";
      setMobileOpen(!isOpen);
    });

    mobile.querySelectorAll("[data-close]").forEach((link) => {
      link.addEventListener("click", () => setMobileOpen(false));
    });
  }

  // =========================
  // LIGHTBOX
  // =========================
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");

  const openLb = (src, alt) => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.hidden = false;
    document.documentElement.style.overflow = "hidden";
  };

  const closeLb = () => {
    if (!lightbox || !lightboxImg) return;
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.documentElement.style.overflow = "";
  };

  document.querySelectorAll("[data-lightbox]").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const img = a.querySelector("img");
      openLb(a.href, img?.alt);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLb);
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLb();
    });
  }

  // =========================
  // Equipment carousel
  // =========================
  const specList = document.getElementById("specList");
  const carousel = document.getElementById("equipmentCarousel");
  const track = document.getElementById("carouselTrack");
  const prevBtn = document.getElementById("carouselPrev");
  const nextBtn = document.getElementById("carouselNext");
  const dotsWrap = document.getElementById("carouselDots");

  const equipmentData = [
    { specs: ["Nosivost: [upiši]", "Doseg: [upiši]", "Visina: [upiši]"] },
    { specs: ["Nosivost: [upiši]", "Doseg: [upiši]", "Stabilizacija"] },
    { specs: ["Nosivost: [upiši]", "Radna visina", "Operater"] },
  ];

  const slides = track ? Array.from(track.children) : [];
  let index = 0;

  const renderSpecs = (i) => {
    if (!specList) return;
    specList.innerHTML = equipmentData[i].specs.map((s) => `<li>${s}</li>`).join("");
  };

  const goTo = (i) => {
    if (!track) return;
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    renderSpecs(index);
  };

  if (prevBtn) prevBtn.addEventListener("click", () => goTo(index - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => goTo(index + 1));

  if (slides.length) goTo(0);

  // =========================
  // Lead form
  // =========================
  const form = document.getElementById("leadForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const subject = encodeURIComponent("Upit – najam dizalice");
      const body = encodeURIComponent(
        `Ime: ${data.get("name")}\nTelefon: ${data.get("phone")}\nLokacija: ${data.get("location")}\n\n${data.get("message")}`
      );

      window.location.href = `mailto:info@dubrovnikdizalica.com?subject=${subject}&body=${body}`;
    });
  }
})();