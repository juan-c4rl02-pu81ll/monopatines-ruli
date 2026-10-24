// Cambiamos de tema claro / oscuro con persistencia en localStorage
const btnTema = document.querySelector("#btnTema");

// revisamos si habia un tema guardado en localStorage
const temaGuardado = localStorage.getItem("tema");
if(temaGuardado === "oscuro"){
    document.body.classList.add("dark-mode");
    if(btnTema){
        btnTema.textContent = "Modo claro";
    }
}

if(btnTema){
    btnTema.addEventListener("click", function(){
        document.body.classList.toggle("dark-mode");

        if(document.body.classList.contains("dark-mode")){
            btnTema.textContent = "Modo claro";
            localStorage.setItem("tema", "oscuro");
        } else {
            btnTema.textContent = "Modo oscuro";
            localStorage.setItem("tema", "claro");
        }
    });
}

// sincronizar si cambia el tema desde otra ventana
window.addEventListener("storage", function(e){
    if(e.key === "tema"){
        if(e.newValue === "oscuro"){
            document.body.classList.add("dark-mode");
            if(btnTema) btnTema.textContent = "Modo claro";
        } else {
            document.body.classList.remove("dark-mode");
            if(btnTema) btnTema.textContent = "Modo oscuro";
        }
    }
});

// Submenu del menu de escritorio
const submenu = document.querySelector("#submenu");
const submenuTrigger = document.querySelector("#submenu-trigger");
const submenuItem = document.querySelector("#submenu-Item");

submenuTrigger.addEventListener("click", function(e){
    e.preventDefault();
    submenu.classList.toggle("active");
});

submenuItem.addEventListener("mouseleave", function(){
    submenu.classList.remove("active");
});

// Menu hamburguesa
const btnHamburguesa = document.querySelector("#btn-hamburguesa");
const navMovil = document.querySelector("#navMovil");
const submenu2 = document.querySelector("#submenu2");
const btnSubmenuMovil = document.querySelector("#btn-submenuMovil");

btnHamburguesa.addEventListener("click", function(){
    navMovil.classList.toggle("abierto");
    btnHamburguesa.classList.toggle("activo");
});

function cerrarMenuMovil(){
    navMovil.classList.remove("abierto");
    submenu2.classList.remove("activo");
    btnHamburguesa.classList.remove("activo");
}

btnHamburguesa.addEventListener("dblclick", cerrarMenuMovil);

btnSubmenuMovil.addEventListener("click", function(event){
    event.preventDefault();
    submenu2.classList.toggle("activo");
});

document.querySelector("header").addEventListener("mouseleave", function(){
    submenu.classList.remove("active");
});

document.addEventListener("click", function(event){
    if(!navMovil.contains(event.target) && !btnHamburguesa.contains(event.target)){
        cerrarMenuMovil();
    }
});

// Cerrar el menu movil al hacer clic en cualquier enlace de seccion
const enlacesMovil = navMovil.querySelectorAll("a");
enlacesMovil.forEach(function(enlace){
    if(enlace.id !== "btn-submenuMovil"){
        enlace.addEventListener("click", function(){
            cerrarMenuMovil();
        });
    }
});

// Boton de llamada a la accion
document.querySelector("#cta").addEventListener("click", function(){
    document.querySelector("#catalogo").scrollIntoView({ behavior: "smooth" });
});

