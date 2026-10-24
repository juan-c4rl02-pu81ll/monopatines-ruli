// alternador de tema con persistencia en localStorage
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

// submenu escritorio
const submenu = document.querySelector("#submenu");
const submenuTrigger = document.querySelector("#submenu-trigger");
const submenuItem = document.querySelector("#submenu-Item");

if(submenuTrigger && submenu){
    submenuTrigger.addEventListener("click", function(e){
        e.preventDefault();
        submenu.classList.toggle("active");
    });

    submenuItem.addEventListener("mouseleave", function(){
        submenu.classList.remove("active");
    });
}

// menu hamburguesa
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

if(btnSubmenuMovil){
    btnSubmenuMovil.addEventListener("click", function(event){
        event.preventDefault();
        submenu2.classList.toggle("activo");
    });
}

document.addEventListener("click", function(event){
    if(!navMovil.contains(event.target) && !btnHamburguesa.contains(event.target)){
        cerrarMenuMovil();
    }
});

const enlacesMovil = navMovil.querySelectorAll("a");
enlacesMovil.forEach(function(enlace){
    if(enlace.id !== "btn-submenuMovil"){
        enlace.addEventListener("click", function(){
            cerrarMenuMovil();
        });
    }
});

// elementos del carrito
const listadoProductos = document.querySelector("#listadoProductos");
const totalPagar = document.querySelector("#totalPagar");
const cantidadItems = document.querySelector("#cantidadItems");
const btnVaciar = document.querySelector("#btnVaciar");
const btnFinalizar = document.querySelector("#btnFinalizar");

// cargar y renderizar productos desde MySQL con inner join
function cargaryRenderizar(){
    listadoProductos.innerHTML = "<p>Cargando carrito...</p>";

    fetch("guardar.php?accion=listar_carrito")
        .then(function(res){
            return res.json();
        })
        .then(function(data){
            listadoProductos.innerHTML = "";

            if(!data.items || data.items.length === 0){
                listadoProductos.innerHTML = "<p class='carrito-vacio'>El carrito esta vacio. <a href='index.html#catalogo'>Ver productos</a></p>";
                cantidadItems.textContent = "0";
                totalPagar.textContent = "$0.00";
                return;
            }

            data.items.forEach(function(item){
                agregarProductoAlDom(item);
            });

            cantidadItems.textContent = data.totales.cantidad_total;
            totalPagar.textContent = "$" + parseFloat(data.totales.total_pagar).toFixed(2);
        })
        .catch(function(){
            listadoProductos.innerHTML = "<p>Error al cargar el carrito de la base de datos.</p>";
        });
}

// crear tarjeta en el dom
function agregarProductoAlDom(item){
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("item-carrito");

    tarjeta.innerHTML = `
        <img src="${item.producto_imagen}" alt="${item.producto_nombre}">
        <div class="item-info">
            <h3>${item.producto_nombre}</h3>
            <span class="badge-cat">${item.categoria_nombre}</span>
            <p class="precio">$${parseFloat(item.producto_precio).toFixed(2)}</p>
        </div>
        <button class="btn-eliminar">Eliminar</button>
    `;

    // eliminar producto especifico de la tabla MySQL
    const btnEliminar = tarjeta.querySelector(".btn-eliminar");
    btnEliminar.addEventListener("click", function(){
        const datos = new FormData();
        datos.append("accion", "eliminar_item");
        datos.append("carrito_id", item.carrito_id);

        fetch("guardar.php", {
            method: "POST",
            body: datos
        })
        .then(function(res){ return res.text(); })
        .then(function(resp){
            if(resp.trim() === "ok"){
                Swal.fire({
                    title: "Eliminado",
                    text: item.producto_nombre + " fue eliminado del carrito.",
                    icon: "success",
                    confirmButtonText: "Aceptar"
                });
                cargaryRenderizar();
            } else {
                Swal.fire("Error", "No se pudo eliminar el producto", "error");
            }
        });
    });

    listadoProductos.appendChild(tarjeta);
}

// vaciar carrito completo con delete en MySQL
btnVaciar.addEventListener("click", function(){
    if(cantidadItems.textContent === "0") return;

    Swal.fire({
        title: "Estas seguro de borrar",
        text: "Se borraran todos los productos cargados.",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Si, vaciar",
        cancelButtonText: "Cancelar"
    }).then(function(result){
        if(result.isConfirmed){
            const datos = new FormData();
            datos.append("accion", "vaciar_carrito");

            fetch("guardar.php", {
                method: "POST",
                body: datos
            })
            .then(function(res){ return res.text(); })
            .then(function(resp){
                if(resp.trim() === "ok"){
                    Swal.fire("Vaciado", "La lista se ha vaciado.", "success");
                    cargaryRenderizar();
                }
            });
        }
    });
});

// boton de finalizar compra
btnFinalizar.addEventListener("click", function(){
    if(cantidadItems.textContent === "0"){
        Swal.fire("Carrito vacio", "Agrega productos antes de finalizar la compra", "info");
        return;
    }

    Swal.fire({
        title: "Gracias por tu compra",
        text: "Nos contactaremos por WhatsApp o correo para coordinar la entrega.",
        icon: "success",
        confirmButtonText: "Excelente"
    });
});

// iniciar carga del carrito al abrir la pagina
cargaryRenderizar();
