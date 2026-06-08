// ── Intro : une seule fois par session ──
const navEntry = performance.getEntriesByType("navigation")[0];
const isReload = navEntry?.type === "reload";
const hasSeenIntro = sessionStorage.getItem("introSeen") && !isReload;

if (hasSeenIntro) {
  document.querySelector(".intro").style.display = "none";
  gsap.set(".hero-content", { opacity: 1 });
  gsap.set(".hero-img", { scale: 1 });
} else {
  sessionStorage.setItem("introSeen", "true");

  const duration = 2.2;
  const time = 1.8;

  gsap.set(".hero-content", { opacity: 0 });
  gsap.set(".hero-img", { scale: 2 });

  const tl_intro = gsap
    .timeline({
      defaults: { duration: duration, ease: "expo.inOut" },
    })
    .from(".intro__img__hold", {
      duration: time,
      clipPath: "inset(50%)",
      ease: "expo.out",
      stagger: 0.2,
    })
    .to(".intro__hold", { yPercent: -150 })
    .to(".intro__fader", { opacity: 0 }, "<")
    .to(".hero-img", { duration: time, scale: 1, ease: "expo.inOut" }, "<")
    .to(".intro", { display: "none" }, ">");

  const tl_hero = gsap
    .timeline({
      defaults: { duration: duration, ease: "expo.out" },
    })
    .to(".hero-content", { opacity: 1, duration: 0.6 })
    .from(".hero-title-svg", { yPercent: 105, duration: 1.0 }, "<")
    .from(".hero-sub", { opacity: 0, y: "3vh", duration: 0.6 }, "<15%")
    .from(".hero-btn", { opacity: 0, y: "3vh", duration: 0.6 }, "<15%")
    .from(".header__inner > *", { opacity: 0, y: "-3vh", stagger: 0.08 }, "<");

  gsap.timeline().add(tl_intro).add(tl_hero, "-=1.2");
}

gsap.registerPlugin(ScrollTrigger);

// ── Nav + Footer : animation hover entrée uniquement ──
document.querySelectorAll("nav a, .footer-col a").forEach((link) => {
  link.addEventListener("mouseenter", () => {
    link.classList.add("is-hovering");
  });
  link.addEventListener("mouseleave", () => {
    link.classList.remove("is-hovering");
  });
});

// ── Parallax storytelling ──
document.querySelectorAll(".story-img-wrap").forEach((wrap, i) => {
  const img = wrap.querySelector("img");
  const isMobile = window.innerWidth <= 768;
  const speeds = isMobile ? [35, 50, 35] : [80, 120, 80];

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

// ── Storytelling : citation animation ──
const quoteBlock = document.querySelector(".story-quote-block");
const quoteLines = quoteBlock.querySelectorAll(".story-line");
const quoteText = quoteBlock.querySelector(".story-text");

// État initial
gsap.set(quoteLines, { scaleX: 0, transformOrigin: "left" });
gsap.set(quoteText, { opacity: 0, y: 20 });

const quoteTl = gsap.timeline({
  scrollTrigger: {
    trigger: quoteBlock,
    start: "top 80%",
    toggleActions: "play none none reset",
  },
});

quoteTl
  // 1. Les deux lignes s'étendent depuis le centre
  .to(quoteLines, {
    scaleX: 1,
    duration: 0.8,
    ease: "power2.inOut",
    stagger: 0.1,
  })
  // 2. Le texte apparaît en fondu
  .to(
    quoteText,
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
    },
    "-=0.2",
  );

// ── Collection ──
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

// ── Three Acts : border draw + fade ──
function initActBorders() {
  gsap.utils.toArray(".act-item").forEach((card, i) => {
    const svgRect = card.querySelector(".act-border rect");
    const img = card.querySelector("img");
    const text = card.querySelector(".act-text");

    // Tue l'ancien ScrollTrigger s'il existe
    ScrollTrigger.getAll()
      .filter((st) => st.vars.trigger === card)
      .forEach((st) => st.kill());

    // Recalcule les dimensions réelles
    const w = card.getBoundingClientRect().width;
    const h = card.getBoundingClientRect().height;
    const perimeter = (w + h) * 2;

    svgRect.style.strokeDasharray = perimeter;
    svgRect.style.strokeDashoffset = perimeter;

    // Reset l'opacité
    gsap.set([img, text], { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        toggleActions: "play none none reset",
      },
      delay: i * 0.2,
    });

    tl.to(svgRect, {
      strokeDashoffset: 0,
      duration: 1.2,
      ease: "power2.inOut",
    }).to(
      [img, text],
      {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1,
      },
      "-=0.1",
    );
  });
}

// Lance après chargement complet
window.addEventListener("load", initActBorders);

// Relance si la fenêtre change de taille
window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
  initActBorders();
});

// ── Scroll global ──
function onScrollUpdate() {
  const currentScrollY = window.scrollY;
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    if (currentScrollY < lastScrollY) {
      header.classList.remove("header-hidden");
      header.classList.add("header-scrolled");
    } else if (currentScrollY > 80) {
      header.classList.add("header-hidden");
    }
    if (currentScrollY <= 80) {
      header.classList.remove("header-scrolled");
    }
  } else {
    if (currentScrollY > 80) {
      header.classList.add("header-hidden");
      colSticky.style.top = "40px";
    } else {
      header.classList.remove("header-hidden");
      header.classList.remove("header-scrolled");
    }
  }

  lastScrollY = currentScrollY;

  items.forEach((item, index) => {
    const rect = item.getBoundingClientRect();
    const threshold = isMobile ? window.innerHeight * 0.5 : 0;
    if (rect.top <= threshold && rect.bottom >= 0) {
      update(index);
    }
  });

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

// ── Header desktop : réapparition à la souris ──
document.addEventListener("mousemove", (e) => {
  if (window.innerWidth > 768) {
    if (e.clientY < 100) {
      header.classList.remove("header-hidden");
      if (window.scrollY > 80) {
        header.classList.add("header-scrolled");
      }
      colSticky.style.top = headerHeight + 16 + "px";
    } else if (window.scrollY > 80) {
      header.classList.add("header-hidden");
      colSticky.style.top = "40px";
    }
  }
});

// ── Marque : effet souris + parallax scroll ──
const marquePhotos = document.querySelectorAll(".marque-photo");

document.querySelector(".marque").addEventListener("mousemove", (e) => {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;

  marquePhotos.forEach((photo, i) => {
    const depth = ((i % 3) + 1) * 6;
    photo.style.transform = `translate(${dx * depth}px, ${dy * depth}px)`;
  });
});

document.querySelector(".marque").addEventListener("mouseleave", () => {
  marquePhotos.forEach((photo) => {
    photo.style.transform = "translate(0, 0)";
  });
});

// ── Marque : parallax scroll ──
marquePhotos.forEach((photo, i) => {
  const depth = (i % 3) + 1;
  const speed = depth * 12;

  gsap.fromTo(
    photo,
    { y: speed },
    {
      y: -speed,
      ease: "none",
      scrollTrigger: {
        trigger: ".marque",
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
      },
    },
  );
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

update(0);
