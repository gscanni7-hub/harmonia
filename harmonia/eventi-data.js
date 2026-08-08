/* Harmonia — fonte unica eventi.
   Un evento diventa "passato" il giorno DOPO la sua data (la sera dell'evento
   resta tra i prossimi). Per aggiungere/modificare un evento: edita SOLO questo file.
   Campi: date 'YYYY-MM-DD', title (titolo lista), sub (sottoriga), lineup,
          foto (nome file in /harmonia/foto senza .jpg), around (etichetta card Around),
          gallery (numero di foto della serata in /harmonia/foto/gal/<date>/,
          file numerati 001.jpg..NNN.jpg: se presente, la serata appare in /galleria). */
window.HARMONIA_EVENTI = [
  // --- estate 2026 (prossimi) ---
  { date:'2026-06-27', title:'Punta Tragara',          sub:'Capri', lineup:'Luigi Landolfo · Jaden Thompson', foto:'people-1', around:'Capri' },
  { date:'2026-07-10', home:true, title:'Fondi',          venue:'The Sense', sub:'Gaeta', tickets:'https://www.i-ticket.it/eventi/absence-x-harmonia-the-senses-biglietti', lineup:'Archie Hamilton · Luigi Landolfo · Roberto Morra', foto:'loc-fondi-gaeta', around:'Fondi · Gaeta' },
  { date:'2026-07-18', home:true, title:'Ischia',         venue:'Negombo', sub:'Ischia', tickets:'https://www.fourvenues.com/harmonia1/6HJX', lineup:'DJ Tennis · Chris Bowl · Luigi Landolfo', foto:'loc-ischia-2026-07-18', around:'Ischia', gallery:135 },
  { date:'2026-08-01', title:'Ischia',         venue:'Negombo', sub:'Ischia', lineup:'Saraga · Tropeano · Luigi Landolfo', foto:'loc-ischia-2026-08-01', around:'Ischia', gallery:116 },
  { date:'2026-08-08', title:'Acciaroli',      venue:'Torre Caleo', sub:'Acciaroli', lineup:'Koko · Romano Alfieri · Davide Piccolo', foto:'loc-acciaroli-2026-08-08', around:'Acciaroli' },
  { date:'2026-08-17', home:true, title:'Porto Cervo',    venue:'The Sanctuary', sub:'Porto Cervo', lineup:'Davide Squillace · Luigi Landolfo', foto:'loc-porto-cervo-2026-08-17', around:'Porto Cervo' },
  { date:'2026-08-29', home:true, title:'Sorrento Coast', venue:'Maya', sub:'Sorrento Coast', lineup:'Traumer · Tropeano · Chris Bowl', foto:'loc-sorrento-coast-2026-08-29', around:'Sorrento Coast' },
  // --- archivio (passati) ---
  { date:'2025-10-03', title:'Arenile',          sub:'Napoli',    lineup:'Andrea Oliva · Alessio Cristiano · Luigi Landolfo · Claudio Pascale', foto:'loc-arenile-napoli-2025-10-03', around:'Arenile · Napoli' },
  { date:'2025-07-18', title:'Negombo',          sub:'Ischia',    lineup:'Mason Collective · Marco Tropeano · Chris Bowl · W/ Atarashi', foto:'loc-negombo-ischia-2025-07-18', around:'Negombo · Ischia' },
  { date:'2025-08-09', title:'Negombo',          sub:'Ischia',    lineup:'Nic Fanciulli · Ale de Tuglie · Chris Bowl · Luigi Landolfo', foto:'nic-fanciulli', around:'Negombo · Ischia' },
  { date:'2025-08-19', title:'Negombo',          sub:'Ischia',    lineup:'Deborah De Luca · MRPHN', foto:'loc-negombo-ischia-2025-08-19', around:'Negombo · Ischia' },
  { date:'2025-12-12', title:'Forma',            sub:'Napoli',    lineup:'Salome Le Chat · Chris Bowl · Luigi Landolfo · Fabricio', foto:'salome-le-chat', around:'Forma · Napoli' },
  { date:'2026-01-03', home:true, title:'Chalet Valentino', sub:'Roccaraso', lineup:'Marco Tropeano · Mind The Gap · Luigi Landolfo', foto:'loc-chalet-valentino-2026-01-03', around:'Chalet Valentino · Roccaraso' },
  { date:'2026-02-13', home:true, title:'Duel Club',             sub:'Napoli',    lineup:'Kidoo · Elbio & Denis · Chris Bowl · Claudio Pascale', foto:'loc-duel-napoli-2026-02-13', around:'Duel Club · Napoli' },
  { date:'2026-02-27', home:true, title:'The Circle',       sub:'Roma',      lineup:'Joey Daniel · Luigi Landolfo · Gianluca Luciani', foto:'loc-the-circle-roma-2026-02-27', around:'The Circle · Roma' },
  { date:'2026-03-27', video:'2026-03-27.mp4', title:'Duel Club',             sub:'Napoli',    lineup:'Mita Gami · La Hara · Luigi Landolfo · W/ Maya elements', foto:'mita-gami', around:'Duel Club · Napoli' },
  { date:'2026-04-25', home:true, title:'Maya',             sub:'Sorrento',  lineup:'Chelina Manuhutu · Alessio Cristiano · Claudio Pascale · Cristian Volpe · Julia', foto:'loc-maya-sorrento-2026-04-25', around:'Maya · Sorrento' },
  { date:'2026-05-30', video:'2026-05-30.mp4', title:'Maya',             sub:'Sorrento',  lineup:'Luciano · Cesar Merveille · La Hara · Luigi Landolfo · Ludo Erre · W/ Maya elements & Global Iconics', foto:'crowd-2', around:'Maya · Sorrento' }
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
  return {
    around: a,
    dt: function (d) { return window.HARMONIA.dateParts(d); },
    // Titolo "Citta · Localita": su desktop resta il puntino, su mobile (via CSS) il
    // puntino si nasconde e la localita va su una riga pulita.
    sep: function (t) {
      var m = t.split(/\s*·\s*/);
      return m.length > 1
        ? m[0] + '<span class="ha-sep"> · </span><span class="ha-loc">' + m[1] + '</span>'
        : t;
    }
  };
};
