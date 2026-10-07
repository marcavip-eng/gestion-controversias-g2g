/**
 * =====================================================================================
 * GESTIÓN DE CONTROVERSIAS G2G - PUENTE NUBE GOOGLE APPS SCRIPT (CERO OTI)
 * Dirección General: Ing. Marco Avila
 * =====================================================================================
 * Este script convierte tu Google Sheets en una base de datos segura y en tiempo real
 * para conectar la aplicación web de controversias con laptops y celulares de abogados y jefatura.
 * 
 * INSTRUCCIONES DE INSTALACIÓN EN 3 PASOS:
 * 1. Crea una hoja de cálculo en Google Sheets (puedes nombrarla "BD_Controversias_G2G").
 * 2. En el menú superior: Extensiones > Apps Script.
 * 3. Borra el código existente, pega TODO este contenido y haz clic en "Implementar" > "Nueva implementación".
 *    - Tipo: "Aplicación web"
 *    - Descripción: "Servicio Nube G2G"
 *    - Ejecutar como: "Yo" (tu cuenta)
 *    - Quién tiene acceso: "Cualquier persona" (Anyone)
 * 4. Copia la URL de la aplicación web generada (termina en /exec) y pégala en la App Web (Botón Nube).
 * =====================================================================================
 */

// 🔐 CONFIGURACIÓN DEL PIN DE SEGURIDAD (Cámbialo cuando desees autorizar o revocar accesos)
var PIN_AUTORIZADO = "2026";

/**
 * CONSULTA (GET) - Acceso rápido de solo lectura para la Jefa y evaluadores (Sin PIN)
 */
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetData = ss.getSheetByName("JSON_STORE");
    
    if (!sheetData) {
      sheetData = ss.insertSheet("JSON_STORE");
      sheetData.hideSheet();
    }
    
    var rawJson = sheetData.getRange("A1").getValue();
    var responseData = [];
    
    if (rawJson && typeof rawJson === "string" && rawJson.trim() !== "") {
      try {
        responseData = JSON.parse(rawJson);
      } catch (errParse) {
        responseData = [];
      }
    }
    
    var output = {
      success: true,
      data: responseData,
      count: responseData.length,
      timestamp: new Date().toISOString()
    };
    
    return ContentService.createTextOutput(JSON.stringify(output))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: "Error al leer datos de la nube: " + err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * GUARDADO (POST) - Modificación y sincronización segura con PIN para Abogados
 */
function doPost(e) {
  try {
    var contents = "";
    if (e.postData && e.postData.contents) {
      contents = e.postData.contents;
    } else {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "No se recibieron datos en la solicitud"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var payload = JSON.parse(contents);
    var pinRecibido = String(payload.pin || "").trim();
    
    // 🛡️ VERIFICACIÓN DE SEGURIDAD DEL PIN
    if (pinRecibido !== PIN_AUTORIZADO) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "PIN de seguridad incorrecto o no autorizado. Verifique con la Dirección."
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var casos = payload.casos || [];
    var usuario = payload.usuario || "Abogado Operativo";
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. Guardar copia serializada JSON rápida en hoja oculta
    var sheetJson = ss.getSheetByName("JSON_STORE");
    if (!sheetJson) {
      sheetJson = ss.insertSheet("JSON_STORE");
      sheetJson.hideSheet();
    }
    sheetJson.getRange("A1").setValue(JSON.stringify(casos));
    sheetJson.getRange("B1").setValue(new Date());
    sheetJson.getRange("C1").setValue(usuario);
    
    // 2. Tabular en Hoja de Cálculo legible "MATRIZ_CONTROVERSIAS"
    var sheetMatriz = ss.getSheetByName("MATRIZ_CONTROVERSIAS");
    if (!sheetMatriz) {
      sheetMatriz = ss.insertSheet("MATRIZ_CONTROVERSIAS");
    }
    
    // Encabezados oficiales de las 50 Columnas
    var headers = [
      "ID", "Proyecto", "Fase", "Tipo de Atención", "Régimen Contractual",
      "Generador", "Asunto", "Doc Inicio", "Fecha Inicio", "Responsable Conducción",
      "Instancia Actual", "Responsable Acción", "Acción Pendiente", "Tipo de Plazo",
      "Fecha Derivación", "Fecha Límite", "Días Restantes", "Días en Instancia",
      "Alerta Plazo", "Ruta Crítica WBS", "Días Impacto Obra", "Moneda",
      "Monto Pretensión S/", "Exposición Probable S/", "Provisión Contable S/",
      "Fuente Financiamiento", "Brecha OPP S/", "Prioridad Ponderada", "Semáforo",
      "Estado Operativo", "Enlace ACC", "Última Validación Legal", "Validador Legal",
      "Fecha Sincronización"
    ];
    
    sheetMatriz.clearContents();
    sheetMatriz.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheetMatriz.getRange(1, 1, 1, headers.length).setBackground("#0f172a").setFontColor("#ffffff").setFontWeight("bold");
    
    if (casos.length > 0) {
      var rows = [];
      var hoy = new Date();
      for (var i = 0; i < casos.length; i++) {
        var c = casos[i];
        rows.push([
          c.id || "",
          c.proyecto || "",
          c.fase || "",
          c.tipoAtencion || "",
          c.regimen || "",
          c.generador || "",
          c.asunto || "",
          c.docInicio || "",
          c.fechaInicio || "",
          c.responsableConduccion || "",
          c.instanciaActual || "",
          c.responsable || "",
          c.accionPendiente || "",
          c.tipoPlazo || "",
          c.fechaDerivacion || "",
          c.fechaLimite || "",
          c.diasRestantes || 0,
          c.diasInstancia || 0,
          c.alertaPlazo || "",
          c.rutaCritica ? "SÍ" : "NO",
          c.diasImpacto || 0,
          c.moneda || "PEN",
          c.montoPretension || 0,
          c.montoExposicion || 0,
          c.provisionContable || 0,
          c.fuente || "RO",
          c.brecha || 0,
          c.prioridad || "P2",
          c.semaforo || "AMARILLO",
          c.estado || "En curso",
          c.enlaceAcc || "",
          c.ultimaValidacionLegal || "",
          c.validadorLegal || "",
          hoy.toISOString()
        ]);
      }
      sheetMatriz.getRange(2, 1, rows.length, headers.length).setValues(rows);
    }
    
    // Registrar en Historial de Auditoría
    var sheetLog = ss.getSheetByName("HISTORIAL_AUDITORIA");
    if (!sheetLog) {
      sheetLog = ss.insertSheet("HISTORIAL_AUDITORIA");
      sheetLog.appendRow(["Fecha y Hora", "Usuario / Rol", "Casos Sincronizados", "Estado"]);
      sheetLog.getRange(1, 1, 1, 4).setBackground("#334155").setFontColor("#ffffff").setFontWeight("bold");
    }
    sheetLog.appendRow([new Date(), usuario, casos.length, "OK - Sincronizado"]);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Matriz sincronizada exitosamente con la Nube institucional.",
      count: casos.length,
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: "Error interno al sincronizar con Google Sheets: " + err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
