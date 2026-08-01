# Hospitalia - Frontend

Frontend en HTML + CSS + JavaScript puro (sin frameworks, sin build).
Consume la API en C# del Integrante 1.

## Como correrlo

No necesita compilar. Abrir `index.html` con Live Server de VS Code
(o cualquier servidor estatico). Abrirlo con `file://` puede romper el
`fetch()` por CORS.

Antes de probar, poner la URL real del backend en `js/config.js`:

```js
API_BASE_URL: "http://localhost:5000/api",
```

## Estructura

```
index.html          Login                        (Integrante 2)
citas.html          Panel de citas + mapa        (Integrante 2)
css/estilos.css     Estilos compartidos          (Integrante 2, secc. 15 libre para el 3)
js/config.js        URL de API y endpoints       (compartido)
js/api.js           fetch() centralizado         (compartido)
js/ui.js            Avisos, modales, formatos    (compartido)
js/auth.js          Login y proteccion de rutas  (Integrante 2)
js/citas.js         Logica de citas              (Integrante 2)
js/mapa.js          Leaflet / OpenStreetMap      (Integrante 2)

inventario.html     Pendiente                    (lo sube el Integrante 3)
js/inventario.js    Pendiente                    (lo sube el Integrante 3)
```

## Reglas del equipo

1. Nadie hace `fetch()` suelto: todo pasa por los servicios de `js/api.js`.
2. Si cambia una ruta de la API, se edita **solo** `js/config.js`.
3. Los estilos base (secciones 1-14 de `estilos.css`) no se modifican;
   el Integrante 3 agrega lo suyo en la seccion 15.
4. Todo texto que venga de la API pasa por `UI.escapar()` antes del DOM.
5. El orden de los `<script>` no se cambia:
   `config -> ui -> api -> auth -> modulo`.

## Contrato con la API (asumido)

Si el backend usa otros nombres de campo, avisar para ajustar.

| Metodo | Ruta                    | Cuerpo / respuesta |
|--------|-------------------------|--------------------|
| POST   | `/usuarios/login`       | `{ correo, contrasena }` -> `{ token, usuario }` |
| GET    | `/usuarios`             | lista de usuarios (para el select de medicos) |
| GET    | `/citas`                | lista de citas |
| POST   | `/citas`                | `{ pacienteNombre, medicoId, fecha, motivo, estado }` |
| PUT    | `/citas/{id}`           | cita completa |
| DELETE | `/citas/{id}`           | 204 |
| GET    | `/medicamentos`         | lista de medicamentos |
| POST   | `/medicamentos`         | `{ nombre, descripcion, stock, precio, fechaVencimiento }` |
| PUT    | `/medicamentos/{id}`    | medicamento completo |
| DELETE | `/medicamentos/{id}`    | 204 |

## Para el Integrante 3

La pantalla de inventario (`inventario.html` + `js/inventario.js`) la
sube el Integrante 3. Para armarla:

1. Copiar el sidebar y la barra superior de `citas.html`.
2. Reutilizar las clases de `css/estilos.css` (`.tarjeta`, `.tabla`,
   `.btn`, `.modal`, `.kpi`); agregar CSS propio solo en la seccion 15.
3. Llamar `Auth.protegerPagina()` al cargar la pagina.
4. Usar `MedicamentosService` de `js/api.js`, que ya esta listo:

```js
MedicamentosService.listar()            // GET    /medicamentos
MedicamentosService.obtener(id)         // GET    /medicamentos/{id}
MedicamentosService.crear(objeto)       // POST   /medicamentos
MedicamentosService.actualizar(id, obj) // PUT    /medicamentos/{id}
MedicamentosService.eliminar(id)        // DELETE /medicamentos/{id}
```

5. Mantener el orden de scripts: `config -> ui -> api -> auth -> inventario`.

## API de terceros

Leaflet 1.9.4 + tiles de OpenStreetMap (`js/mapa.js`), cargado por CDN
en `citas.html`. Muestra las sedes y ubica al paciente con
`navigator.geolocation`.
