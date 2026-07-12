(() => {
  const key = "ipm-theme-v1";
  const media = matchMedia("(prefers-color-scheme: dark)");
  let choice = localStorage.getItem(key) || "system";

  function resolved(value = choice) {
    return value === "system" ? (media.matches ? "dark" : "light") : value;
  }

  function apply(value, persist = true) {
    choice = ["system", "light", "dark"].includes(value) ? value : "system";
    if (persist) localStorage.setItem(key, choice);
    const theme = resolved();
    document.documentElement.dataset.themeChoice = choice;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelectorAll("[data-ui-theme]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.uiTheme === choice));
    });
  }

  apply(choice, false);

  const icons = {
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></svg>',
    model: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="m11 7-5 9m7-9 5 9M7 18h10"/></svg>',
    method: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h5v5H4zM15 13h5v5h-5zM9 8h4a4 4 0 0 1 4 4v1M7 11v7h8"/></svg>',
    knowledge: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22zM20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22z"/></svg>',
    tables: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 9v11M15 9v11"/></svg>',
    about: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>'
  };

  function installSidebar() {
    if (document.querySelector(".dashboard-sidebar")) return;
    const path = location.pathname;
    const inKnowledge = path.includes("/knowledge/");
    const inArticle = inKnowledge && !path.endsWith("/knowledge/");
    const inTables = path.includes("/tables/");
    const root = inArticle ? "../../" : (inKnowledge || inTables ? "../" : "./");
    const active = inKnowledge ? "knowledge" : (inTables ? "tables" : "home");
    const links = [
      ["home", root, "Overview"],
      ["model", `${root}#graph`, "Model"],
      ["method", `${root}#approach`, "Method"],
      ["knowledge", `${root}knowledge/`, "Knowledge"],
      ["tables", `${root}tables/`, "Tables"],
      ["about", `${root}#about`, "About"]
    ];
    const sidebar = document.createElement("aside");
    sidebar.className = "dashboard-sidebar";
    sidebar.id = "dashboardSidebar";
    sidebar.setAttribute("aria-label", "Main navigation");
    sidebar.innerHTML = `
      <div class="dashboard-sidebar__header">
        <a class="dashboard-sidebar__brand" href="${root}" aria-label="IPM home"><span class="mark"></span><span class="dashboard-sidebar__label">IPM</span></a>
        <button class="dashboard-sidebar__collapse" type="button" aria-label="Collapse navigation" aria-expanded="true">${icons.chevron}</button>
      </div>
      <nav class="dashboard-sidebar__nav">${links.map(([key, href, label]) => `<a href="${href}"${key === active ? ' aria-current="page"' : ""} title="${label}">${icons[key]}<span class="dashboard-sidebar__label">${label}</span></a>`).join("")}</nav>`;
    const backdrop = document.createElement("button");
    backdrop.type = "button";
    backdrop.className = "dashboard-sidebar__backdrop";
    backdrop.setAttribute("aria-label", "Close navigation");
    document.body.prepend(backdrop);
    document.body.prepend(sidebar);
    document.body.classList.add("has-dashboard-sidebar");
    document.body.dataset.uiComponent = "app-shell";
    sidebar.dataset.uiComponent = "app-shell-sidebar";

    const collapsed = localStorage.getItem("ipm-sidebar-collapsed") === "true";
    const collapseButton = sidebar.querySelector(".dashboard-sidebar__collapse");
    const setCollapsed = (value) => {
      document.body.classList.toggle("dashboard-sidebar-collapsed", value);
      collapseButton.setAttribute("aria-expanded", String(!value));
      collapseButton.setAttribute("aria-label", value ? "Expand navigation" : "Collapse navigation");
      localStorage.setItem("ipm-sidebar-collapsed", String(value));
    };
    setCollapsed(collapsed);
    collapseButton.addEventListener("click", () => setCollapsed(!document.body.classList.contains("dashboard-sidebar-collapsed")));

    const header = document.querySelector(".topbar-inner, .nav");
    const menuButton = document.createElement("button");
    menuButton.type = "button";
    menuButton.className = "dashboard-menu-button";
    menuButton.setAttribute("aria-label", "Open navigation");
    menuButton.setAttribute("aria-controls", sidebar.id);
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.innerHTML = icons.menu;
    if (header) header.prepend(menuButton);
    const setMobileOpen = (value) => {
      document.body.classList.toggle("dashboard-sidebar-mobile-open", value);
      menuButton.setAttribute("aria-expanded", String(value));
      if (!value) menuButton.focus({ preventScroll: true });
    };
    menuButton.addEventListener("click", () => setMobileOpen(!document.body.classList.contains("dashboard-sidebar-mobile-open")));
    backdrop.addEventListener("click", () => setMobileOpen(false));
    sidebar.addEventListener("click", (event) => { if (event.target.closest("a") && matchMedia("(max-width: 899px)").matches) setMobileOpen(false); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape" && document.body.classList.contains("dashboard-sidebar-mobile-open")) setMobileOpen(false); });
  }

  function installNavigation() {
    if (!location.pathname.includes("/knowledge/") && !location.pathname.includes("/tables/")) return;
    const nav = document.querySelector(".navlinks");
    if (!nav) return;
    nav.removeAttribute("aria-label");
    nav.innerHTML = "";
  }

  function installToggle() {
    if (document.getElementById("themeToggle") || document.querySelector(".ui-theme-toggle")) return;
    const nav = document.querySelector(".nav");
    if (!nav) return;
    const host = nav.querySelector(".navlinks") || nav.querySelector(":scope > div") || nav;
    const group = document.createElement("div");
    group.className = "ui-theme-toggle";
    group.dataset.uiComponent = "theme-toggle";
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", "Appearance");
    [
      ["system", "System", "S"],
      ["light", "Light", "L"],
      ["dark", "Dark", "D"]
    ].forEach(([value, label, shortLabel]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.uiTheme = value;
      button.textContent = label;
      button.setAttribute("aria-label", `${label} theme`);
      button.setAttribute("title", `${label} theme (${shortLabel})`);
      button.onclick = () => apply(value);
      group.appendChild(button);
    });
    host.appendChild(group);
    apply(choice, false);
  }

  function installComponentContracts() {
    document.documentElement.dataset.uiComponent = "theme-provider";
    document.querySelectorAll("#themeToggle, .ui-theme-toggle").forEach((node) => {
      node.dataset.uiComponent = "theme-toggle";
    });
    document.querySelectorAll(".page-header, header.hero").forEach((node) => {
      node.dataset.uiComponent = "page-header";
    });
    document.querySelectorAll(".graph-toolbar, .toolbar").forEach((node) => {
      node.dataset.uiComponent = "map-toolbar";
    });
    document.querySelectorAll(".source-note").forEach((node) => {
      node.dataset.uiComponent = "source-note";
    });
  }

  function installUi() {
    installSidebar();
    installNavigation();
    installToggle();
    installComponentContracts();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", installUi);
  else installUi();
  media.addEventListener("change", () => { if (choice === "system") apply("system", false); });
})();
