/// <reference path="../typings/tsd.d.ts"/>
/// <reference path="../dist/index.d.ts"/>
import chai = require('chai'); 
import traderNetRx = require('../dist/index');
var expect = chai.expect;

const TRADER_NET_URL = process.env.TRADER_NET_URL || 
process.env.npm_config_TRADER_NET_URL || 
process.env.npm_package_config_TRADER_NET_URL;

const TRADER_NET_API_KEY = process.env.TRADER_NET_API_KEY || 
process.env.npm_config_TRADER_NET_API_KEY || 
process.env.npm_package_config_TRADER_NET_API_KEY;

const TRADER_NET_SEC_KEY = process.env.TRADER_NET_SEC_KEY ||
process.env.npm_config_TRADER_NET_SEC_KEY ||
process.env.npm_package_config_TRADER_NET_SEC_KEY;

describe("tests traderNetRx",  () => {

	it("connect / disconnect to trader-net server",  (done) => {
		var tn = new traderNetRx.TraderNet(TRADER_NET_URL);
		var opts : traderNetRx.ITraderNetAuth = {
			apiKey: TRADER_NET_API_KEY,
			securityKey: TRADER_NET_SEC_KEY 
		}			
		tn.connect(opts).subscribe(res => {
			expect(res).eqls({ login: 'max.putilov@gmail.com', trade: false, mode: 'demo' });			
			tn.disconnect();
			done();	
		})																															
	})
	
	it("get quotes",  (done) => {
		var tn = new traderNetRx.TraderNet(TRADER_NET_URL);
		var opts : traderNetRx.ITraderNetAuth = {
			apiKey: TRADER_NET_API_KEY,
			securityKey: TRADER_NET_SEC_KEY 
		}			
		tn.connect(opts).subscribe(res => {
			console.log("connection success");	
		});
		var disposable = tn.startRecieveQuotes(["SBER"]);
		tn.quotesStream.subscribe(res => { 
			expect(res).has.lengthOf(1);
			expect(res[0]).has.property("security", 230);
			expect(res[0]).has.property("ticket", "SBER");
			expect(res[0]).has.property("lot");
			expect(res[0]).has.property("ask");
			expect(res[0]).has.property("bid");
			disposable.dispose();
			done();				
			 					
		})									
																								
	})
	
	it("start get quotes and then stop immediately",  (done) => {
		//this.timeout(2000 + 100);
		var tn = new traderNetRx.TraderNet(TRADER_NET_URL);
		var opts : traderNetRx.ITraderNetAuth = {
			apiKey: TRADER_NET_API_KEY,
			securityKey: TRADER_NET_SEC_KEY 
		}			
		tn.connect(opts).subscribe(res => {
			tn.quotesStream.subscribe(res => {
				done(new Error('Unexpected Call')); 
			});
			var disposable = tn.startRecieveQuotes(["SBER"]);
			disposable.dispose(); 					
			setTimeout(() => done(), 1500);
		})																																	
	})
	
	//BRITTLE ONE, ACCOUNT SHOULD NOT HAVE ANY POSITION
	it.skip("put order buy / sell and watch portfolio",  (done) => {
		var tn = new traderNetRx.TraderNet(TRADER_NET_URL);
		var opts : traderNetRx.ITraderNetAuth = {
			apiKey: TRADER_NET_API_KEY,
			securityKey: TRADER_NET_SEC_KEY 
		}			
		
		var order: traderNetRx.IPutOrderData = {
			ticket: "SBER",
			action: traderNetRx.OrderActionTypes.Buy,
			orderType: traderNetRx.OrderTypes.Market,
			currency: traderNetRx.CurrencyCodes.RUR,
			quantity: traderNetRx.getSecurity(traderNetRx.TicketCodes.SBER).lotSize
		};
		
		tn.connect(opts).subscribe(res => {
			console.log("connection success");

			//must be activated after login
			tn.startRecievePortfolio();						
			tn.putOrder(order);
			
		});
		
		tn.portfolioStream.skip(1).take(1).subscribe(res => {						
			expect(res).has.property("accounts");
			expect(res).has.property("positions");
			expect(res.accounts).has.length.most(1).least(0);//wtf
			expect(res.positions).has.lengthOf(1);
			expect(res.positions[0]).has.property("security", 230);
			expect(res.positions[0]).has.property("securityType", 1);
			expect(res.positions[0]).has.property("securityKind", 1);
			expect(res.positions[0]).has.property("price");
			expect(res.positions[0]).has.property("quantity");
			expect(res.positions[0]).has.property("currency", 2);
			expect(res.positions[0]).has.property("currencyRate", 1);
			expect(res.positions[0]).has.property("securityName", 'Сбербанк');
			expect(res.positions[0]).has.property("securityName2", 'Sberbank');
			expect(res.positions[0]).has.property("openPrice");
			expect(res.positions[0]).has.property("marketPrice");
			
			order.action = traderNetRx.OrderActionTypes.Sell;
			order.quantity = res.positions[0].quantity;  			
			tn.putOrder(order);
		});
		
		tn.portfolioStream.skip(2).take(1).subscribe(res => {
			expect(res).has.property("accounts");
			expect(res).has.property("positions");
			expect(res.accounts).has.lengthOf(1);
			expect(res.positions).has.lengthOf(0);
			done();
		});
												 																																						
	})					
					
}) 
