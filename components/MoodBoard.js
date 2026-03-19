class PaletteViewer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    
    window.addEventListener('spark-complete', (e) => {
      this.updatePalette(e.detail.colors);
    });
  }

  updatePalette(colors) {
    const palette = this.shadowRoot.getElementById('palette');
    palette.innerHTML = colors.map(c => `
      <div class="color-swatch" style="background: ${c.oklch};" title="${c.hex}">
        <span>${c.hex}</span>
      </div>
    `).join('');
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; padding: 1.5rem; }
        .container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .label {
          text-align: center;
          font-weight: 800;
          color: oklch(70% 0.05 250);
          text-transform: uppercase;
          font-size: 0.9rem;
          letter-spacing: 0.3em;
        }
        #palette {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .color-swatch {
          height: 80px;
          border-radius: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 10px 20px -5px rgba(0,0,0,0.5);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .color-swatch:hover {
          transform: scale(1.02);
        }
        .color-swatch span {
          background: rgba(0,0,0,0.3);
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 2rem;
          font-size: 0.8rem;
          font-weight: 700;
          backdrop-filter: blur(4px);
        }
      </style>
      <div class="container">
        <div class="label">Color Palette</div>
        <div id="palette">
          <div class="color-swatch" style="background: var(--accent-color);"><span>SPARK TO START</span></div>
        </div>
      </div>
    `;
  }
}

customElements.define('palette-viewer', PaletteViewer);
