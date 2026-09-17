/**
 * GeoNexus - 3D GIS & Digital Twin WebGL Engine
 * Powered by Three.js & OrbitControls
 */

class GeoNexus3DEngine {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.options = Object.assign({
      mode: "full", // 'full', 'mini', 'underground', 'lidar', 'compare'
      enableExplode: true,
      selectedBuildingId: "BLD05",
      onSelectUnit: null,
      onSelectBuilding: null,
      onSelectParcel: null
    }, options);

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Scene Groups for Layer Controls
    this.groups = {
      terrain: new THREE.Group(),
      parcels: new THREE.Group(),
      roads: new THREE.Group(),
      buildings: new THREE.Group(),
      underground: new THREE.Group(),
      conflicts: new THREE.Group(),
      lidar: new THREE.Group()
    };

    // State Tracking
    this.buildingMeshes = {};
    this.selectedBuilding = null;
    this.selectedFloorNum = null;
    this.selectedUnitCode = null;
    this.selectedParcelId = null;
    this.explosionFactor = 0;
    this.isUndergroundMode = false;
    this.targetCameraPos = null;
    this.targetLookAt = null;

    this.init();
  }

  init() {
    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 600;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x090d16);
    this.scene.fog = new THREE.FogExp2(0x090d16, 0.0035);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 2000);
    this.camera.position.set(55, 45, 65);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // 4. Orbit Controls
    if (typeof THREE.OrbitControls !== "undefined") {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2 + 0.1; // Allow slight underground view
      this.controls.minDistance = 8;
      this.controls.maxDistance = 280;
    }

    // 5. Lighting
    this.setupLighting();

    // 6. Build Scene Layers
    for (const key in this.groups) {
      this.scene.add(this.groups[key]);
    }

    this.buildTerrainAndGrid();
    this.buildParcels();
    this.buildRoads();
    this.buildBuildings();
    this.buildUndergroundInfrastructure();
    this.buildSpatialConflicts();
    this.buildLidarPointCloud();
    this.groups.underground.visible = false;
    this.groups.conflicts.visible = false;

    // 7. Event Listeners
    window.addEventListener("resize", () => this.onResize());
    this.renderer.domElement.addEventListener("pointerdown", (e) => this.onPointerDown(e));

    // 8. Animation Loop
    this.animate();

    // Select default Flagship Building (BLD05 - Geo Heights)
    if (this.options.selectedBuildingId) {
      this.selectBuilding(this.options.selectedBuildingId, false);
    }
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.85);
    dirLight.position.set(70, 100, 50);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 300;
    dirLight.shadow.camera.left = -100;
    dirLight.shadow.camera.right = 100;
    dirLight.shadow.camera.top = 100;
    dirLight.shadow.camera.bottom = -100;
    this.scene.add(dirLight);

    const blueSubLight = new THREE.DirectionalLight(0x38bdf8, 0.3);
    blueSubLight.position.set(-50, -40, -50);
    this.scene.add(blueSubLight);
  }

  buildTerrainAndGrid() {
    // Ground Grid
    const grid = new THREE.GridHelper(260, 60, 0x1e3a8a, 0x111e38);
    grid.position.y = 0.01;
    this.groups.terrain.add(grid);

    // Ground Plane Surface
    const groundGeo = new THREE.PlaneGeometry(280, 280);
    this.groundMat = new THREE.MeshStandardMaterial({
      color: 0x0c1427,
      roughness: 0.9,
      metalness: 0.1,
      transparent: true,
      opacity: 0.95
    });
    const groundMesh = new THREE.Mesh(groundGeo, this.groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    this.groups.terrain.add(groundMesh);
  }

  buildParcels() {
    if (!GEONEXUS_DATA.parcels) return;

    GEONEXUS_DATA.parcels.forEach(p => {
      const shape = new THREE.Shape();
      p.boundaryPoints.forEach((pt, idx) => {
        if (idx === 0) shape.moveTo(pt[0], pt[1]);
        else shape.lineTo(pt[0], pt[1]);
      });
      shape.closePath();

      const geom = new THREE.ShapeGeometry(shape);
      const mat = new THREE.MeshBasicMaterial({
        color: p.id === "P-55-2C" ? 0x2563eb : 0x1e293b,
        transparent: true,
        opacity: p.id === "P-55-2C" ? 0.25 : 0.12,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(geom, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = 0.05;
      mesh.userData = { type: "parcel", parcelData: p };

      // Edges outline
      const edges = new THREE.EdgesGeometry(geom);
      const lineMat = new THREE.LineBasicMaterial({
        color: p.id === "P-55-2C" ? 0x38bdf8 : 0x475569,
        linewidth: 2
      });
      const line = new THREE.LineSegments(edges, lineMat);
      line.rotation.x = -Math.PI / 2;
      line.position.y = 0.06;

      const parcelGroup = new THREE.Group();
      parcelGroup.add(mesh);
      parcelGroup.add(line);
      this.groups.parcels.add(parcelGroup);
    });
  }

  buildRoads() {
    // Primary Roads Network in City
    const roadMat = new THREE.MeshBasicMaterial({ color: 0x131d33 });
    const roadMarkingMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.4 });

    const roadGeom1 = new THREE.PlaneGeometry(260, 6);
    const r1 = new THREE.Mesh(roadGeom1, roadMat);
    r1.rotation.x = -Math.PI / 2;
    r1.position.set(0, 0.02, 10);
    this.groups.roads.add(r1);

    const roadGeom2 = new THREE.PlaneGeometry(6, 260);
    const r2 = new THREE.Mesh(roadGeom2, roadMat);
    r2.rotation.x = -Math.PI / 2;
    r2.position.set(-15, 0.02, 0);
    this.groups.roads.add(r2);
  }
  buildBuildings() {
    if (!GEONEXUS_DATA.buildings) return;

    GEONEXUS_DATA.buildings.forEach(b => {
      const bGroup = new THREE.Group();
      bGroup.position.set(b.threePos.x, 0, b.threePos.z);
      bGroup.userData = { type: "building", buildingData: b };

      const floorMeshes = [];
      const floorHeight = 3.6;
      const bWidth = Math.sqrt(b.footprintSqMt) * 0.45;
      const bDepth = Math.sqrt(b.footprintSqMt) * 0.45;

      // Base Foundation
      const foundGeo = new THREE.BoxGeometry(bWidth + 1.5, 2.5, bDepth + 1.5);
      const foundMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.8
      });
      const foundMesh = new THREE.Mesh(foundGeo, foundMat);
      foundMesh.position.y = -1.25;
      foundMesh.receiveShadow = true;
      foundMesh.castShadow = true;
      bGroup.add(foundMesh);

      // Build Discrete Floors
      b.floors.forEach((f, fIdx) => {
        const fGroup = new THREE.Group();
        fGroup.position.y = fIdx * floorHeight;
        fGroup.userData = {
          type: "floor",
          floorNum: f.floorNum,
          floorLabel: f.label,
          buildingId: b.id,
          initialY: fIdx * floorHeight
        };

        // Floor Slab Base Mesh
        const slabGeo = new THREE.BoxGeometry(bWidth, 0.4, bDepth);
        const slabMat = new THREE.MeshStandardMaterial({
          color: 0x334155,
          roughness: 0.6
        });
        const slabMesh = new THREE.Mesh(slabGeo, slabMat);
        slabMesh.position.y = 0.2;
        slabMesh.castShadow = true;
        slabMesh.receiveShadow = true;
        fGroup.add(slabMesh);

        // 4 Apartment Units per Floor
        const unitWidth = (bWidth - 0.8) / 2;
        const unitDepth = (bDepth - 0.8) / 2;
        const unitHeight = floorHeight - 0.5;

        const unitOffsets = [
          { x: -unitWidth / 2 - 0.15, z: -unitDepth / 2 - 0.15, code: f.units[0] || "U01" },
          { x: unitWidth / 2 + 0.15, z: -unitDepth / 2 - 0.15, code: f.units[1] || "U02" },
          { x: -unitWidth / 2 - 0.15, z: unitDepth / 2 + 0.15, code: f.units[2] || "U03" },
          { x: unitWidth / 2 + 0.15, z: unitDepth / 2 + 0.15, code: f.units[3] || "U04" }
        ];

        unitOffsets.forEach((uOff) => {
          const unitGeo = new THREE.BoxGeometry(unitWidth, unitHeight, unitDepth);
          
          // Custom tint for flagship Flat 302
          const isFlagshipUnit = (b.id === "BLD05" && f.floorNum === 3 && uOff.code === "U302");
          const unitMat = new THREE.MeshStandardMaterial({
            color: isFlagshipUnit ? 0x38bdf8 : 0x1e3a8a,
            roughness: 0.4,
            metalness: 0.2,
            transparent: true,
            opacity: 0.88
          });

          const unitMesh = new THREE.Mesh(unitGeo, unitMat);
          unitMesh.position.set(uOff.x, unitHeight / 2 + 0.4, uOff.z);
          unitMesh.castShadow = true;
          unitMesh.receiveShadow = true;
          unitMesh.userData = {
            type: "unit",
            unitCode: uOff.code,
            floorNum: f.floorNum,
            buildingId: b.id,
            isFlagship: isFlagshipUnit
          };

          // Window line accent
          const windowGeo = new THREE.PlaneGeometry(unitWidth * 0.7, unitHeight * 0.5);
          const windowMat = new THREE.MeshBasicMaterial({
            color: isFlagshipUnit ? 0x93c5fd : 0x60a5fa,
            transparent: true,
            opacity: 0.75
          });
          const winMesh = new THREE.Mesh(windowGeo, windowMat);
          winMesh.position.set(uOff.x, unitHeight / 2 + 0.4, uOff.z + unitDepth / 2 + 0.02);
          fGroup.add(winMesh);

          fGroup.add(unitMesh);
        });

        bGroup.add(fGroup);
        floorMeshes.push(fGroup);
      });

      this.groups.buildings.add(bGroup);
      this.buildingMeshes[b.id] = { group: bGroup, floors: floorMeshes, data: b };
    });
  }

  // Interactive Floor Explosion
  explodeFloors(factor = 1.0) {
    this.explosionFactor = factor;
    const bId = this.selectedBuilding ? this.selectedBuilding.data.id : "BLD05";
    const bldObj = this.buildingMeshes[bId];
    if (!bldObj) return;

    const spacingMultiplier = 4.2;
    bldObj.floors.forEach((fGroup, idx) => {
      const targetY = fGroup.userData.initialY + (idx * spacingMultiplier * factor);
      fGroup.position.y = targetY;
    });
  }

  resetBuildingExplosion() {
    this.explodeFloors(0);
  }
  buildUndergroundInfrastructure() {
    if (!GEONEXUS_DATA.infrastructure) return;

    GEONEXUS_DATA.infrastructure.forEach(util => {
      const points = util.path.map(p => new THREE.Vector3(p.x, p.y, p.z));
      const curve = new THREE.CatmullRomCurve3(points);
      
      const radius = (util.diameterMm / 1000) * 0.75 || 0.4;
      const geom = new THREE.TubeGeometry(curve, 32, radius, 12, false);
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(util.color),
        roughness: 0.3,
        metalness: 0.6,
        emissive: new THREE.Color(util.color),
        emissiveIntensity: 0.35
      });

      const tube = new THREE.Mesh(geom, mat);
      tube.userData = { type: "infrastructure", utilData: util };
      this.groups.underground.add(tube);
    });
  }

  buildSpatialConflicts() {
    if (!GEONEXUS_DATA.conflicts) return;

    GEONEXUS_DATA.conflicts.forEach(conf => {
      // Pulsing red conflict warning sphere
      const sphereGeo = new THREE.SphereGeometry(1.6, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: 0xef4444,
        wireframe: true,
        transparent: true,
        opacity: 0.8
      });
      const marker = new THREE.Mesh(sphereGeo, sphereMat);
      marker.position.set(conf.location3D.x, conf.location3D.y, conf.location3D.z);
      marker.userData = { type: "conflict", conflictData: conf };
      
      // Ring Buffer Boundary
      const ringGeo = new THREE.RingGeometry(conf.distanceMeters - 0.2, conf.distanceMeters + 0.2, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xef4444,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(conf.location3D.x, conf.location3D.y, conf.location3D.z);
      
      const confGroup = new THREE.Group();
      confGroup.add(marker);
      confGroup.add(ring);
      this.groups.conflicts.add(confGroup);
    });
  }

  buildLidarPointCloud() {
    // 14,000 spatial LiDAR point cloud points with elevation color gradient
    const pointCount = 14000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(pointCount * 3);
    const colors = new Float32Array(pointCount * 3);

    const colorRamp = [
      new THREE.Color(0x1e3a8a), // low / ground (navy)
      new THREE.Color(0x06b6d4), // mid-low (cyan)
      new THREE.Color(0x10b981), // mid (green)
      new THREE.Color(0xf59e0b), // mid-high (amber)
      new THREE.Color(0xef4444)  // high roofs (red)
    ];

    let pIdx = 0;
    for (let i = 0; i < pointCount; i++) {
      const x = (Math.random() - 0.5) * 220;
      const z = (Math.random() - 0.5) * 220;
      
      // Elevation modeling: ground + clusters near buildings
      let y = Math.random() * 2.5;
      if (Math.abs(x) < 25 && Math.abs(z) < 25) {
        y = Math.random() * 22.0; // Building cluster
      } else if (Math.random() > 0.7) {
        y = Math.random() * 12.0; // Vegetation cluster
      }

      positions[pIdx] = x;
      positions[pIdx + 1] = y;
      positions[pIdx + 2] = z;

      // Color mapping by height (0m to 24m)
      const normY = Math.min(Math.max(y / 24.0, 0), 1);
      const colorIdx = Math.min(Math.floor(normY * (colorRamp.length - 1)), colorRamp.length - 2);
      const subT = (normY * (colorRamp.length - 1)) - colorIdx;
      
      const c = colorRamp[colorIdx].clone().lerp(colorRamp[colorIdx + 1], subT);
      colors[pIdx] = c.r;
      colors[pIdx + 1] = c.g;
      colors[pIdx + 2] = c.b;

      pIdx += 3;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.9,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    const pointCloud = new THREE.Points(geometry, material);
    pointCloud.name = "lidarPointCloud";
    this.groups.lidar.add(pointCloud);
    this.groups.lidar.visible = false; // Off by default until toggled
  }

  // Selection Logic
  selectBuilding(buildingId, triggerCallback = true) {
    const bldObj = this.buildingMeshes[buildingId];
    if (!bldObj) return;

    this.selectedBuilding = bldObj;
    this.selectedFloorNum = null;
    this.selectedUnitCode = null;

    // Camera Tween Focus
    const bPos = bldObj.group.position;
    this.flyCameraTo(
      new THREE.Vector3(bPos.x + 28, bldObj.data.heightMeters + 12, bPos.z + 32),
      new THREE.Vector3(bPos.x, bldObj.data.heightMeters * 0.45, bPos.z)
    );

    // Reset floor opacities
    bldObj.floors.forEach(fGroup => {
      fGroup.traverse(child => {
        if (child.material && child.userData.type === "unit") {
          child.material.opacity = 0.88;
          child.material.color.setHex(child.userData.isFlagship ? 0x38bdf8 : 0x1e3a8a);
        }
      });
    });

    if (triggerCallback && this.options.onSelectBuilding) {
      this.options.onSelectBuilding(bldObj.data);
    }
  }

  selectFloor(floorNum) {
    this.selectedFloorNum = floorNum;
    const bId = this.selectedBuilding ? this.selectedBuilding.data.id : "BLD05";
    const bldObj = this.buildingMeshes[bId];
    if (!bldObj) return;

    bldObj.floors.forEach(fGroup => {
      const isSelected = (fGroup.userData.floorNum === floorNum);
      fGroup.traverse(child => {
        if (child.material && child.userData.type === "unit") {
          child.material.opacity = isSelected ? 1.0 : 0.22;
          if (isSelected) {
            child.material.color.setHex(0x38bdf8);
          } else {
            child.material.color.setHex(0x1e293b);
          }
        }
      });
    });
  }

  selectUnit(unitCode, triggerCallback = true) {
    this.selectedUnitCode = unitCode;
    const bId = this.selectedBuilding ? this.selectedBuilding.data.id : "BLD05";
    const bldObj = this.buildingMeshes[bId];
    if (!bldObj) return;

    let selectedUnitMesh = null;
    bldObj.floors.forEach(fGroup => {
      fGroup.traverse(child => {
        if (child.material && child.userData.type === "unit") {
          if (child.userData.unitCode === unitCode && (this.selectedFloorNum === null || child.userData.floorNum === this.selectedFloorNum)) {
            selectedUnitMesh = child;
            child.material.opacity = 1.0;
            child.material.color.setHex(0x38bdf8);
            this.selectedFloorNum = child.userData.floorNum;
          } else {
            child.material.opacity = 0.22;
            child.material.color.setHex(0x1e293b);
          }
        }
      });
    });

    if (triggerCallback && this.options.onSelectUnit) {
      const floor = this.selectedFloorNum !== null ? this.selectedFloorNum : 3;
      const fullUlpin = `IND-AP-VIZ-${bId}-F${String(floor).padStart(2, "0")}-${unitCode}`;
      const prop = (GEONEXUS_DATA.properties && GEONEXUS_DATA.properties.find(p => p.ulpin === fullUlpin)) || GEONEXUS_DATA.properties[0];
      this.options.onSelectUnit(prop);
    }
  }

  // Toggle Underground Mode
  setUndergroundMode(enabled) {
    this.isUndergroundMode = enabled;
    if (this.groundMat) {
      this.groundMat.opacity = enabled ? 0.25 : 0.95;
    }
    this.groups.underground.visible = enabled;
    this.groups.conflicts.visible = enabled;

    if (enabled) {
      this.flyCameraTo(new THREE.Vector3(20, -12, 35), new THREE.Vector3(0, -6, 0));
    }
  }

  setLayerVisible(layerKey, isVisible) {
    if (this.groups[layerKey]) {
      this.groups[layerKey].visible = isVisible;
    }
  }

  flyCameraTo(pos, lookAt) {
    this.targetCameraPos = pos.clone();
    this.targetLookAt = lookAt.clone();
  }

  onPointerDown(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      for (let i = 0; i < intersects.length; i++) {
        let obj = intersects[i].object;
        while (obj && obj !== this.scene && !obj.userData.type) {
          obj = obj.parent;
        }
        if (obj.userData && obj.userData.type === "unit") {
          this.selectBuilding(obj.userData.buildingId, false);
          this.selectFloor(obj.userData.floorNum);
          this.selectUnit(obj.userData.unitCode, true);
          break;
        } else if (obj.userData && obj.userData.type === "building") {
          this.selectBuilding(obj.userData.buildingData.id, true);
          break;
        } else if (obj.userData && obj.userData.type === "parcel") {
          if (this.options.onSelectParcel) this.options.onSelectParcel(obj.userData.parcelData);
          break;
        }
      }
    }
  }

  onResize() {
    if (!this.container || !this.camera || !this.renderer) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Smooth Camera Transition
    if (this.targetCameraPos && this.targetLookAt) {
      this.camera.position.lerp(this.targetCameraPos, 0.05);
      if (this.controls) {
        this.controls.target.lerp(this.targetLookAt, 0.05);
      }
      if (this.camera.position.distanceTo(this.targetCameraPos) < 0.2) {
        this.targetCameraPos = null;
        this.targetLookAt = null;
      }
    }

    if (this.controls) {
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);
  }
}
