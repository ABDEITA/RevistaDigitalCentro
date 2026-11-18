# rdcentro.com — sitio con sección de notas

Cada nota tiene su propia página (rdcentro.com/notas/...), y se publica desde un panel en **rdcentro.com/admin**, sin tocar código.

## Cómo funciona
1. Escribes la nota en rdcentro.com/admin y le das **Publicar**.
2. El panel la guarda en tu repositorio de GitHub.
3. Netlify ve el cambio, reconstruye el sitio y en 1 o 2 minutos la nota está en línea, junto con el sitemap, el RSS y el llms.txt actualizados.

## Configuración (una sola vez, unos 20 minutos)

### 1. Subir el proyecto a GitHub
1. Crea una cuenta en https://github.com si no tienes.
2. Arriba a la derecha: **+ → New repository**. Nombre: `rdcentro`. Elige **Private**. Crear.
3. En el repositorio vacío: **uploading an existing file**. Arrastra **todo el contenido** de esta carpeta (no la carpeta misma): `src`, `eleventy.config.js`, `netlify.toml`, `package.json`, `package-lock.json`, `.gitignore`, `LEEME.md`.
   - No subas `node_modules` si aparece.
   - Si `.gitignore` no se ve en tu computadora, no pasa nada.
4. **Commit changes**.

### 2. Poner tu usuario de GitHub en el panel
En GitHub abre `src/admin/config.yml` → ícono de lápiz → cambia
`repo: ...` si cambias de repositorio (hoy: `ABDEITA/RevistaDigitalCentro`) → **Commit changes**.

### 3. Conectar Netlify con el repositorio
1. En Netlify abre el sitio de rdcentro.com.
2. **Site configuration → Build & deploy → Continuous deployment → Link repository** → GitHub → elige `rdcentro`.
3. Netlify lee solo la configuración (`netlify.toml`): comando `npm run build`, carpeta `_site`. Deja todo como está y despliega.

### 4. Permitir que el panel inicie sesión con GitHub
1. En GitHub: foto de perfil → **Settings → Developer settings → OAuth Apps → New OAuth App**.
   - Application name: `Panel RD Centro`
   - Homepage URL: `https://rdcentro.com`
   - Authorization callback URL: `https://api.netlify.com/auth/done`
2. Crea la app. Copia el **Client ID** y genera un **Client secret** (cópialo, solo se muestra una vez).
3. En Netlify, dentro del sitio: **Site configuration → Access & security → OAuth → Install provider → GitHub**, y pega el Client ID y el Client secret.
   (El nombre exacto del menú puede variar un poco; busca "OAuth" en la configuración del sitio.)

### 5. Probar
Entra a **https://rdcentro.com/admin**, da clic en **Iniciar sesión con GitHub**, crea una nota y publícala.

## Uso diario
- **Nueva nota:** Notas → + Nota → llena los campos → Publicar → Publicar ahora.
- **Borrador:** activa "Guardar como borrador"; la nota se guarda pero no aparece en el sitio hasta que lo desactives.
- **Imágenes:** horizontales, de preferencia 1200 px de ancho y menos de 500 KB.
- **Feed de Instagram:** en el panel, Configuración del sitio → Feed de Instagram → pega la URL `https://feeds.behold.so/...`.

## Consejos para que las notas aparezcan en Google y en las IA
- Título claro, con las palabras que la gente buscaría (ciudad, persona, tema).
- Resumen de 1 o 2 frases que responda qué pasó.
- Texto propio de al menos 3 o 4 párrafos; una nota de una línea casi no posiciona.
- Publica seguido: lo ideal es cada cartón, nota o entrevista también aquí, no solo en Instagram.

## Para quien programe
- Generador: Eleventy 3 (`npm install`, `npm run dev`).
- Notas: `src/notas/*.md`. Plantillas: `src/_includes/`. Datos: `src/_data/`.
- Probar el panel en local: `npx decap-server` y abrir `/admin/` en `localhost`.
