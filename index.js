/*
 * Entry point for "Heromun". Mini gift for her.
 * 
 * TODO: Optimize everything! Finish!
 * By Juan Mendez.
 */
import { Intro } from "./intro.js";
import { DEBUG, DemonMonster, EyeMonster, Weapon } from "./entity.js";
import { Weapons } from "./info.js";
import { Hero } from "./hero.js";
import { DPad } from "./dpad.js";
import { cap } from "./util.js";

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

var game = new Phaser.Game(WIDTH, HEIGHT,
    Phaser.AUTO, "Heromun");

// Long-clickable button for user
function Button(x, y, scale, imageName, onDown, onUp) {
    let button = game.add.button(x, y, imageName, () => {}, this);
    button.scale.setTo(scale, scale);
    button.onInputDown.add(onDown, this);
    button.onInputUp.add(onUp, this);
    //button.fixedToCamera = true;
    return button;
}

class Game extends Phaser.State {
    constructor() {
        super();
        //this.gameSignal = new Phaser.Signal();
        // Input
        this.dpad;

        // Entity
        this.hero; // Player
        this.weapon; // Player weapon
        this.title; // Title sprite
        this.points = 0; // 1 for every kill
        this.isSwitchingWeapon = false; // Should be true for one frame
        this.healthPositions; // Health orb group
        this.monsters; // Monster group
        this.monsterEntities = []; // Monster entity list
        this.weaponSign; // Japanese text of current weapon
    }

    addMonster(m) {
        this.monsterEntities.push(m);
        this.monsters.add(m.sprite);
    }

    preload() {
        // TODO: atlas for textures
        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.load.image("heromun", "assets/heromun.png");
        game.load.image("sword", "assets/sword0.png");
        game.load.image("axe", "assets/axe0.png");

        game.load.image("ono", "assets/ono.png"); // "Axe!" in Japanese
        game.load.image("criticalhit", "assets/criticalhit.png");

        game.load.image("titlebutton", "assets/titlebutton.png");
        game.load.image("dpad", "assets/dpad.png"); // should rename
        game.load.image("attackbutton", "assets/attackbutton.png");

        game.load.image("eye", "assets/eye0.png");
        game.load.image("demon", "assets/demon0.png");
        game.load.image("healthorb", "assets/healthorb.png");

        game.load.image("gravel", "assets/gravel.png"); // Test
    }

    /**
     * Create actual game objects.
     */
    create() {
        game.stage.backgroundColor = "#575d66";

        this.hero = new Hero(game, WIDTH / 2, HEIGHT / 2);

        this.monsters = game.add.group();

        // Weapon
        this.weapon = new Weapon(game, this.hero, 4, Weapons.axe, false);

        // Attack button
        const BTN_SCALE = 1;
        this.attackButton = new Button(WIDTH, HEIGHT, BTN_SCALE, "attackbutton",
            () => this.attack(this.weapon), () => { });
        const BTN_WIDTH = this.attackButton.width;
        this.attackButton.x -= BTN_WIDTH * 1.5;
        this.attackButton.y -= BTN_WIDTH * 2;

        // DPad
        this.dpad = new DPad(game, game.camera.x, game.camera.height, 2.25);
        const dpadWidth = this.dpad.sprite.width;
        this.dpad.sprite.x += dpadWidth * .75;
        this.dpad.sprite.y -= dpadWidth * .75;
    }

    update() {
        this.dpad.update();
        this.hero.update();
        this.hero.move(this.dpad.angle, this.dpad.active ? cap(this.dpad.percent, 1) : 0);
        this.weapon.update();
        this.monsterEntities.forEach((monster) => {
            monster.update();
        });
    }

    render() {
        this.dpad.render();
        this.hero.render();
        this.weapon.render();
        this.monsterEntities.forEach((monster) => {
            monster.render();
        });
    }

    attack(weapon) {
        weapon.attack = true;
    }
}

game.state.add("Intro", Intro, false);
game.state.add("Game", Game, false);
game.state.start("Intro");
