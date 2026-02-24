import { Enemy } from '../models/Enemy.js';

export class WaveManager {
    constructor(wavesData) {
        this.waves = wavesData;
        this.currentWaveIndex = 0;   // Jakou vlnu hrajeme (0 = první vlna)
        this.currentGroupIndex = 0;  // Jakou skupinu ve vlně zrovna posíláme
        this.spawnedInGroup = 0;     // Kolik jsme jich v této skupině už poslali

        this.spawnTimer = 0;
        this.isWaveActive = false;
    }

    startNextWave() {
        if (this.currentWaveIndex < this.waves.length) {
            this.isWaveActive = true;
            this.currentGroupIndex = 0;
            this.spawnedInGroup = 0;
            this.spawnTimer = 0;
            console.log(`Začíná vlna ${this.currentWaveIndex + 1}!`);
        } else {
            console.log("Všechny vlny byly poraženy!");
        }
    }

    update(deltaTime, enemiesArray, startX, startY) {
        if (!this.isWaveActive) return;

        const currentWave = this.waves[this.currentWaveIndex];
        const currentGroup = currentWave.groups[this.currentGroupIndex];

        // Přičteme čas k našim stopkám
        this.spawnTimer += deltaTime;

        // Je čas poslat dalšího nepřítele z aktuální skupiny?
        if (this.spawnTimer >= currentGroup.interval) {

            // 1. Vytvoříme nepřítele a pošleme ho na mapu
            const newEnemy = new Enemy(startX, startY, currentGroup.type);
            enemiesArray.push(newEnemy);

            // 2. Zapíšeme si, že jsme ho poslali a vynulujeme stopky
            this.spawnedInGroup++;
            this.spawnTimer = 0;

            // 3. Kontrola: Odeslali jsme už všechny z této skupiny?
            if (this.spawnedInGroup >= currentGroup.count) {
                this.currentGroupIndex++; // Přepneme na další skupinu (např. z Goblinů na Ogry)
                this.spawnedInGroup = 0;  // Vynulujeme počítadlo pro novou skupinu

                // 4. Kontrola: Byla tohle poslední skupina v celé vlně?
                if (this.currentGroupIndex >= currentWave.groups.length) {
                    this.isWaveActive = false;
                    this.currentWaveIndex++;
                    console.log("Vlna kompletně odeslána na mapu.");
                }
            }
        }
    }
}
