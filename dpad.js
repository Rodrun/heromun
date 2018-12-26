// D-Pad module
import {
    Entity
} from "./entity.js";
import {
    vectorDifference,
    Vector,
    toDeg
} from "./util.js";

/**
 * On-screen DPad. This assumes the DPad is circular.
 */
export class DPad extends Entity {
    /**
     * Construct a new DPad.
     * @param {*} game Phaser Game instance.
     * @param {*} x Center X.
     * @param {*} y Center Y.
     * @param {*} w Width of entire DPad.
     * @param {*} alpha Alpha of sprite, unset default is 0.5.
     */
    constructor(game, x, y, w, alpha) {
        super(game);
        this.angle = 0; // Input angle in radians
        this.active = false; // Is being touched?
        this.sprite = game.add.sprite(x, y, "dpad");
        this.sprite.alpha = alpha || .5;
        this.sprite.smoothed = false;
        this.sprite.scale.setTo(w, w);
        this.sprite.anchor.setTo(.5, .5);
        game.physics.arcade.enable(this.sprite);
        this.sprite.body.setCircle(this.sprite.body.halfWidth);
        this.sprite.inputEnabled = true;
        //this.sprite.fixedToCamera = true;

        // Disable active property
        this.sprite.events.onInputOut.add(() => {
            this.active = false;
        }, this);
        // Enable active property
        this.sprite.events.onInputOver.add(() => {
            this.active = true;
        }, this);
    }

    update() {
        super.update();
        // Calculate angle on active input
        if (this.active) {
            // In radians
            this.angle = this.game.physics.arcade.angleToPointer(this.sprite);
        }
    }

    render() {
        super.render();
    }

    /**
     * Check if input is active.
     */
    isActive() {
        return this.active;
    }

    /**
     * Get the input angle in radians.
     */
    getAngle() {
        return this.angle;
    }
}