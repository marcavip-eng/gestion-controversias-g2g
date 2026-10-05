# Guía de Uso del Aplicativo Web: Gestión de Controversias G2G

Este aplicativo web reemplaza la fricción de manejar 50 columnas en Excel, ofreciendo un entorno moderno, intuitivo para el abogado encargado y con tableros ejecutivos en tiempo real para la Dirección (accesible desde PC, laptops, tablets y smartphones).

---

## 🚀 Cómo Abrir y Usar el Aplicativo

### 1. En la Laptop o Computadora del Abogado:
1. Navega a la carpeta: `GESTION_CONTROVERSIAS/app_web/`
2. Haz **doble clic en `index.html`** (se abrirá automáticamente en Google Chrome, Microsoft Edge o cualquier navegador).
3. ¡Listo! Ya estás en la aplicación.

### 2. En el Smartphone del Director (iPhone / Android):
- Al estar montado sobre Google Sheets o un hosting gratuito privado (ej. GitHub Pages / Cloudflare Pages / Vercel):
  1. El Director abre el enlace HTTPS en Safari (iOS) o Chrome (Android).
  2. Pulsa en **"Compartir" -> "Agregar a la pantalla de inicio"**.
  3. Queda guardado como una **App nativa con icono propio**, permitiéndole revisar el tablero ejecutivo, las alertas P1 y los casos en cualquier momento sin abrir Excel.

---

## 💼 Funcionalidades Clave Diseñadas para el Abogado

1. **Formulario Guiado en 4 Pasos (Wizard):**
   - No tiene que buscar columnas a lo largo de una tabla inmensa.
   - Pestaña 1: *Identificación y Asunto* (ID, Proyecto NCC/EV4/VESR/PSR, Tipo de atención, Contrato NEC/FIDIC).
   - Pestaña 2: *Instancia y Plazos* (PMO, OAJ, OPP, Procuraduría, con selector de **Plazo Preclusivo / Fatal** que activa alertas inmediatas).
   - Pestaña 3: *Cronograma y Ruta Crítica* (Código WBS, Hito afectado, Holgura y Afectación en días).
   - Pestaña 4: *Evaluación Económica* (Pretensión de la contraparte vs. Exposición probable de la Entidad, Cobertura y Brecha presupuestal calculada al instante).
2. **Botón "Derivar Caso" (1 Clic):**
   - Permite trasladar el expediente a otra oficina (ej. de OAJ a OPP o a Procuraduría) en 3 clics, registrando el documento y actualizando el historial de auditoría de forma automática.
3. **Ficha Ejecutiva de 1 Página:**
   - Botón con icono de ojo (`👁️`): genera un resumen formal de 1 página listo para imprimir o enviar por correo/WhatsApp a la Alta Dirección.
4. **Exportar a Excel Oficial (`.xlsx`):**
   - Botón superior derecho para descargar en cualquier momento la base de datos completa en formato Excel `.xlsx` para cumplir con requerimientos de la Contraloría (CGR) o auditorías externas.

---

## ☁️ Conexión en Tiempo Real Cero-OTI (Google Sheets)

Para que el abogado y la Dirección vean los cambios simultáneamente sin intervención de la OTI:
1. Revisa el archivo [`CODIGO_GOOGLE_APPS_SCRIPT.gs`](./CODIGO_GOOGLE_APPS_SCRIPT.gs).
2. Sigue los 6 pasos indicados en dicho archivo (toma 2 minutos).
3. Pega el enlace en el botón **"Nube / Sheets"** dentro de la app web y la sincronización quedará activa de forma permanente.
