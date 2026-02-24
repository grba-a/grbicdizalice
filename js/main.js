(function () {
  const htmlEl = document.documentElement;

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

// =========================
// SOCIAL PROOF COUNT UP (robust)
// =========================
const counters = document.querySelectorAll(".social__number");

const parseTargetAndSuffix = (el) => {
  // 1) Prefer data-target + data-suffix
  const dt = el.getAttribute("data-target");
  const ds = el.getAttribute("data-suffix");

  if (dt != null && dt !== "") {
    const target = parseInt(dt, 10);
    const suffix = ds != null ? ds : "";
    return { target, suffix };
  }

  // 2) Fallback: read from current text e.g. "120+" / "24h"
  const raw = (el.textContent || "").trim();
  const target = parseInt(raw.replace(/[^\d]/g, ""), 10);
  const suffix = raw.replace(/[\d\s]/g, "");
  return { target, suffix };
};

const animateCounter = (el) => {
  if (el.dataset.animated === "true") return;

  const { target, suffix } = parseTargetAndSuffix(el);
  if (!Number.isFinite(target) || target <= 0) return;

  el.dataset.animated = "true";
  el.textContent = `0${suffix}`;

  const duration = 2600; // povećaj za sporije (npr. 4000)
  const start = performance.now();

  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic

    const current = Math.round(target * eased);
    el.textContent = `${current}${suffix}`;

    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = `${target}${suffix}`;
  };

  requestAnimationFrame(tick);
};

const startObservers = () => {
  if (!counters.length) return;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );

    counters.forEach((c) => observer.observe(c));
  } else {
    counters.forEach(animateCounter);
  }

  // fallback: ako je već u viewportu odmah
  counters.forEach((c) => {
    const r = c.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) animateCounter(c);
  });
};

// bitno: pokreni nakon što DOM postoji
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startObservers);
} else {
  startObservers();
}

  // SCROLL TO TOP
const scrollBtn = document.getElementById("scrollTop");

window.addEventListener("scroll", () => {
  if (!scrollBtn) return;

  if (window.scrollY > 600) {
    scrollBtn.classList.add("is-visible");
  } else {
    scrollBtn.classList.remove("is-visible");
  }
});

if (scrollBtn) {
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

