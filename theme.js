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

  function installNavigation() {
    if (!location.pathname.includes("/knowledge/")) return;
    const nav = document.querySelector(".navlinks");
    if (!nav) return;
    const depth = location.pathname.replace(/\/$/, "").split("/").length;
    const root = depth > 3 ? "../../" : "../";
    const knowledge = depth > 3 ? "../" : "./";
    nav.setAttribute("aria-label", "Primary navigation");
    nav.innerHTML = [
      [root, "Home"],
      [`${root}#graph`, "Model"],
      [`${root}#approach`, "Method"],
      [knowledge, "Knowledge", true],
      [`${root}tables/`, "Tables"]
    ].map(([href, label, current]) =>
      `<a class="pill" href="${href}"${current ? ' aria-current="page"' : ""}>${label}</a>`
    ).join("");
  }

  function installToggle() {
    if (document.getElementById("themeToggle") || document.querySelector(".ui-theme-toggle")) return;
    const nav = document.querySelector(".nav");
    if (!nav) return;
    const host = nav.querySelector(".navlinks") || nav.querySelector(":scope > div") || nav;
    const group = document.createElement("div");
    group.className = "ui-theme-toggle";
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

  function installUi() {
    installNavigation();
    installToggle();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", installUi);
  else installUi();
  media.addEventListener("change", () => { if (choice === "system") apply("system", false); });
})();
