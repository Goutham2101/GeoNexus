/**
 * GeoNexus - Reality View & LiDAR Point Cloud Lab Controller
 */

let twinEngine = null;
let realityEngine = null;
let lidarEngine = null;

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Dual Synchronized Viewports (Twin vs Reality)
  if (document.getElementById("compareTwinCanvas") && document.getElementById("compareRealityCanvas")) {
    const urlParams = GeoNexusApp.getUrlParams();
    const selectedBuildingId = urlParams.building || "BLD05";
    twinEngine = new GeoNexus3DEngine("compareTwinCanvas", {
      mode: "mini",
      selectedBuildingId
    });

    realityEngine = new GeoNexus3DEngine("compareRealityCanvas", {
      mode: "mini",
      selectedBuildingId
    });

    // Synchronize camera controls
    if (twinEngine.controls && realityEngine.controls) {
      let isSyncing = false;
      const syncCameras = (source, target) => {
        if (isSyncing) return;
        isSyncing = true;
        target.camera.position.copy(source.camera.position);
        target.camera.rotation.copy(source.camera.rotation);
        target.controls.target.copy(source.controls.target);
        target.controls.update();
        isSyncing = false;
      };
      twinEngine.controls.addEventListener("change", () => syncCameras(twinEngine, realityEngine));
      realityEngine.controls.addEventListener("change", () => syncCameras(realityEngine, twinEngine));
    }
  }

  // 2. Initialize Dedicated LiDAR Point Cloud Canvas
  if (document.getElementById("lidarLabCanvas")) {
    lidarEngine = new GeoNexus3DEngine("lidarLabCanvas", {
      mode: "lidar",
      selectedBuildingId: "BLD05"
    });
    setTimeout(() => {
      lidarEngine.setLayerVisible("lidar", true);
      lidarEngine.setLayerVisible("buildings", false);
    }, 300);
  }

  // 3. LiDAR Controls
  const pointSizeSlider = document.getElementById("lidarPointSize");
  if (pointSizeSlider && lidarEngine) {
    pointSizeSlider.addEventListener("input", (e) => {
      const ptObj = lidarEngine.groups.lidar.getObjectByName("lidarPointCloud");
      if (ptObj && ptObj.material) {
        ptObj.material.size = parseFloat(e.target.value);
      }
    });
  }

  // 4. Simulated LiDAR File Upload Pipeline (LAS / LAZ / PLY)
  const uploadBtn = document.getElementById("startLidarUploadBtn");
  const uploadProgressBox = document.getElementById("lidarUploadProgress");
  const progressBar = document.getElementById("lidarProgressBar");
  const progressLabel = document.getElementById("lidarProgressLabel");

  if (uploadBtn && uploadProgressBox) {
    uploadBtn.addEventListener("click", () => {
      uploadProgressBox.style.display = "block";
      uploadBtn.disabled = true;

      const steps = [
        { pct: 20, label: "Uploading LAS/LAZ Point Stream (42.8 MB)..." },
        { pct: 45, label: "Validating EPSG:4326 Projection & Header..." },
        { pct: 70, label: "Processing Octree Spatial Hierarchy Index..." },
        { pct: 90, label: "Converting to 3D Tiles Point Cloud Structure..." },
        { pct: 100, label: "Dataset Ready: 2,450,000 Points Rendered." }
      ];

      let stepIdx = 0;
      const interval = setInterval(() => {
        if (stepIdx < steps.length) {
          const s = steps[stepIdx];
          if (progressBar) progressBar.style.width = `${s.pct}%`;
          if (progressLabel) progressLabel.textContent = `${s.pct}% • ${s.label}`;
          stepIdx++;
        } else {
          clearInterval(interval);
          uploadBtn.disabled = false;
          GeoNexusApp.showToast("LiDAR point cloud visualization ready", "success");
        }
      }, 700);
    });
  }
});
