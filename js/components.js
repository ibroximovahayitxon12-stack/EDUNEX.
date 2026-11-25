(function () {
  window.UI = {
    esc(str) {
      if (str === null || str === undefined) return "";
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    },
    initials(name) {
      if (!name) return "ED";
      const parts = name.trim().split(/\s+/);
      return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
    },
    toast(message, type = "primary") {
      const root = document.getElementById("toast-root");
      if (!root) return;
      const el = document.createElement("div");
      el.className = `toast ${type}`;
      el.innerHTML = `
        <span class="text-${type === "primary" ? "primary-color" : type}">${Icons.check("icon-svg")}</span>
        <div class="text-sm font-medium">${UI.esc(message)}</div>
      `;
      root.appendChild(el);
      setTimeout(() => {
        el.style.opacity = "0";
        el.style.transform = "translateY(8px)";
        el.style.transition = "all 0.2s";
        setTimeout(() => el.remove(), 220);
      }, 3200);
    },
    openModal({ title, bodyHtml, large = false, onMount }) {
      const root = document.getElementById("modal-root");
      if (!root) return;
      root.innerHTML = `
        <div class="modal-backdrop" id="modal-backdrop">
          <div class="modal-dialog ${large ? "modal-lg" : ""}" role="dialog" aria-modal="true">
            <div class="modal-head">
              <h3 class="modal-title">${UI.esc(title)}</h3>
              <button class="icon-btn" id="modal-close-btn" type="button">${Icons.close("icon-sm")}</button>
            </div>
            <div id="modal-body">${bodyHtml}</div>
          </div>
        </div>
      `;
      const close = () => {
        root.innerHTML = "";
      };
      document.getElementById("modal-close-btn").onclick = close;
      document.getElementById("modal-backdrop").onclick = (e) => {
        if (e.target.id === "modal-backdrop") close();
      };
      if (onMount) onMount(close);
    },
    closeModal() {
      const root = document.getElementById("modal-root");
      if (root) root.innerHTML = "";
    },
    gradeChip(score) {
      const n = Number(score);
      const cls = n >= 5 ? "grade-5" : n >= 4 ? "grade-4" : n >= 3 ? "grade-3" : "grade-2";
      return `<span class="grade-chip ${cls}">${UI.esc(score)}</span>`;
    },
    avgBadge(avg) {
      const n = Number(avg);
      const cls = n >= 4.5 ? "badge-success" : n >= 4.0 ? "badge-primary" : n >= 3.5 ? "badge-warning" : "badge-danger";
      return `<span class="badge ${cls}">${n.toFixed(1)}</span>`;
    },
    exportCSV(filename, rows) {
      const csv = rows
        .map((r) => r.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
        .join("\n");
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      UI.toast(`${filename} yuklab olindi`, "success");
    },
  };
})();
