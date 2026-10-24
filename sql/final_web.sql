-- =====================================================================
-- Monopatines Ruli - Trabajo Integrador 2026
-- Base de datos: final_web
-- Tablas relacionadas:
--   categorias (1) <--- (N) productos (1) <--- (N) contactos
--   productos (1)  <--- (N) carrito
--
-- Como importarlo (phpMyAdmin):
--   1. Seleccionar la base de datos:
--      - Local: final_web (creada previamente con crear_base_local.sql)
--      - InfinityFree: la base creada desde el panel (ej: if0_XXXXXXXX_final_web)
--   2. Ir a la pestana "Importar", seleccionar este archivo y presionar "Continuar".
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) TABLA categorias (PRIMARY KEY: id)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2) TABLA productos (PRIMARY KEY: id / FOREIGN KEY: categoria_id)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS productos (
    id INT NOT NULL AUTO_INCREMENT,
    categoria_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(200) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    imagen VARCHAR(150) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_productos_categoria
        FOREIGN KEY (categoria_id) REFERENCES categorias (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3) TABLA contactos (PRIMARY KEY: id / FOREIGN KEY: producto_id)
--    Relaciona las consultas del formulario con el producto de interes.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contactos (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    producto_id INT NOT NULL,
    mensaje TEXT NOT NULL,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_contactos_producto
        FOREIGN KEY (producto_id) REFERENCES productos (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4) TABLA carrito (PRIMARY KEY: id / FOREIGN KEY: producto_id)
--    Maneja los items agregados al carrito de compras desde el frontend.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS carrito (
    id INT NOT NULL AUTO_INCREMENT,
    producto_id INT NOT NULL,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_carrito_producto
        FOREIGN KEY (producto_id) REFERENCES productos (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5) DATOS INICIALES: Categorias
-- ---------------------------------------------------------------------
INSERT IGNORE INTO categorias (id, nombre) VALUES
(1, 'Monopatines'),
(2, 'Accesorios'),
(3, 'Repuestos');

-- ---------------------------------------------------------------------
-- 6) DATOS INICIALES: Catalogo de 15 productos
-- ---------------------------------------------------------------------
INSERT IGNORE INTO productos (id, categoria_id, nombre, descripcion, precio, imagen) VALUES
(1, 1, 'Monopatin Urban', 'Plegable, ideal para la ciudad', 15000.00, 'Imagenes/monopatin_urban.jpg'),
(2, 1, 'Monopatin Pro', 'Reforzado para uso diario', 22000.00, 'Imagenes/monopatin_pro.jpg'),
(3, 1, 'Monopatin Kids', 'Liviano y seguro para chicos', 12000.00, 'Imagenes/monopatin_kids.jpg'),
(4, 1, 'Monopatin Street', 'Tabla ancha para trucos', 18500.00, 'Imagenes/monopatin_street.jpg'),
(5, 1, 'Monopatin Electric', 'Motor 250W y bateria recargable', 48000.00, 'Imagenes/monopatin_electric.jpg'),
(6, 2, 'Casco de seguridad', 'Con certificacion y talle regulable', 4500.00, 'Imagenes/casco.jpg'),
(7, 2, 'Casco Full Face', 'Proteccion completa para saltos', 7800.00, 'Imagenes/casco_full.jpg'),
(8, 2, 'Rodilleras y coderas', 'Set de proteccion para principiantes', 3200.00, 'Imagenes/rodilleras.jpg'),
(9, 2, 'Guantes de proteccion', 'Reforzados en palma y nudillos', 2500.00, 'Imagenes/guantes.jpg'),
(10, 2, 'Luces LED', 'Kit para ruedas, uso nocturno', 1900.00, 'Imagenes/luces_led.jpg'),
(11, 2, 'Bolso de transporte', 'Correa ajustable para colgar', 3800.00, 'Imagenes/bolso.jpg'),
(12, 3, 'Ruedas de repuesto', 'Par de ruedas de poliuretano', 1800.00, 'Imagenes/ruedas.jpg'),
(13, 3, 'Frenos de disco', 'Repuesto para modelo Pro', 2600.00, 'Imagenes/frenos.jpg'),
(14, 3, 'Grip antideslizante', 'Lija autoadhesiva para la tabla', 1200.00, 'Imagenes/grip.jpg'),
(15, 3, 'Kit de herramientas', 'Llaves y destornilladores', 2900.00, 'Imagenes/herramientas.jpg');

-- ---------------------------------------------------------------------
-- 7) CONSULTAS SQL USADAS POR EL SITIO (INSERT / SELECT / JOINS / SUBQUERIES)
-- ---------------------------------------------------------------------

-- a) SELECT de contactos con el nombre del producto relacionado (INNER JOIN)
SELECT c.id,
       c.nombre,
       c.email,
       p.nombre AS producto,
       p.precio,
       c.mensaje,
       c.fecha
FROM contactos AS c
INNER JOIN productos AS p ON p.id = c.producto_id
ORDER BY c.fecha DESC, c.id DESC;

-- b) SELECT del carrito uniendo 3 tablas y subconsulta anidada
SELECT c.id AS carrito_id,
       c.fecha AS fecha_agregado,
       p.id AS producto_id,
       p.nombre AS nombre_producto,
       p.precio AS precio_unitario,
       p.imagen AS foto_producto,
       cat.nombre AS nombre_categoria,
       (SELECT COUNT(*) FROM productos) AS total_catalogo
FROM carrito AS c
INNER JOIN productos AS p ON p.id = c.producto_id
INNER JOIN categorias AS cat ON cat.id = p.categoria_id
ORDER BY c.fecha DESC;

-- c) Busqueda con LIKE sobre productos y categorias
SELECT p.id,
       p.nombre AS producto,
       p.descripcion,
       p.precio,
       cat.nombre AS categoria
FROM productos AS p
INNER JOIN categorias AS cat ON cat.id = p.categoria_id
WHERE p.nombre LIKE '%monopatin%' OR p.descripcion LIKE '%ciudad%';
