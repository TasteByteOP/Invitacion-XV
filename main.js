// ========= CONFIGURACIÓN =========
const FECHA_EVENTO = new Date("2026-03-07T15:00:00");
const WHATSAPP_NUMERO = "527224071587";
const CLOUDINARY_CONFIG = {
  cloudName: "dxrnsitv5",
  uploadPreset: "mural_xv"
};
const LUCIERNAGAS_CONFIG = {
  total: 75,
  maxMobile: 30,
  mobileBreakpoint: 800
};
const LOADING_DURATION = 2000; // 2 segundos de pantalla de carga

// Detectar preferencia de movimiento reducido
const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// ========= UTILIDADES =========
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const $id = (id) => document.getElementById(id);

// ========= SECUENCIA DE INICIO (Loading -> Sobre -> Contenido) =========
function initLoadingSequence() {
  const loadingScreen = $id("loading-screen");
  const envelopeScreen = $id("envelope-screen");
  const mainContent = $id("main-content");
  const envelopeImage = $id("envelope-image");
  const envelopeVideo = $id("envelope-video");
  const envelopeHint = $(".envelope-hint");
  const envelopeContainer = $(".envelope-container");
  const flowerCta = $id("flower-cta");

  if (!loadingScreen || !envelopeScreen || !mainContent) return;

  // Seleccionar assets según dispositivo
  const isMobile = window.innerWidth <= (LUCIERNAGAS_CONFIG?.mobileBreakpoint || 800);
  if (envelopeImage) {
    envelopeImage.src = isMobile ? "Assets/img/Sobre1.PNG" : "Assets/img/Sobre.PNG";
  }
  if (envelopeVideo) {
    const sourceEl = envelopeVideo.querySelector("source");
    const videoSrc = isMobile ? "Assets/vid/Sobre1.webm" : "Assets/vid/Sobre.webm";
    if (sourceEl) {
      sourceEl.src = videoSrc;
      envelopeVideo.load();
    } else {
      envelopeVideo.src = videoSrc;
    }
  }

  // Paso 1: Mostrar pantalla de carga por 2 segundos
  setTimeout(() => {
    // Ocultar pantalla de carga
    loadingScreen.classList.add("hidden");
    
    // Mostrar pantalla del sobre
    envelopeScreen.classList.add("visible");
  }, LOADING_DURATION);

  // Paso 2: Manejar clic (preferentemente en la flor)
  if (flowerCta) {
    const activate = (e) => {
      e.preventDefault();
      handleEnvelopeClick();
    };
    flowerCta.addEventListener("click", activate);
    flowerCta.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") activate(e);
    });
  } else if (envelopeContainer) {
    envelopeContainer.addEventListener("click", handleEnvelopeClick);
  }

  function handleEnvelopeClick() {
    // Evitar múltiples clics
    if (envelopeContainer) {
      envelopeContainer.removeEventListener("click", handleEnvelopeClick);
    }
    if (flowerCta) {
      const clone = flowerCta.cloneNode(true);
      flowerCta.replaceWith(clone); // remueve listeners
      clone.classList.add("hidden");
    }
    
    // Ocultar imagen del sobre y hint
    if (envelopeImage) envelopeImage.classList.add("hidden");
    if (envelopeHint) envelopeHint.classList.add("hidden");
    
    // Mostrar y reproducir video
    if (envelopeVideo) {
      envelopeVideo.classList.add("visible");
      envelopeVideo.play().catch(() => {
        // Si el video falla, ir directamente al contenido
        revealMainContent();
      });
      
      // Cuando termine el video, mostrar contenido principal
      envelopeVideo.addEventListener("ended", revealMainContent);
    } else {
      // Si no hay video, ir directamente al contenido
      revealMainContent();
    }
  }

  function revealMainContent() {
    // Ocultar pantalla del sobre
    envelopeScreen.classList.add("hidden");
    envelopeScreen.classList.remove("visible");
    
    // Mostrar contenido principal con fade-in
    mainContent.classList.remove("main-content-hidden");
    mainContent.classList.add("visible");
    
    // Iniciar música automáticamente después de abrir el sobre
    startMusicAfterEnvelope();
    
    // Disparar confetti de bienvenida
    triggerWelcomeConfetti();
  }
}

// ========= MÚSICA DESPUÉS DEL SOBRE =========
function startMusicAfterEnvelope() {
  const musica = $id("musica");
  const btnMusica = $id("btn-musica");
  const aviso = $id("aviso-musica");
  
  if (!musica || prefersReducedMotion) return;
  
  const iconElement = btnMusica?.querySelector(".material-symbols-outlined");
  
  musica.play()
    .then(() => {
      // Actualizar icono a "reproduciendo"
      if (iconElement) iconElement.textContent = "volume_up";
      if (btnMusica) btnMusica.setAttribute("aria-pressed", "true");
      
      // Ocultar aviso de música
      if (aviso) {
        aviso.style.opacity = "0";
        setTimeout(() => {
          aviso.style.display = "none";
        }, 600);
      }
    })
    .catch(() => {
      // Si falla el autoplay, mantener el icono en silencio
      if (iconElement) iconElement.textContent = "volume_off";
      if (btnMusica) btnMusica.setAttribute("aria-pressed", "false");
    });
}

