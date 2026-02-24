import { Map } from '../map/Map.js';
import { DragDrop } from '../ui/DragDrop.js';
import { TowerStats } from '../config/towersConfig.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Vytvoříme instanci naší nové třídy Map
        this.map = new Map(20, 12);

        this.aspectRatio = this.map.gridWidth / this.map.gridHeight;
        this.tileSize = 0;

        // Herní stav
        this.lives = 20;
        this.money = 1000;
        this.wave = 1;

        // UI elementy
        this.uiLives = document.getElementById('ui-lives');
        this.uiMoney = document.getElementById('ui-money');
        this.uiWave = document.getElementById('ui-wave');

        // Inicializace Drag & Drop
        this.dragDrop = new DragDrop(this, this.canvas);

        window.addEventListener('resize', () => this.resize());
    }

    async start(levelUrl) {
        // Delegujeme načítání na mapu
        await this.map.loadLevel(levelUrl);

        // Načteme počáteční peníze z levelu, pokud jsou definovány
        if (this.map.levelData && this.map.levelData.startingMoney) {
            this.money = this.map.levelData.startingMoney;
        }

        this.updateUI();
        this.resize();
        this.animate();
    }

    updateUI() {
        if (this.uiLives) this.uiLives.textContent = `Lives: ${this.lives}`;
        if (this.uiMoney) this.uiMoney.textContent = `Money: ${this.money}`;
        if (this.uiWave) this.uiWave.textContent = `Wave: ${this.wave}`;
    }

    /**
     * Pokusí se postavit věž na daných souřadnicích.
     * @param {string} type Typ věže (klíč z TowerStats).
     * @param {number} x X souřadnice v mřížce.
     * @param {number} y Y souřadnice v mřížce.
     */
    buildTower(type, x, y) {
        const towerConfig = TowerStats[type];

        if (!towerConfig) {
            console.error(`Neznámý typ věže: ${type}`);
            return;
        }

        // 1. Kontrola peněz
        if (this.money < towerConfig.price) {
            console.log("Nedostatek peněz!");
            return;
        }
        if (!this.map.isBuildable(x, y)) {
            console.log("Zde nelze stavět!");
            return;
        }
        console.log(`Stavím věž ${towerConfig.name} na [${x}, ${y}]`);
        this.money -= towerConfig.price;
        this.map.addTower(type, x, y); // Přidáme věž do mapy
        this.updateUI();
    }

    resize() {
        const container = this.canvas.parentElement;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        let newWidth = containerWidth;
        let newHeight = newWidth / this.aspectRatio;

        if (newHeight > containerHeight) {
            newHeight = containerHeight;
            newWidth = newHeight * this.aspectRatio;
        }

        this.canvas.width = newWidth;
        this.canvas.height = newHeight;
        this.tileSize = this.canvas.width / this.map.gridWidth;
    }

    animate() {
        if (!this.map.isLoaded) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Vykreslíme celou mapu (dlaždice + věže)
        this.map.draw(this.ctx, this.tileSize);

        requestAnimationFrame(() => this.animate());
    }
}
