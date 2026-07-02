/* Harmonia — fonte unica eventi.
   Un evento diventa "passato" il giorno DOPO la sua data (la sera dell'evento
   resta tra i prossimi). Per aggiungere/modificare un evento: edita SOLO questo file.
   Campi: date 'YYYY-MM-DD', title (titolo lista), sub (sottoriga), lineup,
          foto (nome file in /harmonia/foto senza .jpg), around (etichetta card Around). */
window.HARMONIA_EVENTI = [
  // --- estate 2026 (prossimi) ---
  { date:'2026-06-27', home:true, title:'Harmonia Capri',          sub:'Hotel Punta Tragara · after Ambasciatori', lineup:'Luigi Landolfo · Jaden Thompson', foto:'people-1', around:'Capri' },
  { date:'2026-07-10', home:true, title:'Harmonia Fondi',          sub:'Gaeta', lineup:'Archie Hamilton · Luigi Landolfo · Roberto Morra', foto:'loc-fondi-gaeta', around:'Fondi · Gaeta' },
  { date:'2026-07-18', home:true, title:'Harmonia Ischia',         sub:'in collaborazione con Atarashi', lineup:'DJ Tennis · Chris Bowl · Luigi Landolfo', foto:'people-5', around:'Ischia' },
  { date:'2026-08-01', title:'Harmonia Ischia',         sub:'', lineup:'Saraga · Tropeano · Luigi Landolfo', foto:'people-3', around:'Ischia' },
  { date:'2026-08-07', title:'Harmonia Mykonos',        sub:'', lineup:'Sem Jacobs · Chris Bowl', foto:'people-7', around:'Mykonos' },
  { date:'2026-08-17', title:'Harmonia Porto Cervo',    sub:'The Sanctuary', lineup:'Davide Squillace · Luigi Landolfo', foto:'people-8', around:'Porto Cervo' },
  { date:'2026-08-29', title:'Harmonia Sorrento Coast', sub:'Maya', lineup:'Traumer · Tropeano · Chris Bowl', foto:'crowd-2', around:'Sorrento Coast' },
  // --- archivio (passati) ---
  { date:'2025-10-03', title:'Arenile',          sub:'Napoli',    lineup:'Andrea Oliva · Alessio Cristiano · Luigi Landolfo · Claudio Pascale', foto:'loc-arenile-napoli-2025-10-03', around:'Arenile · Napoli' },
  { date:'2025-07-18', title:'Negombo',          sub:'Ischia',    lineup:'Mason Collective · Marco Tropeano · Chris Bowl · W/ Atarashi', foto:'loc-negombo-ischia-2025-07-18', around:'Negombo · Ischia' },
  { date:'2025-08-09', title:'Negombo',          sub:'Ischia',    lineup:'Nic Fanciulli · Ale de Tuglie · Chris Bowl · Luigi Landolfo', foto:'nic-fanciulli', around:'Negombo · Ischia' },
  { date:'2025-08-19', home:true, title:'Negombo',          sub:'Ischia',    lineup:'Deborah De Luca · MRPHN', foto:'loc-negombo-ischia-2025-08-19', around:'Negombo · Ischia' },
  { date:'2025-12-12', title:'Forma',            sub:'Napoli',    lineup:'Salome Le Chat · Chris Bowl · Luigi Landolfo · Fabricio', foto:'salome-le-chat', around:'Forma · Napoli' },
  { date:'2026-01-03', home:true, title:'Chalet Valentino', sub:'Roccaraso', lineup:'Marco Tropeano · Mind The Gap · Luigi Landolfo', foto:'loc-chalet-valentino-2026-01-03', around:'Chalet Valentino · Roccaraso' },
  { date:'2026-02-13', home:true, title:'Duel',             sub:'Napoli',    lineup:'Kidoo · Elbio & Denis · Chris Bowl · Claudio Pascale', foto:'loc-duel-napoli-2026-02-13', around:'Duel · Napoli' },
  { date:'2026-02-27', home:true, title:'The Circle',       sub:'Roma',      lineup:'Joey Daniel · Luigi Landolfo · Gianluca Luciani', foto:'loc-the-circle-roma-2026-02-27', around:'The Circle · Roma' },
  { date:'2026-03-27', video:'2026-03-27.mp4', title:'Duel',             sub:'Napoli',    lineup:'Mita Gami · La Hara · Luigi Landolfo · W/ Maya elements', foto:'mita-gami', around:'Duel · Napoli' },
  { date:'2026-04-25', home:true, title:'Maya',             sub:'Sorrento',  lineup:'Chelina Manuhutu · Alessio Cristiano · Claudio Pascale · Cristian Volpe · Julia', foto:'loc-maya-sorrento-2026-04-25', around:'Maya · Sorrento' },
  { date:'2026-05-30', video:'2026-05-30.mp4', title:'Maya',             sub:'Sorrento',  lineup:'Luciano · Cesar Merveille · La Hara · Luigi Landolfo · Ludo Erre · W/ Maya elements & Global Iconics', foto:'crowd-2', around:'Maya · Sorrento' }
];

window.HARMONIA = {
  parse: function (d) { return new Date(d + 'T00:00:00'); },
  split: function () {
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var all = window.HARMONIA_EVENTI.map(function (e) { var o = Object.assign({}, e); o._d = window.HARMONIA.parse(e.date); return o; });
    var upcoming = all.filter(function (e) { return e._d >= today; }).sort(function (a, b) { return a._d - b._d; });
    var past = all.filter(function (e) { return e._d < today; }).sort(function (a, b) { return b._d - a._d; });
    return { upcoming: upcoming, past: past };
  },
  dateParts: function (dateStr) {
    var M = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    var p = dateStr.split('-').map(Number), y = p[0], m = p[1], d = p[2];
    var cy = new Date().getFullYear();
    var dd = String(d).padStart(2, '0'), mm = String(m).padStart(2, '0');
    return {
      gg: dd,
      m: M[m - 1] + (y !== cy ? " '" + String(y).slice(2) : ''),
      full: d + ' ' + M[m - 1] + ' ' + y,
      dotted: dd + '.' + mm + '.' + y
    };
  }
};

window.harmoniaAgenda = function () {
  var s = window.HARMONIA.split();
  return { upcoming: s.upcoming, past: s.past, dt: function (d) { return window.HARMONIA.dateParts(d); } };
};
window.harmoniaPills = function () {
  var s = window.HARMONIA.split();
  var list = s.upcoming.length ? s.upcoming : s.past.slice(0, 7);
  return {
    pills: list,
    dt: function (d) { return window.HARMONIA.dateParts(d); },
    initEmbla: function (node) {
      if (node && window.EmblaCarousel) {
        window.EmblaCarousel(node, { loop: true, containScroll: 'trimSnaps', align: 'start', slidesToScroll: 1, breakpoints: { '(min-width: 1024px)': { freeScroll: true } } },
          window.Autoplay ? [window.Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: false, stopOnFocusIn: false })] : []);
      }
    }
  };
};
window.harmoniaAround = function () {
  // Card selezionate a mano tramite il campo "home:true", in ordine cronologico
  // dal piu recente al piu vecchio. "soon" = evento ancora futuro (badge "Prossimo").
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var a = window.HARMONIA_EVENTI
    .filter(function (e) { return e.home; })
    .map(function (e) { var o = Object.assign({}, e); o._d = window.HARMONIA.parse(e.date); o.soon = o._d >= today; return o; })
    .sort(function (a, b) { return b._d - a._d; });
  return { around: a, dt: function (d) { return window.HARMONIA.dateParts(d); } };
};
