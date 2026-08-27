(function () {
  const waNumber = "527223822877";

  const loader = document.getElementById("loader");
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mob-menu");
  const marquee = document.getElementById("marquee");
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  window.addEventListener("load", () => {
    window.setTimeout(() => {
      loader?.classList.add("is-hidden");
    }, 520);
  });

  const syncNavbar = () => {
    if (!navbar) return;
    navbar.classList.toggle("scrolled", window.scrollY > 18);
  };

  syncNavbar();
  window.addEventListener("scroll", syncNavbar, { passive: true });

  hamburger?.addEventListener("click", () => {
    const isOpen = hamburger.classList.toggle("is-open");
    hamburger.setAttribute("aria-expanded", String(isOpen));
    mobileMenu?.classList.toggle("is-open", isOpen);
    navbar?.classList.toggle("menu-open", isOpen);
  });

  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger?.classList.remove("is-open");
      hamburger?.setAttribute("aria-expanded", "false");
      mobileMenu.classList.remove("is-open");
      navbar?.classList.remove("menu-open");
    });
  });

  if (marquee) {
    const items = [
      "Limpieza residencial",
      "Lavado de tinacos",
      "Lavado de cisternas",
      "Salas y tapicerías",
      "Auto a domicilio",
      "Oficinas y negocios",
      "Servicio garantizado",
      "Home Clean VIP Metepec"
    ];
    const track = [...items, ...items]
      .map((item) => `<span>${item}</span>`)
      .join("");
    marquee.innerHTML = track;
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  const formatClockValue = (value, suffix) => {
    if (!/am|pm/i.test(suffix)) return `${value}${suffix}`;
    const raw = String(value).padStart(3, "0");
    const hour = raw.length === 3 ? raw.slice(0, 1) : raw.slice(0, 2);
    const minutes = raw.slice(-2);
    return `${Number(hour)}:${minutes}${suffix}`;
  };

  const animateNumber = (el) => {
    const target = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || "";
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = formatClockValue(value, suffix);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".stat-num").forEach(animateNumber);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll(".stats-grid").forEach((el) => statObserver.observe(el));

  const form = document.getElementById("wa-form");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("f-name");
    const interest = document.getElementById("f-interest");
    const message = document.getElementById("f-msg");
    const required = [name, message];
    let valid = true;

    required.forEach((field) => {
      const empty = !field.value.trim();
      field.classList.toggle("is-invalid", empty);
      if (empty) valid = false;
    });

    if (!valid) return;

    const text = [
      "Hola, visité la página de Home Clean VIP Metepec y quiero solicitar una cotización.",
      `Nombre: ${name.value.trim()}`,
      `Servicio: ${interest.value}`,
      `Detalle: ${message.value.trim()}`
    ].join("\n");

    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    form.reset();
  });

  document.querySelectorAll(".form-control").forEach((field) => {
    field.addEventListener("input", () => field.classList.remove("is-invalid"));
  });

  const modal = document.getElementById("flyer-modal");
  const modalImg = document.getElementById("flyer-modal-img");
  const closeModal = modal?.querySelector(".flyer-close");

  const openFlyer = (button) => {
    const src = button.dataset.flyer;
    const img = button.querySelector("img");
    if (!src || !modal || !modalImg) return;

    modalImg.src = src;
    modalImg.alt = img?.alt || "Folleto Home Clean VIP Metepec ampliado";
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    closeModal?.focus();
  };

  const closeFlyer = () => {
    if (!modal || !modalImg) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    modalImg.src = "";
    modalImg.alt = "";
  };

  document.querySelectorAll(".flyer-card").forEach((button) => {
    button.addEventListener("click", () => openFlyer(button));
  });

  closeModal?.addEventListener("click", closeFlyer);
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) closeFlyer();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeFlyer();
  });

  const canvas = document.getElementById("hero-canvas");
  const ctx = canvas?.getContext("2d");
  const bubbles = [];
  const bubbleCount = 34;

  const resizeCanvas = () => {
    if (!canvas || !ctx) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(canvas.clientWidth * ratio);
    canvas.height = Math.floor(canvas.clientHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const resetBubble = (bubble, initial = false) => {
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    bubble.x = Math.random() * width;
    bubble.y = initial ? Math.random() * height : height + 30;
    bubble.r = 2 + Math.random() * 7;
    bubble.speed = 0.18 + Math.random() * 0.55;
    bubble.alpha = 0.16 + Math.random() * 0.34;
    bubble.drift = -0.25 + Math.random() * 0.5;
  };

  const initBubbles = () => {
    if (!canvas) return;
    bubbles.length = 0;
    for (let i = 0; i < bubbleCount; i += 1) {
      const bubble = {};
      resetBubble(bubble, true);
      bubbles.push(bubble);
    }
  };

  const drawBubbles = () => {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    bubbles.forEach((bubble) => {
      bubble.y -= bubble.speed;
      bubble.x += bubble.drift;
      if (bubble.y < -20) resetBubble(bubble);

      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(67, 200, 245, ${bubble.alpha})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(bubble.x - bubble.r * 0.25, bubble.y - bubble.r * 0.25, Math.max(1, bubble.r * 0.28), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${bubble.alpha * 0.7})`;
      ctx.fill();
    });

    requestAnimationFrame(drawBubbles);
  };

  if (canvas && ctx) {
    resizeCanvas();
    initBubbles();
    drawBubbles();
    window.addEventListener("resize", () => {
      resizeCanvas();
      initBubbles();
    }, { passive: true });
  }
})();
