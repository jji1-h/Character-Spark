import * as THREE from 'three';

class MoodBoard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.mesh = null;
  }

  connectedCallback() {
    this.render();
    this.initThree();
    
    window.addEventListener('spark-complete', (e) => {
      this.updateMood(e.detail);
    });
  }

  initThree() {
    const container = this.shadowRoot.getElementById('three-container');
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 2;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    container.appendChild(this.renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(1, 0);
    this.material = new THREE.MeshPhongMaterial({ 
      color: 0xffffff,
      wireframe: true,
      emissive: 0x444444,
      shininess: 100
    });
    
    const light = new THREE.PointLight(0xffffff, 100);
    light.position.set(5, 5, 5);
    this.scene.add(light);
    this.scene.add(new THREE.AmbientLight(0x404040));

    this.mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.mesh);

    const animate = () => {
      requestAnimationFrame(animate);
      this.mesh.rotation.x += 0.005;
      this.mesh.rotation.y += 0.01;
      this.renderer.render(this.scene, this.camera);
    };
    animate();

    // Handle resize
    window.addEventListener('resize', () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      this.renderer.setSize(w, h);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    });
  }

  updateMood(spark) {
    const palette = this.shadowRoot.getElementById('palette');
    palette.innerHTML = spark.colors.map(c => `
      <div class="color-swatch" style="background: ${c.oklch};" title="${c.hex}"></div>
    `).join('');

    // Update 3D mesh based on genre and first color
    this.scene.remove(this.mesh);
    let geometry;
    switch(spark.genre) {
      case 'fantasy': geometry = new THREE.OctahedronGeometry(1, 0); break;
      case 'scifi': geometry = new THREE.TorusKnotGeometry(0.7, 0.2, 100, 16); break;
      case 'romance': geometry = new THREE.TorusGeometry(0.8, 0.3, 16, 100); break;
      default: geometry = new THREE.IcosahedronGeometry(1, 0);
    }
    
    this.material.color.set(spark.colors[0].hex);
    this.material.emissive.set(spark.colors[1].hex).multiplyScalar(0.2);
    
    this.mesh.geometry.dispose();
    this.mesh.geometry = geometry;
    this.scene.add(this.mesh);

    this.mesh.scale.setScalar(1 + (Math.random() * 0.2 - 0.1));
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; height: 100%; }
        .mood-container {
          display: grid;
          grid-template-rows: 1fr auto;
          height: 100%;
          gap: 1rem;
        }
        #three-container {
          width: 100%;
          height: 100%;
          min-height: 250px;
          cursor: grab;
        }
        #palette {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          padding: 1rem;
        }
        .color-swatch {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .mood-label {
          text-align: center;
          font-weight: 700;
          color: oklch(70% 0.05 250);
          text-transform: uppercase;
          font-size: 0.8rem;
          letter-spacing: 0.2em;
        }
      </style>
      <div class="mood-container">
        <div class="mood-label">Visual Spark</div>
        <div id="three-container"></div>
        <div id="palette">
          <!-- Colors will appear here -->
        </div>
      </div>
    `;
  }
}

customElements.define('mood-board', MoodBoard);
