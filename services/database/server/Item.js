
class Item {
    /**
     * Object representing an Item with a certain amount of units.
     * 
     * @param {string} name Name of the item.
     * @param {number} amount Amount of the item.
     */
    constructor(name, amount) {
        this.name = name;
        if (amount <= 0) throw new Exception("Item amount can't be negative.");
        this.amount = amount;
    }
    /**
     * 
     * @returns {string} Name of the item.
     */
    GetName() {
        return this.name;
    }
    /**
     * 
     * @returns {number} Amount of the item.
     */
    GetAmount() {
        return this.amount;
    }
    /**
     * 
     * @param {number} amm Number of units to add or remove from the item.
     * @returns {number} The resulting amount after performing the operation.
     */
    AddAmount(amm) {
        if (amm < 0) return RemoveAmount(-amm);
        else this.amount += amm;
        return this.amount;
    }
    /**
     * 
     * @param {number} amm Number of units to remove from the item (must be >0).
     * @returns {number} The resulting amount after performing the operation.
     */
    RemoveAmount(amm) {
        if (amm < 0) throw new Exception("Invalid item amount specified.");
        var newAm = this.amount - amm;
        if (newAm < 0) throw new Exception("Item amount can't be negative.");
        this.amount = newAm;
        return this.amount;
    }
    /**
     * 
     * @returns {string} The string representation of the object.
     */
    toString() {
        return this.name + " (" + this.amount + ")";
    }
}

module.exports = {Item};