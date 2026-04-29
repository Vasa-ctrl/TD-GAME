import { EnemyStats } from '../config/GameAssets.js';
import './GameCard.js';

/**
 * Renders the enemy preview sidebar area.
 * Iterates through the available enemy statistics from the configuration
 * and dynamically creates a custom `<game-card>` web component for each enemy type.
 * These cards are then appended to the preview container to display
 * their stats (Health, Speed, Reward) and lore to the player.
 *
 * @returns {void}
 */
export function renderEnemyPreview() {
  const container = document.getElementById('enemies-preview');
  if (!container) return;

  /** Clear the container before re-rendering */
  container.innerHTML = '';

  Object.values(EnemyStats).forEach(enemy => {
    /** Create the custom web component */
    const card = document.createElement('game-card');

    /** Pass display data via HTML attributes */
    card.setAttribute('name', enemy.name);
    card.setAttribute('image', enemy.image.src);
    card.setAttribute('description', enemy.description);

    /** Serialize relevant enemy statistics into a JSON string */
    const stats = {
      Health: enemy.hp,
      Speed: enemy.speed,
      Reward: enemy.reward
    };
    card.setAttribute('stats', JSON.stringify(stats));

    container.appendChild(card);
  });
}
