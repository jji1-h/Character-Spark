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
    
    if (this.flippedStates[category]) {
      card.classList.remove('is-flipped');
      await new Promise(r => setTimeout(r, 300));
    }

    this.sparkData[category] = dataService.getRandomKeyword(category);
    back.innerHTML = `
      <div class="result-text">${this.sparkData[category]}</div>
      <div class="card-footer">${category.toUpperCase()}</div>
    `;
    
    card.classList.add('is-flipped');
    this.flippedStates[category] = true;

    this.checkCompletion();
  }

  checkCompletion() {
    const allFlipped = Object.values(this.flippedStates).every(v => v === true);
    if (allFlipped) {
      this.currentSpark = {
        id: Date.now(),
        genres: Array.from(dataService.selectedGenres),
        ...this.sparkData,
        timestamp: new Date().toISOString(),
        colors: dataService.generatePalette()
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
      { id: 'job', label: 'JOB', icon: '✦' },
      { id: 'personality', label: 'SOUL', icon: '✧' },
      { id: 'appearance', label: 'FORM', icon: '❂' },
      { id: 'twist', label: 'FATE', icon: '✵' }
    ];

    this.shadowRoot.innerHTML = `
      <style>
        :host { 
          display: block; 
          width: 100%; 
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          perspective: 2000px;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }
        @media (max-width: 1000px) {
          .grid {
            grid-template-columns: repeat(2, 2fr);
            gap: 1.5rem;
          }
        }
        .card-scene {
          aspect-ratio: 2/3.2;
          cursor: pointer;
        }
        .card {
          width: 100%;
          height: 100%;
          transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
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
          border-radius: 1.2rem;
          border: 2px solid #FFD700;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          overflow: hidden;
          /* Ensure same size by using box-sizing and explicit dimensions if needed */
          box-sizing: border-box;
        }
        .front {
          background: linear-gradient(135deg, #25163F, #3B167C);
          color: #FFD700;
        }
        .back {
          background: #FFFFFF;
          color: #25163F;
          transform: rotateY(180deg);
          padding: 1.5rem;
          text-align: center;
        }
        .result-text {
          font-weight: 800;
          font-size: clamp(1.1rem, 2vw, 1.4rem);
          line-height: 1.4;
          word-break: keep-all;
        }
        .card-footer {
          position: absolute;
          bottom: 1.5rem;
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          font-weight: 700;
          opacity: 0.5;
        }
        .icon { font-size: 3.5rem; margin-bottom: 1.5rem; }
        .cat-label { font-weight: 800; letter-spacing: 0.3em; font-size: 0.8rem; }
        
        .hint {
          text-align: center;
          margin-top: 3rem;
          font-size: 0.9rem;
          color: #FFD700;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-weight: 700;
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
              <div class="face back" data-cat="${cat.id}">
                <div class="result-text">?</div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="hint">Click each card to reveal your character spark</div>
    `;

    this.shadowRoot.querySelectorAll('.card-scene').forEach(scene => {
      scene.addEventListener('click', () => {
        this.flipCard(scene.dataset.id);
      });
    });
  }
}

customElements.define('character-cards', CharacterCards);
