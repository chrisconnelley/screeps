var _ = require('lodash');

var brainMarket = {
    h: function(msg) {
      var z = _.now()
      console.log(z);  
    },
    
    emptyTerminal: function(nameRoom) {
        const room = Game.rooms[nameRoom];
        
        if (!room) return ERR_INVALID_TARGET;
        if (!room.terminal) return ERR_INVALID_TARGET;
        
        var terminal = room.terminal;
    
        const orders = this.getOrders(RESOURCE_ENERGY);
        const energyInTerminal = terminal.store.getUsedCapacity(RESOURCE_ENERGY);
        
        if (energyInTerminal < 1) return;
        
        orders.forEach((order) => {
            order.transactionCost = Game.market.calcTransactionCost(order.amount, order.roomName, nameRoom);
            order.transactionFactor = order.transactionCost / order.amount;
            order.transmitAmount = energyInTerminal > (order.transactionCost + order.amount) ? order.amount : energyInTerminal / (1 + order.transactionFactor);
            order.transmitCost = order.transmitAmount * order.transactionFactor;
            order.profit = Math.floor(order.transmitAmount * order.price - order.transmitCost * order.price);
             
        });
        
        const sortProfitFunc = (a, b) => {
            return b.profit - a.profit;
        }
        
        orders.sort(sortProfitFunc);

        const selectedOrder = orders[0];
        if (selectedOrder.transmitAmount < 1) return;

        var result = Game.market.deal(selectedOrder.id, selectedOrder.transmitAmount, nameRoom);

        console.log(`${nameRoom} (${energyInTerminal}) submitted deal ${selectedOrder.id} for ${selectedOrder.transmitAmount} energy : result of ${result}`);
    },
    emptyAll: function() {
        Object.keys(Game.rooms).forEach((nameRoom) => {
            this.emptyTerminal(nameRoom);
        })
    },
    getOrders: function(resourceType) {
        const sortFunc = (a, b) => {
            return b.price - a.price;
        }
        
        const ordersFiltered = Game.market.getAllOrders({type: ORDER_BUY, resourceType: resourceType});
        
        if (ordersFiltered.length === 0) return ERR_NOT_FOUND;
        
        ordersFiltered.sort(sortFunc);
        
        return ordersFiltered;
    },
    
};

module.exports = brainMarket;