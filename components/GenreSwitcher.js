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
        .switcher {
          display: flex;
          gap: 0.5rem;
          background: oklch(25% 0.03 250);
          padding: 0.4rem;
          border-radius: 1.2rem;
          border: 1px solid oklch(35% 0.04 250);
          overflow-x: auto;
        }
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
        }
        button.active {
          background: oklch(80% 0.1 250);
          color: oklch(15% 0.02 250);
        }
      </style>
      <div class="switcher">
        ${genres.map(([key, pack]) => `
          <button class="${key === dataService.currentGenre ? 'active' : ''}" data-genre="${key}">
            ${pack.label}
          </button>
        `).join('')}
      </div>
    `;

    this.shadowRoot.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const genre = e.target.dataset.genre;
        dataService.setGenre(genre);
        this.render();
        // Notify other components
        window.dispatchEvent(new CustomEvent('genre-changed', { detail: genre }));
      });
    });
  }
}

customElements.define('genre-switcher', GenreSwitcher);
