/**
 * S11 – Commandes vers Google Sheets
 * Colle ce code dans : Extensions > Apps Script (depuis ton Google Sheet)
 */

const SHEET_NAME = "Commandes";
const HEADERS = ["Date", "Nom", "Téléphone", "Ville", "Adresse", "Produit", "Quantité", "Total (DH)", "Statut"];

// Optionnel : mets ton email pour recevoir une notification à chaque commande ("" pour désactiver)
const NOTIFY_EMAIL = "";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = e.parameter || {};
    const sheet = getSheet_();

    const phone = String(p.phone || "").replace(/\D/g, "");
    if (!/^0[67]\d{8}$/.test(phone)) {
      return json_({ ok: false, error: "invalid phone" });
    }

    sheet.appendRow([
      new Date(),
      clean_(p.name),
      "'" + phone,            // l'apostrophe garde le 0 au début
      clean_(p.city),
      clean_(p.address),
      clean_(p.product),
      Number(p.qty) || 1,
      Number(p.total) || 0,
      "Nouveau"
    ]);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(
        NOTIFY_EMAIL,
        "🛒 Nouvelle commande S11 – " + clean_(p.city),
        [
          "Nom : " + clean_(p.name),
          "Téléphone : " + phone,
          "Ville : " + clean_(p.city),
          "Adresse : " + (clean_(p.address) || "—"),
          "Quantité : " + p.qty,
          "Total : " + p.total + " DH"
        ].join("\n")
      );
    }

    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

// Ouvre l'URL du Web App dans le navigateur pour vérifier qu'il marche
function doGet() {
  return json_({ ok: true, message: "S11 order endpoint is running" });
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#FF6B00").setFontColor("#FFFFFF");
    sheet.setFrozenRows(1);
    // Liste déroulante pour suivre chaque commande
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Nouveau", "Confirmé", "Pas de réponse", "Annulé", "Expédié", "Livré", "Retour"])
      .build();
    sheet.getRange("I2:I").setDataValidation(rule);
  }
  return sheet;
}

// Empêche les formules injectées (=, +, -, @) et limite la longueur
function clean_(v) {
  let s = String(v || "").trim().slice(0, 200);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
