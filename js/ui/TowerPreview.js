import { TowerStats } from '../config/towersConfig.js';

/**
 * Vygeneruje náhledy věží v pravém bočním panelu na základě konfigurace.
 */
export function renderTowerPreview() {
    const container = document.getElementById('towers-preview');
    if (!container) {
        console.error('Kontejner #towers-preview nebyl nalezen!');
        return;
    }

    // Vyčistíme kontejner
    container.innerHTML = '';

    // Projdeme všechny věže v konfiguraci
    for (const key in TowerStats) {
        const tower = TowerStats[key];

        // Vytvoříme kartu
        const card = document.createElement('div');
        card.className = 'grid-card';

        // --- DRAG & DROP: Nastavení ---
        card.draggable = true; // Povolíme přetahování

        // Event listener pro začátek tažení
        card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', key);
            e.dataTransfer.effectAllowed = 'copy';
        });

        // Vytvoříme obrázek
        const img = document.createElement('img');
        img.src = tower.image;
        img.alt = tower.name;
        card.appendChild(img);

        // Vytvoříme tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'grid-tooltip';

        // Obsah tooltipu
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

        // Přidáme kartu do kontejneru
        container.appendChild(card);
    }
}
