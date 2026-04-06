import { TowerStats } from '../config/GameAssets.js';
import './GameCard.js';

/**
 * Renders the tower selection sidebar/preview area by iterating through available
 * tower statistics and creating draggable 'game-card' custom elements for each tower type.
 * @returns {void}
 */
export function renderTowerPreview() {
  const container = document.getElementById('towers-preview');
  if (!container) return;
  container.innerHTML = '';

  Object.entries(TowerStats).forEach(([key, tower]) => {
    const card = document.createElement('game-card');
    card.setAttribute('name', tower.name);
    card.setAttribute('image', tower.image.src);
    card.setAttribute('description', tower.description);
    card.setAttribute('stats', JSON.stringify({ Price: tower.price, Damage: tower.damage, Range: tower.range }));

    card.draggable = true;
    card.ondragstart = (e) => e.dataTransfer.setData('text/plain', key);

    container.appendChild(card);
  });
}
