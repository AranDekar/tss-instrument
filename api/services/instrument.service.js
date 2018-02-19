"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const api = require("../../api");
class InstrumentService {
    get(title) {
        return __awaiter(this, void 0, void 0, function* () {
            if (title) {
                const t = yield api.models.instrumentModel.find({ title }).exec();
                return t;
            }
            else {
                return yield api.models.instrumentModel.find().exec();
            }
        });
    }
    sync() {
        return __awaiter(this, void 0, void 0, function* () {
            const service = new api.proxies.OandaProxy();
            const instruments = yield service.getInstruments();
            const localInstruments = yield this.get(undefined);
            for (const instrument of instruments) {
                const mappedInstrument = instrument;
                mappedInstrument.title = instrument.instrument;
                const localInstrument = localInstruments.find((x) => x.title === mappedInstrument.title);
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
                    yield localInstrument.save();
                }
                else {
                    const model = new api.models.instrumentModel(mappedInstrument);
                    yield model.save();
                }
            }
        });
    }
}
exports.InstrumentService = InstrumentService;
//# sourceMappingURL=instrument.service.js.map