# Reseñas de Alquileres

Plataforma para que inquilinos compartan reseñas sobre propiedades y propietarios en Argentina.

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML + CSS + JS vanilla (sin frameworks) |
| Backend | AWS Amplify Gen 2 (AppSync GraphQL) |
| Base de datos | DynamoDB (via AppSync) |
| Autenticación | Amazon Cognito (email + contraseña) |
| Almacenamiento | Amazon S3 (fotos de perfil y reseñas) |
| Deploy | AWS Amplify Hosting |
| APIs externas | Georef API (datos geográficos oficiales de Argentina) |

---

## Estructura del proyecto

```
alquileres/
├── amplify/                     # Infraestructura cloud (Amplify Gen 2)
│   ├── backend.ts               # Composición: auth + data + storage
│   ├── auth/resource.ts         # Configuración de Cognito (login por email)
│   ├── data/resource.ts         # Esquema GraphQL: modelos y permisos
│   └── storage/resource.ts      # Reglas de acceso al bucket S3
│
├── html/                        # Frontend estático
│   ├── index.html               # Listado y búsqueda de propiedades
│   ├── propiedad.html           # Detalle de una propiedad + sus reseñas
│   ├── nueva-resena.html        # Formulario para subir una reseña
│   ├── mis-resenas.html         # Reseñas del usuario logueado
│   ├── resena-detalle.html      # Detalle de una reseña individual
│   ├── login.html               # Inicio de sesión
│   ├── registro.html            # Registro de usuario
│   ├── confirmar.html           # Confirmación de email post-registro
│   ├── migracion.html           # Herramienta de migración de datos legacy
│   │
│   ├── auth.js                  # Funciones de Cognito (login, signup, logout)
│   ├── aws-config.js            # Config de Amplify (IDs de recursos AWS)
│   ├── property-utils.js        # Normalización, fingerprint, stats
│   ├── script.js                # Lógica de index.html
│   │
│   ├── style.css                # Estilos globales (header, variables, cards)
│   ├── login.css                # Estilos de login/registro
│   └── nueva-resena.css         # Estilos del formulario + comboboxes
│
└── amplify.yml                  # Build config para Amplify Hosting
```

---

## Modelos de datos

### Property (Propiedad)

Representa un inmueble. Existe **una sola vez** por dirección real, sin importar cuántos usuarios la reseñen.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `propertyFingerprint` | String (requerido) | Clave de deduplicación (ver abajo) |
| `provincia` | String | Ej: "CABA", "Buenos Aires" |
| `partido` | String | Ej: "Morón" (solo para provincias, no CABA) |
| `barrio` | String | Ej: "Palermo", "Villa Urquiza" |
| `calleNormalizada` | String | Calle sin prefijos ni acentos (solo para dedup) |
| `calleDisplay` | String | Calle con formato legible, ej: "Av. Corrientes" |
| `alturaPublica` | String | Número redondeado al 100 inferior, ej: "6100" |
| `alturaExacta` | String | Número real del inmueble (privado, no se muestra) |
| `displayAddress` | String | Dirección completa legible, ej: "Av. Corrientes 6100 — Palermo, CABA" |
| `tipoVivienda` | String | `'casa'` o `'edificio'` |
| `piso` / `depto` | String | Solo para edificios (privados) |
| `porInmobiliaria` | Boolean | Si se alquiló por inmobiliaria |
| `nombreInmobiliaria` | String | Informativo, no afecta el fingerprint |
| `totalResenas` | Integer | Contador denormalizado |
| `puntajePromedio` | Float | Promedio denormalizado |
| `totalRecomiendan` | Integer | Contador denormalizado |
| `totalNoRecomiendan` | Integer | Contador denormalizado |

### Review (Reseña)

Experiencia de un usuario sobre una propiedad.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `propertyId` | String | FK a Property |
| `autorId` | String | ID de Cognito del usuario |
| `titulo` | String | Título de la reseña |
| `texto` | String | Cuerpo de la reseña |
| `puntaje` | Integer | Del 1 al 5 |
| `imagenes` | String[] | Paths en S3 |
| `trato` | String | `'muy-bueno'`, `'normal'`, `'dificil'`, `'estafador'` |
| `problemas` | String[] | `'aumentos'`, `'arreglos'`, `'expensas'`, `'ruidos'`, `'humedad'`, `'ninguno'` |
| `recomendaria` | String | `'si'`, `'no'`, `'tal-vez'` |
| `porInmobiliaria` | Boolean | Si se alquiló por inmobiliaria al momento de la reseña |
| `nombreInmobiliaria` | String | Nombre de la inmobiliaria (snapshot histórico) |

### UserProfile (Perfil de usuario)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `userId` | String | ID de Cognito |
| `nombre` / `apellido` | String | |
| `fotoPerfil` | String | Path en S3 |
| `alquila` | Boolean | Si actualmente alquila |
| `lugar` / `zona` | String | Ubicación aproximada |
| `alquilerPromedio` | Integer | Alquiler promedio mensual |

### Resena (Legacy)

Modelo antiguo, mantenido solo para migración. Se migrará a `Property` + `Review` y luego se eliminará.

---

## Lógica de deduplicación (Fingerprint)

El fingerprint identifica de forma única una propiedad física:

