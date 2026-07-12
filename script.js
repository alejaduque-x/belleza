const contenedorServicios = document.getElementById("contenedor-servicios");
const buscador = document.getElementById("buscador");
const filtroCategoria = document.getElementById("filtro-categoria");
const itemsCarrito = document.getElementById("items-carrito");
const totalCarrito = document.getElementById("total-carrito");
const contadorCarrito = document.getElementById("contador-carrito");
const formulario = document.querySelector(".contacto form");

let servicios = [];
let carrito = JSON.parse(localStorage.getItem("carritoBelleza")) || [];

const serviciosSalon = [
    {
        id: 1,
        title: "Corte de cabello",
        price: 12.000,
        category: "peluquería",
        image: "img/corte.jpg"
    },
    {
        id: 2,
        title: "Color",
        price: 18.000,
        category: "peluquería",
        image: "img/color.jpg"
    },
    {
        id: 3,
        title: "Brushing",
        price: 8.500,
        category: "peluquería",
        image: "img/brushing.jpg"
    },
    {
        id: 4,
        title: "Peinados",
        price: 14.000,
        category: "peluquería",
        image: "img/peinados.jpg"
    },
    {
        id: 5,
        title: "Alisado",
        price: 20.000,
        category: "peluquería",
        image: "img/alisado.jpg"
    },
    {
        id: 6,
        title: "Tratamiento capilar",
        price: 15.000,
        category: "peluquería",
        image: "img/capilar.jpg"
    },
    {
        id: 7,
        title: "Manicura",
        price: 9.500,
        category: "uñas",
        image: "img/manicura.jpg"
    },
    {
        id: 8,
        title: "Pedicura",
        price: 10.500,
        category: "uñas",
        image: "img/pedicura.jpg"
    },
    {
        id: 9,
        title: "Esmaltado semipermanente",
        price: 12.000,
        category: "uñas",
        image: "img/semipermanente.jpg"
    },
    {
        id: 10,
        title: "Balayage",
        price: 23.000,
        category: "peluquería",
        image: "img/balayage.jpg"
    }
];

// Consumo de Fake Store API
async function cargarServicios() {
    try {
        const respuesta = await fetch("https://fakestoreapi.com/products");

        if (!respuesta.ok) {
            throw new Error("No se pudo conectar con la API.");
        }

        const datosApi = await respuesta.json();

        servicios = serviciosSalon.map((servicio, indice) => {
            return {
                ...servicio,
                id: datosApi[indice].id
            };
        });
    } catch (error) {
        console.log("No se pudo cargar la API. Se muestran los servicios locales.");
        servicios = serviciosSalon;
    }

    cargarCategorias();
    mostrarServicios(servicios);
}

// Crear tarjetas de servicios
function mostrarServicios(listaServicios) {
    contenedorServicios.innerHTML = "";

    if (listaServicios.length === 0) {
        contenedorServicios.innerHTML = "<p>No se encontraron servicios.</p>";
        return;
    }

    listaServicios.forEach((servicio) => {
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("servicio");

        tarjeta.innerHTML = `
            <img src="${servicio.image}" alt="${servicio.title}">
            <h3>${servicio.title}</h3>
            <p><strong>Categoría:</strong> ${servicio.category}</p>
            <p>$${servicio.price.toFixed(2)}</p>
            <button class="agregar-carrito" data-id="${servicio.id}">
                Seleccionar
            </button>
        `;

        contenedorServicios.appendChild(tarjeta);
    });
}

// Cargar categorías en el select
function cargarCategorias() {
    filtroCategoria.innerHTML = `
        <option value="todos">Todas las categorías</option>
    `;

    const categorias = [...new Set(servicios.map((servicio) => servicio.category))];

    categorias.forEach((categoria) => {
        const opcion = document.createElement("option");
        opcion.value = categoria;
        opcion.textContent = categoria;
        filtroCategoria.appendChild(opcion);
    });
}

// Buscar y filtrar servicios
function filtrarServicios() {
    const texto = buscador.value.toLowerCase();
    const categoria = filtroCategoria.value;

    const serviciosFiltrados = servicios.filter((servicio) => {
        const coincideTexto = servicio.title.toLowerCase().includes(texto);
        const coincideCategoria =
            categoria === "todos" || servicio.category === categoria;

        return coincideTexto && coincideCategoria;
    });

    mostrarServicios(serviciosFiltrados);
}

