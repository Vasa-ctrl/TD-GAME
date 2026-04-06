import { assets, TowerStats, EnemyStats } from '../config/GameAssets.js';

/**
 * Třída Renderer se stará o vykreslování herních prvků na plátno (canvas).
 */
export class Renderer {
    /**
     * @param {HTMLCanvasElement} canvas - Element plátna pro vykreslování.
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    /**
     * Hlavní vykreslovací metoda volaná v každém snímku.
     * @param {Map} map - Instance mapy obsahující všechna data.
     * @param {number} tileSize - Velikost dlaždice v pixelech.
     * @param {boolean} showTowerRanges - Zda vykreslovat dosah věží.
     */
    render(map, tileSize, showTowerRanges) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (!map.isLoaded) return;

        this.drawMapTiles(map, tileSize);
        this.drawGrid(map, tileSize);
        this.drawTowers(map.towers, tileSize, showTowerRanges);
        this.drawEnemies(map.enemies, tileSize);
        this.drawProjectiles(map.projectiles, tileSize);
    }

    /**
     * Vykreslí podkladové dlaždice mapy (cesty a pevné bloky).
     * @param {Map} map - Instance mapy.
     * @param {number} tileSize - Velikost dlaždice.
     */
    drawMapTiles(map, tileSize) {
        const grid = map.levelData.grid;

        for (let y = 0; y < map.gridHeight; y++) {
            for (let x = 0; x < map.gridWidth; x++) {
                if (grid[y] && grid[y][x] !== undefined) {
                    const tileType = grid[y][x];
                    const texture = tileType === 0
                        ? [assets.tiles.solid1, assets.tiles.solid2, assets.tiles.solid3][Math.abs(((x * 7 - y ** 8) * 2 + (y * 13) - 1) * 5) % 3]
                        : assets.tiles.path;

                    if (texture && texture.complete) {
                        this.ctx.drawImage(texture, x * tileSize, y * tileSize, tileSize, tileSize);
                        this.drawTileBorders(map, x, y, tileSize, tileType);
                    } else {
                        this.ctx.fillStyle = (tileType === 1) ? "#5a4a3a" : "#3a546d";
                        this.ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                    }
                }
            }
        }
    }

    /**
     * Vykreslí ohraničení mezi různými typy dlaždic pro lepší vizuální hloubku.
     * @param {Map} map - Instance mapy.
     * @param {number} x - X souřadnice v mřížce.
     * @param {number} y - Y souřadnice v mřížce.
     * @param {number} tileSize - Velikost dlaždice.
     * @param {number} tileType - Typ aktuální dlaždice.
     */
    drawTileBorders(map, x, y, tileSize, tileType) {
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.lineWidth = 4;
        const grid = map.levelData.grid;

        if (y > 0 && grid[y - 1][x] !== tileType)
            this.strokeLine(x * tileSize, y * tileSize, (x + 1) * tileSize, y * tileSize);
        if (y < map.gridHeight - 1 && grid[y + 1][x] !== tileType)
            this.strokeLine(x * tileSize, (y + 1) * tileSize, (x + 1) * tileSize, (y + 1) * tileSize);
        if (x > 0 && grid[y][x - 1] !== tileType)
            this.strokeLine(x * tileSize, y * tileSize, x * tileSize, (y + 1) * tileSize);
        if (x < map.gridWidth - 1 && grid[y][x + 1] !== tileType)
            this.strokeLine((x + 1) * tileSize, y * tileSize, (x + 1) * tileSize, (y + 1) * tileSize);
    }

    /**
     * Vykreslí pomocnou mřížku na pozadí.
     * @param {Map} map - Instance mapy.
     * @param {number} tileSize - Velikost dlaždice.
     */
    drawGrid(map, tileSize) {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        for (let x = 0; x <= map.gridWidth; x++) {
            this.ctx.moveTo(x * tileSize, 0);
            this.ctx.lineTo(x * tileSize, map.gridHeight * tileSize);
        }
        for (let y = 0; y <= map.gridHeight; y++) {
            this.ctx.moveTo(0, y * tileSize);
            this.ctx.lineTo(map.gridWidth * tileSize, y * tileSize);
        }
        this.ctx.stroke();
    }

    /**
     * Vykreslí všechny věže na mapě včetně jejich efektů a dosahu.
     * @param {Array} towers - Pole věží.
     * @param {number} tileSize - Velikost dlaždice.
     * @param {boolean} showRanges - Zda se mají vykreslit kružnice dosahu.
     */
    drawTowers(towers, tileSize, showRanges) {
        towers.forEach(tower => {
            if (tower.image.complete) {
                const centerX = (tower.x + 0.5) * tileSize;
                const centerY = (tower.y + 0.5) * tileSize;
                const currentSize = tileSize * tower.scale;

                this.ctx.save();

                this.ctx.shadowColor = "#7F00FF";
                this.ctx.shadowBlur = tower.scale > 1.0 ? 30 : 10;
                if (tower.scale > 1.0) this.ctx.shadowColor = "#00FFE1";

                this.ctx.drawImage(
                    tower.image,
                    centerX - currentSize / 2, centerY - currentSize / 2, currentSize, currentSize
                );

                this.ctx.restore();

                if (showRanges) {
                    this.ctx.beginPath();
                    this.ctx.arc(centerX, centerY, tower.range * tileSize, 0, Math.PI * 2);
                    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                    this.ctx.fill();
                }
            }
        });
    }

    /**
     * Vykreslí nepřátele, jejich animace smrti a ukazatele zdraví.
     * @param {Array} enemies - Pole nepřátel.
     * @param {number} tileSize - Velikost dlaždice.
     */
    drawEnemies(enemies, tileSize) {
        enemies.forEach(enemy => {
            if (enemy.isDying) {
                if (enemy.bloodImage?.complete) {
                    this.ctx.save();
                    this.ctx.globalAlpha = Math.max(0, enemy.deathTimer / 30);
                    this.ctx.drawImage(enemy.bloodImage, enemy.x * tileSize, enemy.y * tileSize, tileSize, tileSize);
                    this.ctx.restore();
                }
                return;
            }

            const size = tileSize * 0.8;
            const offset = (tileSize - size) / 2;

            if (enemy.image?.complete) {
                this.ctx.drawImage(enemy.image, enemy.x * tileSize + offset, enemy.y * tileSize + offset, size, size);
            }

            const barX = enemy.x * tileSize + offset;
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(barX, enemy.y * tileSize - 5, size, 4);
            this.ctx.fillStyle = 'green';
            this.ctx.fillRect(barX, enemy.y * tileSize - 5, size * Math.max(0, enemy.hp / enemy.maxHp), 4);
        });
    }

    /**
     * Vykreslí všechny aktivní projektily.
     * @param {Array} projectiles - Pole projektilů.
     * @param {number} tileSize - Velikost dlaždice.
     */
    drawProjectiles(projectiles, tileSize) {
        projectiles.forEach(proj => {
            const size = tileSize * 0.5;
            if (proj.image?.complete && proj.image.src) {
                this.ctx.drawImage(proj.image, proj.x * tileSize - size / 2, proj.y * tileSize - size / 2, size, size);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(proj.x * tileSize, proj.y * tileSize, proj.radius * tileSize, 0, Math.PI * 2);
                this.ctx.fillStyle = 'yellow';
                this.ctx.fill();
                this.ctx.closePath();
            }
        });
    }

    /**
     * Pomocná metoda pro vykreslení čáry.
     * @param {number} x1 - Počáteční X.
     * @param {number} y1 - Počáteční Y.
     * @param {number} x2 - Koncové X.
     * @param {number} y2 - Koncové Y.
     */
    strokeLine(x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }
}
