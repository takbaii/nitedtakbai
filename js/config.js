// ============================================================
// Configuration - ระบบนิเทศภายในโรงเรียนตากใบ
// ============================================================

const CONFIG = {
  // Google Apps Script Web App URL
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbyOF3S4dgc_qVvieJic5n-tnJk01VWd96Kaxt8a7q8Q4RVaFlHYSZL4d6KaR5jcX-N9NQ/exec',

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

// ปิด CAPTCHA แบบโจทย์คณิตศาสตร์ในหน้า Login
// การยืนยันสิทธิ์ยังคงทำที่ระบบ Login/Backend ตามเดิม
(function disableMathCaptcha() {
  function apply() {
    var captcha = document.querySelector('.login-captcha');
    if (captcha) captcha.style.display = 'none';

    var input = document.getElementById('loginCaptcha');
    if (input) {
      input.value = '';
      input.removeAttribute('required');
    }

    // แทนที่ handler เดิมให้ Login ไม่ตรวจคำตอบ CAPTCHA
    if (typeof window.handleIndexLogin === 'function') {
      window.handleIndexLogin = function() {
        var usernameEl = document.getElementById('loginUsername');
        var passwordEl = document.getElementById('loginPassword');
        var errorEl = document.getElementById('loginError');
        var btn = document.querySelector('.login-box .btn-primary');
        var username = usernameEl ? usernameEl.value.trim() : '';
        var password = passwordEl ? passwordEl.value : '';

        if (!username || !password) {
          if (errorEl) {
            errorEl.textContent = 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน';
            errorEl.style.display = 'block';
          }
          return;
        }

        if (btn) {
          btn.disabled = true;
          btn.innerHTML = '<span class="spinner" style="width:20px;height:20px;border-width:2px;"></span> กำลังเข้าสู่ระบบ...';
        }

        login(username, password)
          .then(function(result) {
            if (result.success) {
              APP.user = result.user;
              localStorage.setItem('nited_user', JSON.stringify(result.user));
              var remember = document.getElementById('loginRemember');
              if (remember && remember.checked) {
                saveLogin(username, password);
              } else {
                clearSavedLogin();
              }
              closeModal('loginModal');
              updatePublicNavbar();
              showToast('เข้าสู่ระบบสำเร็จ');
            } else if (errorEl) {
              errorEl.textContent = result.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
              errorEl.style.display = 'block';
            }
          })
          .catch(function(err) {
            if (errorEl) {
              errorEl.textContent = 'เกิดข้อผิดพลาด: ' + (err.message || err);
              errorEl.style.display = 'block';
            }
          })
          .finally(function() {
            if (btn) {
              btn.disabled = false;
              btn.innerHTML = 'เข้าสู่ระบบ';
            }
          });
      };
    }
  }

  // config.js โหลดก่อน inline script ของหน้า จึงรอจน DOM และ script ทั้งหมดพร้อม
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
