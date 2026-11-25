(function () {
  let libFilter = "Barchasi";
  let libSearch = "";
  let taskFilter = "all";

  window.StudentView = {
    getNav(user, college) {
      const db = Store.getState();
      const activeTasks = db.tasks.filter(
        (t) =>
          t.collegeId === college.id &&
          t.groupCode === user.groupCode &&
          !t.submissions.some((s) => s.studentId === user.id)
      ).length;
      return [
        { id: "dashboard", label: "Bosh sahifa", icon: "home" },
        { id: "grades", label: "Baholar", icon: "award" },
        { id: "schedule", label: "Dars jadvali", icon: "calendar" },
        { id: "attendance", label: "Davomat", icon: "checkSquare" },
        { id: "tasks", label: "Vazifalar", icon: "clipboard", badge: activeTasks || null },
        { id: "library", label: "Kutubxona", icon: "book" },
        { id: "messages", label: "Guruh chati", icon: "message" },
        { id: "announcements", label: "E'lonlar & Profil", icon: "megaphone" },
      ];
    },

    render(page, user, college, ctx) {
      if (page === "dashboard") return renderDashboard(user, college, ctx);
      if (page === "grades") return renderGrades(user, college);
      if (page === "schedule") return renderSchedule(user, college);
      if (page === "attendance") return renderAttendance(user, college);
      if (page === "tasks") return renderTasks(user, college, ctx);
      if (page === "library") return renderLibrary(college, ctx);
      if (page === "messages") return renderMessages(user, college, ctx);
      if (page === "announcements") return renderAnnouncements(user, college);
      return renderDashboard(user, college, ctx);
    },
  };

  function renderDashboard(user, college, ctx) {
    const db = Store.getState();
    const myGrades = Store.getStudentGrades(user.id);
    const overallAvg = Store.getStudentOverallAvg(user.id);
    const teachers = Store.getUsersByRole(college.id, "teacher");
    const myTasks = db.tasks.filter((t) => t.collegeId === college.id && t.groupCode === user.groupCode);
    const pendingTasks = myTasks.filter((t) => !t.submissions.some((s) => s.studentId === user.id));
    const days = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma"];
    const mySchedule = db.schedule.filter((s) => s.collegeId === college.id && s.groupCode === user.groupCode);
    const announcements = db.announcements
      .filter((a) => a.collegeId === college.id && (a.audience === "Barcha foydalanuvchilar" || a.audience === "O'quvchilar"))
      .slice(0, 3);

    ctx.container.innerHTML = `
      <div class="kpi-grid-4">
        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">O'rtacha baho</span>
            <span class="kpi-icon" style="background:var(--primary-soft);color:var(--primary);">${Icons.award("icon-sm")}</span>
          </div>
          <div class="kpi-value">${overallAvg.toFixed(1)}</div>
          <div class="kpi-sub text-success font-semibold">${overallAvg >= 4.5 ? "A'lo daraja" : "Yaxshi daraja"}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Davomat</span>
            <span class="kpi-icon" style="background:var(--success-soft);color:var(--success);">${Icons.checkSquare("icon-sm")}</span>
          </div>
          <div class="kpi-value">${user.attendanceRate || 96}%</div>
          <div class="kpi-sub text-muted">${user.attendedLessons || 48} / ${user.totalLessons || 50} dars</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Faol vazifalar</span>
            <span class="kpi-icon" style="background:var(--warning-soft);color:var(--warning);">${Icons.clipboard("icon-sm")}</span>
          </div>
          <div class="kpi-value">${pendingTasks.length}</div>
          <div class="kpi-sub text-warning font-semibold">${pendingTasks.length ? "1 tasi bugun tugaydi" : "Hammasi topshirilgan"}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">Guruhdagi o'rni</span>
            <span class="kpi-icon" style="background:#e0f2fe;color:#0284c7;">${Icons.users("icon-sm")}</span>
          </div>
          <div class="kpi-value">${user.rankInGroup || 2}-o'rin</div>
          <div class="kpi-sub text-muted">${user.groupSize || 28} o'quvchi ichida</div>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header">
          <div>
            <h3 class="card-title">Fanlar bo'yicha baholar</h3>
            <p class="card-subtitle">Joriy semestr baholari va o'rtacha ko'rsatkichlar</p>
          </div>
          <button class="btn btn-ghost btn-xs" id="stu-goto-grades">Reytingni ko'rish →</button>
        </div>
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Fan nomi</th>
                <th>O'qituvchi</th>
                <th>Baholar</th>
                <th style="text-align:right;">O'rtacha</th>
              </tr>
            </thead>
            <tbody>
              ${
                myGrades.length
                  ? myGrades
                      .map((g) => {
                        const tch = teachers.find((t) => t.id === g.teacherId);
                        return `
                        <tr>
                          <td class="font-semibold">${UI.esc(g.subject)}</td>
                          <td class="text-secondary">${UI.esc(tch?.fullName || "O'qituvchi")}</td>
                          <td><div class="flex gap-1">${g.scores.map((sc) => UI.gradeChip(sc)).join("")}</div></td>
                          <td style="text-align:right;"><strong>${g.avg.toFixed(1)}</strong></td>
                        </tr>
                      `;
                      })
                      .join("")
                  : `<tr><td colspan="4" class="text-muted">Hali baholar kiritilmagan</td></tr>`
              }
            </tbody>
          </table>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header">
          <h3 class="card-title">Haftalik dars jadvali</h3>
          <span class="badge badge-neutral">${UI.esc(user.groupCode)}</span>
        </div>
        <div class="timetable-grid">
          ${days
            .map((day) => {
              const slots = mySchedule.filter((s) => s.day === day);
              return `
              <div class="day-col ${day === "Seshanba" ? "today" : ""}">
                <div class="day-header">
                  <span>${day}</span>
                  ${day === "Seshanba" ? `<span class="badge badge-primary">Bugun</span>` : ""}
                </div>
                ${
                  slots.length
                    ? slots
                        .map(
                          (sl) => `
                      <div class="lesson-slot">
                        <div class="font-bold text-sm">${UI.esc(sl.subject)}</div>
                        <div class="text-xs text-muted mt-1">${UI.esc(sl.time)} • ${UI.esc(sl.room)}</div>
                      </div>
                    `
                        )
                        .join("")
                    : `<div class="text-xs text-muted">Dars yo'q</div>`
                }
              </div>
            `;
            })
            .join("")}
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Uyga vazifalar</h3>
            <button class="btn btn-ghost btn-xs" id="stu-goto-tasks">Barchasi</button>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;">
            ${myTasks
              .slice(0, 3)
              .map((t) => {
                const submitted = t.submissions.some((s) => s.studentId === user.id);
                const badgeCls = submitted
                  ? "badge-success"
                  : t.urgencyType === "danger"
                  ? "badge-danger"
                  : t.urgencyType === "warning"
                  ? "badge-warning"
                  : "badge-success";
                return `
                <div class="notice-card flex items-center justify-between gap-2" style="cursor:pointer;" data-submit-task="${t.id}">
                  <div>
                    <div class="font-bold text-sm">${UI.esc(t.subject)}: ${UI.esc(t.title)}</div>
                    <div class="text-xs text-muted mt-1">${UI.esc(t.description)}</div>
                  </div>
                  <span class="badge ${badgeCls}">${submitted ? "Topshirildi" : UI.esc(t.urgencyLabel)}</span>
                </div>
              `;
              })
              .join("")}
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">E'lonlar</h3>
            <button class="btn btn-ghost btn-xs" id="stu-goto-lib">Kutubxona →</button>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;">
            ${announcements
              .map(
                (a) => `
              <div class="notice-card">
                <div class="flex items-center justify-between mb-1">
                  <span class="badge badge-primary">${UI.esc(a.authorRole)}</span>
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
      </div>
    `;

    document.getElementById("stu-goto-grades").onclick = () => ctx.navigate("grades");
    document.getElementById("stu-goto-tasks").onclick = () => ctx.navigate("tasks");
    document.getElementById("stu-goto-lib").onclick = () => ctx.navigate("library");
    document.querySelectorAll("[data-submit-task]").forEach((el) => {
      el.onclick = () => openSubmitTaskModal(el.dataset.submitTask, user, ctx);
    });
  }

  function renderGrades(user, college) {
    const myGrades = Store.getStudentGrades(user.id);
    const classmates = Store.getUsersByRole(college.id, "student")
      .filter((s) => s.groupCode === user.groupCode)
      .map((s) => ({ ...s, avg: Store.getStudentOverallAvg(s.id) }))
      .sort((a, b) => b.avg - a.avg);

    document.getElementById("view-root").innerHTML = `
      <div class="grid-main-side">
        <div class="card">
          <h3 class="card-title mb-1">Barcha fanlar bo'yicha o'zlashtirish</h3>
          <p class="card-subtitle mb-4">Umumiy o'rtacha ball: <strong>${Store.getStudentOverallAvg(user.id).toFixed(1)}</strong></p>
          <div class="table-responsive">
            <table class="table">
              <thead><tr><th>Fan</th><th>Baholar</th><th>O'rtacha</th></tr></thead>
              <tbody>
                ${myGrades
                  .map(
                    (g) => `
                  <tr>
                    <td class="font-semibold">${UI.esc(g.subject)}</td>
                    <td><div class="flex gap-1">${g.scores.map((sc) => UI.gradeChip(sc)).join("")}</div></td>
                    <td>${UI.avgBadge(g.avg)}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <h3 class="card-title mb-1">${UI.esc(user.groupCode)} guruh reytingi</h3>
          <p class="card-subtitle mb-4">Guruhdagi o'quvchilar o'rtacha bali</p>
          ${classmates
            .map(
              (c, idx) => `
            <div class="leader-item" style="${c.id === user.id ? "border-color:var(--primary);background:var(--primary-soft);" : ""}">
              <div class="flex items-center gap-3">
                <span class="rank-num ${idx === 0 ? "top-1" : ""}">${idx + 1}</span>
                <div>
                  <div class="font-semibold text-sm">${UI.esc(c.fullName)} ${c.id === user.id ? "(Siz)" : ""}</div>
                  <div class="text-xs text-muted">Davomat: ${c.attendanceRate}%</div>
                </div>
              </div>
              ${UI.avgBadge(c.avg)}
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  function renderSchedule(user, college) {
    const db = Store.getState();
    const teachers = Store.getUsersByRole(college.id, "teacher");
    const days = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma"];
    const mySchedule = db.schedule.filter((s) => s.collegeId === college.id && s.groupCode === user.groupCode);

    document.getElementById("view-root").innerHTML = `
      <div class="mb-4">
        <h2 class="text-xl font-bold" style="margin:0;">Haftalik dars jadvali (${UI.esc(user.groupCode)})</h2>
        <p class="text-sm text-muted" style="margin:2px 0 0;">${UI.esc(user.direction || "Kompyuter injiniringi")}</p>
      </div>
      <div class="timetable-grid">
        ${days
          .map((day) => {
            const slots = mySchedule.filter((s) => s.day === day);
            return `
            <div class="day-col ${day === "Seshanba" ? "today" : ""}">
              <div class="day-header">
                <span>${day}</span>
                ${day === "Seshanba" ? `<span class="badge badge-primary">Bugun</span>` : ""}
              </div>
              ${
                slots.length
                  ? slots
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
  }

  function renderAttendance(user) {
    const db = Store.getState();
    const todaySt = db.attendanceToday[user.id] || "Keldi";
    const logs = [
      { date: "25.11.2026", subject: "Dasturlash asoslari", status: todaySt },
      { date: "24.11.2026", subject: "Matematika", status: "Keldi" },
      { date: "22.11.2026", subject: "Ma'lumotlar bazasi", status: "Keldi" },
      { date: "21.11.2026", subject: "Ingliz tili", status: "Keldi" },
      { date: "19.11.2026", subject: "Fizika", status: "Sababli" },
    ];

    document.getElementById("view-root").innerHTML = `
      <div class="kpi-grid-3">
        <div class="kpi-card">
          <div class="kpi-label">Umumiy davomat</div>
          <div class="kpi-value mt-1">${user.attendanceRate || 96}%</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Qatnashilgan darslar</div>
          <div class="kpi-value mt-1 text-success">${user.attendedLessons || 48}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Bugungi holat</div>
          <div class="kpi-value mt-1">${UI.esc(todaySt)}</div>
        </div>
      </div>
      <div class="card">
        <h3 class="card-title mb-3">So'nggi darslar davomati</h3>
        <table class="table">
          <thead><tr><th>Sana</th><th>Fan</th><th>Holat</th></tr></thead>
          <tbody>
            ${logs
              .map(
                (l) => `
              <tr>
                <td>${l.date}</td>
                <td class="font-semibold">${l.subject}</td>
                <td><span class="att-pill ${l.status === "Keldi" ? "att-present" : l.status === "Kelmadi" ? "att-absent" : "att-excused"}">${l.status}</span></td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderTasks(user, college, ctx) {
    const db = Store.getState();
    const myTasks = db.tasks.filter((t) => t.collegeId === college.id && t.groupCode === user.groupCode);
    const filtered = myTasks.filter((t) => {
      const done = t.submissions.some((s) => s.studentId === user.id);
      if (taskFilter === "pending") return !done;
      if (taskFilter === "done") return done;
      return true;
    });

    ctx.container.innerHTML = `
      <div class="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h2 class="text-xl font-bold" style="margin:0;">Uyga vazifalar</h2>
          <p class="text-sm text-muted" style="margin:2px 0 0;">Vazifani tanlab javobingizni yuboring</p>
        </div>
        <div class="flex gap-1">
          <button class="btn btn-sm ${taskFilter === "all" ? "btn-primary" : "btn-secondary"}" data-tf="all">Barchasi</button>
          <button class="btn btn-sm ${taskFilter === "pending" ? "btn-primary" : "btn-secondary"}" data-tf="pending">Faol</button>
          <button class="btn btn-sm ${taskFilter === "done" ? "btn-primary" : "btn-secondary"}" data-tf="done">Topshirilgan</button>
        </div>
      </div>

      <div class="grid-2">
        ${filtered
          .map((t) => {
            const sub = t.submissions.find((s) => s.studentId === user.id);
            return `
            <div class="card">
              <div class="flex items-center justify-between mb-2">
                <span class="badge badge-primary">${UI.esc(t.subject)}</span>
                <span class="badge ${sub ? "badge-success" : "badge-warning"}">${sub ? "Topshirildi" : `Muddat: ${UI.esc(t.deadline)}`}</span>
              </div>
              <h3 class="card-title mb-1">${UI.esc(t.title)}</h3>
              <p class="text-sm text-secondary mb-3">${UI.esc(t.description)}</p>
              ${
                sub
                  ? `<div class="p-2 mb-3 text-xs" style="background:var(--success-soft);color:var(--success-text);border-radius:8px;padding:8px 10px;">Javobingiz: ${UI.esc(sub.answer)}</div>`
                  : ""
              }
              <button class="btn ${sub ? "btn-secondary" : "btn-primary"} btn-sm" data-submit-task="${t.id}">
                ${sub ? "Javobni tahrirlash" : "Vazifani topshirish"}
              </button>
            </div>
          `;
          })
          .join("")}
      </div>
    `;

    document.querySelectorAll("[data-tf]").forEach((b) => {
      b.onclick = () => {
        taskFilter = b.dataset.tf;
        ctx.rerender();
      };
    });
    document.querySelectorAll("[data-submit-task]").forEach((b) => {
      b.onclick = () => openSubmitTaskModal(b.dataset.submitTask, user, ctx);
    });
  }

  function renderLibrary(college, ctx) {
    const db = Store.getState();
    const categories = ["Barchasi", ...new Set(db.library.map((b) => b.category))];
    const items = db.library.filter((b) => {
      const mc = libFilter === "Barchasi" || b.category === libFilter;
      const mq =
        !libSearch ||
        b.title.toLowerCase().includes(libSearch.toLowerCase()) ||
        b.author.toLowerCase().includes(libSearch.toLowerCase());
      return mc && mq;
    });

    ctx.container.innerHTML = `
      <div class="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h2 class="text-xl font-bold" style="margin:0;">Elektron kutubxona</h2>
          <p class="text-sm text-muted" style="margin:2px 0 0;">${UI.esc(college.name)} darslik va o'quv qo'llanmalari</p>
        </div>
        <input class="form-control" id="lib-search" style="width:240px;" placeholder="Kitob yoki muallif qidirish..." value="${UI.esc(libSearch)}" />
      </div>

      <div class="flex gap-2 flex-wrap mb-4">
        ${categories
          .map(
            (c) =>
              `<button class="chip-toggle ${libFilter === c ? "selected" : ""}" data-lib-cat="${UI.esc(c)}">${UI.esc(c)}</button>`
          )
          .join("")}
      </div>

      <div class="grid-3">
        ${items
          .map(
            (b) => `
          <div class="card">
            <div class="flex items-center justify-between mb-2">
              <span class="badge badge-primary">${UI.esc(b.category)}</span>
              <span class="text-xs text-muted">${b.year} • ${b.pages} bet</span>
            </div>
            <h3 class="card-title mb-1">${UI.esc(b.title)}</h3>
            <div class="text-xs text-muted mb-2">Muallif: ${UI.esc(b.author)}</div>
            <p class="text-sm text-secondary mb-3">${UI.esc(b.desc)}</p>
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-muted">${UI.esc(b.format)}</span>
              <button class="btn btn-soft btn-sm" data-read-book="${b.id}">${Icons.book("icon-sm")} O'qish / Yuklash</button>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    document.getElementById("lib-search").oninput = (e) => {
      libSearch = e.target.value;
      ctx.rerender();
    };
    document.querySelectorAll("[data-lib-cat]").forEach((b) => {
      b.onclick = () => {
        libFilter = b.dataset.libCat;
        ctx.rerender();
      };
    });
    document.querySelectorAll("[data-read-book]").forEach((b) => {
      b.onclick = () => {
        const book = db.library.find((x) => x.id === b.dataset.readBook);
        UI.openModal({
          title: book.title,
          bodyHtml: `
            <div class="mb-3"><span class="badge badge-primary">${UI.esc(book.category)}</span> <span class="text-xs text-muted">${UI.esc(book.author)} • ${book.pages} bet</span></div>
            <p class="text-sm text-secondary mb-4">${UI.esc(book.desc)}</p>
            <div class="p-3 mb-4" style="background:var(--bg-surface-2);border-radius:10px;padding:12px;">
              <div class="font-semibold text-sm mb-1">1-bob. Kirish va asosiy tushunchalar</div>
              <div class="text-xs text-muted">Ushbu o'quv qo'llanma ${UI.esc(college.name)} o'quvchilari uchun tayyorlangan. Amaliy mashqlar va test savollarini o'z ichiga oladi.</div>
            </div>
            <button class="btn btn-primary btn-block" id="dl-book-btn">${Icons.download("icon-sm")} PDF nusxasini yuklab olish</button>
          `,
          onMount(close) {
            document.getElementById("dl-book-btn").onclick = () => {
              UI.toast(`"${book.title}" yuklab olindi!`, "success");
              close();
            };
          },
        });
      };
    });
  }

  function renderMessages(user, college, ctx) {
    const db = Store.getState();
    const msgs = db.messages.filter((m) => m.collegeId === college.id && m.toGroup === user.groupCode);

    ctx.container.innerHTML = `
      <div class="mb-4">
        <h2 class="text-xl font-bold" style="margin:0;">${UI.esc(user.groupCode)} guruh chati</h2>
        <p class="text-sm text-muted" style="margin:2px 0 0;">O'qituvchilar va guruhdoshlar bilan tezkor aloqa</p>
      </div>
      <div class="card">
        <div style="display:flex;flex-direction:column;gap:10px;max-height:360px;overflow-y:auto;margin-bottom:16px;">
          ${msgs
            .map(
              (m) => `
            <div class="notice-card" style="${m.fromId === user.id ? "border-color:var(--primary);background:var(--primary-soft);" : ""}">
              <div class="flex items-center justify-between mb-1">
                <span class="font-bold text-sm">${UI.esc(m.senderName)}</span>
                <span class="text-xs text-muted">${UI.esc(m.time)}</span>
              </div>
              <div class="text-sm">${UI.esc(m.text)}</div>
            </div>
          `
            )
            .join("")}
        </div>
        <form id="stu-msg-form" class="flex gap-2">
          <input class="form-control" id="stu-msg-input" placeholder="Guruhga xabar yozing..." required />
          <button class="btn btn-primary">Yuborish</button>
        </form>
      </div>
    `;

    document.getElementById("stu-msg-form").onsubmit = (e) => {
      e.preventDefault();
      const inp = document.getElementById("stu-msg-input");
      if (!inp.value.trim()) return;
      Store.addMessage(college.id, user.id, user.groupCode, user.fullName, inp.value);
      ctx.rerender();
    };
  }

  function renderAnnouncements(user, college) {
    const db = Store.getState();
    const list = db.announcements.filter(
      (a) => a.collegeId === college.id && (a.audience === "Barcha foydalanuvchilar" || a.audience === "O'quvchilar")
    );

    document.getElementById("view-root").innerHTML = `
      <div class="grid-main-side">
        <div>
          <h2 class="text-xl font-bold mb-3" style="margin-top:0;">E'lonlar</h2>
          <div style="display:flex;flex-direction:column;gap:12px;">
            ${list
              .map(
                (a) => `
              <div class="card">
                <div class="flex items-center justify-between mb-2">
                  <span class="badge badge-primary">${UI.esc(a.authorRole)}</span>
                  <span class="text-xs text-muted">${UI.esc(a.date)}</span>
                </div>
                <h3 class="card-title mb-1">${UI.esc(a.title)}</h3>
                <p class="text-sm text-secondary" style="margin:0;">${UI.esc(a.body)}</p>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <div>
          <h2 class="text-xl font-bold mb-3" style="margin-top:0;">Elektron guvohnoma</h2>
          <div class="student-id-card">
            <div class="text-xs" style="opacity:0.85;">${UI.esc(college.name)}</div>
            <div class="text-lg font-bold mt-2">${UI.esc(user.fullName)}</div>
            <div class="text-xs mt-1" style="opacity:0.9;">${UI.esc(user.groupCode)} • ${UI.esc(user.direction || "Kompyuter injiniringi")}</div>
            <div class="flex items-center justify-between mt-4 pt-3" style="border-top:1px solid rgba(255,255,255,0.2);">
              <div>
                <div class="text-xs" style="opacity:0.75;">Talaba ID</div>
                <div class="font-bold text-sm">${UI.esc(user.studentIdNum || "TATK-2025-0142")}</div>
              </div>
              <span class="badge" style="background:rgba(255,255,255,0.2);color:#fff;">Faol talaba</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function openSubmitTaskModal(taskId, user, ctx) {
    const db = Store.getState();
    const task = db.tasks.find((t) => t.id === taskId);
    if (!task) return;
    const prev = task.submissions.find((s) => s.studentId === user.id);

    UI.openModal({
      title: `Vazifa topshirish: ${task.title}`,
      bodyHtml: `
        <p class="text-sm text-secondary mb-3">${UI.esc(task.description)}</p>
        <form id="submit-task-form">
          <div class="form-group">
            <label class="form-label">Javobingiz yoki GitHub / fayl havolasi *</label>
            <textarea class="form-control" id="st-answer" placeholder="Masalan: https://github.com/... yoki yechim matni" required>${UI.esc(prev?.answer || "")}</textarea>
          </div>
          <button class="btn btn-primary btn-block">Vazifani yuborish</button>
        </form>
      `,
      onMount(close) {
        document.getElementById("submit-task-form").onsubmit = (e) => {
          e.preventDefault();
          Store.submitTask(task.id, user.id, user.fullName, document.getElementById("st-answer").value);
          UI.toast("Vazifa muvaffaqiyatli topshirildi!", "success");
          close();
          ctx.rerender();
        };
      },
    });
  }
})();
