const axios = require('axios');
const Item = require("./Item").Item;

function querySerialize(obj) {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}

class ShoppingCart {

    /**
     * Represents a shopping cart that stores multiple items.
     */
    constructor(dbIP, dbPort) {
        this.items = {};
        this.dbIP = dbIP;
        this.dbPort = dbPort;
    }
    /**
     * Adds an item and its quantity to the shopping cart.
     * 
     * @param {Item} item The item object to add.
     * @returns {Promise<Item>} Item object with the new amount stored in the cart.
     */
    Add(item) {
        return new Promise((res, err) => {
            var params = {name: item.GetName()};
            return axios.get(`http://${this.dbIP}:${this.dbPort}/item?${querySerialize(params)}`).then((response) => {
                if (response.status == 200) {
                    if (response.data == null) {
                        err([200, "Item not found in the warehouse."]);
                    }
                    var dbItem = new Item(response.data.name, response.data.amount);
                    var cartAmount = 0;
                    var hasItem = item.GetName() in this.items
                    if (hasItem) {
                        cartAmount = this.items[item.GetName()].GetAmount();
                    }
                    if (cartAmount + item.GetAmount() > dbItem.GetAmount()) {
                        err([200, "Not enough stock in the warehouse. Requested (" + (cartAmount + item.GetAmount()) + ") but stock is (" + dbItem.GetAmount() + ")."]);
                    } else {
                        if (hasItem) {
                            this.items[item.GetName()].AddAmount(item.GetAmount());
                        } else {
                            this.items[item.GetName()] = item;
                        }
                        res(this.items[item.GetName()]);
                    }
                } else {
                    err([500, "Failed to obtain warehouse data: HTTP Response " + response.status]);
                }
            }).catch((error) => err([500, "Failed to obtain warehouse data: " + error]));
        });
    }
    /**
     * Removes an item and its quantity from the shopping cart.
     * 
     * @param {Item} item The item object to remove.
     * @returns {Promise<Item>} Item object with the new amount stored in the cart, or null if all units removed.
     */
    Remove(item) {
        return new Promise((res,err) => {
            if (!(item.GetName() in this.items)) {
                err([200, "Item not present in cart."]);
            } else {
                this.items[item.GetName()].RemoveAmount(item.GetAmount());
                if (this.items[item.GetName()].GetAmount() === 0) {
                    delete this.items[item.GetName()];
                    res(null);
                } else res(this.items[item.GetName()]);
            }
        });
    }
    /**
     * 
     * @returns {Array<Item>} The contents of the cart.
     */
    GetContents() {
        return Object.values(this.items);
    }
    /**
     * 
     * @returns {string} The string representation of the object.
     */
    toString() {
        var res = "Shopping cart:\n";
        res += "\tContents: \n";
        Object.keys(this.items).forEach(name => res += "\t\t- " + this.items[name] + "\n");
        return res;
    }
}

class ShoppingCartGenerator {
    static async GetCart(serviceRegistryURL, databaseName, databaseVer) {
        return await axios.get(`http://${serviceRegistryURL}/find/${databaseName}/${databaseVer}`).then((response) =>{
            if (response.status == 200) {
                return new ShoppingCart(response.data.ip, response.data.port);
            } else return null;
        }).catch((err) => {return null;});
    }
}

module.exports = {ShoppingCartGenerator};
