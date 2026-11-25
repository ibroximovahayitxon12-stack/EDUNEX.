(function () {
  let currentPage = "dashboard";
  let mobileMenuOpen = false;

  const ROLE_META = {
    director: { subBrand: "Direktor bo'limi", label: "Direktor" },
    teacher: { subBrand: "O'qituvchi kabineti", label: "O'qituvchi" },
    student: { subBrand: "O'quvchi kundaligi", label: "O'quvchi" },
  };

  function getViewHandler(role) {
    if (role === "director") return DirectorView;
    if (role === "teacher") return TeacherView;
    return StudentView;
  }

  function renderApp() {
    const db = Store.getState();
    document.documentElement.setAttribute("data-theme", db.theme || "light");

    const user = Store.getCurrentUser();
    if (!user) {
      AuthView.render(() => {
        currentPage = "dashboard";
        renderApp();
      });
      return;
    }

    const college = Store.getCurrentCollege();
    const handler = getViewHandler(user.role);
    const navItems = handler.getNav(user, college);
    if (!navItems.some((n) => n.id === currentPage)) {
      currentPage = navItems[0].id;
    }
    const activeNav = navItems.find((n) => n.id === currentPage);
    const meta = ROLE_META[user.role];

    const footerBox =
      user.role === "director"
        ? `<div class="font-bold text-xs">${UI.esc(college.academicYear)}</div><div class="text-xs text-muted">${UI.esc(college.semester)}</div>`
        : user.role === "teacher"
        ? `<div class="font-bold text-xs">Fan: ${UI.esc(user.subject)}</div><div class="text-xs text-muted">${(user.assignedGroups || []).length} ta biriktirilgan guruh</div>`
        : `<div class="font-bold text-xs">Guruh: ${UI.esc(user.groupCode)}</div><div class="text-xs text-muted">${UI.esc(user.direction || "Kompyuter injiniringi")}</div>`;

    const appEl = document.getElementById("app");
    appEl.innerHTML = `
      <div class="app-layout">
        <div class="sidebar-overlay ${mobileMenuOpen ? "open" : ""}" id="sidebar-overlay"></div>
        <aside class="sidebar ${mobileMenuOpen ? "open" : ""}" id="sidebar">
          <div class="sidebar-header">
            <div class="brand-lockup">
              <div class="brand-logo">${Icons.school("icon-lg")}</div>
              <div>
                <div class="brand-name">EDUNEX</div>
                <div class="brand-sub">${UI.esc(college.shortName || "Tizim")} • ${UI.esc(meta.subBrand)}</div>
              </div>
            </div>
            <button class="icon-btn sidebar-close-btn" id="sidebar-close-btn" type="button" aria-label="Menyuni yopish">
              ${Icons.close("icon-sm")}
            </button>
          </div>

          <nav class="sidebar-nav">
            <div class="nav-section-label">EDUNEX Navigatsiya</div>
            ${navItems
              .map(
                (item) => `
              <button type="button" class="nav-item ${currentPage === item.id ? "active" : ""}" data-nav="${item.id}">
                <span class="nav-item-left">
                  ${Icons[item.icon]("icon-svg")}
                  <span>${UI.esc(item.label)}</span>
                </span>
                ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ""}
              </button>
            `
              )
              .join("")}
          </nav>

          <div class="sidebar-footer">
            <div class="sidebar-info-box mb-3">
              ${footerBox}
            </div>
            <button type="button" class="btn btn-ghost btn-sm btn-block" id="logout-btn" style="justify-content:flex-start;color:var(--danger-text);">
              ${Icons.logout("icon-sm")} Tizimdan chiqish
            </button>
          </div>
        </aside>

        <div class="main-area">
          <header class="topbar">
            <div class="topbar-left">
              <button class="mobile-menu-btn" id="mobile-menu-btn" type="button">${Icons.menu("icon-svg")}</button>
              <div>
                <h1 class="page-heading">${UI.esc(activeNav?.label || "Bosh sahifa")}</h1>
              </div>
            </div>

            <div class="topbar-right">
              <div class="topbar-search">
                <span class="topbar-search-icon">${Icons.search("icon-sm")}</span>
                <input type="text" id="global-search" placeholder="Tezkor o'tish (masalan: e'lon, jadval)..." />
              </div>

              <button class="icon-btn" id="theme-toggle-btn" title="Tungi / Kunduzgi rejim" type="button">
                ${db.theme === "dark" ? Icons.sun("icon-sm") : Icons.moon("icon-sm")}
              </button>

              <button class="icon-btn" id="notif-btn" title="Bildirishnomalar" type="button">
                ${Icons.bell("icon-sm")}
                <span class="dot"></span>
              </button>

              <div class="user-pill" id="user-pill-btn" title="Profil">
                <span class="avatar">${UI.initials(user.fullName)}</span>
                <div class="user-pill-info" style="line-height:1.2;">
                  <div class="text-xs font-bold">${UI.esc(user.fullName)}</div>
                  <div class="text-xs text-muted">${user.role === "student" ? `${UI.esc(user.groupCode)} • ` : ""}${UI.esc(meta.label)}</div>
                </div>
              </div>
            </div>
          </header>

          <main class="content-body page-enter" id="view-root"></main>
        </div>
      </div>
    `;

    // Bind Shell Events
    document.querySelectorAll("[data-nav]").forEach((btn) => {
      btn.onclick = () => {
        currentPage = btn.dataset.nav;
        mobileMenuOpen = false;
        renderApp();
      };
    });

    document.getElementById("mobile-menu-btn").onclick = () => {
      mobileMenuOpen = !mobileMenuOpen;
      document.getElementById("sidebar").classList.toggle("open", mobileMenuOpen);
      document.getElementById("sidebar-overlay").classList.toggle("open", mobileMenuOpen);
    };
    document.getElementById("sidebar-overlay").onclick = () => {
      mobileMenuOpen = false;
      document.getElementById("sidebar").classList.remove("open");
      document.getElementById("sidebar-overlay").classList.remove("open");
    };
    const closeSidebarBtn = document.getElementById("sidebar-close-btn");
    if (closeSidebarBtn) {
      closeSidebarBtn.onclick = () => {
        mobileMenuOpen = false;
        document.getElementById("sidebar").classList.remove("open");
        document.getElementById("sidebar-overlay").classList.remove("open");
      };
    }

    document.getElementById("theme-toggle-btn").onclick = () => {
      Store.setTheme(db.theme === "dark" ? "light" : "dark");
      renderApp();
    };

    document.getElementById("logout-btn").onclick = () => {
      Store.logout();
      currentPage = "dashboard";
      UI.toast("Tizimdan chiqdingiz", "primary");
      renderApp();
    };

    document.getElementById("notif-btn").onclick = () => {
      const anns = db.announcements.filter((a) => a.collegeId === college.id).slice(0, 4);
      UI.openModal({
        title: "So'nggi bildirishnomalar",
        bodyHtml: `
          <div style="display:flex;flex-direction:column;gap:10px;">
            ${anns
              .map(
                (a) => `
              <div class="notice-card">
                <div class="flex items-center justify-between mb-1">
                  <span class="badge badge-primary">${UI.esc(a.audience)}</span>
                  <span class="text-xs text-muted">${UI.esc(a.date)}</span>
                </div>
                <div class="font-bold text-sm">${UI.esc(a.title)}</div>
                <div class="text-xs text-secondary mt-1">${UI.esc(a.body)}</div>
              </div>
            `
              )
              .join("")}
          </div>
        `,
      });
    };

    document.getElementById("user-pill-btn").onclick = () => {
      UI.openModal({
        title: "Foydalanuvchi profili",
        bodyHtml: `
          <div class="flex items-center gap-3 mb-4">
            <span class="avatar avatar-lg">${UI.initials(user.fullName)}</span>
            <div>
              <div class="font-bold text-lg">${UI.esc(user.fullName)}</div>
              <div class="text-xs text-muted">${UI.esc(meta.label)} • ${UI.esc(college.name)}</div>
            </div>
          </div>
          <div class="p-3 mb-4" style="background:var(--bg-surface-2);border-radius:10px;padding:12px;">
            <div class="text-xs mb-1"><strong>Login:</strong> <code>${UI.esc(user.login)}</code></div>
            <div class="text-xs mb-1"><strong>Telefon:</strong> ${UI.esc(user.phone || "—")}</div>
            ${user.groupCode ? `<div class="text-xs"><strong>Guruh:</strong> ${UI.esc(user.groupCode)}</div>` : ""}
          </div>
          <button class="btn btn-danger btn-block" id="modal-logout-btn">${Icons.logout("icon-sm")} Tizimdan chiqish</button>
        `,
        onMount(close) {
          document.getElementById("modal-logout-btn").onclick = () => {
            close();
            Store.logout();
            renderApp();
          };
        },
      });
    };

    document.getElementById("global-search").onkeydown = (e) => {
      if (e.key === "Enter") {
        const q = e.target.value.trim().toLowerCase();
        const found = navItems.find((n) => n.label.toLowerCase().includes(q));
        if (found) {
          currentPage = found.id;
          renderApp();
        } else {
          UI.toast(`"${q}" bo'yicha bo'lim topilmadi`, "warning");
        }
      }
    };

    const viewRoot = document.getElementById("view-root");
    handler.render(currentPage, user, college, {
      container: viewRoot,
      navigate(nextPage) {
        currentPage = nextPage;
        renderApp();
      },
      rerender() {
        renderApp();
      },
    });
  }

  document.addEventListener("DOMContentLoaded", renderApp);
})();
