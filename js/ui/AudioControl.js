import { assets } from '../config/GameAssets.js';

/**
 * Manages game audio, including background music and sound effects.
 */
export class AudioControl {
  /**
   * Initializes the audio controller with default volumes and music tracks.
   */
  constructor() {
    this.musicVolume = 0.2;
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
   * Sets the volume for background music.
   * @param {number} volume - Volume level (0.0 to 1.0).
   */
  setMusicVolume(volume) {
    this.musicVolume = volume;
    this.waveMusic.volume = this.musicVolume;
    this.idleMusic.volume = this.musicVolume;
  }

  /**
   * Sets the volume for sound effects.
   * @param {number} volume - Volume level (0.0 to 1.0).
   */
  setSfxVolume(volume) {
    this.sfxVolume = volume;
  }

  /**
   * Plays the music designated for active combat waves.
   * Pauses idle music.
   */
  playWaveMusic() {
    this.idleMusic.pause();
    if (!this.isMuted) {
      this.waveMusic.play().catch(e => console.log("Autoplay prevented"));
    }
  }

  /**
   * Plays the music designated for idle/preparation phases.
   * Pauses wave music.
   */
  playIdleMusic() {
    this.waveMusic.pause();
    if (!this.isMuted) {
      this.idleMusic.play().catch(e => console.log("Autoplay prevented"));
    }
  }

  /**
   * Stops all background music and resets playback position.
   */
  stopBackgroundMusic() {
    this.waveMusic.pause();
    this.waveMusic.currentTime = 0;
    this.idleMusic.pause();
    this.idleMusic.currentTime = 0;
  }

  /**
   * Plays the sound effect for an enemy dying.
   */
  playEnemyDeath() {
    this.playSound(assets.sfx.death);
  }

  /**
   * Plays the sound effect for an enemy reaching the end of the path.
   */
  playEnemyLeak() {
    this.playSound(assets.sfx.leak);
  }

  /**
   * Plays the sound effect for building a tower.
   */
  playBuildTower() {
    this.playSound(assets.sfx.buildTower);
  }

  /**
   * Plays the sound effect for starting the game or a wave.
   */
  playStartSound() {
    this.playSound(assets.sfx.start);
  }

  /**
   * Plays the shooting sound effect based on the projectile type.
   * @param {string} projectileType - The type of projectile being fired.
   */
  playShoot(projectileType) {
    const soundToPlay = assets.sfx[projectileType] || assets.sfx.shootSword;
    this.playSound(soundToPlay);
  }

  /**
   * Internal helper to clone and play a sound effect with the current SFX volume.
   * @param {HTMLAudioElement} sound - The audio asset to play.
   * @private
   */
  playSound(sound) {
    if (!sound) {
      console.warn("Pokus o přehrání neexistujícího zvuku.");
      return;
    }

    if (!this.isMuted) {
      const clone = sound.cloneNode();
      clone.volume = this.sfxVolume;
      clone.play().catch(e => console.log("SFX play prevented"));
    }
  }

  /**
   * Toggles the mute state for all audio.
   * @param {boolean} isWaveActive - Whether a combat wave is currently active.
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
