// ===== CHECKLIST =====
function toggle(el) {
  el.classList.toggle("done");
  updateStats();
}

function updateStats() {
  const all = document.querySelectorAll("#page-checklist .check-item");
  const done = document.querySelectorAll(
    "#page-checklist .check-item.done",
  );
  const pct = all.length
    ? Math.round((done.length / all.length) * 100)
    : 0;

  document.getElementById("done-count").textContent = done.length;
  document.getElementById("total-count").textContent = all.length;
  document.getElementById("pct-count").textContent = pct + "%";
  document.getElementById("sp-fill").style.width = pct + "%";
  document.getElementById("sp-text").textContent =
    done.length + " / " + all.length + " selesai";

  let phaseDone = 0;
  for (let i = 1; i <= 5; i++) {
    const phase = document.getElementById("phase-" + i);
    if (!phase) continue;
    const items = phase.querySelectorAll(".check-item");
    const doneItems = phase.querySelectorAll(".check-item.done");
    const badge = document.getElementById("badge-" + i);
    if (items.length > 0 && items.length === doneItems.length) {
      badge.style.display = "block";
      phaseDone++;
    } else {
      badge.style.display = "none";
    }
  }
  document.getElementById("phase-done").textContent = phaseDone;

  if (done.length === all.length && all.length > 0) {
    document.getElementById("celebration").classList.add("show");
  } else {
    document.getElementById("celebration").classList.remove("show");
  }
}

function resetAll() {
  if (confirm("Reset semua checklist dari awal?")) {
    document
      .querySelectorAll("#page-checklist .check-item")
      .forEach((el) => el.classList.remove("done"));
    updateStats();
    saveChecklistState();
  }
}

// ===== Q&A =====
function toggleQNA(el) {
  const isOpen = el.classList.contains("open");
  document
    .querySelectorAll(".qna-item")
    .forEach((q) => q.classList.remove("open"));
  if (!isOpen) el.classList.add("open");
}


function saveChecklistState() {
  const items = document.querySelectorAll("#page-checklist .check-item");
  Verdict.patch({
    checklist: Array.from(items).map((el) => el.classList.contains("done")),
  });
}

(function initPanduan() {
  const d = Verdict.read();
  const items = document.querySelectorAll("#page-checklist .check-item");
  if (d.checklist && d.checklist.length === items.length) {
    d.checklist.forEach((done, i) => {
      if (items[i] && done) items[i].classList.add("done");
    });
  } else {
    Verdict.patch({
      checklist: Array.from(items).map((el) => el.classList.contains("done")),
    });
  }
  const _origToggle = toggle;
  window.toggle = function (el) {
    _origToggle(el);
    saveChecklistState();
  };
  updateStats();
})();

