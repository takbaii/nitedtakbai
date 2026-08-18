// ============================================================
// Configuration - ระบบนิเทศภายในโรงเรียนตากใบ
// ============================================================

const CONFIG = {
  // Google Apps Script Web App URL
  // ใส่ URL ของ Web App deployment ของ Apps Script ที่เชื่อมกับ Script ID ด้านล่าง
  APPS_SCRIPT_URL: '',

  // Google Sheets ID
  SPREADSHEET_ID: '1SH5EKpQgun-GomPoaJmJQwrJ6u9VxFozmb0A_x_HnxY',

  // Google Drive Folder ID
  DRIVE_FOLDER_ID: '1I65xsjQKk5_pkgDBgxs--UWMbWRGbRDg',

  // Google Apps Script Project ID
  SCRIPT_ID: '16Nk8lKI08McuHqIH4n1vVdkHDdtOWKguVXEgSpnrHTwqkp0ZtwHwvqqA',

  // System Info
  SCHOOL_NAME: 'โรงเรียนตากใบ',
  SYSTEM_NAME: 'ระบบนิเทศภายในโรงเรียนตากใบ'
};

// ------------------------------------------------------------
// School branding
// Pages in the original project contain the previous school name
// directly in HTML. Replace that display text centrally so every
// page uses the Tak Bai school branding without changing behavior.
// ------------------------------------------------------------
(function applySchoolBranding() {
  const OLD_NAME = 'โรงเรียนนราศึกษาธิการ';
  const NEW_NAME = CONFIG.SCHOOL_NAME;

  function replaceText(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.nodeValue && node.nodeValue.includes(OLD_NAME)) {
        node.nodeValue = node.nodeValue.split(OLD_NAME).join(NEW_NAME);
      }
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') return;

    for (const child of node.childNodes) replaceText(child);
  }

  function apply() {
    replaceText(document.body);
    if (document.title) {
      document.title = document.title.replaceAll(OLD_NAME, NEW_NAME);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply, { once: true });
  } else {
    apply();
  }
})();
