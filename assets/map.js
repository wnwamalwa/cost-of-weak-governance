// Africa map: World Bank Worldwide Governance Indicators. The visitor picks an indicator
// and a year; the map, Kenya's rank, the explanation, the neighbours and the trend all update.
(function () {
  var A = window.CWG_AFRICA, D = window.CWG_DATA, box = document.getElementById("afmap");
  if (!A || !D || !box) return;
  var $ = function (id) { return document.getElementById(id); };
  var IND = D.indicators;
  // Colours by rank within Africa (fifths), on an orange-to-purple scale that people with
  // red-green colour blindness can read. Orange = weakest fifth, purple = strongest fifth.
  var FIFTHS = ["#5e3c99", "#998ec3", "#cfc8b8", "#f1a340", "#b35806"];   // top fifth ... bottom fifth
  var FIFTH_NAMES = ["Strongest fifth", "Second fifth", "Middle fifth", "Fourth fifth", "Weakest fifth"];
  var DEFAULT_PEERS = ["RWA", "TZA", "ETH", "UGA"], MAXP = 6;
  var LINE = ["#0284c7", "#0d9488", "#db2777", "#65a30d", "#475569", "#111827"];
  var peers = DEFAULT_PEERS.slice();
  try { var sp = JSON.parse(localStorage.getItem("cwg_peers") || "null"); if (Array.isArray(sp)) peers = sp.filter(function (c) { return c !== "KEN"; }).slice(0, MAXP); } catch (e) {}
  function savePeers() { try { localStorage.setItem("cwg_peers", JSON.stringify(peers)); } catch (e) {} }
  var peerColor = function (id) { return LINE[peers.indexOf(id) % LINE.length]; };
  var state = { ind: "CC", year: A.years[A.years.length - 1], view: "map", ind2: "CC", year2: A.years[0] };
  var idx = {}; A.countries.forEach(function (c, i) { idx[c] = i; });
  var nameOf = {}; A.shapes.forEach(function (s) { nameOf[s.id] = s.name; });
  var fifthOfRank = function (r, n) { return Math.min(4, Math.ceil(r * 5 / n) - 1); };
  var colorOf = function (v) {
    if (v == null || isNaN(v)) return "var(--nodata)";
    var s = series(state.ind, state.year), r = 1 + s.filter(function (x) { return x > v; }).length;
    return FIFTHS[fifthOfRank(r, s.length)];
  };
  var Z90 = 1.645;
  var seOf = function (ind, year) { return A.keSE && A.keSE[ind] ? A.keSE[ind][year] : null; };
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
  var svg = '<svg viewBox="0 ' + (A.y0 || 0) + " " + A.w + " " + A.h + '" role="img" aria-label="Map of Africa coloured by the selected governance score">';
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
  function legend() {
    var n = series(state.ind, state.year).length, out = [];
    for (var q = 0; q < 5; q++) {
      var lo = null, hi = null;
      for (var r = 1; r <= n; r++) if (fifthOfRank(r, n) === q) { if (lo === null) lo = r; hi = r; }
      out.push('<span title="' + FIFTH_NAMES[q] + '"><i style="background:' + FIFTHS[q] + '"></i>' + lo + "–" + hi + (q === 0 ? " (strongest)" : q === 4 ? " (weakest)" : "") + "</span>");
    }
    $("aflegend").innerHTML = '<span class="lt">Rank in Africa:</span>' + out.join("") + '<span><i class="nd"></i>No data</span><span class="lhint">Click a country to compare it with Kenya</span>';
  }

  // ---- trend chart: Kenya, the Africa median and the chosen peers, 2015 to latest (hover for values, click to set the year)
  var T = { W: 230, H: 140, pl: 30, pr: 14, pt: 8, pb: 18 };
  function trend() {
    var W = T.W, H = T.H, pl = T.pl, pr = T.pr, pt = T.pt, pb = T.pb;
    var lines = [{ id: "MED", name: "Africa median", cls: "med", v: A.years.map(function (y) { return median(series(state.ind, y)); }) }]
      .concat(peers.map(function (p) { return { id: p, name: nameOf[p], color: peerColor(p), v: A.years.map(function (y) { return val(p, state.ind, y); }) }; }))
      .concat([{ id: "KEN", name: "Kenya", cls: "ken", v: A.years.map(function (y) { return val("KEN", state.ind, y); }) }]);
    var kse = A.years.map(function (y) { return seOf(state.ind, y); });
    var kv0 = lines[lines.length - 1].v;
    var bandHi = kv0.map(function (v, i) { return kse[i] != null ? v + Z90 * kse[i] : v; });
    var bandLo = kv0.map(function (v, i) { return kse[i] != null ? v - Z90 * kse[i] : v; });
    var all = [].concat.apply([], lines.map(function (l) { return l.v; })).concat(bandHi, bandLo).filter(function (v) { return v != null && !isNaN(v); });
    var lo = Math.floor(Math.min.apply(null, all) * 4) / 4 - 0.1, hi = Math.ceil(Math.max.apply(null, all) * 4) / 4 + 0.1;
    var x = function (i) { return pl + i * (W - pl - pr) / (A.years.length - 1); };
    var y = function (v) { return pt + (hi - v) * (H - pt - pb) / (hi - lo); };
    var path = function (a) { return a.map(function (v, i) { return (i ? "L" : "M") + x(i).toFixed(1) + "," + y(v).toFixed(1); }).join(""); };
    var ticks = [], step = (hi - lo) > 2 ? 1 : (hi - lo) > 1 ? 0.5 : 0.25;
    for (var t = Math.ceil(lo / step) * step; t <= hi + 1e-9; t += step) ticks.push(t);
    var si = A.years.indexOf(state.year);
    var s = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Scores over time">';
    ticks.forEach(function (t) { s += '<line class="g" x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y(t) + '" y2="' + y(t) + '"/><text class="ax" x="' + (pl - 5) + '" y="' + (y(t) + 3.5) + '" text-anchor="end">' + fmt(t) + "</text>"; });
    [0, Math.floor((A.years.length - 1) / 2), A.years.length - 1].forEach(function (i) { s += '<text class="ax" x="' + x(i) + '" y="' + (H - 5) + '" text-anchor="middle">' + A.years[i] + "</text>"; });
    s += '<line class="cur" x1="' + x(si) + '" x2="' + x(si) + '" y1="' + pt + '" y2="' + (H - pb) + '"/>';
    s += '<path class="band" d="' + path(bandHi) + bandLo.map(function (v, i) { return i; }).reverse().map(function (i) { return "L" + x(i).toFixed(1) + "," + y(bandLo[i]).toFixed(1); }).join("") + 'Z"><title>Kenya: 90% margin of error</title></path>';
    lines.forEach(function (l) {
      s += '<path data-id="' + l.id + '" class="ln ' + (l.cls || "peer") + '" d="' + path(l.v) + '"' + (l.color ? ' style="stroke:' + l.color + '"' : "") + "/>";
    });
    s += '<circle class="kdot" cx="' + x(si) + '" cy="' + y(lines[lines.length - 1].v[si]) + '" r="3.5"/>';
    s += '<line class="hov" id="trHov" x1="0" x2="0" y1="' + pt + '" y2="' + (H - pb) + '" visibility="hidden"/>';
    s += '<rect class="hit" x="' + pl + '" y="0" width="' + (W - pl - pr) + '" height="' + H + '"/></svg><div class="trtip" id="trTip" hidden></div>';
    var box2 = $("afTrend"); box2.innerHTML = s;
    var svgEl = box2.querySelector("svg"), hit = box2.querySelector(".hit"), hov = $("trHov"), tt = $("trTip");
    function idxAt(e) {
      var r = svgEl.getBoundingClientRect(), px = (e.clientX - r.left) * W / r.width;
      return Math.max(0, Math.min(A.years.length - 1, Math.round((px - pl) / ((W - pl - pr) / (A.years.length - 1)))));
    }
    hit.addEventListener("mousemove", function (e) {
      var i = idxAt(e), r = svgEl.getBoundingClientRect();
      hov.setAttribute("x1", x(i)); hov.setAttribute("x2", x(i)); hov.setAttribute("visibility", "visible");
      var rows = lines.slice().sort(function (a, b) { return b.v[i] - a.v[i]; });
      tt.innerHTML = "<b>" + A.years[i] + "</b>" + rows.map(function (l) {
        var c = l.id === "KEN" ? "var(--red)" : l.id === "MED" ? "var(--muted)" : l.color;
        return '<div><i style="background:' + c + '"></i>' + l.name + "<span>" + fmt(l.v[i]) + "</span></div>";
      }).join("") + '<div class="hint">Click to show this year on the map</div>';
      tt.hidden = false;
      var bx = box2.getBoundingClientRect(), left = x(i) * r.width / W + (r.left - bx.left);
      tt.style.left = (left > bx.width / 2 ? left - tt.offsetWidth - 10 : left + 10) + "px";
    });
    hit.addEventListener("mouseleave", function () { hov.setAttribute("visibility", "hidden"); tt.hidden = true; });
    hit.addEventListener("click", function (e) { state.year = A.years[idxAt(e)]; yr.value = state.year; draw(); });
  }

  // ---- peers: add from the list, remove with ×, or click a country on the map
  function peerList() {
    var sel = $("afAdd");
    var opts = A.countries.filter(function (c) { return c !== "KEN" && peers.indexOf(c) < 0; })
      .sort(function (a, b) { return nameOf[a].localeCompare(nameOf[b]); });
    sel.innerHTML = '<option value="">+ Add a country</option>' + opts.map(function (c) { return '<option value="' + c + '">' + nameOf[c] + "</option>"; }).join("");
    sel.disabled = peers.length >= MAXP;
    if (sel.disabled) sel.options[0].textContent = "Up to " + MAXP + " countries";
  }
  function togglePeer(id) {
    if (id === "SOM_L") id = "SOM";
    if (id === "KEN" || idx[id] == null) return;
    var i = peers.indexOf(id);
    if (i >= 0) peers.splice(i, 1); else if (peers.length < MAXP) peers.push(id); else return;
    savePeers(); draw();
  }

  // ---- bar charts: one ranked chart, or two side by side (rows follow the left chart's order)
  function fifthColor(ind, year, v) {
    var s = series(ind, year), r = 1 + s.filter(function (x) { return x > v; }).length;
    return FIFTHS[fifthOfRank(r, s.length)];
  }
  var mean = function (a) { return a.reduce(function (x, y) { return x + y; }, 0) / a.length; };
  var indName = function (k) { return IND.filter(function (i) { return i.key === k; })[0].name; };
  function bars() {
    var pair = state.view === "pair", L = series(state.ind, state.year), R = pair ? series(state.ind2, state.year2) : null;
    var order = A.countries.slice().sort(function (a, b) { return L[idx[b]] - L[idx[a]]; });
    var all = L.concat(R || []), lo = Math.min(0, Math.min.apply(null, all)) - 0.15, hi = Math.max(0, Math.max.apply(null, all)) + 0.15;
    var pos = function (v) { return 100 * (v - lo) / (hi - lo); }, z = pos(0);
    var mL = mean(L), mR = R ? mean(R) : null;
    var avgBg = function (m) { var p = pos(m).toFixed(2); return "background:linear-gradient(to right,transparent calc(" + p + "% - 1px),var(--ink) calc(" + p + "% - 1px),var(--ink) calc(" + p + "% + 1px),transparent calc(" + p + "% + 1px))"; };
    var cell = function (ind, year, v, m) {
      if (v == null || isNaN(v)) return '<div class="bc" style="' + avgBg(m) + '"></div>';
      var p = pos(v), l = Math.min(p, z), w = Math.abs(p - z);
      return '<div class="bc" style="' + avgBg(m) + '"><i style="left:' + l.toFixed(2) + "%;width:" + w.toFixed(2) + "%;background:" + fifthColor(ind, year, v) + '"></i><em style="' + (v < 0 ? "right:" + (100 - l).toFixed(2) + "%" : "left:" + (l + w).toFixed(2) + "%") + '">' + fmt(v) + "</em></div>";
    };
    var head = '<div class="br bh"><span></span><div class="bt">' + indName(state.ind) + ", " + state.year + '<small>— Africa average ' + fmt(mL) + "</small></div>" +
      (pair ? '<div class="bt">' + indName(state.ind2) + ", " + state.year2 + '<small>— Africa average ' + fmt(mR) + "</small></div>" : "") + "</div>";
    var rows = order.map(function (c, k) {
      var cls = c === "KEN" ? " ke" : peers.indexOf(c) >= 0 ? " peer" : "";
      var st = peers.indexOf(c) >= 0 ? ' style="--pc:' + peerColor(c) + '"' : "";
      return '<div class="br' + cls + '" data-id="' + c + '"' + st + ' title="' + nameOf[c] + (c === "KEN" ? "" : " (click to add or remove from the comparison)") + '"><span><b>' + (k + 1) + "</b>" + nameOf[c] + "</span>" +
        cell(state.ind, state.year, L[idx[c]], mL) + (pair ? cell(state.ind2, state.year2, R[idx[c]], mR) : "") + "</div>";
    }).join("");
    var el = $("afbars");
    el.className = "afbars" + (pair ? " pair" : "");
    el.innerHTML = head + rows + '<div class="bnote">Vertical line: Africa average. Bars start at zero; scores run from about −2.5 (worst) to +2.5 (best).' + (pair ? ' Rows follow the left chart’s ranking.' : '') + '</div>';
    var kr = el.querySelector(".br.ke");
    if (kr) el.scrollTop = Math.max(0, kr.offsetTop - el.clientHeight / 2);
  }

  function draw() {
    var d = IND.filter(function (i) { return i.key === state.ind; })[0];
    [].slice.call(document.querySelectorAll("#afInd button")).forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.k === state.ind)); });
    $("afYearV").textContent = state.year;
    $("afWhat").textContent = d.what;
    $("afWhy").textContent = d.why;
    $("afTitle").textContent = d.name + ", " + state.year;
    shapes.forEach(function (p) {
      var id = p.dataset.id === "SOM_L" ? "SOM" : p.dataset.id;
      p.style.fill = colorOf(val(p.dataset.id));
      p.classList.toggle("peer", peers.indexOf(id) >= 0);
      if (peers.indexOf(id) >= 0) p.style.setProperty("--pc", peerColor(id)); else p.style.removeProperty("--pc");
    });

    var s = series(state.ind, state.year), n = s.length, kv = val("KEN"), kr = rankOf("KEN", state.ind, state.year), med = median(s);
    $("afScore").textContent = fmt(kv);
    $("afScore").style.color = "var(--ink)";
    var fq = fifthOfRank(kr, n);
    $("afRank").innerHTML = "Kenya ranks <b>" + kr + " of " + n + "</b> African countries (1 = best), in the <span class='fchip' style='background:" + FIFTHS[fq] + "'></span>" + FIFTH_NAMES[fq].toLowerCase() + ". " +
      (kv >= med ? "Above" : "Below") + " the Africa median of " + fmt(med) + ".";
    var first = A.years[0], prev = String(+state.year - 1), bits = [];
    var sig = function (a, ya, b, yb) { var s1 = seOf(state.ind, ya), s2 = seOf(state.ind, yb); return !(s1 && s2) || Math.abs(a - b) > Z90 * (s1 + s2); };
    var word = function (a, b, up, down) { return a > b ? up : a < b ? down : "no change"; };
    if (A.data[state.ind][prev]) { var pv = val("KEN", state.ind, prev); bits.push(word(kv, pv, "Up", "Down") + " from " + fmt(pv) + " in " + prev + (sig(kv, state.year, pv, prev) ? "" : " (within the margin of error)")); }
    if (state.year !== first) { var fv = val("KEN", state.ind, first); bits.push(word(kv, fv, "better", "worse") + " than in " + first + " (" + fmt(fv) + ", rank " + rankOf("KEN", state.ind, first) + ")" + (sig(kv, state.year, fv, first) ? "" : ", also within the margin")); }
    $("afChange").textContent = bits.length ? bits.join("; ") + "." : "";

    var rows = [{ id: "KEN", v: kv }].concat(peers.map(function (p) { return { id: p, v: val(p) }; })).concat([{ id: "MED", v: med }]);
    rows.sort(function (a, b) { return b.v - a.v; });
    $("afPeers").innerHTML = rows.map(function (r) {
      var label = r.id === "MED" ? "Africa median" : nameOf[r.id], pos = (100 * (r.v + 2.5) / 5).toFixed(1);
      var sw = r.id === "KEN" ? "var(--red)" : r.id === "MED" ? "var(--muted)" : peerColor(r.id);
      var rm = (r.id === "KEN" || r.id === "MED") ? '<em></em>' : '<button type="button" class="rm" data-id="' + r.id + '" aria-label="Remove ' + label + '">×</button>';
      return '<div class="pr' + (r.id === "KEN" ? " k" : "") + '" data-id="' + r.id + '"><span><i class="sw' + (r.id === "MED" ? " dash" : "") + '" style="background:' + sw + ';border-color:' + sw + '"></i>' + label + '</span><div class="scale"><i style="left:' + pos + '%;background:' + (r.id === "MED" ? "var(--muted)" : colorOf(r.v)) + '"></i></div><b>' + fmt(r.v) + "</b>" + rm + "</div>";
    }).join("");
    peerList();
    legend();
    trend();
    var showMap = state.view === "map";
    $("afmap").hidden = !showMap; $("afbars").hidden = showMap; $("afPairCtl").hidden = state.view !== "pair";
    if (!showMap) {
      var mh = box.querySelector("svg") ? box.dataset.h : null;
      if (mh) $("afbars").style.height = (state.view === "pair" ? mh - 44 : mh) + "px";
      bars();
    }
    [].slice.call(document.querySelectorAll("#afView button")).forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.v === state.view)); });
    var ord = A.countries.slice().sort(function (a, b) { return s[idx[b]] - s[idx[a]]; });
    try { var det = { ind: d, year: state.year, kv: kv, kr: kr, n: n, med: med, best: nameOf[ord[0]], worst: nameOf[ord[ord.length - 1]], rank: function (id) { return rankOf(id, state.ind, state.year); } }; window.CWG_LAST = det; document.dispatchEvent(new CustomEvent("cwg:map", { detail: det })); } catch (e) {}
  }

  // highlight a country's line when its row is hovered
  $("afPeers").addEventListener("mouseover", function (e) {
    var row = e.target.closest(".pr"); if (!row) return;
    $("afTrend").classList.add("focus");
    [].slice.call(document.querySelectorAll("#afTrend .ln")).forEach(function (l) { l.classList.toggle("on", l.dataset.id === row.dataset.id); });
  });
  $("afPeers").addEventListener("mouseleave", function () { $("afTrend").classList.remove("focus"); });
  $("afPeers").addEventListener("click", function (e) { var b = e.target.closest(".rm"); if (b) togglePeer(b.dataset.id); });
  $("afAdd").addEventListener("change", function (e) { if (e.target.value) togglePeer(e.target.value); });
  $("afReset").addEventListener("click", function () { peers = DEFAULT_PEERS.slice(); savePeers(); draw(); });

  // ---- map tooltip; click a country to add or remove it from the comparison
  var tip = $("maptip");
  function showTip(e, id) {
    var v = val(id), sid = id === "SOM_L" ? "SOM" : id;
    var act = sid === "KEN" ? "" : '<div class="hint">' + (peers.indexOf(sid) >= 0 ? "Click to remove from comparison" : peers.length >= MAXP ? "Comparison is full (" + MAXP + ")" : "Click to add to comparison") + "</div>";
    tip.innerHTML = "<b>" + nameOf[id] + "</b><br>" + (v == null || isNaN(v) ? "No data" : "Score " + fmt(v) + " · rank " + rankOf(sid, state.ind, state.year) + " of " + series(state.ind, state.year).length) + act;
    tip.hidden = false;
    var rb = box.getBoundingClientRect(), x = e.clientX - rb.left, y = e.clientY - rb.top;
    tip.style.left = Math.max(0, Math.min(x + 12, rb.width - 210)) + "px"; tip.style.top = Math.max(y - 56, 0) + "px";
  }
  shapes.forEach(function (p) {
    p.addEventListener("mousemove", function (e) { showTip(e, p.dataset.id); });
    p.addEventListener("click", function (e) { togglePeer(p.dataset.id); showTip(e, p.dataset.id); });
    p.addEventListener("mouseleave", function () { tip.hidden = true; });
  });

  [].slice.call(document.querySelectorAll("#afInd button")).forEach(function (b) {
    b.addEventListener("click", function () { state.ind = b.dataset.k; draw(); });
  });
  yr.addEventListener("input", function () { state.year = String(yr.value); draw(); });

  // view switch and the right-hand chart's choices
  $("afInd2").innerHTML = IND.map(function (d) { return '<option value="' + d.key + '">' + d.name + "</option>"; }).join("");
  $("afYear2").innerHTML = A.years.map(function (y) { return "<option>" + y + "</option>"; }).join("");
  $("afYear2").value = state.year2;
  $("afInd2").addEventListener("change", function () { state.ind2 = this.value; draw(); });
  $("afYear2").addEventListener("change", function () { state.year2 = this.value; draw(); });
  [].slice.call(document.querySelectorAll("#afView button")).forEach(function (b) {
    b.addEventListener("click", function () {
      if (state.view === "map") box.dataset.h = Math.round(box.getBoundingClientRect().height);
      state.view = b.dataset.v;
      if (state.view === "pair" && state.ind2 === state.ind && state.year2 === state.year) state.year2 = A.years[0];
      $("afInd2").value = state.ind2; $("afYear2").value = state.year2;
      draw();
    });
  });
  $("afbars").addEventListener("click", function (e) { var r = e.target.closest(".br[data-id]"); if (r) togglePeer(r.dataset.id); });
  draw();
})();
