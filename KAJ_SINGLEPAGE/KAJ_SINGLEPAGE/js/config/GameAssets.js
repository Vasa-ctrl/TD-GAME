/**
 * @file GameAssets.js
 * @description Central configuration for all game assets including images, audio, and entity statistics.
 */

/**
 * Object containing all loaded Image and Audio instances.
 */
export const assets = {
  enemies: {
    azog: new Image(),
    camelRider: new Image(),
    goblinRider: new Image(),
    lucifer: new Image(),
    ogre: new Image(),
    voidling: new Image()
  },
  towers: {
    ben: new Image(),
    knight: new Image(),
    ninja: new Image(),
    sorcerer: new Image(),
    viking: new Image(),
    deserter: new Image()
  },
  projectiles: {
    axe: new Image(),
    shuriken: new Image(),
    spell: new Image(),
    sword: new Image(),
    flame: new Image()
  },
  effects: {
    bloodSplash: new Image()
  },
  tiles: {
    path: new Image(),
    solid1: new Image(),
    solid2: new Image(),
    solid3: new Image()
  },
  music: {
    background1: new Audio('./assets/audio/music/BackgroundMusic1.mp3'),
    background2: new Audio('./assets/audio/music/BackgroundMusic2.mp3')
  },

  sfx: {
    death: new Audio('./assets/audio/Dead.mp3'),
    leak: new Audio('./assets/audio/Dead.mp3'),
    shootAxe: new Audio('./assets/audio/Axe.mp3'),
    shootShuriken: new Audio('./assets/audio/Shuriken.mp3'),
    shootSpell: new Audio('./assets/audio/FireBall.mp3'),
    shootSword: new Audio('./assets/audio/Sword.mp3'),
    buildTower: new Audio('./assets/audio/TowerBuilds.mp3'),
    start: new Audio('./assets/audio/StartOfTheGame.mp3')
  }
};

/**
 * Configuration for tower types.
 * @type {Object.<string, {name: string, description: string, image: HTMLImageElement, projectileImage: HTMLImageElement, shootSound: HTMLAudioElement, price: number, damage: number, range: number, attackSpeed: number}>}
 */
export const TowerStats = {
  ben: {
    name: "Ben",
    description: "Great bear warrior. Cheap starter tower.",
    image: assets.towers.ben,
    projectileImage: assets.projectiles.sword,
    shootSound: assets.sfx.shootSword,
    price: 50,
    damage: 15,
    range: 85,
    attackSpeed: 1.2,
  },
  knight: {
    name: "Knight",
    description: "Reliable medium-range defender.",
    image: assets.towers.knight,
    projectileImage: assets.projectiles.sword,
    shootSound: assets.sfx.shootSword,
    price: 90,
    damage: 30,
    range: 110,
    attackSpeed: 1.2,
  },
  ninja: {
    name: "Ninja",
    description: "Fast attacks, huge range, low damage. Good for fast enemies.",
    image: assets.towers.ninja,
    projectileImage: assets.projectiles.shuriken,
    shootSound: assets.sfx.shootShuriken,
    price: 120,
    damage: 15,
    range: 160,
    attackSpeed: 3.5,
  },
  viking: {
    name: "Viking",
    description: "Slow but devastating strikes. Great against heavy armor.",
    image: assets.towers.viking,
    projectileImage: assets.projectiles.axe,
    shootSound: assets.sfx.shootAxe,
    price: 130,
    damage: 75,
    range: 90,
    attackSpeed: 0.7,
  },
  deserter: {
    name: "Deserter",
    description: "Solid all-rounder with good fire rate.",
    image: assets.towers.deserter,
    projectileImage: assets.projectiles.flame,
    shootSound: assets.sfx.shootSpell,
    price: 160,
    damage: 45,
    range: 120,
    attackSpeed: 1.8,
  },
  sorcerer: {
    name: "Sorcerer",
    description: "Heavy artillery. Expensive but immensely powerful.",
    image: assets.towers.sorcerer,
    projectileImage: assets.projectiles.spell,
    shootSound: assets.sfx.shootSpell,
    price: 250,
    damage: 120,
    range: 180,
    attackSpeed: 0.8,
  }
};

/**
 * Configuration for enemy types.
 * @type {Object.<string, {name: string, description: string, image: HTMLImageElement, hp: number, speed: number, reward: number}>}
 */
export const EnemyStats = {
  goblinRider: {
    name: "Goblin Rider",
    description: "Standard unit.",
    image: assets.enemies.goblinRider,
    hp: 60,
    speed: 1.8,
    reward: 10,
  },
  camelRider: {
    name: "Camel Rider",
    description: "Fast unit from the desert.",
    image: assets.enemies.camelRider,
    hp: 80,         // Zvýšeno ze 75
    speed: 2.2,
    reward: 15,
  },
  voidling: {
    name: "Voidling",
    description: "Extremely fast, but fragile.",
    image: assets.enemies.voidling,
    hp: 35,
    speed: 3.5,
    reward: 8,
  },
  ogre: {
    name: "Ogre",
    description: "Massive meat shield. Slow but hard to kill.",
    image: assets.enemies.ogre,
    hp: 450,
    speed: 0.6,
    reward: 40,
  },
  azog: {
    name: "Azog",
    description: "Mighty warchief of orcs. A tough bruiser.",
    image: assets.enemies.azog,
    hp: 650,
    speed: 1.1,
    reward: 25,
  },
  lucifer: {
    name: "Lucifer",
    description: "The sending of hell itself",
    image: assets.enemies.lucifer,
    hp: 3500,
    speed: 0.7,
    reward: 666,
  },
};

// --- 3. Nastavení zdrojů (src) ---

// Enemies
assets.enemies.azog.src = './assets/img/enemies/Azog.png';
assets.enemies.ogre.src = './assets/img/enemies/Ogre.png';
assets.enemies.camelRider.src = './assets/img/enemies/CamelRider.png';
assets.enemies.goblinRider.src = './assets/img/enemies/GoblinRider.png';
assets.enemies.lucifer.src = './assets/img/enemies/Lucifer.png';
assets.enemies.voidling.src = './assets/img/enemies/Voidling.png';

// Towers
assets.towers.ninja.src = './assets/img/towers/Ninja.png';
assets.towers.knight.src = './assets/img/towers/Knight.png';
assets.towers.ben.src = './assets/img/towers/Ben.png';
assets.towers.sorcerer.src = './assets/img/towers/Sorcerer.png';
assets.towers.viking.src = './assets/img/towers/Viking.png';
assets.towers.deserter.src = './assets/img/towers/Deserter.png';

// Projectiles & Effects
assets.projectiles.shuriken.src = './assets/img/projectiles/ShurikenProjectile.png';
assets.projectiles.axe.src = './assets/img/projectiles/AxeProjectile.png';
assets.projectiles.spell.src = './assets/img/projectiles/SpellProjectile.png';
assets.projectiles.sword.src = './assets/img/projectiles/SwordProjectile.png';
assets.projectiles.flame.src = './assets/img/projectiles/FlameProjectile.png';
assets.effects.bloodSplash.src = './assets/img/effects/BloodSplash.png';

// Tiles
assets.tiles.path.src = './assets/img/tiles/path/CobblestonePath.png';
assets.tiles.solid1.src = './assets/img/tiles/Brick_Wall.png';
assets.tiles.solid2.src = './assets/img/tiles/Brick_Wall.png';
assets.tiles.solid3.src = './assets/img/tiles/Brick_Wall_Cracked.png';
