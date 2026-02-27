import { EnemyStats } from '../config/GameAssets.js'; // Zkontroluj si správný název souboru!

export function renderEnemyPreview() {
  const container = document.getElementById('enemies-preview');
  if (!container) {
    console.error('Kontejner #enemies-preview nebyl nalezen!');
    return;
  }

  container.innerHTML = '';

  for (const key in EnemyStats) {
    const enemy = EnemyStats[key];

    const card = document.createElement('div');
    card.className = 'grid-card';

    // OPRAVA: Přidáno ".src", protože enemy.image je nyní objekt Image
    const img = document.createElement('img');
    img.src = enemy.image.src;
    img.alt = enemy.name;
    card.appendChild(img);

    const tooltip = document.createElement('div');
    tooltip.className = 'grid-tooltip';

    tooltip.innerHTML = `
            <h3>${enemy.name}</h3>
            <p>${enemy.description}</p>
            <hr>
            <ul>
                <li>Health: ${enemy.hp}</li>
                <li>Speed: ${enemy.speed}</li>
                <li>Reward: ${enemy.reward}</li>
            </ul>
        `;

    card.appendChild(tooltip);
    container.appendChild(card);
  }
}
