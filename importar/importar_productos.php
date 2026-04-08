<?php
// Script para importar productos desde archivos JSON
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';

echo "=== Importación de Productos ===\n\n";

// Verificar si el directorio de datos existe
if (!is_dir('datos')) {
    echo "✗ Error: El directorio 'datos' no existe. Ejecuta primero 'importar_mueblerias.php'\n";
    exit(1);
}

// Buscar archivos JSON completos
$archivos_json = glob('datos/muebleria_*_completo.json');

if (empty($archivos_json)) {
    echo "✗ Error: No se encontraron archivos JSON completos. Ejecuta primero 'importar_mueblerias.php'\n";
    exit(1);
}

$total_productos_importados = 0;
$total_errores = 0;

foreach ($archivos_json as $archivo_json) {
    echo "Procesando archivo: $archivo_json\n";
    
    // Leer y decodificar el archivo JSON
    $json_content = file_get_contents($archivo_json);
    $datos = json_decode($json_content, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo "✗ Error JSON: " . json_last_error_msg() . "\n";
        $total_errores++;
        continue;
    }
    
    // Validar estructura del JSON
    if (!isset($datos['muebleria']['id_muebleria']) || !isset($datos['productos'])) {
        echo "✗ Error: Estructura JSON inválida\n";
        $total_errores++;
        continue;
    }
    
    $id_muebleria = $datos['muebleria']['id_muebleria'];
    $productos = $datos['productos'];
    
    echo "Importando " . count($productos) . " productos para la mueblería $id_muebleria\n";
    
    // Procesar cada producto
    foreach ($productos as $index => $producto_data) {
        try {
            // Verificar si el producto ya existe por SKU
            $sql_check = "SELECT id_producto FROM Productos WHERE sku = ? AND id_muebleria = ?";
            $stmt_check = $conn->prepare($sql_check);
            $stmt_check->execute([$producto_data['sku'], $id_muebleria]);
            $producto_existente = $stmt_check->fetch();
            
            if ($producto_existente) {
                // Actualizar producto existente
                $sql_update = "UPDATE Productos SET 
                    nombre = ?, descripcion = ?, categoria = ?, color = ?, 
                    material = ?, medidas = ?, precio_venta = ?, peso_kg = ?, 
                    volumen_m3 = ?, actualizado_en = CURRENT_TIMESTAMP
                    WHERE id_producto = ?";
                
                $stmt_update = $conn->prepare($sql_update);
                $stmt_update->execute([
                    $producto_data['nombre'],
                    $producto_data['descripcion'],
                    $producto_data['categoria'],
                    $producto_data['color'],
                    $producto_data['material'],
                    $producto_data['medidas'],
                    $producto_data['precio_venta'],
                    $producto_data['peso_kg'],
                    $producto_data['volumen_m3'],
                    $producto_existente['id_producto']
                ]);
                
                $id_producto = $producto_existente['id_producto'];
                echo "  ✓ Producto actualizado: {$producto_data['nombre']} (ID: $id_producto)\n";
            } else {
                // Insertar nuevo producto
                $sql_insert = "INSERT INTO Productos (
                    sku, id_muebleria, nombre, descripcion, categoria, 
                    unidad_medida, color, material, medidas, precio_venta, 
                    peso_kg, volumen_m3, tipo_producto, creado_en, actualizado_en
                ) VALUES (?, ?, ?, ?, ?, 'pieza', ?, ?, ?, ?, ?, 'producto_final', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";
                
                $stmt_insert = $conn->prepare($sql_insert);
                $stmt_insert->execute([
                    $producto_data['sku'],
                    $id_muebleria,
                    $producto_data['nombre'],
                    $producto_data['descripcion'],
                    $producto_data['categoria'],
                    $producto_data['color'],
                    $producto_data['material'],
                    $producto_data['medidas'],
                    $producto_data['precio_venta'],
                    $producto_data['peso_kg'],
                    $producto_data['volumen_m3']
                ]);
                
                $id_producto = $conn->lastInsertId();
                echo "  ✓ Producto creado: {$producto_data['nombre']} (ID: $id_producto)\n";
            }
            
            // Actualizar imagen URL si existe la imagen
            $imagen_path = "imagenes/muebleria_{$id_muebleria}/productos/{$id_producto}.jpg";
            if (file_exists($imagen_path)) {
                $sql_update_image = "UPDATE Productos SET imagen_url = ? WHERE id_producto = ?";
                $stmt_update_image = $conn->prepare($sql_update_image);
                $stmt_update_image->execute([$imagen_path, $id_producto]);
            }
            
            // Actualizar inventario inicial si se especificó
            if (isset($producto_data['stock_inicial'])) {
                // Obtener sucursales de la mueblería
                $sql_sucursales = "SELECT id_sucursal FROM Sucursales WHERE id_muebleria = ? AND activo = 1";
                $stmt_sucursales = $conn->prepare($sql_sucursales);
                $stmt_sucursales->execute([$id_muebleria]);
                $sucursales = $stmt_sucursales->fetchAll();
                
                foreach ($sucursales as $sucursal) {
                    // Verificar si ya existe inventario para este producto en esta sucursal
                    $sql_check_inv = "SELECT id_inventario FROM Inventario WHERE id_producto = ? AND id_sucursal = ?";
                    $stmt_check_inv = $conn->prepare($sql_check_inv);
                    $stmt_check_inv->execute([$id_producto, $sucursal['id_sucursal']]);
                    $inventario_existente = $stmt_check_inv->fetch();
                    
                    if ($inventario_existente) {
                        // Actualizar inventario existente
                        $sql_update_inv = "UPDATE Inventario SET 
                            cantidad = ?, stock_min = ?, stock_max = ?, 
                            ultimo_movimiento = CURRENT_TIMESTAMP
                            WHERE id_inventario = ?";
                        $stmt_update_inv = $conn->prepare($sql_update_inv);
                        $stmt_update_inv->execute([
                            $producto_data['stock_inicial'],
                            max(1, intval($producto_data['stock_inicial'] * 0.2)),
                            max(10, intval($producto_data['stock_inicial'] * 2)),
                            $inventario_existente['id_inventario']
                        ]);
                    } else {
                        // Crear nuevo registro de inventario
                        $sql_insert_inv = "INSERT INTO Inventario (
                            id_sucursal, id_producto, cantidad, reservado, 
                            stock_min, stock_max, ultimo_movimiento
                        ) VALUES (?, ?, ?, 0, ?, ?, CURRENT_TIMESTAMP)";
                        
                        $stmt_insert_inv = $conn->prepare($sql_insert_inv);
                        $stmt_insert_inv->execute([
                            $sucursal['id_sucursal'],
                            $id_producto,
                            $producto_data['stock_inicial'],
                            max(1, intval($producto_data['stock_inicial'] * 0.2)),
                            max(10, intval($producto_data['stock_inicial'] * 2))
                        ]);
                    }
                }
            }
            
            // Guardar características adicionales si existen
            if (isset($producto_data['caracteristicas'])) {
                // Aquí podrías guardar las características en una tabla separada
                // Por ahora, las agregamos a la descripción
                $caracteristicas_text = "\n\nCaracterísticas:\n" . implode("\n", $producto_data['caracteristicas']);
                $sql_update_desc = "UPDATE Productos SET descripcion = CONCAT(descripcion, ?) WHERE id_producto = ?";
                $stmt_update_desc = $conn->prepare($sql_update_desc);
                $stmt_update_desc->execute([$caracteristicas_text, $id_producto]);
            }
            
            $total_productos_importados++;
            
        } catch (Exception $e) {
            echo "  ✗ Error importando producto '{$producto_data['nombre']}': " . $e->getMessage() . "\n";
            $total_errores++;
        }
    }
    
    echo "\n";
}

