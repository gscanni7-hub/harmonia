/* Harmonia – Cookie consent banner
   Stile ispirato a Circoloco, adattato al brand Harmonia (rosso #ff0300).
   Salva la scelta in localStorage. Non blocca attivamente gli script di terze parti. */
(function () {
  "use strict";

  var STORAGE_KEY = "harmonia_cookie_consent";
  var ACCENT = "#ff0300";

  function getConsent() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); }
    catch (e) { return null; }
  }
  function saveConsent(data) {
    data.ts = new Date().toISOString();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
  }

  /* ---------- stile ---------- */
  function injectStyle() {
    if (document.getElementById("hc-style")) return;
    var css = [
      "#hc-banner,#hc-reopen{font-family:inherit;box-sizing:border-box}",
      "#hc-banner *{box-sizing:border-box}",
      "#hc-banner{position:fixed;left:18px;bottom:18px;z-index:9999;width:min(380px,calc(100vw - 36px));",
        "background:" + ACCENT + ";color:#fff;border-radius:14px;padding:26px 24px 22px;text-transform:none;",
        "box-shadow:0 24px 60px -18px rgba(0,0,0,.45);font-size:13.5px;line-height:1.55;",
        "opacity:0;transform:translateY(14px);transition:opacity .35s ease,transform .35s ease}",
      "#hc-banner.hc-show{opacity:1;transform:translateY(0)}",
      "#hc-close{position:absolute;top:14px;right:16px;width:22px;height:22px;border:0;background:none;",
        "color:#fff;font-size:20px;line-height:1;cursor:pointer;opacity:.85;padding:0}",
      "#hc-close:hover{opacity:1}",
      "#hc-banner p{margin:0 0 12px;padding-right:14px}",
      "#hc-banner a{color:#fff;text-decoration:underline;text-underline-offset:2px}",
      "#hc-banner strong{font-weight:700}",
      ".hc-toggles{display:flex;gap:10px;margin:18px 0 20px}",
      ".hc-toggle{flex:1;background:rgba(0,0,0,.12);border-radius:10px;padding:14px 14px 16px;text-align:center}",
      ".hc-toggle-label{display:block;font-weight:700;letter-spacing:.04em;font-size:13px;margin-bottom:12px}",
      ".hc-switch{position:relative;display:inline-block;width:46px;height:24px;cursor:pointer}",
      ".hc-switch input{position:absolute;opacity:0;width:0;height:0}",
      ".hc-slider{position:absolute;inset:0;background:#0a0a0a;border-radius:999px;transition:background .2s}",
      ".hc-slider:before{content:'';position:absolute;height:18px;width:18px;left:3px;top:3px;background:#fff;",
        "border-radius:50%;transition:transform .2s}",
      ".hc-switch input:checked + .hc-slider{background:#0a0a0a}",
      ".hc-switch input:checked + .hc-slider:before{transform:translateX(22px)}",
      ".hc-btns{display:grid;grid-template-columns:1fr 1fr;gap:10px}",
      ".hc-btn{appearance:none;border:0;cursor:pointer;background:#0a0a0a;color:#fff;border-radius:999px;",
        "padding:13px 16px;font-size:13px;font-weight:700;letter-spacing:.04em;transition:opacity .2s}",
      ".hc-btn:hover{opacity:.82}",
      ".hc-btn-full{grid-column:1 / -1;margin-top:10px}",
      "#hc-reopen{position:fixed;left:18px;bottom:18px;z-index:9998;display:none;align-items:center;gap:7px;",
        "background:" + ACCENT + ";color:#fff;border:0;cursor:pointer;border-radius:999px;padding:11px 16px;",
        "font-size:12px;font-weight:700;letter-spacing:.08em;box-shadow:0 14px 30px -12px rgba(0,0,0,.45)}",
      "#hc-reopen:hover{opacity:.9}",
      "@media (max-width:520px){#hc-banner{left:12px;right:12px;bottom:12px;width:auto}#hc-reopen{left:12px;bottom:12px}}"
    ].join("");
    var s = document.createElement("style");
    s.id = "hc-style";
    s.textContent = css;
    document.head.appendChild(s);
  }

  /* ---------- markup ---------- */
  function buildBanner(prev) {
    var expOn = prev && prev.experience ? "checked" : "";
    var meaOn = prev && prev.measurement ? "checked" : "";
    var el = document.createElement("div");
    el.id = "hc-banner";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", "Preferenze cookie");
    el.innerHTML =
      '<button id="hc-close" aria-label="Chiudi">&times;</button>' +
      '<p>Noi di <strong>Harmonia</strong> e terze parti selezionate (3) utilizziamo cookie o tecnologie ' +
      'simili per finalit&agrave; tecniche e, con il tuo consenso, per <strong>esperienza</strong> e ' +
      '<strong>misurazione</strong> come specificato nella <a href="/cookie">cookie policy</a>.</p>' +
      '<p>Puoi liberamente prestare, negare o revocare il tuo consenso in qualsiasi momento. Negare il ' +
      'consenso pu&ograve; rendere non disponibili le relative funzioni.</p>' +
      '<p>Usa &laquo;Accetta tutto&raquo; per acconsentire a tutto o &laquo;Rifiuta tutto&raquo; per negare. ' +
      'In alternativa personalizza la scelta con gli interruttori e chiudi con &times; per salvarla.</p>' +
      '<div class="hc-toggles">' +
        '<div class="hc-toggle"><span class="hc-toggle-label">Esperienza</span>' +
          '<label class="hc-switch"><input type="checkbox" id="hc-exp" ' + expOn + '><span class="hc-slider"></span></label></div>' +
        '<div class="hc-toggle"><span class="hc-toggle-label">Misurazione</span>' +
          '<label class="hc-switch"><input type="checkbox" id="hc-mea" ' + meaOn + '><span class="hc-slider"></span></label></div>' +
      '</div>' +
      '<div class="hc-btns">' +
        '<button class="hc-btn" id="hc-reject">Rifiuta tutto</button>' +
        '<button class="hc-btn" id="hc-accept">Accetta tutto</button>' +
        '<button class="hc-btn hc-btn-full" id="hc-learn">Scopri di pi&ugrave;</button>' +
      '</div>';
    return el;
  }

  var bannerEl = null;

  function closeBanner() {
    if (!bannerEl) return;
    bannerEl.classList.remove("hc-show");
    var node = bannerEl;
    setTimeout(function () { if (node && node.parentNode) node.parentNode.removeChild(node); }, 350);
    bannerEl = null;
    showReopen();
  }

  function openBanner() {
    var prev = getConsent();
    injectStyle();
    if (bannerEl) return;
    bannerEl = buildBanner(prev);
    document.body.appendChild(bannerEl);
    requestAnimationFrame(function () { bannerEl.classList.add("hc-show"); });

    bannerEl.querySelector("#hc-close").addEventListener("click", function () {
      // chiudi salva la scelta corrente degli interruttori
      saveConsent({
        experience: bannerEl.querySelector("#hc-exp").checked,
        measurement: bannerEl.querySelector("#hc-mea").checked
      });
      closeBanner();
    });
    bannerEl.querySelector("#hc-reject").addEventListener("click", function () {
      saveConsent({ experience: false, measurement: false }); closeBanner();
    });
    bannerEl.querySelector("#hc-accept").addEventListener("click", function () {
      saveConsent({ experience: true, measurement: true }); closeBanner();
    });
    bannerEl.querySelector("#hc-learn").addEventListener("click", function () {
      window.location.href = "/cookie";
    });
  }

  function showReopen() {
    injectStyle();
    var btn = document.getElementById("hc-reopen");
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "hc-reopen";
      btn.setAttribute("aria-label", "Preferenze cookie");
      btn.innerHTML = "&#127850; COOKIE";
      btn.addEventListener("click", function () {
        btn.style.display = "none";
        openBanner();
      });
      document.body.appendChild(btn);
    }
    btn.style.display = "inline-flex";
  }

  function init() {
    var consent = getConsent();
    if (consent) { showReopen(); }
    else { openBanner(); }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
