import { Map } from '../map/Map.js';
import { Renderer } from '../map/Renderer.js';
import { DragDrop } from '../ui/DragDrop.js';
import { WaveManager } from './WaveManager.js';
import { TowerStats, EnemyStats } from '../config/GameAssets.js';
import { AudioControl } from '../ui/AudioControl.js';
import { StorageManager } from './StorageManager.js';

/**
 * Core Game class managing the main loop, state, and UI integration.
 */
export class Game {
    /**
     * @param {HTMLCanvasElement} canvas - The canvas element to render the game on.
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.isAnimating = false;

        this.map = new Map(20, 12);
        this.renderer = new Renderer(canvas);
        this.aspectRatio = this.map.gridWidth / this.map.gridHeight;
        this.tileSize = 0;

        // Herní stav
        this.lives = null;
        this.money = null;
        this.wave = null;
        this.gameSpeed = 1;
        this.showTowerRanges = true;
        this.isPaused = false;
        this.hasStarted = false;
        this.isContinuing = false; // Příznak pro pokračování

        // UI elementy
        this.uiLives = document.getElementById('ui-lives');
        this.uiMoney = document.getElementById('ui-money');
        this.uiWave = document.getElementById('ui-wave');
        this.createSVGLivesIcon();
        this.createSVGMoneyIcon();
        this.createSVGWaveIcon();

      this.audio = new AudioControl();
        this.map.audio = this.audio;
        this.setupUI();

        this.dragDrop = new DragDrop(this, this.canvas);
        this.waveManager = new WaveManager(this);
        this.lastTime = 0;

        window.addEventListener('resize', () => this.resize());
    }

    /**
     * Sets up event listeners for UI controls like wave starting, restarting, and game speed.
     */
    setupUI() {
        const waveBtn = document.getElementById('wave-control-btn');
        if (waveBtn) {
            waveBtn.addEventListener('click', () => !this.isPaused && this.waveManager.startNextWave());
        }

        const restartBtn = document.getElementById('restart-btn');
      if (restartBtn) {
        restartBtn.addEventListener('click', () => {
          // 1. Pro jistotu hru pozastavíme, když vyskočí okno
          const wasPaused = this.isPaused;
          if (!wasPaused) this.togglePause();

          // 2. Vyvoláme krásný varovný Swal
          Swal.fire({
            title: 'Opustit bitvu?',
            text: 'Opravdu chceš restartovat hru? Tvůj postup v této vlně bude ztracen!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ano, restartovat',
            cancelButtonText: 'Zpět do hry',
            // ZDE JE NAPOJENÍ NA CSS:
            customClass: {
              popup: 'swal-custom-popup',
              title: 'swal-custom-title',
              confirmButton: 'swal-custom-confirm',
              cancelButton: 'swal-custom-cancel'
            }
          }).then((result) => {
            if (result.isConfirmed) {
              // Pokud potvrdil, smažeme a reloadneme
              StorageManager.clearGameState();
              window.location.reload();
            } else {
              // Pokud zrušil, odpauzujeme hru (pokud předtím běžela)
              if (!wasPaused) this.togglePause();
            }
          });
        });
      }

        const speedBtns = document.querySelectorAll('.speed-btn');
        speedBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                speedBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.gameSpeed = parseInt(e.target.textContent);
            });
        });
    }

  /**
   * Injects the SVG heart icon and lives text into the UI container.
   */
  createSVGLivesIcon() {
    if (!this.uiLives) return;

    this.uiLives.innerHTML = `
          <svg id="heart-svg" class="heart-icon" width="20" height="20" viewBox="0 0 24 24">
            <path d="M 12 22 L 4 12  L 6 5 L 10 8 L 11 9 L 12 12 L 13 9 L 14 8 L 18 5 L 20 12 Z"/>
          </svg>
          <span id="lives-text-value">Lives: ${this.lives}</span>
         `;

    // Uložíme si prvky pro pozdější updaty
    this.heartSvg = document.getElementById('heart-svg');
    this.livesTextValue = document.getElementById('lives-text-value');
  }
  /**
   * Injects the SVG coin icon and money text into the UI container.
   */
  createSVGMoneyIcon() {
    if (!this.uiMoney) return;

    this.uiMoney.innerHTML = `
      <svg id="coin-svg" class="coin-icon" width="20" height="20" viewBox="0 0 24 24">
        <path class="coin-body" d="M 8 20 L 4 16 L 4 8 L 8 4 L 16 4 L 20 8 L 20 16 L 16 20 Z" />
        <path class="coin-inner-ring" d="M 9 17 L 7 15 L 7 9 L 9 7 L 15 7 L 17 9 L 17 15 L 15 17 Z" />
        <path class="coin-center" d="M 10 14 L 10 10 L 14 10 L 14 14 Z" />
      </svg>
      <span id="money-text-value">Money: ${this.money}</span>
    `;

    // Uložíme si prvky pro pozdější updaty
    this.coinSvg = document.getElementById('coin-svg');
    this.moneyTextValue = document.getElementById('money-text-value');
  }
  /**
   * Injects the SVG wave icon and wave text into the UI container.
   */
  createSVGWaveIcon() {
    if (!this.uiWave) return;

    this.uiWave.innerHTML = `
      <svg id="wave-svg" class="wave-icon" width="20" height="20" viewBox="0 0 24 24">
        <path class="wave-path-top" d="M 2 12 L 7 4 L 12 12 L 17 4 L 22 12" />
        <path class="wave-path-bottom" d="M 2 18 L 7 10 L 12 18 L 17 10 L 22 18" />
      </svg>
      <span id="wave-text-value">Wave: ${this.wave}</span>
    `;

    // Uložíme si unikátní prvky pro vlnu
    this.waveSvg = document.getElementById('wave-svg');
    this.waveTextValue = document.getElementById('wave-text-value');
  }

  /**
   * Persists the current game state to local storage.
   */
  saveCurrentState() {
    StorageManager.saveGameState(
      this.currentLevelUrl,
      this.wave,
      this.lives,
      this.money,
      this.map.towers
    );
  }

  /**
   * Initializes the game session, either by loading a saved state or starting fresh.
   * @param {string} levelUrl - Path to the level JSON configuration.
   */
  async start(levelUrl) {
    this.currentLevelUrl = levelUrl;
    await this.map.loadLevel(levelUrl);

    const savedState = StorageManager.loadGameState();

    if (this.isContinuing && savedState && savedState.levelUrl === levelUrl) {
      console.log("Pokračuji v uložené hře...");
      this.wave = savedState.wave;
      this.lives = savedState.lives;
      this.money = savedState.money;
      this.waveManager.currentWaveIndex = this.wave - 1;

      // >>> OPRAVA ZDE: Použijeme forEach, protože addTower si pole plní sám <<<
      this.map.towers = []; // Pro jistotu plochu nejdřív vyčistíme
      if (savedState.towers) {
        savedState.towers.forEach(t => {
          this.map.addTower(t.type, t.x, t.y);
        });
      }
    } else {
      console.log("Začínám čistou hru...");
      StorageManager.clearGameState();

      // >>> TVŮJ HLAVNÍ POŽADAVEK: VŠE SE NASTAVUJE POUZE ZDE <<<
      this.wave = 1;
      this.lives = 20;   // Natvrdo 20, z mapy se to už nikdy neveme!
      this.money = 150;  // Natvrdo 150
      this.isPaused = false;
      this.isGameOver = false; // Prevence proti zasekávání formuláře

      this.waveManager.currentWaveIndex = -1;
      this.waveManager.isWaveActive = false;
      this.waveManager.spawnQueue = [];

      this.map.towers = [];
      this.map.enemies = [];
      this.map.projectiles = [];
    }

    this.updateUI();
    this.resize();

    if (!this.isAnimating) {
      this.isAnimating = true;
      requestAnimationFrame((timestamp) => this.animate(timestamp));
    }
  }

  /**
   * Updates the DOM elements with current lives, money, and wave count.
   */
  updateUI() {
    if (this.livesTextValue) {
      this.livesTextValue.textContent = `Lives: ${this.lives}`;
    }
    if (this.moneyTextValue) {
      if (this.lastMoney !== undefined && this.lastMoney !== this.money) {
        if (this.coinSvg) {
          this.coinSvg.classList.remove('pop');
          void this.coinSvg.offsetWidth;
          this.coinSvg.classList.add('pop');
          setTimeout(() => this.coinSvg.classList.remove('pop'), 300);
        }
      }
      this.lastMoney = this.money;
      this.moneyTextValue.textContent = `Money: ${this.money}`;
    }

    if (this.waveTextValue) {
      if (this.lastWave !== undefined && this.lastWave !== this.wave) {
        if (this.waveSvg) {
          this.waveSvg.classList.remove('pop');
          void this.waveSvg.offsetWidth;
          this.waveSvg.classList.add('pop');
          setTimeout(() => this.waveSvg.classList.remove('pop'), 300);
        }
      }
      this.lastWave = this.wave;
      this.waveTextValue.textContent = `Wave: ${this.wave}`;
    }
  }

    /**
     * Toggles the pause state and manages background music and state saving.
     */
    togglePause() {
        this.isPaused = !this.isPaused;
        if (this.audio) {
            if (this.isPaused) {
                this.audio.waveMusic.pause();
                this.audio.idleMusic.pause();
                this.saveCurrentState();
            } else {
                this.waveManager && this.waveManager.isWaveActive ? this.audio.playWaveMusic() : this.audio.playIdleMusic();
            }
        }
    }

    /**
     * Attempts to build a tower at the specified grid coordinates.
     * @param {string} type - The type of tower to build.
     * @param {number} x - Grid X coordinate.
     * @param {number} y - Grid Y coordinate.
     */
    buildTower(type, x, y) {
        if (this.isPaused) return;
        const towerConfig = TowerStats[type];
        if (!towerConfig || this.money < towerConfig.price || !this.map.isBuildable(x, y)) return;

        if (this.audio) this.audio.playBuildTower();
        this.money -= towerConfig.price;
        this.map.addTower(type, x, y);
        this.updateUI();
    }

  /**
   * Reduces player lives and triggers visual/audio feedback. Handles game over logic.
   * @param {number} amount - Number of lives to subtract.
   */
  takeDamage(amount) {
    this.lives = Math.max(0, this.lives - amount);
    this.updateUI();
    if (this.audio) this.audio.playEnemyLeak();

    // Stejný trik pro spolehlivé blikání srdíčka, když projde víc nepřátel naráz
    if (this.heartSvg) {
      this.heartSvg.classList.remove('damaged');
      void this.heartSvg.offsetWidth;
      this.heartSvg.classList.add('damaged');
      setTimeout(() => this.heartSvg.classList.remove('damaged'), 300);
    }

    if (this.lives === 0) {
      this.isPaused = true;
      if (this.audio) this.audio.stopBackgroundMusic();
      this.isGameOver = true;
      const gameOverEvent = new CustomEvent('gameOver', {
        detail: { wave: this.wave }
      });
      window.dispatchEvent(gameOverEvent);

      StorageManager.clearGameState();
    }
  }

    /**
     * Resizes the canvas to fit its container while maintaining aspect ratio.
     */
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

    /**
     * The main animation loop.
     * @param {number} timestamp - Current time provided by requestAnimationFrame.
     */
    animate(timestamp) {
        if (!this.map.isLoaded) return;
        if (!this.lastTime) this.lastTime = timestamp;
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        if (!this.isPaused && this.lives > 0) {
            this.waveManager.update(deltaTime, this.gameSpeed);
            const updateResult = this.map.update(this.gameSpeed);
            if (updateResult) {
                updateResult.damageTaken > 0 && this.takeDamage(updateResult.damageTaken);
                updateResult.moneyEarned > 0 && (this.money += updateResult.moneyEarned, this.updateUI());
            }
        }

        this.renderer.render(this.map, this.tileSize, this.showTowerRanges);
        if (this.isPaused && this.lives > 0) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = 'white';
            this.ctx.font = '40px Consolas';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
        }

        requestAnimationFrame((ts) => this.animate(ts));
    }
}
