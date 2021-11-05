const express = require('express');
const ItemDBController = require("./ItemDBController").ItemDBController;
const Item = require("./Item").Item;

const service = express();

// Init function, creates the express service and the database connection, returning them.
async function Init(config) {
    const log = config.log();
    return ItemDBController.Connect(config.mongodburl).then(async (idbc) => {
        if (service.get('env') === 'development') {
            await idbc.Populate();
            service.use((req, res, next) => {
            log.debug(`${req.method}: ${req.url}`);
            return next();
            });
        }
        
        // Item search api, form the item name, returns the stored Item object (name and amount).
        service.get('/item', (req, res, next) => {
            var itemName = req.query.name;
            // Search the item in the database, and return the result as json.
            idbc.GetItem(itemName).then((item) => {
                res.json(item);
            });
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
        return {service, idbc};
    }).catch((error) => {
        log.error("Failed to connect to MongoDB: " + error);
        return {};
    });
}

module.exports = {Init}
