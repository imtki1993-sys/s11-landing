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
  whatsapp: "212640638832",       // ⚠️ دير الرقم ديالك هنا (بلا + وبلا 0)
  pixelId: "1018544853873036",                    // Facebook Pixel ID (أرقام فقط)
  pixelPurchaseOnOrder: true,     // كيصيفط حدث Purchase مع كل طلب (حيت COD)
  sheetUrl: "https://script.google.com/macros/s/AKfycbwjx1DpwWHRSOzmaJeJd_o_68pbTWhH7Q3mpldCgmWzeLncK-sRpZy5igl8i3xYFkug/exec",                   // رابط Google Apps Script (Web app) باش توصلك الطلبات
    // ⬅️ 4. TON ID GOOGLE ANALYTICS
  <!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-LQJRXFY95K"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-LQJRXFY95K');
</script>
  openWhatsAppAfterOrder: true    // true = بعد الطلب كيتحل WhatsApp عند الزبون والرسالة واجدة
};
