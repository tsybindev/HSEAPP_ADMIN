import React from 'react';
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {LogOut} from "lucide-react";
import {observer} from "mobx-react";
import StoreUser from "@/lib/store/storeUser";
import {useRouter} from "next/router";
import API from "../../../axiosConfig";
import Cookies from "js-cookie";

const Profile = observer(() => {
    const profile = StoreUser.user

    const initials = `${profile?.first_name?.slice(0, 1) || ''}${profile?.last_name?.slice(0, 1) || ''}`.toUpperCase();

    const router = useRouter()

    const handleLogout = async () => {
        const token = Cookies.get('users_access_token')
        try {
            const response = API.delete('/logout/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            Cookies.remove('users_access_token')
            Cookies.remove('user_id')

            await router.push('/auth')

        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className={"flex flex-row items-center gap-2"}>
            <Avatar>
                <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <p>{profile?.first_name} {profile?.last_name}</p>
            <button className={"group"} onClick={() => handleLogout()}><LogOut
                className={"group-hover:text-red-500 transition ease-in-out duration-300"}/></button>
        </div>
    );
});

export default Profile;