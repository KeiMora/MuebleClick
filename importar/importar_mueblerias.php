<?php
// Script para importar datos de mueblerías
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';

echo "=== Importación de Datos de Mueblerías ===\n\n";

// Crear directorios necesarios si no existen
$directorios = [
    'imagenes/muebleria_1',
    'imagenes/muebleria_1/productos',
    'imagenes/muebleria_2',
    'imagenes/muebleria_2/productos',
    'imagenes/muebleria_3',
    'imagenes/muebleria_3/productos',
    'datos'
];

foreach ($directorios as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
        echo "✓ Directorio creado: $dir\n";
    }
}

// Datos de ejemplo para las 3 mueblerías
$mueblerias_datos = [
    1 => [
        'nombre_negocio' => 'Muebles Modernos SA de CV',
        'descripcion' => 'Especialistas en muebles de diseño contemporáneo y minimalista',
        'telefono' => '55-1234-5678',
        'email' => 'contacto@mueblesmodernos.com',
        'whatsapp' => '55-9876-5432',
        'facebook' => 'https://facebook.com/mueblesmodernos',
        'instagram' => 'https://instagram.com/mueblesmodernos',
        'horario' => [
            'lunes_viernes' => '9:00-20:00',
            'sabado' => '9:00-18:00',
            'domingo' => '10:00-16:00'
        ],
        'envio_gratis_minimo' => 2000.00,
        'tiempo_entrega' => '3-5 días hábiles',
        'metodos_pago' => ['tarjeta_credito', 'transferencia', 'paypal'],
        'categorias_principales' => ['Salas', 'Recámaras', 'Comedores', 'Oficina']
    ],
    2 => [
        'nombre_negocio' => 'Muebles Clásicos y Tradicionales',
        'descripcion' => 'Artesanía y tradición en cada pieza, muebles que perduran generaciones',
        'telefono' => '33-8765-4321',
        'email' => 'info@mueblesclasicos.com',
        'whatsapp' => '33-2345-6789',
        'facebook' => 'https://facebook.com/mueblesclasicos',
        'instagram' => 'https://instagram.com/mueblesclasicos',
        'horario' => [
            'lunes_viernes' => '9:00-19:00',
            'sabado' => '9:00-17:00',
            'domingo' => '10:00-15:00'
        ],
        'envio_gratis_minimo' => 3000.00,
        'tiempo_entrega' => '5-7 días hábiles',
        'metodos_pago' => ['tarjeta_credito', 'transferencia', 'tienda'],
        'categorias_principales' => ['Comedores', 'Recámaras', 'Sala', 'Decoración']
    ],
    3 => [
        'nombre_negocio' => 'Muebles Rústicos del Bajío',
        'descripcion' => 'Auténticos muebles rústicos hechos con maderas de la región',
        'telefono' => '722-345-6789',
        'email' => 'ventas@mueblesrusticos.com',
        'whatsapp' => '722-456-7890',
        'facebook' => 'https://facebook.com/mueblesrusticos',
        'instagram' => 'https://instagram.com/mueblesrusticos',
        'horario' => [
            'lunes_viernes' => '8:00-19:00',
            'sabado' => '8:00-18:00',
            'domingo' => '9:00-14:00'
        ],
        'envio_gratis_minimo' => 2500.00,
        'tiempo_entrega' => '7-10 días hábiles',
        'metodos_pago' => ['transferencia', 'tienda', 'efectivo'],
        'categorias_principales' => ['Comedores', 'Salas', 'Muebles de Jardín', 'Decoración Rústica']
    ]
];

