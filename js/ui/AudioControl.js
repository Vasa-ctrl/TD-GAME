/**
 * @file AudioControl.js
 * @description Manages all game audio, including dual-track background music (idle/wave states),
 * sound effects, volume scaling, and mute toggling.
 */

import { assets } from '../config/GameAssets.js';

/**
 * Centralized audio controller class.
 * Handles HTMLAudioElement instances for continuous background music
 * and short, overlapping sound effects (SFX).
 */
export class AudioControl {
  /**
   * Initializes the audio controller.
   * Sets default volume levels, configures looping for background tracks,
   * and establishes the initial unmuted state.
   */
  constructor() {
    this.musicVolume = 0.1;
    this.sfxVolume = 0.3;

    this.waveMusic = assets.music.background1;
    this.waveMusic.loop = true;
    this.waveMusic.volume = this.musicVolume;

    this.idleMusic = assets.music.background2;
    this.idleMusic.loop = true;
    this.idleMusic.volume = this.musicVolume;

    this.isMuted = false;
  }

  /**
   * Sets the master volume for all background music tracks.
   * Instantly applies the new volume to both idle and wave music instances.
   * * @param {number} volume - Float representing the volume level (0.0 to 1.0).
   * @returns {void}
   */
  setMusicVolume(volume) {
    this.musicVolume = volume;
    this.waveMusic.volume = this.musicVolume;
    this.idleMusic.volume = this.musicVolume;
  }

  /**
   * Sets the master volume for all subsequent sound effects.
   * * @param {number} volume - Float representing the volume level (0.0 to 1.0).
   * @returns {void}
   */
  setSfxVolume(volume) {
    this.sfxVolume = volume;
  }

  /**
   * Transitions the background audio to the active combat wave music.
   * Automatically pauses the idle track and handles browser autoplay restrictions.
   * * @returns {void}
   */
  playWaveMusic() {
    this.idleMusic.pause();
    if (!this.isMuted) {
      this.waveMusic.play().catch(e => console.log("Autoplay prevented:", e));
    }
  }

  /**
   * Transitions the background audio to the idle/preparation music.
   * Automatically pauses the combat wave track.
   * * @returns {void}
   */
  playIdleMusic() {
    this.waveMusic.pause();
    if (!this.isMuted) {
      this.idleMusic.play().catch(e => console.log("Autoplay prevented:", e));
    }
  }

  /**
   * Hard-stops all background music and resets their playback position to the beginning.
   * Typically used when the game is over or fully restarted.
   * * @returns {void}
   */
  stopBackgroundMusic() {
    this.waveMusic.pause();
    this.waveMusic.currentTime = 0;
    this.idleMusic.pause();
    this.idleMusic.currentTime = 0;
  }

  /**
   * Plays the sound effect associated with an enemy's death.
   * @returns {void}
   */
  playEnemyDeath() {
    this.playSound(assets.sfx.death);
  }

  /**
   * Plays the warning sound effect when an enemy successfully breaches the defenses.
   * @returns {void}
   */
  playEnemyLeak() {
    this.playSound(assets.sfx.leak);
  }

  /**
   * Plays the construction sound effect when the player places a new tower.
   * @returns {void}
   */
  playBuildTower() {
    this.playSound(assets.sfx.buildTower);
  }

  /**
   * Plays the fanfare or notification sound effect indicating the start of a game/wave.
   * @returns {void}
   */
  playStartSound() {
    this.playSound(assets.sfx.start);
  }

  /**
   * Plays the specific shooting sound effect based on the projectile type fired.
   * Falls back to a default sword swing sound if the specified type is not found.
   * * @param {string} projectileType - The identifier of the projectile being fired.
   * @returns {void}
   */
  playShoot(projectileType) {
    const soundToPlay = assets.sfx[projectileType] || assets.sfx.shootSword;
    this.playSound(soundToPlay);
  }

  /**
   * Internal helper method to execute sound effect playback.
   * Clones the audio node before playing to allow multiple instances of the same
   * sound (e.g., multiple arrows firing) to overlap without cutting each other off.
   * * @param {HTMLAudioElement} sound - The loaded audio asset to play.
   * @private
   * @returns {void}
   */
  playSound(sound) {
    if (!sound) {
      console.warn("Attempted to play an undefined sound asset.");
      return;
    }

    if (!this.isMuted) {
      const clone = sound.cloneNode();
      clone.volume = this.sfxVolume;
      clone.play().catch(e => console.log("SFX play prevented:", e));
    }
  }

  /**
   * Toggles the global mute state for all music and sound effects.
   * If unmuting, it intelligently resumes the correct background track based on the game state.
   * * @param {boolean} isWaveActive - True if a combat wave is currently ongoing.
   * @returns {void}
   */
  toggleMute(isWaveActive) {
    this.isMuted = !this.isMuted;

    if (this.isMuted) {
      this.waveMusic.pause();
      this.idleMusic.pause();
    } else {
      isWaveActive ? this.playWaveMusic() : this.playIdleMusic();
    }
  }
}
