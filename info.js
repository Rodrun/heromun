/*
 * Game item information. Everything here is referabble to sas an "item" under
 * a "category".
 */

 /**
 * Weapon information.
 * 
 * Movement animations to choose from:
 * - "frontPop" - Appear in front of hero briefly
 * - "semicricleSwing" - Rotate right-to-left in front of the hero
 * - "charge" - Appear in front of hero while player holds attack
 * 
 * Structured as so:
 * 
 * name: {
 *   resource: Resource string name,
 *   baseDamage: Integer > 0 to represent default damage,
 *   critDamage: Integer >= 0 to represent critical damage bonus,
 *   critChance: Decimal [0, 1) to represent chance of critical,
 *   animation: String name of movement animation,
 *   cooldown: Integer >= 0 to represent cool down time between use
 * }
 */
export const Weapons = Object.freeze({
    sword: {
        resource: "sword",
        baseDamage: 1, // Base damage points
        critDamage: 3, // Critical hit damage points
        critChance: .15, // Chance of a critical hit
        animation: "frontPop", // refers to the movement animation
        onDiscover: "swordDiscover" // discovery message resource
    },
    axe: {
        resource: "axe",
        baseDamage: 2,
        critDamage: 4,
        critChance: .15,
        animation: "semicricleSwing",
        onDiscover: "axeDiscover"
    },
    bow: {
        resource: "bow",
        baseDamage: 3,
        critDamage: 4,
        critChance: .1,
        animation: "charge",
        onDiscover: "bowDiscover"
    }
});
/**
 * Crafting materials.
 * 
 * Structured as:
 * 
 * name: {
 *   resource: Resource information
 *   storage: String of storage name in backpack,
 * }
 */
export const Materials = Object.freeze({
    dich: {
        resource: "dich",
        storage: "dich"
    }
});
/**
 * Destructible in-game world things, gives material.
 * 
 * Each resource structured as:
 * name: {
 *   resource: String of resource name,
 *   material: Object reference to the metrial it gives off,
 *   spawnChance: Percentage chance of spawning in the world
 * }
 */
export const Resources = Object.freeze({
    dichPlant: {
        resource: "dichPlant",
        material: Materials.dich, // Output
        spawnChance: .25 // Chance of spawning in the world
    }
});
/**
 * Potions can be crafted to assist the hero.
 * 
 * Each potion is structured as:
 * 
 * name: {
 *  resource: String of resource name,
 *  storage: String of storage name in backpack,
 *  recipe: [
 *    {
 *      item: Object of an in-game item,
 *      count: Integer >= 0
 *    }, ...
 *  ]
 * }
 */
export const Potions = Object.freeze({
    speed: {
        resource: "speedPotion",
        storage: "speedPotion",
        recipe: [
            {item: Materials.dich, count: 3}
        ]
    },
    heal: {
        resource: "healPotion",
        storage: "healPotion",
        recipe: [
            {item: Materials.dich, count: 2}
        ]
    }
});
