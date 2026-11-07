// Africa map: World Bank WGI Control of Corruption, Kenya against the rest of Africa.
(function () {
  var A = window.CWG_AFRICA, box = document.getElementById("afmap");
  if (!A || !box) return;
  var $ = function (id) { return document.getElementById(id); };
  var BINS = [
    { max: -1.0, color: "#b42318", label: "Below −1.0" },
    { max: -0.5, color: "#e8743b", label: "−1.0 to −0.5" },
    { max: 0.0, color: "#f2c14e", label: "−0.5 to 0" },
    { max: 0.5, color: "#8cc084", label: "0 to 0.5" },
    { max: 9, color: "#2e7d4f", label: "Above 0.5" },
  ];
  var PEERS = ["RWA", "TZA", "ETH", "UGA"];
  var year = "e25";
  var colorOf = function (v) { if (v == null) return "var(--chip)"; for (var i = 0; i < BINS.length; i++) if (v <= BINS[i].max) return BINS[i].color; };
  var nameOf = {}; A.shapes.forEach(function (s) { nameOf[s.id] = s.name; });
  var val = function (id) { var t = A[year]; return id === "SOM_L" ? t.SOM : t[id]; };

  // draw
  var svg = '<svg viewBox="0 0 ' + A.w + " " + A.h + '" role="img" aria-label="Map of Africa coloured by control of corruption score">';
  A.shapes.forEach(function (s) {
    svg += '<path class="c' + (s.id === "KEN" ? " ke" : "") + '" data-id="' + s.id + '" d="' + s.d + '"/>';
  });
  A.shapes.forEach(function (s) { if (s.dot) svg += '<circle class="c dot" data-id="' + s.id + '" cx="' + s.dot[0] + '" cy="' + s.dot[1] + '" r="5"/>'; });
  var ke = A.shapes.filter(function (s) { return s.id === "KEN"; })[0];
  svg += '<path class="ke-outline" d="' + ke.d + '"/></svg><div class="maptip" id="maptip" hidden></div>';
  box.innerHTML = svg;
  var shapes = [].slice.call(box.querySelectorAll(".c"));
  // label Kenya
  try {
    var kb = box.querySelector(".ke-outline").getBBox(), ns = "http://www.w3.org/2000/svg";
    var lbl = document.createElementNS(ns, "text");
    lbl.setAttribute("x", kb.x + kb.width + 34); lbl.setAttribute("y", kb.y + kb.height * 0.45);
    lbl.setAttribute("class", "ke-label"); lbl.textContent = "Kenya";
    var ln = document.createElementNS(ns, "line");
    ln.setAttribute("x1", kb.x + kb.width * 0.7); ln.setAttribute("y1", kb.y + kb.height * 0.4);
    ln.setAttribute("x2", kb.x + kb.width + 30); ln.setAttribute("y2", kb.y + kb.height * 0.4 - 4);
    ln.setAttribute("class", "ke-line");
    box.querySelector("svg").appendChild(ln); box.querySelector("svg").appendChild(lbl);
  } catch (e) {}

  $("aflegend").innerHTML = BINS.map(function (b) { return '<span><i style="background:' + b.color + '"></i>' + b.label + "</span>"; }).join("") +
    '<span><i style="background:var(--chip)"></i>No data</span>';

  function ranked() {
    var t = A[year];
    return Object.keys(t).sort(function (a, b) { return t[b] - t[a]; });
  }
  function draw() {
    shapes.forEach(function (p) { p.style.fill = colorOf(val(p.dataset.id)); });
    var order = ranked(), n = order.length, t = A[year];
    var kr = order.indexOf("KEN") + 1, kv = t.KEN;
    var vals = order.map(function (k) { return t[k]; }).sort(function (a, b) { return a - b; });
    var med = n % 2 ? vals[(n - 1) / 2] : (vals[n / 2 - 1] + vals[n / 2]) / 2;
    var yr = year === "e25" ? "2025" : "2024", other = year === "e25" ? A.e24.KEN : null;
    $("afScore").textContent = kv.toFixed(2);
    $("afRank").innerHTML = "Kenya ranks <b>" + kr + " of " + n + "</b> African countries in " + yr + " (1 = least corrupt). " + (n - kr) + " score lower, " + (kr - 1) + " score higher.";
    $("afChange").textContent = other != null ? (kv < other ? "Worse than 2024 (" + other.toFixed(2) + ")." : "Better than 2024 (" + other.toFixed(2) + ").") : "This is the edition the World Bank report uses.";
    var rows = [{ id: "KEN", v: kv }].concat(PEERS.map(function (p) { return { id: p, v: t[p] }; })).concat([{ id: "MED", v: med }]);
    rows.sort(function (a, b) { return b.v - a.v; });
    var lo = -2.5, hi = 2.5;
    $("afPeers").innerHTML = rows.map(function (r) {
      var label = r.id === "MED" ? "Africa median" : nameOf[r.id];
      var pos = (100 * (r.v - lo) / (hi - lo)).toFixed(1);
      return '<div class="pr' + (r.id === "KEN" ? " k" : "") + '"><span>' + label + '</span><div class="scale"><i style="left:' + pos + '%;background:' + (r.id === "MED" ? "var(--muted)" : colorOf(r.v)) + '"></i></div><b>' + r.v.toFixed(2) + "</b></div>";
    }).join("");
    [].slice.call(document.querySelectorAll("#afYear button")).forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.y === year)); });
  }

  // tooltip
  var tip = $("maptip");
  function showTip(e, id) {
    var v = val(id), order = ranked(), r = order.indexOf(id === "SOM_L" ? "SOM" : id) + 1;
    tip.innerHTML = "<b>" + nameOf[id] + "</b><br>" + (v == null ? "No data" : "Score " + v.toFixed(2) + " · rank " + r + " of " + order.length);
    tip.hidden = false;
    var rb = box.getBoundingClientRect(), x = e.clientX - rb.left, y = e.clientY - rb.top;
    tip.style.left = Math.min(x + 12, rb.width - 190) + "px"; tip.style.top = Math.max(y - 46, 0) + "px";
  }
  shapes.forEach(function (p) {
    p.addEventListener("mousemove", function (e) { showTip(e, p.dataset.id); });
    p.addEventListener("click", function (e) { showTip(e, p.dataset.id); });
    p.addEventListener("mouseleave", function () { tip.hidden = true; });
  });

  [].slice.call(document.querySelectorAll("#afYear button")).forEach(function (b) {
    b.addEventListener("click", function () { year = b.dataset.y; draw(); });
  });
  draw();
})();
