const express = require('express');
const ShoppingCartGenerator = require("./CarroCompra").ShoppingCartGenerator;
const Item = require("./Item").Item;

const service = express();
var crypto = require("crypto");

function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.randomBytes(1)[0] & 15 >> c / 4).toString(16)
    );
}

var availableCarts = {};

module.exports = (config) => {
    const log = config.log();
    // Add a request logging middleware in development mode
    if (service.get('env') === 'development') {
        service.use((req, res, next) => {
        log.debug(`${req.method}: ${req.url}`);
        return next();
        });
    }

    service.get('/cart', (req, res, next) => {
        ShoppingCartGenerator.GetCart(config.serviceRegistryURL, config.databaseServiceName, config.databaseServiceVersion).then((cart) => {
            log.debug("Generated new cart: " + cart);
            if (cart == null) {
                res.json(null);
            } else {
                var uuid = uuidv4();
                availableCarts[uuid] = cart;
                res.json({uuid: uuid});
            }
        });
    });

    service.delete('/cart', (req, res, next) => {
        var uuid = req.query.uuid;
        if (uuid in availableCarts) {
            delete availableCarts[req.query.uuid];
            res.status(200);
            res.json({});
        } else {
            res.status(404);
            res.json({error: "Specified cart not found"});
        }
    });

    service.get('/cart/content', (req, res, next) => {
        var uuid = req.query.uuid;
        if (uuid in availableCarts) {
            var cart = availableCarts[uuid];
            res.json(cart.GetContents());
        } else {
            res.status(404);
            res.json({error: "Specified cart not found"});
        }
    });

    service.put('/cart/content', (req, res, next) => {
        var uuid = req.query.uuid;
        var item = req.query.item;
        var amount = Number(req.query.amount);
        if (isNaN(amount)) amount = null;

        if (!(uuid in availableCarts)) {
            res.status(404);
            res.json({error: "Specified cart not found"});            
        } else if (item == null || amount == null) {
            res.status(403);
            res.json({error: "Item or amount not specified."});
        } else {
            var cart = availableCarts[uuid];
            cart.Add(new Item(item, amount)).then((addedItem) => {
                log.debug("Added item " + addedItem);
                res.json(addedItem);
            }).catch((err) =>{
                log.error("Error in putting item: " + err[1]);
                res.status(err[0]);
                if (err[0] == 500) {
                    res.json({error: "Internal server error."});
                } else {
                    res.json({error: err[1]});
                }
            });
        }
    });

    service.delete('/cart/content', (req, res, next) => {
        var uuid = req.query.uuid;
        var item = req.query.item;
        var amount = Number(req.query.amount);
        if (isNaN(amount)) amount = null;

        if (!(uuid in availableCarts)) {
            res.status(404);
            res.json({error: "Specified cart not found"});            
        } else if (item == null || amount == null) {
            res.status(403);
            res.json({error: "Item or amount not specified."});
        } else {
            var cart = availableCarts[uuid];
            cart.Remove(new Item(item, amount)).then((removedItem) => {
                log.debug("New item " + removedItem);
                res.json(removedItem);
            }).catch((err) =>{
                log.error("Error in removing item: " + err[1]);
                res.status(err[0]);
                if (err[0] == 500) {
                    res.json({error: "Internal server error."});
                } else {
                    res.json({error: err[1]});
                }
            });
        }
    });

    // eslint-disable-next-line no-unused-vars
    service.use((error, req, res, next) => {
        res.status(error.status || 500);
        // Log out the error to the console
        log.error(error);
        return res.json({
        error: {
            message: error.message,
        },
        });
    });
    return service;
};
