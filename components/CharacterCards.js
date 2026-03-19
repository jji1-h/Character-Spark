import { dataService } from '../main.js';

class CharacterCards extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentSpark = null;
    this.isFlipped = false;
  }

  connectedCallback() {
    this.render();
  }

  async flipAll() {
    this.currentSpark = dataService.generateCombination();
    const cards = this.shadowRoot.querySelectorAll('.card');
    
    this.isFlipped = false;
    cards.forEach(card => card.classList.remove('is-flipped'));

    // Wait for unflip animation
    await new Promise(r => setTimeout(r, 300));

    // Update back content
    const categories = ['job', 'personality', 'appearance', 'twist'];
    categories.forEach((cat, i) => {
      this.shadowRoot.querySelector(`.back[data-cat="${cat}"]`).textContent = this.currentSpark[cat];
    });

    // Flip them with sequence
    for (let i = 0; i < cards.length; i++) {
      await new Promise(r => setTimeout(r, 150));
      cards[i].classList.add('is-flipped');
    }

    this.isFlipped = true;
    window.dispatchEvent(new CustomEvent('spark-complete', { detail: this.currentSpark }));
  }

  saveCurrent() {
    if (this.currentSpark && this.isFlipped) {
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
          gap: 1.5rem;
          perspective: 1000px;
          cursor: pointer;
        }
        .card-scene {
          height: 250px;
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
          border-radius: 1.5rem;
          border: 2px solid oklch(35% 0.04 250);
          box-shadow: 0 15px 35px -5px rgba(0,0,0,0.5);
        }
        .front {
          background: oklch(25% 0.03 250);
          color: oklch(70% 0.05 250);
        }
        .back {
          background: oklch(85% 0.1 250);
          color: oklch(15% 0.02 250);
          transform: rotateY(180deg);
          padding: 1.5rem;
          text-align: center;
          font-weight: 800;
          font-size: 1.2rem;
          border: none;
        }
        .icon { font-size: 2.5rem; margin-bottom: 1rem; opacity: 0.5; }
        .cat-label { font-weight: 900; letter-spacing: 0.2em; font-size: 0.8rem; }
        
        .hint {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.8rem;
          color: oklch(60% 0.05 250);
          font-weight: 600;
          letter-spacing: 0.1em;
        }
      </style>
      <div class="grid">
        ${categories.map(cat => `
          <div class="card-scene">
            <div class="card">
              <div class="face front">
                <div class="icon">${cat.icon}</div>
                <div class="cat-label">${cat.label}</div>
              </div>
              <div class="face back" data-cat="${cat.id}">?</div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="hint">CLICK CARDS TO SPARK! (카드를 클릭해 영감을 얻으세요)</div>
    `;

    this.shadowRoot.querySelector('.grid').addEventListener('click', () => {
      this.flipAll();
    });
  }
}

customElements.define('character-cards', CharacterCards);
