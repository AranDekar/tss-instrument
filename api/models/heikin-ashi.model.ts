import { Document, Schema, Model, Types } from 'mongoose';

import * as api from '../../api';

const mongoose = api.shared.DataAccess.mongooseInstance;

export interface HeikinAshi {
    close: number;
    complete: boolean;
    high: number;
    low: number;
    open: number;
    time: Date;
    volume: number;
    granularity: string;
}
export interface HeikinAshiDocument extends api.models.HeikinAshi, Document {
}

const schema = new Schema({
    close: { type: Number },
    complete: { type: Boolean },
    high: { type: Number },
    low: { type: Number },
    open: { type: Number },
    volume: { type: Number },
    time: { type: Date },
    granularity: { type: String },
});

schema.index({ time: 1 }); // schema level ascending index on time

export interface HeikinAshiModel extends Model<HeikinAshiDocument> {
    findPrevious(
        model: Model<HeikinAshiDocument>, time: Date,
        granularity: string): Promise<HeikinAshiDocument>;
    findLimit(
        model: Model<HeikinAshiDocument>, time: Date,
        granularity: string, limit: number): Promise<HeikinAshiDocument[]>;
}

schema.statics.findPrevious = async (
    model: Model<HeikinAshiDocument>, time: Date,
    granularityVal: string) => {
    return model
        .findOne({ granularity: granularityVal, time: { $lt: time } })
        .sort({ time: -1 })
        .exec();
};

schema.statics.findLimit = async (
    model: Model<HeikinAshiDocument>, time: Date,
    granularityVal: string, limit: number) => {
    return model
        .find({ granularity: granularityVal, time: { $lte: time } })
        .sort({ time: -1 })
        .limit(limit)
        .exec();
};

export let audUsdHeikinAshisModel =
    mongoose.model<HeikinAshiDocument>('aud_usd_heikin_ashis', schema) as HeikinAshiModel;
export let gbpUsdHeikinAshisModel =
    mongoose.model<HeikinAshiDocument>('gbp_usd_heikin_ashis', schema) as HeikinAshiModel;
export let eurUsdHeikinAshisModel =
    mongoose.model<HeikinAshiDocument>('eur_usd_heikin_ashis', schema) as HeikinAshiModel;