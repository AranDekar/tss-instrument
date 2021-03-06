"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
class Config {
    static setup() {
        if (Config.settings) {
            return Config.settings;
        }
        console.log(`app running in ${process.env.NODE_ENV} mode`);
        if (process.env.NODE_ENV === 'development') {
            this.settings = {
                gateway_base_path: 'http://localhost:10020',
                strategy_base_path: 'http://localhost:10010',
                ui_base_path: 'http://localhost:8080',
                mongo_db_connection_string: process.env.MONGO || `mongodb://mongodb/tss`,
                api_key: '1234',
                kafka_conn_string: process.env.KAFKA || 'kafka:9092',
                client_id: 'instrument',
                oanda_access_token_key: '77b8d34f242ab412698eba34bc577edb-9126983f28bbf9348c2e2f5697c9d1b3',
                candle_history_client_id: 'candle-history',
                topic_m5: 'm5',
                mockup_oanda: false,
                oanda_account_number: 7841664,
                run_startup: false,
            };
        }
        return this.settings;
    }
    constructor() {
        Config.setup();
    }
}
exports.Config = Config;
Config.setup();
//# sourceMappingURL=app-settings.js.map