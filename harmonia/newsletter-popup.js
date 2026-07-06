/* Harmonia – Popup newsletter
   Appare ~10s DOPO che l'utente ha gestito il banner cookie, una sola volta per visitatore.
   Invio email a Mailchimp tramite form embedded (submit su iframe nascosto, nessun redirect).
   >>> DA COMPLETARE: incollare l'action del modulo Mailchimp in MAILCHIMP_ACTION (vedi istruzioni). */
(function () {
  "use strict";

  // ====== CONFIG MAILCHIMP (da compilare quando l'account e pronto) ======
  // Esempio: 'https://gmail.us21.list-manage.com/subscribe/post?u=XXXXXXXX&id=YYYYYYYY'
  var MAILCHIMP_ACTION = "https://harmoniarecords.us4.list-manage.com/subscribe/post?u=e2ab235089ebf8249c080bc56&id=d7c49f5977&f_id=00e1f6eaf0";
  var MAILCHIMP_HONEYPOT = "b_e2ab235089ebf8249c080bc56_d7c49f5977";
  // =======================================================================

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
      "#hnl-modal{position:relative;width:min(440px,100%);background:#fff;color:#0a0a0a;border-radius:16px;",
        "padding:40px 32px 32px;text-align:center;box-shadow:0 30px 80px -20px rgba(0,0,0,.5);",
        "transform:translateY(16px) scale(.98);transition:transform .35s ease;text-transform:none}",
      "#hnl-overlay.hnl-show #hnl-modal{transform:none}",
      "#hnl-close{position:absolute;top:14px;right:16px;width:26px;height:26px;border:0;background:none;",
        "font-size:24px;line-height:1;color:#0a0a0a;cursor:pointer;opacity:.6;padding:0}",
      "#hnl-close:hover{opacity:1}",
      "#hnl-logo{height:34px;width:auto;margin:0 auto 20px;display:block}",
      "#hnl-modal h2{font-size:22px;font-weight:800;letter-spacing:.03em;text-transform:uppercase;margin:0 0 10px}",
      "#hnl-modal p{font-size:14.5px;line-height:1.5;color:#555;margin:0 0 22px}",
      "#hnl-form{display:flex;flex-direction:column;gap:10px}",
      "#hnl-email{width:100%;border:1px solid #d9d9d9;border-radius:10px;padding:14px 16px;font-size:15px;",
        "outline:none;transition:border-color .2s}",
      "#hnl-email:focus{border-color:" + ACCENT + "}",
      "#hnl-submit{width:100%;border:0;cursor:pointer;background:" + ACCENT + ";color:#fff;border-radius:10px;",
        "padding:14px 16px;font-size:14px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;transition:opacity .2s}",
      "#hnl-submit:hover{opacity:.9}",
      "#hnl-note{font-size:11.5px;color:#999;margin:14px 0 0}",
      "#hnl-ok{font-size:16px;font-weight:700;color:#0a0a0a;padding:10px 0}",
      "#hnl-frame{display:none}",
      "@media (max-width:480px){#hnl-modal{padding:34px 22px 26px}}"
    ].join("");
    var s = document.createElement("style");
    s.id = "hnl-style"; s.textContent = css;
    document.head.appendChild(s);
  }

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
        '<img id="hnl-logo" src="/harmonia/brand/logo-orizzontale.png" alt="Harmonia">' +
        '<h2>Entra nella community</h2>' +
        '<p>Iscriviti per ricevere per primo date, lineup e accessi prioritari agli eventi Harmonia.</p>' +
        '<form id="hnl-form" action="' + MAILCHIMP_ACTION + '" method="post" target="hnl-frame" novalidate>' +
          '<input id="hnl-email" type="email" name="EMAIL" required placeholder="la tua email">' +
          honey +
          '<button id="hnl-submit" type="submit">Iscriviti</button>' +
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
      // se Mailchimp non e ancora configurato, evita invio a vuoto ma mostra grazie
      if (!MAILCHIMP_ACTION) { e.preventDefault(); }
      markShown();
      overlay.querySelector("#hnl-modal").innerHTML =
        '<button id="hnl-close" aria-label="Chiudi">&times;</button>' +
        '<img id="hnl-logo" src="/harmonia/brand/logo-orizzontale.png" alt="Harmonia">' +
        '<div id="hnl-ok">Grazie! Iscrizione registrata.</div>';
      overlay.querySelector("#hnl-close").addEventListener("click", function () { close(overlay); });
      setTimeout(function () { close(overlay); }, 2500);
    });
  }

  function trigger() {
    if (already()) return;
    markShown(); // segna subito: una sola comparsa per visitatore
    build();
  }

  function waitConsentThenShow() {
    if (already()) return;
    if (consentGiven()) {
      setTimeout(trigger, DELAY_MS);
    } else {
      // aspetta che l'utente gestisca il banner cookie, poi parte il ritardo
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
