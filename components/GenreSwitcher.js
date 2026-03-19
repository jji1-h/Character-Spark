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
          gap: 0.8rem;
        }
        .label {
          font-size: 0.8rem;
          color: oklch(60% 0.05 250);
          font-weight: 700;
          text-transform: uppercase;
        }
        .switcher {
          display: flex;
          gap: 0.5rem;
          background: oklch(25% 0.03 250);
          padding: 0.4rem;
          border-radius: 1.2rem;
          border: 1px solid oklch(35% 0.04 250);
          overflow-x: auto;
          scrollbar-width: none;
        }
        .switcher::-webkit-scrollbar { display: none; }
        
        button {
          background: transparent;
          color: oklch(70% 0.01 250);
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 0.8rem;
          cursor: pointer;
          font-weight: 600;
          white-space: nowrap;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        button.active {
          background: oklch(80% 0.1 250);
          color: oklch(15% 0.02 250);
          box-shadow: 0 4px 12px oklch(80% 0.1 250 / 0.2);
        }
        .check {
          display: none;
          font-size: 0.8rem;
        }
        button.active .check {
          display: inline;
        }
      </style>
      <div class="switcher-container">
        <div class="label">장르 선택 (다중 선택 가능)</div>
        <div class="switcher">
          ${genres.map(([key, pack]) => `
            <button class="${dataService.selectedGenres.has(key) ? 'active' : ''}" data-genre="${key}">
              <span class="check">✓</span> ${pack.label}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    this.shadowRoot.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const genre = e.currentTarget.dataset.genre;
        dataService.toggleGenre(genre);
        this.render();
        window.dispatchEvent(new CustomEvent('genre-changed', { detail: Array.from(dataService.selectedGenres) }));
      });
    });
  }
}

customElements.define('genre-switcher', GenreSwitcher);
