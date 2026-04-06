
/**
 * Custom Web Component representing a game card for towers or enemies.
 * Displays an image and a tooltip with detailed statistics.
 *
 * @extends HTMLElement
 */
export class GameCard extends HTMLElement {
  constructor() {
    super();
  }

  /**
   * Lifecycle callback called when the element is appended to the DOM.
   * Renders the card content based on attributes.
   */
  connectedCallback() {
    const name = this.getAttribute('name') || 'Unknown';
    const imageSrc = this.getAttribute('image') || '';
    const description = this.getAttribute('description') || '';

    const statsRaw = this.getAttribute('stats') || '{}';
    const stats = JSON.parse(statsRaw);

    const statsHtml = Object.entries(stats)
      .map(([key, value]) => `<li>${key}: ${value}</li>`)
      .join('');

    this.innerHTML = `
            <div class="grid-card">
                <img src="${imageSrc}" alt="${name}">
                <div class="grid-tooltip">
                    <h3>${name}</h3>
                    <p>${description}</p>
                    <hr>
                    <ul>
                        ${statsHtml}
                    </ul>
                </div>
            </div>
        `;
  }
}

customElements.define('game-card', GameCard);
