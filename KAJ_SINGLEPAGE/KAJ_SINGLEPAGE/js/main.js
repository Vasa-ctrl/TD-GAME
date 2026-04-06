/**
 * @file main.js
 * @description Entry point for the Tower Defense game. Handles routing, UI event listeners,
 * Service Worker registration, and game instance lifecycle.
 */

import { Game } from './core/Game.js';
import { renderEnemyPreview } from './ui/EnemyPreview.js';
import { renderTowerPreview } from './ui/TowerPreview.js';
import { StorageManager } from './core/StorageManager.js';

/**
 * Initialization on window load.
 * Sets up the game engine, handles hash-based navigation (SPA),
 * and binds UI elements for settings, leaderboard, and game state transitions.
 */
window.addEventListener('load', () => {

  /**
   * Service Worker registration for offline capabilities.
   * Enables the application to function as a PWA.
   */
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch((error) => {
      console.log('Registrace ServiceWorkeru selhala:', error);
    });
  }

  const canvas = document.getElementById('gameCanvas');
  const mainMenu = document.getElementById('main-menu');
  const startGameBtn = document.getElementById('start-game-btn');
  const continueGameBtn = document.getElementById('continue-game-btn');
  const gameUI = document.getElementById('game-ui');

  /** Settings UI elements */
  const settingsModal = document.getElementById('settings-modal');
  const mainSettingsBtn = document.getElementById('main-settings-btn');
  const gameSettingsBtn = document.getElementById('settings-btn');
  const closeSettingsBtn = document.getElementById('close-settings-btn');
  const showRangeCheckbox = document.getElementById('show-range-checkbox');

  /** Leaderboard UI elements */
  const leaderboardBtn = document.getElementById('leaderboard-btn');
  const leaderboardModal = document.getElementById('leaderboard-modal');
  const closeLeaderboardBtn = document.getElementById('close-leaderboard-btn');
  const leaderboardTableBody = document.querySelector('#leaderboard-table tbody');

  /** Audio control UI elements */
  const muteCheckbox = document.getElementById('mute-checkbox');
  const musicVolumeSlider = document.getElementById('music-volume-slider');
  const sfxVolumeSlider = document.getElementById('sfx-volume-slider');

  /** Game Over UI elements */
  const gameOverModal = document.getElementById('game-over-modal');
  const gameOverWaveText = document.getElementById('game-over-wave');
  const saveScoreForm = document.getElementById('save-score-form');
  const playerNameInput = document.getElementById('player-name-input');
  const skipScoreBtn = document.getElementById('skip-score-btn');
  let finalWave = 1;

  /** Navigation button within game UI */
  const menuBtn = document.getElementById('menu-btn');

  /**
   * Renders the preview cards for enemies and towers based on game configuration.
   */
  renderEnemyPreview();

  /**
   * Renders the preview cards for towers based on game configuration.
   */
  renderTowerPreview();

  if (canvas && mainMenu && startGameBtn && gameUI) {
    let game = new Game(canvas);

    const startMusicOnFirstClick = () => {
      /**
       * Browsers block autoplay until user interaction.
       * This listener ensures audio starts after the first click.
       */
      if (game.audio) game.audio.playIdleMusic();
      document.removeEventListener('click', startMusicOnFirstClick);
    };
    document.addEventListener('click', startMusicOnFirstClick);

    startGameBtn.addEventListener('click', () => {
      const savedState = StorageManager.loadGameState();

      /**
       * Helper function to reset state and navigate to game.
       */
      const startNewGame = () => {
        StorageManager.clearGameState();
        game.isContinuing = false;
        game.hasStarted = false;
        window.location.hash = 'game';
      };

      /**
       * If a saved game exists, prompt the user for confirmation before overwriting.
       * Uses SweetAlert2 for the modal dialog.
       */
      if (savedState) {
        Swal.fire({
          title: 'Přepsat uloženou hru?',
          text: 'Máš rozehranou hru. Pokud začneš novou, tvůj starý postup se nenávratně smaže.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Smazat a začít novou',
          cancelButtonText: 'Zrušit',
          customClass: {
            popup: 'swal-custom-popup',
            title: 'swal-custom-title',
            confirmButton: 'swal-custom-confirm',
            cancelButton: 'swal-custom-cancel'
          }
        }).then((result) => {
          if (result.isConfirmed) startNewGame();
        });
      } else {
        startNewGame();
      }
    });

    if (continueGameBtn) {
      continueGameBtn.addEventListener('click', () => {
        const savedState = StorageManager.loadGameState();
        if (savedState) {
          game.isContinuing = true;
          window.location.hash = 'game';
        } else {
          Swal.fire({
            title: 'Chyba!',
            text: 'Žádná uložená hra nebyla nalezena. Začněte prosím Novou hru.',
            icon: 'error',
            confirmButtonText: 'Rozumím',
            customClass: {
              popup: 'swal-custom-popup',
              title: 'swal-custom-title',
              confirmButton: 'swal-custom-info-btn'
            }
          });
        }
      });
    }

    if (menuBtn) menuBtn.addEventListener('click', () => window.location.hash = 'menu');

    /**
     * Simple SPA Router based on window.location.hash.
     * Manages visibility of menus and triggers game start/pause logic.
     */
    const handleNavigation = () => {
      const hash = window.location.hash.replace('#', '') || 'menu';

      [mainMenu, gameUI, settingsModal, leaderboardModal].forEach(el => el?.classList.add('hidden'));

      if (hash === 'game') {
        gameUI.classList.remove('hidden');

        if (!game.hasStarted || game.isGameOver) {
          const savedState = StorageManager.loadGameState();
          if (savedState && !game.isGameOver) game.isContinuing = true;

          const levelToLoad = (game.isContinuing && savedState)
            ? savedState.levelUrl
            : 'assets/levels/level1.json';

          game.start(levelToLoad);
          game.hasStarted = true;
          game.isGameOver = false;
        } else if (game.isPaused) {
          game.togglePause();
        }
      } else if (hash === 'menu') {
        mainMenu.classList.remove('hidden');
        if (game.hasStarted && !game.isPaused) game.togglePause();
      }
    };

    window.addEventListener('hashchange', handleNavigation);
    handleNavigation();

    /**
     * Fetches scores from StorageManager and populates the leaderboard table.
     */
    const openLeaderboard = () => {
      if (leaderboardModal) {
        const lb = StorageManager.getLeaderboard();
        leaderboardTableBody.innerHTML = lb.length ? lb.map((entry, i) => `
          <tr><td>${i + 1}</td><td>${entry.name}</td><td>${entry.wave}</td><td>${new Date(entry.date).toLocaleDateString()}</td></tr>
        `).join('') : '<tr><td colspan="4">No scores yet.</td></tr>';
        leaderboardModal.classList.remove('hidden');
      }
    };

    /**
     * Hides the leaderboard modal.
     */
    const closeLeaderboard = () => {
      if (leaderboardModal) leaderboardModal.classList.add('hidden');
    };

    if (leaderboardBtn) leaderboardBtn.addEventListener('click', openLeaderboard);
    if (closeLeaderboardBtn) closeLeaderboardBtn.addEventListener('click', closeLeaderboard);

    /**
     * Displays the settings modal and pauses the game if active.
     */

    const openSettings = () => {
      if (settingsModal) {
        settingsModal.classList.remove('hidden');
        if (window.location.hash === '#game' && !game.isPaused) game.togglePause();
      }
    };

    /**
     * Hides the settings modal and resumes the game if it was paused.
     */
    const closeSettings = () => {
      if (settingsModal) {
        settingsModal.classList.add('hidden');
        if (window.location.hash === '#game' && game.isPaused) game.togglePause();
      }
    };

    if (mainSettingsBtn) mainSettingsBtn.addEventListener('click', openSettings);
    if (gameSettingsBtn) gameSettingsBtn.addEventListener('click', openSettings);
    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', closeSettings);

    if (showRangeCheckbox) {
      showRangeCheckbox.checked = game.showTowerRanges;
      showRangeCheckbox.addEventListener('change', (e) => game.showTowerRanges = e.target.checked);
    }

    /**
     * Synchronizes the UI controls with the Audio engine state.
     */
    function attachAudioSettings() {
      if (muteCheckbox && game.audio) {
        muteCheckbox.checked = game.audio.isMuted;
        muteCheckbox.onchange = () => {
          const isWaveActive = game.waveManager ? game.waveManager.isWaveActive : false;
          game.audio.toggleMute(isWaveActive);
        };
      }

      if (musicVolumeSlider && game.audio) {
        musicVolumeSlider.value = game.audio.musicVolume;
        musicVolumeSlider.oninput = (e) => game.audio.setMusicVolume(parseFloat(e.target.value));
      }

      if (sfxVolumeSlider && game.audio) {
        sfxVolumeSlider.value = game.audio.sfxVolume;
        sfxVolumeSlider.oninput = (e) => game.audio.setSfxVolume(parseFloat(e.target.value));
      }
    }

    attachAudioSettings();

    /**
     * Event listener for the custom 'gameOver' event dispatched by the Game engine.
     */
    window.addEventListener('gameOver', (e) => {
      finalWave = e.detail.wave;
      game.isGameOver = true;
      if (gameOverWaveText) gameOverWaveText.textContent = finalWave;
      if (gameOverModal) {
        gameOverModal.classList.remove('hidden');
        setTimeout(() => playerNameInput.focus(), 100);
      }
    });

    if (saveScoreForm) {
      saveScoreForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const playerName = playerNameInput.value.trim();
        if (playerName) StorageManager.saveScore(playerName, finalWave);
        gameOverModal.classList.add('hidden');
        saveScoreForm.reset();
        window.location.hash = 'menu';
        setTimeout(() => {
          openLeaderboard();
        }, 50);
      });
    }

    if (skipScoreBtn) {
      skipScoreBtn.addEventListener('click', () => {
        gameOverModal.classList.add('hidden');
        saveScoreForm.reset();
        window.location.hash = 'menu';
      });
    }
  } else {
    console.error('Některý z klíčových HTML prvků chybí!');
  }
});
