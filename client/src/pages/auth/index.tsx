import React from 'react'
import { useRouter } from 'next/router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { UserAuthSchema } from '@/lib/schemas/UserAuthSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import Cookies from 'js-cookie'
import { login } from '@/lib/api/User'
import { httpErrorsSplit } from '@/utils/httpErrorsSplit'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import Head from 'next/head'

const Index = () => {
	const router = useRouter()

	const methods = useForm<z.infer<typeof UserAuthSchema>>({
		resolver: zodResolver(UserAuthSchema),
		defaultValues: {},
	})

	const {
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch,
	} = methods

	const onSubmit: SubmitHandler<
		z.infer<typeof UserAuthSchema>
	> = async data => {
		const { email, password } = data

		const toastId = toast.loading('Авторизация...')

		try {
			const response = await login(email, password)

			if (
				response.data.role !== 'admin' &&
				response.data.role !== 'superadmin'
			) {
				toast.error('У вас нет прав для доступа!', {
					id: toastId,
					duration: 5000,
					richColors: true,
					action: (
						<div className='absolute top-[10px] right-[10px]'>
							<X
								size={16}
								className='hover:text-red-500 cursor-pointer transition-all duration-300 ease-in-out'
								onClick={() => toast.dismiss()}
							/>
						</div>
					),
				})

				return
			}

			toast.success('Авторизация выполнена успешно!', {
				id: toastId,
				duration: 5000,
				richColors: true,
				action: (
					<div className='absolute top-[10px] right-[10px]'>
						<X
							size={16}
							className='hover:text-red-500 cursor-pointer transition-all duration-300 ease-in-out'
							onClick={() => toast.dismiss()}
						/>
					</div>
				),
			})

			Cookies.set('users_access_token', response.data.access_token)
			Cookies.set('users_refresh_token', response.data.refresh_token)
			Cookies.set('user_id', response.data.user_id)
			await router.push('/')
		} catch (e) {
			toast.error(httpErrorsSplit(e), {
				id: toastId,
				duration: 5000,
				richColors: true,
				action: (
					<div className='absolute top-[10px] right-[10px]'>
						<X
							size={16}
							className='hover:text-red-500 cursor-pointer transition-all duration-300 ease-in-out'
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
				<title>HSE -Авторизация</title>
			</Head>
			<div className='flex w-full items-center justify-center h-screen'>
				<Card className='w-1/4'>
					<CardHeader>
						<Image
							src={'static/logo.svg'}
							alt={'HSE'}
							width={48}
							height={48}
							quality={100}
							className={'mx-auto'}
						/>
						<CardTitle className='text-2xl w-full text-center'>
							Авторизация
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Form {...methods}>
							<form
								onSubmit={methods.handleSubmit(onSubmit)}
								className='grid gap-4'
							>
								<FormField
									control={methods.control}
									name='email'
									render={({ field }) => (
										<FormItem className='grid gap-2'>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													{...field}
													onChange={e => field.onChange(e.target.value)}
													type={'email'}
													placeholder={'m@example.com'}
													required
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={methods.control}
									name='password'
									render={({ field }) => (
										<FormItem className='grid gap-2'>
											<FormLabel>Пароль</FormLabel>
											<FormControl>
												<Input
													{...field}
													onChange={e => field.onChange(e.target.value)}
													type={'password'}
													placeholder={'**********'}
													required
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type='submit' className='w-full'>
									Авторизоваться
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>
			</div>
		</>
	)
}

export default Index
