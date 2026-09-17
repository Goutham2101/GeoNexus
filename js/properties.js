/**
 * GeoNexus - Property Registry & Catalog Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  const propertyGrid = document.getElementById("propertiesGrid");
  const propertyTableBody = document.getElementById("propertiesTableBody");
  const searchInput = document.getElementById("propertyFilterSearch");
  const statusFilter = document.getElementById("propertyFilterStatus");
  const buildingFilter = document.getElementById("propertyFilterBuilding");
  const bhkFilter = document.getElementById("propertyFilterBHK");
  const viewModeGridBtn = document.getElementById("viewModeGrid");
  const viewModeTableBtn = document.getElementById("viewModeTable");
  const resultsCountEl = document.getElementById("propertyResultsCount");
  const urlParams = GeoNexusApp.getUrlParams();

  if (searchInput && urlParams.search) searchInput.value = urlParams.search;
  if (statusFilter && urlParams.status) statusFilter.value = urlParams.status;

  let currentViewMode = "grid";

  function renderProperties() {
    if (!GEONEXUS_DATA.properties) return;

    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const status = statusFilter ? statusFilter.value : "all";
    const building = buildingFilter ? buildingFilter.value : "all";
    const bhk = bhkFilter ? bhkFilter.value : "all";

    const filtered = GEONEXUS_DATA.properties.filter(p => {
      const matchQuery = !query || 
        p.ulpin.toLowerCase().includes(query) ||
        p.unitNumber.toLowerCase().includes(query) ||
        p.buildingName.toLowerCase().includes(query);

      const matchStatus = status === "all" || p.statusCode === status;
      const matchBuilding = building === "all" || p.buildingId === building;
      const matchBHK = bhk === "all" || p.configuration.includes(bhk);

      return matchQuery && matchStatus && matchBuilding && matchBHK;
    });

    if (resultsCountEl) {
      resultsCountEl.textContent = `Showing ${filtered.length} property units`;
    }

    // Render Grid View
    if (propertyGrid) {
      propertyGrid.innerHTML = "";
      if (filtered.length === 0) {
        propertyGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">No property units match the selected filters.</div>`;
      } else {
        filtered.forEach(p => {
          const card = document.createElement("div");
          card.className = "card property-card";
          card.innerHTML = `
            <div class="card-header">
              <div>
                <div class="card-title">${p.unitNumber}</div>
                <div class="card-subtitle">${p.buildingName} • ${p.floorLabel}</div>
              </div>
              <span class="badge badge-${p.statusCode}">${p.status}</span>
            </div>

            <div class="ulpin-tag-box" style="margin-bottom: 1rem; width: 100%; justify-content: space-between;">
              <span style="font-size: 0.8rem;">${p.ulpin}</span>
              <button class="copy-btn" onclick="GeoNexusApp.copyText('${p.ulpin}', 'ULPIN')" title="Copy 3D ULPIN">${GeoNexusApp.getIcon('copy', 'icon-sm')}</button>
            </div>

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; background: var(--bg-secondary); padding: 0.65rem; border-radius: var(--radius-md); margin-bottom: 1rem; font-size: 0.8rem;">
              <div><span style="color:var(--text-muted); font-size:0.7rem; display:block;">AREA</span><strong>${p.areaSqFt} sq.ft</strong></div>
              <div><span style="color:var(--text-muted); font-size:0.7rem; display:block;">CONFIG</span><strong>${p.configuration.split(" ")[0]} BHK</strong></div>
              <div><span style="color:var(--text-muted); font-size:0.7rem; display:block;">ELEVATION</span><strong>${p.relativeElevation.split(" ")[0]}</strong></div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-light); padding-top: 0.85rem; margin-top: auto;">
              <div style="font-family: var(--font-heading); font-size: 1.3rem; font-weight: 800; color: var(--blue-primary);">${p.price}</div>
              <div style="display: flex; gap: 0.4rem;">
                <a href="map.html?ulpin=${encodeURIComponent(p.ulpin)}&building=${p.buildingId}&floor=${p.floorNumber}&unit=${p.unitCode}" class="btn btn-secondary btn-sm" title="View in 3D Map">${GeoNexusApp.getIcon('map', 'icon-sm icon-inline')} 3D View</a>
                ${(p.statusCode === "available_sale" || p.statusCode === "available_rent") ? `<button class="btn btn-primary btn-sm" data-contact-owner="${p.ulpin}">Contact</button>` : ''}
              </div>
            </div>
          `;
          propertyGrid.appendChild(card);
        });
      }
    }

    // Render Table View
    if (propertyTableBody) {
      propertyTableBody.innerHTML = "";
      filtered.forEach(p => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><strong>${p.unitNumber}</strong></td>
          <td><span class="mono" style="font-size:0.8rem; color:var(--cyan-accent);">${p.ulpin}</span></td>
          <td>${p.buildingName}</td>
          <td>${p.floorLabel}</td>
          <td>${p.areaSqFt} sq.ft</td>
          <td><span class="badge badge-${p.statusCode}">${p.status}</span></td>
          <td style="font-weight:700;">${p.price}</td>
          <td>
            <a href="map.html?ulpin=${encodeURIComponent(p.ulpin)}&building=${p.buildingId}&floor=${p.floorNumber}&unit=${p.unitCode}" class="btn btn-secondary btn-sm">3D View</a>
          </td>
        `;
        propertyTableBody.appendChild(tr);
      });
    }
  }

  // Filter Listeners
  [searchInput, statusFilter, buildingFilter, bhkFilter].forEach(el => {
    if (el) el.addEventListener("input", renderProperties);
  });

  // View Switchers
  if (viewModeGridBtn && viewModeTableBtn) {
    viewModeGridBtn.addEventListener("click", () => {
      viewModeGridBtn.classList.add("active");
      viewModeTableBtn.classList.remove("active");
      if (propertyGrid) propertyGrid.style.display = "grid";
      const tableCard = document.getElementById("propertiesTableCard");
      if (tableCard) tableCard.style.display = "none";
    });

    viewModeTableBtn.addEventListener("click", () => {
      viewModeTableBtn.classList.add("active");
      viewModeGridBtn.classList.remove("active");
      if (propertyGrid) propertyGrid.style.display = "none";
      const tableCard = document.getElementById("propertiesTableCard");
      if (tableCard) tableCard.style.display = "block";
    });
  }

  renderProperties();
});
