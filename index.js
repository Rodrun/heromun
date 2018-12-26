/*
 * Entry point for "Heromun". Mini gift for her.
 * 
 * TODO: Optimize everything! Finish!
 * By Juan Mendez.
 */
import { Intro } from "./intro.js";
import { DemonMonster, EyeMonster, Weapon, Hero } from "./entity.js";
import { getRandomInt } from "./util.js";

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

// Game states
// *_FIRE = meant to be a loading state/one frame
const INTRO_FIRE = 0;
const INTRO = .5;
const GAMEPLAY_FIRE = 1;
const GAMEPLAY = 1.5;

var game = new Phaser.Game(WIDTH, HEIGHT,
    Phaser.AUTO, "Heromun");
var graphics = null; // define later

// Long-clickable button for user
function Button(x, y, scale, imageName, onDown, onUp) {
    let button = game.add.button(x, y, imageName, () => {}, this);
    button.scale.setTo(scale, scale);
    button.onInputDown.add(onDown, this);
    button.onInputUp.add(onUp, this);
    return button;
}

/**
 * Show "sign" that wiggles. Will return to original position when done.
 * @param {*} sprite 
 * @param {*} x New x.
 * @param {*} y New y.
 * @param {*} duration Duration of sign showing
 * @param {*} onComplete Supplementary callback on completion of animation.
 */
function showSign(sprite, x, y, duration, onComplete) {
    const prevX = sprite.x;
    const prevY = sprite.y;
    sprite.x = x;
    sprite.y = y;
    let wiggle = game.add.tween(sprite)
        .to({
                y: sprite.y + (sprite.height * .45)
            }, // properties
            duration, // duration
            Phaser.Easing.Elastic.InOut,
            true, // autostart
        );
    wiggle.onComplete.addOnce(() => {
        sprite.x = prevX;
        sprite.y = prevY;
        if (onComplete != null)
            onComplete();
    }, this);
}

class Game extends Phaser.State {
    constructor() {
        super();
        this.gameState = GAMEPLAY; // TODO remove this
        //this.gameSignal = new Phaser.Signal();
        // Input
        this.upButton;
        this.downButton;
        this.leftButton;
        this.rightButton;
        this.attackButton;

        // Entity
        this.hero; // Player
        this.weapon; // Player weapon
        this.title; // Title sprite
        this.points = 0; // 1 for every kill
        this.isSwitchingWeapon = false; // Should be true for one frame
        this.heroDirection = "up"; // Weapon follows this
        this.heroHealth = 6;
        this.heroDamage = 1; // Axe does 3x damage
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
        // TODO: spritesheets
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
    }

    /**
     * Create actual game objects.
     */
    create() {
        game.stage.backgroundColor = "#575d66";

        this.hero = new Hero(game, WIDTH / 2, HEIGHT / 2);

        this.monsters = game.add.group();
        //let eye = new EyeMonster(this.hero.x - 80, HEIGHT / 2, 4, this.hero);
        for (let i = 0; i < 2; i++) {
            let demon = new DemonMonster(game, getRandomInt(WIDTH), getRandomInt(HEIGHT),
                4, this.hero);
            let eye = new EyeMonster(game, getRandomInt(WIDTH), getRandomInt(HEIGHT),
                4, this.hero);
            this.addMonster(demon);
            this.addMonster(eye);
        }

        // Weapon
        this.weapon = new Weapon(game, this.hero, "sword", "axe", 1, 3, 4);
        this.weaponSign = game.add.sprite(-999, -999, "ono"); // Show when axe given
        this.weaponSign.anchor.setTo(.5, .5);
        this.critSign = game.add.sprite(-999, -999, "criticalhit");
        this.critSign.anchor.setTo(.5, .5);

        // Set up DPAD & attack buttons 
        const BTN_SCALE = 1;
        this.leftButton = new Button(0, HEIGHT, BTN_SCALE, "dpad",
            () => this.move("+ left"), () => this.move("- left"));
        this.rightButton = new Button(0, HEIGHT, BTN_SCALE, "dpad",
            () => this.move("+ right"), () => this.move("- right"));
        this.upButton = new Button(0, HEIGHT, BTN_SCALE, "dpad",
            () => this.move("+ up"), () => this.move("- up"));
        this.downButton = new Button(0, HEIGHT, BTN_SCALE, "dpad",
            () => this.move("+ down"), () => this.move("- down"));
        this.attackButton = new Button(WIDTH, HEIGHT, BTN_SCALE, "attackbutton",
            () => this.attack(this.weapon), () => { });

        const BTN_WIDTH = this.leftButton.width;
        // Set button x
        //this.leftButton.x += 0;
        this.rightButton.x += BTN_WIDTH * 2;
        this.upButton.x += BTN_WIDTH;
        this.downButton.x += this.upButton.x;
        this.attackButton.x -= BTN_WIDTH * 1.5;
        // Set button y
        this.leftButton.y -= BTN_WIDTH * 2;
        this.rightButton.y -= BTN_WIDTH * 2;
        this.upButton.y -= BTN_WIDTH * 3;
        this.downButton.y -= BTN_WIDTH;
        this.attackButton.y -= BTN_WIDTH * 2;
    }

    update() {
        this.hero.update();
        this.weapon.update();
        this.monsterEntities.forEach((monster, i) => {
            monster.update();
        });
    }
    
    // Call the hero's move function
    move(dir) {
        this.hero.move(dir);
    }

    render() {
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
