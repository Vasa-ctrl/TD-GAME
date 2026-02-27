import { Map } from '../map/Map.js';
import { DragDrop } from '../ui/DragDrop.js';
import { WaveManager } from './WaveManager.js';
// OPRAVA 1: Přidán chybějící import TowerStats z GameAssets
import { TowerStats } from '../config/GameAssets.js';

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
    this.gameSpeed = 1; // Výchozí rychlost hry

    // UI elementy
    this.uiLives = document.getElementById('ui-lives');
    this.uiMoney = document.getElementById('ui-money');
    this.uiWave = document.getElementById('ui-wave');

    this.setupUI();

    // Inicializace Drag & Drop
    this.dragDrop = new DragDrop(this, this.canvas);

    // Manažer vln
    this.waveManager = new WaveManager(this);

    // Časování
    this.lastTime = 0;

    window.addEventListener('resize', () => this.resize());
  }

  setupUI() {
    // Tlačítko pro start vlny
    const waveBtn = document.getElementById('wave-control-btn');
    if (waveBtn) {
      waveBtn.addEventListener('click', () => {
        this.waveManager.startNextWave();
      });
    }

    // Tlačítka pro rychlost
    const speedBtns = document.querySelectorAll('.speed-btn');
    speedBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Odstraníme aktivní třídu ze všech
        speedBtns.forEach(b => b.classList.remove('active'));
        // Přidáme aktivní třídu kliknutému
        e.target.classList.add('active');

        // Nastavíme rychlost (1x nebo 2x)
        const speedText = e.target.textContent;
        this.gameSpeed = parseInt(speedText);
        console.log(`Rychlost hry nastavena na: ${this.gameSpeed}x`);
      });
    });
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

    // Spustíme smyčku s časovým razítkem
    requestAnimationFrame((timestamp) => this.animate(timestamp));
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
    // Nyní již TowerStats existuje díky importu nahoře
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

    // 2. Kontrola, zda je místo validní (pomocí Mapy)
    if (!this.map.isBuildable(x, y)) {
      console.log("Zde nelze stavět!");
      return;
    }

    // Vše OK -> Stavíme
    console.log(`Stavím věž ${towerConfig.name} na [${x}, ${y}]`);

    this.money -= towerConfig.price;
    this.map.addTower(type, x, y); // Přidáme věž do mapy
    this.updateUI();
  }

  takeDamage(amount) {
    this.lives = Math.max(0, this.lives - amount);
    this.updateUI();

    // Zde bys mohl přidat i kontrolu, zda hra neskončila (Game Over)
    if (this.lives === 0) {
      console.log("Game Over!");
    }
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

  animate(timestamp) {
    if (!this.map.isLoaded) return;

    // OPRAVA 3: Inicializace lastTime pro první frame, zamezí velkému skoku
    if (!this.lastTime) this.lastTime = timestamp;

    // Výpočet deltaTime (v ms)
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;

    // 1. Aktualizace logiky
    // Předáváme gameSpeed do manažera vln i do mapy
    this.waveManager.update(deltaTime, this.gameSpeed);

    // OPRAVA 2: Flexibilní zpracování návratové hodnoty z mapy
    const updateResult = this.map.update(this.gameSpeed);

    let moneyEarned = 0;
    let damageTaken = 0;

    // Pokud mapa vrací jen číslo (tvůj původní Map.js kód z dřívějška)
    if (typeof updateResult === 'number') {
      moneyEarned = updateResult;
    }
    // Pokud mapa vrací objekt { moneyEarned, damageTaken }
    else if (updateResult) {
      moneyEarned = updateResult.moneyEarned || 0;
      damageTaken = updateResult.damageTaken || 0;
    }

    if (damageTaken > 0) this.takeDamage(damageTaken);

    if (moneyEarned > 0) {
      this.money += moneyEarned;
      this.updateUI();
    }

    // 2. Vykreslení
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.map.draw(this.ctx, this.tileSize);

    requestAnimationFrame((ts) => this.animate(ts));
  }
}
