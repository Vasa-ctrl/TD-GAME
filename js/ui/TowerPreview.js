import { TowerStats } from '../config/GameAssets.js'; // Zkontroluj si správný název souboru!

export function renderTowerPreview() {
  const container = document.getElementById('towers-preview');
  if (!container) {
    console.error('Kontejner #towers-preview nebyl nalezen!');
    return;
  }

  container.innerHTML = '';

  for (const key in TowerStats) {
    const tower = TowerStats[key];

    const card = document.createElement('div');
    card.className = 'grid-card';

    card.draggable = true;

    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', key);
      e.dataTransfer.effectAllowed = 'copy';
    });

    // OPRAVA: Přidáno ".src", protože tower.image je nyní objekt Image
    const img = document.createElement('img');
    img.src = tower.image.src;
    img.alt = tower.name;
    card.appendChild(img);

    const tooltip = document.createElement('div');
    tooltip.className = 'grid-tooltip';

    tooltip.innerHTML = `
            <h3>${tower.name}</h3>
            <p>${tower.description}</p>
            <hr>
            <ul>
                <li>Price: ${tower.price}</li>
                <li>Damage: ${tower.damage}</li>
                <li>Range: ${tower.range}</li>
            </ul>
        `;

    card.appendChild(tooltip);
    container.appendChild(card);
  }
}
