# Autenticación en BancAza

## Descripción

Se ha implementado un sistema completo de autenticación con Firebase para BancAza. Solo usuarios registrados y autenticados con email y contraseña pueden usar la aplicación.

## Estructura

### Archivos de Autenticación

- **`app/context/AuthContext.tsx`** - Contexto global de autenticación
  - `AuthProvider` - Componente proveedor
  - `useAuth()` - Hook para acceder al contexto
  - Funciones: `login()`, `register()`, `logout()`

- **`app/auth/login.tsx`** - Pantalla de login
  - Formulario con email y contraseña
  - Validaciones de entrada
  - Enlace a pantalla de registro

- **`app/auth/register.tsx`** - Pantalla de registro
  - Formulario con email, contraseña y confirmación
  - Validaciones:
    - Email válido
    - Contraseña mínimo 6 caracteres
    - Las dos contraseñas deben coincidir
  - Manejo de errores en español

- **`app/_layout.tsx`** - Layout raíz condicional
  - Detecta si el usuario está autenticado
  - Muestra login si no hay usuario
  - Muestra la app principal si hay usuario

### Pantallas de la App

- **`app/(app)/index.tsx`** - Home con listado de libros
  - Botón logout en la esquina superior derecha
  - Funcionalidad de búsqueda
  - Botón QR para escanear

- **`app/(app)/detail.tsx`** - Detalle del libro
- **`app/(app)/qrScan.tsx`** - Escaneo de códigos QR

## Flujo de Autenticación

```
Usuario accede la app
    ↓
¿Está autenticado?
    ├─ NO → Pantalla de Login
    │       └─ ¿Tiene cuenta? 
    │           ├─ NO → Registro
    │           │       └─ Crea cuenta
    │           │           └─ Auto login
    │           └─ SÍ → Login
    │                   └─ Entra en app
    └─ SÍ → App Principal
            └─ Puede usar todas las funciones
                └─ Botón Logout para salir
```

## Configuración en Firebase

### 1. Autenticación

Habilita:
- ✅ Email/Contraseña (ya hecho)

### 2. Firestore - Reglas de Seguridad

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth.uid != null;
    }
  }
}
```

Solo usuarios autenticados pueden leer/escribir.

## Manejo de Errores

Los errores de Firebase se traducen al español automáticamente:

- `auth/email-already-in-use` → "Este email ya está registrado"
- `auth/weak-password` → "La contraseña debe tener al menos 6 caracteres"
- `auth/invalid-email` → "El email no es válido"
- `auth/user-not-found` → "Usuario no encontrado"
- `auth/wrong-password` → "Contraseña incorrecta"
- `auth/too-many-requests` → "Demasiados intentos. Intenta más tarde"

## Uso del Hook useAuth()

```tsx
import { useAuth } from './context/AuthContext';

export default function MyComponent() {
  const { user, login, register, logout, error, isLoading } = useAuth();

  // user: Usuario actual de Firebase (o null)
  // isLoading: Está cargando el estado de auth
  // login(email, password): Inicia sesión
  // register(email, password): Registra un nuevo usuario
  // logout(): Cierra sesión
  // error: Último error de autenticación
}
```

## Variables de Entorno

Asegúrate de tener estas variables en `.env`:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

## Pruebas

### Crear una cuenta
1. Abre la app
2. Haz clic en "¿No tienes cuenta? Regístrate"
3. Ingresa un email y contraseña
4. Accederá automáticamente a la app

### Login
1. En la pantalla inicial, ingresa email y contraseña
2. Haz clic en "Iniciar Sesión"

### Logout
1. En la pantalla principal, haz clic en el icono de logout (↪) en la esquina superior derecha
2. Confirma que deseas cerrar sesión
3. Volverá a la pantalla de login

## Seguridad

- Las contraseñas se envían encriptadas a Firebase
- Los tokens se almacenan de forma segura en el dispositivo
- Las reglas de Firestore solo permiten acceso autenticado
- Los errores se muestran al usuario sin exponer información sensible

## Problemas Comunes

### "Error de autenticación" genérico
- Verifica que las variables de entorno estén configuradas
- Revisa la consola para más detalles

### No puedo registrar una cuenta
- Comprueba que Firebase tiene habilitada la autenticación por email
- Verifica la contraseña tiene 6+ caracteres
- El email debe ser válido

### La app cierra sesión sin razón
- Verifica las reglas de Firestore
- Revisa si hay problemas de conexión a internet
- Comprueba que el token de Firebase no ha expirado
