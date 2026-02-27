export class Projectile {
  // OPRAVA: Přejmenovali jsme parametr "imageSrc" na "image", protože teď dostáváme rovnou objekt
  constructor(x, y, target, damage, image, speed = 5) {
    this.x = x;
    this.y = y;
    this.target = target;
    this.damage = damage;
    this.speed = speed * 0.015; // Zpomalíme pro herní měřítko (dlaždice)
    this.radius = 0.2; // Poloměr v dlaždicích
    this.markedForDeletion = false;

    // OPRAVA: Už nevytváříme new Image(), prostě si uložíme ten, co nám dala věž!
    this.image = image;
  }

  update(gameSpeed) {
    if (!this.target || this.target.hp <= 0) {
      this.markedForDeletion = true;
      return;
    }

    // Vypočítáme směr k cíli
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Aktuální rychlost
    const currentSpeed = this.speed * gameSpeed;

    // Pokud jsme zasáhli cíl (jsme dostatečně blízko)
    if (distance < currentSpeed + this.target.radius) {
      this.target.takeDamage(this.damage);
      this.markedForDeletion = true;
      return;
    }

    // Pohyb k cíli
    const velocityX = (dx / distance) * currentSpeed;
    const velocityY = (dy / distance) * currentSpeed;

    this.x += velocityX;
    this.y += velocityY;
  }

  draw(ctx, tileSize) {
    // OPRAVA: Kontrolujeme pouze, jestli objekt image existuje a je načtený
    if (this.image && this.image.complete) {
      // Vykreslíme obrázek
      // Vycentrujeme ho na souřadnice střely
      const size = tileSize * 0.5; // Velikost projektilu (polovina dlaždice)
      const offset = size / 2;

      // Můžeme přidat rotaci podle směru letu, ale prozatím stačí statický obrázek
      ctx.drawImage(
        this.image,
        this.x * tileSize - offset,
        this.y * tileSize - offset,
        size,
        size
      );
    } else {
      // Fallback: Žlutý kruh
      ctx.beginPath();
      ctx.arc(this.x * tileSize, this.y * tileSize, this.radius * tileSize, 0, Math.PI * 2);
      ctx.fillStyle = 'yellow';
      ctx.fill();
      ctx.closePath();
    }
  }
}
