## Seguridad de claves Firebase en apps web

**Importante:**

- La clave API de Firebase para web (EXPO_PUBLIC_FIREBASE_API_KEY) es pública y siempre será visible en el JS generado y en las herramientas del navegador. Esto es normal y está documentado por Google.
- Nunca subas claves privadas (service accounts, claves de admin, etc.) al repositorio ni al archivo `.env`.
- Si recibes alertas de GitHub sobre "Possible valid secrets detected" para la API key de Firebase web, puedes ignorarlas si solo se trata de la clave pública.

### ¿Cómo proteger tu proyecto?

1. **Restringe la clave API en la consola de Firebase:**
    - Ve a [Firebase Console > Proyecto > Configuración > Claves de API](https://console.firebase.google.com/).
    - Limita los dominios autorizados (por ejemplo, solo tu GitHub Pages: `https://pacopul.github.io`).
    - Si usas autenticación, configura los dominios permitidos en Auth.

2. **Configura reglas estrictas en Firestore y Auth:**
    - No permitas escritura/lectura global sin autenticación.
    - Ejemplo de reglas mínimas para Firestore:

       ```
       service cloud.firestore {
          match /databases/{database}/documents {
             match /{document=**} {
                allow read, write: if request.auth != null;
             }
          }
       }
       ```

    - Ajusta las reglas según tus necesidades de acceso.

3. **Nunca subas archivos de claves privadas:**
    - No incluyas archivos de tipo `serviceAccountKey.json` ni claves de administración en el repo.

4. **Más información:**
    - [Firebase: ¿Es seguro exponer la API key?](https://firebase.google.com/docs/projects/api-keys)
    - [Reglas de seguridad Firestore](https://firebase.google.com/docs/firestore/security/get-started)

Si tienes dudas sobre la configuración de seguridad, revisa la documentación oficial o consulta con un experto en seguridad de Firebase.
# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Despliegue en GitHub Pages

Esta app está configurada para generar una versión estática para web y publicarla en GitHub Pages usando la carpeta `docs` del repositorio.

### 1. Configuración de Expo para web estática

En `app.json` ya están definidos los ajustes clave:

- Salida estática para web:

  ```json
  "web": {
    "output": "static",
    "favicon": "./assets/images/favicon.png"
  }
  ```

- Base URL para GitHub Pages (debe coincidir con el nombre del repositorio):

  ```json
  "experiments": {
    "typedRoutes": true,
    "reactCompiler": true,
    "baseUrl": "/bancaza"
  }
  ```

Si cambias el nombre del repositorio o del proyecto en GitHub, actualiza también `baseUrl` (por ejemplo, `/mi-repo`) para que las rutas funcionen correctamente en producción.

### 2. Generar la versión estática en `docs`

Desde la raíz del proyecto:

1. Instala dependencias (solo la primera vez o cuando cambien):

   ```bash
   npm install
   ```

2. Genera la exportación estática para web dentro de la carpeta `docs`:

   ```bash
   npm run export:web
   ```

Este comando crea/actualiza la carpeta `docs` con los archivos HTML, JS y assets, garantiza la creación del archivo `.nojekyll` necesario para GitHub Pages y copia todas las imágenes de portadas desde `assets/portadas` a `docs/assets/portadas`.

**Importante:**

- Si las portadas de los libros no se muestran en producción, revisa que existan en `docs/assets/portadas` tras ejecutar el script. Si no están, ejecuta de nuevo:

   ```bash
   npm run export:web
   ```

- El script ya automatiza el copiado, pero si alguna portada nueva no aparece, asegúrate de que esté en `assets/portadas` antes de exportar.

- Haz commit y push de la carpeta `docs/assets/portadas` junto con el resto del build.

Nota sobre Firebase y variables de entorno en web:

- Usa variables `EXPO_PUBLIC_*` en `.env`.
- En código, léelas con acceso estático (por ejemplo, `process.env.EXPO_PUBLIC_FIREBASE_API_KEY`) y evita acceso dinámico como `process.env[name]`.
- En export web, Expo puede no inyectar correctamente variables leídas de forma dinámica, lo que provoca errores en producción como "Faltan variables de entorno".

### 3. Subir cambios a GitHub

1. Añade y haz commit de los cambios (incluyendo la carpeta `docs`):

   ```bash
   git add .
   git commit -m "build web para GitHub Pages"
   git push origin main
   ```

### 4. Configurar GitHub Pages

En el repositorio de GitHub:

1. Ve a **Settings → Pages**.
2. En **Source**, selecciona **Deploy from a branch**.
3. En **Branch**, elige `main` y la carpeta `/docs` como ruta.
4. Guarda los cambios.

GitHub Pages generará y publicará el sitio usando el contenido de `docs`.

### 5. URL de producción

Con la configuración actual, la aplicación se sirve en:

- `https://pacopul.github.io/bancaza`

Si el repositorio o el usuario cambian, la URL seguirá el formato:

- `https://<usuario>.github.io/<nombre-del-repo>`

### 6. Flujo para futuras actualizaciones

Cada vez que modifiques la app y quieras actualizar la versión pública:

1. Ejecuta de nuevo la exportación estática:

   ```bash
   npm run export:web
   ```

2. Haz commit y push de los cambios:

   ```bash
   git add .
   git commit -m "actualiza build web"
   git push origin main
   ```

3. Espera unos segundos/minutos a que GitHub Pages reprocese el contenido y actualice la web.

### 7. Troubleshooting (Firebase en GitHub Pages)

Si en producción aparece este error:

```text
Uncaught Error: [FirebaseConfig] Faltan variables de entorno...
```

Revisa esta checklist:

1. Las variables en `.env` existen y empiezan por `EXPO_PUBLIC_`.
2. En `FirebaseConfig.ts` se usan accesos estáticos como `process.env.EXPO_PUBLIC_FIREBASE_API_KEY`.
3. No uses acceso dinámico tipo `process.env[name]` para estas variables.
4. Regenera siempre el build con:

   ```bash
   npm run export:web
   ```

5. Haz commit/push de `docs` y de cualquier cambio en código/config.
6. En el navegador, haz recarga forzada (hard refresh) para evitar caché de JS antigua.

Comprobación rápida:

- Si local funciona y producción no, casi siempre es un problema de build/caché o de lectura dinámica de variables en el bundle web.
