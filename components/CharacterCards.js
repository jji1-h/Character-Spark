import { dataService } from '../main.js';

class CharacterCards extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.sparkData = {
      job: '?', personality: '?', appearance: '?', twist: '?'
    };
    this.flippedStates = {
      job: false, personality: false, appearance: false, twist: false
    };
  }

  connectedCallback() {
    this.render();
  }

  async flipCard(category) {
    const card = this.shadowRoot.querySelector(`.card[data-cat="${category}"]`);
    const back = card.querySelector('.back');
    
    // Toggle flip or refresh on already flipped
    if (this.flippedStates[category]) {
      card.classList.remove('is-flipped');
      await new Promise(r => setTimeout(r, 300));
    }

    // Get new data for this specific category
    this.sparkData[category] = dataService.getRandomKeyword(category);
    back.textContent = this.sparkData[category];
    
    card.classList.add('is-flipped');
    this.flippedStates[category] = true;

    this.checkCompletion();
  }

  checkCompletion() {
    const allFlipped = Object.values(this.flippedStates).every(v => v === true);
    if (allFlipped) {
      // Create a snapshot for saving
      this.currentSpark = {
        id: Date.now(),
        genres: Array.from(dataService.selectedGenres),
        ...this.sparkData,
        timestamp: new Date().toISOString(),
        colors: dataService.generatePalette() // Keep palette for stored data consistency
      };
      window.dispatchEvent(new CustomEvent('spark-complete', { detail: this.currentSpark }));
    }
  }

  saveCurrent() {
    if (this.currentSpark) {
      dataService.saveSpark(this.currentSpark);
      window.dispatchEvent(new CustomEvent('spark-saved'));
    }
  }

  render() {
    const categories = [
      { id: 'job', label: 'JOB', icon: '👤' },
      { id: 'personality', label: 'PERSON', icon: '🧠' },
      { id: 'appearance', label: 'LOOK', icon: '✨' },
      { id: 'twist', label: 'TWIST', icon: '🔥' }
    ];

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; width: 100%; }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 2rem;
          perspective: 1500px;
        }
        .card-scene {
          height: 300px;
          cursor: pointer;
        }
        .card {
          width: 100%;
          height: 100%;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
          position: relative;
        }
        .card.is-flipped {
          transform: rotateY(180deg);
        }
        .face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 2rem;
          border: 2px solid oklch(30% 0.04 250);
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.6);
          transition: border-color 0.3s;
        }
        .card:hover .face {
          border-color: var(--accent-color);
        }
        .front {
          background: linear-gradient(145deg, oklch(25% 0.03 250), oklch(20% 0.02 250));
          color: oklch(70% 0.05 250);
        }
        .back {
          background: oklch(95% 0.01 250);
          color: oklch(15% 0.02 250);
          transform: rotateY(180deg);
          padding: 2rem;
          text-align: center;
          font-weight: 900;
          font-size: 1.4rem;
          border: none;
          line-height: 1.3;
        }
        .icon { font-size: 3rem; margin-bottom: 1.5rem; opacity: 0.8; filter: drop-shadow(0 0 10px var(--accent-glow)); }
        .cat-label { font-weight: 900; letter-spacing: 0.3em; font-size: 0.85rem; opacity: 0.7; }
        
        .hint {
          text-align: center;
          margin-top: 2.5rem;
          font-size: 0.9rem;
          color: oklch(60% 0.05 250);
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }
      </style>
      <div class="grid">
        ${categories.map(cat => `
          <div class="card-scene" data-id="${cat.id}">
            <div class="card" data-cat="${cat.id}">
              <div class="face front">
                <div class="icon">${cat.icon}</div>
                <div class="cat-label">${cat.label}</div>
              </div>
              <div class="face back">?</div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="hint">Tap individual cards to reveal your character spark</div>
    `;

    this.shadowRoot.querySelectorAll('.card-scene').forEach(scene => {
      scene.addEventListener('click', () => {
        this.flipCard(scene.dataset.id);
      });
    });
  }
}

customElements.define('character-cards', CharacterCards);
