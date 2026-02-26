// --- 1. Definice a načtení Assets ---

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
    deserter: new Image() // Přidáno pro Desertera
  },
  projectiles: {
    axe: new Image(),
    shuriken: new Image(),
    spell: new Image(),
    sword: new Image(),
    flame: new Image() // Přidáno pro Desertera
  },
  effects: {
    bloodSplash: new Image()
  },
  tiles: {
    path: new Image(),
    solid1: new Image(),
    solid2: new Image(),
    solid3: new Image()
  }
};


// --- 2. Konfigurace statistik (využívá přímo assets) ---

export const TowerStats = {
  ben: {
    name: "Ben",
    description: "Great bear warrior and great companion",
    image: assets.towers.ben,
    projectileImage: assets.projectiles.sword,
    price: 100,
    damage: 1,
    range: 50,
  },
  viking: {
    name: "Viking",
    description: "Smelly viking that fears no one",
    image: assets.towers.viking,
    projectileImage: assets.projectiles.axe,
    price: 100,
    damage: 100,
    range: 35,
  },
  knight: {
    name: "Knight",
    description: "A fair and virtuous knight at your service",
    image: assets.towers.knight,
    projectileImage: assets.projectiles.sword,
    price: 100,
    damage: 100,
    range: 100,
  },
  ninja: {
    name: "Ninja",
    description: "Have you seen him?",
    image: assets.towers.ninja,
    projectileImage: assets.projectiles.shuriken,
    price: 100,
    damage: 100,
    range: 100,
  },
  sorcerer: {
    name: "Sorcerer",
    description: "He can do more than just card tricks",
    image: assets.towers.sorcerer,
    projectileImage: assets.projectiles.spell,
    price: 100,
    damage: 100,
    range: 100,
  },
  deserter: {
    name: "Deserter",
    description: "His friends call him a coward, but for the people, he is their only salvation from evil.",
    image: assets.towers.deserter,
    projectileImage: assets.projectiles.flame,
    price: 100,
    damage: 100,
    range: 100,
  }
};

export const EnemyStats = {
  goblinRider: {
    name: "Goblin Rider",
    description: "Quick goblin rider, that excels with his agility",
    image: assets.enemies.goblinRider,
    hp: 50,
    speed: 2,
    reward: 10,
  },
  camelRider: {
    name: "Camel Rider",
    description: "Fast unit from the desert.",
    image: assets.enemies.camelRider,
    hp: 75,
    speed: 2,
    reward: 15,
  },
  voidling: {
    name: "Voidling",
    description: "I .... am speed.",
    image: assets.enemies.voidling,
    hp: 50,
    speed: 4,
    reward: 8,
  },
  ogre: {
    name: "Ogre",
    description: "Head1: I AM READY<br>Head2: friends call me ogre.",
    image: assets.enemies.ogre,
    hp: 300,
    speed: 0.5,
    reward: 50,
  },
  azog: {
    name: "Azog",
    description: "Mighty warchief of orcs.",
    image: assets.enemies.azog,
    hp: 150,
    speed: 1.2,
    reward: 30,
  },
  lucifer: {
    name: "Lucifer",
    description: "The sending of hell itself",
    image: assets.enemies.lucifer,
    hp: 6666,
    speed: 0.6,
    reward: 666,
  },
};
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
assets.towers.deserter.src = './assets/img/towers/Deserter.png'; // Přidáno

// Projectiles & Effects
assets.projectiles.shuriken.src = './assets/img/projectiles/ShurikenProjectile.png';
assets.projectiles.axe.src = './assets/img/projectiles/AxeProjectile.png';
assets.projectiles.spell.src = './assets/img/projectiles/SpellProjectile.png';
assets.projectiles.sword.src = './assets/img/projectiles/SwordProjectile.png';
assets.projectiles.flame.src = './assets/img/projectiles/FlameProjectile.png'; // Přidáno
assets.effects.bloodSplash.src = './assets/img/effects/BloodSplash.png';

// Tiles
assets.tiles.path.src = './assets/img/tiles/path/CobblestonePath.png';
assets.tiles.solid1.src = './assets/img/tiles/SolidFlowers.png';
assets.tiles.solid2.src = './assets/img/tiles/SolidGrass.png';
assets.tiles.solid3.src = './assets/img/tiles/SolidStones.png';
