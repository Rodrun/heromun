/**
 * A backpack stores items that the hero collects.
 */
export class Backpack {
    /**
     * @constructor
     * @param {*} maxSlots Maximum slots count.
     */
    constructor(maxSlots) {
        this.maxSlots = maxSlots; // Max slots
        /**
         * Item slots. Each key is the item's "storage" value, with its
         * value being the quantity of that item in the slot.
         */
        this.slots = new Map();
    }

    /**
     * Check if the backpack is full.
     * @returns If amount of used slots >= max slots.
     */
    isFull() {
        return this.slots.length >= this.maxSlots;
    }

    /**
     * Add an item. Will increment count in slot if slot already exists,
     * otherwise will create a new slot and 
     * @param item Item to add.
     * @param n Quantity of given item to add.
     * @returns A promise, where a rejection means a full backpack or
     *      given item is not an Object.
     */
    add(item, n) {
        return new Promise((resolve, reject) => {
            if (this.isValid(item) && n >= 0) {
                if (!this.has(item) && !this.isFull()) {
                    // Create a new slot, if not full
                    this.slots.set(item.storage, n);
                    resolve();
                } else {
                    // Slot exists, increment quantity
                    const prevAmt = this.getQuantityOf(item);
                    this.slots.set(item.storage, prevAmt + n);
                    resolve();
                }
            } else {
                reject(); // Invalid item
            }
        });
    }

    /**
     * Remove quantity amount of item in backpack, if any.
     * @param {*} item Item to look for.
     * @param {*} quantity Quantity to remove.
     * @returns Remaining quantity of item.
     */
    remove(item, quantity) {
        this.slots.get(item.storage) -= quantity;
        return this.slots.get(item.storage);
    }

    /**
     * Get the quantity of an item slot.
     * @param {*} item Item to look for.
     * @returns Quantity of searched item, otherwise -1 if it does not exist.
     */
    getQuantityOf(item) {
        if (this.isValid(item)) {
            if (this.has(item.storage)) {
                return this.slots.get(item.storage);
            }
        }
        return -1;
    }

    /**
     * Check if slot of given item exists.
     * @param item Item to look for.
     * @returns If item slot exists. Will also return false if item does not have
     *      "storage" property.
     */
    has(item) {
        if (this.isValid(item)) {
            return this.slots.has(item.storage);
        }
        return false;
    }

    /**
     * Very minimal validation check for an item to be added.
     * to bookbag. (For now)
     * @param {*} item Item to check validity for.
     * @returns If item is valid.
     */
    isValid(item) {
        return "storage" in item;
    }
}
