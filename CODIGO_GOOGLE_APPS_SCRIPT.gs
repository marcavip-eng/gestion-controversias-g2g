/**
 * SCRIPT PARA GOOGLE APPS SCRIPT (CERO INTERVENCIÓN DE OTI)
 * 
 * INSTRUCCIONES RÁPIDAS (2 MINUTOS):
 * 1. Crea una hoja nueva en Google Sheets (ej. "Controversias_G2G_Master").
 * 2. En el menú superior de Google Sheets, ve a: Extensiones -> Apps Script.
 * 3. Borra el código existente y pega TODO este archivo.
 * 4. Arriba a la derecha, haz clic en "Implementar" -> "Nueva implementación".
 * 5. Selecciona Tipo: "Aplicación web".
 *    - Ejecutar como: "Yo" (tu cuenta).
 *    - Quién tiene acceso: "Cualquier usuario" (permite que la app web y el celular lean/escriban con el PIN).
 * 6. Copia la URL generada (termina en /exec) y pégala en el botón "Nube / Sheets" de la aplicación web.
 * 
 * ¡Listo! Ya tienes sincronización en tiempo real entre la laptop del abogado y el celular del Director.
 */

const PIN_AUTORIZADO = "123456"; // Puedes cambiar este PIN por el que acuerdes con la Dirección

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({ status: "ok", casos: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const headers = data[0];
    const casos = [];
    
    for (let r = 1; r < data.length; r++) {
      let caso = {};
      for (let c = 0; c < headers.length; c++) {
        caso[headers[c]] = data[r][c];
      }
      casos.push(caso);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "ok", casos: casos }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const contents = JSON.parse(e.postData.contents);
    const pin = contents.pin;
    
    if (pin !== PIN_AUTORIZADO) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "PIN incorrecto" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const casos = contents.casos;
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.clearContents();
    
    if (!casos || casos.length === 0) {
      return ContentService.createTextOutput(JSON.stringify({ status: "ok", message: "Sin datos" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const headers = Object.keys(casos[0]).filter(k => k !== "historial");
    const rows = [headers];
    
    casos.forEach(c => {
      const row = headers.map(h => c[h] !== undefined ? c[h] : "");
      rows.push(row);
    });
    
    sheet.getRange(1, 1, rows.length, headers.length).setValues(rows);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "ok", message: "Datos actualizados exitosamente" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
