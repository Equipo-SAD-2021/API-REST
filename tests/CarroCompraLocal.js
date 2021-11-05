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

const cartServiceName = "cart-service";
const cartServiceVer = "1.0.0";

class ShoppingCartLocal {

    /**
     * Represents a shopping cart that stores multiple items.
     */
    constructor(serviceRegistryURL, serviceRegistryPort) {
        this._serviceRegistryURL = serviceRegistryURL;
        this._serviceRegistryPort = serviceRegistryPort;
        this.uuid = null;
    }

    /**
     * Connects to the cart service.
     * 
     * @returns {Promise<ShoppingCartLocal>}
     */
    Connect() {
        return new Promise((res, err) => {
            return axios.get(`http://${this._serviceRegistryURL}:${this._serviceRegistryPort}/find/cart-service/1.0.0`).then((response) => {
                if (response.data) {
                    this.srvIP = response.data.ip;
                    this.srvPort = response.data.port;
                    
                    return axios.get(`http://${this.srvIP}:${this.srvPort}/cart`).then((response) => {
                        if (response.status == 200 && !response.data.error) {
                            this.uuid = response.data.uuid;
                            res(this);
                        } else {
                            err("Failed to obtain a shopping cart: " + response.data.error);
                        }
                    }).catch((error) => {
                        err("Failed to connect to the cart service: " + error);
                    });
                } else {
                    err("Failed to obtain service registry data.");
                }
            }).catch((error) => {
                err("Failed to connect to the service registry: " + error);
            });
        });
    }

    Disconnect() {
        var params = {uuid: this.uuid};
        return new Promise((res, err) => {
            return axios.delete(`http://${this.srvIP}:${this.srvPort}/cart?${querySerialize(params)}`).then((response) => {
                if (response.status == 200 && !response.data.error) {
                    this.uuid = null;
                    res(this);
                } else {
                    err("Failed to delete shopping cart: " + response.data.error);
                }
            }).catch((error) => {
                err("Failed to connect to the cart service: " + error);
            });
        });
    }

    /**
     * Adds an item and its quantity to the shopping cart.
     * 
     * @param {Item} item The item object to add.
     * @returns {Promise<Item>} Item object with the new amount stored in the cart.
     */
    Add(item) {
        return new Promise((res, err) => {
            var params = {uuid: this.uuid, item: item.GetName(), amount: item.GetAmount()};
            return axios.put(`http://${this.srvIP}:${this.srvPort}/cart/content?${querySerialize(params)}`).then((response) => {
                if (response.status == 200 && !response.data.error) {
                    res(new Item(response.data.name, response.data.amount));
                } else {
                    err("Failed to add item: " + response.data.error);
                }
            }).catch((error) => {
                err("Failed to connect to the cart service: " + error);
            });
        });
    }
    /**
     * Removes an item and its quantity from the shopping cart.
     * 
     * @param {Item} item The item object to remove.
     * @returns {Promise<Item>} Item object with the new amount stored in the cart, or null if all units removed.
     */
    Remove(item) {
        return new Promise((res, err) => {
            var params = {uuid: this.uuid, item: item.GetName(), amount: item.GetAmount()};
            return axios.delete(`http://${this.srvIP}:${this.srvPort}/cart/content?${querySerialize(params)}`).then((response) => {
                if (response.status == 200 && !response.data.error) {
                    if (response.data)
                        res(new Item(response.data.name, response.data.amount));
                    else
                        res(null);
                } else {
                    err("Failed to remove item: " + response.data.error);
                }
            }).catch((error) => {
                err("Failed to connect to the cart service: " + error);
            });
        });
    }
    /**
     * 
     * @returns {Promise<Array<Item>>} The contents of the cart.
     */
    GetContents() {
        return new Promise((res, err) => {
            var params = {uuid: this.uuid};
            return axios.get(`http://${this.srvIP}:${this.srvPort}/cart/content?${querySerialize(params)}`).then((response) => {
                if (response.status == 200 && !response.data.error) {
                    var ret = [];
                    response.data.forEach((item) => {
                        ret.push(new Item(item.name, item.amount));
                    })
                    res(ret);
                } else {
                    err("Failed to obtain shopping cart data: " + response.data.error);
                }
            }).catch((error) => {
                err("Failed to connect to the cart service: " + error);
            });
        });
    }
    /**
     * 
     * @returns {string} The string representation of the object.
     */
    static ContentsToString(contents) {
        var res = "Shopping cart:\n";
        res += "\tContents: \n";
        contents.forEach(item => res += "\t\t- " + item + "\n");
        return res;
    }
}

module.exports = {ShoppingCartLocal};
