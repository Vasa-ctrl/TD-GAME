/**
 * Manager for handling game state persistence and leaderboard data.
 * Utilizes both LocalStorage and Cookies for redundancy.
 */
export class StorageManager {

    /**
     * Saves the current game state to LocalStorage and Cookies.
     * @param {string} levelUrl - The URL of the current level.
     * @param {number} wave - Current wave number.
     * @param {number} lives - Remaining player lives.
     * @param {number} money - Current player currency.
     * @param {Array} towers - List of tower objects to be serialized.
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
     * Loads the game state from LocalStorage or fallback Cookies.
     * @returns {Object|null} The parsed game state object or null if not found.
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
                console.error("Chyba při načítání stavu hry ze storage/cookie", e);
                return null;
            }
        }
        return null;
    }

    /**
     * Clears the saved game state from both LocalStorage and Cookies.
     */
    static clearGameState() {
        localStorage.removeItem('td_gameState');
        this.setCookie('td_gameState', '', -1);
    }

    /**
     * Adds a new score to the leaderboard and persists it.
     * @param {string} playerName - Name of the player.
     * @param {number} wave - The wave reached.
     */
    static saveScore(playerName, wave) {
        let leaderboard = this.getLeaderboard();
        leaderboard.push({ name: playerName, wave: wave, date: new Date().toISOString() });
        leaderboard.sort((a, b) => b.wave - a.wave);
        leaderboard = leaderboard.slice(0, 10);

        const lbStr = JSON.stringify(leaderboard);

        localStorage.setItem('td_leaderboard', lbStr);
        this.setCookie('td_leaderboard', lbStr, 365);
    }

    /**
     * Retrieves the leaderboard from LocalStorage or fallback Cookies.
     * @returns {Array} Array of score objects.
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
                console.error("Chyba při načítání žebříčku", e);
                return [];
            }
        }
        return [];
    }

  /**
   * Sets a browser cookie.
   * @param {string} name - Cookie name.
   * @param {string} value - Cookie value.
   * @param {number} days - Number of days until expiration.
   */
  static setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }

    const safeValue = encodeURIComponent(value || "");

    document.cookie = name + "=" + safeValue + expires + "; path=/; SameSite=Lax";
  }

  /**
   * Retrieves a browser cookie by name.
   * @param {string} name - Cookie name.
   * @returns {string|null} Decoded cookie value or null if not found.
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
