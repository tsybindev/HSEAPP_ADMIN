//@ts-ignore
//@ts-nocheck

import {makeAutoObservable} from "mobx";
import Cookies from "js-cookie";
import {Asks} from "@/lib/types/Asks";
import {getAsk, getAsks} from "@/lib/api/Asks";

class StoreAsks {
    isLoad = true
    asks: Asks[] | null = null
    ask: Asks | null = null

    constructor() {
        makeAutoObservable(this)
    }

    async loading(module_id: string) {
        const token = Cookies.get('users_access_token');
        this.isLoad = true
        try {
            this.asks = await getAsks(token, module_id);
            this.isLoad = false
        } catch (e) {
            console.log(e)
            this.isLoad = false
        }
    }

    async getAsk(asks_id: string) {
        const token = Cookies.get('users_access_token');
        this.isLoad = true
        try {
            this.ask = await getAsk(token, asks_id);
            this.isLoad = false
        } catch (e) {
            console.log(e)
            this.isLoad = false
        }
    }
}

export default new StoreAsks()