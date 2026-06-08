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

// ── Galerie produit ──
const thumbs = document.querySelectorAll(".produit-thumb");
let mainImg = document.querySelector(".produit-main-img");

const mobileImages = {
  "images/03_obsession_img_1.webp": "images/03_obsession_img_1_tel.webp",
  "images/03_obsession_img_2.webp": "images/03_obsession_img_2_tel.webp",
  "images/03_obsession_img_3.webp": "images/03_obsession_img_3_tel.webp",
};

function isMobileBreakpoint() {
  return window.innerWidth <= 1023;
}

function isTabletBreakpoint() {
  return window.innerWidth >= 769 && window.innerWidth <= 1023;
}

thumbs.forEach((thumb) => {
  thumb.addEventListener("click", (e) => {
    thumbs.forEach((t) => t.classList.remove("active"));
    thumb.classList.add("active");
    const src = thumb.dataset.img;
    const newSrc =
      isMobileBreakpoint() && mobileImages[src] ? mobileImages[src] : src;

    const produitMain = document.querySelector(".produit-main");
    const galleryRect = produitMain.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();

    const startX = thumbRect.left + thumbRect.width / 2 - galleryRect.left;
    const startY = thumbRect.top + thumbRect.height / 2 - galleryRect.top;

    const finalW = mainImg.offsetWidth;
    const finalH = mainImg.offsetHeight;

    const preload = new Image();
    preload.src = newSrc;
    preload.onload = () => {
      const tempImg = document.createElement("img");
      tempImg.src = newSrc;
      tempImg.style.cssText = `
                position: absolute;
                left: ${startX}px;
                top: ${startY}px;
                width: 0px;
                height: 0px;
                object-fit: cover;
                object-position: top center;
                z-index: 10;
                pointer-events: none;
                transition: none;
            `;

      produitMain.style.position = "relative";
      produitMain.appendChild(tempImg);

      gsap.to(tempImg, {
        width: finalW,
        height: finalH,
        left: 0,
        top: 0,
        duration: 0.6,
        ease: "expo.out",
        onComplete: () => {
          // tempImg devient la nouvelle mainImg
          tempImg.style.position = "relative";
          tempImg.style.zIndex = "auto";
          tempImg.style.pointerEvents = "auto";
          tempImg.classList.add("produit-main-img");

          // Supprime l'ancienne mainImg
          mainImg.remove();

          // tempImg devient la nouvelle référence
          mainImg = tempImg;
        },
      });
    };
  });
});

// ── Mapping images collection ──
const colPhotoData = [
  {
    desktop: "images/01_innocence.webp",
    tablet: "images/01_innocence_tablette.webp",
    mobile: "images/01_innocence_tel.webp",
  },
  {
    desktop: "images/02_power.webp",
    tablet: "images/02_power_tablette.webp",
    mobile: "images/02_power_tel.webp",
  },
];

const colPhotos = document.querySelectorAll(".col-item .col-photo");

function updateColPhotos() {
  const useMobile = window.innerWidth <= 768;
  const useTablet = isTabletBreakpoint();
  colPhotos.forEach((photo, i) => {
    if (!colPhotoData[i]) return;
    let target;
    if (useMobile) target = colPhotoData[i].mobile;
    else if (useTablet) target = colPhotoData[i].tablet;
    else target = colPhotoData[i].desktop;
    if (!photo.src.includes(target)) {
      photo.src = target;
    }
  });
}

window.addEventListener("load", () => {
  if (isMobileBreakpoint()) mainImg.src = "images/03_obsession_img_1_tel.webp";
  updateColPhotos();
});

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    updateColPhotos();
    ScrollTrigger.refresh();
    initActBorders();
  }, 100);
});

// ── Composition ──
const compoItems = document.querySelectorAll(".compo-item");
const compoImg = document.querySelector(".compo-img");
const compoImgLabel = document.querySelector(".compo-img-label-title");

const compoImages = [
  "images/composition_natural_wax.webp",
  "images/composition_pigment_bordeaux.webp",
  "images/composition_emollients.webp",
  "images/composition_vitamine_e.webp",
];

const compoTitles = [
  "1. Cire Naturelle",
  "2. Pigments",
  "3. Emollients",
  "4. Vitamine E",
];

compoItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    compoItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
    compoImg.src = compoImages[index];
    compoImgLabel.textContent = compoTitles[index];
  });
});

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
];

const colCardBtn = document.querySelector(".col-card-btn");
const urls = ["01_innocence.html", "02_power.html"];
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