// Catalogo de productos
const productos = [
    { id: 1, nombre: "Monopatin Urban", descripcion: "Plegable, ideal para la ciudad", precio: 15000, categoria: "Monopatines", imagen: "Imagenes/monopatin_urban.jpg" },
    { id: 2, nombre: "Monopatin Pro", descripcion: "Reforzado para uso diario", precio: 22000, categoria: "Monopatines", imagen: "Imagenes/monopatin_pro.jpg" },
    { id: 3, nombre: "Monopatin Kids", descripcion: "Liviano y seguro para chicos", precio: 12000, categoria: "Monopatines", imagen: "Imagenes/monopatin_kids.jpg" },
    { id: 4, nombre: "Monopatin Street", descripcion: "Tabla ancha para trucos", precio: 18500, categoria: "Monopatines", imagen: "Imagenes/monopatin_street.jpg" },
    { id: 5, nombre: "Monopatin Electric", descripcion: "Motor 250W y bateria recargable", precio: 48000, categoria: "Monopatines", imagen: "Imagenes/monopatin_electric.jpg" },
    { id: 6, nombre: "Casco de seguridad", descripcion: "Con certificacion y talle regulable", precio: 4500, categoria: "Accesorios", imagen: "Imagenes/casco.jpg" },
    { id: 7, nombre: "Casco Full Face", descripcion: "Proteccion completa para saltos", precio: 7800, categoria: "Accesorios", imagen: "Imagenes/casco_full.jpg" },
    { id: 8, nombre: "Rodilleras y coderas", descripcion: "Set de proteccion para principiantes", precio: 3200, categoria: "Accesorios", imagen: "Imagenes/rodilleras.jpg" },
    { id: 9, nombre: "Guantes de proteccion", descripcion: "Reforzados en palma y nudillos", precio: 2500, categoria: "Accesorios", imagen: "Imagenes/guantes.jpg" },
    { id: 10, nombre: "Luces LED", descripcion: "Kit para ruedas, uso nocturno", precio: 1900, categoria: "Accesorios", imagen: "Imagenes/luces_led.jpg" },
    { id: 11, nombre: "Bolso de transporte", descripcion: "Correa ajustable para colgar", precio: 3800, categoria: "Accesorios", imagen: "Imagenes/bolso.jpg" },
    { id: 12, nombre: "Ruedas de repuesto", descripcion: "Par de ruedas de poliuretano", precio: 1800, categoria: "Repuestos", imagen: "Imagenes/ruedas.jpg" },
    { id: 13, nombre: "Frenos de disco", descripcion: "Repuesto para modelo Pro", precio: 2600, categoria: "Repuestos", imagen: "Imagenes/frenos.jpg" },
    { id: 14, nombre: "Grip antideslizante", descripcion: "Lija autoadhesiva para la tabla", precio: 1200, categoria: "Repuestos", imagen: "Imagenes/grip.jpg" },
    { id: 15, nombre: "Kit de herramientas", descripcion: "Llaves y destornilladores", precio: 2900, categoria: "Repuestos", imagen: "Imagenes/herramientas.jpg" }
];

const gridProductos = document.querySelector("#gridProductos");

