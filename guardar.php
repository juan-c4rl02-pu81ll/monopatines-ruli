<?php
// deshabilitar reportes estrictos de mysqli en PHP 8.1+ para evitar Error 500
mysqli_report(MYSQLI_REPORT_OFF);

// conexion a la base de datos (detecta automaticamente local o InfinityFree)
$esLocal = (!isset($_SERVER['HTTP_HOST']) || $_SERVER['HTTP_HOST'] === 'localhost' || $_SERVER['HTTP_HOST'] === '127.0.0.1' || strpos($_SERVER['HTTP_HOST'], 'localhost') !== false);

if($esLocal){
    $servidor = "localhost";
    $usuario  = "root";
    $password = "";
    $baseDeseada = "final_web";
} else {
    $servidor = "sql202.infinityfree.com";
    $usuario  = "if0_43249002";
    $password = "e5ONtykqSe1d";
    $baseDeseada = "if0_43249002_final_web";
}

try {
    // 1. Intentar conectar directo con la base
    $conexion = @new mysqli($servidor, $usuario, $password, $baseDeseada);

    // 2. Si fallo, conectar al servidor sin base para detectar que base existe
    if($conexion->connect_errno){
        $conexion = @new mysqli($servidor, $usuario, $password);
        if($conexion->connect_errno){
            echo "ERROR_CONEXION: " . $conexion->connect_error;
            exit;
        }

        $resBases = $conexion->query("SHOW DATABASES");
        $baseEncontrada = "";
        if($resBases){
            while($b = $resBases->fetch_row()){
                $nombreBD = $b[0];
                if($nombreBD === $baseDeseada){
                    $baseEncontrada = $nombreBD;
                    break;
                }
                if(strpos($nombreBD, $usuario) === 0){
                    $baseEncontrada = $nombreBD;
                }
            }
        }

        if($baseEncontrada !== ""){
            $conexion->select_db($baseEncontrada);
        } else {
            if($esLocal){
                $conexion->query("CREATE DATABASE IF NOT EXISTS final_web");
                $conexion->select_db("final_web");
            } else {
                echo "ERROR_BD: No se encontro la base de datos en InfinityFree. Por favor entra a cPanel -> MySQL Databases y hace clic en '+ Create Database' con el nombre 'final_web'.";
                exit;
            }
        }
    }
} catch (Throwable $e) {
    echo "ERROR_FATAL: " . $e->getMessage();
    exit;
}

