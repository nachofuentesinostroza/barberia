// Configuracion central de las reservas para cambiar el numero en un solo lugar.
const numeroWhatsApp = "569XXXXXXX"; // Reemplaza con el número real de WhatsApp de BLACKCUT
const mensajeReserva = "Hola BLACKCUT, quiero reservar una hora.";
const instagramUsuario = "TU_USUARIO";
const zonaHorariaBarberia = "America/Santiago";

// Date representa el instante actual; Intl lo convierte al dia y hora de Chile.
const actualizarEstadoBarberia = () => {
    const estadoElemento = document.querySelector("#businessStatus");
    if (!estadoElemento) return;

    const partesFecha = new Intl.DateTimeFormat("es-CL", {
        timeZone: zonaHorariaBarberia,
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23"
    }).formatToParts(new Date());
    const partes = Object.fromEntries(partesFecha.map(({ type, value }) => [type, value]));
    const minutosActuales = Number(partes.hour) * 60 + Number(partes.minute);
    const esDomingo = partes.weekday.toLowerCase() === "domingo";
    const minutosApertura = esDomingo ? null : 10 * 60;
    const minutosCierre = esDomingo ? null : partes.weekday.toLowerCase() === "sábado" ? 18 * 60 : 20 * 60;

    // if/else decide entre abierto ahora, cerrado ahora o cerrado todo el domingo.
    let estado = "CERRADO AHORA";
    if (esDomingo) {
        estado = "CERRADO HOY";
    } else if (minutosActuales >= minutosApertura && minutosActuales < minutosCierre) {
        estado = "ABIERTO AHORA";
    }

    // textContent actualiza el texto visible sin modificar el diseño.
    estadoElemento.textContent = `● ${estado}`;
};

// Construye el enlace de Instagram y bloquea el marcador hasta configurar un usuario real.
const configurarInstagram = () => {
    const instagramLink = document.querySelector("#instagramLink");
    if (!instagramLink) return;

    if (instagramUsuario === "TU_USUARIO") {
        instagramLink.addEventListener("click", (event) => {
            event.preventDefault();
            window.alert("Falta configurar el usuario de Instagram de BLACKCUT.");
        });
        return;
    }

    instagramLink.href = `https://www.instagram.com/${instagramUsuario}/`;
    instagramLink.target = "_blank";
    instagramLink.rel = "noopener noreferrer";
};

document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector("#mainNav");
    const menu = document.querySelector("#navbarContent");
    const menuLinks = document.querySelectorAll("#navbarContent .nav-link");
    const reservaLinks = document.querySelectorAll(".reserva-link");

    // Asigna la misma URL codificada a todos los botones y bloquea el marcador temporal.
    const mensajeCodificado = encodeURIComponent(mensajeReserva);
    const numeroPendiente = numeroWhatsApp.includes("X");

    reservaLinks.forEach((link) => {
    if (numeroPendiente) {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            window.alert("Falta configurar el numero de WhatsApp de BLACKCUT.");
        });
        return;
    }

    link.href = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;
    link.target = "_blank";
    link.rel = "noopener";
    });

    const updateNavbar = () => {
        navbar.classList.toggle("scrolled", window.scrollY > 40);
    };

    updateNavbar();
    actualizarEstadoBarberia();
    configurarInstagram();
    window.setInterval(actualizarEstadoBarberia, 60 * 1000);
    window.addEventListener("scroll", updateNavbar, { passive: true });

    menuLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (menu.classList.contains("show")) {
                bootstrap.Collapse.getOrCreateInstance(menu).hide();
            }
        });
    });
});
