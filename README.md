# 🛴 Monopatines Ruli

Sitio web comercial para **Monopatines Ruli**, tienda especializada en movilidad urbana: monopatines eléctricos, accesorios de seguridad y repuestos. Incluye catálogo interactivo en grilla con filtros, carrito de compras lateral deslizante, modo claro/oscuro persistente y formulario de consultas conectado a base de datos MySQL con relaciones foráneas.

**Trabajo Integrador 2026 – Desarrollo Web Full Stack**  
Temática unificada: *Sitio web para un comercio o emprendimiento* (Rubro: Movilidad Urbana / Retail y Servicios).

- **Sitio publicado:** [http://monopatinesruli.rf.gd](http://monopatinesruli.rf.gd)
- **Hosting:** InfinityFree (Apache, PHP 8.2 y MySQL).

---

## 🎯 Objetivo del Proyecto

Diseñar y desarrollar un sitio web responsive, interactivo y funcional integrando:
1. **HTML5 semántico** con jerarquía clara de secciones.
2. **CSS3 avanzado** con CSS Grid para la estructura global, Flexbox para componentes, modo claro/oscuro y diseño responsive adaptable a móviles, tablets y escritorio.
3. **JavaScript moderno** para manipulación del DOM, eventos, animaciones fluidas, filtros interactivos y persistencia con `localStorage`.
4. **Base de Datos MySQL (`final_web`)** con al menos 2 tablas relacionadas mediante `PRIMARY KEY` y `FOREIGN KEY`, manejando operaciones de `INSERT` y `SELECT` con `INNER JOIN`.

---

## 🚀 Funcionalidades

- **Navegación y Header:**
  - Logo con isotipo estilizado enlazado al inicio.
  - Menú de navegación con submenú desplegable anidado (*Productos → Monopatines / Accesorios / Repuestos*).
  - Menú hamburguesa responsive para pantallas móviles con animación de apertura.
  - Botón de alternador de tema (Modo claro / Modo oscuro) con persistencia en `localStorage`.

- **Catálogo y Filtros:**
  - Grilla responsiva maquetada con CSS Grid con tarjetas de producto (imagen, nombre, descripción, precio y categoría).
  - Filtro interactivo en JavaScript para alternar entre categorías (*Todos*, *Monopatines*, *Accesorios*, *Repuestos*).

- **Carrito de Compras Lateral Deslizante (Offcanvas):**
  - Panel lateral deslizante que se despliega sobre el catálogo sin recargar ni salir de la página principal.
  - Contador numérico (badge) en el header y barra de navegación que se actualiza en tiempo real con animación de pulso (`@keyframes popBadge`) al agregar ítems.
  - Sincronización directa con MySQL (`guardar.php?accion=listar_carrito`).
  - Eliminación de ítems individuales y vaciado total con confirmación mediante **SweetAlert2**.
  - Vista complementaria en pantalla completa disponible en `carrito.html`.

- **Formulario de Contacto y Clave Foránea:**
  - Campos: Nombre, Email, Producto de Interés (selector agrupado por categoría) y Mensaje.
  - Validación en front-end (campos obligatorios y formato de email).
  - Envío asíncrono con `XMLHttpRequest` / `FormData`.
  - Alertas visuales con **SweetAlert2** ante éxito o campos incompletos.
  - Guardado en la tabla `contactos` vinculando el `producto_id` como clave foránea a la tabla `productos`.

- **Panel de Visualización SQL (Extra Opcional - Punto 5 de la Consigna):**
  - Página `ver_contactos.php` que consulta en vivo las consultas registradas en la base de datos ejecutando un doble `INNER JOIN` entre `contactos`, `productos` y `categorias`.

- **Aside Funcional:**
  - Panel lateral con horarios de atención, promociones destacadas, redes sociales y ubicación física oficial (*Echeverria  N° 549-1Piso*).

---

## 🛠️ Tecnologías Utilizadas

| Capa | Tecnología | Detalle |
|---|---|---|
| **Estructura** | HTML5 Semántico | `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>` |
| **Estilos** | CSS3 | CSS Grid, Flexbox, Media Queries, variables `:root`, animaciones `@keyframes` |
| **Interactividad** | JavaScript (ES6) | DOM, `addEventListener`, `classList.toggle()`, `localStorage`, `fetch` y `XMLHttpRequest` |
| **Alertas** | SweetAlert2 | Modales interactivos de confirmación, éxito y error (vía CDN) |
| **Backend** | PHP 8 | API REST simple, consultas preparadas (`prepare` / `bind_param`) y conexión MySQLi |
| **Base de Datos** | MySQL / MariaDB | Base `final_web` con motor InnoDB, claves foráneas y consultas relacionales |
| **Hosting** | InfinityFree | Servidor Apache, PHP y MySQL remoto |

---

## 🗄️ Modelo de Base de Datos (`final_web`)

El diseño de la base de datos se encuentra estructurado en el archivo `sql/final_web.sql`:

```
categorias (1) <────── (N) productos (1) <────── (N) contactos
                                 │
                                 └────────────── (N) carrito
```

### Tablas y Relaciones:

1. **`categorias`**: Identificador (`id` PK) y nombre de la categoría (`Monopatines`, `Accesorios`, `Repuestos`).
2. **`productos`**: Catálogo de 15 productos con su precio, descripción, ruta de imagen y `categoria_id` (`FOREIGN KEY` hacia `categorias.id`).
3. **`contactos`**: Consultas enviadas desde el formulario. Incluye `producto_id` como `FOREIGN KEY` referenciando a `productos.id` (`ON UPDATE CASCADE ON DELETE RESTRICT`).
4. **`carrito`**: Ítems agregados por los usuarios con `producto_id` (`FOREIGN KEY` hacia `productos.id` con `ON DELETE CASCADE`).

### Consultas SQL Destacadas:

- **`INSERT` con Sentencias Preparadas:**
  ```sql
  INSERT INTO contactos (nombre, email, producto_id, mensaje) VALUES (?, ?, ?, ?);
  ```

- **`SELECT` con doble `INNER JOIN` y Alias (`AS`):**
  ```sql
  SELECT c.id, c.nombre, c.email, p.nombre AS producto, p.precio, cat.nombre AS categoria, c.mensaje, c.fecha
  FROM contactos AS c
  INNER JOIN productos AS p ON p.id = c.producto_id
  INNER JOIN categorias AS cat ON cat.id = p.categoria_id
  ORDER BY c.fecha DESC, c.id DESC;
  ```

- **`SELECT` de Carrito con `INNER JOIN` y Subconsulta Anidada:**
  ```sql
  SELECT c.id AS carrito_id, p.nombre AS nombre_producto, p.precio AS precio_unitario,
         cat.nombre AS nombre_categoria,
         (SELECT COUNT(*) FROM productos) AS total_catalogo
  FROM carrito AS c
  INNER JOIN productos AS p ON p.id = c.producto_id
  INNER JOIN categorias AS cat ON cat.id = p.categoria_id;
  ```

---

## 📁 Estructura del Repositorio

```
TP Final/
├── index.html                   # Página principal (catálogo, hero, formulario, carrito lateral)
├── carrito.html                 # Vista del carrito en pantalla completa
├── ver_contactos.php            # Panel web de visualización de consultas (SELECT INNER JOIN)
├── guardar.php                  # Backend para operaciones de carrito y contactos (MySQLi)
├── guardar_hosting.php          # Configuración de respaldo para hosting
├── README.md                    # Documentación técnica del proyecto
├── Css/
│   └── style.css                # Estilos globales, variables CSS, temas, responsive y animaciones
├── Javascript/
│   ├── script.js                # Lógica de index (filtros, slider lateral, validaciones, tema)
│   └── carrito.js               # Lógica de la vista completa de carrito
├── Imagenes/                    # Logo e imágenes del catálogo
│   ├── logo.png
│   ├── logo.svg
│   └── *.jpg
└── sql/
    ├── crear_base_local.sql     # Creación de base final_web para XAMPP local
    └── final_web.sql            # Script de importación completo (tablas, FKs, datos y consultas)
```

---

## 💻 Instalación y Ejecución Local

1. **Clonar o descargar el proyecto:**
   Colocar la carpeta dentro del directorio `htdocs` de XAMPP:
   ```bash
   C:\xampp\htdocs\monopatinesruli\
   ```
2. **Iniciar servicios:**
   Abrir el panel de control de XAMPP e iniciar **Apache** y **MySQL**.
3. **Importar la base de datos:**
   - Abrir phpMyAdmin en `http://localhost/phpmyadmin/`.
   - Ejecutar el script `sql/crear_base_local.sql` para crear la base `final_web`.
   - Seleccionar la base `final_web` e importar el archivo `sql/final_web.sql`.
4. **Abrir en el navegador:**
   Navegar a: `http://localhost/monopatinesruli/`

---

## 🌐 Despliegue en InfinityFree

1. Crear la base de datos desde el panel de control de InfinityFree con el nombre `final_web` (quedará como `if0_XXXXXXXX_final_web`).
2. Entrar a phpMyAdmin desde el hosting e importar `sql/final_web.sql`.
3. Subir los archivos del proyecto dentro del directorio `/htdocs/` utilizando el Administrador de Archivos o un cliente FTP.
4. El archivo `guardar.php` y `ver_contactos.php` detectan automáticamente si se ejecutan en entorno local o remoto.
