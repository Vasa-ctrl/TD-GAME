/**
 * Custom Web Component representing a game card for towers or enemies.
 * Displays an interactive card with an image and a hover tooltip containing detailed statistics.
 *
 * Expected HTML attributes:
 * - `name` {string}: The title of the entity.
 * - `image` {string}: The source URL for the entity's image.
 * - `description` {string}: A short lore or description text.
 * - `stats` {string}: A JSON serialized object containing key-value pairs of stats.
 *
 * @extends HTMLElement
 */
export class GameCard extends HTMLElement {
  /**
   * Initializes the custom element.
   * Standard practice requires calling super() first in the constructor of a Web Component.
   */
  constructor() {
    super();
  }

  /**
   * Native Web Component lifecycle callback.
   * Invoked automatically when the custom element is appended to the document's DOM.
   * Retrieves attributes, parses the JSON statistics, and injects the formatted HTML structure.
   * * @returns {void}
   */
  connectedCallback() {
    /** Retrieve basic string attributes with fallback default values */
    const name = this.getAttribute('name') || 'Unknown';
    const imageSrc = this.getAttribute('image') || '';
    const description = this.getAttribute('description') || '';

    /** * Safely retrieve and parse the JSON statistics object.
     * Fallback to an empty JSON object string '{}' if the attribute is missing.
     */
    const statsRaw = this.getAttribute('stats') || '{}';
    const stats = JSON.parse(statsRaw);

    /** Transform the parsed stats object into a concatenated string of HTML list items */
    const statsHtml = Object.entries(stats)
      .map(([key, value]) => `<li>${key}: ${value}</li>`)
      .join('');

    /** * Render the final HTML structure into the component.
     * The internal wrapping <div> uses the 'grid-card' class to seamlessly inherit existing CSS.
     */
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

/**
 * Registers the <game-card> custom element with the browser's CustomElementRegistry.
 * This makes the tag usable in HTML or dynamically via document.createElement('game-card').
 */
customElements.define('game-card', GameCard);
