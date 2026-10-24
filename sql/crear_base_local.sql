-- =====================================================================
-- Monopatines Ruli - Creacion de la base final_web (SOLO ENTORNO LOCAL)
-- Ejecutar una vez en el MySQL local (XAMPP / phpMyAdmin local) y despues
-- importar final_web.sql dentro de la base creada.
--
-- En InfinityFree NO se ejecuta este archivo: la base se crea desde el panel
-- de control (MySQL Databases) y el hosting le agrega el prefijo de la cuenta.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS final_web
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
