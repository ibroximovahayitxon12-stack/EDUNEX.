(function () {
  const state = {
    mode: "login", // "login" | "register"
    loginRole: "student",
    showPass: false,
    regStep: 1,
    regData: {
      fullName: "",
      phone: "+998 ",
      email: "",
      login: "",
      password: "",
      confirmPassword: "",
      collegeName: "",
      collegeType: "Kollej",
      region: "Toshkent shahri",
      stir: "",
      academicYear: "2026-2027 o'quv yili",
      departments: ["Dasturlash", "Kompyuter injiniringi", "Ma'lumotlar bazasi"],
      gradingSystem: "5 ballik tizim",
      withStarterData: true,
    },
  };

  const ALL_DEPTS = [
    "Dasturlash",
    "Kompyuter injiniringi",
    "Ma'lumotlar bazasi",
    "Kiberxavfsizlik",
    "Matematika va fizika",
    "Xorijiy tillar",
    "Mobil texnologiyalar",
    "Buxgalteriya va moliya",
  ];

  const REGIONS = [
    "Toshkent shahri",
    "Toshkent viloyati",
    "Samarqand viloyati",
    "Farg'ona viloyati",
    "Andijon viloyati",
    "Namangan viloyati",
    "Buxoro viloyati",
    "Xorazm viloyati",
    "Qashqadaryo viloyati",
    "Surxondaryo viloyati",
    "Navoiy viloyati",
    "Jizzax viloyati",
    "Sirdaryo viloyati",
    "Qoraqalpog'iston Resp.",
  ];

  function passwordStrength(pw) {
    let score = 0;
    if (pw.length >= 6) score += 25;
    if (pw.length >= 9) score += 25;
    if (/[A-Z]/.test(pw) || /[0-9]/.test(pw)) score += 25;
    if (/[^A-Za-z0-9]/.test(pw)) score += 25;
    const color = score <= 25 ? "#dc2626" : score <= 50 ? "#d97706" : score <= 75 ? "#3b5bdb" : "#16a34a";
    const label = score <= 25 ? "Zaif" : score <= 50 ? "O'rtacha" : score <= 75 ? "Yaxshi" : "Kuchli";
    return { score, color, label };
  }

  function renderLoginForm() {
    const db = Store.getState();
    const remembered = db.rememberLogin || "";
    const defaultLogin =
      remembered ||
      (state.loginRole === "director"
        ? "dilshod.rahimov"
        : state.loginRole === "teacher"
        ? "gulnora.karimova"
        : "sardor.alimov");
    const defaultPass =
      state.loginRole === "director"
        ? "Direktor@2026"
        : state.loginRole === "teacher"
        ? "Oqtuvchi@2026"
        : "Oquvchi@2026";

    return `
      <div class="auth-card-head">
        <div class="auth-card-icon">${Icons.school("icon-lg")}</div>
        <h2>Tizimga kirish</h2>
        <p>${UI.esc(Store.getCurrentCollege()?.name || "Kollej Kundaligi")}</p>
      </div>

      <div class="form-group">
        <span class="form-label">Foydalanuvchi roli</span>
        <div class="role-segment">
          ${[
            { id: "director", label: "Direktor" },
            { id: "teacher", label: "O'qituvchi" },
            { id: "student", label: "O'quvchi" },
          ]
            .map(
              (r) => `
            <button type="button" class="role-segment-btn ${state.loginRole === r.id ? "active" : ""}" data-role="${r.id}">
              ${r.label}
            </button>
          `
            )
            .join("")}
        </div>
      </div>

      <form id="login-form">
        <div class="form-group">
          <label class="form-label" for="login-username">Login</label>
          <div class="input-wrap">
            <span class="input-icon">${Icons.user("icon-sm")}</span>
            <input id="login-username" class="form-control has-left" type="text" value="${UI.esc(defaultLogin)}" placeholder="Masalan: sardor.alimov" required />
          </div>
        </div>

        <div class="form-group">
          <div class="form-label-row">
            <label class="form-label" for="login-password">Parol</label>
            <a href="#" id="forgot-pass-link" class="text-xs font-semibold">Parolni unutdingizmi?</a>
          </div>
          <div class="input-wrap">
            <span class="input-icon">${Icons.lock("icon-sm")}</span>
            <input id="login-password" class="form-control has-left has-right" type="${state.showPass ? "text" : "password"}" value="${UI.esc(defaultPass)}" placeholder="••••••••" required />
            <button type="button" class="input-action" id="toggle-pass-btn" title="Parolni ko'rsatish">
              ${state.showPass ? Icons.eyeOff("icon-sm") : Icons.eye("icon-sm")}
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between mb-4">
          <label class="flex items-center gap-2 text-sm text-secondary" style="cursor:pointer;">
            <input type="checkbox" id="remember-me" ${remembered ? "checked" : ""} />
            Eslab qolish
          </label>
          <button type="button" class="btn-ghost btn-xs" id="switch-to-reg-inline">
            Direktor sifatida ochish →
          </button>
        </div>

        <div id="login-error" class="badge badge-danger hidden mb-3" style="width:100%;justify-content:center;padding:8px 12px;border-radius:8px;"></div>

        <button type="submit" class="btn btn-primary btn-block" style="padding:11px 16px;">
          ${Icons.login("icon-sm")} Kirish
        </button>
      </form>
    `;
  }

  function renderRegisterWizard() {
    const d = state.regData;
    const pwInfo = passwordStrength(d.password);
    return `
      <div class="auth-card-head" style="margin-bottom:14px;">
        <div class="auth-card-icon">${Icons.building("icon-lg")}</div>
        <h2>Direktor ro'yxatdan o'tishi</h2>
        <p>O'z kollej yoki texnikumingiz uchun EDUNEX tizimini yarating</p>
      </div>

      <div class="wizard-steps">
        ${[
          { n: 1, label: "1. Shaxsiy" },
          { n: 2, label: "2. Muassasa" },
          { n: 3, label: "3. Sozlamalar" },
        ]
          .map(
            (s) => `
          <div class="wizard-step ${state.regStep === s.n ? "active" : state.regStep > s.n ? "done" : ""}">
            <div class="wizard-step-bar"></div>
            <span class="wizard-step-label">${s.label}</span>
          </div>
        `
          )
          .join("")}
      </div>

      <form id="director-reg-form">
        ${
          state.regStep === 1
            ? `
          <div class="form-group">
            <label class="form-label">Direktor F.I.Sh. *</label>
            <input class="form-control" id="reg-fullname" value="${UI.esc(d.fullName)}" placeholder="Masalan: Akmaljon Karimov" required />
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Telefon raqami *</label>
              <input class="form-control" id="reg-phone" value="${UI.esc(d.phone)}" placeholder="+998 90 123 45 67" required />
            </div>
            <div class="form-group">
              <label class="form-label">Elektron pochta</label>
              <input class="form-control" id="reg-email" type="email" value="${UI.esc(d.email)}" placeholder="director@kollej.uz" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Tizimga kirish logini *</label>
            <input class="form-control" id="reg-login" value="${UI.esc(d.login)}" placeholder="Masalan: akmal.director" required />
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Parol *</label>
              <input class="form-control" id="reg-password" type="password" value="${UI.esc(d.password)}" placeholder="Kamida 6 ta belgi" required />
              <div class="strength-meter"><div class="strength-fill" id="pw-strength-bar" style="width:${pwInfo.score}%;background:${pwInfo.color};"></div></div>
              <span class="text-xs text-muted" id="pw-strength-text">${d.password ? `Parol kuchi: ${pwInfo.label}` : "Kamida 6 ta belgi kiriting"}</span>
            </div>
            <div class="form-group">
              <label class="form-label">Parolni tasdiqlang *</label>
              <input class="form-control" id="reg-confirm" type="password" value="${UI.esc(d.confirmPassword)}" placeholder="Parolni takrorlang" required />
            </div>
          </div>
        `
            : state.regStep === 2
            ? `
          <div class="form-group">
            <label class="form-label">Ta'lim muassasasi nomi *</label>
            <input class="form-control" id="reg-col-name" value="${UI.esc(d.collegeName)}" placeholder="Masalan: Samarqand Axborot Texnologiyalari Texnikumi" required />
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Muassasa turi</label>
              <select class="form-control" id="reg-col-type">
                ${["Kollej", "Texnikum", "Akademik litsey", "Kasb-hunar maktabi"]
                  .map((t) => `<option value="${t}" ${d.collegeType === t ? "selected" : ""}>${t}</option>`)
                  .join("")}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Hudud (Viloyat / Shahar)</label>
              <select class="form-control" id="reg-region">
                ${REGIONS.map((r) => `<option value="${r}" ${d.region === r ? "selected" : ""}>${r}</option>`).join("")}
              </select>
            </div>
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">STIR / Litsenziya raqami</label>
              <input class="form-control" id="reg-stir" value="${UI.esc(d.stir)}" placeholder="Masalan: 305482910" />
            </div>
            <div class="form-group">
              <label class="form-label">O'quv yili</label>
              <input class="form-control" id="reg-year" value="${UI.esc(d.academicYear)}" />
            </div>
          </div>
        `
            : `
          <div class="form-group">
            <label class="form-label">Kafedralar va yo'nalishlarni tanlang</label>
            <div class="chip-select-grid" id="dept-chips">
              ${ALL_DEPTS.map(
                (dept) => `
                <button type="button" class="chip-toggle ${d.departments.includes(dept) ? "selected" : ""}" data-dept="${UI.esc(dept)}">
                  ${d.departments.includes(dept) ? "✓ " : ""}${UI.esc(dept)}
                </button>
              `
              ).join("")}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Baholash tizimi</label>
            <select class="form-control" id="reg-grading">
              <option value="5 ballik tizim" ${d.gradingSystem === "5 ballik tizim" ? "selected" : ""}>5 ballik tizim (2–5)</option>
              <option value="100 ballik tizim" ${d.gradingSystem === "100 ballik tizim" ? "selected" : ""}>100 ballik kredit-modul tizimi</option>
            </select>
          </div>

          <label class="flex items-center gap-2 p-3 mb-3" style="background:var(--bg-surface-2);border:1px solid var(--border-color);border-radius:10px;padding:11px 12px;cursor:pointer;">
            <input type="checkbox" id="reg-starter" ${d.withStarterData ? "checked" : ""} />
            <div>
              <div class="text-sm font-semibold">Boshlang'ich namuna guruh va o'quvchi yaratish</div>
              <div class="text-xs text-muted">Darhol sinab ko'rish uchun GURUH-101, 1 ta o'qituvchi va 1 ta o'quvchi qo'shiladi</div>
            </div>
          </label>
        `
        }

        <div id="reg-error" class="badge badge-danger hidden mb-3" style="width:100%;justify-content:center;padding:8px 12px;border-radius:8px;"></div>

        <div class="flex gap-2 justify-between mt-3">
          ${
            state.regStep > 1
              ? `<button type="button" class="btn btn-secondary" id="reg-prev-btn">${Icons.arrowLeft("icon-sm")} Orqaga</button>`
              : `<span></span>`
          }
          ${
            state.regStep < 3
              ? `<button type="button" class="btn btn-primary" id="reg-next-btn">Keyingi qadam ${Icons.arrowRight("icon-sm")}</button>`
              : `<button type="submit" class="btn btn-primary">${Icons.sparkles("icon-sm")} Muassasani yaratish va kirish</button>`
          }
        </div>
      </form>
    `;
  }

  window.AuthView = {
    render(onAuthenticated) {
      const db = Store.getState();
      const root = document.getElementById("app");
      root.innerHTML = `
        <div class="auth-page">
          <header class="auth-topbar">
            <div class="brand-lockup">
              <div class="brand-logo">${Icons.school("icon-lg")}</div>
              <div>
                <div class="brand-name">EDUNEX</div>
                <div class="brand-sub">Elektron ta'lim va boshqaruv tizimi</div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button class="btn btn-secondary btn-sm" id="auth-theme-btn" type="button">
                ${db.theme === "dark" ? Icons.sun("icon-sm") : Icons.moon("icon-sm")}
                <span>${db.theme === "dark" ? "Kunduzgi rejim" : "Tungi rejim"}</span>
              </button>
            </div>
          </header>

          <main class="auth-main">
            <div class="auth-shell">
              <section class="auth-hero">
                <div class="auth-hero-pill">${Icons.sparkles("icon-sm")} Zamonaviy Kollej & Texnikum Platformasi</div>
                <h1>Ta'lim jarayonini yagona raqamli tizimda boshqaring</h1>
                <p>Direktorlar uchun to'liq tahlil va nazorat, o'qituvchilar uchun tezkor elektron jurnal, o'quvchilar uchun esa kundalik, jadval va elektron kutubxona.</p>

                <div class="auth-feature-grid">
                  <div class="auth-feature-item">
                    <div class="auth-feature-icon">${Icons.chart("icon-sm")}</div>
                    <div>
                      <div class="font-semibold text-sm">Direktor boshqaruvi</div>
                      <div class="text-xs text-muted">Guruhlar, kadrlar, davomat va reyting nazorati</div>
                    </div>
                  </div>
                  <div class="auth-feature-item">
                    <div class="auth-feature-icon">${Icons.checkSquare("icon-sm")}</div>
                    <div>
                      <div class="font-semibold text-sm">Tezkor elektron jurnal</div>
                      <div class="text-xs text-muted">1 bosishda baho qo'yish va davomat belgilash</div>
                    </div>
                  </div>
                  <div class="auth-feature-item">
                    <div class="auth-feature-icon">${Icons.book("icon-sm")}</div>
                    <div>
                      <div class="font-semibold text-sm">Elektron kutubxona</div>
                      <div class="text-xs text-muted">Darsliklar, uyga vazifalar va guruh reytingi</div>
                    </div>
                  </div>
                  <div class="auth-feature-item">
                    <div class="auth-feature-icon">${Icons.building("icon-sm")}</div>
                    <div>
                      <div class="font-semibold text-sm">Direktor ro'yxatdan o'tishi</div>
                      <div class="text-xs text-muted">3 qadamda yangi kollej portalini ishga tushiring</div>
                    </div>
                  </div>
                </div>

                <div class="auth-demo-box">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-secondary" style="text-transform:uppercase;letter-spacing:0.04em;">Tezkor Demo Kirish (1 bosishda)</span>
                    <span class="badge badge-primary">TATK Demo</span>
                  </div>
                  <div class="auth-demo-grid">
                    <button type="button" class="demo-btn" data-demo="director">
                      <div class="font-bold text-sm">Direktor</div>
                      <div class="text-xs text-muted">Dilshodjon R.</div>
                    </button>
                    <button type="button" class="demo-btn" data-demo="teacher">
                      <div class="font-bold text-sm">O'qituvchi</div>
                      <div class="text-xs text-muted">Gulnora K.</div>
                    </button>
                    <button type="button" class="demo-btn" data-demo="student">
                      <div class="font-bold text-sm">O'quvchi</div>
                      <div class="text-xs text-muted">Sardorbek A.</div>
                    </button>
                  </div>
                </div>
              </section>

              <section class="auth-card">
                <div class="auth-mode-tabs">
                  <button type="button" class="auth-mode-tab ${state.mode === "login" ? "active" : ""}" data-auth-mode="login">
                    Tizimga kirish
                  </button>
                  <button type="button" class="auth-mode-tab ${state.mode === "register" ? "active" : ""}" data-auth-mode="register">
                    Direktor ro'yxatdan o'tish
                  </button>
                </div>

                ${state.mode === "login" ? renderLoginForm() : renderRegisterWizard()}

                <div class="auth-mobile-demo mt-4">
                  <div class="text-xs font-bold text-muted mb-2" style="text-transform:uppercase;">Tezkor Demo Kirish</div>
                  <div class="auth-demo-grid">
                    <button type="button" class="demo-btn" data-demo="director">
                      <div class="font-bold text-xs">Direktor</div>
                    </button>
                    <button type="button" class="demo-btn" data-demo="teacher">
                      <div class="font-bold text-xs">O'qituvchi</div>
                    </button>
                    <button type="button" class="demo-btn" data-demo="student">
                      <div class="font-bold text-xs">O'quvchi</div>
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </main>

          <footer class="auth-footer">
            © 2026 EDUNEX. Barcha huquqlar himoyalangan.
          </footer>
        </div>
      `;

      // Bind global auth events
      document.getElementById("auth-theme-btn").onclick = () => {
        Store.setTheme(db.theme === "dark" ? "light" : "dark");
        AuthView.render(onAuthenticated);
      };

      document.querySelectorAll("[data-auth-mode]").forEach((btn) => {
        btn.onclick = () => {
          state.mode = btn.dataset.authMode;
          AuthView.render(onAuthenticated);
        };
      });

      document.querySelectorAll("[data-demo]").forEach((btn) => {
        btn.onclick = () => {
          const r = btn.dataset.demo;
          const creds = {
            director: ["dilshod.rahimov", "Direktor@2026"],
            teacher: ["gulnora.karimova", "Oqtuvchi@2026"],
            student: ["sardor.alimov", "Oquvchi@2026"],
          }[r];
          const res = Store.login(creds[0], creds[1], r, true);
          if (res.ok) {
            UI.toast(`Xush kelibsiz, ${res.user.fullName}!`, "success");
            onAuthenticated();
          }
        };
      });

      if (state.mode === "login") {
        document.querySelectorAll("[data-role]").forEach((btn) => {
          btn.onclick = () => {
            state.loginRole = btn.dataset.role;
            AuthView.render(onAuthenticated);
          };
        });
        document.getElementById("toggle-pass-btn").onclick = () => {
          state.showPass = !state.showPass;
          const inp = document.getElementById("login-password");
          inp.type = state.showPass ? "text" : "password";
          document.getElementById("toggle-pass-btn").innerHTML = state.showPass
            ? Icons.eyeOff("icon-sm")
            : Icons.eye("icon-sm");
        };
        document.getElementById("switch-to-reg-inline").onclick = () => {
          state.mode = "register";
          state.regStep = 1;
          AuthView.render(onAuthenticated);
        };
        document.getElementById("forgot-pass-link").onclick = (e) => {
          e.preventDefault();
          UI.openModal({
            title: "Parolni tiklash",
            bodyHtml: `
              <p class="text-sm text-secondary mb-3">Tizimga kirish login yoki telefoningizni kiriting. Demo akkauntlar uchun standart parollar:</p>
              <div class="card mb-4" style="padding:12px;background:var(--bg-surface-2);">
                <div class="text-xs mb-1"><strong>Direktor:</strong> <code>dilshod.rahimov</code> / <code>Direktor@2026</code></div>
                <div class="text-xs mb-1"><strong>O'qituvchi:</strong> <code>gulnora.karimova</code> / <code>Oqtuvchi@2026</code></div>
                <div class="text-xs"><strong>O'quvchi:</strong> <code>sardor.alimov</code> / <code>Oquvchi@2026</code></div>
              </div>
              <div class="form-group">
                <label class="form-label">Login yoki telefon</label>
                <input class="form-control" id="reset-target" placeholder="+998 90 123 45 67" />
              </div>
              <button class="btn btn-primary btn-block" id="send-reset-btn">Tiklash kodini yuborish</button>
            `,
            onMount(close) {
              document.getElementById("send-reset-btn").onclick = () => {
                UI.toast("Parolni tiklash so'rovi administratorga yuborildi!", "success");
                close();
              };
            },
          });
        };
        document.getElementById("login-form").onsubmit = (e) => {
          e.preventDefault();
          const login = document.getElementById("login-username").value;
          const password = document.getElementById("login-password").value;
          const remember = document.getElementById("remember-me").checked;
          const res = Store.login(login, password, state.loginRole, remember);
          if (!res.ok) {
            const errEl = document.getElementById("login-error");
            errEl.textContent = res.error;
            errEl.classList.remove("hidden");
            return;
          }
          UI.toast(`Xush kelibsiz, ${res.user.fullName}!`, "success");
          onAuthenticated();
        };
      } else {
        bindRegisterEvents(onAuthenticated);
      }
    },
  };

  function showRegError(msg) {
    const el = document.getElementById("reg-error");
    if (!el) return;
    el.textContent = msg;
    el.classList.remove("hidden");
  }

  function saveCurrentStepFields() {
    const d = state.regData;
    if (state.regStep === 1) {
      d.fullName = document.getElementById("reg-fullname").value;
      d.phone = document.getElementById("reg-phone").value;
      d.email = document.getElementById("reg-email").value;
      d.login = document.getElementById("reg-login").value;
      d.password = document.getElementById("reg-password").value;
      d.confirmPassword = document.getElementById("reg-confirm").value;
    } else if (state.regStep === 2) {
      d.collegeName = document.getElementById("reg-col-name").value;
      d.collegeType = document.getElementById("reg-col-type").value;
      d.region = document.getElementById("reg-region").value;
      d.stir = document.getElementById("reg-stir").value;
      d.academicYear = document.getElementById("reg-year").value;
    } else if (state.regStep === 3) {
      d.gradingSystem = document.getElementById("reg-grading").value;
      d.withStarterData = document.getElementById("reg-starter").checked;
    }
  }

  function bindRegisterEvents(onAuthenticated) {
    const pwInput = document.getElementById("reg-password");
    if (pwInput) {
      pwInput.oninput = () => {
        const info = passwordStrength(pwInput.value);
        const bar = document.getElementById("pw-strength-bar");
        const txt = document.getElementById("pw-strength-text");
        bar.style.width = `${info.score}%`;
        bar.style.background = info.color;
        txt.textContent = pwInput.value ? `Parol kuchi: ${info.label}` : "Kamida 6 ta belgi kiriting";
      };
    }

    document.querySelectorAll("[data-dept]").forEach((btn) => {
      btn.onclick = () => {
        const dept = btn.dataset.dept;
        const arr = state.regData.departments;
        if (arr.includes(dept)) {
          if (arr.length > 1) {
            state.regData.departments = arr.filter((x) => x !== dept);
          }
        } else {
          arr.push(dept);
        }
        saveCurrentStepFields();
        AuthView.render(onAuthenticated);
      };
    });

    const prevBtn = document.getElementById("reg-prev-btn");
    if (prevBtn) {
      prevBtn.onclick = () => {
        saveCurrentStepFields();
        state.regStep -= 1;
        AuthView.render(onAuthenticated);
      };
    }

    const nextBtn = document.getElementById("reg-next-btn");
    if (nextBtn) {
      nextBtn.onclick = () => {
        saveCurrentStepFields();
        const d = state.regData;
        if (state.regStep === 1) {
          if (!d.fullName.trim() || !d.login.trim() || !d.phone.trim()) {
            return showRegError("Iltimos, barcha majburiy maydonlarni to'ldiring.");
          }
          if (d.password.length < 6) {
            return showRegError("Parol kamida 6 ta belgidan iborat bo'lishi kerak.");
          }
          if (d.password !== d.confirmPassword) {
            return showRegError("Parollar mos kelmadi.");
          }
        } else if (state.regStep === 2) {
          if (!d.collegeName.trim()) {
            return showRegError("Ta'lim muassasasi nomini kiriting.");
          }
        }
        state.regStep += 1;
        AuthView.render(onAuthenticated);
      };
    }

    const form = document.getElementById("director-reg-form");
    form.onsubmit = (e) => {
      e.preventDefault();
      if (state.regStep < 3) return;
      saveCurrentStepFields();
      const res = Store.registerDirector(state.regData);
      if (!res.ok) {
        return showRegError(res.error);
      }
      UI.toast(`Tabriklaymiz! ${res.college.name} portali yaratildi!`, "success");
      state.regStep = 1;
      onAuthenticated();
    };
  }
})();
