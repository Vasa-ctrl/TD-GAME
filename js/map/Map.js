import { Tower } from '../models/Tower.js';
import { Enemy } from '../models/Enemy.js';

/**
 * Represents the game map, handling level loading, pathfinding, and entity management.
 */
export class Map {
    /**
     * @param {number} gridWidth - Number of cells horizontally.
     * @param {number} gridHeight - Number of cells vertically.
     */
    constructor(gridWidth, gridHeight) {
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.levelData = null;
        this.currentLevelUrl = null;
        this.isLoaded = false;

        this.towers = [];
        this.enemies = [];
        this.projectiles = [];

        this.path = [];

        this.audio = null;
    }

    /**
     * Asynchronously loads level data from a JSON file.
     * @param {string} levelUrl - Path to the level JSON file.
     * @returns {Promise<void>}
     */
    async loadLevel(levelUrl) {
        try {
            this.currentLevelUrl = levelUrl;
            const response = await fetch(levelUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            this.levelData = await response.json();

            this.findPath();

            this.isLoaded = true;

            this.enemies = [];
            this.projectiles = [];

            console.log("Level načten, cesta nalezena:", this.path);
        } catch (error) {
            console.error("Chyba při načítání levelu:", error);
        }
    }

    /**
     * Calculates the enemy path by traversing adjacent '1' values in the grid.
     */
    findPath() {
        this.path = [];
        const grid = this.levelData.grid;
        let current = null;

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

        const visited = new Set();

        while (current) {
            this.path.push(current);
            visited.add(`${current.x},${current.y}`);

            const neighbors = [
                { x: current.x + 1, y: current.y },
                { x: current.x, y: current.y + 1 },
                { x: current.x - 1, y: current.y },
                { x: current.x, y: current.y - 1 }
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

    /**
     * Checks if a tower can be placed at the specified coordinates.
     * @param {number} x - Grid X coordinate.
     * @param {number} y - Grid Y coordinate.
     * @returns {boolean}
     */
    isBuildable(x, y) {
        if (x < 0 || x >= this.gridWidth || y < 0 || y >= this.gridHeight) return false;
        if (this.levelData.grid[y][x] !== 0) return false;
        const existingTower = this.towers.find(t => t.x === x && t.y === y);
        if (existingTower) return false;
        return true;
    }

    /**
     * Adds a new tower to the map.
     * @param {string} type - The type of tower.
     * @param {number} x - Grid X coordinate.
     * @param {number} y - Grid Y coordinate.
     */
    addTower(type, x, y) {
        const tower = new Tower(type, x, y, this.audio);
        this.towers.push(tower);
    }

    /**
     * Spawns a new enemy at the start of the path.
     * @param {string} type - The type of enemy.
     */
    spawnEnemy(type) {
        if (this.path.length === 0) return;
        const enemy = new Enemy(type, this.path);
        this.enemies.push(enemy);
    }

    /**
     * Updates all game entities and handles collisions/logic.
     * @param {number} gameSpeed - Multiplier for movement and reload speeds.
     * @returns {Object} An object containing moneyEarned and damageTaken.
     */
    update(gameSpeed) {
        let moneyEarned = 0;
        let damageTaken = 0;

        this.towers.forEach(tower => tower.update(this.enemies, this.projectiles, gameSpeed));

        this.enemies.forEach(enemy => {
            enemy.update(gameSpeed);

            if (enemy.markedForDeletion && !enemy.isDying && !enemy.damageDealt) {
                damageTaken += 1;
                enemy.damageDealt = true;
            }

            if (enemy.isDying && !enemy.rewardClaimed) {
                if (this.audio) this.audio.playEnemyDeath();
                moneyEarned += enemy.reward;
                enemy.rewardClaimed = true;
            }
        });

        this.enemies = this.enemies.filter(e => !e.markedForDeletion);

        this.projectiles.forEach(proj => proj.update(gameSpeed));
        this.projectiles = this.projectiles.filter(p => !p.markedForDeletion);

        return { moneyEarned, damageTaken };
    }
}
