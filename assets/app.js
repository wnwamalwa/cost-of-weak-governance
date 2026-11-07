// Cost of Weak Governance: draws the dashboard from data/data.js.
(function () {
  var D = window.CWG_DATA;
  var $ = function (id) { return document.getElementById(id); };
  var fmt = function (n) { return Math.round(n).toLocaleString("en-GB"); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  // ---------------------------------------------------------- headline
  var H = D.headline, L = D.live;
  var gdp = H.gdpKsh, pop = H.population;
  var debt = { total: L.fallbackDebtKsh, gps: L.fallbackDebtPerSec, asOf: Date.now() };
  var t0 = Date.now();
  var annual, perSec;

  function drawHeadline() {
    annual = gdp * H.shareOfGDP;
    perSec = annual / (365.25 * 86400);
    $("annual").innerHTML = "≈ KSh " + fmt(Math.round(annual / 1e10) * 10) + " bn <small>/ year</small>";
    $("gdpNote").textContent = "KSh " + (gdp / 1e12).toFixed(1) + " trillion";
    $("perPerson").textContent = "KSh " + fmt(Math.round(annual / pop / 100) * 100);
    $("perSec").textContent = fmt(Math.round(perSec / 100) * 100);
    var months = annual / (debt.gps * 86400) / 30.4;
    $("months").textContent = "~" + Math.round(months) + " months";
    if (typeof drawRecovery === "function") drawRecovery();
  }
  $("savingsShare").textContent = H.savingsShareOfDeficit + "%";
  $("updated").textContent = "Figures updated " + D.updated;
  $("counterLink").href = L.counterUrl;
  drawHeadline();

  fetch(L.debtApi, { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (j) {
    var d = j && j.data;
    if (d && d.totalDebt) {
      debt = { total: d.totalDebt, gps: d.increasePerSecond, asOf: new Date(d.asOf).getTime() };
      if (d.population > 1e7) pop = d.population;
      $("liveTag").textContent = "live";
      drawHeadline();
    }
  }).catch(function () { $("liveTag").textContent = "offline estimate"; });

  fetch(L.indicatorsApi, { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (j) {
    var g = j && j.data && Number(j.data.gdp);
    if (g > 5e12 && g < 1e14) { gdp = g; drawHeadline(); }   // only accept a plausible KSh figure
  }).catch(function () {});

  setInterval(function () {
    var now = Date.now();
    $("tick").textContent = "KSh " + fmt(perSec * (now - t0) / 1000);
    $("debt").textContent = "KSh " + fmt(debt.total + debt.gps * (now - debt.asOf) / 1000);
  }, 250);

  // ---------------------------------------------------------- fiscal snapshot
  $("fiscal").innerHTML = D.fiscal.map(function (f) {
    return '<div class="mini"><b>' + esc(f.value) + "</b><span>" + esc(f.label) + "<br>" + esc(f.note) + "</span></div>";
  }).join("");

  // ---------------------------------------------------------- channels and watchdogs
  function cardHtml(c) {
    var bars = "";
    if (c.bars) {
      var max = Math.max.apply(null, c.bars.map(function (b) { return b.value; }));
      var dp = c.bars.some(function (b) { return b.value % 1; }) ? 1 : 0;
      bars = '<div class="bars">' + c.bars.map(function (b) {
        return '<div class="bar' + (b.highlight ? " ke" : "") + '"><span>' + esc(b.label) + '</span><div class="t"><div style="width:' + (100 * b.value / max).toFixed(0) + '%"></div></div><b>' + b.value.toFixed(dp) + "</b></div>";
      }).join("") + "</div>";
    }
    return '<article class="card ch' + (c.positive ? " pos" : "") + '">' +
      '<span class="tag"><i>' + esc(c.key) + "</i>" + esc(c.tag) + "</span>" +
      "<h3>" + esc(c.title) + "</h3>" +
      (c.fig ? '<div class="fig">' + esc(c.fig) + "</div>" : "") +
      '<div class="figl">' + esc(c.figLabel) + "</div>" + bars +
      "<ul>" + c.bullets.map(function (b) { return "<li>" + b + "</li>"; }).join("") + "</ul>" +
      '<div class="src">' + (c.url ? '<a href="' + esc(c.url) + '" target="_blank" rel="noopener">' + esc(c.source) + "</a>" : "World Bank " + esc(c.source)) + "</div></article>";
  }
  $("channels").innerHTML = D.channels.map(cardHtml).join("");
  $("watchdogs").innerHTML = (D.watchdogs || []).map(cardHtml).join("");
  var rec = (D.watchdogs || []).filter(function (w) { return w.compareRecovered; })[0];
  function drawRecovery() {
    if (!rec) return;
    var pct = 100 * rec.compareRecovered * 1e9 / (gdp * H.shareOfGDP);
    $("recovery").innerHTML = "EACC recovered KSh " + rec.compareRecovered + " bn in FY2024/25: about <b>" + pct.toFixed(1) + "%</b> of what weak governance is estimated to cost Kenya each year.";
  }
  drawRecovery();

  // ---------------------------------------------------------- benchmarks
  $("benchmarks").innerHTML = D.benchmarks.map(function (b) {
    var max = Math.max(b.kenya, b.bench) * 1.05;
    var kenyaWorse = b.lowerIsBetter ? b.kenya > b.bench : b.kenya < b.bench;
    var row = function (label, v, k) {
      return '<div class="row' + (k ? " k" + (kenyaWorse ? "" : " good") : "") + '"><span>' + esc(label) + '</span><div class="t"><div style="width:' + (100 * v / max).toFixed(0) + '%"></div></div><b>' + v + b.unit + "</b></div>";
    };
    return '<div class="card"><h4>' + esc(b.label) + "</h4>" + row(b.kenyaLabel, b.kenya, true) + row(b.benchLabel, b.bench, false) + "</div>";
  }).join("");

  // ---------------------------------------------------------- scenarios
  $("seg").innerHTML = D.scenarios.map(function (s, i) {
    return '<button type="button" data-s="' + i + '" aria-pressed="false">' + esc(s.name) + "</button>";
  }).join("");
  var btns = document.querySelectorAll("#seg button");
  function pick(i) {
    var s = D.scenarios[i];
    btns.forEach(function (b) { b.setAttribute("aria-pressed", String(+b.dataset.s === i)); });
    $("sgdp").textContent = s.gdp; $("sjobs").textContent = s.jobs; $("sshare").textContent = s.share;
    $("sdesc").textContent = s.name + ": " + s.desc;
  }
  btns.forEach(function (b) { b.addEventListener("click", function () { pick(+b.dataset.s); }); });
  pick(0);

  // ---------------------------------------------------------- bribe-tax calculator
  var C = D.calculator, earn = $("earn"), share = $("share"), dw = $("daysW");
  earn.value = C.dailyEarnings; share.value = C.sharePct; share.max = C.maxSharePct; dw.value = C.workingDays;
  $("maxShare").textContent = C.maxSharePct + "%";
  function calc() {
    var e = Math.max(0, +earn.value || 0), s = (+share.value || 0) / 100, d = Math.max(0, +dw.value || 0);
    $("shareV").textContent = Math.round(s * 100) + "%";
    var y = e * s * d;
    $("bribeY").textContent = "KSh " + fmt(y) + " a year";
    $("bribeEq").textContent = y > 0 && e > 0 ? "That is about " + Math.round(y / e) + " full days of your earnings a year." : "";
  }
  [earn, share, dw].forEach(function (x) { x.addEventListener("input", calc); });
  calc();

  // ---------------------------------------------------------- levers
  $("levers").innerHTML = D.levers.map(function (l, i) {
    return '<div class="card lever"><b>' + (i + 1) + ". " + esc(l.title) + "</b><ul>" + l.items.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>";
  }).join("");

  // ---------------------------------------------------------- expandable figure (traffic police card)
  var tpb = $("tpBtn");
  if (tpb) tpb.addEventListener("click", function () {
    var open = tpb.getAttribute("aria-expanded") !== "true";
    tpb.setAttribute("aria-expanded", String(open));
    $("tpMore").hidden = !open;
    tpb.querySelector(".more").firstChild.nodeValue = open ? "Hide details " : "What is behind this figure? ";
  });

  // ---------------------------------------------------------- theme toggle
  $("theme").addEventListener("click", function () {
    var r = document.documentElement, cur = r.getAttribute("data-theme");
    var dark = cur === "dark";
    r.setAttribute("data-theme", dark ? "light" : "dark");
  });
})();
