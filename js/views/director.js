(function () {
  let chartPeriod = "weekly"; // "weekly" | "monthly"
  let searchQuery = "";
  let groupFilter = "ALL";

  window.DirectorView = {
    getNav(college) {
      const db = Store.getState();
      const annCount = db.announcements.filter((a) => a.collegeId === college.id).length;
      return [
        { id: "dashboard", label: "Bosh sahifa", icon: "home" },
        { id: "groups", label: "Guruhlar", icon: "groups" },
        { id: "teachers", label: "O'qituvchilar", icon: "award" },
        { id: "students", label: "O'quvchilar", icon: "users" },
        { id: "schedule", label: "Dars jadvali", icon: "calendar" },
        { id: "analytics", label: "Reyting & Tahlil", icon: "chart" },
        { id: "announcements", label: "E'lonlar", icon: "megaphone", badge: annCount },
        { id: "settings", label: "Muassasa sozlamalari", icon: "settings" },
      ];
    },

    render(page, user, college, ctx) {
      if (page === "dashboard") return renderDashboard(user, college, ctx);
      if (page === "groups") return renderGroups(college, ctx);
      if (page === "teachers") return renderTeachers(college, ctx);
      if (page === "students") return renderStudents(college, ctx);
      if (page === "schedule") return renderSchedule(college, ctx);
      if (page === "analytics") return renderAnalytics(college, ctx);
      if (page === "announcements") return renderAnnouncements(college, ctx);
      if (page === "settings") return renderSettings(user, college, ctx);
      return renderDashboard(user, college, ctx);
    },
  };

  function getCollegeMetrics(college) {
    const db = Store.getState();
    const groups = Store.getGroups(college.id);
    const teachers = Store.getUsersByRole(college.id, "teacher");
    const students = Store.getUsersByRole(college.id, "student");

    const totalStudents = students.length + (college.baseStudentOffset || 0);
    const totalTeachers = teachers.length + (college.baseTeacherOffset || 0);
    const totalGroups = groups.length + (college.baseGroupOffset || 0);

    const avgAtt = groups.length
      ? (
          groups.reduce(
            (s, g) => s + (chartPeriod === "weekly" ? g.weeklyAttendance : g.monthlyAttendance),
            0
          ) / groups.length
        ).toFixed(1)
      : "0.0";

    const allGrades = db.grades.filter((g) => g.collegeId === college.id);
    const avgGrade = allGrades.length
      ? (allGrades.reduce((s, g) => s + g.avg, 0) / allGrades.length).toFixed(1)
      : "4.5";

    return { groups, teachers, students, totalStudents, totalTeachers, totalGroups, avgAtt, avgGrade };
  }

  function renderDashboard(user, college, ctx) {
    const db = Store.getState();
    const m = getCollegeMetrics(college);
    const announcements = db.announcements.filter((a) => a.collegeId === college.id).slice(0, 3);

    const topStudents = [...m.students]
      .map((s) => ({ ...s, overallAvg: Store.getStudentOverallAvg(s.id) }))
      .sort((a, b) => b.overallAvg - a.overallAvg)
      .slice(0, 4);

    const onboardingHtml = user.isNewDirector
      ? `
      <div class="onboarding-banner flex items-center justify-between flex-wrap gap-3">
        <div>
          <div class="flex items-center gap-2 font-bold text-primary-color">
            ${Icons.sparkles("icon-sm")} Tabriklaymiz, ${UI.esc(user.fullName)}! Muassasangiz faol holatda.
          </div>
          <div class="text-sm text-secondary mt-1">
            Keyingi qadamlar: yangi guruh oching, o'qituvchilarga login yarating va birinchi e'lonni joylashtiring.
          </div>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-primary btn-sm" id="ob-add-teacher">${Icons.userPlus("icon-sm")} O'qituvchi qo'shish</button>
          <button class="btn btn-secondary btn-sm" id="ob-dismiss">Yopish</button>
        </div>
      </div>`
      : "";

    const html = `
      ${onboardingHtml}
      <div class="kpi-grid-5">
        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Jami o'quvchilar</span>
            <span class="kpi-icon" style="background:var(--primary-soft);color:var(--primary);">${Icons.school("icon-sm")}</span>
          </div>
          <div class="kpi-value">${m.totalStudents.toLocaleString()}</div>
          <div class="kpi-sub text-success font-semibold">+32 yangi</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">O'qituvchilar</span>
            <span class="kpi-icon" style="background:#f3e8ff;color:#7e22ce;">${Icons.award("icon-sm")}</span>
          </div>
          <div class="kpi-value">${m.totalTeachers}</div>
          <div class="kpi-sub text-muted">${college.departments.length} ta kafedra</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Guruhlar</span>
            <span class="kpi-icon" style="background:#e0f2fe;color:#0284c7;">${Icons.groups("icon-sm")}</span>
          </div>
          <div class="kpi-value">${m.totalGroups}</div>
          <div class="kpi-sub text-muted">1–3-kurslar</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">O'rtacha davomat</span>
            <span class="kpi-icon" style="background:var(--success-soft);color:var(--success);">${Icons.checkSquare("icon-sm")}</span>
          </div>
          <div class="kpi-value">${m.avgAtt}%</div>
          <div class="kpi-sub text-success font-semibold">+1.2% bu hafta</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">O'rtacha baho</span>
            <span class="kpi-icon" style="background:#ecfdf5;color:#059669;">${Icons.chart("icon-sm")}</span>
          </div>
          <div class="kpi-value">${m.avgGrade}</div>
          <div class="kpi-sub text-muted">${UI.esc(college.gradingSystem)}</div>
        </div>
      </div>

      <div class="grid-main-side">
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">Guruhlar bo'yicha davomat</h3>
              <p class="card-subtitle">Joriy ${chartPeriod === "weekly" ? "haftalik" : "oylik"} o'rtacha ko'rsatkich (%)</p>
            </div>
            <div class="flex gap-1">
              <button class="btn btn-xs ${chartPeriod === "weekly" ? "btn-soft" : "btn-ghost"}" data-period="weekly">Haftalik</button>
              <button class="btn btn-xs ${chartPeriod === "monthly" ? "btn-soft" : "btn-ghost"}" data-period="monthly">Oylik</button>
            </div>
          </div>

          <div class="bar-chart-wrap">
            ${
              m.groups.length
                ? m.groups
                    .slice(0, 7)
                    .map((g) => {
                      const val = chartPeriod === "weekly" ? g.weeklyAttendance : g.monthlyAttendance;
                      const isWarn = val < 89;
                      return `
                        <div class="bar-col" title="${UI.esc(g.code)}: ${val}% davomat">
                          <span class="bar-pct">${val}%</span>
                          <div class="bar-fill ${isWarn ? "warn" : ""}" style="height:${Math.max(20, val * 1.65)}px;" data-group-jump="${UI.esc(g.code)}"></div>
                          <span class="bar-label">${UI.esc(g.code)}</span>
                        </div>
                      `;
                    })
                    .join("")
                : `<div class="text-muted text-sm">Hali guruhlar qo'shilmagan.</div>`
            }
          </div>
          <div class="flex items-center justify-between mt-3 text-xs text-muted">
            <span>Eslatma: To'q sariq ustun — davomat 89% dan past guruhlar</span>
            <button class="btn-ghost btn-xs" id="dir-goto-groups">Barcha guruhlar →</button>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">Eng yaxshi 4 o'quvchi</h3>
              <p class="card-subtitle">O'rtacha ball bo'yicha reyting</p>
            </div>
            <span class="text-primary-color">${Icons.award("icon-lg")}</span>
          </div>

          <div>
            ${
              topStudents.length
                ? topStudents
                    .map(
                      (s, idx) => `
                  <div class="leader-item" data-stu-modal="${s.id}">
                    <div class="flex items-center gap-3">
                      <span class="rank-num ${idx === 0 ? "top-1" : ""}">${idx + 1}</span>
                      <div>
                        <div class="font-semibold text-sm">${UI.esc(s.fullName)}</div>
                        <div class="text-xs text-muted">${UI.esc(s.groupCode)} guruhi</div>
                      </div>
                    </div>
                    ${UI.avgBadge(s.overallAvg)}
                  </div>
                `
                    )
                    .join("")
                : `<div class="text-muted text-sm">O'quvchilar ro'yxati bo'sh.</div>`
            }
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="flex items-center gap-2">
            <span class="text-primary-color">${Icons.megaphone("icon-svg")}</span>
            <h3 class="card-title">So'nggi e'lonlar</h3>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-primary btn-xs" id="dir-quick-ann">${Icons.plus("icon-sm")} Yangi e'lon</button>
            <button class="btn btn-ghost btn-xs" id="dir-all-ann">Barchasi</button>
          </div>
        </div>
        <div class="grid-3">
          ${announcements
            .map(
              (a) => `
            <div class="notice-card">
              <div class="flex items-center justify-between mb-2">
                <span class="badge badge-primary">${UI.esc(a.audience)}</span>
                <span class="text-xs text-muted">${UI.esc(a.date)}</span>
              </div>
              <div class="font-bold text-sm mb-1">${UI.esc(a.title)}</div>
              <div class="text-xs text-secondary">${UI.esc(a.body)}</div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;

    ctx.container.innerHTML = html;

    document.querySelectorAll("[data-period]").forEach((b) => {
      b.onclick = () => {
        chartPeriod = b.dataset.period;
        ctx.rerender();
      };
    });
    document.querySelectorAll("[data-group-jump]").forEach((b) => {
      b.onclick = () => {
        groupFilter = b.dataset.groupJump;
        ctx.navigate("students");
      };
    });
    document.querySelectorAll("[data-stu-modal]").forEach((el) => {
      el.onclick = () => openStudentModal(el.dataset.stuModal);
    });
    document.getElementById("dir-goto-groups").onclick = () => ctx.navigate("groups");
    document.getElementById("dir-all-ann").onclick = () => ctx.navigate("announcements");
    document.getElementById("dir-quick-ann").onclick = () => openAnnouncementModal(college, ctx);

    const obTeacher = document.getElementById("ob-add-teacher");
    if (obTeacher) obTeacher.onclick = () => openAddTeacherModal(college, ctx);
    const obDismiss = document.getElementById("ob-dismiss");
    if (obDismiss) {
      obDismiss.onclick = () => {
        user.isNewDirector = false;
        Store.save();
        ctx.rerender();
      };
    }
  }

  function renderGroups(college, ctx) {
    const groups = Store.getGroups(college.id);
    const teachers = Store.getUsersByRole(college.id, "teacher");
    const students = Store.getUsersByRole(college.id, "student");

    ctx.container.innerHTML = `
      <div class="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h2 class="text-xl font-bold" style="margin:0;">O'quv guruhlari</h2>
          <p class="text-sm text-muted" style="margin:2px 0 0;">Kollejdagi faol guruhlar, kuratorlar va davomat holati</p>
        </div>
        <button class="btn btn-primary" id="add-group-btn">${Icons.plus("icon-sm")} Yangi guruh qo'shish</button>
      </div>

      <div class="grid-3">
        ${groups
          .map((g) => {
            const curator = teachers.find((t) => t.id === g.curatorId);
            const count = students.filter((s) => s.groupCode === g.code).length || g.studentTotal;
            return `
              <div class="card">
                <div class="flex items-center justify-between mb-3">
                  <div>
                    <div class="text-lg font-bold">${UI.esc(g.code)}</div>
                    <div class="text-xs text-muted">${g.course}-kurs • ${UI.esc(g.direction)}</div>
                  </div>
                  <span class="badge ${g.weeklyAttendance < 89 ? "badge-warning" : "badge-success"}">
                    ${g.weeklyAttendance}% davomat
                  </span>
                </div>
                <div class="text-sm text-secondary mb-3">
                  <div><strong>Kurator:</strong> ${UI.esc(curator?.fullName || "Tayinlanmagan")}</div>
                  <div><strong>O'quvchilar soni:</strong> ${count} nafar</div>
                </div>
                <div class="flex gap-2">
                  <button class="btn btn-soft btn-sm btn-block" data-open-group="${UI.esc(g.code)}">O'quvchilarni ko'rish</button>
                </div>
              </div>
            `;
          })
          .join("")}
      </div>
    `;

    document.getElementById("add-group-btn").onclick = () => {
      UI.openModal({
        title: "Yangi guruh qo'shish",
        bodyHtml: `
          <form id="new-group-form">
            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Guruh kodi *</label>
                <input class="form-control" id="ng-code" placeholder="Masalan: KI-23" required />
              </div>
              <div class="form-group">
                <label class="form-label">Kurs</label>
                <select class="form-control" id="ng-course">
                  <option value="1">1-kurs</option>
                  <option value="2">2-kurs</option>
                  <option value="3">3-kurs</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Yo'nalish *</label>
              <input class="form-control" id="ng-dir" placeholder="Kompyuter injiniringi" required />
            </div>
            <div class="form-group">
              <label class="form-label">Guruh kuratori (O'qituvchi)</label>
              <select class="form-control" id="ng-curator">
                <option value="">Tanlanmagan</option>
                ${teachers.map((t) => `<option value="${t.id}">${UI.esc(t.fullName)} (${UI.esc(t.subject)})</option>`).join("")}
              </select>
            </div>
            <button class="btn btn-primary btn-block">Guruhni saqlash</button>
          </form>
        `,
        onMount(close) {
          document.getElementById("new-group-form").onsubmit = (e) => {
            e.preventDefault();
            Store.addGroup(college.id, {
              code: document.getElementById("ng-code").value,
              course: document.getElementById("ng-course").value,
              direction: document.getElementById("ng-dir").value,
              curatorId: document.getElementById("ng-curator").value,
            });
            UI.toast("Yangi guruh yaratildi!", "success");
            close();
            ctx.rerender();
          };
        },
      });
    };

    document.querySelectorAll("[data-open-group]").forEach((b) => {
      b.onclick = () => {
        groupFilter = b.dataset.openGroup;
        ctx.navigate("students");
      };
    });
  }

  function renderTeachers(college, ctx) {
    const teachers = Store.getUsersByRole(college.id, "teacher").filter((t) =>
      !searchQuery ||
      t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    ctx.container.innerHTML = `
      <div class="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h2 class="text-xl font-bold" style="margin:0;">O'qituvchilar tarkibi</h2>
          <p class="text-sm text-muted" style="margin:2px 0 0;">Yangi o'qituvchi qo'shsangiz, u o'z login-paroli bilan tizimga kira oladi</p>
        </div>
        <div class="flex gap-2">
          <input class="form-control" id="tch-search" style="width:220px;" placeholder="Ism yoki fan bo'yicha qidirish..." value="${UI.esc(searchQuery)}" />
          <button class="btn btn-primary" id="add-tch-btn">${Icons.userPlus("icon-sm")} O'qituvchi qo'shish</button>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>O'qituvchi</th>
                <th>Kafedra / Fan</th>
                <th>Login</th>
                <th>Biriktirilgan guruhlar</th>
                <th>Telefon</th>
                <th>Holat</th>
              </tr>
            </thead>
            <tbody>
              ${teachers
                .map(
                  (t) => `
                <tr>
                  <td>
                    <div class="flex items-center gap-3">
                      <span class="avatar">${UI.initials(t.fullName)}</span>
                      <div>
                        <div class="font-semibold">${UI.esc(t.fullName)}</div>
                        <div class="text-xs text-muted">O'qituvchi</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="font-medium">${UI.esc(t.subject)}</div>
                    <div class="text-xs text-muted">${UI.esc(t.department)}</div>
                  </td>
                  <td><code>${UI.esc(t.login)}</code></td>
                  <td>
                    <div class="flex gap-1 flex-wrap">
                      ${(t.assignedGroups || []).map((g) => `<span class="badge badge-neutral">${UI.esc(g)}</span>`).join("") || "—"}
                    </div>
                  </td>
                  <td class="text-sm text-secondary">${UI.esc(t.phone)}</td>
                  <td><span class="badge badge-success">${UI.esc(t.status || "Faol")}</span></td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById("tch-search").oninput = (e) => {
      searchQuery = e.target.value;
      ctx.rerender();
    };
    document.getElementById("add-tch-btn").onclick = () => openAddTeacherModal(college, ctx);
  }

  function renderStudents(college, ctx) {
    const groups = Store.getGroups(college.id);
    const students = Store.getUsersByRole(college.id, "student").filter((s) => {
      const matchGroup = groupFilter === "ALL" || s.groupCode === groupFilter;
      const matchQ =
        !searchQuery ||
        s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.groupCode.toLowerCase().includes(searchQuery.toLowerCase());
      return matchGroup && matchQ;
    });

    ctx.container.innerHTML = `
      <div class="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h2 class="text-xl font-bold" style="margin:0;">O'quvchilar ro'yxati</h2>
          <p class="text-sm text-muted" style="margin:2px 0 0;">O'quvchi ustiga bosib batafsil baho va davomat kartochkasini oching</p>
        </div>
        <div class="flex gap-2 flex-wrap">
          <input class="form-control" id="stu-search" style="width:200px;" placeholder="O'quvchi qidirish..." value="${UI.esc(searchQuery)}" />
          <select class="form-control" id="stu-group-filter" style="width:140px;">
            <option value="ALL">Barcha guruhlar</option>
            ${groups.map((g) => `<option value="${UI.esc(g.code)}" ${groupFilter === g.code ? "selected" : ""}>${UI.esc(g.code)}</option>`).join("")}
          </select>
          <button class="btn btn-secondary" id="export-stu-csv">${Icons.download("icon-sm")} CSV</button>
          <button class="btn btn-primary" id="add-stu-btn">${Icons.userPlus("icon-sm")} O'quvchi qo'shish</button>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>F.I.Sh.</th>
                <th>Guruh</th>
                <th>Login</th>
                <th>Davomat</th>
                <th>O'rtacha baho</th>
                <th>Telefon</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${students
                .map((s) => {
                  const avg = Store.getStudentOverallAvg(s.id);
                  return `
                  <tr>
                    <td>
                      <div class="flex items-center gap-3">
                        <span class="avatar">${UI.initials(s.fullName)}</span>
                        <div>
                          <div class="font-semibold">${UI.esc(s.fullName)}</div>
                          <div class="text-xs text-muted">${UI.esc(s.studentIdNum || "")}</div>
                        </div>
                      </div>
                    </td>
                    <td><span class="badge badge-primary">${UI.esc(s.groupCode)}</span></td>
                    <td><code>${UI.esc(s.login)}</code></td>
                    <td>
                      <span class="badge ${s.attendanceRate >= 90 ? "badge-success" : s.attendanceRate >= 80 ? "badge-warning" : "badge-danger"}">
                        ${s.attendanceRate}%
                      </span>
                    </td>
                    <td>${UI.avgBadge(avg)}</td>
                    <td class="text-sm text-secondary">${UI.esc(s.phone)}</td>
                    <td>
                      <button class="btn btn-soft btn-xs" data-view-stu="${s.id}">Kartochka</button>
                    </td>
                  </tr>
                `;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById("stu-search").oninput = (e) => {
      searchQuery = e.target.value;
      ctx.rerender();
    };
    document.getElementById("stu-group-filter").onchange = (e) => {
      groupFilter = e.target.value;
      ctx.rerender();
    };
    document.querySelectorAll("[data-view-stu]").forEach((b) => {
      b.onclick = () => openStudentModal(b.dataset.viewStu);
    });
    document.getElementById("export-stu-csv").onclick = () => {
      const rows = [["F.I.Sh", "Guruh", "Login", "Davomat %", "O'rtacha baho", "Telefon"]];
      students.forEach((s) => {
        rows.push([s.fullName, s.groupCode, s.login, s.attendanceRate, Store.getStudentOverallAvg(s.id), s.phone]);
      });
      UI.exportCSV("edunex_oquvchilar.csv", rows);
    };
    document.getElementById("add-stu-btn").onclick = () => openAddStudentModal(college, ctx);
  }

  function renderSchedule(college, ctx) {
    const db = Store.getState();
    const groups = Store.getGroups(college.id);
    const teachers = Store.getUsersByRole(college.id, "teacher");
    const activeGrp = groupFilter === "ALL" ? (groups[0]?.code || "KI-21") : groupFilter;
    const days = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma"];
    const slots = db.schedule.filter((s) => s.collegeId === college.id && s.groupCode === activeGrp);

    ctx.container.innerHTML = `
      <div class="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h2 class="text-xl font-bold" style="margin:0;">Kollej dars jadvali</h2>
          <p class="text-sm text-muted" style="margin:2px 0 0;">Guruhlar kesimida haftalik dars jadvalini boshqaring</p>
        </div>
        <div class="flex gap-2">
          <select class="form-control" id="sch-group-sel" style="width:150px;">
            ${groups.map((g) => `<option value="${UI.esc(g.code)}" ${activeGrp === g.code ? "selected" : ""}>${UI.esc(g.code)}</option>`).join("")}
          </select>
          <button class="btn btn-primary" id="add-slot-btn">${Icons.plus("icon-sm")} Dars qo'shish</button>
        </div>
      </div>

      <div class="timetable-grid">
        ${days
          .map((day) => {
            const daySlots = slots.filter((s) => s.day === day);
            return `
            <div class="day-col ${day === "Seshanba" ? "today" : ""}">
              <div class="day-header">
                <span>${day}</span>
                ${day === "Seshanba" ? `<span class="badge badge-primary">Bugun</span>` : ""}
              </div>
              ${
                daySlots.length
                  ? daySlots
                      .map((sl) => {
                        const tch = teachers.find((t) => t.id === sl.teacherId);
                        return `
                          <div class="lesson-slot">
                            <div class="font-bold text-sm">${UI.esc(sl.subject)}</div>
                            <div class="text-xs text-muted mt-1">${UI.esc(sl.time)} • ${UI.esc(sl.room)}</div>
                            <div class="text-xs text-secondary mt-1">${UI.esc(tch?.fullName || "")}</div>
                          </div>
                        `;
                      })
                      .join("")
                  : `<div class="text-xs text-muted">Dars belgilanmagan</div>`
              }
            </div>
          `;
          })
          .join("")}
      </div>
    `;

    document.getElementById("sch-group-sel").onchange = (e) => {
      groupFilter = e.target.value;
      ctx.rerender();
    };
    document.getElementById("add-slot-btn").onclick = () => {
      UI.openModal({
        title: "Jadvalga dars qo'shish",
        bodyHtml: `
          <form id="new-slot-form">
            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Kun</label>
                <select class="form-control" id="ns-day">
                  ${days.map((d) => `<option value="${d}">${d}</option>`).join("")}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Vaqt</label>
                <select class="form-control" id="ns-time">
                  <option value="08:30 – 09:50">08:30 – 09:50</option>
                  <option value="10:00 – 11:20">10:00 – 11:20</option>
                  <option value="11:30 – 12:50">11:30 – 12:50</option>
                  <option value="13:30 – 14:50">13:30 – 14:50</option>
                </select>
              </div>
            </div>
            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Guruh</label>
                <select class="form-control" id="ns-grp">
                  ${groups.map((g) => `<option value="${UI.esc(g.code)}" ${activeGrp === g.code ? "selected" : ""}>${UI.esc(g.code)}</option>`).join("")}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Xona</label>
                <input class="form-control" id="ns-room" placeholder="304-xona" required />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Fan nomi *</label>
              <input class="form-control" id="ns-subj" placeholder="Dasturlash asoslari" required />
            </div>
            <div class="form-group">
              <label class="form-label">O'qituvchi</label>
              <select class="form-control" id="ns-tch">
                ${teachers.map((t) => `<option value="${t.id}">${UI.esc(t.fullName)}</option>`).join("")}
              </select>
            </div>
            <button class="btn btn-primary btn-block">Jadvalga qo'shish</button>
          </form>
        `,
        onMount(close) {
          document.getElementById("new-slot-form").onsubmit = (e) => {
            e.preventDefault();
            Store.addScheduleSlot(college.id, {
              day: document.getElementById("ns-day").value,
              time: document.getElementById("ns-time").value,
              groupCode: document.getElementById("ns-grp").value,
              room: document.getElementById("ns-room").value,
              subject: document.getElementById("ns-subj").value,
              teacherId: document.getElementById("ns-tch").value,
            });
            UI.toast("Dars jadvalga qo'shildi!", "success");
            close();
            ctx.rerender();
          };
        },
      });
    };
  }

  function renderAnalytics(college, ctx) {
    const students = Store.getUsersByRole(college.id, "student").map((s) => ({
      ...s,
      avg: Store.getStudentOverallAvg(s.id),
    }));
    const honorRoll = students.filter((s) => s.avg >= 4.5).sort((a, b) => b.avg - a.avg);
    const riskStudents = students.filter((s) => s.attendanceRate < 85 || s.avg < 3.6);

    ctx.container.innerHTML = `
      <div class="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h2 class="text-xl font-bold" style="margin:0;">Reyting va Monitoring tahlili</h2>
          <p class="text-sm text-muted" style="margin:2px 0 0;">A'lochi o'quvchilar va davomat/o'zlashtirish bo'yicha nazorat ro'yxati</p>
        </div>
        <button class="btn btn-secondary" id="print-report-btn">${Icons.download("icon-sm")} Hisobotni eksport qilish</button>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">A'lochilar va Stipendiya nomzodlari</h3>
              <p class="card-subtitle">O'rtacha bahosi 4.5 dan yuqori o'quvchilar</p>
            </div>
            <span class="badge badge-success">${honorRoll.length} nafar</span>
          </div>
          ${honorRoll
            .map(
              (s, i) => `
            <div class="leader-item" data-stu-modal="${s.id}">
              <div class="flex items-center gap-3">
                <span class="rank-num ${i === 0 ? "top-1" : ""}">${i + 1}</span>
                <div>
                  <div class="font-semibold text-sm">${UI.esc(s.fullName)}</div>
                  <div class="text-xs text-muted">${UI.esc(s.groupCode)} • Davomat ${s.attendanceRate}%</div>
                </div>
              </div>
              ${UI.avgBadge(s.avg)}
            </div>
          `
            )
            .join("") || `<div class="text-sm text-muted">Hozircha yo'q</div>`}
        </div>

        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">Alohida nazoratdagi o'quvchilar</h3>
              <p class="card-subtitle">Davomat &lt; 85% yoki o'rtacha ball &lt; 3.6</p>
            </div>
            <span class="badge badge-danger">${riskStudents.length} nafar</span>
          </div>
          ${riskStudents
            .map(
              (s) => `
            <div class="leader-item" data-stu-modal="${s.id}">
              <div>
                <div class="font-semibold text-sm">${UI.esc(s.fullName)}</div>
                <div class="text-xs text-muted">${UI.esc(s.groupCode)} • Ota-ona: ${UI.esc(s.parentPhone)}</div>
              </div>
              <div class="flex gap-2">
                <span class="badge badge-danger">${s.attendanceRate}% davomat</span>
                ${UI.avgBadge(s.avg)}
              </div>
            </div>
          `
            )
            .join("") || `<div class="text-sm text-muted">Xavf guruhida o'quvchi yo'q!</div>`}
        </div>
      </div>
    `;

    document.querySelectorAll("[data-stu-modal]").forEach((el) => {
      el.onclick = () => openStudentModal(el.dataset.stuModal);
    });
    document.getElementById("print-report-btn").onclick = () => {
      const rows = [["F.I.Sh", "Guruh", "Davomat %", "O'rtacha ball", "Holat"]];
      students.forEach((s) => {
        rows.push([s.fullName, s.groupCode, s.attendanceRate, s.avg, s.avg >= 4.5 ? "A'lochi" : s.attendanceRate < 85 ? "Nazoratda" : "Barqaror"]);
      });
      UI.exportCSV("kollej_reyting_hisoboti.csv", rows);
    };
  }

  function renderAnnouncements(college, ctx) {
    const db = Store.getState();
    const list = db.announcements.filter((a) => a.collegeId === college.id);

    ctx.container.innerHTML = `
      <div class="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h2 class="text-xl font-bold" style="margin:0;">Kollej e'lonlari</h2>
          <p class="text-sm text-muted" style="margin:2px 0 0;">O'qituvchi va o'quvchilarga tezkor xabarnomalar yuboring</p>
        </div>
        <button class="btn btn-primary" id="new-ann-btn">${Icons.plus("icon-sm")} Yangi e'lon yaratish</button>
      </div>

      <div class="grid-2">
        ${list
          .map(
            (a) => `
          <div class="card">
            <div class="flex items-center justify-between mb-2">
              <div class="flex gap-2">
                <span class="badge badge-primary">${UI.esc(a.audience)}</span>
                <span class="badge badge-neutral">${UI.esc(a.tag || "E'lon")}</span>
              </div>
              <button class="btn btn-ghost btn-xs text-danger" data-del-ann="${a.id}">${Icons.trash("icon-sm")}</button>
            </div>
            <h3 class="card-title mb-1">${UI.esc(a.title)}</h3>
            <p class="text-sm text-secondary mb-3">${UI.esc(a.body)}</p>
            <div class="text-xs text-muted">${UI.esc(a.authorRole)} • ${UI.esc(a.date)}</div>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    document.getElementById("new-ann-btn").onclick = () => openAnnouncementModal(college, ctx);
    document.querySelectorAll("[data-del-ann]").forEach((b) => {
      b.onclick = () => {
        Store.deleteAnnouncement(b.dataset.delAnn);
        UI.toast("E'lon o'chirildi", "warning");
        ctx.rerender();
      };
    });
  }

  function renderSettings(user, college, ctx) {
    ctx.container.innerHTML = `
      <div class="grid-2">
        <div class="card">
          <h3 class="card-title mb-1">Muassasa ma'lumotlari</h3>
          <p class="card-subtitle mb-4">Direktor tomonidan boshqariladigan asosiy rekvizitlar</p>
          <form id="college-settings-form">
            <div class="form-group">
              <label class="form-label">Muassasa nomi</label>
              <input class="form-control" id="cs-name" value="${UI.esc(college.name)}" required />
            </div>
            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">O'quv yili</label>
                <input class="form-control" id="cs-year" value="${UI.esc(college.academicYear)}" />
              </div>
              <div class="form-group">
                <label class="form-label">Semestr</label>
                <input class="form-control" id="cs-sem" value="${UI.esc(college.semester)}" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Hudud</label>
              <input class="form-control" id="cs-reg" value="${UI.esc(college.region || "Toshkent shahri")}" />
            </div>
            <button class="btn btn-primary">O'zgarishlarni saqlash</button>
          </form>
        </div>

        <div class="card">
          <h3 class="card-title mb-1">Direktor profili va Tizim</h3>
          <p class="card-subtitle mb-4">Shaxsiy kabinet va namuna ma'lumotlarni tiklash</p>
          <div class="p-3 mb-4" style="background:var(--bg-surface-2);border-radius:12px;border:1px solid var(--border-color);padding:14px;">
            <div class="font-bold">${UI.esc(user.fullName)}</div>
            <div class="text-xs text-muted mt-1">Login: <code>${UI.esc(user.login)}</code> • ${UI.esc(user.phone || "")}</div>
          </div>
          <button class="btn btn-danger" id="reset-demo-btn">${Icons.refresh("icon-sm")} Demo ma'lumotlarni asl holiga qaytarish</button>
        </div>
      </div>
    `;

    document.getElementById("college-settings-form").onsubmit = (e) => {
      e.preventDefault();
      college.name = document.getElementById("cs-name").value.trim();
      college.academicYear = document.getElementById("cs-year").value.trim();
      college.semester = document.getElementById("cs-sem").value.trim();
      college.region = document.getElementById("cs-reg").value.trim();
      Store.save();
      UI.toast("Muassasa ma'lumotlari yangilandi!", "success");
      ctx.rerender();
    };
    document.getElementById("reset-demo-btn").onclick = () => {
      Store.resetDemo();
      UI.toast("Tizim boshlang'ich demo holatiga qaytarildi", "success");
      location.reload();
    };
  }

  function openStudentModal(studentId) {
    const db = Store.getState();
    const stu = db.users.find((u) => u.id === studentId);
    if (!stu) return;
    const grades = Store.getStudentGrades(stu.id);
    const avg = Store.getStudentOverallAvg(stu.id);

    UI.openModal({
      title: `O'quvchi kartochkasi — ${stu.fullName}`,
      large: true,
      bodyHtml: `
        <div class="flex items-center justify-between flex-wrap gap-3 mb-4 p-3" style="background:var(--bg-surface-2);border-radius:12px;padding:14px;">
          <div class="flex items-center gap-3">
            <span class="avatar avatar-lg">${UI.initials(stu.fullName)}</span>
            <div>
              <div class="font-bold text-lg">${UI.esc(stu.fullName)}</div>
              <div class="text-xs text-muted">${UI.esc(stu.groupCode)} • ${UI.esc(stu.direction || "")} • ID: ${UI.esc(stu.studentIdNum || "—")}</div>
            </div>
          </div>
          <div class="flex gap-2">
            <span class="badge badge-success">Davomat: ${stu.attendanceRate}%</span>
            ${UI.avgBadge(avg)}
          </div>
        </div>
        <div class="table-responsive mb-3">
          <table class="table">
            <thead><tr><th>Fan</th><th>Baholar</th><th>O'rtacha</th></tr></thead>
            <tbody>
              ${
                grades.length
                  ? grades
                      .map(
                        (g) => `
                    <tr>
                      <td class="font-semibold">${UI.esc(g.subject)}</td>
                      <td><div class="flex gap-1">${g.scores.map((sc) => UI.gradeChip(sc)).join("")}</div></td>
                      <td><strong>${g.avg.toFixed(1)}</strong></td>
                    </tr>
                  `
                      )
                      .join("")
                  : `<tr><td colspan="3" class="text-muted">Hali baholar qo'yilmagan</td></tr>`
              }
            </tbody>
          </table>
        </div>
        <div class="text-xs text-muted">Telefon: ${UI.esc(stu.phone)} • Ota-ona telefoni: ${UI.esc(stu.parentPhone || "—")}</div>
      `,
    });
  }

  function openAddTeacherModal(college, ctx) {
    const groups = Store.getGroups(college.id);
    UI.openModal({
      title: "Yangi o'qituvchi qo'shish",
      bodyHtml: `
        <form id="add-teacher-form">
          <div class="form-group">
            <label class="form-label">F.I.Sh. *</label>
            <input class="form-control" id="at-name" placeholder="Masalan: Rustamjon Aliyev" required />
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Kafedra</label>
              <select class="form-control" id="at-dept">
                ${college.departments.map((d) => `<option value="${UI.esc(d)}">${UI.esc(d)}</option>`).join("")}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Fan nomi *</label>
              <input class="form-control" id="at-subj" placeholder="Dasturlash" required />
            </div>
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Login *</label>
              <input class="form-control" id="at-login" placeholder="rustam.aliyev" required />
            </div>
            <div class="form-group">
              <label class="form-label">Parol *</label>
              <input class="form-control" id="at-pass" value="Oqtuvchi@2026" required />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Telefon</label>
            <input class="form-control" id="at-phone" value="+998 90 " />
          </div>
          <div class="form-group">
            <label class="form-label">Biriktirilgan guruhlar</label>
            <div class="chip-select-grid" id="at-groups">
              ${groups.map((g) => `<button type="button" class="chip-toggle" data-grp-pick="${UI.esc(g.code)}">${UI.esc(g.code)}</button>`).join("")}
            </div>
          </div>
          <button class="btn btn-primary btn-block mt-2">Saqlash va akkaunt yaratish</button>
        </form>
      `,
      onMount(close) {
        const picked = new Set();
        document.querySelectorAll("[data-grp-pick]").forEach((btn) => {
          btn.onclick = () => {
            const c = btn.dataset.grpPick;
            if (picked.has(c)) {
              picked.delete(c);
              btn.classList.remove("selected");
            } else {
              picked.add(c);
              btn.classList.add("selected");
            }
          };
        });
        document.getElementById("add-teacher-form").onsubmit = (e) => {
          e.preventDefault();
          const res = Store.addTeacher(college.id, {
            fullName: document.getElementById("at-name").value,
            department: document.getElementById("at-dept").value,
            subject: document.getElementById("at-subj").value,
            login: document.getElementById("at-login").value,
            password: document.getElementById("at-pass").value,
            phone: document.getElementById("at-phone").value,
            assignedGroups: Array.from(picked),
          });
          if (!res.ok) return UI.toast(res.error, "danger");
          UI.toast("O'qituvchi qo'shildi! Endi tizimga kira oladi.", "success");
          close();
          ctx.rerender();
        };
      },
    });
  }

  function openAddStudentModal(college, ctx) {
    const groups = Store.getGroups(college.id);
    UI.openModal({
      title: "Yangi o'quvchi qo'shish",
      bodyHtml: `
        <form id="add-student-form">
          <div class="form-group">
            <label class="form-label">F.I.Sh. *</label>
            <input class="form-control" id="as-name" placeholder="Masalan: Javohir Karimov" required />
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Guruh *</label>
              <select class="form-control" id="as-grp">
                ${groups.map((g) => `<option value="${UI.esc(g.code)}">${UI.esc(g.code)}</option>`).join("")}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Telefon</label>
              <input class="form-control" id="as-phone" value="+998 90 " />
            </div>
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Login *</label>
              <input class="form-control" id="as-login" placeholder="javohir.karimov" required />
            </div>
            <div class="form-group">
              <label class="form-label">Parol *</label>
              <input class="form-control" id="as-pass" value="Oquvchi@2026" required />
            </div>
          </div>
          <button class="btn btn-primary btn-block mt-2">O'quvchini qo'shish</button>
        </form>
      `,
      onMount(close) {
        document.getElementById("add-student-form").onsubmit = (e) => {
          e.preventDefault();
          const grpCode = document.getElementById("as-grp").value;
          const grp = groups.find((g) => g.code === grpCode);
          const res = Store.addStudent(college.id, {
            fullName: document.getElementById("as-name").value,
            groupCode: grpCode,
            course: grp?.course || 1,
            direction: grp?.direction || "Kompyuter injiniringi",
            login: document.getElementById("as-login").value,
            password: document.getElementById("as-pass").value,
            phone: document.getElementById("as-phone").value,
          });
          if (!res.ok) return UI.toast(res.error, "danger");
          UI.toast("Yangi o'quvchi ro'yxatga qo'shildi!", "success");
          close();
          ctx.rerender();
        };
      },
    });
  }

  function openAnnouncementModal(college, ctx) {
    UI.openModal({
      title: "Yangi e'lon yaratish",
      bodyHtml: `
        <form id="new-ann-form">
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Auditoriya</label>
              <select class="form-control" id="na-aud">
                <option value="Barcha foydalanuvchilar">Barcha foydalanuvchilar</option>
                <option value="O'qituvchilar">O'qituvchilar</option>
                <option value="O'quvchilar">O'quvchilar</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Turi</label>
              <select class="form-control" id="na-tag">
                <option value="Muhim">Muhim</option>
                <option value="Tadbir">Tadbir</option>
                <option value="O'quv">O'quv</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Sarlavha *</label>
            <input class="form-control" id="na-title" placeholder="Masalan: Yakuniy nazorat jadvali" required />
          </div>
          <div class="form-group">
            <label class="form-label">Matn *</label>
            <textarea class="form-control" id="na-body" placeholder="E'lon tafsilotlarini kiriting..." required></textarea>
          </div>
          <button class="btn btn-primary btn-block">Chop etish</button>
        </form>
      `,
      onMount(close) {
        document.getElementById("new-ann-form").onsubmit = (e) => {
          e.preventDefault();
          Store.addAnnouncement(college.id, {
            audience: document.getElementById("na-aud").value,
            tag: document.getElementById("na-tag").value,
            title: document.getElementById("na-title").value,
            body: document.getElementById("na-body").value,
            authorRole: "Direktorat",
          });
          UI.toast("E'lon barchaga yuborildi!", "success");
          close();
          ctx.rerender();
        };
      },
    });
  }
})();
