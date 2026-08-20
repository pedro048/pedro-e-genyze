(function () {
  "use strict";

  // ---------- Countdown ----------
  var WEDDING_DATE = new Date("2026-10-31T16:00:00-03:00").getTime();

  var els = {
    dias: document.getElementById("cd-dias"),
    horas: document.getElementById("cd-horas"),
    min: document.getElementById("cd-min"),
    seg: document.getElementById("cd-seg"),
  };

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tick() {
    var now = Date.now();
    var diff = WEDDING_DATE - now;

    if (diff <= 0) {
      els.dias.textContent = "00";
      els.horas.textContent = "00";
      els.min.textContent = "00";
      els.seg.textContent = "00";
      return;
    }

    var dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    var horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
    var min = Math.floor((diff / (1000 * 60)) % 60);
    var seg = Math.floor((diff / 1000) % 60);

    els.dias.textContent = pad(dias);
    els.horas.textContent = pad(horas);
    els.min.textContent = pad(min);
    els.seg.textContent = pad(seg);
  }

  tick();
  setInterval(tick, 1000);

  // ---------- Mobile nav ----------
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---------- Copy Pix key ----------
  var copyBtn = document.getElementById("copyPix");
  var pixKeyEl = document.getElementById("pixKey");

  if (copyBtn && pixKeyEl) {
    copyBtn.addEventListener("click", function () {
      var key = pixKeyEl.textContent.trim();
      if (!key || key === "EM BREVE") return;

      navigator.clipboard.writeText(key).then(function () {
        var original = copyBtn.textContent;
        copyBtn.textContent = "Copiado!";
        setTimeout(function () {
          copyBtn.textContent = original;
        }, 2000);
      });
    });
  }

  // ---------- Gallery lightbox ----------
  var galleryImgs = Array.prototype.slice.call(document.querySelectorAll(".gallery-item img"));
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxClose = document.getElementById("lightboxClose");
  var lightboxPrev = document.getElementById("lightboxPrev");
  var lightboxNext = document.getElementById("lightboxNext");
  var currentIndex = 0;

  function openLightbox(index) {
    currentIndex = (index + galleryImgs.length) % galleryImgs.length;
    var img = galleryImgs[currentIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (lightbox && galleryImgs.length) {
    galleryImgs.forEach(function (img, index) {
      img.addEventListener("click", function () {
        openLightbox(index);
      });
    });

    lightboxClose.addEventListener("click", closeLightbox);
    lightboxPrev.addEventListener("click", function () {
      openLightbox(currentIndex - 1);
    });
    lightboxNext.addEventListener("click", function () {
      openLightbox(currentIndex + 1);
    });

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") openLightbox(currentIndex - 1);
      if (e.key === "ArrowRight") openLightbox(currentIndex + 1);
    });
  }

  // ---------- Reveal on scroll ----------
  var revealTargets = document.querySelectorAll(".section, .ceremony-card, .gallery-item");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealTargets.forEach(function (el) {
      el.classList.add("reveal");
      observer.observe(el);
    });
  }
})();
