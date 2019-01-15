import { Entity } from "./entity.js";

// Speed of Hero
const SPEED = 140;

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
    }

    update() {
        super.update();
    }

    render() {
        super.render();
    }

    /**
     * Move the hero.
     * @param angle Angle in radians.
     * @param speed Percent of full speed of hero.
     */
    move(angle, percent) {
        const speed = SPEED * percent;
        this.sprite.rotation = angle + Math.PI / 2;
        this.sprite.body.velocity.x = Math.cos(angle) * speed;
        this.sprite.body.velocity.y = Math.sin(angle) * speed;
    }
}
