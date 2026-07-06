/* Harmonia – Popup newsletter (stile "manifesto")
   Appare ~10s DOPO che l'utente ha gestito il banner cookie, una sola volta per visitatore.
   Invio a Mailchimp tramite form embedded (submit su iframe nascosto, nessun redirect). */
(function () {
  "use strict";

  // ====== CONFIG MAILCHIMP ======
  var MAILCHIMP_ACTION = "https://harmoniarecords.us4.list-manage.com/subscribe/post?u=e2ab235089ebf8249c080bc56&id=d7c49f5977&f_id=00e1f6eaf0";
  var MAILCHIMP_HONEYPOT = "b_e2ab235089ebf8249c080bc56_d7c49f5977";
  // ==============================

  var SHOWN_KEY = "harmonia_nl_shown";
  var CONSENT_KEY = "harmonia_cookie_consent";
  var DELAY_MS = 10000;   // ritardo dopo la gestione dei cookie
  var ACCENT = "#ff0300";

  function already() { try { return !!localStorage.getItem(SHOWN_KEY); } catch (e) { return false; } }
  function markShown() { try { localStorage.setItem(SHOWN_KEY, new Date().toISOString()); } catch (e) {} }
  function consentGiven() { try { return !!localStorage.getItem(CONSENT_KEY); } catch (e) { return false; } }

  function injectStyle() {
    if (document.getElementById("hnl-style")) return;
    var css = [
      "#hnl-overlay{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;",
        "background:rgba(10,10,10,.55);opacity:0;transition:opacity .35s ease;padding:20px}",
      "#hnl-overlay.hnl-show{opacity:1}",
      "#hnl-modal{position:relative;width:min(430px,100%);background:#fff;color:#0a0a0a;",
        "padding:42px 36px 32px;text-align:left;box-shadow:0 30px 80px -20px rgba(0,0,0,.5);",
        "transform:translateY(16px);transition:transform .35s ease;text-transform:none}",
      "#hnl-overlay.hnl-show #hnl-modal{transform:none}",
      "#hnl-close{position:absolute;top:16px;right:18px;width:26px;height:26px;border:0;background:none;",
        "font-size:24px;line-height:1;color:#0a0a0a;cursor:pointer;opacity:.55;padding:0}",
      "#hnl-close:hover{opacity:1}",
      "#hnl-bug{height:30px;width:auto;display:block;margin:0 0 22px}",
      "#hnl-eyebrow{display:block;font-size:11px;font-weight:800;letter-spacing:.24em;",
        "text-transform:uppercase;color:#b3b3b3;margin:0 0 12px}",
      "#hnl-modal h2{font-size:clamp(30px,8vw,38px);font-weight:800;line-height:1.02;",
        "letter-spacing:.005em;text-transform:uppercase;margin:0 0 16px}",
      "#hnl-modal .hnl-lead{font-size:14.5px;line-height:1.55;color:#555;margin:0 0 30px}",
      "#hnl-modal .hnl-lead b{color:#0a0a0a;font-weight:700}",
      "#hnl-field{position:relative}",
      "#hnl-email{width:100%;border:0;border-bottom:1px solid #d9d9d9;border-radius:0;background:transparent;",
        "padding:12px 44px 12px 0;font-size:15px;outline:none;transition:border-color .2s;font-family:inherit}",
      "#hnl-email:focus{border-bottom-color:" + ACCENT + "}",
      "#hnl-email::placeholder{color:#b3b3b3}",
      "#hnl-submit{position:absolute;right:0;bottom:8px;border:0;background:none;cursor:pointer;padding:6px 0 6px 10px;line-height:0}",
      "#hnl-submit svg{display:block}",
      "#hnl-submit:hover{opacity:.75}",
      "#hnl-note{font-size:11px;letter-spacing:.02em;color:#9a9a9a;margin:18px 0 0}",
      "#hnl-ok{font-size:15px;font-weight:700;padding:6px 0 2px}",
      "#hnl-frame{display:none}",
      "@media (max-width:480px){#hnl-modal{padding:36px 26px 26px}}",
      "@media (prefers-reduced-motion:reduce){#hnl-overlay,#hnl-modal{transition:none}}"
    ].join("");
    var s = document.createElement("style");
    s.id = "hnl-style";
    s.textContent = css;
    document.head.appendChild(s);
  }

  var ARROW = '<svg width="17" height="16" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="m.511563 2.568 2.255997-2.352h8.46404v8.272l-2.44804 2.256v-4c0-.896.01067-1.696.032-2.4l-6.272 6.08-1.695997-1.84 6.223997-6.048c-.704.02133-1.50933.032-2.416.032z" fill="' + ACCENT + '"></path></svg>';

  function close(overlay) {
    overlay.classList.remove("hnl-show");
    setTimeout(function () { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 350);
  }

  function build() {
    injectStyle();
    var honey = MAILCHIMP_HONEYPOT
      ? '<div style="position:absolute;left:-5000px" aria-hidden="true"><input type="text" name="' + MAILCHIMP_HONEYPOT + '" tabindex="-1" value=""></div>'
      : '';
    var overlay = document.createElement("div");
    overlay.id = "hnl-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-label", "Iscriviti alla newsletter");
    overlay.innerHTML =
      '<div id="hnl-modal">' +
        '<button id="hnl-close" aria-label="Chiudi">&times;</button>' +
        '<img id="hnl-bug" src="/harmonia/brand/logo-simbolo.png" alt="">' +
        '<span id="hnl-eyebrow">Community</span>' +
        '<h2>Club<br>Together</h2>' +
        '<p class="hnl-lead"><b>Non solo un party, un ecosistema.</b> Date, lineup e accessi prioritari, prima di tutti.</p>' +
        '<form id="hnl-form" action="' + MAILCHIMP_ACTION + '" method="post" target="hnl-frame" novalidate>' +
          '<div id="hnl-field">' +
            '<input id="hnl-email" type="email" name="EMAIL" required placeholder="scrivi la tua email..">' +
            '<button id="hnl-submit" type="submit" aria-label="Iscriviti">' + ARROW + '</button>' +
          '</div>' +
          honey +
        '</form>' +
        '<p id="hnl-note">Niente spam. Puoi disiscriverti quando vuoi.</p>' +
      '</div>' +
      '<iframe id="hnl-frame" name="hnl-frame"></iframe>';
    document.body.appendChild(overlay);
    requestAnimationFrame(function () { overlay.classList.add("hnl-show"); });

    overlay.querySelector("#hnl-close").addEventListener("click", function () { close(overlay); });
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(overlay); });

    var form = overlay.querySelector("#hnl-form");
    form.addEventListener("submit", function (e) {
      var email = overlay.querySelector("#hnl-email").value.trim();
      if (!email) { e.preventDefault(); return; }
      if (!MAILCHIMP_ACTION) { e.preventDefault(); }
      markShown();
      overlay.querySelector("#hnl-modal").innerHTML =
        '<button id="hnl-close" aria-label="Chiudi">&times;</button>' +
        '<img id="hnl-bug" src="/harmonia/brand/logo-simbolo.png" alt="">' +
        '<span id="hnl-eyebrow">Community</span>' +
        '<div id="hnl-ok">Grazie, sei dentro.</div>';
      overlay.querySelector("#hnl-close").addEventListener("click", function () { close(overlay); });
      setTimeout(function () { close(overlay); }, 2500);
    });
  }

  function trigger() {
    if (already()) return;
    markShown(); // una sola comparsa per visitatore
    build();
  }

  function waitConsentThenShow() {
    if (already()) return;
    if (consentGiven()) {
      setTimeout(trigger, DELAY_MS);
    } else {
      var iv = setInterval(function () {
        if (consentGiven()) { clearInterval(iv); setTimeout(trigger, DELAY_MS); }
      }, 1000);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", waitConsentThenShow);
  } else {
    waitConsentThenShow();
  }
})();
