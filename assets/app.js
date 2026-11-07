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
    $("shareDef").textContent = "≈ " + Math.round(100 * H.shareOfGDP * 100 / H.deficitFY27PctGDP) + "%";
    $("shareInt").textContent = "≈ " + Math.round(100 * H.shareOfGDP * 100 / H.interestPctGDP) + "%";
    if (typeof drawRecovery === "function") drawRecovery();
  }
  $("updated").textContent = "Figures updated " + D.updated;
  $("counterLink").href = L.counterUrl;
  $("debt").href = L.counterUrl;
  $("debtPc").href = L.counterUrl;
  $("debtGdp").href = L.counterUrl.replace(/\/$/, "") + "/kenya-debt";
  var liveDebt = false, liveGdp = false, livePc = null;
  function drawDebt() {
    $("debt").textContent = "KSh " + (debt.total / 1e12).toFixed(1) + " trillion";
    // until both live figures arrive, show the counter's last published ratios
    $("debtGdp").querySelector("b").textContent = (liveDebt && liveGdp ? (100 * debt.total / gdp).toFixed(1) : L.fallbackDebtPctGDP.toFixed(1)) + "%";
    var pc = livePc || (liveDebt ? debt.total / pop : L.fallbackDebtPerPerson);
    $("debtPc").querySelector("b").textContent = "KSh " + fmt(Math.round(pc / 1000) * 1000);
  }
  drawHeadline();

  fetch(L.debtApi, { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (j) {
    var d = j && j.data;
    if (d && d.totalDebt) {
      debt = { total: d.totalDebt, gps: d.increasePerSecond, asOf: new Date(d.asOf).getTime() };
      if (d.population > 1e7) pop = d.population;
      if (d.debtPerCapita > 0) livePc = d.debtPerCapita;
      liveDebt = true;
      $("liveTag").textContent = "live";
      drawHeadline(); drawDebt();
    }
  }).catch(function () { $("liveTag").textContent = "offline estimate"; });

  fetch(L.indicatorsApi, { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (j) {
    var g = j && j.data && Number(j.data.gdp);
    if (g > 5e12 && g < 1e14) { gdp = g; liveGdp = true; drawHeadline(); drawDebt(); }   // only accept a plausible KSh figure
  }).catch(function () {});

  drawDebt();

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
    var KIND = { estimate: "Estimate", survey: "Survey", recorded: "Recorded", reported: "Reported" };
    var badge = c.kind ? '<span class="kind ' + c.kind + '">' + KIND[c.kind] + "</span>" : "";
    return '<article class="card ch' + (c.positive ? " pos" : "") + '">' + (badge ? '<div class="kindrow">' + badge + "</div>" : "") +
      '<span class="tag"><i>' + esc(c.key) + "</i>" + esc(c.tag) + "</span>" +
      "<h3>" + esc(c.title) + "</h3>" +
      (c.fig ? '<div class="fig">' + esc(c.fig) + "</div>" : "") +
      '<div class="figl">' + esc(c.figLabel) + "</div>" + bars +
      "<ul>" + c.bullets.map(function (b) { return "<li>" + b + "</li>"; }).join("") + "</ul>" +
      '<div class="src">' + (c.url ? '<a href="' + esc(c.url) + '" target="_blank" rel="noopener">' + esc(c.source) + "</a>" : "World Bank " + esc(c.source)) + "</div></article>";
  }
  $("channels").innerHTML = D.channels.filter(function (c) { return !c.positive; }).map(cardHtml).join("");
  if ($("upside")) $("upside").innerHTML = D.channels.filter(function (c) { return c.positive; }).map(cardHtml).join("");
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

  // ---------------------------------------------------------- spotlight figures (click to expand)
  (D.spotlights || []).forEach(function (s, i) {
    var host = $(s.where); if (!host) return;
    var id = "spot" + i;
    host.insertAdjacentHTML("beforeend",
      '<div class="card traffic spot">' +
        '<div class="tp-fig"><div class="sub" style="margin-top:0">' + (s.kind ? '<span class="kind ' + s.kind + '">' + ({ estimate: "Estimate", survey: "Survey", recorded: "Recorded", reported: "Reported" })[s.kind] + "</span> " : "") + '<span class="spot-tag">' + esc(s.tag) + "</span> " + esc(s.label) + "</div>" +
          '<button type="button" class="bigbtn" aria-expanded="false" aria-controls="' + id + '"><span class="big" style="font-size:clamp(32px,4.6vw,48px)">' + esc(s.fig) + '</span><span class="sub fn">' + esc(s.figNote) + '</span><span class="more">What is behind this figure? <i>▾</i></span></button>' +
        "</div>" +
        '<div class="tp-stats">' + s.stats.map(function (t) { return '<div class="mini"><b>' + esc(t.v) + "</b><span>" + esc(t.l) + "</span></div>"; }).join("") + "</div>" +
        '<div class="tp-more" id="' + id + '" hidden>' +
          s.more.map(function (m) { return "<div><h4>" + esc(m.h) + "</h4><p>" + esc(m.p) + "</p></div>"; }).join("") +
          '<div class="tp-caveat"><h4>How to read it</h4><p>' + esc(s.caveat) + "</p></div>" +
          '<div class="tp-src">Source: ' + esc(s.source) + "</div>" +
        "</div>" +
      "</div>");
  });
  [].slice.call(document.querySelectorAll(".spot .bigbtn")).forEach(function (b) {
    b.addEventListener("click", function () {
      var open = b.getAttribute("aria-expanded") !== "true";
      b.setAttribute("aria-expanded", String(open));
      $(b.getAttribute("aria-controls")).hidden = !open;
      b.querySelector(".more").firstChild.nodeValue = open ? "Hide details " : "What is behind this figure? ";
    });
  });

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
