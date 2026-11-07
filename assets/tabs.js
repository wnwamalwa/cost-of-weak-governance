// Tabs along the top on desktop; on phones every section shows in one scroll.
(function () {
  var panes = [].slice.call(document.querySelectorAll(".pane"));
  var bar = document.getElementById("tabbar");
  if (!panes.length || !bar) return;
  document.body.classList.add("tabbed");
  bar.innerHTML = panes.map(function (p) {
    return '<button type="button" role="tab" aria-controls="' + p.id + '" data-id="' + p.id + '">' + p.dataset.tab + "</button>";
  }).join("");
  var btns = [].slice.call(bar.querySelectorAll("button"));
  function show(id, push) {
    var target = null;
    if (!panes.some(function (p) { return p.id === id; })) {
      // a link to something inside a tab (e.g. a source note): open that tab, then scroll to it
      var el = id && document.getElementById(id), host = el && el.closest(".pane");
      if (host) { target = el; id = host.id; } else id = panes[0].id;
    }
    panes.forEach(function (p) { p.classList.toggle("active", p.id === id); });
    btns.forEach(function (b) { b.setAttribute("aria-selected", String(b.dataset.id === id)); });
    if (push) { try { history.replaceState(null, "", "#" + id); } catch (e) {} }
    if (target) { setTimeout(function () { target.scrollIntoView({ block: "start" }); }, 0); return; }
    if (window.matchMedia("(min-width: 901px)").matches) window.scrollTo({ top: 0 });
  }
  btns.forEach(function (b) { b.addEventListener("click", function () { show(b.dataset.id, true); }); });
  window.addEventListener("hashchange", function () { show(location.hash.slice(1), false); });
  show(location.hash.slice(1), false);
  // stop the browser jumping down to the section on load (desktop tabs show it at the top)
  window.addEventListener("load", function () { if (window.matchMedia("(min-width: 901px)").matches && panes.some(function (p) { return "#" + p.id === location.hash || !location.hash; })) setTimeout(function () { window.scrollTo(0, 0); }, 0); });
})();
