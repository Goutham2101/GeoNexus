/**
 * GeoNexus - Subsurface Underground GIS & Conflict Resolution Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Subsurface 3D Viewport
  let infra3DEngine = null;
  if (document.getElementById("subsurfaceCanvas")) {
    infra3DEngine = new GeoNexus3DEngine("subsurfaceCanvas", {
      mode: "underground",
      selectedBuildingId: "BLD05"
    });
    setTimeout(() => infra3DEngine.setUndergroundMode(true), 300);
  }

  // Depth Level Switcher
  document.querySelectorAll(".depth-level-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".depth-level-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      const depth = pill.getAttribute("data-depth");
      GeoNexusApp.showToast(`Focused Subsurface Depth: ${depth}`, "info");
    });
  });

  // Filter Conflicts
  const conflictList = document.getElementById("conflictsListContainer");
  const severityFilter = document.getElementById("conflictFilterSeverity");

  function renderConflicts() {
    if (!conflictList || !GEONEXUS_DATA.conflicts) return;
    const filter = severityFilter ? severityFilter.value : "all";

    const filtered = GEONEXUS_DATA.conflicts.filter(c => {
      return filter === "all" || c.severity.toLowerCase() === filter.toLowerCase();
    });

    conflictList.innerHTML = "";
    filtered.forEach(c => {
      const card = document.createElement("div");
      card.className = "card conflict-card";
      card.style.marginBottom = "1rem";
      card.innerHTML = `
        <div class="card-header">
          <div>
            <div class="card-title" style="color:var(--status-danger); display:flex; align-items:center; gap:0.5rem;">
              <span>${GeoNexusApp.getIcon('warning', 'icon-sm')}</span> <span>${c.code} • ${c.title}</span>
            </div>
            <div class="card-subtitle">${c.type}</div>
          </div>
          <span class="badge badge-danger">${c.severity} SEVERITY</span>
        </div>

        <p style="font-size:0.88rem; color:var(--text-secondary); margin-bottom:0.75rem;">${c.description}</p>

        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.5rem; background:var(--bg-secondary); padding:0.65rem; border-radius:var(--radius-md); font-size:0.8rem; margin-bottom:0.75rem;">
          <div><span style="color:var(--text-muted); font-size:0.7rem; display:block;">MEASURED CLEARANCE</span><strong style="color:var(--status-danger);">${c.distanceMeters}m</strong></div>
          <div><span style="color:var(--text-muted); font-size:0.7rem; display:block;">MANDATED BUFFER</span><strong>${c.mandatedBufferMeters}m</strong></div>
          <div><span style="color:var(--text-muted); font-size:0.7rem; display:block;">STATUS</span><strong>${c.status}</strong></div>
        </div>

        <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:var(--radius-sm); padding:0.55rem 0.75rem; font-size:0.78rem; color:#1e40af; margin-bottom:0.85rem;">
          <strong>Recommended Spatial Action:</strong> ${c.recommendedAction}
        </div>

        <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
          <button class="btn btn-secondary btn-sm" onclick="GeoNexusApp.showToast('Spatial relationship model loaded for ${c.code}', 'info')">Review Spatial Clearance</button>
          <button class="btn btn-primary btn-sm" onclick="GeoNexusApp.showToast('Resolution workflow triggered for ${c.code}', 'success')">Resolve Conflict</button>
        </div>
      `;
      conflictList.appendChild(card);
    });
  }

  if (severityFilter) severityFilter.addEventListener("change", renderConflicts);
  renderConflicts();
});
