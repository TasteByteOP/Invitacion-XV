// ========= CONFIGURACIÓN Y UTILIDADES =========
const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function safeQuery(selector) {
  return document.querySelector(selector);
}

function safeQueryAll(selector) {
  return Array.from(document.querySelectorAll(selector));
}

function safeGetById(id) {
  return document.getElementById(id);
}

function isFunction(fn) {
  return typeof fn === "function";
}

// ========= ANIMACIONES DE SECCIONES =========
const secciones = safeQueryAll(".section");
if (secciones.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.2 });

  secciones.forEach(sec => observer.observe(sec));
}

// ========= SUBIR ARRIBA =========
const btnTop = safeGetById("btn-top");
if (btnTop) {
  const onScroll = () => {
    if (window.scrollY > 200) {
      btnTop.classList.add("visible");
    } else {
      btnTop.classList.remove("visible");
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });

  btnTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    btnTop.blur();
  });

  btnTop.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      btnTop.click();
    }
  });
}

// ========= MÚSICA =========
const musica = safeGetById("musica");
const btnMusica = safeGetById("btn-musica");
const aviso = safeGetById("aviso-musica");

if (btnMusica) {
  btnMusica.setAttribute("role", "button");
  btnMusica.setAttribute("aria-pressed", "false");
}

if (musica) {
  musica.volume = 0.2;
  // Intentar autoplay pero manejar rechazo
  window.addEventListener("load", () => {
    if (prefersReducedMotion) {
      // Si el usuario prefiere menos movimiento, no reproducir automáticamente
      if (btnMusica) btnMusica.querySelector(".material-symbols-outlined").textContent = "volume_off";
      return;
    }
    musica.play().then(() => {
      if (btnMusica) btnMusica.querySelector(".material-symbols-outlined").textContent = "volume_up";
    }).catch(() => {
      if (btnMusica) btnMusica.querySelector(".material-symbols-outlined").textContent = "volume_off";
    });
  });
}

if (btnMusica && musica) {
  btnMusica.addEventListener("click", () => {
    if (musica.paused) {
      musica.play().catch(() => {});
      btnMusica.querySelector(".material-symbols-outlined").textContent = "volume_up";
      btnMusica.setAttribute("aria-pressed", "true");
    } else {
      musica.pause();
      btnMusica.querySelector(".material-symbols-outlined").textContent = "volume_off";
      btnMusica.setAttribute("aria-pressed", "false");
    }

    if (aviso) {
      aviso.style.opacity = "0";
      setTimeout(() => {
        aviso.style.display = "none";
      }, 600);
    }
    btnMusica.blur();
  });
}

// Reemplaza el bloque existente por este: obliga a poner nombre antes de abrir WhatsApp
const btnConfirmar = safeGetById("btn-confirmar");
if (btnConfirmar) {
  btnConfirmar.addEventListener("click", () => {
    const nombreEl = safeGetById("nombre");
    const personasEl = safeGetById("personas");

    const nombre = nombreEl ? nombreEl.value.trim() : "";
    // Validación: nombre obligatorio
    if (!nombre) {
      if (nombreEl) {
        // marcar visualmente el campo y enfocar
        nombreEl.classList.add("input-error");
        nombreEl.focus();
        // limpiar la marca cuando el usuario escriba
        const onInput = () => {
          nombreEl.classList.remove("input-error");
          nombreEl.removeEventListener("input", onInput);
        };
        nombreEl.addEventListener("input", onInput);
      } else {
        // fallback si no existe el input
        alert("Por favor escribe tu nombre antes de confirmar.");
      }
      return; // no continuar hasta que haya nombre
    }

    const personas = (personasEl && personasEl.value) ? personasEl.value : 1;

    const mensaje = `Hola, soy ${nombre} y confirmo mi asistencia a los XV con ${personas} persona(s). 🎉`;
    const url = `https://wa.me/527226163280?text=${encodeURIComponent(mensaje)}`;

    // lanzar confetti si existe la función
    if (typeof lanzarConfetti === "function") {
      try { lanzarConfetti(); } catch (e) { /* no bloquear si falla */ }
    }

    window.open(url, "_blank");
    btnConfirmar.blur();
  });
}

// ========= CONFETTI =========
function lanzarConfetti() {
  if (!isFunction(window.confetti)) return;
  if (prefersReducedMotion) return;
  confetti({
    particleCount: 120,
    spread: 90,
    origin: { y: 0.7 }
  });
}

// Ejecutar confetti de bienvenida con precauciones
window.addEventListener("load", () => {
  if (!isFunction(window.confetti) || prefersReducedMotion) return;
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.6 }
  });
});

