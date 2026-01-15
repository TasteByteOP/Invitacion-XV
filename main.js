window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (!loader) return;

  setTimeout(() => {
    loader.classList.add("oculto");
  }, 800);
});

const pagina = document.getElementById("pagina");

const audio = document.getElementById("musica");

if (audio) {
  audio.volume = 0.4;   // 🔊 volumen real
  audio.muted = false;  // 🔥 MUY IMPORTANTE
}


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

const musica = safeGetById("musica");
const btnMusica = safeGetById("btn-musica");
const aviso = safeGetById("aviso-musica");


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
if (btnMusica && audio && iconoMusica) {
  btnMusica.addEventListener("click", async () => {
    try {
      if (audio.paused) {
        await audio.play();
        iconoMusica.textContent = "volume_up";
        if (avisoMusica) avisoMusica.style.opacity = "0";
      } else {
        audio.pause();
        iconoMusica.textContent = "volume_off";
      }
    } catch (e) {
      console.log("Audio bloqueado:", e);
    }
  });
}


  // -------- BOTÓN SUBIR --------
  if (btnTop) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        btnTop.classList.add("visible");
      } else {
        btnTop.classList.remove("visible");
      }
    });

    btnTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }


const btnConfirmar = safeGetById("btn-confirmar");
const estadoConfirmacion = safeGetById("estado-confirmacion");

if (btnConfirmar) {
  btnConfirmar.addEventListener("click", () => {
    const nombreEl = safeGetById("nombre");
    const personasEl = safeGetById("personas");

    const nombre = nombreEl ? nombreEl.value.trim() : "";
    if (!nombre) {
      nombreEl.focus();
      return;
    }

    const personas = personasEl && personasEl.value ? personasEl.value : 1;

    if (estadoConfirmacion) {
      estadoConfirmacion.textContent = "¡Gracias por confirmar 💖!";
    }

    btnConfirmar.disabled = true;
    btnConfirmar.style.opacity = "0.6";

    const mensaje = `Hola, soy ${nombre} y confirmo mi asistencia a los XV con ${personas} persona(s). 🎉`;
    const url = `https://wa.me/527224071587?text=${encodeURIComponent(mensaje)}`;

    lanzarConfetti();

setTimeout(() => {
  window.open(url, "_blank");
}, 1000); // 1 segundo

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

// ========= SOBRE + DESBLOQUEO DE PÁGINA =========
const sobreOverlay = safeGetById("sobre-overlay");
const sello = document.querySelector(".sello");
const sobre = document.querySelector(".sobre");

// La página inicia oculta
if (pagina) {
  pagina.classList.add("pagina-oculta");
}

if (sello && sobreOverlay && pagina) {
  sello.addEventListener("click", async () => {

    // Iniciar música con gesto del usuario
    if (musica && musica.paused) {
      try {
        await musica.play();
        if (btnMusica) {
          btnMusica.querySelector(".material-symbols-outlined").textContent = "volume_up";
          btnMusica.setAttribute("aria-pressed", "true");
        }
        if (aviso) {
          aviso.style.opacity = "0";
          setTimeout(() => aviso.style.display = "none", 600);
        }
      } catch (e) {
        console.log("Audio bloqueado:", e);
      }
    }

    // Animar sobre
    if (sobre) sobre.classList.add("abierto");

    // Mostrar página
    setTimeout(() => {
  sobreOverlay.style.display = "none";
  sobreOverlay.style.pointerEvents = "none";

  pagina.classList.remove("pagina-oculta");
  pagina.classList.add("pagina-visible");

  document.body.style.overflow = "auto"; // 🔥 CLAVE

  lanzarConfetti();
}, 1000);

  });
}

// Sacudida del sobre para llamar la atención
if (sobre) {
  setInterval(() => {
    if (!sobre.classList.contains("abierto")) {
      sobre.classList.remove("atencion");
      void sobre.offsetWidth;
      sobre.classList.add("atencion");
    }
  }, 2500);
}

// ========= PANTALLA DE CARGA =========
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (!loader) return;

  setTimeout(() => {
    loader.classList.add("oculto");
  }, 800); // puedes ajustar el tiempo
});

