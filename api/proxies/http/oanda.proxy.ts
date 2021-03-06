const oanda = require('oanda-adapter');

import * as api from '../../../api';

export class OandaProxy {

    private accountId = 7841664;
    // test
    private client: any = new oanda({
        // 'live', 'practice' or 'sandbox'
        environment: 'practice',
        // Generate your API access in the 'Manage API Access' section of 'My Account' on OANDA's website
        accessToken: api.shared.Config.settings.oanda_access_token_key,
    });

    public async getCandles(
        instrument: api.enums.InstrumentEnum,
        start: Date, end: Date, granularity: api.enums.GranularityEnum): Promise<any[]> {
        if (api.shared.Config.settings.mockup_oanda) {
            return Promise.resolve(
                [{
                    closeAsk: 0.72824,
                    closeBid: 0.72809,
                    complete: true,
                    highAsk: 0.72838,
                    highBid: 0.72821,
                    lowAsk: 0.72761,
                    lowBid: 0.72744,
                    openAsk: 0.72761,
                    openBid: 0.72744,
                    time: end,
                    volume: 56,
                }]);
        } else {
            return new Promise<any[]>((resolve, reject) => {
                this.client.getCandles(api.enums.InstrumentEnum[instrument], start.toISOString(), end.toISOString(),
                    api.enums.GranularityEnum[granularity],
                    (err, candles) => {
                        if (err) {
                            return reject(err);
                        }
                        candles.forEach((element) => {
                            element.high = Number(((element.highAsk + element.highBid) / 2).toFixed(5));
                            element.low = Number(((element.lowAsk + element.lowBid) / 2).toFixed(5));
                            element.open = Number(((element.openAsk + element.openBid) / 2).toFixed(5));
                            element.closeMid = Number(((element.closeAsk + element.closeBid) / 2).toFixed(5));
                            element.closeAsk = Number(element.closeAsk.toFixed(5));
                            element.closeBid = Number(element.closeBid.toFixed(5));
                            element.granularity = granularity;
                            element.time = new Date(element.time / 1000);
                        });
                        return resolve(candles);
                    });
            });
        }
    }

    public async getInstruments(): Promise<any[]> {
        if (api.shared.Config.settings.mockup_oanda) {
            return Promise.resolve(
                [{
                    displayName: 'AUD/USD',
                    halted: false,
                    instrument: 'AUD_USD',
                    marginRate: 0.003333,
                    maxTradeUnits: 10000000,
                    maxTrailingStop: 10000,
                    minTrailingStop: 5,
                    pip: '0.0001',
                    precision: '0.00001',
                    granularities: [],
                }]);
        } else {
            return new Promise<any[]>((resolve, reject) => {
                this.client.getInstruments(api.shared.Config.settings.oanda_account_number, (err, instruments) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(instruments);
                });
            });
        }
    }
}
/*
 *  this is to test the oanda apis
 * https://tonicdev.com/npm/oanda-adapter
 *
    var OANDAAdapter= require("oanda-adapter")
    var client = new OANDAAdapter({
        environment: 'practice',
        accessToken: '77b8d34f242ab412698eba34bc577edb-9126983f28bbf9348c2e2f5697c9d1b3',
    });
            client.getInstruments(7841664,function (err, instruments) {
                console.log(instruments);
            });

          client.getCandles("AUD_USD","2015-12-15T02:50:00+00:00","2015-12-15T02:55:00+00:00","M5",
          function (err, data) {
              console.log(data);
          });

 *
 */