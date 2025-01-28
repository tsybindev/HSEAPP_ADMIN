//@ts-ignore
//@ts-nocheck

import React, {useEffect, useState} from 'react';
import {observer} from "mobx-react";
import {checkType} from "@/lib/api/CheckType";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";
import {Separator} from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import Profile from "@/components/elements/Profile";
import Cookies from "js-cookie";
import Head from "next/head";
import {SubmitHandler, useForm} from "react-hook-form";
import {z} from "zod";
import {CourseAddSchema} from "@/lib/schemas/CourseAddSchema";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {ArrowLeft, Download, PanelLeft, Trash2, X} from "lucide-react";
import StoreCatalog from "@/lib/store/storeCatalog";
import {httpErrorsSplit} from "@/utils/httpErrorsSplit";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import StoreModule from "@/lib/store/storeModules";
import Link from "next/link";
import {deleteModule, editTitleModule, getModule, getModuleLessons} from "@/lib/api/Modules";
import {cn} from "@/lib/utils";
import {useRouter} from "next/router";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import StoreLessons from "@/lib/store/storeLessons";
import {Lessons} from "@/lib/types/Lessons";
import AddLesson from "@/components/elements/AddLesson";
import {Courses} from "@/lib/types/Courses";
import {Modules} from "@/lib/types/Modules";
import {deleteLesson, editTitleLesson} from "@/lib/api/Lessons";
import ImageUpload from "@/components/elements/ImageUpload";
import Editor from "@/components/elements/Editor";
import StoreAsks from "@/lib/store/storeAsks";
import {Asks} from "@/lib/types/Asks";
import {deleteAsk, editTitleAsk} from "@/lib/api/Asks";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import AddAskAnswer from "@/components/elements/AddAskAnswer";

const Ask = observer(({ask}) => {
    const token = Cookies.get("users_access_token")

    const router = useRouter()

    useEffect(() => {
        StoreAsks.getAsk(ask.item_id);
    }, [ask.item_id]);

    const askData = StoreAsks.ask

    const methods = useForm<z.infer<typeof CourseAddSchema>>({
        resolver: zodResolver(CourseAddSchema),
        defaultValues: {}
    })

    const {handleSubmit, formState: {errors}, reset, setValue, watch} = methods

    const onSubmit: SubmitHandler<z.infer<CourseAddSchema>> = async (data) => {
        const {title} = data

        const toastId = toast.loading('Изменение названия вопроса...')

        try {
            const token = Cookies.get('users_access_token')
            await editTitleAsk(token, askData?.module_id, askData?.item_id, title)

            toast.success("Название изменено!",
                {
                    id: toastId,
                    duration: 5000,
                    richColors: true,
                    action: (
                        <div className="absolute top-[10px] right-[10px]">
                            <X
                                size={16}
                                className="hover:text-red-500 cursor-pointer transition-all duration-300 ease-in-out"
                                onClick={() => toast.dismiss()}
                            />
                        </div>
                    ),
                })

            StoreCatalog.loading().then()
            await StoreAsks.getAsk(askData?.item_id).then()

        } catch (e) {
            toast.error(httpErrorsSplit(e),
                {
                    id: toastId,
                    duration: 5000,
                    richColors: true,
                    action: (
                        <div className="absolute top-[10px] right-[10px]">
                            <X
                                size={16}
                                className="hover:text-red-500 cursor-pointer transition-all duration-300 ease-in-out"
                                onClick={() => toast.dismiss()}
                            />
                        </div>
                    ),
                })
        }
    }

    const handleDeleteLesson = async () => {
        const toastId = toast.loading('Удаление вопроса...')

        try {
            const response = await deleteAsk(token, askData?.module_id, askData?.item_id)

            toast.success("Вопрос удален!",
                {
                    id: toastId,
                    duration: 5000,
                    richColors: true,
                    action: (
                        <div className="absolute top-[10px] right-[10px]">
                            <X
                                size={16}
                                className="hover:text-red-500 cursor-pointer transition-all duration-300 ease-in-out"
                                onClick={() => toast.dismiss()}
                            />
                        </div>
                    ),
                })

            StoreCatalog.loading().then()
            StoreAsks.getAsk(askData?.item_id).then()

            await router.back()
        } catch (e) {
            toast.error(httpErrorsSplit(e),
                {
                    id: toastId,
                    duration: 5000,
                    richColors: true,
                    action: (
                        <div className="absolute top-[10px] right-[10px]">
                            <X
                                size={16}
                                className="hover:text-red-500 cursor-pointer transition-all duration-300 ease-in-out"
                                onClick={() => toast.dismiss()}
                            />
                        </div>
                    ),
                })
        }
    }

    return (
        <>
            <Head>
                <title>
                    HSE - Вопросы - {askData?.title}
                </title>
            </Head>

            <SidebarProvider>
                <AppSidebar/>

                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">

                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-7 w-7 flex items-center justify-center")}
                            onClick={router.back}
                        >
                            <ArrowLeft className={cn(
                                "z-20 hidden w-4 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
                                "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
                                "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
                                "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
                                "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
                                "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",)}
                            />
                        </Button>

                        <Separator orientation="vertical" className="mr-2 h-4"/>

                        <SidebarTrigger className="-ml-1"/>

                        <Separator orientation="vertical" className="mr-2 h-4"/>

                        <div className={"w-full flex flex-row justify-between items-center gap-4"}>
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="/">Главная</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block"/>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href={`/course/${askData?.course_id}`}>Курс</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block"/>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink
                                            href={`/course/module/${askData?.module_id}`}>Модуль</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block"/>
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>{askData?.title}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>

                            <Profile/>
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4">
                        <div className="grid auto-rows-min gap-4 md:grid-cols-1">
                            <div className="rounded-xl bg-muted/50 p-4 flex flex-row gap-4 justify-between">
                                <p className={"text-xl text-primary font-semibold"}>{askData?.title}</p>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Trash2
                                            className={"text-primary transition ease-in-out duration-300 hover:text-red-500 cursor-pointer"}/>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Подтвердите удаление</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Данное действие нельзя будет отменить
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteLesson()}
                                                               className={"bg-red-500 hover:bg-red-400"}>Удалить</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>

                        <div className={"grid grid-cols-2 gap-4"}>
                            <div
                                className="col-span-2 lg:col-span-1 rounded-xl bg-muted/50 md:min-h-min p-4 flex flex-col gap-4">

                                <div className={"w-full flex flex-col gap-4"}>
                                    <Form {...methods}>
                                        <form onSubmit={methods.handleSubmit(onSubmit)} className="grid gap-4">
                                            <FormField
                                                control={methods.control}
                                                name="title"
                                                render={({field}) => (
                                                    <FormItem className="grid gap-2">
                                                        <FormLabel>Название вопроса</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                onChange={(e) => field.onChange(e.target.value)}
                                                                type={"text"}
                                                                placeholder={"Название вопроса"}
                                                                required
                                                            />
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />

                                            <Button type="submit" className="w-full">
                                                Сменить название
                                            </Button>
                                        </form>
                                    </Form>

                                    <Separator/>

                                    <AddAskAnswer title={askData?.title} module_id={askData?.module_id} ask_id={askData?.item_id}/>

                                </div>

                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
});

export default Ask;

export async function getServerSideProps({params}) {

    const ask = await checkType("module_ask", params.slug);

    if (!ask) {
        return {notFound: true};
    }

    return {props: {ask}};
}