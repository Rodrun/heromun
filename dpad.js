// D-Pad module
import {
    Entity
} from "./entity.js";

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
        this.sprite = game.add.button(x, y, "dpad", () => { }, this);
        game.physics.arcade.enable(this.sprite);
        this.sprite.alpha = alpha || .5;
        this.sprite.smoothed = false;
        this.sprite.scale.setTo(w, w);
        //this.sprite.body.setCircle(this.sprite.body.halfWidth);
        this.sprite.anchor.setTo(.5, .5);
        this.sprite.inputEnabled = true;
        this.sprite.fixedToCamera = false;
        this.activePointer = null;

        // Disable active property
        this.sprite.onInputUp.add(() => {
            this.active = false;
            this.activePointer = null;
        }, this);
        // Enable active property
        this.sprite.onInputDown.add(() => {
            this.active = true;
            this.activePointer = this.game.input.activePointer;
        }, this);
    }

    update() {
        super.update();
        // Calculate angle on active input
        if (this.active) {
            // In radians
            this.angle = this.game.physics.arcade.angleToPointer(this.sprite,
                this.activePointer);
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