/**
 * GeoNexus - Spatial Analytics & Cadastral Intelligence Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  if (typeof Chart === "undefined") return;

  // Chart defaults for crisp UI
  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.color = "#64748b";

  // 1. Property Availability Chart
  const ctxAvail = document.getElementById("chartPropertyAvailability");
  if (ctxAvail) {
    new Chart(ctxAvail, {
      type: "doughnut",
      data: {
        labels: ["Available for Sale", "Available for Rent", "Occupied", "Sold", "Under Construction"],
        datasets: [{
          data: [327, 142, 3120, 1120, 123],
          backgroundColor: ["#16a34a", "#d97706", "#64748b", "#94a3b8", "#9333ea"],
          borderWidth: 2,
          borderColor: "#ffffff"
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" }
        }
      }
    });
  }

  // 2. Building Height & Floor Distribution Chart
  const ctxHeights = document.getElementById("chartBuildingHeights");
  if (ctxHeights) {
    new Chart(ctxHeights, {
      type: "bar",
      data: {
        labels: ["1-3 Floors", "4-6 Floors", "7-9 Floors", "10-15 Floors", "16+ Floors"],
        datasets: [{
          label: "Number of Buildings",
          data: [42, 86, 38, 16, 4],
          backgroundColor: "#2563eb",
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  // 3. Infrastructure Distribution Chart
  const ctxInfra = document.getElementById("chartInfrastructure");
  if (ctxInfra) {
    new Chart(ctxInfra, {
      type: "bar",
      data: {
        labels: ["Water Main", "Sewer Line", "Power Conduit", "Gas Main", "Metro Corridor"],
        datasets: [{
          label: "Mapped Network (km)",
          data: [14.2, 18.5, 22.1, 11.4, 8.9],
          backgroundColor: ["#0284c7", "#a16207", "#eab308", "#ef4444", "#8b5cf6"],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  // 4. Spatial Conflicts Severity Breakdown
  const ctxConflicts = document.getElementById("chartConflictSeverity");
  if (ctxConflicts) {
    new Chart(ctxConflicts, {
      type: "pie",
      data: {
        labels: ["High Severity", "Medium Severity", "Low Severity", "Resolved"],
        datasets: [{
          data: [4, 8, 6, 12],
          backgroundColor: ["#ef4444", "#f59e0b", "#3b82f6", "#10b981"]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" }
        }
      }
    });
  }

  // Truthful Report Export Generator
  const exportBtn = document.getElementById("exportReportBtn");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const csvRows = [
        ["GeoNexus Spatial Summary Report"],
        ["Region", "Visakhapatnam (IND-AP-VIZ)"],
        ["Generated Date", new Date().toISOString().split("T")[0]],
        [],
        ["Metric", "Value"],
        ["Total Land Parcels", "1,248"],
        ["Total 3D Buildings", "186"],
        ["Registered Property Units", "4,832"],
        ["Available Flats", "327"],
        ["Underground Assets", "614"],
        ["Spatial Conflicts", "18"],
        ["LiDAR Coverage", "72%"],
        ["3DGS Coverage", "34%"]
      ];
      const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "geonexus_spatial_summary.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      GeoNexusApp.showToast("Spatial Summary Report downloaded (geonexus_spatial_summary.csv)", "success");
    });
  }
});
