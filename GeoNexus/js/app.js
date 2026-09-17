/**
 * GeoNexus - Global Application Controller & Shared Utilities
 */

const GeoNexusApp = {
  // SVG Icon Registry
  icons: {
    home: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    logo: `<svg class="icon icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
    dashboard: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    map: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`,
    properties: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M9 8h1"/><path d="M9 12h1"/><path d="M9 16h1"/><path d="M14 8h1"/><path d="M14 12h1"/><path d="M14 16h1"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg>`,
    ulpin: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    infrastructure: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="6" height="6" rx="1"/><rect x="16" y="2" width="6" height="6" rx="1"/><rect x="9" y="16" width="6" height="6" rx="1"/><path d="M5 8v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"/><path d="M12 13v3"/></svg>`,
    reality: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
    analytics: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
    admin: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    search: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    bell: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
    user: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    copy: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
    check: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    warning: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    danger: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    info: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    arrowRight: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
    external: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
    export: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
    refresh: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`,
    menu: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
    close: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    filter: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
    layers: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 17 22 12"/></svg>`,
    lidar: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/></svg>`,
    upload: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
    phone: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    mail: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    parcel: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    building: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v8"/><path d="M18 9h2a2 2 0 0 1 2 2v11"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>`,
    roadGrid: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 12h18"/><path d="M12 3v18"/></svg>`,
    boundary: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    pipeline: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16"/><path d="M12 4v16"/><circle cx="12" cy="12" r="4"/></svg>`,
    pointCloud: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="4" cy="4" r="1.5"/><circle cx="12" cy="4" r="1.5"/><circle cx="20" cy="4" r="1.5"/><circle cx="8" cy="10" r="1.5"/><circle cx="16" cy="10" r="1.5"/><circle cx="4" cy="16" r="1.5"/><circle cx="12" cy="16" r="1.5"/><circle cx="20" cy="16" r="1.5"/><circle cx="8" cy="21" r="1.5"/><circle cx="16" cy="21" r="1.5"/></svg>`,
    gaussianSplat: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="8" ry="4"/><ellipse cx="12" cy="12" rx="4" ry="8"/></svg>`,
    verticalLayers: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/><path d="M2 7l10 5 10-5"/><path d="M12 2L2 7l10 5 10-5z"/></svg>`,
    underground: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="6" height="6" rx="1"/><rect x="16" y="2" width="6" height="6" rx="1"/><rect x="9" y="16" width="6" height="6" rx="1"/><path d="M5 8v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"/><path d="M12 13v3"/></svg>`,
    floor: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="4" rx="1"/><rect x="4" y="10" width="16" height="4" rx="1"/><rect x="4" y="16" width="16" height="4" rx="1"/></svg>`,
    clipboard: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>`
  },

  getIcon(name, extraClass = "") {
    let svg = this.icons[name] || this.icons.info;
    if (extraClass) {
      svg = svg.replace('class="icon"', `class="icon ${extraClass}"`);
    }
    return svg;
  },

  init() {
    this.initNavigation();
    this.initGlobalSearch();
    this.initTooltips();
    this.initToasts();
    this.initModals();
    this.initContactOwnerHandlers();
  },

  // Highlight active link in navbar & setup mobile hamburger toggle
  initNavigation() {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-link").forEach(link => {
      const href = link.getAttribute("href");
      if (href === currentPath || (currentPath === "" && href === "index.html")) {
        link.classList.add("active");
      }
    });

    // Mobile Hamburger button controls navbar visibility
    const hamburgerBtn = document.querySelector(".hamburger-btn");
    const mainNav = document.querySelector(".main-nav");
    if (hamburgerBtn && mainNav) {
      hamburgerBtn.addEventListener("click", () => {
        mainNav.classList.toggle("mobile-open");
      });
      document.querySelectorAll(".main-nav .nav-link").forEach(a => {
        a.addEventListener("click", () => mainNav.classList.remove("mobile-open"));
      });
    }
  },

  // Global Search Engine (ULPIN, Flat, Building, Survey No)
  initGlobalSearch() {
    const searchInputs = document.querySelectorAll(".search-input, #globalSearchInput");
    const dropdown = document.querySelector(".search-results-dropdown");

    searchInputs.forEach(input => {
      input.addEventListener("input", (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (!query || !dropdown) {
          if (dropdown) dropdown.classList.remove("show");
          return;
        }

        const results = [];
        // Search Properties
        if (typeof GEONEXUS_DATA !== "undefined" && GEONEXUS_DATA.properties) {
          GEONEXUS_DATA.properties.forEach(p => {
            if (p.ulpin.toLowerCase().includes(query) ||
                p.unitNumber.toLowerCase().includes(query) ||
                p.buildingName.toLowerCase().includes(query) ||
                p.configuration.toLowerCase().includes(query)) {
              results.push({
                type: "Property Unit",
                title: `${p.unitNumber} - ${p.buildingName}`,
                sub: `3D ULPIN: ${p.ulpin} | ${p.status}`,
                ulpin: p.ulpin,
                buildingId: p.buildingId,
                floor: p.floorNumber,
                unit: p.unitCode
              });
            }
          });
        }

        // Search Buildings
        if (typeof GEONEXUS_DATA !== "undefined" && GEONEXUS_DATA.buildings) {
          GEONEXUS_DATA.buildings.forEach(b => {
            if (b.name.toLowerCase().includes(query) ||
                b.id.toLowerCase().includes(query) ||
                b.surveyNo.toLowerCase().includes(query)) {
              results.push({
                type: "Building",
                title: `${b.name} (${b.id})`,
                sub: `Survey No: ${b.surveyNo} | ${b.floorsCount} Floors | ${b.unitsCount} Units`,
                buildingId: b.id
              });
            }
          });
        }

        // Render Dropdown Results
        dropdown.innerHTML = "";
        if (results.length === 0) {
          dropdown.innerHTML = `<div class="search-result-item" style="color:var(--text-muted); text-align:center; padding:1rem;">No spatial record found for "${e.target.value}"</div>`;
        } else {
          results.slice(0, 6).forEach(res => {
            const item = document.createElement("div");
            item.className = "search-result-item";
            item.innerHTML = `
              <div class="search-result-header">
                <span class="search-result-title">${res.title}</span>
                <span class="badge badge-cadastre">${res.type}</span>
              </div>
              <div class="search-result-sub mono">${res.sub}</div>
            `;
            item.addEventListener("click", () => {
              dropdown.classList.remove("show");
              if (res.ulpin) {
                window.location.href = `map.html?ulpin=${encodeURIComponent(res.ulpin)}&building=${res.buildingId}&floor=${res.floor}&unit=${res.unit}`;
              } else if (res.buildingId) {
                window.location.href = `map.html?building=${res.buildingId}`;
              }
            });
            dropdown.appendChild(item);
          });
        }
        dropdown.classList.add("show");
      });

      // Escape key closes search
      input.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && dropdown) {
          dropdown.classList.remove("show");
        }
      });

      // Close dropdown when clicking outside
      document.addEventListener("click", (e) => {
        if (dropdown && !dropdown.contains(e.target) && !input.contains(e.target)) {
          dropdown.classList.remove("show");
        }
      });
    });
  },

  // Global Toast Notification System with SVG Icons
  showToast(message, type = "info") {
    let container = document.querySelector(".toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    let iconName = "info";
    if (type === "success") iconName = "check";
    if (type === "warning") iconName = "warning";
    if (type === "danger" || type === "error") iconName = "danger";

    const svgHtml = this.getIcon(iconName, "icon-md");

    toast.innerHTML = `
      <span style="display:flex; align-items:center; flex-shrink:0;">${svgHtml}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, 3800);
  },

  initToasts() {
    if (!document.querySelector(".toast-container")) {
      const container = document.createElement("div");
      container.className = "toast-container";
      document.body.appendChild(container);
    }
  },

  // Global Copy to Clipboard Helper
  copyText(text, label = "Text") {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        this.showToast(`${label} copied to clipboard: ${text}`, "success");
      }).catch(() => {
        this.fallbackCopy(text, label);
      });
    } else {
      this.fallbackCopy(text, label);
    }
  },

  fallbackCopy(text, label) {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    this.showToast(`${label} copied to clipboard`, "success");
  },

  // Modal Manager
  initModals() {
    document.querySelectorAll("[data-modal-target]").forEach(btn => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-modal-target");
        this.openModal(targetId);
      });
    });

    document.querySelectorAll(".modal-close-btn, [data-modal-close]").forEach(btn => {
      btn.addEventListener("click", () => {
        const modal = btn.closest(".modal-backdrop");
        if (modal) modal.classList.remove("show");
      });
    });

    // Close on backdrop click & Escape key
    document.querySelectorAll(".modal-backdrop").forEach(modal => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("show");
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll(".modal-backdrop.show").forEach(modal => {
          modal.classList.remove("show");
        });
      }
    });
  },

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("show");
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("show");
    }
  },

  // Interactive Glossary Tooltip System
  initTooltips() {
    let tooltipBubble = document.querySelector(".geo-tooltip-bubble");
    if (!tooltipBubble) {
      tooltipBubble = document.createElement("div");
      tooltipBubble.className = "geo-tooltip-bubble";
      document.body.appendChild(tooltipBubble);
    }

    document.querySelectorAll("[data-tooltip]").forEach(el => {
      const term = el.getAttribute("data-tooltip");
      const definition = (typeof GEONEXUS_DATA !== "undefined" && GEONEXUS_DATA.glossary && GEONEXUS_DATA.glossary[term]) || el.getAttribute("data-tooltip-text") || term;

      el.addEventListener("mouseenter", () => {
        tooltipBubble.innerHTML = `<strong>${term}</strong><div style="margin-top:2px;">${definition}</div>`;
        const rect = el.getBoundingClientRect();
        tooltipBubble.style.top = `${rect.bottom + window.scrollY + 8}px`;
        tooltipBubble.style.left = `${Math.max(10, rect.left + window.scrollX - 40)}px`;
        tooltipBubble.classList.add("show");
      });

      el.addEventListener("mouseleave", () => {
        tooltipBubble.classList.remove("show");
      });
    });
  },

  // Global Privacy-Conscious Contact Owner Handler
  initContactOwnerHandlers() {
    document.addEventListener("click", (e) => {
      const target = e.target.closest("[data-contact-owner]");
      if (target) {
        const ulpin = target.getAttribute("data-contact-owner") || "IND-AP-VIZ-BLD05-F03-U302";
        this.openContactOwnerModal(ulpin);
      }
    });
  },

  openContactOwnerModal(ulpin) {
    if (typeof GEONEXUS_DATA === "undefined" || !GEONEXUS_DATA.properties) return;
    const property = GEONEXUS_DATA.properties.find(p => p.ulpin === ulpin) || GEONEXUS_DATA.properties[0];
    
    // Check if property is available
    if (property.statusCode === "occupied" || property.statusCode === "sold") {
      this.showToast("This property unit is occupied or sold. Contact is unavailable.", "warning");
      return;
    }

    let modal = document.getElementById("contactOwnerModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "contactOwnerModal";
      modal.className = "modal-backdrop";
      modal.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-header">
            <div>
              <div class="modal-title">Property Owner Contact</div>
              <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">Privacy-Masked Cadastral Contact Protocol</div>
            </div>
            <button class="modal-close-btn" aria-label="Close">${this.getIcon("close", "icon-sm")}</button>
          </div>
          <div class="modal-body" id="contactOwnerModalBody"></div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.querySelector(".modal-close-btn").addEventListener("click", () => modal.classList.remove("show"));
      modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("show"); });
    }

    const body = modal.querySelector("#contactOwnerModalBody");
    body.innerHTML = `
      <div style="background:var(--bg-secondary); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:1rem; margin-bottom:1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
          <span style="font-weight:700; font-size:1.05rem;">${property.unitNumber} - ${property.buildingName}</span>
          <span class="badge badge-success">${property.status}</span>
        </div>
        <div class="mono" style="font-size:0.8rem; color:var(--cyan-accent);">${property.ulpin}</div>
      </div>

      <div style="margin-bottom:1.25rem; display:flex; flex-direction:column; gap:0.75rem;">
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border-light); padding-bottom:0.4rem;">
          <span style="color:var(--text-muted); font-size:0.85rem;">Registered Owner:</span>
          <span style="font-weight:700;">${property.owner.name}</span>
        </div>
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border-light); padding-bottom:0.4rem;">
          <span style="color:var(--text-muted); font-size:0.85rem;">Phone:</span>
          <span class="mono" style="font-weight:600;">${property.owner.phoneMasked}</span>
        </div>
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border-light); padding-bottom:0.4rem;">
          <span style="color:var(--text-muted); font-size:0.85rem;">Email:</span>
          <span class="mono" style="font-weight:600;">${property.owner.emailMasked}</span>
        </div>
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border-light); padding-bottom:0.4rem;">
          <span style="color:var(--text-muted); font-size:0.85rem;">Preferred Mode:</span>
          <span class="badge badge-cadastre">${property.owner.preferredContact}</span>
        </div>
      </div>

      <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:var(--radius-sm); padding:0.65rem 0.85rem; font-size:0.75rem; color:#1e40af; margin-bottom:1.25rem;">
        <strong>CONTACT INFORMATION:</strong> Personal contact info is masked for privacy protection.
      </div>

      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.6rem;">
        <button class="btn btn-secondary btn-sm" onclick="GeoNexusApp.simulateAction('Voice call initiated to masked contact endpoint')">${this.getIcon("phone", "icon-sm")} Call</button>
        <button class="btn btn-secondary btn-sm" onclick="GeoNexusApp.simulateAction('Email inquiry drafted')">${this.getIcon("mail", "icon-sm")} Email</button>
        <button class="btn btn-primary btn-sm" onclick="GeoNexusApp.simulateAction('Expression of interest submitted to cadastral desk')">Enquire</button>
      </div>
    `;

    modal.classList.add("show");
  },

  simulateAction(message) {
    this.showToast(message, "success");
    this.closeModal("contactOwnerModal");
  },

  // Helper to extract query parameters
  getUrlParams() {
    const params = {};
    const searchParams = new URLSearchParams(window.location.search);
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    return params;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  GeoNexusApp.init();
});
