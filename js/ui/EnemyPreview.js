import { EnemyStats } from '../config/GameAssets.js';
import './GameCard.js';

/**
 * Renders a preview of all available enemies into the specified container.
 * Iterates through EnemyStats and creates a custom 'game-card' element for each.
 */
export function renderEnemyPreview() {
  const container = document.getElementById('enemies-preview');
  if (!container) return;

  container.innerHTML = '';

  Object.values(EnemyStats).forEach(enemy => {
    const card = document.createElement('game-card');

    card.setAttribute('name', enemy.name);
    card.setAttribute('image', enemy.image.src);
    card.setAttribute('description', enemy.description);

    const stats = { Health: enemy.hp, Speed: enemy.speed, Reward: enemy.reward };
    card.setAttribute('stats', JSON.stringify(stats));

    container.appendChild(card);
  });
}
