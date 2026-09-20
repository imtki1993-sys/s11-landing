/**
 * S11 – Commandes vers Google Sheets
 * Colle ce code dans : Extensions > Apps Script (depuis ton Google Sheet)
 */

const SHEET_NAME = "Commandes";
const HEADERS = ["Date", "Nom", "Téléphone", "Ville", "Adresse", "Produit", "Quantité", "Total (DH)", "Statut"];

// Optionnel : mets ton email pour recevoir une notification à chaque commande ("" pour désactiver)
const NOTIFY_EMAIL = "";

// WhatsApp automatique vers TON numéro à chaque commande (service gratuit CallMeBot)
// 1) Va sur https://www.callmebot.com/blog/free-api-whatsapp-messages/ et suis les instructions
// 2) Tu reçois ton APIKEY sur WhatsApp
// 3) Mets ton numéro (ex: "212612345678") et l'APIKEY ici. Laisse "" pour désactiver.
const CALLMEBOT_PHONE = "";
const CALLMEBOT_APIKEY = "";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = (e && e.parameter) || {};

    // Visite (envoyée automatiquement par la page) → compteur journalier
    if (p.type === "visit") {
      bumpStats_(1, 0, p.device, p.ref);
      return json_({ ok: true, type: "visit" });
    }

    if (!p.phone) {
      // Ça arrive quand on clique ▶ Exécuter sur doPost dans l'éditeur : il n'y a pas de commande.
      return json_({ ok: false, error: "no data – lance testOrder() pour tester" });
    }
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

    bumpStats_(0, 1);

    if (CALLMEBOT_PHONE && CALLMEBOT_APIKEY) {
      try {
        const msg = [
          "🛒 طلب جديد S11",
          "الاسم: " + clean_(p.name),
          "الهاتف: " + phone,
          "المدينة: " + clean_(p.city),
          "العنوان: " + (clean_(p.address) || "—"),
          "الكمية: " + p.qty,
          "المجموع: " + p.total + " DH"
        ].join("\n");
        UrlFetchApp.fetch(
          "https://api.callmebot.com/whatsapp.php?phone=" + encodeURIComponent(CALLMEBOT_PHONE) +
          "&text=" + encodeURIComponent(msg) +
          "&apikey=" + encodeURIComponent(CALLMEBOT_APIKEY),
          { muteHttpExceptions: true }
        );
      } catch (err) {
        console.error("WhatsApp notification failed: " + err);
      }
    }

    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

// Ouvre l'URL du Web App dans le navigateur pour vérifier qu'il marche
// ▶ Exécuter CETTE fonction pour tester : elle ajoute une fausse commande dans la feuille
function testOrder() {
  const res = doPost({ parameter: {
    name: "Test Claude", phone: "0612345678", city: "Casablanca",
    address: "Test – à supprimer", product: "S11 Support + Wireless 15W", qty: "1", total: "189"
  }});
  console.log(res.getContent());
}

// Clique sur ▶ Exécuter avec cette fonction pour tester la notification WhatsApp
function testWhatsApp() {
  const res = UrlFetchApp.fetch(
    "https://api.callmebot.com/whatsapp.php?phone=" + encodeURIComponent(CALLMEBOT_PHONE) +
    "&text=" + encodeURIComponent("✅ Test S11: les commandes arrivent ici") +
    "&apikey=" + encodeURIComponent(CALLMEBOT_APIKEY),
    { muteHttpExceptions: true }
  );
  console.log(res.getResponseCode() + " " + res.getContentText().slice(0, 200));
}

function doGet() {
  return json_({ ok: true, message: "S11 order endpoint is running" });
}

/**
 * Feuille "Statistiques" : une ligne par jour
 * Date | Visites | Commandes | Taux (%) | Mobile | Desktop | Dernière source
 */
function bumpStats_(visits, orders, device, ref) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName("Statistiques");
    if (!sh) {
      sh = ss.insertSheet("Statistiques");
      sh.appendRow(["Date", "Visites", "Commandes", "Taux (%)", "Mobile", "Desktop", "Dernière source"]);
      sh.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#1B1F24").setFontColor("#FFFFFF");
      sh.setFrozenRows(1);
    }
    const tz = ss.getSpreadsheetTimeZone() || "Africa/Casablanca";
    const day = Utilities.formatDate(new Date(), tz, "yyyy-MM-dd");

    const dates = sh.getRange("A:A").getDisplayValues();
    let row = 0;
    for (let i = dates.length - 1; i >= 1; i--) {
      if (String(dates[i][0]).indexOf(day) === 0) { row = i + 1; break; }
    }
    if (!row) {
      sh.appendRow([day, 0, 0, 0, 0, 0, ""]);
      row = sh.getLastRow();
    }

    const cur = sh.getRange(row, 2, 1, 5).getValues()[0];
    const v = Number(cur[0] || 0) + visits;
    const o = Number(cur[1] || 0) + orders;
    const mob = Number(cur[3] || 0) + (device === "mobile" ? 1 : 0);
    const desk = Number(cur[4] || 0) + (device === "desktop" ? 1 : 0);
    sh.getRange(row, 2, 1, 5).setValues([[v, o, v ? Math.round((o / v) * 1000) / 10 : 0, mob, desk]]);
    if (ref) sh.getRange(row, 7).setValue(String(ref).slice(0, 120));
  } catch (err) {
    console.error("stats: " + err);
  }
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
