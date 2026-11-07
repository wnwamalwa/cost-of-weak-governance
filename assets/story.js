// Side story on the Home tab: explains the map in plain terms and updates with the indicator and year.
(function () {
  var $ = function (id) { return document.getElementById(id); };
  if (!$("story")) return;
  var fmt = function (v) { return (v < 0 ? "−" : "") + Math.abs(v).toFixed(2); };
  var last = null, guessed = {};

  function ordinal(n) { var s = ["th", "st", "nd", "rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }

  function render(e) {
    var d = e.detail; last = d;
    var beat = d.n - d.kr, share = Math.round(100 * beat / (d.n - 1));
    $("stNow").innerHTML = "Each country is coloured by its <b>" + d.ind.name + "</b> score in " + d.year +
      ": <span class='st-red'>red</span> is weakest, <span class='st-green'>green</span> strongest. " +
      "Kenya is <b>" + ordinal(d.kr) + " of " + d.n + "</b>, ahead of " + beat + " countries (" + share + "%). " +
      d.best + " scores highest and " + d.worst + " lowest.";
    var c = d.ind.citizen || { line: "", items: [] };
    $("stLine").textContent = c.line;
    $("stItems").innerHTML = c.items.map(function (it, i) {
      return '<details' + (i === 0 ? " open" : "") + '><summary><span class="ic">' + it.icon + "</span>" + it.title + "</summary><p>" + it.text + "</p></details>";
    }).join("");
    // keep one open at a time
    [].slice.call(document.querySelectorAll("#stItems details")).forEach(function (el) {
      el.addEventListener("toggle", function () { if (el.open) [].slice.call(document.querySelectorAll("#stItems details")).forEach(function (o) { if (o !== el) o.open = false; }); });
    });
    var key = d.ind.key + d.year;
    $("stQ").innerHTML = "Out of " + d.n + " African countries, where do you think Kenya ranks on <b>" + d.ind.name + "</b> in " + d.year + "? (1 = best)";
    $("stG").max = d.n;
    if (guessed[key]) showAnswer(guessed[key]); else $("stA").hidden = true;
  }

  function showAnswer(g) {
    var d = last, diff = Math.abs(g - d.kr);
    var verdict = diff === 0 ? "Spot on!" : diff <= 3 ? "Very close." : g < d.kr ? "Kenya does worse than you thought." : "Kenya does better than you thought.";
    $("stA").innerHTML = "<b>" + verdict + "</b> Kenya is " + ordinal(d.kr) + ". You guessed " + ordinal(g) + ".";
    $("stA").hidden = false;
  }

  $("stG").addEventListener("input", function () { $("stGV").textContent = this.value; });
  $("stGo").addEventListener("click", function () {
    if (!last) return;
    var g = +$("stG").value; guessed[last.ind.key + last.year] = g; showAnswer(g);
  });

  // per-person cost, same sum as the headline on The cost tab
  try {
    var H = window.CWG_DATA.headline, pp = H.gdpKsh * H.shareOfGDP / H.population;
    $("stCost").textContent = "≈ KSh " + (Math.round(pp / 100) * 100).toLocaleString("en-GB");
  } catch (e) {}

  document.addEventListener("cwg:map", render);
  if (window.CWG_LAST) render({ detail: window.CWG_LAST });
})();
