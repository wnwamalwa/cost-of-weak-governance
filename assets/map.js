// Africa map: World Bank Worldwide Governance Indicators. The visitor picks an indicator
// and a year; the map, Kenya's rank, the explanation, the neighbours and the trend all update.
(function () {
  var A = window.CWG_AFRICA, D = window.CWG_DATA, box = document.getElementById("afmap");
  if (!A || !D || !box) return;
  var $ = function (id) { return document.getElementById(id); };
  var IND = D.indicators;
  var BINS = [
    { max: -1.0, color: "#b42318", label: "Below −1.0" },
    { max: -0.5, color: "#e8743b", label: "−1.0 to −0.5" },
    { max: 0.0, color: "#f2c14e", label: "−0.5 to 0" },
    { max: 0.5, color: "#8cc084", label: "0 to 0.5" },
    { max: 9, color: "#2e7d4f", label: "Above 0.5" },
  ];
  var PEERS = ["RWA", "TZA", "ETH", "UGA"];
  var state = { ind: "CC", year: A.years[A.years.length - 1] };
  var idx = {}; A.countries.forEach(function (c, i) { idx[c] = i; });
  var nameOf = {}; A.shapes.forEach(function (s) { nameOf[s.id] = s.name; });
  var colorOf = function (v) { if (v == null || isNaN(v)) return "var(--chip)"; for (var i = 0; i < BINS.length; i++) if (v <= BINS[i].max) return BINS[i].color; };
  var series = function (ind, year) { return A.data[ind][year]; };
  var val = function (id, ind, year) {
    if (id === "SOM_L") id = "SOM";
    var i = idx[id]; return i == null ? null : series(ind || state.ind, year || state.year)[i];
  };
  var fmt = function (v) { return (v < 0 ? "−" : "") + Math.abs(v).toFixed(2); };
  var median = function (a) { var s = a.slice().sort(function (x, y) { return x - y; }), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
  var rankOf = function (id, ind, year) {
    var s = series(ind, year), v = s[idx[id]];
    return 1 + s.filter(function (x) { return x > v; }).length;
  };

  // ---- controls
  $("afInd").innerHTML = IND.map(function (d) { return '<button type="button" data-k="' + d.key + '" title="' + d.name + '">' + (d.short || d.name) + "</button>"; }).join("");
  var yr = $("afYearRange");
  yr.min = A.years[0]; yr.max = A.years[A.years.length - 1]; yr.value = state.year;

  // ---- map
  var svg = '<svg viewBox="0 0 ' + A.w + " " + A.h + '" role="img" aria-label="Map of Africa coloured by the selected governance score">';
  A.shapes.forEach(function (s) { svg += '<path class="c" data-id="' + s.id + '" d="' + s.d + '"/>'; });
  A.shapes.forEach(function (s) { if (s.dot) svg += '<circle class="c dot" data-id="' + s.id + '" cx="' + s.dot[0] + '" cy="' + s.dot[1] + '" r="5"/>'; });
  var ke = A.shapes.filter(function (s) { return s.id === "KEN"; })[0];
  svg += '<path class="ke-outline" d="' + ke.d + '"/></svg><div class="maptip" id="maptip" hidden></div>';
  box.innerHTML = svg;
  var shapes = [].slice.call(box.querySelectorAll(".c"));
  try {
    var kb = box.querySelector(".ke-outline").getBBox(), ns = "http://www.w3.org/2000/svg", root = box.querySelector("svg");
    var ln = document.createElementNS(ns, "line");
    ln.setAttribute("x1", kb.x + kb.width * 0.7); ln.setAttribute("y1", kb.y + kb.height * 0.4);
    ln.setAttribute("x2", kb.x + kb.width + 30); ln.setAttribute("y2", kb.y + kb.height * 0.4 - 4); ln.setAttribute("class", "ke-line");
    var lbl = document.createElementNS(ns, "text");
    lbl.setAttribute("x", kb.x + kb.width + 34); lbl.setAttribute("y", kb.y + kb.height * 0.45); lbl.setAttribute("class", "ke-label"); lbl.textContent = "Kenya";
    root.appendChild(ln); root.appendChild(lbl);
  } catch (e) {}
  $("aflegend").innerHTML = BINS.map(function (b) { return '<span><i style="background:' + b.color + '"></i>' + b.label + "</span>"; }).join("") +
    '<span><i style="background:var(--chip)"></i>No data</span>';

  // ---- trend chart: Kenya against the Africa median, 2015 to latest
  function trend() {
    var W = 230, H = 140, pl = 30, pr = 14, pt = 8, pb = 18;
    var ks = A.years.map(function (y) { return val("KEN", state.ind, y); });
    var ms = A.years.map(function (y) { return median(series(state.ind, y)); });
    var all = ks.concat(ms), lo = Math.floor(Math.min.apply(null, all) * 4) / 4 - 0.1, hi = Math.ceil(Math.max.apply(null, all) * 4) / 4 + 0.1;
    var x = function (i) { return pl + i * (W - pl - pr) / (A.years.length - 1); };
    var y = function (v) { return pt + (hi - v) * (H - pt - pb) / (hi - lo); };
    var line = function (a) { return a.map(function (v, i) { return (i ? "L" : "M") + x(i).toFixed(1) + "," + y(v).toFixed(1); }).join(""); };
    var ticks = [], step = (hi - lo) > 1 ? 0.5 : 0.25;
    for (var t = Math.ceil(lo / step) * step; t <= hi; t += step) ticks.push(t);
    var si = A.years.indexOf(state.year);
    var s = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Kenya and Africa median over time">';
    ticks.forEach(function (t) { s += '<line class="g" x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y(t) + '" y2="' + y(t) + '"/><text class="ax" x="' + (pl - 6) + '" y="' + (y(t) + 4) + '" text-anchor="end">' + fmt(t) + "</text>"; });
    [0, Math.floor((A.years.length - 1) / 2), A.years.length - 1].forEach(function (i) { s += '<text class="ax" x="' + x(i) + '" y="' + (H - 6) + '" text-anchor="middle">' + A.years[i] + "</text>"; });
    s += '<line class="cur" x1="' + x(si) + '" x2="' + x(si) + '" y1="' + pt + '" y2="' + (H - pb) + '"/>';
    s += '<path class="med" d="' + line(ms) + '"/><path class="ken" d="' + line(ks) + '"/>';
    s += '<circle class="kdot" cx="' + x(si) + '" cy="' + y(ks[si]) + '" r="4"/></svg>';
    $("afTrend").innerHTML = s;
  }

  function draw() {
    var d = IND.filter(function (i) { return i.key === state.ind; })[0];
    [].slice.call(document.querySelectorAll("#afInd button")).forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.k === state.ind)); });
    $("afYearV").textContent = state.year;
    $("afWhat").textContent = d.what;
    $("afWhy").textContent = d.why;
    $("afTitle").textContent = d.name + ", " + state.year;
    shapes.forEach(function (p) { p.style.fill = colorOf(val(p.dataset.id)); });

    var s = series(state.ind, state.year), n = s.length, kv = val("KEN"), kr = rankOf("KEN", state.ind, state.year), med = median(s);
    $("afScore").textContent = fmt(kv);
    $("afScore").style.color = colorOf(kv);
    $("afRank").innerHTML = "Kenya ranks <b>" + kr + " of " + n + "</b> African countries (1 = best). " +
      (kv >= med ? "Above" : "Below") + " the Africa median of " + fmt(med) + ".";
    var first = A.years[0], prev = String(+state.year - 1), bits = [];
    if (A.data[state.ind][prev]) { var pv = val("KEN", state.ind, prev); bits.push((kv > pv ? "Up" : kv < pv ? "Down" : "No change") + " from " + fmt(pv) + " in " + prev); }
    if (state.year !== first) { var fv = val("KEN", state.ind, first); bits.push((kv > fv ? "better" : "worse") + " than in " + first + " (" + fmt(fv) + ", rank " + rankOf("KEN", state.ind, first) + ")"); }
    $("afChange").textContent = bits.length ? bits.join("; ") + "." : "";

    var rows = [{ id: "KEN", v: kv }].concat(PEERS.map(function (p) { return { id: p, v: val(p) }; })).concat([{ id: "MED", v: med }]);
    rows.sort(function (a, b) { return b.v - a.v; });
    $("afPeers").innerHTML = rows.map(function (r) {
      var label = r.id === "MED" ? "Africa median" : nameOf[r.id], pos = (100 * (r.v + 2.5) / 5).toFixed(1);
      return '<div class="pr' + (r.id === "KEN" ? " k" : "") + '"><span>' + label + '</span><div class="scale"><i style="left:' + pos + '%;background:' + (r.id === "MED" ? "var(--muted)" : colorOf(r.v)) + '"></i></div><b>' + fmt(r.v) + "</b></div>";
    }).join("");
    trend();
  }

  // ---- tooltip
  var tip = $("maptip");
  function showTip(e, id) {
    var v = val(id), sid = id === "SOM_L" ? "SOM" : id;
    tip.innerHTML = "<b>" + nameOf[id] + "</b><br>" + (v == null || isNaN(v) ? "No data" : "Score " + fmt(v) + " · rank " + rankOf(sid, state.ind, state.year) + " of " + series(state.ind, state.year).length);
    tip.hidden = false;
    var rb = box.getBoundingClientRect(), x = e.clientX - rb.left, y = e.clientY - rb.top;
    tip.style.left = Math.max(0, Math.min(x + 12, rb.width - 200)) + "px"; tip.style.top = Math.max(y - 46, 0) + "px";
  }
  shapes.forEach(function (p) {
    p.addEventListener("mousemove", function (e) { showTip(e, p.dataset.id); });
    p.addEventListener("click", function (e) { showTip(e, p.dataset.id); });
    p.addEventListener("mouseleave", function () { tip.hidden = true; });
  });

  [].slice.call(document.querySelectorAll("#afInd button")).forEach(function (b) {
    b.addEventListener("click", function () { state.ind = b.dataset.k; draw(); });
  });
  yr.addEventListener("input", function () { state.year = String(yr.value); draw(); });
  draw();
})();
