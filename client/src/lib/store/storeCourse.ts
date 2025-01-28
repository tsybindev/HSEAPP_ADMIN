//@ts-ignore
//@ts-nocheck
import {makeAutoObservable} from "mobx";
import Cookies from "js-cookie";
import {Courses} from "@/lib/types/Courses";
import {getCourse, getCourses} from "@/lib/api/Courses";

class StoreCourse {
    isLoad = true
    courses: Courses[] | null = null
    course: Courses | null = null

    constructor() {
        makeAutoObservable(this)
    }

    async loading() {
        const token = Cookies.get('users_access_token');
        this.isLoad = true
        try {
            this.courses = await getCourses(token);
            this.isLoad = false
        } catch (e) {
            console.log(e)
            this.isLoad = false
        }
    }

    async getCourse(item_id: string) {
        const token = Cookies.get('users_access_token');
        this.isLoad = true
        try {
            this.course = await getCourse(token, item_id);
            this.isLoad = false
        } catch (e) {
            console.log(e)
            this.isLoad = false
        }
    }
}

export default new StoreCourse()