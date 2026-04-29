/**
 * Manager for handling game state persistence and leaderboard data.
 * Utilizes both LocalStorage and fallback Cookies for redundancy and reliability.
 */
export class StorageManager {

  /**
   * Saves the current active game state to both LocalStorage and Cookies.
   * Used for pausing and resuming gameplay.
   * * @param {string} levelUrl - The path or URL of the currently loaded level configuration.
   * @param {number} wave - The current active wave number.
   * @param {number} lives - The player's remaining lives.
   * @param {number} money - The player's current currency.
   * @param {Array} towers - An array of active tower instances on the map.
   */
  static saveGameState(levelUrl, wave, lives, money, towers) {
    const serializableTowers = towers.map(tower => ({
      type: tower.type,
      x: tower.x,
      y: tower.y
    }));

    const state = {
      levelUrl,
      wave,
      lives,
      money,
      towers: serializableTowers
    };
    localStorage.setItem('td_gameState', JSON.stringify(state));
    this.setCookie('td_gameState', JSON.stringify(state), 7);
  }

  /**
   * Attempts to load a previously saved game state.
   * Prioritizes LocalStorage, but falls back to Cookies if necessary.
   * * @returns {Object|null} The parsed game state object, or null if no valid state exists.
   */
  static loadGameState() {
    let stateStr = localStorage.getItem('td_gameState');

    if (!stateStr) {
      stateStr = this.getCookie('td_gameState');
      if (stateStr) {
        localStorage.setItem('td_gameState', stateStr);
      }
    }

    if (stateStr) {
      try {
        return JSON.parse(stateStr);
      } catch (e) {
        console.error("Error parsing game state from storage/cookie:", e);
        return null;
      }
    }
    return null;
  }

  /**
   * Permanently clears the saved game state from all storage mechanisms.
   */
  static clearGameState() {
    localStorage.removeItem('td_gameState');
    this.setCookie('td_gameState', '', -1);
  }

  /**
   * Adds a new high score to the leaderboard, sorts it, keeps only the top 10,
   * and persists the updated list.
   * * @param {string} playerName - The player's input name.
   * @param {number} wave - The final wave reached by the player.
   */
  static saveScore(playerName, wave) {
    let leaderboard = this.getLeaderboard();

    leaderboard.push({
      name: playerName,
      wave: wave,
      date: new Date().toISOString()
    });

    leaderboard.sort((a, b) => b.wave - a.wave);
    leaderboard = leaderboard.slice(0, 10);

    const lbStr = JSON.stringify(leaderboard);

    localStorage.setItem('td_leaderboard', lbStr);
    this.setCookie('td_leaderboard', lbStr, 365);
  }

  /**
   * Retrieves the stored leaderboard array.
   * * @returns {Array<Object>} An array of leaderboard entry objects (empty array if none).
   */
  static getLeaderboard() {
    let lbStr = localStorage.getItem('td_leaderboard');

    if (!lbStr) {
      lbStr = this.getCookie('td_leaderboard');
      if (lbStr) {
        localStorage.setItem('td_leaderboard', lbStr);
      }
    }

    if (lbStr) {
      try {
        return JSON.parse(lbStr);
      } catch (e) {
        console.error("Error parsing leaderboard from storage:", e);
        return [];
      }
    }
    return [];
  }

  /**
   * Helper function to set a browser cookie.
   * * @param {string} name - The cookie identifier.
   * @param {string} value - The raw string value to be stored.
   * @param {number} days - Lifespan of the cookie in days (negative to expire).
   */
  static setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }

    const safeValue = encodeURIComponent(value || "");
    // Using SameSite=Lax for modern browser security standards
    document.cookie = name + "=" + safeValue + expires + "; path=/; SameSite=Lax";
  }

  /**
   * Helper function to safely retrieve a browser cookie by its name.
   * * @param {string} name - The cookie identifier to search for.
   * @returns {string|null} The decoded string value of the cookie, or null if not found.
   */
  static getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        const safeValue = c.substring(nameEQ.length, c.length);
        return decodeURIComponent(safeValue);
      }
    }
    return null;
  }
}
