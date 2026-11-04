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
  const modalPanel = modal?.querySelector(".image-modal__panel");
  const modalImage = document.querySelector("#modalImage");
  const modalGallery = document.querySelector("#modalGallery");
  const modalScroll = document.querySelector("#modalScroll");
  const modalTitle = document.querySelector("#modalTitle");
  const modalCategory = document.querySelector("#modalCategory");
  const modalDescription = document.querySelector("#modalDescription");
  const modalType = document.querySelector("#modalType");
  const modalNumber = document.querySelector("#modalNumber");
  const modalScope = document.querySelector("#modalScope");
  const projectInfo = {
    "images/detail/nfuture_detail.png": {name:"NFUTURE", number:"01", description:"제품의 주요 특징과 사용 정보를 명확하게 전달하도록 구성한 커머스 상세페이지 디자인입니다."},
    "images/detail/WSB_detail.png": {name:"WSBKOREA", number:"02", description:"제품 이미지를 중심으로 전달력을 강화한 커머스 상세페이지 디자인입니다."},
    "images/detail/electricboy_detail.png": {name:"ELECTRICBOY", number:"03", description:"시각적 주목도와 제품 정보의 흐름을 고려해 구성한 커머스 상세페이지 디자인입니다."}
  };
  let previousFocus = null;
  let clearImageTimer = null;

  function openModal(src, title, cardImages) {
    if (!modal || !modalImage || !modalGallery) return;
    clearTimeout(clearImageTimer);
    previousFocus = document.activeElement;
    const info = projectInfo[src];
    if (modalTitle) modalTitle.textContent = cardImages ? "JINA SKIN LAB" : (info?.name || title || "DETAIL PAGE");
    if (modalCategory) modalCategory.textContent = cardImages ? "EDITORIAL / CARD NEWS" : "COMMERCE / DETAIL PAGE";
    if (modalNumber) modalNumber.textContent = cardImages ? "01 / 01" : `${info?.number || "01"} / 03`;
    if (modalDescription) modalDescription.textContent = cardImages
      ? "브랜드의 메시지를 이미지와 타이포그래피로 구성한 카드뉴스 작업입니다."
      : (info?.description || "제품의 정보를 효과적으로 전달하기 위한 상세페이지 디자인입니다.");
    if (modalType) modalType.textContent = cardImages ? "CARD NEWS" : "DETAIL PAGE";
    if (modalScope) modalScope.textContent = cardImages ? "EDITORIAL DESIGN" : "COMMERCE DESIGN";
    modalGallery.classList.toggle("is-cardnews", Boolean(cardImages));
    modalGallery.replaceChildren();
    const sources = cardImages || [src];
    sources.forEach((source, index) => {
      const image = document.createElement("img");
      image.src = source;
      image.alt = `${title || "작업물"} 전체 원본 ${index + 1}`;
      image.decoding = "async";
      modalGallery.appendChild(image);
    });
    if (modalScroll) modalScroll.scrollTop = 0;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    if (lenis) lenis.stop();
    modalPanel?.focus({preventScroll:true});
  }

  function closeModal() {
    if (!modal?.classList.contains("is-open")) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (lenis) lenis.start();
    clearImageTimer = setTimeout(() => { modalGallery?.replaceChildren(); }, 380);
    if (previousFocus?.isConnected) previousFocus.focus({preventScroll:true});
  }

  document.querySelectorAll(".detail-modal-trigger").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.full) openModal(button.dataset.full, button.dataset.title);
    });
  });
  document.querySelector("[data-cardnews-open]")?.addEventListener("click", () => {
    openModal(null, "JINA SKIN LAB", ["images/card-news/sample_cover.png", "images/card-news/sample_review.png"]);
  });
  modal?.querySelectorAll("[data-modal-close]").forEach((el) => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", (event) => {
    if (!modal?.classList.contains("is-open")) return;
    if (event.key === "Escape") closeModal();
    if (event.key === "Tab") {
      // Keep keyboard focus inside the drawer.
      const closeButton = modal.querySelector(".image-modal__close");
      if (event.shiftKey && document.activeElement === modalPanel) {
        event.preventDefault(); closeButton?.focus();
      } else if (!event.shiftKey && document.activeElement === closeButton) {
        event.preventDefault(); modalPanel?.focus();
      }
    }
  });

  document.querySelectorAll(".filter-ui button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-ui button").forEach((b) => b.classList.remove("is-active"));
      button.classList.add("is-active");
    });
  });
});