function onScrollUpdate() {
  const currentScrollY = window.scrollY;
  const isMobile = isMobileBreakpoint();

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

  items.forEach((item, index) => {
    const rect = item.getBoundingClientRect();
    const threshold = isMobile ? window.innerHeight * 0.5 : 0;
    if (rect.top <= threshold && rect.bottom >= 0) update(index);
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

// ── Bloquer scroll horizontal mobile ──
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

// ── Try the shade ──
const tryFrame = document.querySelector(".try-shade-frame");
const tryCanvas = document.getElementById("tryShadeCanvas");
const tryCursor = document.getElementById("tryShadeCursor");
const tryHint =
  document.getElementById("tryShadeHint") ||
  document.querySelector(".try-shade-hint");

if (tryFrame && tryCanvas) {
  const ctx = tryCanvas.getContext("2d");
  let isDrawing = false;
  let hasDrawn = false;
  let lastPx = null;
  let lastPy = null;

  const points = [];
  const POINT_LIFETIME = 500;
  const FADE_DURATION = 1500;
  const POINT_SPACING = 5;

  function resizeCanvas() {
    tryCanvas.width = tryFrame.offsetWidth;
    tryCanvas.height = tryFrame.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  if (tryHint) {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    tryHint.textContent = isMobile
      ? "Dessinez sur l'écran pour tester la teinte."
      : "Déplacez votre souris sur l'écran pour tester la teinte.";
  }

  function makePoint(x, y) {
    return { x, y, t: performance.now(), gap: false };
  }

  function easeOut(t) {
    return 1 - Math.pow(t, 2);
  }

  function getAlpha(pt, now) {
    const age = now - pt.t;
    if (age <= POINT_LIFETIME) return 1;
    const prog = Math.min(1, (age - POINT_LIFETIME) / FADE_DURATION);
    return easeOut(prog);
  }

  let lastMouseX = null;
  let lastMouseY = null;

  window.addEventListener("mousemove", (e) => {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  window.addEventListener(
    "scroll",
    () => {
      if (lastMouseX === null) return;
      const rect = tryFrame.getBoundingClientRect();
      const inside =
        lastMouseX >= rect.left &&
        lastMouseX <= rect.right &&
        lastMouseY >= rect.top &&
        lastMouseY <= rect.bottom;
      if (!inside) {
        tryCursor.style.display = "none";
        tryFrame.style.cursor = "default";
        isDrawing = false;
        lastPx = null;
        lastPy = null;
      }
    },
    { passive: true },
  );

  function redraw(now) {
    ctx.clearRect(0, 0, tryCanvas.width, tryCanvas.height);

    while (
      points.length > 0 &&
      !points[0].gap &&
      now - points[0].t > POINT_LIFETIME + FADE_DURATION
    ) {
      points.shift();
    }
    while (points.length > 0 && points[0].gap) {
      const hasValidAfter = points
        .slice(1)
        .some((p) => !p.gap && now - p.t <= POINT_LIFETIME + FADE_DURATION);
      if (!hasValidAfter) points.shift();
      else break;
    }

    const segments = [];
    let current = [];
    for (let i = 0; i < points.length; i++) {
      if (points[i].gap) {
        if (current.length >= 2) segments.push(current);
        current = [];
      } else {
        current.push(points[i]);
      }
    }
    if (current.length >= 2) segments.push(current);

    // globalAlpha fixe à 1 — l'alpha est encodé dans rgba()
    // pour éviter toute accumulation aux jonctions
    ctx.globalAlpha = 1;
    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    segments.forEach((seg) => {
      if (seg.length < 2) return;

      let prevAlpha = getAlpha(seg[0], now);

      for (let i = 1; i < seg.length; i++) {
        const p0 = seg[i - 1];
        const p1 = seg[i];

        const a0 = getAlpha(p0, now);
        const a1 = getAlpha(p1, now);

        // Alpha moyen du segment — encodé dans rgba, pas dans globalAlpha
        const a = (a0 + a1) / 2;
        if (a <= 0.005) continue;

        // Segment isolé avec lineCap butt pour éviter les chevauchements
        // On utilise butt uniquement ici pour supprimer les demi-cercles
        // qui se superposent entre segments adjacents
        ctx.beginPath();
        ctx.lineCap = i === 1 ? "round" : "butt";
        ctx.strokeStyle = `rgba(86,33,41,${a.toFixed(4)})`;
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();

        prevAlpha = a1;
      }

      // Dernier cap arrondi sur le point final
      const last = seg[seg.length - 1];
      const aLast = getAlpha(last, now);
      if (aLast > 0.005) {
        ctx.beginPath();
        ctx.lineCap = "round";
        ctx.strokeStyle = `rgba(86,33,41,${aLast.toFixed(4)})`;
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(last.x, last.y);
        ctx.stroke();
      }
    });

    requestAnimationFrame(redraw);
    // Réafficher le hint si plus aucun point visible
    if (hasDrawn && points.filter((p) => !p.gap).length === 0) {
      if (tryHint) tryHint.classList.remove("hidden");
      hasDrawn = false;
    }
  }
  requestAnimationFrame(redraw);

  tryFrame.addEventListener("mouseenter", () => {
    tryCursor.style.display = "block";
    tryFrame.style.cursor = "none";
    isDrawing = true;
    lastPx = null;
    lastPy = null;
  });

  tryFrame.addEventListener("mouseleave", () => {
    tryCursor.style.display = "none";
    tryFrame.style.cursor = "default";
    isDrawing = false;
    lastPx = null;
    lastPy = null;
    points.push({ x: null, y: null, t: performance.now(), gap: true });
  });

  tryFrame.addEventListener("mousemove", (e) => {
    const rect = tryFrame.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top + 5;

    tryCursor.style.left = e.clientX + "px";
    tryCursor.style.top = e.clientY + "px";

    if (!hasDrawn) {
      hasDrawn = true;
      if (tryHint) tryHint.classList.add("hidden");
    }

    if (isDrawing) {
      if (lastPx === null) {
        points.push(makePoint(x, y));
        lastPx = x;
        lastPy = y;
      } else {
        const dx = x - lastPx;
        const dy = y - lastPy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist >= POINT_SPACING) {
          const steps = Math.floor(dist / POINT_SPACING);
          for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            points.push(makePoint(lastPx + dx * t, lastPy + dy * t));
          }
          lastPx = lastPx + dx * ((steps * POINT_SPACING) / dist);
          lastPy = lastPy + dy * ((steps * POINT_SPACING) / dist);
        }
      }
    } else {
      lastPx = null;
      lastPy = null;
    }
  });

  tryFrame.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      if (!hasDrawn) {
        hasDrawn = true;
        if (tryHint) tryHint.classList.add("hidden");
      }
      lastPx = null;
      lastPy = null;
      points.push({ x: null, y: null, t: performance.now(), gap: true });

      // Afficher le curseur rouge à lèvre sur touch
      const touch = e.touches[0];
      tryCursor.style.display = "block";
      tryCursor.style.left = touch.clientX + "px";
      tryCursor.style.top = touch.clientY + "px";
    },
    { passive: false },
  );

  tryFrame.addEventListener(
    "touchmove",
    (e) => {
      e.preventDefault();
      const rect = tryFrame.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      // Suivre le curseur
      tryCursor.style.left = touch.clientX + "px";
      tryCursor.style.top = touch.clientY + "px";

      if (lastPx === null) {
        points.push(makePoint(x, y));
        lastPx = x;
        lastPy = y;
      } else {
        const dx = x - lastPx;
        const dy = y - lastPy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist >= POINT_SPACING) {
          const steps = Math.floor(dist / POINT_SPACING);
          for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            points.push(makePoint(lastPx + dx * t, lastPy + dy * t));
          }
          lastPx = lastPx + dx * ((steps * POINT_SPACING) / dist);
          lastPy = lastPy + dy * ((steps * POINT_SPACING) / dist);
        }
      }
    },
    { passive: false },
  );

  tryFrame.addEventListener("touchend", () => {
    lastPx = null;
    lastPy = null;
    points.push({ x: null, y: null, t: performance.now(), gap: true });
    tryCursor.style.display = "none";
  });
}

// ── Three Acts : border draw + fade ──
function initActBorders() {
  gsap.utils.toArray(".act-item").forEach((card, i) => {
    const svgRect = card.querySelector(".act-border rect");
    const img = card.querySelector("img");
    const text = card.querySelector(".act-text");

    ScrollTrigger.getAll()
      .filter((st) => st.vars.trigger === card)
      .forEach((st) => st.kill());

    const w = card.getBoundingClientRect().width;
    const h = card.getBoundingClientRect().height;
    const perimeter = (w + h) * 2;

    svgRect.style.strokeDasharray = perimeter;
    svgRect.style.strokeDashoffset = perimeter;
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
      { opacity: 1, duration: 0.5, ease: "power2.out", stagger: 0.1 },
      "-=0.1",
    );
  });
}

window.addEventListener("load", initActBorders);

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
