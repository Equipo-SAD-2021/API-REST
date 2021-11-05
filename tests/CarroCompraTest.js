const axios = require('axios');
const Item = require("./Item").Item;
const ShoppingCartLocal = require("./CarroCompraLocal").ShoppingCartLocal;

const serviceRegistryUrl = "localhost";
const serviceRegistryPort = 3000;

async function main() {
    
    var cart = new ShoppingCartLocal(serviceRegistryUrl, serviceRegistryPort);

    cart.Connect().then(async () => {

        console.log("Adding 3 of Tomato...");
        await cart.Add(new Item("Tomato", 3)).then((data) => {
            console.log("=> Cart has now " + data.GetAmount() + " of " + data.GetName());
        }).catch((data) => {
            console.log("=> Adding 3 of Tomato failed, reason: \"" + data + "\"");
        });

        console.log("Adding 5 of Water...");
        await cart.Add(new Item("Water", 5)).then((data) => {
            console.log("=> Cart has now " + data.GetAmount() + " of " + data.GetName());
        }).catch((data) => {
            console.log("=> Adding 5 of Water failed, reason: \"" + data + "\"");
        });

        console.log("Trying to add 12 of Meat...");
        await cart.Add(new Item("Meat", 12)).then((data) => {
            console.log("=> Cart has now " + data.GetAmount() + " of " + data.GetName());
        }).catch((data) => {
            console.log("=> Adding 12 of Meat failed, reason: \"" + data + "\"");
        });
        
        await cart.GetContents().then((data) => {
            console.log("Cart contents right now:\n" + ShoppingCartLocal.ContentsToString(data));
        }).catch((data) => {
            console.log("=> Failed to get cart contents, reason: \"" + data + "\"");
        });

        console.log("Adding 3 of Water...");
        await cart.Add(new Item("Water", 3)).then((data) => {
            console.log("=> Cart has now " + data.GetAmount() + " of " + data.GetName());
        }).catch((data) => {
            console.log("=> Adding 3 of Water failed, reason: \"" + data + "\"");
        });

        console.log("Trying to remove 1 of Cola Zero...");
        await cart.Remove(new Item("Cola Zero", 1)).then((data) => {
            console.log("=> Cart has now " + data.GetAmount() + " of " + data.GetName());
        }).catch((data) => {
            console.log("=> Removing 1 of Cola Zero failed, reason: \"" + data + "\"");
        });

        console.log("Removing 1 of Tomato...");
        await cart.Remove(new Item("Tomato", 1)).then((data) => {
            console.log("=> Cart has now " + data.GetAmount() + " of " + data.GetName());
        }).catch((data) => {
            console.log("=> Removing 1 of Tomato failed, reason: \"" + data + "\"");
        });

        console.log("Trying to add 3 of Water...");
        await cart.Add(new Item("Water", 3)).then((data) => {
            console.log("=> Cart has now " + data.GetAmount() + " of " + data.GetName());
        }).catch((data) => {
            console.log("=> Adding 3 of Water failed, reason: \"" + data + "\"");
        });

        console.log("Trying to add 6 of Cola Zero...");
        await cart.Add(new Item("Cola Zero", 6)).then((data) => {
            console.log("=> Cart has now " + data.GetAmount() + " of " + data.GetName());
        }).catch((data) => {
            console.log("=> Adding 6 of Cola Zero failed, reason: \"" + data + "\"");
        });

        await cart.GetContents().then((data) => {
            console.log("Cart contents right now:\n" + ShoppingCartLocal.ContentsToString(data));
        }).catch((data) => {
            console.log("=> Failed to get cart contents, reason: \"" + data + "\"");
        });

        console.log("Disconnecting from the cart service...");
        await cart.Disconnect().then((cart) => {
            
        }).catch((data) => {
            console.log("=> Failed to disconnect, reason: \"" + data + "\"");
        });

    }).catch((reason) => {
        console.log("Error connecting: " + reason);
    });    
}

main();