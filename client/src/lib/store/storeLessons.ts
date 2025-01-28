//@ts-ignore
//@ts-nocheck

import {Catalog} from "@/lib/types/Catalogs";
import {makeAutoObservable} from "mobx";
import {getCatalog} from "@/lib/api/Catalogs";
import Cookies from "js-cookie";
import {Courses} from "@/lib/types/Courses";
import {getCourse, getCourses} from "@/lib/api/Courses";
import {Modules} from "@/lib/types/Modules";
import {getModule, getModules} from "@/lib/api/Modules";
import {Lessons} from "@/lib/types/Lessons";
import {getLesson, getLessons} from "@/lib/api/Lessons";

class StoreLessons {
    isLoad = true
    lessons: Lessons[] | null = null
    lesson: Lessons | null = null

    constructor() {
        makeAutoObservable(this)
    }

    async loading() {
        const token = Cookies.get('users_access_token');
        this.isLoad = true
        try {
            this.lessons = await getLessons(token);
            this.isLoad = false
        } catch (e) {
            console.log(e)
            this.isLoad = false
        }
    }

    async getLesson(item_id: string) {
        const token = Cookies.get('users_access_token');
        this.isLoad = true
        try {
            this.lesson = await getLesson(token, item_id);
            this.isLoad = false
        } catch (e) {
            console.log(e)
            this.isLoad = false
        }
    }
}

export default new StoreLessons()