// Estadísticas finales
echo "=== Resumen de la Importación ===\n";
echo "Total de productos importados: $total_productos_importados\n";
echo "Total de errores: $total_errores\n";

if ($total_productos_importados > 0) {
    echo "\n=== Verificación ===\n";
    
    // Verificar productos en la base de datos
    $sql_total = "SELECT COUNT(*) as total FROM Productos WHERE tipo_producto = 'producto_final'";
    $stmt_total = $conn->query($sql_total);
    $total_db = $stmt_total->fetch()['total'];
    
    echo "Total de productos en la base de datos: $total_db\n";
    
    // Mostrar productos por mueblería
    $sql_por_muebleria = "SELECT m.nombre_negocio, COUNT(p.id_producto) as total 
                          FROM Mueblerias m 
                          LEFT JOIN Productos p ON m.id_muebleria = p.id_muebleria 
                          WHERE p.tipo_producto = 'producto_final' OR p.tipo_producto IS NULL
                          GROUP BY m.id_muebleria, m.nombre_negocio 
                          ORDER BY m.id_muebleria";
    
    $stmt_por_muebleria = $conn->query($sql_por_muebleria);
    echo "\nProductos por mueblería:\n";
    while ($row = $stmt_por_muebleria->fetch()) {
        echo "- {$row['nombre_negocio']}: {$row['total']} productos\n";
    }
    
    // Verificar inventario
    $sql_inventario = "SELECT COUNT(*) as total FROM Inventario WHERE cantidad > 0";
    $stmt_inventario = $conn->query($sql_inventario);
    $total_inventario = $stmt_inventario->fetch()['total'];
    
    echo "\nTotal de registros de inventario con stock: $total_inventario\n";
}

echo "\n=== Siguientes Pasos ===\n";
echo "1. Revisa que las imágenes estén en las rutas correctas\n";
echo "2. Verifica que los precios y el inventario sean correctos\n";
echo "3. Prueba la visualización de productos en el sitio web\n";
echo "4. Ajusta las categorías y características si es necesario\n";

if ($total_errores > 0) {
    echo "\n⚠️  Se encontraron errores durante la importación. Revisa los mensajes arriba.\n";
} else {
    echo "\n✅ ¡Importación completada exitosamente!\n";
}

// Crear un archivo de log
$log_content = [
    'fecha' => date('Y-m-d H:i:s'),
    'total_productos_importados' => $total_productos_importados,
    'total_errores' => $total_errores,
    'archivos_procesados' => $archivos_json
];

file_put_contents('importar/log_importacion_' . date('Y-m-d_H-i-s') . '.json', json_encode($log_content, JSON_PRETTY_PRINT));
echo "\n📄 Log de importación guardado.\n";
?>
