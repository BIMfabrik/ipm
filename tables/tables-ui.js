(() => {
  const tableRoot = document.getElementById("table");
  const status = document.getElementById("status");
  const search = document.getElementById("search");
  const language = document.getElementById("language");
  if (!tableRoot || !status || !search || !language) return;

  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  tableRoot.setAttribute("tabindex", "0");
  tableRoot.setAttribute("aria-label", "Scrollable data table");

  function localizeChrome() {
    const german = language.value === "de";
    search.placeholder = german ? "Sichtbare Zeilen durchsuchen…" : "Search all visible rows…";
    search.setAttribute("aria-label", search.placeholder);
    document.getElementById("clear").textContent = german ? "Filter zurücksetzen" : "Clear filters";
    if (status.textContent.includes("loaded") || status.textContent.includes("geladen")) {
      status.textContent = german ? "GitHub-JSON geladen" : "GitHub JSON loaded";
    }
  }

  function enhanceRenderedTable() {
    const table = tableRoot.querySelector("table");
    if (!table) return;
    table.querySelectorAll("th[data-key]").forEach((header) => {
      header.setAttribute("tabindex", "0");
      header.setAttribute("role", "button");
      header.setAttribute("aria-label", `${header.textContent.trim()}, sort column`);
      header.onkeydown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          header.click();
        }
      };
    });
    const rows = table.querySelectorAll("tbody tr");
    rows.forEach((row) => {
      row.setAttribute("tabindex", "0");
      row.setAttribute("role", "button");
      row.setAttribute("aria-label", `Inspect row: ${row.cells[0]?.textContent || "data row"}`);
      row.onkeydown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          row.click();
        }
      };
    });
    const existingEmpty = tableRoot.querySelector(".empty-state");
    if (rows.length) existingEmpty?.remove();
    if (!rows.length && !existingEmpty) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.setAttribute("role", "status");
      empty.textContent = language.value === "de"
        ? "Keine passenden Zeilen. Filter zurücksetzen oder einen anderen Suchbegriff verwenden."
        : "No matching rows. Clear the filters or try another search term.";
      tableRoot.appendChild(empty);
    }
  }

  new MutationObserver(enhanceRenderedTable).observe(tableRoot, { childList: true, subtree: true });
  language.addEventListener("change", () => requestAnimationFrame(() => {
    localizeChrome();
    enhanceRenderedTable();
  }));
  localizeChrome();
  enhanceRenderedTable();
})();
