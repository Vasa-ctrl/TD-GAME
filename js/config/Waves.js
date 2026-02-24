// Soubor: js/core/waves.js

export const LevelWaves = [
  {
    // Vlna 1
    groups: [
      { type: 'goblinRider', count: 5, interval: 1000 }, // 5 goblinů, každou vteřinu
      { type: 'ogre', count: 1, interval: 2000 }         // Nakonec 1 boss
    ]
  },
  {
    // Vlna 2
    groups: [
      { type: 'goblinRider', count: 10, interval: 800 }, // Rychlejší goblini
      { type: 'azog', count: 3, interval: 1500 },        // 3 střední nepřátelé
      { type: 'lucifer', count: 1, interval: 3000 }      // 1 velký boss na závěr
    ]
  }
];
