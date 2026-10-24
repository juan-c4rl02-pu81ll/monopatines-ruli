<?php
// Monopatines Ruli - Panel de visualizacion de consultas (Punto 5 del Instructivo: Extra Opcional)
// Muestra con SELECT y doble INNER JOIN los datos guardados en MySQL.

// deshabilitar reportes estrictos de mysqli en PHP 8.1+ para evitar Error 500
mysqli_report(MYSQLI_REPORT_OFF);

// conexion a MySQL (detecta automaticamente si esta en local o en InfinityFree)
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

$contactos = [];
$error = "";

try {
    $conexion = @new mysqli($servidor, $usuario, $password, $baseDeseada);

    if($conexion->connect_errno){
        $conexion = @new mysqli($servidor, $usuario, $password);
        if($conexion->connect_errno){
            $error = "No se pudo conectar a MySQL (" . $conexion->connect_error . ").";
        } else {
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
                $error = "Todavia no se creo la base de datos en cPanel -> MySQL Databases. Crea 'final_web'.";
            }
        }
    }
} catch (Throwable $e) {
    $error = "Error: " . $e->getMessage();
}

if($error === ""){
    $consulta = "SELECT c.id,
                        c.nombre,
                        c.email,
                        p.nombre AS producto,
                        p.precio,
                        cat.nombre AS categoria,
                        c.mensaje,
                        c.fecha
                 FROM contactos AS c
                 INNER JOIN productos AS p ON p.id = c.producto_id
                 INNER JOIN categorias AS cat ON cat.id = p.categoria_id
                 ORDER BY c.fecha DESC, c.id DESC";

    $resultado = $conexion->query($consulta);
    if($resultado){
        while($fila = $resultado->fetch_assoc()){
            $contactos[] = $fila;
        }
    } else {
        $error = "Todavia no hay tablas creadas en la base de datos.";
    }
    $conexion->close();
}

function e($texto){
    return htmlspecialchars($texto ?? "", ENT_QUOTES, "UTF-8");
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Consultas Recibidas - Monopatines Ruli</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="Css/style.css">
    <style>
        .seccion-panel{
            padding: 30px 16px;
            max-width: 1000px;
            margin: 0 auto;
        }
        .tabla-contenedor{
            overflow-x: auto;
            margin-top: 20px;
            background: var(--caja);
            border: 1px solid var(--borde);
            border-radius: 12px;
            box-shadow: var(--sombra);
        }
        .tabla-contactos{
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
            text-align: left;
        }
        .tabla-contactos th{
            background: var(--menu);
            color: var(--texto);
            padding: 12px 14px;
            border-bottom: 2px solid var(--borde);
            font-weight: 600;
        }
        .tabla-contactos td{
            padding: 12px 14px;
            border-bottom: 1px solid var(--borde);
            color: var(--texto);
        }
        .tabla-contactos tr:hover{
            background: var(--fondo);
        }
        .badge{
            display: inline-block;
            padding: 3px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: bold;
            background: #e0e7ff;
            color: #3730a3;
        }
        body.dark-mode .badge{
            background: #1e293b;
            color: #93c5fd;
        }
        .vacio{
            text-align: center;
            padding: 40px;
            color: var(--texto-secundario);
        }
    </style>
</head>
<body>

<div class="contenedor">
    <header id="inicio">
        <a href="index.html" class="logo">
            <img src="Imagenes/logo.png" alt="Logo Monopatines Ruli">
            <h1>Monopatines Ruli</h1>
        </a>

        <nav class="nav-menu">
            <ul>
                <li><a href="index.html#inicio">Inicio</a></li>
                <li><a href="index.html#catalogo">Productos</a></li>
                <li><a href="index.html#contacto">Contacto</a></li>
                <li><a href="carrito.html">Carrito</a></li>
                <li><a href="ver_contactos.php" class="activo">Panel SQL</a></li>
            </ul>
        </nav>

        <div class="header-acciones">
            <div class="tema">
                <button id="btnTema">Cambiar Tema</button>
            </div>
        </div>
    </header>

    <main class="seccion-panel">
        <h2>Consultas guardadas en MySQL (final_web)</h2>
        <p style="color: var(--texto-secundario); margin-top: 6px;">Visualizaci&oacute;n con doble INNER JOIN entre <code>contactos</code>, <code>productos</code> y <code>categorias</code>.</p>

        <?php if($error != ""): ?>
            <div style="background: #fee2e2; color: #991b1b; padding: 14px; border-radius: 8px; margin-top: 15px;">
                <strong>Aviso:</strong> <?= e($error) ?>
            </div>
        <?php endif; ?>

        <div class="tabla-contenedor">
            <?php if(count($contactos) > 0): ?>
                <table class="tabla-contactos">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Fecha</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Producto de inter&eacute;s</th>
                            <th>Categor&iacute;a</th>
                            <th>Mensaje</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach($contactos as $c): ?>
                            <tr>
                                <td><strong>#<?= e($c["id"]) ?></strong></td>
                                <td><?= e($c["fecha"]) ?></td>
                                <td><?= e($c["nombre"]) ?></td>
                                <td><a href="mailto:<?= e($c["email"]) ?>" style="color: var(--primario);"><?= e($c["email"]) ?></a></td>
                                <td><strong><?= e($c["producto"]) ?></strong> ($<?= number_format($c["precio"], 0, ',', '.') ?>)</td>
                                <td><span class="badge"><?= e($c["categoria"]) ?></span></td>
                                <td><?= nl2br(e($c["mensaje"])) ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <div class="vacio">
                    <p>Todav&iacute;a no hay consultas guardadas en la tabla <code>contactos</code>.</p>
                    <p style="margin-top: 8px;"><a href="index.html#contacto" style="color: var(--primario); font-weight: bold;">Completar el formulario de contacto</a></p>
                </div>
            <?php endif; ?>
        </div>
    </main>

    <footer>
        <p class="footer-info">&copy; 2026 Monopatines Ruli - Trabajo Integrador Full Stack</p>
    </footer>
</div>

<script>
    const btnTema = document.querySelector("#btnTema");
    const temaGuardado = localStorage.getItem("tema");
    if(temaGuardado === "oscuro"){
        document.body.classList.add("dark-mode");
        if(btnTema) btnTema.textContent = "Modo claro";
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
</script>
</body>
</html>
