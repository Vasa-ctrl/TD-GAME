/**
 * Class responsible for handling Drag & Drop interactions on the game canvas.
 * Integrates native HTML5 Drag and Drop events to allow building towers.
 */
export class DragDrop {
  /**
   * Initializes the DragDrop controller.
   * @param {Game} game - The main game instance.
   * @param {HTMLCanvasElement} canvas - The primary rendering canvas.
   */
  constructor(game, canvas) {
    this.game = game;
    this.canvas = canvas;

    this.setupListeners();
  }

  /**
   * Attaches necessary DOM event listeners for 'dragover' and 'drop' to the canvas.
   */
  setupListeners() {
    this.canvas.addEventListener('dragover', (e) => {
      e.preventDefault(); // Necessary to allow dropping
      e.dataTransfer.dropEffect = 'copy';

      const { x, y } = this.getMouseGridPosition(e);
      this.game.highlightTile(x, y);
    });

    this.canvas.addEventListener('drop', (e) => {
      e.preventDefault();

      const key = e.dataTransfer.getData('text/plain');
      const { x, y } = this.getMouseGridPosition(e);

      console.log(`Dropnuta věž: ${key} na pozici [${x}, ${y}]`);

      this.game.buildTower(key, x, y);
    });
  }

  /**
   * Calculates the grid coordinates based on the current mouse position over the canvas.
   * Takes into account canvas scaling via CSS.
   * * @param {DragEvent} e - The native drag event.
   * @returns {{x: number, y: number}} The resolved grid coordinates (X and Y).
   */
  getMouseGridPosition(e) {
    const rect = this.canvas.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    const canvasX = mouseX * scaleX;
    const canvasY = mouseY * scaleY;

    const gridX = Math.floor(canvasX / this.game.tileSize);
    const gridY = Math.floor(canvasY / this.game.tileSize);

    return { x: gridX, y: gridY };
  }
}
