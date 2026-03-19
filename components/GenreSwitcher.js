import { KEYWORD_PACKS, dataService } from '../main.js';

class GenreSwitcher extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const genres = Object.entries(KEYWORD_PACKS);
    this.shadowRoot.innerHTML = `
      <style>
        .switcher-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          align-items: center;
          background: rgba(37, 22, 63, 0.4);
          padding: 2rem;
          border-radius: 2rem;
          border: 1px solid rgba(255, 215, 0, 0.2);
          backdrop-filter: blur(10px);
        }
        .label {
          font-size: 0.9rem;
          color: #FFD700;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.4em;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }
        .options {
          display: flex;
          gap: 2.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .option {
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.8);
          transition: all 0.3s;
          user-select: none;
          letter-spacing: 0.1em;
        }
        .option:hover {
          color: #FFD700;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
        }
        input[type="checkbox"] {
          appearance: none;
          width: 1.2rem;
          height: 1.2rem;
          border: 2px solid rgba(255, 215, 0, 0.4);
          border-radius: 50%;
          background: transparent;
          cursor: pointer;
          position: relative;
          transition: all 0.3s;
        }
        input[type="checkbox"]:checked {
          background: #FFD700;
          border-color: #FFD700;
          box-shadow: 0 0 15px #FFD700;
        }
        input[type="checkbox"]:checked::after {
          content: '✦';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #25163F;
          font-size: 0.7rem;
        }
      </style>
      <div class="switcher-container">
        <div class="label">Magic Realm</div>
        <div class="options">
          ${genres.map(([key, pack]) => `
            <label class="option">
              <input type="checkbox" value="${key}" ${dataService.selectedGenres.has(key) ? 'checked' : ''}>
              <span>${pack.label}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;

    this.shadowRoot.querySelectorAll('input').forEach(input => {
      input.addEventListener('change', (e) => {
        const genre = e.target.value;
        const checked = e.target.checked;
        
        if (!checked && dataService.selectedGenres.size === 1) {
          e.target.checked = true;
          return;
        }

        dataService.toggleGenre(genre);
        window.dispatchEvent(new CustomEvent('genre-changed', { detail: Array.from(dataService.selectedGenres) }));
      });
    });
  }
}

customElements.define('genre-switcher', GenreSwitcher);
