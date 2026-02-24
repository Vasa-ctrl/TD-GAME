import { EnemyStats } from '../config/enemiesConfig.js';

/**
 * Vygeneruje náhledy nepřátel v levém bočním panelu na základě konfigurace.
 */
export function renderEnemyPreview() {
    const container = document.getElementById('enemies-preview');
    if (!container) {
        console.error('Kontejner #enemies-preview nebyl nalezen!');
        return;
    }

    // Vyčistíme kontejner (pro jistotu)
    container.innerHTML = '';

    // Projdeme všechny nepřátele v konfiguraci
    for (const key in EnemyStats) {
        const enemy = EnemyStats[key];

        // Vytvoříme kartu
        const card = document.createElement('div');
        card.className = 'grid-card';

        // Vytvoříme obrázek
        const img = document.createElement('img');
        img.src = enemy.image;
        img.alt = enemy.name;
        card.appendChild(img);

        // Vytvoříme tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'grid-tooltip';

        // Obsah tooltipu
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

        // Přidáme kartu do kontejneru
        container.appendChild(card);
    }
}
