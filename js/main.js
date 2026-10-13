document.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector("#loader");
  const loaderBar = document.querySelector(".loader-line span");
  const cursor = document.querySelector(".cursor");
  const cursorDot = document.querySelector(".cursor-dot");
  const hasGSAP = typeof window.gsap !== "undefined";
  const hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";
  const hasLenis = typeof window.Lenis !== "undefined";
  const hasAOS = typeof window.AOS !== "undefined";
  const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let lenis = null;

  function hideLoader() {
    if (!loader) return;
    loader.classList.add("is-hidden");
    setTimeout(() => loader.remove(), 800);
  }


  if (hasAOS) {
    AOS.init({
      duration: 1050,
      easing: "ease-out-cubic",
      once: true,
      offset: 35,
      anchorPlacement: "top-bottom",
      delay: 0,
      disable: () => isReduced
    });
  }

  const loaderFallback = setTimeout(hideLoader, 2600);

  if (hasGSAP && !isReduced) {
    const tl = gsap.timeline({
      defaults: { ease: "power4.out" },
      onComplete: () => {
        clearTimeout(loaderFallback);
        hideLoader();
        introMotion();
      }
    });

    tl.to(loaderBar, { width: "100%", duration: 0.9 })
      .to(".loader-box", { y: -22, opacity: 0, duration: 0.65 }, "+=0.15");
  } else {
    hideLoader();
  }

  if (hasLenis && !isReduced) {
    lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 0.9
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: 0 });
      else target.scrollIntoView({ behavior: isReduced ? "auto" : "smooth" });
    });
  });

  if (hasGSAP && hasScrollTrigger && !isReduced) {
    gsap.registerPlugin(ScrollTrigger);

    if (!hasAOS) {
      gsap.utils.toArray(".reveal").forEach((el) => {
        gsap.from(el, {
          y: 22,
          opacity: 0,
          duration: 1.05,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 96%", once: true }
        });
      });
    }

    gsap.to(".hero-title", {
      yPercent: -12,
      ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 1 }
    });

    gsap.to(".bg-line", {
      yPercent: -10,
      ease: "none",
      scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1.4 }
    });

    gsap.to(".orb-a", {
      x: 120,
      y: -80,
      ease: "none",
      scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1.5 }
    });

    gsap.to(".orb-b", {
      x: -150,
      y: 120,
      ease: "none",
      scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1.5 }
    });


    const sections = gsap.utils.toArray("main section");
    const current = document.querySelector(".fixed-index .current");
    const total = document.querySelector(".fixed-index .total");
    if (total) total.textContent = String(sections.length).padStart(2, "0");

    sections.forEach((section, index) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActive(section.id, index),
        onEnterBack: () => setActive(section.id, index)
      });
    });

    function setActive(id, index) {
      if (current) current.textContent = String(index + 1).padStart(2, "0");
      document.querySelectorAll("nav a").forEach((a) => {
        a.classList.toggle("active", a.getAttribute("href") === `#${id}`);
      });
    }
  }

  function introMotion() {
    if (!hasGSAP || isReduced) return;
    gsap.from(".hero-title span", {
      yPercent: 112,
      duration: 1.15,
      stagger: 0.08,
      ease: "power4.out"
    });
    gsap.from("#header", { y: -80, opacity: 0, duration: 0.9, ease: "power4.out" });
    gsap.from(".scroll-cta", { scale: 0, opacity: 0, duration: 0.8, delay: 0.55, ease: "back.out(1.7)" });
  }

  const canUseCursor = cursor && cursorDot && window.matchMedia("(pointer:fine)").matches && !isReduced;
  if (canUseCursor) {
    window.addEventListener("mousemove", (e) => {
      if (hasGSAP) {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.35, ease: "power3.out" });
        gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0.06 });
      } else {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
      }
    });

    document.querySelectorAll("a, button, .magnetic").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.classList.add("is-link");
        if (hasGSAP) gsap.to(cursor, { scale: 1.45, duration: 0.3 });
      });
      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("is-link");
        if (hasGSAP) gsap.to(cursor, { scale: 1, duration: 0.3 });
      });
    });

    document.querySelectorAll(".website-card, .detail-card").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        cursor.classList.add("is-view");
        cursor.textContent = card.dataset.cursor || "View";
      });
      card.addEventListener("mouseleave", () => {
        cursor.classList.remove("is-view");
        cursor.textContent = "";
      });
    });
  }

  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      if (!hasGSAP || isReduced) return;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.18, y: y * 0.18, duration: 0.35, ease: "power3.out" });
    });
    btn.addEventListener("mouseleave", () => {
      if (!hasGSAP || isReduced) return;
      gsap.to(btn, { x: 0, y: 0, duration: 0.45, ease: "elastic.out(1, .55)" });
    });
  });

  let lastScroll = window.scrollY;
  const header = document.querySelector("#header");
  window.addEventListener("scroll", () => {
    if (!header || !hasGSAP || isReduced) return;
    const currentScroll = window.scrollY;
    const goingDown = currentScroll > lastScroll && currentScroll > 120;
    gsap.to(header, { y: goingDown ? -100 : 0, duration: 0.35, ease: "power3.out" });
    lastScroll = currentScroll;
  }, { passive: true });



  const modal = document.querySelector("#imageModal");
  const modalImage = document.querySelector("#modalImage");
  const modalTitle = document.querySelector("#modalTitle");
  const modalCloseEls = document.querySelectorAll("[data-modal-close]");

  function openModal(src, title) {
    if (!modal || !modalImage) return;
    modalImage.src = src;
    modalImage.alt = `${title || "Detail Page"} 확대 이미지`;
    if (modalTitle) modalTitle.textContent = title || "Detail Page";
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    if (lenis) lenis.stop();
  }

  function closeModal() {
    if (!modal || !modalImage) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    setTimeout(() => { modalImage.src = ""; }, 250);
    if (lenis) lenis.start();
  }

  document.querySelectorAll(".detail-modal-trigger").forEach((button) => {
    button.addEventListener("click", () => {
      const src = button.dataset.full;
      const title = button.dataset.title;
      if (!src) return;
      openModal(src, title);
    });
  });

  modalCloseEls.forEach((el) => el.addEventListener("click", closeModal));
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.classList.contains("is-open")) closeModal();
  });

  document.querySelectorAll(".filter-ui button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-ui button").forEach((b) => b.classList.remove("is-active"));
      button.classList.add("is-active");
    });
  });
});
