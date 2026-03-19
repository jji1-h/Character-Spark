import { dataService } from '../main.js';

class SparkShelf extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    window.addEventListener('spark-saved', () => this.render());
  }

  deleteSpark(id) {
    dataService.deleteSpark(id);
    this.render();
  }

  render() {
    const sparks = dataService.getSavedSparks();
    
    this.shadowRoot.innerHTML = `
      <style>
        .shelf {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-top: 1rem;
        }
        .card {
          background: oklch(25% 0.03 250);
          border: 1px solid oklch(35% 0.04 250);
          border-radius: 1.2rem;
          padding: 1.5rem;
          position: relative;
          transition: transform 0.2s;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          box-shadow: 0 10px 30px -10px black;
        }
        .card:hover { transform: translateY(-5px); }
        .delete-btn {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: transparent;
          border: none;
          color: oklch(50% 0.1 20);
          cursor: pointer;
          font-size: 1.2rem;
          padding: 0.5rem;
          line-height: 1;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
          gap: 0.5rem;
        }
        .genre-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem;
        }
        .genre-badge {
          font-size: 0.55rem;
          background: oklch(40% 0.05 250);
          padding: 0.15rem 0.4rem;
          border-radius: 0.3rem;
          text-transform: uppercase;
          color: oklch(90% 0.01 250);
        }
        .mini-palette {
          display: flex;
          gap: 3px;
        }
        .mini-palette div {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .keywords {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .kw {
          font-weight: 700;
          font-size: 1.1rem;
          color: oklch(90% 0.02 250);
        }
        .kw span {
          font-size: 0.7rem;
          color: oklch(60% 0.1 250);
          margin-right: 0.5rem;
        }
        .empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 3rem;
          color: oklch(50% 0.02 250);
          border: 2px dashed oklch(30% 0.02 250);
          border-radius: 1rem;
        }
      </style>
      <div class="shelf">
        ${sparks.length === 0 ? '<div class="empty">보관된 영감이 없습니다. 마음에 드는 조합을 저장해 보세요!</div>' : 
          sparks.map(spark => `
            <div class="card">
              <button class="delete-btn" data-id="${spark.id}">×</button>
              <div class="card-header">
                <div class="genre-badges">
                  ${(spark.genres || [spark.genre]).map(g => `<span class="genre-badge">${g}</span>`).join('')}
                </div>
                <div class="mini-palette">
                  ${spark.colors.map(c => `<div style="background: ${c.oklch}"></div>`).join('')}
                </div>
              </div>
              <div class="keywords">
                <div class="kw"><span>성격</span>${spark.personality}</div>
                <div class="kw"><span>직업</span>${spark.job}</div>
                <div class="kw"><span>외양</span>${spark.appearance}</div>
                <div class="kw"><span>반전</span>${spark.twist}</div>
              </div>
            </div>
          `).join('')
        }
      </div>
    `;

    this.shadowRoot.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.deleteSpark(Number(e.target.dataset.id));
      });
    });
  }
}

customElements.define('my-spark-shelf', SparkShelf);
