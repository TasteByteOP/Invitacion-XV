// ========= ANIMACIONES DE SECCIONES =========
const secciones = document.querySelectorAll(".section");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.2 });

secciones.forEach(sec => observer.observe(sec));


// ========= MÚSICA =========
const musica = document.getElementById("musica");
const btnMusica = document.getElementById("btn-musica");

musica.volume = 0.2;

window.addEventListener("load", () => {
  musica.play().catch(() => {
    btnMusica.textContent = "🔇";
  });
});

btnMusica.addEventListener("click", () => {
  if (musica.paused) {
    musica.play();
    btnMusica.textContent = "🔊";
  } else {
    musica.pause();
    btnMusica.textContent = "🔇";
  }
});

const aviso = document.getElementById("aviso-musica");

btnMusica.addEventListener("click", () => {
  aviso.style.display = "none";
});


// ========= CONFIRMAR ASISTENCIA =========
const btnConfirmar = document.getElementById("btn-confirmar");

btnConfirmar.addEventListener("click", () => {
  const nombre = document.getElementById("nombre").value || "Invitado misterioso";
  const personas = document.getElementById("personas").value || 1;

  const mensaje = `Hola, soy ${nombre} y confirmo mi asistencia a los XV con ${personas} persona(s). 🎉`;
  const url = `https://wa.me/527226163280?text=${encodeURIComponent(mensaje)}`;

  lanzarConfetti();
  window.open(url, "_blank");
});


// ========= CONFETTI =========
function lanzarConfetti() {
  if (typeof confetti !== "function") return;

  confetti({
    particleCount: 120,
    spread: 90,
    origin: { y: 0.7 }
  });
}

// ========= CONTADOR =========
const fechaEvento = new Date("2026-07-01T17:00:00"); // AJUSTA FECHA Y HORA

const d = document.getElementById("dias");
const h = document.getElementById("horas");
const m = document.getElementById("minutos");
const s = document.getElementById("segundos");

function actualizarContador() {
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

setInterval(actualizarContador, 1000);
actualizarContador();


// ===== LUCERNAGAS =====
const TOTAL_LUCIERNAGAS = 75; // 👈 CAMBIA ESTE NÚMERO

const contenedor = document.getElementById("luciernagas");

for (let i = 0; i < TOTAL_LUCIERNAGAS; i++) {
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

// ===== CONFETTI =====
window.addEventListener("load", () => {
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.6 }
  });
});


// ===== MURAL =====
const inputUpload = document.getElementById("upload");
const estado = document.getElementById("estado-subida");

const CLOUD_NAME = "dxrnsitv5";
const UPLOAD_PRESET = "mural_xv";

inputUpload.addEventListener("change", async () => {
  const file = inputUpload.files[0];
  if (!file) return;

  estado.textContent = "Subiendo imagen... ⏳";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData
      }
    );

    const data = await res.json();

    if (data.secure_url) {
      estado.textContent = "Imagen subida correctamente ✅";
    } else {
      estado.textContent = "Error al subir ❌";
    }
  } catch (err) {
    estado.textContent = "Error de conexión ❌";
  }
});

