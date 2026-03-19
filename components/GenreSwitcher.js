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
          background: oklch(15% 0.02 250);
          padding: 2rem;
          border-radius: 2rem;
          border: 1px solid oklch(25% 0.04 250);
        }
        .label {
          font-size: 0.9rem;
          color: oklch(70% 0.05 250);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.2em;
        }
        .options {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .option {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          cursor: pointer;
          font-weight: 600;
          color: oklch(80% 0.02 250);
          transition: color 0.2s;
          user-select: none;
        }
        .option:hover {
          color: var(--accent-color);
        }
        input[type="checkbox"] {
          appearance: none;
          width: 1.5rem;
          height: 1.5rem;
          border: 2px solid oklch(40% 0.05 250);
          border-radius: 0.4rem;
          background: transparent;
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
        }
        input[type="checkbox"]:checked {
          background: var(--accent-color);
          border-color: var(--accent-color);
        }
        input[type="checkbox"]:checked::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: oklch(15% 0.02 250);
          font-size: 1rem;
          font-weight: 900;
        }
        input[type="checkbox"]:hover {
          border-color: var(--accent-color);
        }
      </style>
      <div class="switcher-container">
        <div class="label">장르 필터</div>
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
