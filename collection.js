// ── Nav + Footer : animation hover entrée uniquement ──
document.querySelectorAll("nav a, .footer-col a").forEach((link) => {
  link.addEventListener("mouseenter", () => {
    link.classList.add("is-hovering");
  });
  link.addEventListener("mouseleave", () => {
    link.classList.remove("is-hovering");
  });
});

// ── Parallax storytelling GSAP ──
const speeds = window.innerWidth <= 1023 ? [45, 65, 45] : [100, 160, 100];

document.querySelectorAll(".story-img-wrap").forEach((wrap, i) => {
  const img = wrap.querySelector("img");

  gsap.fromTo(
    img,
    { y: 0 },
    {
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

gsap.registerPlugin(ScrollTrigger);

const items = document.querySelectorAll(".col-item");
const data = [
  {
    number: "01 innocence",
    quote: '" she whispers "',
    cardTop: "#D68E89",
    gradLeft: "#B27E7A",
    gradRight: "#D68E89",
    lipstick: "images/rouge_a_levre_01.webp",
  },
  {
    number: "02 power",
    quote: '" she takes "',
    cardTop: "#C4010A",
    gradLeft: "#9E020D",
    gradRight: "#C4010A",
    lipstick: "images/rouge_a_levre_02.webp",
  },
  {
    number: "03 obsession",
    quote: '" she owns "',
    cardTop: "#562129",
    gradLeft: "#4C1920",
    gradRight: "#562129",
    lipstick: "images/rouge_a_levre_03.webp",
  },
];

const colCardBtn = document.querySelector(".col-card-btn");

const urls = ["01_innocence.html", "02_power.html", "03_obsession.html"];

const jsQuote = document.querySelector(".js-quote");
const jsCardTop = document.querySelector(".js-card-top");
const jsCardTitle = document.querySelector(".js-card-title");
const jsCardImg = document.querySelector(".js-card-img");
const jsLipstick = document.querySelector(".js-lipstick");
const colSticky = document.querySelector(".col-sticky");
const colCard = document.querySelector(".col-card");
const header = document.querySelector("header");
const headerHeight = header.offsetHeight;

let current = -1;
let lastScrollY = window.scrollY;

function update(index) {
  if (index === current) return;
  current = index;
  const d = data[index];
  jsQuote.textContent = d.quote;
  jsCardTitle.textContent = d.number;
  jsCardTop.style.background = d.cardTop;
  jsCardImg.style.background = `linear-gradient(to left, ${d.gradLeft}, ${d.gradRight})`;
  jsLipstick.src = d.lipstick;
  colCardBtn.href = urls[index];
}

// ── Scroll global ──
function onScrollUpdate() {
  const currentScrollY = window.scrollY;
  const isMobile = window.innerWidth <= 768;

  // Header
  if (isMobile) {
    if (currentScrollY < lastScrollY) {
      header.classList.remove("header-hidden");
    } else if (currentScrollY > 80) {
      header.classList.add("header-hidden");
    }
  } else {
    if (currentScrollY > 80) {
      header.classList.add("header-hidden");
      header.classList.add("header-scrolled");
      colSticky.style.top = "40px";
    } else {
      header.classList.remove("header-hidden");
      header.classList.remove("header-scrolled");
      colSticky.style.top = headerHeight + 16 + "px";
    }
  }

  lastScrollY = currentScrollY;

  // Collection : changement de teinte
  items.forEach((item, index) => {
    const rect = item.getBoundingClientRect();
    const threshold = isMobile ? window.innerHeight * 0.5 : 0;
    if (rect.top <= threshold && rect.bottom >= 0) {
      update(index);
    }
  });

  // Collection : disparition du sticky
  const lastPhoto = items[items.length - 1];
  const lastPhotoRect = lastPhoto.getBoundingClientRect();
  const colCardRect = colCard.getBoundingClientRect();

  if (lastPhotoRect.bottom <= colCardRect.bottom) {
    colSticky.style.opacity = "0";
    colSticky.style.pointerEvents = "none";
  } else {
    colSticky.style.opacity = "1";
    colSticky.style.pointerEvents = "auto";
  }
}

window.addEventListener("scroll", onScrollUpdate, { passive: true });
onScrollUpdate();

// Header desktop : réapparition à la souris
document.addEventListener("mousemove", (e) => {
  if (window.innerWidth > 768) {
    if (e.clientY < 100) {
      header.classList.remove("header-hidden");
      if (window.scrollY > 80) header.classList.add("header-scrolled");
      colSticky.style.top = headerHeight + 16 + "px";
    } else if (window.scrollY > 80) {
      header.classList.add("header-hidden");
      colSticky.style.top = "40px";
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
      if (deltaX > deltaY) {
        e.preventDefault();
      }
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

update(0);