// ========= CONTADOR =========
const fechaEvento = new Date("2026-03-07T15:00:00");

const d = safeGetById("dias");
const h = safeGetById("horas");
const m = safeGetById("minutos");
const s = safeGetById("segundos");

function actualizarContador() {
  if (!d || !h || !m || !s) return;
  const ahora = new Date();
  const diff = fechaEvento - ahora;

  if (diff <= 0) {
    d.textContent = h.textContent = m.textContent = s.textContent = 0;
    return;
  }

  d.textContent = Math.floor(diff / (1000 * 60 * 60 * 24));
  h.textContent = Math.floor((diff / (1000 * 60 * 60)) % 24);
  m.textContent = Math.floor((diff / (1000 * 60)) % 60);
  s.textContent = Math.floor((diff / 1000) % 60);
}

if (d && h && m && s) {
  actualizarContador();
  setInterval(actualizarContador, 1000);
}

// ===== LUCIÉRNAGAS =====
const TOTAL_LUCIERNAGAS = 75;
const contenedor = safeGetById("luciernagas");

if (contenedor && !prefersReducedMotion) {
  const maxForSmall = window.innerWidth < 800 ? 30 : TOTAL_LUCIERNAGAS;
  const total = Math.min(TOTAL_LUCIERNAGAS, maxForSmall);

  for (let i = 0; i < total; i++) {
    const luz = document.createElement("div");
    luz.classList.add("luciernaga");

    const size = Math.random() * 30 + 4;
    luz.style.width = size + "px";
    luz.style.height = size + "px";

    luz.style.left = Math.random() * 100 + "vw";
    luz.style.top = Math.random() * 100 + "vh";

    const duracion = Math.random() * 20 + 20;
    luz.style.animationDuration = `${duracion}s, ${Math.random() * 4 + 3}s`;

    contenedor.appendChild(luz);
  }
}

// ===== MURAL =====
const inputUpload = safeGetById("upload");
const estado = safeGetById("estado-subida");
const muralPreview = safeGetById("mural-preview");

const CLOUD_NAME = "dxrnsitv5";
const UPLOAD_PRESET = "mural_xv";

if (inputUpload) {
  inputUpload.addEventListener("change", async () => {
    const file = inputUpload.files[0];
    if (!file) return;

    // Validaciones básicas
    const maxSizeMB = 5;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      if (estado) estado.textContent = "Formato no soportado. Usa JPG PNG o WEBP.";
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      if (estado) estado.textContent = `Archivo demasiado grande. Máx ${maxSizeMB} MB.`;
      return;
    }

    if (estado) estado.textContent = "Subiendo imagen... ⏳";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (data && data.secure_url) {
        if (estado) estado.textContent = "Imagen subida correctamente ✅";
        const img = document.createElement("img");
        img.src = data.secure_url;
        img.alt = "Foto subida al mural";
        img.style.maxWidth = "100%";
        if (muralPreview) muralPreview.appendChild(img);
      } else {
        if (estado) estado.textContent = "Error al subir ❌";
      }
    } catch (err) {
      if (estado) estado.textContent = "Error de conexión ❌";
    }
  });
}

//Time Line
const timelineItems = safeQueryAll(".timeline-item");
if (timelineItems.length) {
  const observerTimeline = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.2 });

  timelineItems.forEach(item => observerTimeline.observe(item));
}

// Mostrar y ocultar datos bancarios con accesibilidad
const btnBanco = safeGetById("btn-banco");
const datosBanco = safeGetById("datos-banco");

if (datosBanco) {
  // preparar para focus cuando se muestre
  datosBanco.setAttribute("aria-hidden", "true");
  datosBanco.setAttribute("tabindex", "-1");
}

if (btnBanco && datosBanco) {
  btnBanco.setAttribute("aria-expanded", "false");
  btnBanco.addEventListener("click", () => {
    const isHidden = datosBanco.getAttribute("aria-hidden") === "true" || datosBanco.style.display === "none";
    if (isHidden) {
      datosBanco.style.display = "block";
      datosBanco.setAttribute("aria-hidden", "false");
      btnBanco.textContent = "💳 Ocultar datos bancarios";
      btnBanco.setAttribute("aria-expanded", "true");
      // mover foco al contenedor para que lectores lo detecten
      datosBanco.focus();
    } else {
      datosBanco.style.display = "none";
      datosBanco.setAttribute("aria-hidden", "true");
      btnBanco.textContent = "💳 Ver datos bancarios";
      btnBanco.setAttribute("aria-expanded", "false");
      btnBanco.focus();
    }
  });
}