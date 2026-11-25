(function () {
  let activeGroup = "KI-21";
  let activeSubject = "Dasturlash";

  window.TeacherView = {
    getNav(user, college) {
      const db = Store.getState();
      const taskCount = db.tasks.filter((t) => t.collegeId === college.id && t.teacherId === user.id).length;
      return [
        { id: "dashboard", label: "Bosh sahifa", icon: "home" },
        { id: "grades", label: "Baholar", icon: "award" },
        { id: "schedule", label: "Dars jadvali", icon: "calendar" },
        { id: "attendance", label: "Davomat", icon: "checkSquare" },
        { id: "tasks", label: "Vazifalar", icon: "clipboard", badge: taskCount },
        { id: "messages", label: "Guruh chati", icon: "message" },
        { id: "announcements", label: "E'lonlar", icon: "megaphone" },
      ];
    },

    render(page, user, college, ctx) {
      const groups = user.assignedGroups?.length ? user.assignedGroups : Store.getGroups(college.id).map((g) => g.code);
      if (!groups.includes(activeGroup) && groups.length) activeGroup = groups[0];
      activeSubject = user.subject || "Dasturlash";

      if (page === "dashboard") return renderDashboard(user, college, groups, ctx);
      if (page === "grades") return renderGrades(user, college, groups, ctx);
      if (page === "schedule") return renderSchedule(user, college);
      if (page === "attendance") return renderAttendance(user, college, groups, ctx);
      if (page === "tasks") return renderTasks(user, college, groups, ctx);
      if (page === "messages") return renderMessages(user, college, groups, ctx);
      if (page === "announcements") return renderAnnouncements(user, college, ctx);
      return renderDashboard(user, college, groups, ctx);
    },
  };

  function getGroupStudents(collegeId, groupCode) {
    return Store.getUsersByRole(collegeId, "student").filter((s) => s.groupCode === groupCode);
  }

  function renderDashboard(user, college, groups, ctx) {
    const db = Store.getState();
    const todayLessons = db.schedule.filter(
      (s) => s.collegeId === college.id && s.teacherId === user.id && s.day === "Seshanba"
    );
    const lessonsToShow = todayLessons.length
      ? todayLessons
      : db.schedule.filter((s) => s.collegeId === college.id && s.day === "Seshanba").slice(0, 3);

    const students = getGroupStudents(college.id, activeGroup);
    const tasks = db.tasks.filter((t) => t.collegeId === college.id && (t.teacherId === user.id || groups.includes(t.groupCode))).slice(0, 4);

    ctx.container.innerHTML = `
      <div class="card mb-4">
        <div class="card-header">
          <div>
            <h3 class="card-title">Bugungi darslar</h3>
            <p class="card-subtitle">Tezkor jurnalga o'tish uchun darsni tanlang</p>
          </div>
          <span class="text-xs font-semibold text-muted">Seshanba • ${lessonsToShow.length} ta dars</span>
        </div>

        <div class="grid-3">
          ${lessonsToShow
            .map((l) => {
              const badgeCls =
                l.status === "Faol" ? "badge-success" : l.status === "Keyingi" ? "badge-primary" : "badge-neutral";
              return `
              <div class="notice-card" style="background:var(--bg-surface);">
                <div class="flex items-center justify-between mb-2">
                  <span class="badge badge-primary">${UI.esc(l.time)}</span>
                  <span class="badge ${badgeCls}">${UI.esc(l.status)}</span>
                </div>
                <div class="font-bold text-sm mb-1">${UI.esc(l.subject)}</div>
                <div class="text-xs text-muted mb-3">${UI.esc(l.groupCode)} guruhi • ${UI.esc(l.room)}</div>
                <button class="btn btn-soft btn-sm btn-block" data-open-journal="${UI.esc(l.groupCode)}" data-open-subj="${UI.esc(l.subject)}">
                  Jurnalni ochish
                </button>
              </div>
            `;
            })
            .join("")}
        </div>
      </div>

      <div class="card mb-4" id="teacher-journal-card">
        <div class="card-header">
          <div>
            <h3 class="card-title">Elektron jurnal</h3>
            <p class="card-subtitle">Tezkor baho qo'yish va davomatni belgilash</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-muted">Guruh:</span>
            <select class="form-control" id="tj-group-select" style="width:220px;">
              ${groups
                .map(
                  (g) =>
                    `<option value="${UI.esc(g)}" ${activeGroup === g ? "selected" : ""}>${UI.esc(g)} — ${UI.esc(activeSubject)}</option>`
                )
                .join("")}
            </select>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>O'quvchi</th>
                <th>Joriy baholar</th>
                <th>Baho qo'shish</th>
                <th style="text-align:right;">Davomat</th>
              </tr>
            </thead>
            <tbody>
              ${
                students.length
                  ? students
                      .map((stu) => {
                        const gr = db.grades.find(
                          (g) => g.studentId === stu.id && g.subject === activeSubject
                        );
                        const scores = gr ? gr.scores : [];
                        const att = db.attendanceToday[stu.id] || "Keldi";
                        const attCls =
                          att === "Keldi" ? "att-present" : att === "Kelmadi" ? "att-absent" : "att-excused";
                        return `
                        <tr>
                          <td>
                            <div class="font-semibold">${UI.esc(stu.fullName)}</div>
                            <div class="text-xs text-muted">O'rtacha: ${gr ? gr.avg.toFixed(1) : "—"}</div>
                          </td>
                          <td>
                            <div class="flex gap-1 flex-wrap">
                              ${scores.length ? scores.map((sc) => UI.gradeChip(sc)).join("") : `<span class="text-xs text-muted">Baholar yo'q</span>`}
                            </div>
                          </td>
                          <td>
                            <div class="quick-grade-group">
                              ${[5, 4, 3, 2]
                                .map(
                                  (val) => `
                                <button type="button" class="quick-grade-btn" data-add-grade="${stu.id}" data-score="${val}">+${val}</button>
                              `
                                )
                                .join("")}
                            </div>
                          </td>
                          <td style="text-align:right;">
                            <button type="button" class="att-pill ${attCls}" data-toggle-att="${stu.id}">${UI.esc(att)}</button>
                          </td>
                        </tr>
                      `;
                      })
                      .join("")
                  : `<tr><td colspan="4" class="text-muted">Bu guruhda hali o'quvchilar ro'yxatga olinmagan.</td></tr>`
              }
            </tbody>
          </table>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <h3 class="card-title mb-3">Vazifa biriktirish</h3>
          <form id="quick-task-form">
            <div class="form-group">
              <label class="form-label">Guruh</label>
              <select class="form-control" id="qt-group">
                ${groups.map((g) => `<option value="${UI.esc(g)}" ${activeGroup === g ? "selected" : ""}>${UI.esc(g)}</option>`).join("")}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Vazifa nomi *</label>
              <input class="form-control" id="qt-title" placeholder="Masalan: Massivlar bo'yicha 5 ta masala" required />
            </div>
            <div class="form-group">
              <label class="form-label">Topshirish muddati *</label>
              <input class="form-control" id="qt-deadline" type="date" value="2026-11-28" required />
            </div>
            <button type="submit" class="btn btn-primary btn-block">${Icons.plus("icon-sm")} Vazifa yaratish</button>
          </form>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Berilgan vazifalar</h3>
            <button class="btn btn-ghost btn-xs" id="tch-all-tasks">Barchasi →</button>
          </div>
          <div class="flex flex-col" style="display:flex;flex-direction:column;gap:10px;">
            ${tasks
              .map(
                (t) => `
              <div class="notice-card">
                <div class="flex items-center justify-between mb-1">
                  <span class="badge badge-primary">${UI.esc(t.groupCode)}</span>
                  <span class="text-xs text-muted">Muddat: ${UI.esc(t.deadline)}</span>
                </div>
                <div class="font-bold text-sm">${UI.esc(t.title)}</div>
                <div class="text-xs text-muted mt-1">Topshirganlar: ${t.submissions.length} ta</div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;

    document.querySelectorAll("[data-open-journal]").forEach((b) => {
      b.onclick = () => {
        activeGroup = b.dataset.openJournal;
        UI.toast(`${activeGroup} jurnali ochildi`, "primary");
        ctx.rerender();
      };
    });

    document.getElementById("tj-group-select").onchange = (e) => {
      activeGroup = e.target.value;
      ctx.rerender();
    };

    document.querySelectorAll("[data-add-grade]").forEach((b) => {
      b.onclick = () => {
        Store.addQuickGrade(college.id, b.dataset.addGrade, activeSubject, user.id, b.dataset.score);
        UI.toast(`+${b.dataset.score} baho qo'yildi`, "success");
        ctx.rerender();
      };
    });

    document.querySelectorAll("[data-toggle-att]").forEach((b) => {
      b.onclick = () => {
        const next = Store.toggleAttendance(b.dataset.toggleAtt);
        UI.toast(`Davomat: ${next}`, next === "Kelmadi" ? "warning" : "success");
        ctx.rerender();
      };
    });

    document.getElementById("quick-task-form").onsubmit = (e) => {
      e.preventDefault();
      Store.addTask(college.id, {
        groupCode: document.getElementById("qt-group").value,
        subject: activeSubject,
        teacherId: user.id,
        title: document.getElementById("qt-title").value,
        deadline: document.getElementById("qt-deadline").value,
      });
      UI.toast("Yangi vazifa yaratildi!", "success");
      ctx.rerender();
    };

    document.getElementById("tch-all-tasks").onclick = () => ctx.navigate("tasks");
  }

  function renderGrades(user, college, groups, ctx) {
    const db = Store.getState();
    const students = getGroupStudents(college.id, activeGroup);

    ctx.container.innerHTML = `
      <div class="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h2 class="text-xl font-bold" style="margin:0;">To'liq baholar jurnali</h2>
          <p class="text-sm text-muted" style="margin:2px 0 0;">Baho ustiga bossangiz uni o'chirishingiz mumkin</p>
        </div>
        <div class="flex gap-2">
          <select class="form-control" id="gr-group-sel" style="width:160px;">
            ${groups.map((g) => `<option value="${UI.esc(g)}" ${activeGroup === g ? "selected" : ""}>${UI.esc(g)}</option>`).join("")}
          </select>
          <button class="btn btn-secondary" id="export-grades-btn">${Icons.download("icon-sm")} CSV yuklash</button>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>O'quvchi</th>
                <th>Fan</th>
                <th>Baholar (o'chirish uchun bosing)</th>
                <th>O'rtacha</th>
                <th>Tezkor baho</th>
              </tr>
            </thead>
            <tbody>
              ${students
                .map((stu) => {
                  const gr = db.grades.find((g) => g.studentId === stu.id && g.subject === activeSubject);
                  return `
                  <tr>
                    <td class="font-semibold">${UI.esc(stu.fullName)}</td>
                    <td class="text-sm text-secondary">${UI.esc(activeSubject)}</td>
                    <td>
                      <div class="flex gap-1 flex-wrap">
                        ${
                          gr && gr.scores.length
                            ? gr.scores
                                .map(
                                  (sc, idx) =>
                                    `<span style="cursor:pointer;" title="O'chirish" data-del-grade="${gr.id}" data-del-idx="${idx}">${UI.gradeChip(sc)}</span>`
                                )
                                .join("")
                            : `<span class="text-xs text-muted">—</span>`
                        }
                      </div>
                    </td>
                    <td>${gr ? UI.avgBadge(gr.avg) : "—"}</td>
                    <td>
                      <div class="quick-grade-group">
                        ${[5, 4, 3, 2]
                          .map((val) => `<button type="button" class="quick-grade-btn" data-add-grade="${stu.id}" data-score="${val}">+${val}</button>`)
                          .join("")}
                      </div>
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

    document.getElementById("gr-group-sel").onchange = (e) => {
      activeGroup = e.target.value;
      ctx.rerender();
    };
    document.querySelectorAll("[data-add-grade]").forEach((b) => {
      b.onclick = () => {
        Store.addQuickGrade(college.id, b.dataset.addGrade, activeSubject, user.id, b.dataset.score);
        UI.toast(`+${b.dataset.score} qo'shildi`, "success");
        ctx.rerender();
      };
    });
    document.querySelectorAll("[data-del-grade]").forEach((el) => {
      el.onclick = () => {
        Store.removeGradeAt(el.dataset.delGrade, Number(el.dataset.delIdx));
        UI.toast("Baho o'chirildi", "warning");
        ctx.rerender();
      };
    });
    document.getElementById("export-grades-btn").onclick = () => {
      const rows = [["O'quvchi", "Guruh", "Fan", "Baholar", "O'rtacha"]];
      students.forEach((stu) => {
        const gr = db.grades.find((g) => g.studentId === stu.id && g.subject === activeSubject);
        rows.push([stu.fullName, activeGroup, activeSubject, gr ? gr.scores.join(" ") : "", gr ? gr.avg : ""]);
      });
      UI.exportCSV(`jurnal_${activeGroup}.csv`, rows);
    };
  }

  function renderSchedule(user, college) {
    const db = Store.getState();
    const days = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma"];
    const mySlots = db.schedule.filter((s) => s.collegeId === college.id && s.teacherId === user.id);

    ctx.container.innerHTML = `
      <div class="mb-4">
        <h2 class="text-xl font-bold" style="margin:0;">Haftalik dars jadvalim</h2>
        <p class="text-sm text-muted" style="margin:2px 0 0;">${UI.esc(user.fullName)} — ${UI.esc(activeSubject)}</p>
      </div>
      <div class="timetable-grid">
        ${days
          .map((day) => {
            const slots = mySlots.filter((s) => s.day === day);
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
                      <div class="badge badge-neutral mb-1">${UI.esc(sl.groupCode)}</div>
                      <div class="font-bold text-sm">${UI.esc(sl.subject)}</div>
                      <div class="text-xs text-muted mt-1">${UI.esc(sl.time)} • ${UI.esc(sl.room)}</div>
                    </div>
                  `
                      )
                      .join("")
                  : `<div class="text-xs text-muted">Bo'sh kun</div>`
              }
            </div>
          `;
          })
          .join("")}
      </div>
    `;
  }

  function renderAttendance(user, college, groups, ctx) {
    const db = Store.getState();
    const students = getGroupStudents(college.id, activeGroup);
    const presentCount = students.filter((s) => (db.attendanceToday[s.id] || "Keldi") === "Keldi").length;

    ctx.container.innerHTML = `
      <div class="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h2 class="text-xl font-bold" style="margin:0;">Davomat jurnali</h2>
          <p class="text-sm text-muted" style="margin:2px 0 0;">Bugungi darslar bo'yicha yo'qlama (${presentCount}/${students.length} keldi)</p>
        </div>
        <div class="flex gap-2">
          <select class="form-control" id="att-group-sel" style="width:150px;">
            ${groups.map((g) => `<option value="${UI.esc(g)}" ${activeGroup === g ? "selected" : ""}>${UI.esc(g)}</option>`).join("")}
          </select>
          <button class="btn btn-primary" id="mark-all-present">${Icons.check("icon-sm")} Hammasini Keldi belgilash</button>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr><th>O'quvchi</th><th>Umumiy davomat</th><th>Bugungi holat</th><th>Tezkor almashtirish</th></tr>
            </thead>
            <tbody>
              ${students
                .map((s) => {
                  const st = db.attendanceToday[s.id] || "Keldi";
                  const cls = st === "Keldi" ? "att-present" : st === "Kelmadi" ? "att-absent" : "att-excused";
                  return `
                  <tr>
                    <td class="font-semibold">${UI.esc(s.fullName)}</td>
                    <td><span class="badge ${s.attendanceRate >= 90 ? "badge-success" : "badge-warning"}">${s.attendanceRate}%</span></td>
                    <td><span class="att-pill ${cls}">${UI.esc(st)}</span></td>
                    <td>
                      <div class="flex gap-1">
                        <button class="btn btn-xs btn-secondary" data-set-att="${s.id}" data-val="Keldi">Keldi</button>
                        <button class="btn btn-xs btn-secondary" data-set-att="${s.id}" data-val="Kelmadi">Kelmadi</button>
                        <button class="btn btn-xs btn-secondary" data-set-att="${s.id}" data-val="Sababli">Sababli</button>
                      </div>
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

    document.getElementById("att-group-sel").onchange = (e) => {
      activeGroup = e.target.value;
      ctx.rerender();
    };
    document.getElementById("mark-all-present").onclick = () => {
      students.forEach((s) => Store.toggleAttendance(s.id, "Keldi"));
      UI.toast(`${activeGroup} guruhining barcha o'quvchilari Keldi deb belgilandi`, "success");
      ctx.rerender();
    };
    document.querySelectorAll("[data-set-att]").forEach((b) => {
      b.onclick = () => {
        Store.toggleAttendance(b.dataset.setAtt, b.dataset.val);
        ctx.rerender();
      };
    });
  }

  function renderTasks(user, college, groups, ctx) {
    const db = Store.getState();
    const list = db.tasks.filter((t) => t.collegeId === college.id && (t.teacherId === user.id || groups.includes(t.groupCode)));

    ctx.container.innerHTML = `
      <div class="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h2 class="text-xl font-bold" style="margin:0;">Uyga vazifalar va topshiriqlar</h2>
          <p class="text-sm text-muted" style="margin:2px 0 0;">O'quvchilar topshirgan ishlarni ko'ring va nazorat qiling</p>
        </div>
      </div>

      <div class="grid-2">
        ${list
          .map(
            (t) => `
          <div class="card">
            <div class="flex items-center justify-between mb-2">
              <span class="badge badge-primary">${UI.esc(t.groupCode)} • ${UI.esc(t.subject)}</span>
              <span class="text-xs text-muted">Muddat: ${UI.esc(t.deadline)}</span>
            </div>
            <h3 class="card-title mb-1">${UI.esc(t.title)}</h3>
            <p class="text-sm text-secondary mb-3">${UI.esc(t.description)}</p>
            <div class="p-3" style="background:var(--bg-surface-2);border-radius:10px;padding:10px 12px;">
              <div class="text-xs font-bold mb-2">Topshirgan o'quvchilar (${t.submissions.length})</div>
              ${
                t.submissions.length
                  ? t.submissions
                      .map(
                        (sub) => `
                    <div class="text-xs mb-1">
                      <strong>${UI.esc(sub.studentName)}</strong> (${UI.esc(sub.submittedAt)}): ${UI.esc(sub.answer)}
                    </div>
                  `
                      )
                      .join("")
                  : `<div class="text-xs text-muted">Hali hech kim topshirmagan</div>`
              }
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }

  function renderMessages(user, college, groups, ctx) {
    const db = Store.getState();
    const msgs = db.messages.filter((m) => m.collegeId === college.id && m.toGroup === activeGroup);

    ctx.container.innerHTML = `
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-xl font-bold" style="margin:0;">Guruh bilan muloqot</h2>
          <p class="text-sm text-muted" style="margin:2px 0 0;">O'quvchilarga tezkor xabar va topshiriq eslatmalari yuboring</p>
        </div>
        <select class="form-control" id="msg-grp-sel" style="width:150px;">
          ${groups.map((g) => `<option value="${UI.esc(g)}" ${activeGroup === g ? "selected" : ""}>${UI.esc(g)}</option>`).join("")}
        </select>
      </div>

      <div class="card">
        <div style="display:flex;flex-direction:column;gap:10px;max-height:360px;overflow-y:auto;margin-bottom:16px;">
          ${
            msgs.length
              ? msgs
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
                  .join("")
              : `<div class="text-sm text-muted">Bu guruhda hali xabarlar yo'q.</div>`
          }
        </div>
        <form id="tch-msg-form" class="flex gap-2">
          <input class="form-control" id="tch-msg-input" placeholder="${UI.esc(activeGroup)} guruhiga xabar yozing..." required />
          <button class="btn btn-primary">Yuborish</button>
        </form>
      </div>
    `;

    document.getElementById("msg-grp-sel").onchange = (e) => {
      activeGroup = e.target.value;
      ctx.rerender();
    };
    document.getElementById("tch-msg-form").onsubmit = (e) => {
      e.preventDefault();
      const inp = document.getElementById("tch-msg-input");
      if (!inp.value.trim()) return;
      Store.addMessage(college.id, user.id, activeGroup, user.fullName, inp.value);
      ctx.rerender();
    };
  }

  function renderAnnouncements(user, college, ctx) {
    const db = Store.getState();
    const list = db.announcements.filter((a) => a.collegeId === college.id);

    ctx.container.innerHTML = `
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold" style="margin:0;">E'lonlar</h2>
        <button class="btn btn-primary" id="tch-new-ann">${Icons.plus("icon-sm")} Guruhga e'lon berish</button>
      </div>
      <div class="grid-2">
        ${list
          .map(
            (a) => `
          <div class="card">
            <div class="flex items-center justify-between mb-2">
              <span class="badge badge-primary">${UI.esc(a.audience)}</span>
              <span class="text-xs text-muted">${UI.esc(a.date)}</span>
            </div>
            <h3 class="card-title mb-1">${UI.esc(a.title)}</h3>
            <p class="text-sm text-secondary">${UI.esc(a.body)}</p>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    document.getElementById("tch-new-ann").onclick = () => {
      UI.openModal({
        title: "O'quvchilar uchun e'lon",
        bodyHtml: `
          <form id="ta-form">
            <div class="form-group">
              <label class="form-label">Sarlavha</label>
              <input class="form-control" id="ta-title" required />
            </div>
            <div class="form-group">
              <label class="form-label">Matn</label>
              <textarea class="form-control" id="ta-body" required></textarea>
            </div>
            <button class="btn btn-primary btn-block">Yuborish</button>
          </form>
        `,
        onMount(close) {
          document.getElementById("ta-form").onsubmit = (e) => {
            e.preventDefault();
            Store.addAnnouncement(college.id, {
              audience: "O'quvchilar",
              authorRole: user.fullName,
              title: document.getElementById("ta-title").value,
              body: document.getElementById("ta-body").value,
              tag: activeSubject,
            });
            UI.toast("E'lon joylandi!", "success");
            close();
            ctx.rerender();
          };
        },
      });
    };
  }
})();
