import {LevelWaves} from '../config/Waves.js';
import {EnemyStats} from '../config/GameAssets.js';

/**
 * Manages the spawning logic, wave progression, and difficulty scaling of enemies.
 */
export class WaveManager {
  /**
   * @param {Game} game - Reference to the main game instance.
   */
  constructor(game) {
    this.game = game;
    this.currentWaveIndex = -1;
    this.isWaveActive = false;
    this.spawnQueue = [];
    this.spawnTimer = 0;
  }

  /**
   * Initiates the next wave of enemies.
   * Uses predefined configurations or generates a random one if exhausted.
   */
  startNextWave() {
    if (this.isWaveActive) {
      console.log("Vlna už běží!");
      return;
    }

    this.currentWaveIndex++;
    const waveConfig = LevelWaves[this.currentWaveIndex] || this.generateRandomWave(this.currentWaveIndex + 1);

    this.isWaveActive = true;
    this.game.wave = this.currentWaveIndex + 1;
    this.game.updateUI();
    if (this.game.audio) this.game.audio.playWaveMusic();

    this.prepareSpawnQueue(waveConfig);
  }

  /**
   * Procedurally generates a wave configuration based on the current wave number.
   * @param {number} waveNumber - The current wave count.
   * @returns {Object} The generated wave configuration containing enemy groups.
   */
  generateRandomWave(waveNumber) {
    const groups = [];
    const difficultyPoints = (waveNumber+53)**1.35 * 60;
    let currentPoints = 0;
    const enemyTypes = Object.keys(EnemyStats);

    while (currentPoints < difficultyPoints) {
      const randomType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
      const enemyCost = EnemyStats[randomType].hp / 10;
      let count = Math.floor(Math.random() * 10) + 1;

      if (currentPoints + (count * enemyCost) > difficultyPoints + 500) {
        count = Math.max(1, Math.floor((difficultyPoints - currentPoints) / enemyCost));
      }

      groups.push({
        type: randomType,
        count: count,
        interval: Math.max(200, 1500 - (waveNumber * 20))
      });
      currentPoints += count * enemyCost;
    }
    return {groups: groups};
  }

  /**
   * Populates the spawn queue with enemies and their scheduled spawn times.
   * @param {Object} waveConfig - Configuration object for the wave.
   */
  prepareSpawnQueue(waveConfig) {
    this.spawnQueue = [];
    let currentTimeOffset = 0;

    for (const group of waveConfig.groups) {
      for (let i = 0; i < group.count; i++) {
        this.spawnQueue.push({ type: group.type, time: currentTimeOffset });
        currentTimeOffset += Math.max(44, 444)
      }
    }
    this.spawnTimer = 0;
  }

  /**
   * Updates the spawning timer and checks for wave completion.
   * @param {number} deltaTime - Time elapsed since last frame.
   * @param {number} gameSpeed - Current game speed multiplier.
   */
  update(deltaTime, gameSpeed) {
    if (!this.isWaveActive) return;
    this.spawnTimer += deltaTime * gameSpeed;

    while (this.spawnQueue.length > 0 && this.spawnTimer >= this.spawnQueue[0].time) {
      this.game.map.spawnEnemy(this.spawnQueue.shift().type);
    }

    if (this.spawnQueue.length === 0 && this.game.map.enemies.length === 0) {
      this.isWaveActive = false;
      if (this.game.audio) this.game.audio.playIdleMusic();

      if (this.game.saveCurrentState) {
        this.game.saveCurrentState();
        console.log("Vlna dokončena, hra byla automaticky uložena!");
      }
    }
  }
}
