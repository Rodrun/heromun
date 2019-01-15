import { toRad, toDeg, Vector, getRandomInt } from "./util.js";

export const DEBUG = false; // Show debug info/bodies

// Monster constants
const TYPE_CHASER = "chaser";
const TYPE_SHOOTER = "shooter";
const TYPE_CHARGER = "charger";

export class Entity {
    /**
     * Construct a new Entity.
     * @param game Reference to the Phaser Game object.
     */
    constructor(game) {
        this.game = game;
        this.sprite = null; // Children will deal with this
        this.health = 1;
        this.speed = 60;
        this.damage = 1;
        this.componentList = [];
    }

    update() {
        this.componentList.forEach((comp) => comp.update());
    }

    render() {
        if (DEBUG && this.sprite) {
            // Enable body debug
            this.game.debug.body(this.sprite);
        }
    }

    // Add a component
    addComponent(comp) {
        this.componentList.push(comp);
    }
}

/**
 * Monster that chases the hero.
 */
export class Monster extends Entity {
    /**
     * Construct a Monster.
     * @param game
     * @param x
     * @param y
     * @param scale Entity render scale.
     * @param imageName Name of cached image for monster sprite.
     * @param hero Reference to Hero object.
     */
    constructor(game, x, y, scale, imageName, hero) {
        super(game);
        this.sprite = this.game.add.sprite(x, y, imageName);
        this.sprite.anchor.setTo(.5, .5);
        this.sprite.smoothed = false; // Keep sharp even when scaled
        this.sprite.scale.setTo(scale, scale);
        this.health = 1; // default
        this.speed = 45; // default
        this.damage = 1; // default
        this.hero = hero;
        this.bounceBack = false; // Bouncing back?
        this.bounceTicks = 0; // Ticks for bounceBack
        this.type = "chaser"; // Chases hero?

        game.physics.arcade.enable(this.sprite);
    }

    update() {
        super.update();
        if (this.isAlive()) {
            if (this.type == "chaser") {
                this.chaseUpdate();
            }

            this.bounceUpdate(this.sprite.body);
        } else {
            this.sprite.kill();
        }
    }

    render() {
        super.render();
    }

    // Update monster to bounce backwards (if bounceBack = true)
    bounceUpdate(sprite) {
        if (this.bounceBack) {
            this.bounceTicks += 1;

            // "bounce" in the opposite direction;
            sprite.velocity.x = -sprite.velocity.x;
            sprite.velocity.y = -sprite.velocity.y;

            if (this.bounceTicks >= 20) {
                this.bounceBack = false;
            }
        } else {
            this.bounceTicks = 0;
        }
    }
    
    // Trigger a bounce back maneuver
    bounceBack() {
      this.bounceBack = true;
    }

    // Update monster to chase hero
    chaseUpdate() {
        this.sprite.angle = toDeg(this.game.physics.arcade.angleBetween(
            this.sprite,
            this.hero.sprite
        ));

        let sprite = this.sprite.body;
        let speed = this.speed;
        sprite.velocity.x = Math.cos(toRad(this.sprite.angle)) * speed;
        sprite.velocity.y = Math.sin(toRad(this.sprite.angle)) * speed;

        // Fix facing angle after calculating velocity to simplify things
        this.sprite.angle += 90;
    }

    isAlive() {
        return this.health > 0;
    }
}

// Ugly eye monster, weakest enemy
export class EyeMonster extends Monster {
    constructor(game, x, y, scale, hero) {
        super(game, x, y, scale, "eye", hero);
        this.health = 2;
    }

    update() {
        super.update();
    }

    render() {
        super.render();
    }
}

// Demon monster, stronger than eye
export class DemonMonster extends Monster {
    constructor(game, x, y, scale, hero) {
        super(game, x, y, scale, "demon", hero);
        this.speed = 69;
        this.health = 4;
        this.damage = 2;
    }

    update() {
        super.update();
    }

    render() {
        super.render();
    }
}

export class Weapon extends Entity {
    /**
     * @param {*} game Phaser Game object.
     * @param {*} hero Hero object.
     * @param {*} scale Sprite scale.
     * @param {*} weaponInfo Weapon info object (see info.js).
     */
    constructor(game, hero, scale, weaponInfo, critsEnabled) {
        super(game);
        this.weaponInfo = weaponInfo;
        this.sprite = this.game.add.sprite(0, 0, weaponInfo.resource);
        this.sprite.visible = false;
        game.physics.arcade.enable(this.sprite);
        this.hero = hero;
        this.sprite.smoothed = false;
        this.sprite.anchor.setTo(.5, .5);
        this.sprite.scale.setTo(scale, scale);
        this.attack = false; // Currently attacking?
        this.tick = 0; // Visible ticks
        this.critsEnabled = critsEnabled; // Crits enabled flag
        this.criticalHit = false; // Attack was crit?
    }

    update() {
        super.update();
        // Updates the tick if in attack state
        if (this.attack) {
            // Update position
            let front = this.getFrontOfHero();
            this.sprite.x = front.x;
            this.sprite.y = front.y;
            this.sprite.rotation = this.hero.sprite.rotation;

            if (this.tick >= 20) {
                this.tick = 0;
                this.attack = false;
                this.sprite.visible = false;
            } else {
                this.tick += 1;
                this.sprite.visible = true;
            }
        }
    }

    /**
     * Get the center Vector in front of the hero.
     * @return Vector.
     */
    getFrontOfHero() {
        let hero = this.hero.sprite;
        let b = (hero.width + this.sprite.width) / 2;
        let x = hero.x + (-b * Math.cos(hero.rotation + Math.PI / 2));
        let y = hero.y + (-b * Math.sin(hero.rotation + Math.PI / 2));
        return new Vector(x, y);
    }

    render() {
        super.render();
    }
}