function agregarProducto(producto){
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("tarjeta-producto");
    tarjeta.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <p class="precio">$${producto.precio}</p>
        <button>Agregar</button>
    `;

    // guardar producto en la base de datos MySQL
    const btnAgregar = tarjeta.querySelector("button");
    btnAgregar.addEventListener("click", function(){
        const datos = new FormData();
        datos.append("accion", "agregar_carrito");
        datos.append("producto_id", producto.id);

        fetch("guardar.php", {
            method: "POST",
            body: datos
        })
        .then(function(res){
            return res.text();
        })
        .then(function(resp){
            if(resp.trim() === "ok"){
                // cargamos el carrito lateral, animamos el contador y abrimos el panel
                cargarCarritoLateral(true);
            } else {
                Swal.fire({
                    title: "Aviso",
                    text: resp.trim() || "No se pudo agregar al carrito.",
                    icon: "warning",
                    confirmButtonText: "Aceptar"
                });
            }
        })
        .catch(function(){
            Swal.fire("Error", "Error de conexion con el servidor", "error");
        });
    });

    gridProductos.appendChild(tarjeta);
}

function mostrarProductos(categoria){
    gridProductos.innerHTML = "";

    productos.forEach(function(producto){
        if(categoria === "Todos" || producto.categoria === categoria){
            agregarProducto(producto);
        }
    });
}

mostrarProductos("Todos");

// Filtro interactivo
const botonesFiltro = document.querySelectorAll(".filtros button");

botonesFiltro.forEach(function(boton){
    boton.addEventListener("click", function(){
        mostrarProductos(boton.dataset.categoria);
    });
});

// Formulario: validacion y envio a MySQL
const formContacto = document.querySelector("#formContacto");
const resultadoForm = document.querySelector("#resultadoForm");

formContacto.addEventListener("submit", function(e){
    e.preventDefault();

    const nombre = document.querySelector("#nombre").value.trim();
    const email = document.querySelector("#email").value.trim();
    const productoId = document.querySelector("#producto_id") ? document.querySelector("#producto_id").value : "";
    const mensaje = document.querySelector("#mensaje").value.trim();

    if(nombre === "" || email === "" || productoId === "" || mensaje === ""){
        Swal.fire({
            title: "Error",
            text: "Completa todos los campos obligatorios.",
            icon: "error",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    if(email.indexOf("@") === -1 || email.indexOf(".") === -1){
        Swal.fire({
            title: "Error",
            text: "Ingresa un email valido.",
            icon: "error",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "guardar.php", true);

    const datos = new FormData();
    datos.append("nombre", nombre);
    datos.append("email", email);
    datos.append("producto_id", productoId);
    datos.append("mensaje", mensaje);

    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            const respuesta = xhr.responseText.split("|");

            if(respuesta[0].trim() === "ok"){
                resultadoForm.innerHTML = respuesta[1] || "";
                Swal.fire({
                    title: "Listo",
                    text: "Tu consulta se guardo correctamente.",
                    icon: "success",
                    confirmButtonText: "Aceptar"
                });
                formContacto.reset();
            } else {
                Swal.fire({
                    title: "Error",
                    text: "No se pudo guardar la consulta.",
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });
            }
        } else if(xhr.readyState === 4){
            Swal.fire({
                title: "Error",
                text: "No se pudo conectar con el servidor.",
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        }
    };

    xhr.send(datos);
});

// ===== Logica del Carrito Lateral Deslizante =====
const carritoLateral = document.querySelector("#carritoLateral");
const carritoOverlay = document.querySelector("#carritoOverlay");
const btnCerrarCarrito = document.querySelector("#btnCerrarCarrito");
const listaCarritoLateral = document.querySelector("#listaCarritoLateral");
const totalPagarLateral = document.querySelector("#totalPagarLateral");
const cantItemsLateral = document.querySelector("#cantItemsLateral");
const btnVaciarLateral = document.querySelector("#btnVaciarLateral");
const btnFinalizarLateral = document.querySelector("#btnFinalizarLateral");
const btnAbrirCarrito = document.querySelector("#btnAbrirCarrito");
const linksAbrirCarrito = document.querySelectorAll(".link-abrir-carrito");

function animarBadges(){
    const badges = document.querySelectorAll(".badge-carrito");
    badges.forEach(function(b){
        b.classList.remove("badge-pop");
        void b.offsetWidth;
        b.classList.add("badge-pop");
    });
}

function actualizarContadores(cantidad){
    const badges = document.querySelectorAll(".badge-carrito");
    badges.forEach(function(b){
        b.textContent = cantidad;
    });
    if(cantItemsLateral){
        cantItemsLateral.textContent = cantidad + (cantidad === 1 ? " item" : " items");
    }
}

function abrirCarritoLateral(){
    if(carritoLateral && carritoOverlay){
        carritoLateral.classList.add("abierto");
        carritoOverlay.classList.add("activo");
    }
}

function cerrarCarritoLateral(){
    if(carritoLateral && carritoOverlay){
        carritoLateral.classList.remove("abierto");
        carritoOverlay.classList.remove("activo");
    }
}

if(btnCerrarCarrito) btnCerrarCarrito.addEventListener("click", cerrarCarritoLateral);
if(carritoOverlay) carritoOverlay.addEventListener("click", cerrarCarritoLateral);
document.addEventListener("keydown", function(e){
    if(e.key === "Escape") cerrarCarritoLateral();
});

if(btnAbrirCarrito){
    btnAbrirCarrito.addEventListener("click", function(e){
        e.preventDefault();
        abrirCarritoLateral();
    });
}

linksAbrirCarrito.forEach(function(link){
    link.addEventListener("click", function(e){
        e.preventDefault();
        abrirCarritoLateral();
    });
});

function cargarCarritoLateral(abrirAlTerminar){
    fetch("guardar.php?accion=listar_carrito")
        .then(function(res){ return res.json(); })
        .then(function(datos){
            const items = datos.items || [];
            actualizarContadores(items.length);

            if(abrirAlTerminar){
                animarBadges();
                abrirCarritoLateral();
            }

            if(!listaCarritoLateral) return;
            listaCarritoLateral.innerHTML = "";

            if(items.length === 0){
                listaCarritoLateral.innerHTML = '<p class="carrito-vacio">El carrito esta vacio.</p>';
                if(totalPagarLateral) totalPagarLateral.textContent = "$0";
                return;
            }

            let total = 0;
            items.forEach(function(item){
                const nombre = item.producto_nombre || item.nombre_producto || "Producto";
                const imagen = item.producto_imagen || item.foto_producto || "Imagenes/hero_monopatin.jpg";
                const categoria = item.categoria_nombre || item.nombre_categoria || "Monopatines";
                const rawPrecio = item.producto_precio !== undefined ? item.producto_precio : (item.precio_unitario !== undefined ? item.precio_unitario : 0);
                const precio = parseFloat(rawPrecio) || 0;
                total += precio;

                const divItem = document.createElement("div");
                divItem.classList.add("item-lateral");
                divItem.innerHTML = `
                    <img src="${imagen}" alt="${nombre}">
                    <div class="item-lateral-info">
                        <h4>${nombre}</h4>
                        <span class="cat">${categoria}</span>
                        <p class="precio">$${precio.toLocaleString("es-AR")}</p>
                    </div>
                    <button class="btn-eliminar-lateral" data-id="${item.carrito_id}" title="Eliminar">&times;</button>
                `;

                const btnBorrar = divItem.querySelector(".btn-eliminar-lateral");
                btnBorrar.addEventListener("click", function(){
                    const idParaBorrar = btnBorrar.dataset.id;
                    const fd = new FormData();
                    fd.append("accion", "eliminar_item");
                    fd.append("carrito_id", idParaBorrar);

                    fetch("guardar.php", {
                        method: "POST",
                        body: fd
                    })
                    .then(function(){
                        cargarCarritoLateral(false);
                    });
                });

                listaCarritoLateral.appendChild(divItem);
            });

            if(totalPagarLateral){
                totalPagarLateral.textContent = "$" + total.toLocaleString("es-AR");
            }
        })
        .catch(function(err){
            console.log("No se pudo cargar el carrito", err);
        });
}

// Vaciar carrito desde el panel lateral
if(btnVaciarLateral){
    btnVaciarLateral.addEventListener("click", function(){
        Swal.fire({
            title: "¿Vaciar carrito?",
            text: "Se eliminaran todos los productos agregados.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Si, vaciar",
            cancelButtonText: "Cancelar"
        }).then(function(result){
            if(result.isConfirmed){
                const fd = new FormData();
                fd.append("accion", "vaciar_carrito");
                fetch("guardar.php", {
                    method: "POST",
                    body: fd
                })
                .then(function(){
                    cargarCarritoLateral(false);
                    Swal.fire("Vaciado", "El carrito esta vacio.", "success");
                });
            }
        });
    });
}

// Finalizar compra desde el panel lateral
if(btnFinalizarLateral){
    btnFinalizarLateral.addEventListener("click", function(){
        Swal.fire({
            title: "¡Pedido confirmado!",
            text: "Gracias por tu compra en Monopatines Ruli. En breve nos contactaremos para la entrega.",
            icon: "success",
            confirmButtonText: "Aceptar"
        });
    });
}

// Cargar el estado inicial del carrito al abrir la pagina
cargarCarritoLateral(false);
