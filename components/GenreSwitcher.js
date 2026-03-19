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
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .label {
          font-size: 0.85rem;
          color: oklch(70% 0.05 250);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .options {
          display: flex;
          gap: 0.8rem;
          flex-wrap: wrap;
        }
        .option {
          position: relative;
          cursor: pointer;
        }
        .option input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }
        .checkmark {
          display: block;
          background: oklch(25% 0.03 250);
          color: oklch(70% 0.01 250);
          padding: 0.6rem 1.2rem;
          border-radius: 2rem;
          border: 1px solid oklch(35% 0.04 250);
          font-weight: 600;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          user-select: none;
        }
        .option:hover .checkmark {
          border-color: oklch(50% 0.05 250);
        }
        .option input:checked ~ .checkmark {
          background: oklch(80% 0.1 250);
          color: oklch(15% 0.02 250);
          border-color: transparent;
          box-shadow: 0 4px 15px oklch(80% 0.1 250 / 0.3);
          transform: translateY(-2px);
        }
      </style>
      <div class="switcher-container">
        <div class="label">장르 필터 (다중 선택)</div>
        <div class="options">
          ${genres.map(([key, pack]) => `
            <label class="option">
              <input type="checkbox" value="${key}" ${dataService.selectedGenres.has(key) ? 'checked' : ''}>
              <span class="checkmark">${pack.label}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;

    this.shadowRoot.querySelectorAll('input').forEach(input => {
      input.addEventListener('change', (e) => {
        const genre = e.target.value;
        const checked = e.target.checked;
        
        // Prevent unselecting all
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
