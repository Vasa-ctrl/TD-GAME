import { Tower } from '../models/Tower.js';
import { Enemy } from '../models/Enemy.js';
import { assets } from '../config/GameAssets.js';

export class Map {
  constructor(gridWidth, gridHeight) {
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.levelData = null;
    this.isLoaded = false;

    // Herní objekty
    this.towers = [];
    this.enemies = [];
    this.projectiles = [];

    // Cesta pro nepřátele
    this.path = [];
  }

  async loadLevel(levelUrl) {
    try {
      const response = await fetch(levelUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      this.levelData = await response.json();

      // Najdeme cestu
      this.findPath();

      this.isLoaded = true;

      // Vyčistíme objekty
      this.towers = [];
      this.enemies = [];
      this.projectiles = [];

      console.log("Level načten, cesta nalezena:", this.path);
    } catch (error) {
      console.error("Chyba při načítání levelu:", error);
    }
  }

  /**
   * Najde cestu v mřížce (hledá sousední '1').
   */
  findPath() {
    this.path = [];
    const grid = this.levelData.grid;
    let current = null;

    // 1. Najdeme start (první '1' na okraji)
    for (let y = 0; y < this.gridHeight; y++) {
      if (grid[y][0] === 1) {
        current = { x: 0, y: y };
        break;
      }
    }

    if (!current) {
      for (let x = 0; x < this.gridWidth; x++) {
        if (grid[0][x] === 1) {
          current = { x: x, y: 0 };
          break;
        }
      }
    }

    if (!current) {
      console.error("Start cesty nenalezen!");
      return;
    }

    // 2. Procházíme cestu
    const visited = new Set();

    while (current) {
      this.path.push(current);
      visited.add(`${current.x},${current.y}`);

      const neighbors = [
        { x: current.x + 1, y: current.y }, // Vpravo
        { x: current.x, y: current.y + 1 }, // Dolů
        { x: current.x - 1, y: current.y }, // Vlevo
        { x: current.x, y: current.y - 1 }  // Nahoru
      ];

      let next = null;
      for (const n of neighbors) {
        if (n.x >= 0 && n.x < this.gridWidth && n.y >= 0 && n.y < this.gridHeight) {
          if (grid[n.y][n.x] === 1 && !visited.has(`${n.x},${n.y}`)) {
            next = n;
            break;
          }
        }
      }

      current = next;
    }
  }

  isBuildable(x, y) {
    if (x < 0 || x >= this.gridWidth || y < 0 || y >= this.gridHeight) return false;
    if (this.levelData.grid[y][x] !== 0) return false;
    const existingTower = this.towers.find(t => t.x === x && t.y === y);
    if (existingTower) return false;
    return true;
  }

  addTower(type, x, y) {
    const tower = new Tower(type, x, y);
    this.towers.push(tower);
  }

  spawnEnemy(type) {
    if (this.path.length === 0) return;
    const enemy = new Enemy(type, this.path);
    this.enemies.push(enemy);
  }

  update(gameSpeed) {
    let moneyEarned = 0;
    let damageTaken = 0; // OPRAVA: Přidáno počítadlo zranění

    // Aktualizace věží
    this.towers.forEach(tower => tower.update(this.enemies, this.projectiles, gameSpeed));

    // Aktualizace nepřátel
    this.enemies.forEach(enemy => {
      enemy.update(gameSpeed);

      // OPRAVA LOGIKY: Pokud je označen ke smazání, ALE neumírá a ještě nedal damage, znamená to, že prošel!
      if (enemy.markedForDeletion && !enemy.isDying && !enemy.damageDealt) {
        damageTaken += 1; // Každý nepřítel ubere 1 život (můžeš změnit podle typu nepřítele)
        enemy.damageDealt = true; // Pojistka, abychom neubrali víckrát
      }

      // Kontrola, zda nepřítel zemřel (HP <= 0) a ještě jsme nedostali odměnu
      if (enemy.isDying && !enemy.rewardClaimed) {
        moneyEarned += enemy.reward;
        enemy.rewardClaimed = true;
      }
    });

    // Odstranění mrtvých nepřátel a těch, co prošli
    this.enemies = this.enemies.filter(e => !e.markedForDeletion);

    // Aktualizace střel
    this.projectiles.forEach(proj => proj.update(gameSpeed));
    this.projectiles = this.projectiles.filter(p => !p.markedForDeletion);

    // OPRAVA: Vracíme objekt pro Game.js
    return { moneyEarned, damageTaken };
  }

  draw(ctx, tileSize) {
    if (!this.isLoaded) return;

    // 1. Vykreslení dlaždic (textury)
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        if (this.levelData.grid[y] && this.levelData.grid[y][x] !== undefined) {
          const tileType = this.levelData.grid[y][x];
          let texture;

          // Logika pro výběr textury
          if (tileType === 0) {
            const number = Math.abs(((x * 7 - y ** 8)*2 + (y * 13)-1)*5) % 3;
            if (number === 0) texture = assets.tiles.solid1;
            else if (number === 1) texture = assets.tiles.solid2;
            else texture = assets.tiles.solid3;
          } else {
            texture = assets.tiles.path;
          }

          if (texture && texture.complete) {
            ctx.drawImage(texture, x * tileSize, y * tileSize, tileSize, tileSize);

            // Černé okraje
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.lineWidth = 4;
            if (y > 0 && this.levelData.grid[y - 1][x] !== tileType)
              this.strokeLine(ctx, x * tileSize, y * tileSize, (x + 1) * tileSize, y * tileSize);
            if (y < this.gridHeight - 1 && this.levelData.grid[y + 1][x] !== tileType)
              this.strokeLine(ctx, x * tileSize, (y + 1) * tileSize, (x + 1) * tileSize, (y + 1) * tileSize);
            if (x > 0 && this.levelData.grid[y][x - 1] !== tileType)
              this.strokeLine(ctx, x * tileSize, y * tileSize, x * tileSize, (y + 1) * tileSize);
            if (x < this.gridWidth - 1 && this.levelData.grid[y][x + 1] !== tileType)
              this.strokeLine(ctx, (x + 1) * tileSize, y * tileSize, (x + 1) * tileSize, (y + 1) * tileSize);
          } else {
            // Fallback barva, pokud se textura ještě nenačetla
            ctx.fillStyle = (tileType === 1) ? "#5a4a3a" : "#3a546d";
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
          }
        }
      }
    }

    // 2. Mřížka (jemná pomocná)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= this.gridWidth; x++) {
      ctx.moveTo(x * tileSize, 0);
      ctx.lineTo(x * tileSize, this.gridHeight * tileSize);
    }
    for (let y = 0; y <= this.gridHeight; y++) {
      ctx.moveTo(0, y * tileSize);
      ctx.lineTo(this.gridWidth * tileSize, y * tileSize);
    }
    ctx.stroke();

    // 3. Věže
    this.towers.forEach(tower => tower.draw(ctx, tileSize));

    // 4. Nepřátelé
    this.enemies.forEach(enemy => enemy.draw(ctx, tileSize));

    // 5. Střely
    this.projectiles.forEach(proj => proj.draw(ctx, tileSize));
  }

  strokeLine(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}
