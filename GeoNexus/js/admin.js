/**
 * GeoNexus - Cadastral Administration Portal Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Dynamic Auto-ULPIN Generator in Admin Unit Form
  const adminBldSelect = document.getElementById("adminUnitBuilding");
  const adminFloorInput = document.getElementById("adminUnitFloor");
  const adminUnitInput = document.getElementById("adminUnitNumber");
  const adminUlpinPreview = document.getElementById("adminUlpinPreview");

  function updateAdminUlpin() {
    if (!adminUlpinPreview) return;
    const bld = adminBldSelect ? adminBldSelect.value : "BLD05";
    const floor = adminFloorInput ? String(adminFloorInput.value).padStart(2, "0") : "01";
    const unit = adminUnitInput ? adminUnitInput.value.toUpperCase().trim() : "U101";
    adminUlpinPreview.value = `IND-AP-VIZ-${bld}-F${floor}-${unit}`;
  }

  [adminBldSelect, adminFloorInput, adminUnitInput].forEach(el => {
    if (el) el.addEventListener("input", updateAdminUlpin);
  });
  updateAdminUlpin();

  // 2. Add Property Form Submission
  const addUnitForm = document.getElementById("adminAddUnitForm");
  if (addUnitForm) {
    addUnitForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const bldId = adminBldSelect ? adminBldSelect.value : "BLD05";
      const bldObj = (window.GEONEXUS_DATA && window.GEONEXUS_DATA.buildings) 
        ? window.GEONEXUS_DATA.buildings.find(b => b.id === bldId) 
        : null;
      const bldName = bldObj ? bldObj.name : "Geo Heights";
      const floorNum = parseInt(adminFloorInput ? adminFloorInput.value : "3", 10);
      const unitNum = adminUnitInput ? adminUnitInput.value.toUpperCase().trim() : "U305";
      const ulpin = adminUlpinPreview ? adminUlpinPreview.value : `IND-AP-VIZ-${bldId}-F${String(floorNum).padStart(2, "0")}-${unitNum}`;
      const area = parseInt(document.getElementById("adminUnitArea")?.value || "1200", 10);
      const price = document.getElementById("adminUnitPrice")?.value || "₹68,00,000";
      const statusVal = document.getElementById("adminUnitStatus")?.value || "available_sale";

      let statusBadge = "Available for Sale";
      let isAvailable = true;
      if (statusVal === "available_rent") {
        statusBadge = "Available for Rent";
      } else if (statusVal === "occupied") {
        statusBadge = "Occupied";
        isAvailable = false;
      } else if (statusVal === "under_construction") {
        statusBadge = "Under Construction";
        isAvailable = false;
      }

      const newProp = {
        id: `PROP-${Date.now().toString().slice(-4)}`,
        ulpin: ulpin,
        buildingId: bldId,
        buildingName: bldName,
        floor: floorNum,
        floorLabel: `Floor ${floorNum}`,
        unitNumber: unitNum,
        propertyType: "Residential Unit",
        areaSqFt: area,
        priceFormatted: price,
        status: statusBadge,
        isAvailable: isAvailable,
        dataStatus: "Verified Cadastral Unit"
      };

      if (window.GEONEXUS_DATA && window.GEONEXUS_DATA.properties) {
        window.GEONEXUS_DATA.properties.unshift(newProp);
        if (window.GEONEXUS_DATA.metrics) {
          window.GEONEXUS_DATA.metrics.registeredPropertyUnits += 1;
          if (isAvailable) window.GEONEXUS_DATA.metrics.availableFlats += 1;
        }
      }

      GeoNexusApp.showToast(`Property unit "${unitNum}" created with 3D ULPIN: ${ulpin}`, "success");
      addUnitForm.reset();
      updateAdminUlpin();
    });
  }

  // 3. Add Building Form Submission
  const addBuildingForm = document.getElementById("adminAddBuildingForm");
  if (addBuildingForm) {
    addBuildingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const bldName = document.getElementById("adminBldName")?.value || "Harbour Vista Tower";
      const bldId = document.getElementById("adminBldId")?.value || `BLD0${(window.GEONEXUS_DATA?.buildings?.length || 5) + 1}`;
      const surveyNo = document.getElementById("adminBldSurvey")?.value || "77/4B";
      const height = parseFloat(document.getElementById("adminBldHeight")?.value || "28.5");
      const floors = parseInt(document.getElementById("adminBldFloors")?.value || "8", 10);
      const area = parseInt(document.getElementById("adminBldArea")?.value || "950", 10);

      const newBld = {
        id: bldId,
        name: bldName,
        type: "Residential",
        parcelId: `P-${surveyNo.replace('/', '-')}`,
        surveyNo: surveyNo,
        floorsCount: floors,
        unitsCount: floors * 4,
        builtYear: new Date().getFullYear(),
        heightMeters: height,
        footprintSqMt: area,
        coordinates: { lat: 17.6930, lng: 83.2230 },
        threePos: { x: 30, z: 20 },
        address: "Harbour View Road, Visakhapatnam",
        status: "Verified",
        dataStatus: "Building Cadastre Data",
        floors: []
      };

      if (window.GEONEXUS_DATA && window.GEONEXUS_DATA.buildings) {
        window.GEONEXUS_DATA.buildings.push(newBld);
        if (window.GEONEXUS_DATA.metrics) {
          window.GEONEXUS_DATA.metrics.total3DBuildings += 1;
        }
        // Also update admin select dropdown option
        if (adminBldSelect) {
          const opt = document.createElement("option");
          opt.value = bldId;
          opt.textContent = `${bldName} (${bldId})`;
          adminBldSelect.appendChild(opt);
        }
      }

      GeoNexusApp.showToast(`Building "${bldName}" (${bldId}) registered in 3D Cadastre`, "success");
      addBuildingForm.reset();
    });
  }

  // 4. Upload GIS Data Simulation
  const uploadGisBtn = document.getElementById("adminUploadGisBtn");
  if (uploadGisBtn) {
    uploadGisBtn.addEventListener("click", () => {
      GeoNexusApp.showToast("Uploading Cadastral GeoJSON / Shapefile boundaries...", "info");
      setTimeout(() => {
        GeoNexusApp.showToast("Spatial dataset validated: 42 parcel polygons matched to 3D footprints", "success");
      }, 1000);
    });
  }

  // 5. Register 3DGS Asset Simulation
  const reg3DGSBtn = document.getElementById("adminRegister3DGSBtn");
  if (reg3DGSBtn) {
    reg3DGSBtn.addEventListener("click", () => {
      GeoNexusApp.showToast("Registering 3D Gaussian Splatting asset...", "info");
      setTimeout(() => {
        GeoNexusApp.showToast("3DGS Asset registered: GeoHeights_photogrammetry.splat", "success");
      }, 1000);
    });
  }
});
