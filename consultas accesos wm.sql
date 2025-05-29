INSERT INTO menus (title, action, order_display) VALUES
('Admin usuarios', 'admin', 13);
/*
('Alistamiento', 'alistamiento', 1),
('Cargue', 'cargue', 2),
('Traslado ubicacion', 'traslado', 3),
('Consultar Ubicacion', 'consultar-ubicacion', 4),
('OT Pendiente confirmar', 'ot-pendiente', 5),
('Consultar material', 'consultar-material', 6),
('Gestion Entrega', 'gestion-entrega', 7),
('Indicador De Despacho', 'indicator', 8),
('Validar Etiqueta', 'info-etiqueta', 9),
('Traslado entre Almacenes', 'traslado-almacenes', 10),
('Liberar Picking', 'freepicking', 11),
('Ingreso De Mercancia', 'ingreso-mcia', 12);

*/



-- ========================================
-- SCRIPTS RÁPIDOS PARA ASIGNAR PERMISOS
-- ========================================

-- 1. Asignar TODOS los menús al usuario TI (administrador)
-- ========================================
INSERT INTO user_menu_permissions (user_id, menu_id)
SELECT u.id, m.id 
FROM users u, menus m 
WHERE u.usercode = '7949'  -- Usuario TI
  AND m.is_active = TRUE
  AND NOT EXISTS (
      SELECT 1 FROM user_menu_permissions ump 
      WHERE ump.user_id = u.id AND ump.menu_id = m.id
  );

-- 2. Asignar menús básicos a usuarios operativos
-- ========================================
INSERT INTO user_menu_permissions (user_id, menu_id)
SELECT u.id, m.id 
FROM users u, menus m 
WHERE u.usercode IN ('1010', '1060', '1170', '1589')  -- Usuarios específicos
  AND m.action IN ('alistamiento', 'cargue', 'consultar-ubicacion', 'consultar-material')
  AND m.is_active = TRUE
  AND NOT EXISTS (
      SELECT 1 FROM user_menu_permissions ump 
      WHERE ump.user_id = u.id AND ump.menu_id = m.id
  );

-- 3. Asignar menús de supervisión a usuarios supervisores
-- ========================================
INSERT INTO user_menu_permissions (user_id, menu_id)
SELECT u.id, m.id 
FROM users u, menus m 
WHERE u.usercode IN ('1122', '2938', '5091')  -- Supervisores
  AND m.action IN ('alistamiento', 'cargue', 'traslado', 'consultar-ubicacion', 
                   'ot-pendiente', 'consultar-material', 'gestion-entrega', 'indicator')
  AND m.is_active = TRUE
  AND NOT EXISTS (
      SELECT 1 FROM user_menu_permissions ump 
      WHERE ump.user_id = u.id AND ump.menu_id = m.id
  );

-- 4. Asignar menús de almacén a usuarios de almacén
-- ========================================
INSERT INTO user_menu_permissions (user_id, menu_id)
SELECT u.id, m.id 
FROM users u, menus m 
WHERE u.usercode IN ('2536', '2683', '3970', '4087', '4563', '4577')
  AND m.action IN ('alistamiento', 'cargue', 'traslado', 'traslado-almacenes', 
                   'consultar-ubicacion', 'consultar-material', 'ingreso-mcia')
  AND m.is_active = TRUE
  AND NOT EXISTS (
      SELECT 1 FROM user_menu_permissions ump 
      WHERE ump.user_id = u.id AND ump.menu_id = m.id
  );

-- 5. Asignar menús de picking a usuarios de picking
-- ========================================
INSERT INTO user_menu_permissions (user_id, menu_id)
SELECT u.id, m.id 
FROM users u, menus m 
WHERE u.usercode IN ('5117', '5642', '5708', '5853', '5911', '5919')
  AND m.action IN ('freepicking', 'consultar-ubicacion', 'consultar-material', 
                   'info-etiqueta', 'traslado')
  AND m.is_active = TRUE
  AND NOT EXISTS (
      SELECT 1 FROM user_menu_permissions ump 
      WHERE ump.user_id = u.id AND ump.menu_id = m.id
  );

-- 6. Asignar menús de despacho a usuarios de despacho
-- ========================================
INSERT INTO user_menu_permissions (user_id, menu_id)
SELECT u.id, m.id 
FROM users u, menus m 
WHERE u.usercode IN ('6113', '6318', '6536', '6755', '6796', '7303')
  AND m.action IN ('gestion-entrega', 'indicator', 'info-etiqueta', 'consultar-material')
  AND m.is_active = TRUE
  AND NOT EXISTS (
      SELECT 1 FROM user_menu_permissions ump 
      WHERE ump.user_id = u.id AND ump.menu_id = m.id
  );

-- ========================================
-- CONSULTAS DE VERIFICACIÓN
-- ========================================

-- Ver cuántos usuarios tienen permisos asignados
SELECT 
    COUNT(DISTINCT u.id) as usuarios_con_permisos,
    (SELECT COUNT(*) FROM users WHERE is_active = TRUE) as total_usuarios
FROM users u
INNER JOIN user_menu_permissions ump ON u.id = ump.user_id
WHERE u.is_active = TRUE;

-- ver permisos del usuario TI
SELECT u.usercode, u.username, m.title, m.action
FROM users u
INNER JOIN user_menu_permissions ump ON u.id = ump.user_id
INNER JOIN menus m ON ump.menu_id = m.id
WHERE u.usercode = '7949'
ORDER BY m.order_display;

-- Ver usuarios sin permisos asignados
SELECT u.usercode, u.username
FROM users u
LEFT JOIN user_menu_permissions ump ON u.id = ump.user_id
WHERE ump.user_id IS NULL 
  AND u.is_active = TRUE
ORDER BY u.usercode;

-- Ver estadísticas de permisos por menú
SELECT 
    m.title,
    m.action,
    COUNT(ump.user_id) as usuarios_con_acceso,
    ROUND((COUNT(ump.user_id) * 100.0 / (SELECT COUNT(*) FROM users WHERE is_active = TRUE)), 2) as porcentaje_usuarios
FROM menus m
LEFT JOIN user_menu_permissions ump ON m.id = ump.menu_id
LEFT JOIN users u ON ump.user_id = u.id AND u.is_active = TRUE
WHERE m.is_active = TRUE
GROUP BY m.id, m.title, m.action
ORDER BY usuarios_con_acceso DESC;

-- ========================================
-- LIMPIAR PERMISOS (SI ES NECESARIO)
-- ========================================

-- Eliminar todos los permisos de un usuario específico
-- DELETE FROM user_menu_permissions 
-- WHERE user_id = (SELECT id FROM users WHERE usercode = '1010');

-- Eliminar permisos de un menú específico para todos los usuarios
-- DELETE FROM user_menu_permissions 
-- WHERE menu_id = (SELECT id FROM menus WHERE action = 'alistamiento');

-- Eliminar TODOS los permisos (CUIDADO!)
-- DELETE FROM user_menu_permissions;