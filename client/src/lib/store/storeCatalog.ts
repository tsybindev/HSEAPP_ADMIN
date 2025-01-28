//@ts-ignore
//@ts-nocheck

import {Catalog} from "@/lib/types/Catalogs";
import {makeAutoObservable} from "mobx";
import {getCatalog} from "@/lib/api/Catalogs";
import Cookies from "js-cookie";

class StoreCatalog {
    isLoad = true
    catalog: Catalog[] | null = null

    constructor() {
        makeAutoObservable(this)
    }

    async loading() {
        const token = Cookies.get('users_access_token');
        this.isLoad = true
        try {
            this.catalog = await getCatalog(token);
            this.isLoad = false
        } catch (e) {
            console.log(e)
            this.isLoad = false
        }
    }
}

export default new StoreCatalog()