import { LevelWaves } from '../config/Waves.js';

export class WaveManager {
    constructor(game) {
        this.game = game;
        this.currentWaveIndex = -1; // Zatím žádná vlna nezačala
        this.isWaveActive = false;

        // Fronta nepřátel k vytvoření
        this.spawnQueue = [];
        this.spawnTimer = 0;
    }

    startNextWave() {
        if (this.isWaveActive) {
            console.log("Vlna už běží!");
            return;
        }

        this.currentWaveIndex++;

        // Kontrola, zda máme další vlnu
        if (this.currentWaveIndex >= LevelWaves.length) {
            console.log("Všechny vlny dokončeny! Vítězství!");
            return;
        }

        const waveConfig = LevelWaves[this.currentWaveIndex];
        console.log(`Spouštím vlnu ${this.currentWaveIndex + 1}`);

        this.isWaveActive = true;
        this.game.wave = this.currentWaveIndex + 1;
        this.game.updateUI();

        // Naplníme frontu nepřátel
        this.prepareSpawnQueue(waveConfig);
    }

    prepareSpawnQueue(waveConfig) {
        this.spawnQueue = [];
        let currentTimeOffset = 0;

        for (const group of waveConfig.groups) {
            for (let i = 0; i < group.count; i++) {
                // Přidáme nepřítele do fronty s časem, kdy se má objevit
                this.spawnQueue.push({
                    type: group.type,
                    time: currentTimeOffset
                });

                // Posuneme čas pro dalšího nepřítele
                // Ošetření pro případ, že interval je příliš malý (např. 1 ms)
                let interval = group.interval;
                if (interval < 10) interval = 1000; // Fallback na 1 sekundu

                currentTimeOffset += interval;
            }
        }

        // Resetujeme časovač
        this.spawnTimer = 0;
    }

    update(deltaTime, gameSpeed) {
        if (!this.isWaveActive) return;

        // Přičteme uplynulý čas (v ms) vynásobený rychlostí hry
        this.spawnTimer += deltaTime * gameSpeed;

        // Kontrola fronty
        while (this.spawnQueue.length > 0) {
            // Podíváme se na prvního nepřítele ve frontě
            const nextEnemy = this.spawnQueue[0];

            if (this.spawnTimer >= nextEnemy.time) {
                // Je čas ho vytvořit
                this.game.map.spawnEnemy(nextEnemy.type);

                // Odstraníme ho z fronty
                this.spawnQueue.shift();
            } else {
                // Ještě není čas, ukončíme cyklus (fronta je seřazená podle času)
                break;
            }
        }

        // Kontrola konce vlny
        // Vlna končí, když je fronta prázdná A na mapě nejsou žádní nepřátelé
        if (this.spawnQueue.length === 0 && this.game.map.enemies.length === 0) {
            this.isWaveActive = false;
            console.log("Vlna dokončena!");
            // Zde můžeme přidat bonus za dokončení vlny
        }
    }
}
