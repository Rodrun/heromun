// Simple sign/effects module
/**
 * Base class for a sign meant to dissappear.
 */
export class TemporarySign {
    /**
     * Construct a new TemporarySign.
     * @param {*} game Phaser Game reference.
     * @param {*} origin Origin Vector.
     * @param {*} final Final Vector.
     * @param {*} name Name of image asset.
     * @param {*} duration Duration in ms.
     */
    constructor(game, origin, final, name, duration, onComplete) {
        this.game = game;
        this.sprite = this.game.add.sprite(origin.x, origin.y, name);
        this.sprite.visible = false;
        this.origin = origin;
        this.final = final;
        this.duration = duration;
        this.onComplete = onComplete; // Called when animation is complete
    }

    start() {} // To be overridden by children
}

/**
 * Disappearing sign that moves from 2 points in given
 * duration, and then dissapears.
 * 
 * Useful for temporary upgrade/critical hit notifications.
 */
export class DisappearingSignSpawner extends TemporarySign {
    /**
     * @param {*} game Phaser Game reference.
     * @param {*} name Name of cached image.
     * @param {*} origin Origin point Vector.
     * @param {*} final Final point Vector.
     * @param {*} duration Duration of sign life after spawning.
     */
    constructor(game, name, origin, final, duration, onComplete) {
        super(game, origin, final, duration, onComplete);
        this.sprite = this.game.add.sprite(origin.x, origin.y, name);

        this.drop = this.game.add.tween(this.sprite).to({
            x: final.x,
            y: final.y
        },
        duration,
        Phaser.Easing.Bounce.In,
        false);
    }

    start() {
        this.drop.start();
    }
}

/**
 * Sign that slides in, useful for title or text etc.
 * Basically a wrapper for an exponential easing tween.
 */
export class SlideInSign extends TemporarySign {
    constructor(game, origin, final, name, duration, onComplete) {
        super(game, origin, final, name, duration, onComplete);
        this.sprite = this.game.add.sprite(
            origin.x,
            origin.y,
            name
        );
        this.sprite.anchor.setTo(.5, .5);

        // Slide in tween
        this.osc =
            this.game.add.tween(this.sprite)
            .to({
                    x: this.game.world.width / 2,
                    y: this.game.world.height / 2
                },
                duration,
                Phaser.Easing.Exponential.InOut,
                false
            );
        this.osc.onComplete.addOnce(this.onComplete, this);
    }

    start() {
        this.osc.start();
    }
}