// Crear archivos JSON con los datos de las mueblerías
foreach ($mueblerias_datos as $id => $datos) {
    $archivo_json = "datos/muebleria_{$id}.json";
    
    // Preparar estructura JSON
    $estructura = [
        'muebleria' => array_merge(['id_muebleria' => $id], $datos),
        'importado_en' => date('Y-m-d H:i:s'),
        'version' => '1.0'
    ];
    
    // Guardar archivo JSON
    file_put_contents($archivo_json, json_encode($estructura, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo "✓ Archivo JSON creado: $archivo_json\n";
}

// Actualizar información adicional en la base de datos
foreach ($mueblerias_datos as $id => $datos) {
    try {
        // Actualizar información de contacto en la tabla Mueblerias
        $sql = "UPDATE Mueblerias SET telefono = ? WHERE id_muebleria = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$datos['telefono'], $id]);
        
        // Actualizar horarios en las sucursales
        $sql = "UPDATE Sucursales SET horario = ? WHERE id_muebleria = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([json_encode($datos['horario']), $id]);
        
        echo "✓ Base de datos actualizada para mueblería $id\n";
        
    } catch (Exception $e) {
        echo "✗ Error actualizando mueblería $id: " . $e->getMessage() . "\n";
    }
}

// Crear archivo de ejemplo de productos para cada mueblería
$productos_ejemplo = [
    1 => [ // Muebles Modernos
        [
            'sku' => 'MM-SOF-001',
            'nombre' => 'Sofá Moderno de 3 Plazas',
            'descripcion' => 'Elegante sofá de diseño contemporáneo con tapizado de alta calidad',
            'categoria' => 'Salas',
            'color' => 'Gris Oscuro',
            'material' => 'Tela Premium',
            'medidas' => '2.20m x 0.90m x 0.85m',
            'precio_venta' => 8999.00,
            'peso_kg' => 45.5,
            'volumen_m3' => 1.68,
            'stock_inicial' => 15,
            'caracteristicas' => [
                'Estructura de madera maciza',
                'Cojines rellenos de espuma de alta densidad',
                'Apoyabrazos acolchados',
                'Patas de metal cromado'
            ]
        ],
        [
            'sku' => 'MM-MES-002',
            'nombre' => 'Mesa de Centro Cristal',
            'descripcion' => 'Moderna mesa de centro con superficie de cristal templado',
            'categoria' => 'Mesas',
            'color' => 'Transparente/Cromo',
            'material' => 'Cristal Templado y Metal',
            'medidas' => '1.20m x 0.60m x 0.45m',
            'precio_venta' => 3499.00,
            'peso_kg' => 25.0,
            'volumen_m3' => 0.32,
            'stock_inicial' => 8,
            'caracteristicas' => [
                'Cristal templado de 10mm',
                'Base de metal cromado',
                'Borde pulido',
                'Fácil limpieza'
            ]
        ]
    ],
    2 => [ // Muebles Clásicos
        [
            'sku' => 'MC-COM-001',
            'nombre' => 'Comedor Clásico 6 Sillas',
            'descripcion' => 'Elegante juego de comedor con detalles tallados a mano',
            'categoria' => 'Comedores',
            'color' => 'Café Oscuro',
            'material' => 'Madera de Caoba',
            'medidas' => 'Mesa: 1.80m x 0.90m x 0.75m, Sillas: 0.45m x 0.50m x 0.95m',
            'precio_venta' => 15999.00,
            'peso_kg' => 120.0,
            'volumen_m3' => 2.5,
            'stock_inicial' => 5,
            'caracteristicas' => [
                'Madera de caoba seleccionada',
                'Tapicería en terciopelo',
                'Detalles tallados a mano',
                'Acabado en laca'
            ]
        ]
    ],
    3 => [ // Muebles Rústicos
        [
            'sku' => 'MR-MES-001',
            'nombre' => 'Mesa Rústica de Pino',
            'descripcion' => 'Auténtica mesa rústica hecha con pino de la región',
            'categoria' => 'Comedores',
            'color' => 'Natural Pino',
            'material' => 'Madera de Pino',
            'medidas' => '2.00m x 1.00m x 0.80m',
            'precio_venta' => 7999.00,
            'peso_kg' => 85.0,
            'volumen_m3' => 1.6,
            'stock_inicial' => 10,
            'caracteristicas' => [
                'Madera de pino maciza',
                'Barniz ecológico',
                'Diseño robusto',
                'Acabado natural'
            ]
        ]
    ]
];

// Crear archivos JSON de productos
foreach ($productos_ejemplo as $id_muebleria => $productos) {
    $estructura_completa = [
        'muebleria' => array_merge(['id_muebleria' => $id_muebleria], $mueblerias_datos[$id_muebleria]),
        'productos' => $productos,
        'importado_en' => date('Y-m-d H:i:s'),
        'version' => '1.0'
    ];
    
    $archivo_json = "datos/muebleria_{$id_muebleria}_completo.json";
    file_put_contents($archivo_json, json_encode($estructura_completa, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo "✓ Archivo JSON completo creado: $archivo_json\n";
}

// Crear script de imágenes placeholder
echo "\n=== Creando imágenes placeholder ===\n";

foreach ([1, 2, 3] as $id_muebleria) {
    // Logo placeholder
    $logo_path = "imagenes/muebleria_{$id_muebleria}/logo.jpg";
    if (!file_exists($logo_path)) {
        // Crear una imagen simple con texto
        $img = imagecreatetruecolor(300, 300);
        $bg_color = imagecolorallocate($img, 200, 200, 200);
        $text_color = imagecolorallocate($img, 50, 50, 50);
        
        imagefill($img, 0, 0, $bg_color);
        imagettftext($img, 20, 0, 50, 150, $text_color, null, "Logo Muebleria {$id_muebleria}");
        
        imagejpeg($img, $logo_path, 90);
        imagedestroy($img);
        echo "✓ Logo placeholder creado: $logo_path\n";
    }
    
    // Imágenes de productos placeholder
    foreach (range(1, 5) as $id_producto) {
        $producto_path = "imagenes/muebleria_{$id_muebleria}/productos/{$id_producto}.jpg";
        if (!file_exists($producto_path)) {
            $img = imagecreatetruecolor(800, 600);
            $bg_color = imagecolorallocate($img, 240, 240, 240);
            $text_color = imagecolorallocate($img, 100, 100, 100);
            
            imagefill($img, 0, 0, $bg_color);
            imagettftext($img, 30, 0, 200, 300, $text_color, null, "Producto {$id_producto}");
            imagettftext($img, 20, 0, 250, 350, $text_color, null, "Muebleria {$id_muebleria}");
            
            imagejpeg($img, $producto_path, 85);
            imagedestroy($img);
            echo "✓ Imagen placeholder creada: $producto_path\n";
        }
    }
}

echo "\n=== Proceso completado ===\n";
echo "\nResumen:\n";
echo "- 3 archivos JSON de mueblerías creados\n";
echo "- 3 archivos JSON completos creados\n";
echo "- Directorios de imágenes preparados\n";
echo "- Imágenes placeholder generadas\n";
echo "- Base de datos actualizada\n";

echo "\nSiguientes pasos:\n";
echo "1. Reemplaza las imágenes placeholder con las imágenes reales\n";
echo "2. Actualiza los archivos JSON con los datos reales de los productos\n";
echo "3. Ejecuta 'php importar_productos.php' para importar los productos\n";
echo "4. Verifica que todo se haya importado correctamente\n";

echo "\nPara más información, consulta el archivo README.md\n";
?>
