/*
 * ================================================
 *  S11 – الإعدادات ديال الصفحة
 *  بدل غير هاد الملف. من بعد ما تسجل (Commit changes)
 *  Vercel كيحدّث الموقع بوحدو فشي دقيقة.
 * ================================================
 */
window.S11_CONFIG = {
  product: "S11 Support + Wireless 15W",
  offers: [
    { qty: 1, price: 189, title: "حبة وحدة" },
    { qty: 2, price: 349, title: "جوج حبات", note: "وفر 29 DH" },
    { qty: 3, price: 449, title: "3 حبات", note: "وفر 118 DH" }
  ],
  deliveryFee: 0,                 // 0 = التوصيل مجاني
  whatsapp: "212600000000",       // ⚠️ دير الرقم ديالك هنا (بلا + وبلا 0)
  // Facebook Pixels: زيد شحال ما بغيتي من ID، كل حدث كيمشي لجميعهم
  pixelIds: [
    // "1234567890123456",
    // "9876543210987654"
  ],
  pixelPurchaseOnOrder: true,     // كيصيفط حدث Purchase مع كل طلب (حيت COD)
  pageSlug: "s11",                // اسم الصفحة فقاعدة البيانات
  apiUrl: "",                     // مثال: https://votredomaine.com/api/order.php
  sheetUrl: "",                   // رابط Google Apps Script (Web app) باش توصلك الطلبات
  gaId: "G-LQJRXFY95K",                       // Google Analytics 4 (اختياري) مثال: "G-XXXXXXX"
  countVisitsInSheet: true,       // كيسجل عدد الزوار كل نهار فـ Google Sheet
  openWhatsAppAfterOrder: true    // true = بعد الطلب كيتحل WhatsApp عند الزبون والرسالة واجدة
};
