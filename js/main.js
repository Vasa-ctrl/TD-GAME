// Soubor: js/main.js
import { Game } from './core/Game.js';
import { renderEnemyPreview } from './ui/EnemyPreview.js';
import { renderTowerPreview } from './ui/TowerPreview.js';

window.addEventListener('load', () => {
    const canvas = document.getElementById('gameCanvas');
    const mainMenu = document.getElementById('main-menu');
    const startButton = document.getElementById('start-game-btn');
    const gameUI = document.getElementById('game-ui');

    // Vygenerujeme UI pro nepřátele a věže z konfigurace
    renderEnemyPreview();
    renderTowerPreview();

    if (canvas && mainMenu && startButton && gameUI) {
        // Vytvoříme instanci hry, ale zatím ji nespouštíme.
        const game = new Game(canvas);

        // Přidáme posluchač na tlačítko Start.
        startButton.addEventListener('click', () => {
            // Skryjeme menu.
            mainMenu.classList.add('hidden');
            // Zobrazíme herní UI.
            gameUI.classList.remove('hidden');

            // Až teď spustíme hru načtením levelu.
            game.start('assets/levels/level1.json');
        });

    } else {
        console.error('Některý z klíčových HTML prvků chybí (canvas, main-menu, start-game-btn, game-ui)!');
    }
});
