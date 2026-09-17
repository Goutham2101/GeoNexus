/**
 * GeoNexus - Flagship 3D GIS Map & Digital Twin Controller
 */

let map3DEngine = null;

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = GeoNexusApp.getUrlParams();
  const requestedProperty = GEONEXUS_DATA.properties.find(p => p.ulpin === urlParams.ulpin);
  const initBuilding = (requestedProperty && requestedProperty.buildingId) || urlParams.building || "BLD05";
  const initFloor = urlParams.floor !== undefined ? parseInt(urlParams.floor, 10) : ((requestedProperty && requestedProperty.floorNumber) || 3);
  const initUnit = (requestedProperty && requestedProperty.unitCode) || urlParams.unit || "U302";

  // 1. Initialize Full-Screen 3D GIS Engine
  map3DEngine = new GeoNexus3DEngine("mapWorkstationCanvas", {
    mode: "full",
    selectedBuildingId: initBuilding,
    onSelectUnit: (property) => {
      displayPropertyDetails(property);
    },
    onSelectBuilding: (building) => {
      displayBuildingDetails(building);
      updateFloorButtons(building);
      GeoNexusApp.showToast(`Selected Building: ${building.name} (${building.id})`, "info");
    },
    onSelectParcel: (parcel) => {
      displayParcelDetails(parcel);
      GeoNexusApp.showToast(`Cadastral Parcel: ${parcel.id} (Survey ${parcel.surveyNo})`, "cadastre");
    }
  });

  // 2. Bind Layer Toggles
  const layerCheckboxes = {
    layerParcels: "parcels",
    layerBuildings: "buildings",
    layerRoads: "roads",
    layerUnderground: "underground",
    layerConflicts: "conflicts",
    layerLidar: "lidar"
  };

  for (const checkboxId in layerCheckboxes) {
    const el = document.getElementById(checkboxId);
    if (el) {
      el.addEventListener("change", (e) => {
        const layerKey = layerCheckboxes[checkboxId];
        map3DEngine.setLayerVisible(layerKey, e.target.checked);
        GeoNexusApp.showToast(`Layer "${e.target.dataset.layerName || layerKey}" ${e.target.checked ? "Enabled" : "Disabled"}`, "info");
      });
    }
  }

  // 3. Bind Building Switcher
  const bldSelect = document.getElementById("buildingSelectorSelect");
  if (bldSelect) {
    bldSelect.value = map3DEngine.buildingMeshes[initBuilding] ? initBuilding : "BLD05";
    bldSelect.addEventListener("change", (e) => {
      map3DEngine.selectBuilding(e.target.value, true);
    });
  }

  // 4. Bind Floor Explosion Controls
  const explodeBtn = document.getElementById("mapExplodeBtn");
  const explodeSlider = document.getElementById("explosionSlider");
  const resetBtn = document.getElementById("mapResetBtn");

  if (explodeBtn) {
    explodeBtn.addEventListener("click", () => {
      const isExploded = (map3DEngine.explosionFactor > 0);
      const newFactor = isExploded ? 0 : 0.85;
      map3DEngine.explodeFloors(newFactor);
      if (explodeSlider) explodeSlider.value = newFactor * 100;
      explodeBtn.classList.toggle("active", !isExploded);
      GeoNexusApp.showToast(isExploded ? "Reset Building Floors" : "Exploded Building Floors Vertically", "info");
    });
  }

  if (explodeSlider) {
    explodeSlider.addEventListener("input", (e) => {
      const factor = parseFloat(e.target.value) / 100;
      map3DEngine.explodeFloors(factor);
      if (explodeBtn) explodeBtn.classList.toggle("active", factor > 0);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      map3DEngine.resetBuildingExplosion();
      if (explodeSlider) explodeSlider.value = 0;
      if (explodeBtn) explodeBtn.classList.remove("active");
      GeoNexusApp.showToast("Building Digital Twin Reset to Base", "info");
    });
  }

  // 5. Bind Surface / Vertical / Underground GIS Mode Pills
  document.querySelectorAll(".gis-mode-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".gis-mode-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      const mode = pill.getAttribute("data-mode");
      if (mode === "underground") {
        map3DEngine.setUndergroundMode(true);
        GeoNexusApp.showToast("Underground Subsurface GIS Mode Active (0m to -25m)", "info");
      } else if (mode === "surface") {
        map3DEngine.setUndergroundMode(false);
        GeoNexusApp.showToast("Surface Cadastral View Active", "info");
      } else if (mode === "vertical") {
        map3DEngine.explodeFloors(0.85);
        if (explodeSlider) explodeSlider.value = 85;
        GeoNexusApp.showToast("Vertical Stratified Cadastre Inspection Active", "info");
      }
    });
  });

  // 6. Floor Selector Buttons
  function updateFloorButtons(building) {
    const floorContainer = document.getElementById("floorButtonsContainer");
    if (!floorContainer) return;
    floorContainer.innerHTML = "";

    building.floors.forEach(f => {
      const btn = document.createElement("button");
      btn.className = "btn-floor";
      btn.textContent = f.floorNum === 0 ? "G" : f.floorNum;
      btn.title = f.label;
      btn.addEventListener("click", () => {
        document.querySelectorAll(".btn-floor").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        map3DEngine.selectFloor(f.floorNum);
        GeoNexusApp.showToast(`Selected ${f.label}`, "info");
      });
      floorContainer.appendChild(btn);
    });
  }

  // 7. Update Right Drawer Inspector with Property Data
  function displayPropertyDetails(property) {
    const p = property || GEONEXUS_DATA.properties[0];
    const drawer = document.getElementById("mapPropertyInspector");
    if (drawer) drawer.classList.remove("collapsed");

    const titleEl = document.getElementById("inspUnitTitle");
    const bldEl = document.getElementById("inspBuildingName");
    const ulpinEl = document.getElementById("inspUlpinVal");
    const statusEl = document.getElementById("inspStatusBadge");
    const areaEl = document.getElementById("inspArea");
    const configEl = document.getElementById("inspConfig");
    const floorEl = document.getElementById("inspFloor");
    const parkingEl = document.getElementById("inspParking");
    const priceEl = document.getElementById("inspPrice");
    const coordsEl = document.getElementById("inspCoords");
    const contactBtn = document.getElementById("inspContactBtn");
    const realityBtn = document.getElementById("inspRealityBtn");

    if (titleEl) titleEl.textContent = p.unitNumber;
    if (bldEl) bldEl.textContent = `${p.buildingName} (${p.buildingId})`;
    if (ulpinEl) ulpinEl.textContent = p.ulpin;
    if (statusEl) {
      statusEl.textContent = p.status;
      statusEl.className = `badge badge-${p.statusCode}`;
    }
    if (areaEl) areaEl.textContent = `${p.areaSqFt} sq.ft (${p.carpetAreaSqFt} carpet)`;
    if (configEl) configEl.textContent = p.configuration;
    if (floorEl) floorEl.textContent = p.floorLabel;
    if (parkingEl) parkingEl.textContent = p.parking;
    if (priceEl) priceEl.textContent = p.price;
    if (coordsEl) coordsEl.textContent = `${p.coordinates.lat.toFixed(6)}, ${p.coordinates.lng.toFixed(6)} | Elev: ${p.relativeElevation}`;

    if (contactBtn) {
      contactBtn.setAttribute("data-contact-owner", p.ulpin);
      contactBtn.style.display = (p.statusCode === "occupied" || p.statusCode === "sold") ? "none" : "inline-flex";
    }

    if (realityBtn) {
      realityBtn.onclick = () => {
        window.location.href = `reality-view.html?ulpin=${encodeURIComponent(p.ulpin)}&building=${p.buildingId}`;
      };
    }
  }

  function displayBuildingDetails(building) {
    const titleEl = document.getElementById("inspUnitTitle");
    const bldEl = document.getElementById("inspBuildingName");
    const ulpinEl = document.getElementById("inspUlpinVal");
    const statusEl = document.getElementById("inspStatusBadge");

    if (titleEl) titleEl.textContent = building.name;
    if (bldEl) bldEl.textContent = `Building ID: ${building.id} | Survey No: ${building.surveyNo}`;
    if (ulpinEl) ulpinEl.textContent = `IND-AP-VIZ-${building.id}`;
    if (statusEl) {
      statusEl.textContent = building.status;
      statusEl.className = "badge badge-cadastre";
    }
  }

  function displayParcelDetails(parcel) {
    const titleEl = document.getElementById("inspUnitTitle");
    const bldEl = document.getElementById("inspBuildingName");
    const ulpinEl = document.getElementById("inspUlpinVal");
    const statusEl = document.getElementById("inspStatusBadge");

    if (titleEl) titleEl.textContent = `Parcel ${parcel.id}`;
    if (bldEl) bldEl.textContent = `Survey No: ${parcel.surveyNo} | ${parcel.landUse}`;
    if (ulpinEl) ulpinEl.textContent = parcel.ulpin;
    if (statusEl) {
      statusEl.textContent = parcel.spatialStatus;
      statusEl.className = "badge badge-success";
    }
  }

  // Initial Auto-Focus Flagship Flat 302
  setTimeout(() => {
    const building = GEONEXUS_DATA.buildings.find(b => b.id === initBuilding) || GEONEXUS_DATA.buildings.find(b => b.id === "BLD05");
    const floor = building.floors.some(f => f.floorNum === initFloor) ? initFloor : 3;
    map3DEngine.selectBuilding(building.id, false);
    map3DEngine.selectFloor(floor);
    map3DEngine.selectUnit(initUnit, true);
    updateFloorButtons(building);

    const parcelLayer = document.getElementById("layerParcels");
    if (urlParams.layer === "parcels" && parcelLayer) {
      parcelLayer.checked = true;
      map3DEngine.setLayerVisible("parcels", true);
    }
  }, 350);
});