// 1) categorias (primero para que las demas puedan referenciarla)
$conexion->query("CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

// 2) productos (depende de categorias)
$conexion->query("CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(200),
    precio DECIMAL(10,2) NOT NULL,
    imagen VARCHAR(150),
    categoria_id INT NOT NULL,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

// 3) contactos (depende de productos con clave foranea)
$conexion->query("CREATE TABLE IF NOT EXISTS contactos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    producto_id INT NOT NULL,
    mensaje TEXT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

// por si la tabla venia de una version anterior sin producto_id
$checkCol = $conexion->query("SHOW COLUMNS FROM contactos LIKE 'producto_id'");
if($checkCol && $checkCol->num_rows == 0){
    $conexion->query("ALTER TABLE contactos ADD COLUMN producto_id INT NOT NULL DEFAULT 1 AFTER email");
}

// 4) carrito (depende de productos con clave foranea)
$conexion->query("CREATE TABLE IF NOT EXISTS carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

// cargar categorias iniciales si esta vacia
$resultado = $conexion->query("SELECT COUNT(*) AS total FROM categorias");
if($resultado){
    $fila = $resultado->fetch_assoc();
    if($fila && $fila["total"] == 0){
        $conexion->query("INSERT IGNORE INTO categorias (id, nombre) VALUES (1, 'Monopatines'), (2, 'Accesorios'), (3, 'Repuestos')");
    }
}

// cargar productos iniciales si esta vacia
$resProd = $conexion->query("SELECT COUNT(*) AS total FROM productos");
if($resProd){
    $filaP = $resProd->fetch_assoc();
    if($filaP && $filaP["total"] == 0){
        $conexion->query("INSERT IGNORE INTO productos (id, categoria_id, nombre, descripcion, precio, imagen) VALUES
            (1, 1, 'Monopatin Urban', 'Plegable, ideal para la ciudad', 15000, 'Imagenes/monopatin_urban.jpg'),
            (2, 1, 'Monopatin Pro', 'Reforzado para uso diario', 22000, 'Imagenes/monopatin_pro.jpg'),
            (3, 1, 'Monopatin Kids', 'Liviano y seguro para chicos', 12000, 'Imagenes/monopatin_kids.jpg'),
            (4, 1, 'Monopatin Street', 'Tabla ancha para trucos', 18500, 'Imagenes/monopatin_street.jpg'),
            (5, 1, 'Monopatin Electric', 'Motor 250W y bateria recargable', 48000, 'Imagenes/monopatin_electric.jpg'),
            (6, 2, 'Casco de seguridad', 'Con certificacion y talle regulable', 4500, 'Imagenes/casco.jpg'),
            (7, 2, 'Casco Full Face', 'Proteccion completa para saltos', 7800, 'Imagenes/casco_full.jpg'),
            (8, 2, 'Rodilleras y coderas', 'Set de proteccion para principiantes', 3200, 'Imagenes/rodilleras.jpg'),
            (9, 2, 'Guantes de proteccion', 'Reforzados en palma y nudillos', 2500, 'Imagenes/guantes.jpg'),
            (10, 2, 'Luces LED', 'Kit para ruedas, uso nocturno', 1900, 'Imagenes/luces_led.jpg'),
            (11, 2, 'Bolso de transporte', 'Correa ajustable para colgar', 3800, 'Imagenes/bolso.jpg'),
            (12, 3, 'Ruedas de repuesto', 'Par de ruedas de poliuretano', 1800, 'Imagenes/ruedas.jpg'),
            (13, 3, 'Frenos de disco', 'Repuesto para modelo Pro', 2600, 'Imagenes/frenos.jpg'),
            (14, 3, 'Grip antideslizante', 'Lija autoadhesiva para la tabla', 1200, 'Imagenes/grip.jpg'),
            (15, 3, 'Kit de herramientas', 'Llaves y destornilladores', 2900, 'Imagenes/herramientas.jpg')");
    }
}

// peticiones GET
if($_SERVER["REQUEST_METHOD"] == "GET"){
    $accion = isset($_GET["accion"]) ? $_GET["accion"] : "";

    // listar carrito con inner join entre 3 tablas y alias AS
    if($accion == "listar_carrito"){
        $sql = "SELECT 
                    c.id AS carrito_id,
                    p.id AS producto_id,
                    p.nombre AS producto_nombre,
                    p.precio AS producto_precio,
                    p.imagen AS producto_imagen,
                    cat.nombre AS categoria_nombre,
                    c.fecha AS fecha_agregado
                FROM carrito c
                INNER JOIN productos p ON c.producto_id = p.id
                INNER JOIN categorias cat ON p.categoria_id = cat.id
                ORDER BY c.id DESC";

        $res = $conexion->query($sql);
        $items = [];
        if($res){
            while($f = $res->fetch_assoc()){
                $items[] = $f;
            }
        }

        // subconsulta anidada con AS para calcular total a pagar
        $sqlTotales = "SELECT 
                           COUNT(*) AS cantidad_total,
                           IFNULL(SUM(p.precio), 0) AS total_pagar,
                           (SELECT COUNT(*) FROM productos) AS total_catalogo
                       FROM carrito c
                       INNER JOIN productos p ON c.producto_id = p.id";

        $resTotales = $conexion->query($sqlTotales);
        $totales = $resTotales ? $resTotales->fetch_assoc() : ["cantidad_total" => 0, "total_pagar" => 0, "total_catalogo" => 0];

        header('Content-Type: application/json');
        echo json_encode(["items" => $items, "totales" => $totales]);
        exit;
    }

    // busqueda de productos con like e inner join
    if($accion == "buscar"){
        $q = isset($_GET["q"]) ? "%".$_GET["q"]."%" : "%";
        $sqlBuscar = "SELECT p.id, p.nombre, p.precio, p.imagen, cat.nombre AS categoria
                      FROM productos p
                      INNER JOIN categorias cat ON p.categoria_id = cat.id
                      WHERE p.nombre LIKE ? OR p.descripcion LIKE ?";
        $stmt = $conexion->prepare($sqlBuscar);
        $stmt->bind_param("ss", $q, $q);
        $stmt->execute();
        $res = $stmt->get_result();
        $lista = [];
        while($f = $res->fetch_assoc()){
            $lista[] = $f;
        }
        header('Content-Type: application/json');
        echo json_encode($lista);
        exit;
    }
}

// peticiones POST
if($_SERVER["REQUEST_METHOD"] == "POST"){
    $accion = isset($_POST["accion"]) ? $_POST["accion"] : "";

    // agregar producto al carrito
    if($accion == "agregar_carrito"){
        $producto_id = intval($_POST["producto_id"]);
        $stmt = $conexion->prepare("INSERT INTO carrito (producto_id) VALUES (?)");
        $stmt->bind_param("i", $producto_id);
        if($stmt->execute()){
            echo "ok";
        } else {
            echo "error";
        }
        exit;
    }

    // eliminar producto del carrito
    if($accion == "eliminar_item"){
        $carrito_id = intval($_POST["carrito_id"]);
        $stmt = $conexion->prepare("DELETE FROM carrito WHERE id = ?");
        $stmt->bind_param("i", $carrito_id);
        if($stmt->execute()){
            echo "ok";
        } else {
            echo "error";
        }
        exit;
    }

    // vaciar todo el carrito
    if($accion == "vaciar_carrito"){
        $conexion->query("DELETE FROM carrito");
        echo "ok";
        exit;
    }

    // formulario de contacto
    if(isset($_POST["nombre"])){
        $nombre = $_POST["nombre"];
        $email = $_POST["email"];
        $producto_id = isset($_POST["producto_id"]) ? intval($_POST["producto_id"]) : (isset($_POST["tipo_consulta"]) ? 1 : 1);
        $mensaje = $_POST["mensaje"];

        $sql = "INSERT INTO contactos (nombre, email, producto_id, mensaje) VALUES (?, ?, ?, ?)";
        $consulta = $conexion->prepare($sql);
        $consulta->bind_param("ssis", $nombre, $email, $producto_id, $mensaje);

        if($consulta->execute()){
            // consulta con INNER JOIN entre contactos y productos
            $listado = $conexion->query("SELECT c.id, c.nombre, c.email, p.nombre AS producto, c.mensaje, c.fecha 
                                         FROM contactos AS c 
                                         INNER JOIN productos AS p ON p.id = c.producto_id 
                                         ORDER BY c.id DESC");
            $html = "<h3>Consultas guardadas</h3>";
            $html .= "<table>";
            $html .= "<tr><th>Nombre</th><th>Email</th><th>Producto</th><th>Mensaje</th><th>Fecha</th></tr>";
            while($fila = $listado->fetch_assoc()){
                $html .= "<tr>";
                $html .= "<td>".htmlspecialchars($fila["nombre"])."</td>";
                $html .= "<td>".htmlspecialchars($fila["email"])."</td>";
                $html .= "<td>".htmlspecialchars($fila["producto"])."</td>";
                $html .= "<td>".htmlspecialchars($fila["mensaje"])."</td>";
                $html .= "<td>".htmlspecialchars($fila["fecha"])."</td>";
                $html .= "</tr>";
            }
            $html .= "</table>";

            echo "ok|".$html;
        } else {
            echo "error";
        }
        exit;
    }
}

$conexion->close();
?>
