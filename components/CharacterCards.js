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

  showModal(message) {
    const modal = this.shadowRoot.getElementById('alert-modal');
    const modalMsg = this.shadowRoot.getElementById('modal-message');
    modalMsg.textContent = message;
    modal.classList.add('show');
  }

  closeModal() {
    this.shadowRoot.getElementById('alert-modal').classList.remove('show');
  }

  async flipCard(category) {
    // 1. Check if at least one genre is selected
    if (dataService.selectedGenres.size === 0) {
      this.showModal("하나 이상의 장르를 선택해 주세요.");
      return;
    }

    // 2. Prevent re-flipping already flipped cards
    if (this.flippedStates[category]) {
      return;
    }

    const card = this.shadowRoot.querySelector(`.card[data-cat="${category}"]`);
    const back = card.querySelector('.back');

    this.sparkData[category] = dataService.getRandomKeyword(category);
    back.innerHTML = `
      <div class="result-text">${this.sparkData[category]}</div>
      <div class="card-footer">${category.toUpperCase()}</div>
    `;
    
    card.classList.add('is-flipped');
    this.flippedStates[category] = true;

    this.checkCompletion();
  }

  async resetAll() {
    const cards = this.shadowRoot.querySelectorAll('.card');
    cards.forEach(card => card.classList.remove('is-flipped'));

    // Wait for unflip animation
    await new Promise(r => setTimeout(r, 600));

    this.sparkData = { job: '?', personality: '?', appearance: '?', twist: '?' };
    this.flippedStates = { job: false, personality: false, appearance: false, twist: false };
    this.currentSpark = null;

    // Dispatch event to disable Save button
    window.dispatchEvent(new CustomEvent('spark-reset'));
    this.render();
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
        
        .footer-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin-top: 3rem;
        }
        .hint {
          font-size: 0.9rem;
          color: #FFD700;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-weight: 700;
        }
        .redraw-btn {
          background: rgba(255, 215, 0, 0.1);
          color: #FFD700;
          border: 1px solid #FFD700;
          padding: 0.6rem 2rem;
          border-radius: 2rem;
          cursor: pointer;
          font-weight: 800;
          letter-spacing: 0.1em;
          transition: all 0.2s;
        }
        .redraw-btn:hover {
          background: #FFD700;
          color: #25163F;
        }

        /* Modal Styles */
        #alert-modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          display: none;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(5px);
        }
        #alert-modal.show { display: flex; }
        .modal-content {
          background: #3B167C;
          border: 2px solid #FFD700;
          padding: 2.5rem;
          border-radius: 2rem;
          text-align: center;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 0 50px rgba(255, 215, 0, 0.3);
        }
        .modal-message {
          color: #FFFFFF;
          font-weight: 700;
          margin-bottom: 2rem;
          font-size: 1.2rem;
        }
        .modal-close {
          background: #FFD700;
          color: #25163F;
          border: none;
          padding: 0.8rem 2rem;
          border-radius: 1rem;
          font-weight: 800;
          cursor: pointer;
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

      <div class="footer-controls">
        <div class="hint">Click each card to reveal your magical fate</div>
        <button class="redraw-btn">다시 뽑기 (RESET)</button>
      </div>

      <div id="alert-modal">
        <div class="modal-content">
          <div class="modal-message" id="modal-message">하나 이상의 장르를 선택해 주세요.</div>
          <button class="modal-close">확인</button>
        </div>
      </div>
    `;

    this.shadowRoot.querySelectorAll('.card-scene').forEach(scene => {
      scene.addEventListener('click', () => {
        this.flipCard(scene.dataset.id);
      });
    });

    this.shadowRoot.querySelector('.redraw-btn').addEventListener('click', () => {
      this.resetAll();
    });

    this.shadowRoot.querySelector('.modal-close').addEventListener('click', () => {
      this.closeModal();
    });
  }
}

customElements.define('character-cards', CharacterCards);
