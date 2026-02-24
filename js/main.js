(function () {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Smooth scroll for elements with [data-scroll]
  document.querySelectorAll("[data-scroll]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const href = el.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Mobile menu
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

  // LIGHTBOX (overlay, same tab)
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");

  const isLightboxOpen = () => lightbox && !lightbox.hidden;

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
    lightboxImg.alt = "";
    document.documentElement.style.overflow = "";
  };

  // bind all lightbox links (projects + equipment)
  document.querySelectorAll("[data-lightbox]").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const img = a.querySelector("img");
      const src = a.getAttribute("href");
      if (!src) return;
      openLb(src, img ? img.alt : "");
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLb);

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      // close only if user clicked the dark backdrop, not the image
      if (e.target === lightbox) closeLb();
    });
  }

  // Global ESC: closes lightbox first, otherwise closes mobile menu
  window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;

    if (isLightboxOpen()) {
      closeLb();
      return;
    }
    setMobileOpen(false);
  });

  // Equipment carousel + synced specs
  const specList = document.getElementById("specList");
  const carousel = document.getElementById("equipmentCarousel");
  const track = document.getElementById("carouselTrack");
  const prevBtn = document.getElementById("carouselPrev");
  const nextBtn = document.getElementById("carouselNext");
  const dotsWrap = document.getElementById("carouselDots");

  const equipmentData = [
    {
      specs: [
        "Nosivost: [upiši]",
        "Doseg ruke: [upiši]",
        "Radna visina: [upiši]",
        "Dodatna oprema: [upiši]",
      ],
    },
    {
      specs: [
        "Nosivost: [upiši]",
        "Doseg ruke: [upiši]",
        "Radna visina: [upiši]",
        "Stabilizacija / pristup: [upiši]",
      ],
    },
    {
      specs: [
        "Nosivost: [upiši]",
        "Doseg ruke: [upiši]",
        "Radna visina: [upiši]",
        "Operater + plan podizanja: [upiši]",
      ],
    },
  ];

  const slides = track ? Array.from(track.children) : [];
  let index = 0;

  const renderSpecs = (i) => {
    if (!specList) return;
    const data = equipmentData[i] || equipmentData[0];
    specList.innerHTML = data.specs.map((s) => `<li>${s}</li>`).join("");
  };

  const setActiveDot = (i) => {
    if (!dotsWrap) return;
    dotsWrap.querySelectorAll(".carousel__dot").forEach((d, di) => {
      d.classList.toggle("is-active", di === i);
      d.setAttribute("aria-current", di === i ? "true" : "false");
    });
  };

  const goTo = (i) => {
    if (!track || slides.length === 0) return;
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    renderSpecs(index);
    setActiveDot(index);
  };

  // build dots
  if (dotsWrap && slides.length) {
    dotsWrap.innerHTML = slides
      .map(
        (_, i) =>
          `<button class="carousel__dot" type="button" aria-label="Slika ${
            i + 1
          }"></button>`
      )
      .join("");

    dotsWrap.querySelectorAll(".carousel__dot").forEach((dot, i) => {
      dot.addEventListener("click", () => goTo(i));
    });
  }

  if (prevBtn) prevBtn.addEventListener("click", () => goTo(index - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => goTo(index + 1));

  // swipe (mobile)
  if (carousel && track) {
    let startX = 0;
    let dx = 0;
    let dragging = false;

    carousel.addEventListener(
      "touchstart",
      (e) => {
        dragging = true;
        startX = e.touches[0].clientX;
        dx = 0;
      },
      { passive: true }
    );

    carousel.addEventListener(
      "touchmove",
      (e) => {
        if (!dragging) return;
        dx = e.touches[0].clientX - startX;
      },
      { passive: true }
    );

    carousel.addEventListener("touchend", () => {
      if (!dragging) return;
      dragging = false;

      if (Math.abs(dx) > 50) {
        goTo(dx < 0 ? index + 1 : index - 1);
      }
    });
  }

  // init carousel/specs
  if (slides.length) goTo(0);

  // Lead form -> mailto (basic)
  const form = document.getElementById("leadForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const location = String(data.get("location") || "").trim();
      const message = String(data.get("message") || "").trim();

      if (!name || !phone || !location || !message) {
        alert("Molim ispuni sva polja.");
        return;
      }

      const subject = encodeURIComponent("Upit – najam dizalice");
      const body = encodeURIComponent(
        `Ime: ${name}\nTelefon: ${phone}\nLokacija: ${location}\n\nOpis:\n${message}\n`
      );

      // PROMIJENI EMAIL
      window.location.href = `mailto:info@dubrovnikdizalica.com?subject=${subject}&body=${body}`;
    });
  }
})();