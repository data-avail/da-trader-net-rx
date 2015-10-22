var traderNet = require("./trader-net");
var utils = require("./utils");
var ticketCodes = require("./enums/ticket-codes");
var currencyCodes = require("./enums/currency-codes");
var orderCodes = require("./enums/order-codes");
var securityTypes = require("./enums/security-types");
var types = require("./types");
var traderNetRx;
(function (traderNetRx) {
    traderNetRx.TicketCodes = ticketCodes.TicketCodes;
    traderNetRx.CurrencyCodes = currencyCodes.CurrencyCodes;
    traderNetRx.OrderTypes = orderCodes.OrderTypes;
    traderNetRx.OrderTypes = orderCodes.OrderTypes;
    traderNetRx.OrderStatusCodes = orderCodes.OrderStatusCodes;
    traderNetRx.OrderActionTypes = orderCodes.OrderActionTypes;
    traderNetRx.SecurityType = securityTypes.SecurityType;
    traderNetRx.SecurityKind = securityTypes.SecurityKind;
    traderNetRx.getSecurity = utils.getSecurity;
    traderNetRx.TraderNet = traderNet.TraderNet;
    traderNetRx.BookOrderActions = types.BookOrderActions;
})(traderNetRx || (traderNetRx = {}));
module.exports = traderNetRx;