if (buscador) {
    buscador.addEventListener("input", filtrarServicios);
}

if (filtroCategoria) {
    filtroCategoria.addEventListener("change", filtrarServicios);
}

// Agregar servicios al carrito
if (contenedorServicios) {
    contenedorServicios.addEventListener("click", (evento) => {
        if (evento.target.classList.contains("agregar-carrito")) {
            const idServicio = Number(evento.target.dataset.id);
            agregarAlCarrito(idServicio);
        }
    });
}

function agregarAlCarrito(idServicio) {
    const servicioElegido = servicios.find((servicio) => servicio.id === idServicio);
    const servicioEnCarrito = carrito.find((servicio) => servicio.id === idServicio);

    if (servicioEnCarrito) {
        servicioEnCarrito.cantidad++;
    } else {
        carrito.push({
            id: servicioElegido.id,
            title: servicioElegido.title,
            price: servicioElegido.price,
            cantidad: 1
        });
    }

    guardarCarrito();
    mostrarCarrito();
}

// Mostrar el carrito
function mostrarCarrito() {
    if (!itemsCarrito) return;

    itemsCarrito.innerHTML = "";

    if (carrito.length === 0) {
        itemsCarrito.innerHTML = `
            <p class="carrito-vacio">Todavía no seleccionaste ningún servicio.</p>
        `;

        totalCarrito.textContent = "0.00";
        contadorCarrito.textContent = "0";
        return;
    }

    carrito.forEach((servicio) => {
        const item = document.createElement("article");
        item.classList.add("item-carrito");

        item.innerHTML = `
            <div>
                <strong>${servicio.title}</strong>
                <p>$${servicio.price.toFixed(2)} x ${servicio.cantidad}</p>
            </div>

            <div>
                <button class="restar" data-id="${servicio.id}">-</button>
                <span>${servicio.cantidad}</span>
                <button class="sumar" data-id="${servicio.id}">+</button>
                <button class="eliminar" data-id="${servicio.id}">Eliminar</button>
            </div>
        `;

        itemsCarrito.appendChild(item);
    });

    actualizarTotal();
}

// Modificar cantidades o eliminar
if (itemsCarrito) {
    itemsCarrito.addEventListener("click", (evento) => {
        const idServicio = Number(evento.target.dataset.id);

        if (evento.target.classList.contains("sumar")) {
            cambiarCantidad(idServicio, 1);
        }

        if (evento.target.classList.contains("restar")) {
            cambiarCantidad(idServicio, -1);
        }

        if (evento.target.classList.contains("eliminar")) {
            eliminarServicio(idServicio);
        }
    });
}

function cambiarCantidad(idServicio, cambio) {
    const servicio = carrito.find((servicio) => servicio.id === idServicio);

    if (!servicio) return;

    servicio.cantidad += cambio;

    if (servicio.cantidad <= 0) {
        eliminarServicio(idServicio);
        return;
    }

    guardarCarrito();
    mostrarCarrito();
}

function eliminarServicio(idServicio) {
    carrito = carrito.filter((servicio) => servicio.id !== idServicio);

    guardarCarrito();
    mostrarCarrito();
}

// Actualizar total y contador
function actualizarTotal() {
    const total = carrito.reduce((acumulador, servicio) => {
        return acumulador + servicio.price * servicio.cantidad;
    }, 0);

    const cantidadTotal = carrito.reduce((acumulador, servicio) => {
        return acumulador + servicio.cantidad;
    }, 0);

    totalCarrito.textContent = total.toFixed(2);
    contadorCarrito.textContent = cantidadTotal;
}

// Guardar datos en localStorage
function guardarCarrito() {
    localStorage.setItem("carritoBelleza", JSON.stringify(carrito));
}

// Validación del formulario
if (formulario) {
    formulario.addEventListener("submit", (evento) => {
        const nombre = formulario.nombre.value.trim();
        const email = formulario.email.value.trim();
        const mensaje = formulario.mensaje.value.trim();

        if (nombre === "" || email === "" || mensaje === "") {
            evento.preventDefault();
            alert("Por favor, completá todos los campos.");
            return;
        }

        if (!email.includes("@")) {
            evento.preventDefault();
            alert("Ingresá un correo electrónico válido.");
        }
    });
}

if (contenedorServicios) {
    cargarServicios();
    mostrarCarrito();
}
