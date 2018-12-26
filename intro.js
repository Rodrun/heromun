// Intro module
import {
    SlideInSign
} from "./sign.js";
import {
    Vector
} from "./util.js";

export class Intro extends Phaser.State {

    /**
     * Construct the Intro state.
     * @param {*} game Phaser game object.
     */
    constructor(game) {
        super();
        this.game = game;
        this.title; // Title sprite
    }

    preload() {
        this.game.load.image("title", "assets/title.png");
    }

    create() {
        this.game.stage.backgroundColor = "#575d66";
        // One-time animation, uses tween so no need for update()
        const DURATION = 2000; // ms
        this.title = new SlideInSign(this.game,
            new Vector(-100, this.game.height / 2), // origin
            new Vector(this.game.width / 2, this.game.height / 2), // final
            "title",
            DURATION,
            () => { // On completion
                console.log("title animation finished");
                this.game.state.start("Game");
                this.title.sprite.kill();
            });
        this.title.start();
    }

}