```
fingerprint = provincia:calleNorm:alturaExacta:tipoVivienda:piso:depto
```

- **`partido` y `barrio` NO forman parte del fingerprint** — son metadata descriptiva que puede escribirse de distintas formas (ej: "Morón" vs "El Palomar").
- **La inmobiliaria NO está en el fingerprint** — es información que puede cambiar.
- `piso` y `depto` solo se incluyen si `tipoVivienda === 'edificio'`.

**Flujo al crear una reseña:**

1. El usuario completa el formulario con dirección, tipo de vivienda, etc.
2. Se genera el fingerprint con los datos normalizados.
3. Se busca en DynamoDB si ya existe una `Property` con ese fingerprint.
4. **Si existe:** se crea solo la `Review`, linkada a esa propiedad.
5. **Si no existe:** se crea la `Property` y luego la `Review`.
6. Se actualizan los stats denormalizados de la propiedad (`totalResenas`, `puntajePromedio`, etc.).

---

## Normalización de calle

Función `normalizarCalle()` en [html/property-utils.js](html/property-utils.js):

- Convierte a minúsculas y elimina acentos.
- Elimina prefijos: `Av.`, `Avenida`, `Gral.`, `Dr.`, `Ing.`, `Cnel.`, `Tte.`
- Elimina caracteres no alfanuméricos.

Ejemplo: `"Av. Corrientes"` → `"corrientes"` (para dedup)

El campo `calleDisplay` guarda la versión legible original.

---

## Campos de ubicación (Georef API)

El formulario de nueva reseña usa la [Georef API](https://apis.datos.gob.ar/georef/api) para autocompletar datos geográficos oficiales.

- **Provincia → Partido:** Para "Buenos Aires" se cargan los partidos via Georef (`/municipios?provincia=buenos+aires`). Se filtran las Comunas de CABA que la API a veces devuelve incorrectamente.
- **Partido → Localidad:** Se cargan las localidades del partido seleccionado via Georef.
- **CABA → Barrio:** Lista estática de los 48 barrios porteños (no usa Georef porque la API devuelve Comunas en lugar de barrios).
- **Otras provincias:** Solo pide barrio como texto libre.

Los campos usan un **combobox con autocomplete** implementado en JS vanilla (`crearCombobox()` en `nueva-resena.html`), sin librerías externas.

---

## Auto-split de dirección

Si el usuario escribe la dirección completa en el campo "Calle" (ej: `"Jean Jaurès 6156"`), al hacer blur se ejecuta `autoSplitCalle()`:

- Detecta si el texto termina en número.
- Si detecta número: mueve ese número al campo "Número" y deja solo la calle en "Calle".
- Si ya hay un número en el campo "Número": no sobreescribe.

---

## Autenticación

Manejada por Amazon Cognito. El módulo [html/auth.js](html/auth.js) expone:

| Función | Descripción |
|---------|-------------|
| `registrar()` | Registro con email, nombre, apellido, contraseña |
| `confirmarCodigo()` | Confirmación del email con código |
| `login()` | Inicio de sesión |
| `logout()` | Cierre de sesión + redirect a index |
| `getUsuarioActual()` | Retorna el usuario logueado o `null` |
| `getAtributosUsuario()` | Retorna nombre, apellido y email de Cognito |

**Acceso sin login:** Los usuarios no registrados pueden ver propiedades y reseñas usando autenticación IAM (identidades no autenticadas de Cognito Identity Pool). Para crear reseñas deben estar logueados.

---

## Almacenamiento S3

| Path | Acceso |
|------|--------|
| `perfiles/{identity_id}/*` | Solo el dueño puede escribir/borrar. Todos pueden leer. |
| `resenas/{identity_id}/*` | Solo el dueño puede escribir/borrar. Todos pueden leer. |

---

## Permisos GraphQL

| Modelo | No logueado | Logueado | Propietario |
|--------|------------|---------|-------------|
| Property | Solo lectura | CRUD completo | — |
| Review | Solo lectura | CRUD completo | — |
| UserProfile | Sin acceso | Solo lectura | CRUD completo |

---

## Deploy

La app se despliega en **AWS Amplify Hosting** conectado al repositorio GitHub (rama `main`).

El archivo [amplify.yml](amplify.yml) define el proceso de build:

1. **Backend:** `npm ci` + `npx ampx pipeline-deploy` — despliega los recursos AWS (AppSync, DynamoDB, Cognito, S3).
2. **Frontend:** sirve directamente la carpeta `html/` sin transpilación (HTML/CSS/JS puro).

Para deployar cambios: hacer push a `main`. Amplify detecta el push y ejecuta el pipeline automáticamente.

---

## Páginas del frontend

| Página | Descripción |
|--------|-------------|
| `index.html` | Home: listado de propiedades con búsqueda |
| `propiedad.html?id=<id>` | Detalle de una propiedad y sus reseñas |
| `nueva-resena.html` | Formulario completo para crear una reseña |
| `mis-resenas.html` | Reseñas del usuario logueado |
| `resena-detalle.html?id=<id>` | Vista individual de una reseña |
| `login.html` | Inicio de sesión |
| `registro.html` | Registro de nuevo usuario |
| `confirmar.html` | Confirmación de email |
| `migracion.html` | Migración de reseñas legacy (uso interno) |
