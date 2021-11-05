
var mongoclient = require("mongodb").MongoClient;
const Item = require("./Item").Item;

class ItemDBControllerConnection {

    constructor() {
        this.db = null;
        this.client = null;
    }

    /**
     * Closes the connection to the database.
     * 
     * @returns {Promise}
     */
    Close() {
        return this.client.close();
    }

    /**
     * Obtains an Item object from the item name, with the stock present in the warehouse.
     * 
     * @param {string} itemName Name of the item to obtain.
     * @returns {Promise<Item>} Item object obtained from the name.
     */
    GetItem(itemName) {
        var collection = this.db.collection('products');
        return collection.findOne({ name: itemName }).then((data) => {
            return new Promise((cb) => {
                if (data)
                    cb(new Item(data.name, data.stock));
                else
                    cb(null);
            });
        });
    }

    /**
     * Adds several items to the warehouse, for testing purposes.
     * 
     * @returns {Promise}
     */
    Populate() {
        var collection = this.db.collection('products');
        return collection.insertMany([
            {name: 'Tomato',stock: 10},
            {name: 'Water',stock: 10},
            {name: 'Meat',stock: 10},
            {name: 'Milk',stock: 10},
            {name: 'Cola Zero',stock: 10},
          ]);
    }
}

class ItemDBController {
    /**
     * Connects to a database containing a collection of items.
     * 
     * @param {string} url 
     * @returns {Promise<ItemDBControllerConnection>} Connection object to use.
     */ 
    static Connect(url) {
        return new Promise((ret, error) => {
            mongoclient.connect(url).then((client) => {
                var controller = new ItemDBControllerConnection();
                controller.db = client.db("warehouse");
                controller.client = client;
                ret(controller);
            }).catch(function(err) {
                error(new Error("MongoDB connection failed: " + err));
            });
        });
    }
}

module.exports = {ItemDBController};
