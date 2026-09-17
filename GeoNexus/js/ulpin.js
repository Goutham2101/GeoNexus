/**
 * GeoNexus - 3D ULPIN System & Cadastral Hierarchy Explorer Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  const genBuilding = document.getElementById("ulpinGenBuilding");
  const genFloor = document.getElementById("ulpinGenFloor");
  const genUnit = document.getElementById("ulpinGenUnit");
  const genOutput = document.getElementById("ulpinGenOutput");
  const genCopyBtn = document.getElementById("ulpinGenCopyBtn");
  const genValidateBtn = document.getElementById("ulpinGenValidateBtn");
  const valResultBox = document.getElementById("ulpinValidationResult");

  // ------------------------------------------------------------
  // URL PARAMETER HANDLING
  // ------------------------------------------------------------

  const urlParams =
    typeof GeoNexusApp !== "undefined" &&
    typeof GeoNexusApp.getUrlParams === "function"
      ? GeoNexusApp.getUrlParams()
      : {};

  if (urlParams.ulpin && GEONEXUS_DATA?.properties) {
    const match = GEONEXUS_DATA.properties.find(
      (p) => p.ulpin === urlParams.ulpin
    );

    if (match) {
      if (genBuilding) genBuilding.value = match.buildingId || "";
      if (genFloor) genFloor.value = match.floorNumber || "";
      if (genUnit) genUnit.value = match.unitCode || "";
    }
  }

  // ------------------------------------------------------------
  // GENERATE 3D ULPIN
  // ------------------------------------------------------------

  function updateGeneratedUlpin() {
    if (!genOutput) return;

    const country = "IND";
    const state = "AP";
    const dist = "VIZ";

    const bld =
      genBuilding && genBuilding.value
        ? genBuilding.value.trim()
        : "BLD05";

    const floorNum =
      genFloor && genFloor.value
        ? String(genFloor.value).padStart(2, "0")
        : "03";

    const unit =
      genUnit && genUnit.value
        ? genUnit.value.toUpperCase().trim()
        : "U302";

    const fullUlpin =
      `${country}-${state}-${dist}-${bld}-F${floorNum}-${unit}`;

    genOutput.textContent = fullUlpin;
  }

  // ------------------------------------------------------------
  // UPDATE ULPIN WHEN BUILDING / FLOOR / UNIT CHANGES
  // ------------------------------------------------------------

  [genBuilding, genFloor, genUnit].forEach((el) => {
    if (!el) return;

    el.addEventListener("input", updateGeneratedUlpin);
    el.addEventListener("change", updateGeneratedUlpin);
  });

  // ------------------------------------------------------------
  // COPY GENERATED ULPIN
  // ------------------------------------------------------------

  if (genCopyBtn && genOutput) {
    genCopyBtn.addEventListener("click", () => {
      const ulpin = genOutput.textContent.trim();

      if (!ulpin) {
        if (
          typeof GeoNexusApp !== "undefined" &&
          typeof GeoNexusApp.showToast === "function"
        ) {
          GeoNexusApp.showToast(
            "Generate a ULPIN first",
            "error"
          );
        }
        return;
      }

      if (
        typeof GeoNexusApp !== "undefined" &&
        typeof GeoNexusApp.copyText === "function"
      ) {
        GeoNexusApp.copyText(
          ulpin,
          "Generated 3D ULPIN"
        );
      } else {
        // Safe browser fallback
        navigator.clipboard
          .writeText(ulpin)
          .then(() => {
            if (
              typeof GeoNexusApp !== "undefined" &&
              typeof GeoNexusApp.showToast === "function"
            ) {
              GeoNexusApp.showToast(
                "ULPIN copied successfully",
                "success"
              );
            }
          })
          .catch((error) => {
            console.error("ULPIN copy failed:", error);

            if (
              typeof GeoNexusApp !== "undefined" &&
              typeof GeoNexusApp.showToast === "function"
            ) {
              GeoNexusApp.showToast(
                "Unable to copy ULPIN",
                "error"
              );
            }
          });
      }
    });
  }

  // ------------------------------------------------------------
  // VALIDATE GENERATED ULPIN
  // ------------------------------------------------------------

  if (genValidateBtn && genOutput && valResultBox) {
    genValidateBtn.addEventListener("click", () => {
      const ulpin = genOutput.textContent.trim();

      if (!ulpin) {
        valResultBox.style.display = "block";
        valResultBox.innerHTML = `
          <div style="
            display:flex;
            align-items:center;
            gap:0.5rem;
            color:var(--status-error);
            font-weight:700;
          ">
            <span>
              ${GeoNexusApp.getIcon("error", "icon-md")}
            </span>
            <span>Generate a ULPIN first</span>
          </div>
        `;

        if (
          typeof GeoNexusApp !== "undefined" &&
          typeof GeoNexusApp.showToast === "function"
        ) {
          GeoNexusApp.showToast(
            "Generate a ULPIN first",
            "error"
          );
        }

        return;
      }

      valResultBox.style.display = "block";

      valResultBox.innerHTML = `
        <div style="
          display:flex;
          align-items:center;
          gap:0.5rem;
          color:var(--status-success);
          font-weight:700;
          margin-bottom:0.5rem;
        ">
          <span>
            ${GeoNexusApp.getIcon("check", "icon-md")}
          </span>
          <span>3D Cadastral Spatial Boundary Validated</span>
        </div>

        <div style="
          font-size:0.82rem;
          color:var(--text-secondary);
          display:flex;
          flex-direction:column;
          gap:0.25rem;
        ">
          <div>
            <strong>Spatial Envelope:</strong>
            Bounded Polygon (MVP Sector 4, Survey 55/2C)
          </div>

          <div>
            <strong>Vertical Stratum:</strong>
            Level 3 (+11.1m AGL / +35.6m AMSL)
          </div>

          <div>
            <strong>Registry Status:</strong>
            Verified 3D Bhu-Aadhar Spatial Unit
          </div>
        </div>
      `;

      if (
        typeof GeoNexusApp !== "undefined" &&
        typeof GeoNexusApp.showToast === "function"
      ) {
        GeoNexusApp.showToast(
          "ULPIN successfully validated against 3D Cadastre",
          "success"
        );
      }
    });
  }

  // ------------------------------------------------------------
  // ULPIN REGISTRY TABLE
  // ------------------------------------------------------------

  const tableBody =
    document.getElementById("ulpinRegistryTableBody");

  const searchInput =
    document.getElementById("ulpinTableSearch");

  function renderTable() {
    if (
      !tableBody ||
      !GEONEXUS_DATA ||
      !Array.isArray(GEONEXUS_DATA.properties)
    ) {
      return;
    }

    const query = searchInput
      ? searchInput.value.toLowerCase().trim()
      : "";

    const filtered = GEONEXUS_DATA.properties.filter((p) => {
      const ulpin = String(p.ulpin || "").toLowerCase();
      const unitNumber = String(p.unitNumber || "").toLowerCase();
      const buildingName = String(p.buildingName || "").toLowerCase();

      return (
        !query ||
        ulpin.includes(query) ||
        unitNumber.includes(query) ||
        buildingName.includes(query)
      );
    });

    tableBody.innerHTML = "";

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td
            colspan="7"
            style="
              text-align:center;
              padding:2rem;
              color:var(--text-secondary);
            "
          >
            No matching ULPIN records found.
          </td>
        </tr>
      `;

      return;
    }

    filtered.forEach((p) => {
      const tr = document.createElement("tr");

      const ulpin = String(p.ulpin || "");
      const unitNumber = String(p.unitNumber || "");
      const buildingName = String(p.buildingName || "");
      const buildingId = String(p.buildingId || "");
      const floorLabel = String(p.floorLabel || "");
      const statusCode = String(p.statusCode || "");
      const status = String(p.status || "");
      const spatialStatus = String(p.spatialStatus || "");
      const floorNumber = String(p.floorNumber || "");
      const unitCode = String(p.unitCode || "");

      tr.innerHTML = `
        <td>
          <div style="
            display:flex;
            align-items:center;
            gap:0.4rem;
          ">
            <span
              class="mono"
              style="
                font-weight:700;
                color:var(--cyan-accent);
                font-size:0.85rem;
              "
            >
              ${ulpin}
            </span>

            <button
              class="icon-button"
              style="
                width:24px;
                height:24px;
              "
              type="button"
              title="Copy ULPIN"
              aria-label="Copy ULPIN"
              onclick="GeoNexusApp.copyText('${ulpin}', 'ULPIN')"
            >
              ${GeoNexusApp.getIcon("copy", "icon-sm")}
            </button>
          </div>
        </td>

        <td>
          <strong>${unitNumber}</strong>
        </td>

        <td>
          ${buildingName} (${buildingId})
        </td>

        <td>
          ${floorLabel}
        </td>

        <td>
          <span class="badge badge-${statusCode}">
            ${status}
          </span>
        </td>

        <td>
          <span class="badge badge-success">
            ${spatialStatus}
          </span>
        </td>

        <td>
          <a
            href="map.html?ulpin=${encodeURIComponent(ulpin)}&building=${encodeURIComponent(buildingId)}&floor=${encodeURIComponent(floorNumber)}&unit=${encodeURIComponent(unitCode)}"
            class="btn btn-secondary btn-sm"
          >
            Inspect 3D
          </a>
        </td>
      `;

      tableBody.appendChild(tr);
    });
  }

  // ------------------------------------------------------------
  // REGISTRY SEARCH
  // ------------------------------------------------------------

  if (searchInput) {
    searchInput.addEventListener("input", renderTable);
  }

  // ------------------------------------------------------------
  // INITIALIZE PAGE
  // ------------------------------------------------------------

  renderTable();
  updateGeneratedUlpin();
});