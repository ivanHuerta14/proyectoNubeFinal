<?php
header('Content-Type: application/json');
session_start();

require_once 'config.php';

$action = $_GET['action'] ?? null;

try {
    if ($action === 'read') {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
            exit();
        }

        // Leer canciones de la base de datos
        $search = $_GET['search'] ?? '';
        $sql = "SELECT * FROM canciones WHERE nombre LIKE :search OR autor LIKE :search OR album LIKE :search";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':search', "%$search%", PDO::PARAM_STR);
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($data);
        exit();
    } elseif ($action === 'create') {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
            exit();
        }

        $nombre = $_POST['nombre'] ?? null;
        $autor = $_POST['autor'] ?? null;
        $duracion = $_POST['duracion'] ?? null;
        $album = $_POST['album'] ?? null;

        if (!$nombre || !$autor || !$duracion || !$album) {
            echo json_encode(['status' => 'error', 'message' => 'Todos los campos son obligatorios']);
            exit();
        }

        // Insertar una nueva canción en la base de datos
        $sql = "INSERT INTO canciones (nombre, autor, duracion, album) VALUES (:nombre, :autor, :duracion, :album)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':nombre' => $nombre,
            ':autor' => $autor,
            ':duracion' => $duracion,
            ':album' => $album
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Canción agregada exitosamente']);
        exit();
    } elseif ($action === 'update') {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
            exit();
        }

        $id = $_POST['id'] ?? null;
        $nombre = $_POST['nombre'] ?? null;
        $autor = $_POST['autor'] ?? null;
        $duracion = $_POST['duracion'] ?? null;
        $album = $_POST['album'] ?? null;

        if (!$id || !$nombre || !$autor || !$duracion || !$album) {
            echo json_encode(['status' => 'error', 'message' => 'Todos los campos son obligatorios']);
            exit();
        }

        // Actualizar una canción en la base de datos
        $sql = "UPDATE canciones SET nombre = :nombre, autor = :autor, duracion = :duracion, album = :album WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':nombre' => $nombre,
            ':autor' => $autor,
            ':duracion' => $duracion,
            ':album' => $album,
            ':id' => $id
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Canción actualizada exitosamente']);
        exit();
    } elseif ($action === 'delete') {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
            exit();
        }

        $id = $_POST['id'] ?? null;

        if (!$id) {
            echo json_encode(['status' => 'error', 'message' => 'ID es obligatorio']);
            exit();
        }

        // Eliminar una canción de la base de datos
        $sql = "DELETE FROM canciones WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->execute([':id' => $id]);

        echo json_encode(['status' => 'success', 'message' => 'Canción eliminada exitosamente']);
        exit();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Acción no válida']);
        exit();
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error en la base de datos: ' . $e->getMessage()]);
    exit();
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error: ' . $e->getMessage()]);
    exit();
}
?>
