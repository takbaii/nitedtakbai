// ============================================================
// Configuration - ระบบนิเทศภายในโรงเรียนตากใบ
// ============================================================

const CONFIG = {
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbyOF3S4dgc_qVvieJic5n-tnJk01VWd96Kaxt8a7q8Q4RVaFlHYSZL4d6KaR5jcX-N9NQ/exec',
  SPREADSHEET_ID: '1SH5EKpQgun-GomPoaJmJQwrJ6u9VxFozmb0A_x_HnxY',
  DRIVE_FOLDER_ID: '1I65xsjQKk5_pkgDBgxs--UWMbWRGbRDg',
  SCRIPT_ID: '16Nk8lKI08McuHqIH4n1vVdkHDdtOWKguVXEgSpnrHTwqkp0ZtwHwvqqA',
  SCHOOL_NAME: 'โรงเรียนตากใบ',
  SYSTEM_NAME: 'ระบบนิเทศภายในโรงเรียนตากใบ',
  LOGO_URL: 'https://img2.pic.in.th/imagea4f5d6515cc5f960.png'
};

// ============================================================
// โรงเรียนตากใบ: Branding + Theme
// ============================================================
(function applyTakBaiBranding() {
  function loadTheme() {
    if (!document.getElementById('takbai-theme-css')) {
      var link = document.createElement('link');
      link.id = 'takbai-theme-css';
      link.rel = 'stylesheet';
      link.href = /\/pages\//.test(window.location.pathname) ? '../css/takbai-theme.css' : 'css/takbai-theme.css';
      document.head.appendChild(link);
    }

    if (!document.getElementById('takbai-brand-style')) {
      var style = document.createElement('style');
      style.id = 'takbai-brand-style';
      style.textContent = '.login-captcha{display:none!important;} .takbai-logo{object-fit:contain!important;}';
      document.head.appendChild(style);
    }
  }

  function replaceText(root) {
    if (!root) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue && node.nodeValue.indexOf('โรงเรียนนราศึกษาธิการ') !== -1) {
        node.nodeValue = node.nodeValue.replace(/โรงเรียนนราศึกษาธิการ/g, CONFIG.SCHOOL_NAME);
      }
    }
  }

  function applyBranding() {
    loadTheme();
    document.title = (document.title || '').replace(/โรงเรียนนราศึกษาธิการ/g, CONFIG.SCHOOL_NAME);
    replaceText(document.body);

    document.querySelectorAll('.navbar-brand .logo').forEach(function(el) {
      if (!el.querySelector('img.takbai-logo')) {
        el.innerHTML = '<img class="takbai-logo" src="' + CONFIG.LOGO_URL + '" alt="ตราโรงเรียนตากใบ">';
      }
    });

    document.querySelectorAll('.brand-text').forEach(function(el) {
      el.textContent = 'ระบบนิเทศภายใน (e-Supervisor)';
    });
    document.querySelectorAll('.brand-sub').forEach(function(el) {
      el.textContent = CONFIG.SCHOOL_NAME;
    });
  }

  function start() {
    applyBranding();
    // จัดการเนื้อหาที่สร้างแบบ dynamic ภายหลัง
    if (window.MutationObserver) {
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(m) {
          m.addedNodes.forEach(function(n) {
            if (n.nodeType === 1) replaceText(n);
          });
        });
      });
      observer.observe(document.body, {childList:true, subtree:true});
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();

// ============================================================
// ปิด CAPTCHA แบบโจทย์คณิตศาสตร์ในหน้า Login
// ============================================================
(function disableMathCaptcha() {
  function hideCaptcha() {
    var captcha = document.querySelector('.login-captcha');
    if (captcha) captcha.style.setProperty('display', 'none', 'important');
  }

  function overrideLogin() {
    hideCaptcha();
    if (typeof window.handleIndexLogin !== 'function' || window.__mathCaptchaDisabled) return;
    window.__mathCaptchaDisabled = true;

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
            if (typeof updatePublicNavbar === 'function') updatePublicNavbar();
            if (typeof showToast === 'function') showToast('เข้าสู่ระบบสำเร็จ');
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

  function start() {
    hideCaptcha();
    setTimeout(overrideLogin, 0);
    setTimeout(overrideLogin, 250);
    setTimeout(overrideLogin, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
