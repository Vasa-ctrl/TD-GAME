/**
 * Base class representing a generic object within the game world.
 */
export class GameObject{
    /**
     * Create a game object.
     * @param {number} x - The x-coordinate of the object.
     * @param {number} y - The y-coordinate of the object.
     * @param {number} width - The width of the object.
     * @param {number} height - The height of the object.
     */
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /**
     * Renders the object to the canvas context.
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     */
    draw(ctx) {}

    /**
     * Updates the object's state (e.g., position, animation).
     */
    update() {}
}
