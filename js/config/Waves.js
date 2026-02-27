// Soubor: js/config/Waves.js

export const LevelWaves = [
  {
    // Vlna 1: Zahřívací kolo
    groups: [
      { type: 'goblinRider', count: 5, interval: 1500 }
    ]
  },
  {
    // Vlna 2: Rychlý útok
    groups: [
      { type: 'goblinRider', count: 8, interval: 1000 },
      { type: 'voidling', count: 3, interval: 2000 }
    ]
  },
  {
    // Vlna 3: Těžkooděnci
    groups: [
      { type: 'goblinRider', count: 5, interval: 1000 },
      { type: 'azog', count: 2, interval: 3000 }
    ]
  },
  {
    // Vlna 4: Pouštní bouře
    groups: [
      { type: 'camelRider', count: 10, interval: 1200 }
    ]
  },
  {
    // Vlna 5: Rychlostní zkouška
    groups: [
      { type: 'voidling', count: 15, interval: 800 }
    ]
  },
  {
    // Vlna 6: Tank
    groups: [
      { type: 'goblinRider', count: 10, interval: 500 },
      { type: 'ogre', count: 1, interval: 5000 }
    ]
  },
  {
    // Vlna 7: Smíšená hrozba
    groups: [
      { type: 'azog', count: 5, interval: 2000 },
      { type: 'camelRider', count: 5, interval: 1000 }
    ]
  },
  {
    // Vlna 8: Horda
    groups: [
      { type: 'goblinRider', count: 20, interval: 400 },
      { type: 'voidling', count: 10, interval: 600 }
    ]
  },
  {
    // Vlna 9: Předvoj
    groups: [
      { type: 'ogre', count: 2, interval: 4000 },
      { type: 'azog', count: 10, interval: 1000 }
    ]
  },
  {
    // Vlna 10: Boss Fight
    groups: [
      { type: 'lucifer', count: 1, interval: 5000 }, // Boss
      { type: 'voidling', count: 20, interval: 500 } // Doprovod
    ]
  },
  // --- NOVÉ VLNY ---
  {
    // Vlna 11: Rychlá smrt
    groups: [
      { type: 'voidling', count: 30, interval: 400 }
    ]
  },
  {
    // Vlna 12: Těžká jízda
    groups: [
      { type: 'camelRider', count: 15, interval: 800 },
      { type: 'azog', count: 10, interval: 1200 }
    ]
  },
  {
    // Vlna 13: Ogre Party
    groups: [
      { type: 'ogre', count: 5, interval: 3000 },
      { type: 'goblinRider', count: 20, interval: 300 }
    ]
  },
  {
    // Vlna 14: Luciferův návrat
    groups: [
      { type: 'lucifer', count: 1, interval: 1000 },
      { type: 'azog', count: 10, interval: 1500 }
    ]
  },
  {
    // Vlna 15: Smíšený chaos
    groups: [
      { type: 'goblinRider', count: 15, interval: 300 },
      { type: 'voidling', count: 15, interval: 300 },
      { type: 'camelRider', count: 10, interval: 600 }
    ]
  },
  {
    // Vlna 16: Elitní jednotka
    groups: [
      { type: 'azog', count: 15, interval: 800 },
      { type: 'ogre', count: 5, interval: 2000 }
    ]
  },
  {
    // Vlna 17: Záplava
    groups: [
      { type: 'goblinRider', count: 100, interval: 150 } // Extrémní spam
    ]
  },
  {
    // Vlna 18: Rychlí a zběsilí
    groups: [
      { type: 'voidling', count: 40, interval: 300 },
      { type: 'camelRider', count: 20, interval: 500 }
    ]
  },
  {
    // Vlna 19: Peklo
    groups: [
      { type: 'lucifer', count: 3, interval: 5000 },
      { type: 'ogre', count: 10, interval: 1000 }
    ]
  },
  {
    // Vlna 20: Konec světa
    groups: [
      { type: 'lucifer', count: 5, interval: 4000 },
      { type: 'voidling', count: 50, interval: 200 },
      { type: 'azog', count: 30, interval: 500 }
    ]
  }
];
