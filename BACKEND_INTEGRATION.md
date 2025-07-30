# Integración Backend - SweepsTouch App

## ✅ Características Implementadas

### 🔐 Sistema de Autenticación
- **Login integrado** con API real usando React Query
- **Validación de token** automática al cargar la aplicación
- **Manejo de estados de carga** en tiempo real
- **Gestión de errores** con mensajes informativos
- **Logout seguro** con limpieza de cache

### 👥 Gestión de Promotoras
- **Servicios API con clases** (AuthService, ShiftService, MetricsService, UploadService)
- **React Query** para manejo de estado del servidor
- **Cacheo inteligente** con invalidación automática
- **Estados de loading** en todos los componentes
- **Manejo de errores** robusto

### 📊 Dashboard Integrado
- **Métricas en tiempo real** desde el backend
- **Turnos activos** con actualización automática
- **Historial de turnos** con datos reales
- **Estadísticas dinámicas** (turnos completados, ganancias, etc.)
- **Indicadores de turno activo** en tiempo real

### 📈 Página de Performance
- **Métricas detalladas** del promotor
- **Gráficos con datos reales** del backend
- **Progreso de objetivos** basado en datos actuales
- **Información de turno activo** actualizada

### 🔍 Búsqueda de Turnos
- **Lista de turnos disponibles** desde API
- **Paginación** implementada
- **Solicitud de turnos** con confirmación
- **Estados de turno** visuales (disponible, solicitado, etc.)
- **Filtrado y búsqueda** de turnos

### 📷 Upload de Fotos
- **Integración con api/upload** para subida real de archivos
- **ProfileSelector mejorado** con opción de subir foto propia
- **Validación de archivos** (tamaño, tipo)
- **Preview de imágenes** antes de subir
- **Manejo de errores** en la subida

### 🔄 Validación de Usuario
- **Verificación automática** de foto de perfil
- **Redirección inteligente** a ProfileSelector cuando es necesario
- **Primer login** manejado correctamente
- **Estados de carga** durante validaciones

## 🛠️ Configuración Técnica

### Variables de Entorno
```bash
# Requerida
NEXT_PUBLIC_API_URL=http://localhost:3010/api

# Opcionales
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_API_TIMEOUT=10000
```

### Dependencias Agregadas
```json
{
  "@tanstack/react-query": "^5.x",
  "@tanstack/react-query-devtools": "^5.x"
}
```

### Estructura de Servicios API

#### AuthService
- `login(email, password)` - Autenticación de usuario
- `logout()` - Cerrar sesión
- `updateProfile(userId, updates)` - Actualizar perfil
- `uploadProfileImage(file)` - Subir imagen de perfil
- `validateToken()` - Validar token de sesión

#### ShiftService
- `getAvailableShifts(page, limit)` - Obtener turnos disponibles
- `getPromoterShifts(promoterId, page, limit)` - Turnos del promotor
- `getActiveShift(promoterId)` - Turno activo actual
- `requestShift(shiftId, promoterId)` - Solicitar turno
- `startShift(shiftId, promoterId)` - Iniciar turno
- `endShift(shiftId, promoterId, contactsCaptured)` - Finalizar turno
- `updateShiftProgress(shiftId, contactsCaptured)` - Actualizar progreso

#### MetricsService
- `getPromoterStats(promoterId)` - Estadísticas del promotor
- `getPromoterMetrics(promoterId)` - Métricas detalladas
- `getHistoricalData(promoterId, period)` - Datos históricos
- `getDashboardData(promoterId)` - Datos completos del dashboard

#### UploadService
- `uploadPhoto(file)` - Subir foto al servidor

## 🔗 Endpoints del Backend

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/logout` - Cerrar sesión
- `GET /auth/validate` - Validar token
- `PUT /auth/profile/:userId` - Actualizar perfil

### Turnos
- `GET /shifts/available` - Turnos disponibles
- `GET /shifts/promoter/:promoterId` - Turnos del promotor
- `GET /shifts/active/:promoterId` - Turno activo
- `POST /shifts/:shiftId/request` - Solicitar turno
- `POST /shifts/:shiftId/start` - Iniciar turno
- `POST /shifts/:shiftId/end` - Finalizar turno
- `PUT /shifts/:shiftId/progress` - Actualizar progreso

### Métricas
- `GET /metrics/promoter/:promoterId/stats` - Estadísticas
- `GET /metrics/promoter/:promoterId` - Métricas detalladas
- `GET /metrics/promoter/:promoterId/historical` - Datos históricos
- `GET /metrics/promoter/:promoterId/dashboard` - Datos del dashboard

### Upload
- `POST /upload` - Subir archivos

## ⚡ Características de React Query

### Cacheo y Actualización
- **Stale Time**: 5 minutos para la mayoría de queries
- **Cache Time**: 10 minutos para retener datos
- **Refetch**: Automático en foco de ventana deshabilitado
- **Retry**: Configurado para no reintentar en errores 401/403/404

### Estados de Loading
- Todos los componentes muestran **CircularProgress** durante cargas
- **Skeleton loaders** en cards de estadísticas
- **Estados de error** con botones de reintento

### Invalidación Inteligente
- Las mutaciones invalidan automáticamente los queries relacionados
- Actualización optimista en algunos casos
- **Refetch automático** después de acciones exitosas

## 🎨 UI/UX Mejorado

### Estados de Carga
- **Spinners consistentes** en toda la aplicación
- **Deshabilitación de botones** durante operaciones
- **Feedback visual** inmediato en acciones

### Manejo de Errores
- **Alerts de Material-UI** para errores y éxitos
- **Mensajes descriptivos** de error
- **Botones de reintento** donde corresponde

### Validaciones
- **Validación de email** en login
- **Validación de archivos** en upload
- **Feedback inmediato** en formularios

## 🚀 Instrucciones de Uso

### 1. Configurar Variables de Entorno
```bash
cp .env.example .env.local
# Editar .env.local con la URL correcta de tu API
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Ejecutar en Desarrollo
```bash
npm run dev
```

### 4. Verificar Integración
- El frontend se conectará automáticamente al backend en `NEXT_PUBLIC_API_URL`
- Todos los endpoints están configurados y listos
- React Query DevTools disponible en desarrollo

## 📝 Notas Importantes

- **No se cambió el diseño**: Se mantuvo la UI existente
- **Compatibilidad**: Se mantuvieron las exportaciones existentes para evitar breaking changes
- **Interceptores**: Configurados para manejo automático de tokens y errores 401
- **Loading States**: Agregados en todos los componentes sin afectar el diseño
- **Error Handling**: Robusto en toda la aplicación

## 🔧 Troubleshooting

### Token Expirado
El sistema maneja automáticamente tokens expirados y redirige al login.

### Errores de Conexión
Los servicios incluyen retry automático y mensajes de error descriptivos.

### Upload de Archivos
Validaciones del lado cliente antes de enviar al servidor (tamaño, tipo).

### Estados de Loading
Si un componente no muestra loading, verificar que esté usando los hooks de React Query correctamente.