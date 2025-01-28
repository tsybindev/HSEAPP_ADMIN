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
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {LogOut} from "lucide-react";
import {Button} from "@/components/ui/button";
import Profile from "@/components/elements/Profile";
import Head from "next/head";
import React from "react";


export default function Home() {
  return (
      <>
        <Head>
          <title>
            HSE - Главная
          </title>
        </Head>
        <SidebarProvider>
          <AppSidebar />

          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">

              <SidebarTrigger className="-ml-1" />

              <Separator orientation="vertical" className="mr-2 h-4" />

              <div className={"w-full flex flex-row justify-between items-center gap-4"}>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbPage>Главная</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>

                <Profile/>
              </div>

            </header>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
              </div>
              <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </>

  );
}
