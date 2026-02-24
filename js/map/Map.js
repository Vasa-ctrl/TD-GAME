// Soubor: js/map/Map.js

import { Tower } from '../models/Tower.js';
import { Assets } from '../core/GameAssets.js'; // Nutné pro textury (solid1, solid2, path...)

export class Map {
  constructor(gridWidth, gridHeight) {
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.levelData = null;
    this.isLoaded = false;

    // Seznam postavených věží
    this.towers = [];
  }

  async loadLevel(levelUrl) {
    try {
      const response = await fetch(levelUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      this.levelData = await response.json();
      this.isLoaded = true;

      // Vyčistíme věže při načtení nového levelu
      this.towers = [];
      console.log("Level načten, grid:", this.levelData.grid);
    } catch (error) {
      console.error("Chyba při načítání levelu:", error);
    }
  }

  /**
   * Zkontroluje, zda je možné na dané pozici postavit věž.
   */
  isBuildable(x, y) {
    // 1. Je souřadnice uvnitř mapy?
    if (x < 0 || x >= this.gridWidth || y < 0 || y >= this.gridHeight) return false;

    // 2. Je to 'solid' dlaždice (hodnota 0)?
    if (this.levelData.grid[y][x] !== 0) return false;

    // 3. Je tam už jiná věž?
    const existingTower = this.towers.find(t => t.x === x && t.y === y);
    if (existingTower) return false;

    return true;
  }
  updateTowers(deltaTime, enemies, tileSize) {
    for (let tower of this.towers) {
      tower.update(deltaTime, enemies, tileSize);
    }
  }
  addTower(type, x, y) {
    const tower = new Tower(type, x, y);
    this.towers.push(tower);
  }

  draw(ctx, tileSize) {
    if (!this.isLoaded) return;

    // 1. VYKRESLENÍ TEXTUR A ČERNÝCH OKRAJŮ
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {

        // Ochrana proti chybějícím datům v gridu
        if (this.levelData.grid[y] && this.levelData.grid[y][x] !== undefined) {
          const tileType = this.levelData.grid[y][x];
          let texture;

          // Tvoje pseudo-náhodná logika
          if (tileType === 0) {
            const number = Math.abs(((x * 7 - y ** 8)*2 + (y * 13)-1)*5) % 3;
            if (number === 0) texture = Assets.tiles.solid1;
            else if (number === 1) texture = Assets.tiles.solid2;
            else texture = Assets.tiles.solid3;
          } else {
            texture = Assets.tiles.path;
          }

          if (texture) {
            ctx.drawImage(texture, x * tileSize, y * tileSize, tileSize, tileSize);

            // Tvoje super logika na černé okraje
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 4;
            if (y === 0 || this.levelData.grid[y - 1][x] !== tileType)
              this.strokeLine(ctx, x * tileSize, y * tileSize, (x + 1) * tileSize, y * tileSize);
            if (y === this.gridHeight - 1 || this.levelData.grid[y + 1][x] !== tileType)
              this.strokeLine(ctx, x * tileSize, (y + 1) * tileSize, (x + 1) * tileSize, (y + 1) * tileSize);
            if (x === 0 || this.levelData.grid[y][x - 1] !== tileType)
              this.strokeLine(ctx, x * tileSize, y * tileSize, x * tileSize, (y + 1) * tileSize);
            if (x === this.gridWidth - 1 || this.levelData.grid[y][x + 1] !== tileType)
              this.strokeLine(ctx, (x + 1) * tileSize, y * tileSize, (x + 1) * tileSize, (y + 1) * tileSize);
          }
        }
      }
    }

    // 2. VYKRESLENÍ POMOCNÉ STAVEBNÍ MŘÍŽKY (optimalizováno)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.01)';
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

    // 3. VYKRESLENÍ VĚŽÍ (musí být na konci, aby ležely na trávě)
    this.towers.forEach(tower => tower.draw(ctx, tileSize));
  }

  // Pomocná metoda pro kreslení čar
  strokeLine(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}
