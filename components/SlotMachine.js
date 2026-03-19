import { dataService } from '../main.js';

class KeywordSlot extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentValue = '?';
    this.category = this.getAttribute('category') || 'job';
  }

  connectedCallback() {
    this.render();
  }

  async spin(targetValue) {
    const el = this.shadowRoot.querySelector('.slot-content');
    el.classList.add('spinning');
    
    // Simulate spinning delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    this.currentValue = targetValue;
    el.textContent = this.currentValue;
    el.classList.remove('spinning');
  }

  render() {
    const labels = {
      job: '직업',
      personality: '성격',
      appearance: '외양',
      twist: '반전'
    };

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          flex: 1;
          min-width: 150px;
        }
        .slot-container {
          background: oklch(20% 0.03 250);
          border: 2px solid oklch(35% 0.04 250);
          border-radius: 1rem;
          padding: 1.5rem 1rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          box-shadow: inset 0 0 15px black;
        }
        .label {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: oklch(60% 0.05 250);
          margin-bottom: 0.5rem;
          font-weight: 700;
          letter-spacing: 0.1em;
        }
        .slot-content {
          font-size: 1.25rem;
          font-weight: 800;
          color: oklch(90% 0.1 250);
          height: 1.5em;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .spinning {
          animation: blur-spin 0.1s infinite linear;
          opacity: 0.5;
        }
        @keyframes blur-spin {
          0% { transform: translateY(-5px); filter: blur(2px); }
          50% { transform: translateY(5px); filter: blur(4px); }
          100% { transform: translateY(-5px); filter: blur(2px); }
        }
      </style>
      <div class="slot-container">
        <div class="label">${labels[this.category]}</div>
        <div class="slot-content">${this.currentValue}</div>
      </div>
    `;
  }
}

customElements.define('keyword-slot', KeywordSlot);

class SlotMachine extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentSpark = null;
  }

  connectedCallback() {
    this.render();
  }

  async spin() {
    this.currentSpark = dataService.generateCombination();
    
    const slots = this.shadowRoot.querySelectorAll('keyword-slot');
    const categories = ['job', 'personality', 'appearance', 'twist'];
    
    // Trigger spin for all slots in parallel with slight offsets
    const spinPromises = Array.from(slots).map((slot, i) => {
      return slot.spin(this.currentSpark[categories[i]]);
    });

    await Promise.all(spinPromises);
    
    // Notify moodboard and other UI
    window.dispatchEvent(new CustomEvent('spark-complete', { detail: this.currentSpark }));
  }

  saveCurrent() {
    if (this.currentSpark) {
      dataService.saveSpark(this.currentSpark);
      window.dispatchEvent(new CustomEvent('spark-saved'));
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .machine-container {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
          background: oklch(18% 0.02 250);
          padding: 1rem;
          border-radius: 1.5rem;
          border: 1px solid oklch(30% 0.04 250);
        }
      </style>
      <div class="machine-container">
        <keyword-slot category="job"></keyword-slot>
        <keyword-slot category="personality"></keyword-slot>
        <keyword-slot category="appearance"></keyword-slot>
        <keyword-slot category="twist"></keyword-slot>
      </div>
    `;
  }
}

customElements.define('character-slot-machine', SlotMachine);
