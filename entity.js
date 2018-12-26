import { toRad, toDeg } from "./util.js";

const DEBUG = false; // Show debug info/bodies

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

    // Update monster to bounce backwards
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
        /** 
        if (angle < 180 && angle < 270) {
            // Detected to the left
            sprite.velocity.x = speed;
        } else { // Detected to the right
            sprite.velocity.x = -speed;
        }

        if (angle < 270 && angle > 90) {
            // Detected above
            sprite.velocity.y = speed;
        } else { // Detected below
            sprite.velocity.y = -speed;
        }
        */
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
    constructor(game, hero, sword, axe, damageSword, damageAxe, scale) {
        super(game);
        this.sprite = this.game.add.sprite(hero.x, hero.y, sword);
        this.hero = hero;
        this.axe = axe; // Reference to axe image name
        this.sprite.smoothed = false;
        this.sprite.anchor.setTo(.5, .5);
        this.sprite.scale.setTo(scale, scale);
        this.damage = damageSword;
        this.damageAxe = damageAxe;
        this.attack = false;
        this.tick = 0; // Visible ticks
    }

    update() {
        // Updates the tick if in attack state
        if (this.attack) {
            let hero = this.hero.sprite;
            // Update position
            this.sprite.angle = hero.angle;
            let b = (hero.width + this.sprite.width) / 2;
            this.sprite.x = hero.x + (-b * Math.cos(hero.rotation + Math.PI / 2));
            this.sprite.y = hero.y + (-b * Math.sin(hero.rotation + Math.PI / 2));

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

    render() {
        super.render();
    }
    
    switchTo(name) {
        if (name == "sword") {
            this.damageSword = damageSword; // May never be executed?
        } else {
            // Axe is assumed if not sword
            this.damage = this.damageAxe;
        }
    }
}

const VELOCITY = 140;

export class Hero extends Entity {
    constructor(game, x, y) {
        super(game);
        const WIDTH = this.game.world.width;
        const HEIGHT = this.game.world.height;
        this.sprite = game.add.sprite(WIDTH / 2, HEIGHT / 2, "heromun");
        this.sprite.anchor.setTo(.5, .5);
        this.sprite.smoothed = false;
        this.sprite.scale.setTo(4, 4);
        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    

        // Hero state & config //
        /**
         * Movement info for the hero in the x & y directions.
         */
        this.heroMovementsInfo = Object.freeze({
            y: {
                velocity: VELOCITY,
                name: "y", // String name of axis
                angle: 0 // default up
            },
            x: {
                velocity: VELOCITY,
                name: "x", // String name of axis
                angle: 90 // default to right
            }
        });

        /**
         * Hero movement configuration and state.
         * 
         * Each movement type has a "coord", which is an appropriate
         * object from heroMovementsInfo; a "mod", which should
         * be used to figure out the angle of the movement direction
         * via multiplication; an "angleAdd" which should be added to the
         * already given angle by coord; and "active" property, which should be
         * set if the hero is commanded to perform the movement (should
         * also be the only modified value).
         * 
         * Therefore:
         * 
         * Hero velocity = coord.velocity * mod
         * Hero movement angle = coord.angle + angleAdd
         * 
         * @see heroMovementsInfo
         */
        this.heroMovements = Object.freeze({
            up: {
                coord: this.heroMovementsInfo.y,
                mod: -1,
                angleAdd: 0,
            },
            down: {
                coord: this.heroMovementsInfo.y,
                mod: 1,
                angleAdd: 180,
            },
            left: {
                coord: this.heroMovementsInfo.x,
                mod: -1,
                angleAdd: 180,
            },
            right: {
                coord: this.heroMovementsInfo.x,
                mod: 1,
                angleAdd: 0,
            }
        });
    }

    update() {
        super.update();
    }

    render() {
        super.render();
    }

    /**
     * Command a hero movement.
     * 
     * @param dir Direction string, with a + or - and the name of the direction.
     *      + signifies perform, - signifies stop performing.
     *      For example:
     *      "+ up" = Move up; "- left" stop moving left.
     */
    move(dir) {
        const split = dir.split(" ");
        if (split.length >= 2) {
            try {
                let {
                    coord, // info
                    mod, // direction mod
                    angleAdd // angle supplement
                } = this.heroMovements[split[1]];
                // Set proper directional velocity
                this.sprite.body.velocity[coord.name] = split[0] == "+" ?
                    coord.velocity * mod : 0;
                // Set proper angle
                this.sprite.angle = coord.angle + angleAdd;
                console.log(this.sprite.angle);
            } catch (err) {
                console.warn("unable to perform hero movement: " + err);
            }
        }
    }
}
