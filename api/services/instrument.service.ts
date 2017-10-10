import { Types } from 'mongoose';

import * as api from '../../api';

export class InstrumentService {
    public async get(title: api.enums.InstrumentEnum | undefined = undefined): Promise<api.models.InstrumentDocument[]> {
        if (title) {
            let t = await api.models.instrumentModel.find({ title: title }).exec();
            return t;
        } else {
            return await api.models.instrumentModel.find().exec();
        }
    }

    public async sync() {
        let service = new api.proxies.http.OandaProxy();
        let instruments = await service.getInstruments();
        let localInstruments = await this.get();

        for (let instrument of instruments) {
            let mappedInstrument: api.models.Instrument = instrument;
            mappedInstrument.title = instrument.instrument;

            let localInstrument = localInstruments.find(x => x.title === mappedInstrument.title);
            if (localInstrument) {
                // update the local instrument prtially
                localInstrument.displayName = mappedInstrument.displayName;
                localInstrument.halted = mappedInstrument.halted;
                localInstrument.title = mappedInstrument.title;
                localInstrument.marginRate = mappedInstrument.marginRate;
                localInstrument.maxTradeUnits = mappedInstrument.maxTradeUnits;
                localInstrument.maxTrailingStop = mappedInstrument.maxTrailingStop;
                localInstrument.minTrailingStop = mappedInstrument.minTrailingStop;
                localInstrument.pip = mappedInstrument.pip;
                localInstrument.precision = mappedInstrument.precision;
                localInstrument.path = mappedInstrument.path;
                await localInstrument.save();
            } else {
                let model = new api.models.instrumentModel(mappedInstrument);
                await model.save();
            }
        }

        for (let localInstrument of localInstruments.filter(x => x.granularities.length > 0)) {
            await this.syncCandles(localInstrument);
        }
    }
    private async syncCandles(instrument: api.models.InstrumentDocument) {
        let candleService = new api.services.CandleSyncService();
        for (let granularity of instrument.granularities) {
            candleService.instrument = api.enums.InstrumentEnum[instrument.title];
            candleService.granularity = api.enums.GranularityEnum[granularity];
            await candleService.sync();
            break;
        }
    }
}