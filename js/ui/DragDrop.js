/**
 * Třída pro správu Drag & Drop interakce na herním plátně.
 */
export class DragDrop {
    /**
     * @param {Game} game Instance hry.
     * @param {HTMLCanvasElement} canvas Herní plátno.
     */
    constructor(game, canvas) {
        this.game = game;
        this.canvas = canvas;

        this.setupListeners();
    }

    setupListeners() {
        // Povolení dropu
        this.canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';

            const { x, y } = this.getMouseGridPosition(e);
            this.game.highlightTile(x, y);
        });

        // Zpracování dropu
        this.canvas.addEventListener('drop', (e) => {
            e.preventDefault();

            // Získáme klíč věže (např. "ben")
            const key = e.dataTransfer.getData('text/plain');
            const { x, y } = this.getMouseGridPosition(e);

            console.log(`Dropnuta věž: ${key} na pozici [${x}, ${y}]`);

            // Zavoláme metodu hry pro postavení věže
            this.game.buildTower(key, x, y);
        });
    }

    /**
     * Vypočítá souřadnice dlaždice v mřížce na základě pozice myši.
     * @param {DragEvent} e Událost myši.
     * @returns {{x: number, y: number}} Souřadnice X a Y v mřížce.
     */
    getMouseGridPosition(e) {
        const rect = this.canvas.getBoundingClientRect();

        // Pozice myši relativně k canvasu
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Přepočet na souřadnice mřížky
        // Musíme vzít v úvahu aktuální škálování canvasu (pokud se liší velikost CSS a atributů width/height)
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        const canvasX = mouseX * scaleX;
        const canvasY = mouseY * scaleY;

        const gridX = Math.floor(canvasX / this.game.tileSize);
        const gridY = Math.floor(canvasY / this.game.tileSize);

        return { x: gridX, y: gridY };
    }
}
