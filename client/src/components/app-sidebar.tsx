//@ts-nocheck
//@ts-ignore

import * as React from 'react'
import {
	BookCheck,
	ChevronRight,
	File,
	FileQuestion,
	Folder,
	Package,
	StickyNote,
	Camera,
} from 'lucide-react'
import Image from 'next/image'
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarRail,
} from '@/components/ui/sidebar'
import AddCourse from '@/components/elements/AddCourse'
import ImportUsers from '@/components/elements/ImportUsers'
import { Separator } from '@/components/ui/separator'
import {
	Catalog,
	CatalogModule,
	CatalogModuleAsk,
	CatalogModuleAskAnswer,
	CatalogModuleLesson,
} from '@/lib/types/Catalogs'
import StoreCatalog from '@/lib/store/storeCatalog'
import { observer } from 'mobx-react'
import CatalogElement from '@/components/elements/CatalogElement'
import Link from 'next/link'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import PassingPercentSettings from './elements/PassingPercentSettings'

export const AppSidebar = observer(
	({ ...props }: React.ComponentProps<typeof Sidebar>) => {
		const data = StoreCatalog.catalog

		return (
			<TooltipProvider>
				<Sidebar {...props}>
					<SidebarContent>
						<SidebarGroup>
							<div className={'flex flex-row gap-4 my-2'}>
								<Image
									src={'/static/logo.svg'}
									alt={'HSE'}
									width={48}
									height={48}
									quality={100}
								/>
								<div className={'flex flex-col gap-0'}>
									<p className={'text-xl text-primary font-bold leading-none'}>
										HSE
									</p>
									<p className={'text-md text-primary leading-none'}>Эксперт</p>
									<p className={'text-sm text-gray-400 leading-none'}>
										Без травм и аварий
									</p>
								</div>
							</div>
						</SidebarGroup>

						<Separator />

						<SidebarGroup className={'mt-2'}>
							<SidebarMenu>
								<Tooltip>
									<TooltipTrigger asChild>
										<SidebarMenuItem>
											<SidebarMenuButton asChild>
												<Link
													href='/attempts'
													className='w-full mb-2 flex items-center text-sm justify-center border border-border hover:bg-gray-200 rounded-md py-1.5'
												>
													<Camera className='mr-2 h-4 w-4' />
													Фотофиксация
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									</TooltipTrigger>
									<TooltipContent>
										<p>
											Раздел для проверки фотофиксации <br /> и аннулирования
											экзаменов
										</p>
									</TooltipContent>
								</Tooltip>
								<Tooltip>
									<TooltipTrigger asChild>
										<SidebarMenuItem>
											<PassingPercentSettings />
										</SidebarMenuItem>
									</TooltipTrigger>
									<TooltipContent>
										<p>Настроить проходной процент для экзамена</p>
									</TooltipContent>
								</Tooltip>
								<Tooltip>
									<TooltipTrigger asChild>
										<SidebarMenuItem className='mb-2'>
											<AddCourse />
										</SidebarMenuItem>
									</TooltipTrigger>
									<TooltipContent>
										<p>
											Создание нового курса, <br /> будет доступен в списке
											программ
										</p>
									</TooltipContent>
								</Tooltip>
								<Tooltip>
									<TooltipTrigger asChild>
										<SidebarMenuItem className='mb-2'>
											<ImportUsers />
										</SidebarMenuItem>
									</TooltipTrigger>
									<TooltipContent>
										<p>Добавить группу пользователей из csv файла</p>
									</TooltipContent>
								</Tooltip>
							</SidebarMenu>

							<SidebarGroupLabel className={'mt-2'}>
								Список программ
							</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									{data?.map(catalog => (
										<CatalogElement
											key={catalog.item_id}
											title={catalog.title}
											item_id={catalog.item_id}
										/>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					</SidebarContent>
					<SidebarRail />
				</Sidebar>
			</TooltipProvider>
		)
	}
)

function Tree({
	item,
}: {
	item:
		| Catalog
		| CatalogModule
		| CatalogModuleLesson
		| CatalogModuleAsk
		| CatalogModuleAskAnswer
}) {
	const isCatalog = (i: any): i is Catalog => 'modules' in i
	const isModule = (i: any): i is CatalogModule => 'lessons' in i || 'asks' in i
	const isLesson = (i: any): i is CatalogModuleLesson =>
		'item_id' in i && !('answers' in i)
	const isAsk = (i: any): i is CatalogModuleAsk => 'answers' in i

	const getIcon = (isChild: boolean = false) => {
		if (isCatalog(item))
			return (
				<div className={'flex shrink-0'}>
					<Folder className='text-blue-500' />
				</div>
			)
		if (isModule(item)) return <Package className='text-green-500' />
		if (isLesson(item)) {
			return <StickyNote className='text-orange-500' />
		}
		if (isAsk(item)) {
			return isChild ? (
				<FileQuestion className='text-purple-500' />
			) : (
				<BookCheck className='text-yellow-500' />
			)
		}
		return <File className='text-gray-500' />
	}

	return (
		<SidebarMenuItem>
			<Collapsible
				className='group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90'
				defaultOpen={false}
			>
				<CollapsibleTrigger asChild>
					<SidebarMenuButton>
						<ChevronRight className='transition-transform' />
						{getIcon()}
						{item.title}
					</SidebarMenuButton>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarMenuSub className={'w-full'}>
						{isCatalog(item) &&
							item.modules.map(module => (
								<Tree key={module.item_id} item={module} />
							))}
						{isModule(item) && (
							<>
								{item.lessons.map(lesson => (
									<SidebarMenuButton key={lesson.item_id} className='pl-6'>
										<StickyNote />
										{lesson.title}
									</SidebarMenuButton>
								))}
								{item.asks.length > 0 && (
									<Collapsible
										className='group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90'
										defaultOpen={false}
									>
										<CollapsibleTrigger asChild>
											<SidebarMenuButton className='pl-6'>
												<ChevronRight className='transition-transform' />
												<BookCheck className='text-yellow-500' />
												Тестирование
											</SidebarMenuButton>
										</CollapsibleTrigger>
										<CollapsibleContent className={'pl-10'}>
											{item.asks.map(ask => (
												<Tree key={ask.item_id} item={ask} />
											))}
										</CollapsibleContent>
									</Collapsible>
								)}
							</>
						)}
						{isAsk(item) &&
							item.answers.map(answer => (
								<SidebarMenuButton key={answer.item_id} className='pl-6'>
									{getIcon(true)}
									{answer.title}
								</SidebarMenuButton>
							))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</Collapsible>
		</SidebarMenuItem>
	)
}
