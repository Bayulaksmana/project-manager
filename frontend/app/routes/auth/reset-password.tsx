import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useResetTokenPassword } from '@/hooks/use-auth'
import { resetPasswordSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, KeyIcon, Loader2, LogInIcon, MailCheckIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useSearchParams } from 'react-router'
import { toast } from 'sonner'
import z from 'zod'

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

const ResetPassword = () => {
    const [isSuccess, setIsSuccess] = useState(false)
    const { mutate: resetPassword, isPending } = useResetTokenPassword()
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")
    const form = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        }
    })
    const onSubmit = (values: ResetPasswordFormData) => {
        if (!token) {
            toast.error("Token tidak ada di dunia ini.")
            return
        }
        resetPassword(
            { ...values, token: token as string },
            {
                onSuccess: () => {
                    setIsSuccess(true)
                },
                onError: (error: any) => {
                    const errorMessage = error.response?.data?.message
                    toast.error(errorMessage)
                    console.log(error)
                }
            })
    }
    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4'>
            <Card className='max-w-md w-full shadow-md'>
                <CardHeader className='text-center justify-center items-center'>
                    <img src="/logo/logo-utama-hitam.png" alt="" width="250" />
                    <CardTitle className='text-4xl font-cabella'>Dega Nion Don</CardTitle>
                    <CardDescription className='text-muted-foreground text-sm font-semibold'>Reset Password Account</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center ">
                        {isSuccess ? (
                            <div className="flex flex-col items-center justify-center">
                                <CheckCircle2 className='w-10 h-10 text-green-500' />
                                <h1 className="text-xl font-bold text-gray-600 mt-2">Password telah berhasil di reset</h1>
                                <p className=' text-gray-600'>Silahkan login dan ingat betul-betul passwordnya</p>
                                <Link to="/sign-in" className='text-sm text-emerald-600'>
                                    <Button variant={"outline"} className=' hover:text-emerald-600 hover:bg-emerald-100 cursor-pointer gap-1 mt-2'> <LogInIcon className='w-2 h-2' /> Sign-In</Button>
                                </Link>
                            </div>
                        ) : (
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <FormField name='newPassword' control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-muted-foreground text-xs font-semibold'>New Password</FormLabel>
                                            <FormControl>
                                                <Input type='password' className='md:w-sm' placeholder='********' {...field} />
                                            </FormControl>
                                            <FormMessage className='text-xs' />
                                        </FormItem>
                                    )} />
                                    <FormField name='confirmPassword' control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='mt-2 text-muted-foreground text-xs font-semibold'>Confirm Password</FormLabel>
                                            <FormControl>
                                                <Input type='password' className='md:w-sm' placeholder='********' {...field} />
                                            </FormControl>
                                            <FormMessage className='text-xs' />
                                        </FormItem>
                                    )} />
                                    <div className="flex justify-end items-center gap-2 mt-4">
                                        <Button variant={'outline'} type='submit' className='w-fit hover:bg-emerald-100 cursor-pointer' disabled={isPending}>
                                            {
                                                isPending ? (
                                                    <Loader2 className='w-4 h-4 animate-spin' />
                                                ) : (
                                                    <p className='items-center flex gap-1 text-emerald-600'><KeyIcon />Reset Password</p>
                                                )
                                            }
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ResetPassword