// ========= CONFETTI DE BIENVENIDA (separado para control) =========
function triggerWelcomeConfetti() {
  if (typeof window.confetti !== "function" || prefersReducedMotion) return;
  
  window.confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.6 }
  });
}

// ========= ANIMACIONES DE SECCIONES =========
function initSectionAnimations() {
  const secciones = $$(".section");
  if (!secciones.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.2 }
  );

  secciones.forEach((sec) => observer.observe(sec));
}

// ========= BOTÓN SUBIR ARRIBA =========
function initScrollToTop() {
  const btnTop = $id("btn-top");
  if (!btnTop) return;

  const toggleVisibility = () => {
    btnTop.classList.toggle("visible", window.scrollY > 200);
  };

  window.addEventListener("scroll", toggleVisibility, { passive: true });

  btnTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    btnTop.blur();
  });
}

// ========= MÚSICA =========
function initMusicPlayer() {
  const musica = $id("musica");
  const btnMusica = $id("btn-musica");
  const aviso = $id("aviso-musica");

  if (!musica || !btnMusica) return;

  musica.volume = 0.2;
  const iconElement = btnMusica.querySelector(".material-symbols-outlined");

  const updateIcon = (isPlaying) => {
    if (iconElement) {
      iconElement.textContent = isPlaying ? "volume_up" : "volume_off";
    }
    btnMusica.setAttribute("aria-pressed", isPlaying.toString());
  };

  const hideNotice = () => {
    if (aviso) {
      aviso.style.opacity = "0";
      setTimeout(() => {
        aviso.style.display = "none";
      }, 600);
    }
  };

  // NO intentar autoplay al cargar - ahora se maneja después del sobre
  // Solo configurar el estado inicial del icono
  updateIcon(false);

  // Toggle música al hacer clic (sigue funcionando normalmente)
  btnMusica.addEventListener("click", () => {
    if (musica.paused) {
      musica.play().catch(() => {});
      updateIcon(true);
    } else {
      musica.pause();
      updateIcon(false);
    }
    hideNotice();
    btnMusica.blur();
  });
}

// ========= CONFIRMACIÓN WHATSAPP =========
function initConfirmation() {
  const btnConfirmar = $id("btn-confirmar");
  if (!btnConfirmar) return;

  btnConfirmar.addEventListener("click", () => {
    const nombreEl = $id("nombre");
    const nombre = nombreEl?.value.trim() || "";
    const asistenciaEl = $id("asistencia");
    const asistencia = asistenciaEl?.value || "";

    // Validación: nombre y asistencia obligatorios
    if (!nombre || !asistencia) {
      if (!nombre && nombreEl) {
        nombreEl.classList.add("input-error");
        nombreEl.focus();
        const removeErrorNombre = () => {
          nombreEl.classList.remove("input-error");
          nombreEl.removeEventListener("input", removeErrorNombre);
        };
        nombreEl.addEventListener("input", removeErrorNombre);
      } else if (!asistencia && asistenciaEl) {
        asistenciaEl.classList.add("input-error");
        asistenciaEl.focus();
        const removeErrorAsistencia = () => {
          asistenciaEl.classList.remove("input-error");
          asistenciaEl.removeEventListener("change", removeErrorAsistencia);
        };
        asistenciaEl.addEventListener("change", removeErrorAsistencia);
      }
      return;
    }

    const mensaje =
      asistencia === "si"
        ? `Hola, soy ${nombre} y confirmo mi asistencia a los XV 🎉`
        : `Hola, soy ${nombre} y no podré asistir a los XV 🙏`;
    const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;

    // Lanzar confetti si está disponible
    if (asistencia === "si") {
      lanzarConfetti();
    }

    window.open(url, "_blank");
    btnConfirmar.blur();
  });
}

// ========= CONFETTI =========
function lanzarConfetti() {
  if (typeof window.confetti !== "function" || prefersReducedMotion) return;
  
  window.confetti({
    particleCount: 120,
    spread: 90,
    origin: { y: 0.7 }
  });
}

// initWelcomeConfetti ya no se usa - el confetti ahora se dispara en triggerWelcomeConfetti()
// después de que el sobre se abre

