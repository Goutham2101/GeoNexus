/**
 * GeoNexus - Dashboard Page Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Miniature 3D Twin Viewport
  let dashboard3D = null;
  if (document.getElementById("dashboardTwinCanvas")) {
    dashboard3D = new GeoNexus3DEngine("dashboardTwinCanvas", {
      mode: "mini",
      selectedBuildingId: "BLD05",
      onSelectUnit: (property) => {
        updateDossier(property);
      },
      onSelectBuilding: (building) => {
        GeoNexusApp.showToast(`Selected ${building.name} (${building.id})`, "info");
      }
    });
  }

  // 2. Explode / Reset building toggle
  const explodeBtn = document.getElementById("dashExplodeBtn");
  let isExploded = false;
  if (explodeBtn && dashboard3D) {
    explodeBtn.addEventListener("click", () => {
      isExploded = !isExploded;
      dashboard3D.explodeFloors(isExploded ? 0.75 : 0);
      explodeBtn.textContent = isExploded ? "Reset Building" : "Explode Floors";
      explodeBtn.classList.toggle("active", isExploded);
      GeoNexusApp.showToast(isExploded ? "Exploded building vertical floors" : "Reset building floors to ground level", "info");
    });
  }

  // 3. Update Quick Property Dossier
  function updateDossier(property) {
    const p = property || GEONEXUS_DATA.properties[0];
    const unitTitle = document.getElementById("dossierUnitTitle");
    const bldName = document.getElementById("dossierBuildingName");
    const ulpinBadge = document.getElementById("dossierUlpin");
    const statusBadge = document.getElementById("dossierStatus");
    const areaVal = document.getElementById("dossierArea");
    const configVal = document.getElementById("dossierConfig");
    const floorVal = document.getElementById("dossierFloor");
    const priceVal = document.getElementById("dossierPrice");
    const contactBtn = document.getElementById("dossierContactBtn");
    const inspectBtn = document.getElementById("dossierInspectBtn");

    if (unitTitle) unitTitle.textContent = p.unitNumber;
    if (bldName) bldName.textContent = p.buildingName;
    if (ulpinBadge) ulpinBadge.textContent = p.ulpin;
    if (statusBadge) {
      statusBadge.textContent = p.status;
      statusBadge.className = `badge badge-${p.statusCode}`;
    }
    if (areaVal) areaVal.textContent = `${p.areaSqFt} sq.ft`;
    if (configVal) configVal.textContent = p.configuration;
    if (floorVal) floorVal.textContent = p.floorLabel;
    if (priceVal) priceVal.textContent = p.price;

    if (contactBtn) {
      contactBtn.setAttribute("data-contact-owner", p.ulpin);
      contactBtn.style.display = (p.statusCode === "occupied" || p.statusCode === "sold") ? "none" : "inline-flex";
    }

    if (inspectBtn) {
      inspectBtn.onclick = () => {
        window.location.href = `map.html?ulpin=${encodeURIComponent(p.ulpin)}&building=${p.buildingId}&floor=${p.floorNumber}&unit=${p.unitCode}`;
      };
    }
  }

  // Initial load with flagship property
  updateDossier(GEONEXUS_DATA.properties[0]);
});
