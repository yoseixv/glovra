// ── Nav + Footer : animation hover entrée uniquement ──
document.querySelectorAll("nav a, .footer-col a").forEach((link) => {
  link.addEventListener("mouseenter", () => {
    link.classList.add("is-hovering");
  });
  link.addEventListener("mouseleave", () => {
    link.classList.remove("is-hovering");
  });
});

gsap.registerPlugin(ScrollTrigger);

// ── Parallax images marque ──
document.querySelectorAll(".parallax-wrap").forEach((wrap, i) => {
  const img = wrap.querySelector("img");
  const isMobile = window.innerWidth <= 768;
  const speeds = isMobile ? [20, 30, 20] : [60, 80, 60];

  gsap.fromTo(
    img,
    { scale: 1.5, y: speeds[i] },
    {
      scale: 1.5,
      y: -speeds[i],
      ease: "none",
      scrollTrigger: {
        trigger: wrap,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.4,
      },
    },
  );
});

// ── Header hide/show ──
const header = document.querySelector("header");
let lastScrollY = window.scrollY;

function onScrollUpdate() {
  const currentScrollY = window.scrollY;
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    if (currentScrollY < lastScrollY) {
      header.classList.remove("header-hidden");
    } else if (currentScrollY > 80) {
      header.classList.add("header-hidden");
    }
  } else {
    if (currentScrollY > 80) {
      header.classList.add("header-hidden");
    } else {
      header.classList.remove("header-hidden");
    }
  }

  lastScrollY = currentScrollY;
}

window.addEventListener("scroll", onScrollUpdate, { passive: true });
onScrollUpdate();

// ── Réapparition du header au survol haut de page (desktop) ──
document.addEventListener("mousemove", (e) => {
  if (window.innerWidth > 768) {
    if (e.clientY < 100) {
      header.classList.remove("header-hidden");
    } else if (window.scrollY > 80) {
      header.classList.add("header-hidden");
    }
  }
});

// ── Bloquer le scroll horizontal sur mobile ──
if (window.innerWidth <= 768) {
  let startX = 0;
  let startY = 0;

  document.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    },
    { passive: true },
  );

  document.addEventListener(
    "touchmove",
    (e) => {
      const deltaX = Math.abs(e.touches[0].clientX - startX);
      const deltaY = Math.abs(e.touches[0].clientY - startY);
      if (deltaX > deltaY) e.preventDefault();
    },
    { passive: false },
  );
}

// ── Burger menu ──
const burger = document.querySelector(".burger");
const navMobile = document.querySelector(".nav-mobile");
const headerLine = document.querySelector(".header-line");

burger.addEventListener("click", () => {
  const isOpen = burger.classList.toggle("is-open");
  navMobile.classList.toggle("is-open");
  burger.setAttribute("aria-expanded", isOpen);
  document.body.style.overflow = isOpen ? "hidden" : "";
  headerLine.style.opacity = isOpen ? "0" : "1";
});

navMobile.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    burger.classList.remove("is-open");
    navMobile.classList.remove("is-open");
    burger.setAttribute("aria-expanded", false);
    document.body.style.overflow = "";
    headerLine.style.opacity = "1";
  });
});