// ========= CONTADOR =========
function initCountdown() {
  const elementos = {
    dias: $id("dias"),
    horas: $id("horas"),
    minutos: $id("minutos"),
    segundos: $id("segundos")
  };

  // Verificar que todos los elementos existan
  if (!Object.values(elementos).every(Boolean)) return;

  const actualizar = () => {
    const ahora = new Date();
    const diff = FECHA_EVENTO - ahora;

    if (diff <= 0) {
      Object.values(elementos).forEach((el) => (el.textContent = "0"));
      return;
    }

    const MS_POR_SEGUNDO = 1000;
    const MS_POR_MINUTO = MS_POR_SEGUNDO * 60;
    const MS_POR_HORA = MS_POR_MINUTO * 60;
    const MS_POR_DIA = MS_POR_HORA * 24;

    elementos.dias.textContent = Math.floor(diff / MS_POR_DIA);
    elementos.horas.textContent = Math.floor((diff / MS_POR_HORA) % 24);
    elementos.minutos.textContent = Math.floor((diff / MS_POR_MINUTO) % 60);
    elementos.segundos.textContent = Math.floor((diff / MS_POR_SEGUNDO) % 60);
  };

  actualizar();
  setInterval(actualizar, 1000);
}

// ========= LUCIÉRNAGAS =========
function initFireflies() {
  const contenedor = $id("luciernagas");
  if (!contenedor || prefersReducedMotion) return;

  const { total, maxMobile, mobileBreakpoint } = LUCIERNAGAS_CONFIG;
  const cantidad = window.innerWidth < mobileBreakpoint 
    ? Math.min(total, maxMobile) 
    : total;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < cantidad; i++) {
    const luz = document.createElement("div");
    luz.classList.add("luciernaga");

    const size = Math.random() * 30 + 4;
    luz.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}vw;
      top: ${Math.random() * 100}vh;
      animation-duration: ${Math.random() * 20 + 20}s, ${Math.random() * 4 + 3}s;
    `;

    fragment.appendChild(luz);
  }

  contenedor.appendChild(fragment);
}

// ========= MURAL DE FOTOS =========
function initPhotoUpload() {
  const inputUpload = $id("upload");
  const estado = $id("estado-subida");
  const muralPreview = $id("mural-preview");

  if (!inputUpload) return;

  const MAX_SIZE_MB = 5;
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

  inputUpload.addEventListener("change", async () => {
    const file = inputUpload.files[0];
    if (!file) return;

    // Validaciones
    if (!ALLOWED_TYPES.includes(file.type)) {
      if (estado) estado.textContent = "Formato no soportado. Usa JPG, PNG o WEBP.";
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      if (estado) estado.textContent = `Archivo demasiado grande. Máx ${MAX_SIZE_MB} MB.`;
      return;
    }

    if (estado) estado.textContent = "Subiendo imagen... ⏳";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
        { method: "POST", body: formData }
      );

      const data = await res.json();

      if (data?.secure_url) {
        if (estado) estado.textContent = "Imagen subida correctamente ✅";
        
        if (muralPreview) {
          const img = document.createElement("img");
          img.src = data.secure_url;
          img.alt = "Foto subida al mural";
          img.style.maxWidth = "100%";
          muralPreview.appendChild(img);
        }
      } else {
        if (estado) estado.textContent = "Error al subir ❌";
      }
    } catch {
      if (estado) estado.textContent = "Error de conexión ❌";
    }
  });
}

// ========= TIMELINE =========
function initTimeline() {
  const timelineItems = $$(".timeline-item");
  if (!timelineItems.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.2 }
  );

  timelineItems.forEach((item) => observer.observe(item));
}

// ========= DATOS BANCARIOS =========
function initBankDetails() {
  const btnBanco = $id("btn-banco");
  const datosBanco = $id("datos-banco");

  if (!btnBanco || !datosBanco) return;

  btnBanco.addEventListener("click", () => {
    const isHidden = datosBanco.getAttribute("aria-hidden") === "true";

    if (isHidden) {
      datosBanco.style.display = "block";
      datosBanco.setAttribute("aria-hidden", "false");
      btnBanco.innerHTML = "💳 <strong>Ocultar datos bancarios</strong>";
      btnBanco.setAttribute("aria-expanded", "true");
      datosBanco.focus();
    } else {
      datosBanco.style.display = "none";
      datosBanco.setAttribute("aria-hidden", "true");
      btnBanco.innerHTML = "💳 <strong>Ver datos bancarios</strong>";
      btnBanco.setAttribute("aria-expanded", "false");
      btnBanco.focus();
    }
  });
}

// ========= INICIALIZACIÓN =========
document.addEventListener("DOMContentLoaded", () => {
  // Iniciar secuencia de carga -> sobre -> contenido
  initLoadingSequence();
  
  // Inicializar funcionalidades (se ejecutan pero el contenido está oculto)
  initSectionAnimations();
  initScrollToTop();
  initMusicPlayer();
  initConfirmation();
  initCountdown();
  initFireflies();
  initPhotoUpload();
  initTimeline();
  initBankDetails();
});
