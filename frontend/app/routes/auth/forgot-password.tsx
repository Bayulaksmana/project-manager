import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForgotPasswordMutation } from '@/hooks/use-auth'
import { forgotPasswordSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle, Loader2, LogInIcon, MailCheckIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useSearchParams } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
const ForgotPassword = () => {
    const [isSuccess, setIsSuccess] = useState(false)
    const { mutate: forgotPassword, isPending } = useForgotPasswordMutation()
    const form = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        }
    })
    const onSubmit = (data: ForgotPasswordFormData) => {
        forgotPassword(data, {
            onSuccess: () => {
                setIsSuccess(true)
            },
            onError: (error: any) => {
                const errorMessage = error.response?.data?.message
                console.log(error)
                toast.error(errorMessage)
            }
        })
    }
    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4'>
            <Card className='max-w-md w-full shadow-md'>
                <CardHeader className='text-center justify-center items-center'>
                    {/* <img src="/logo/logo-utama-hitam.png" alt="" width="250" /> */}
                    <CardTitle className='text-4xl font-cabella'>Dega Nion Don</CardTitle>
                    <CardDescription className='text-muted-foreground text-md mt-2 font-semibold'>Forgot Password</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-self-center ">
                        {
                            isSuccess
                                ?
                                (
                                    <>
                                        <CheckCircle className='w-10 h-10 text-emerald-500 mb-2' />
                                        <h3 className='text-lg font-semibold text-gray-700'>Email reset password telah dikirim</h3>
                                        <p className=' text-gray-600'>Check your email for a link to reset password</p>
                                        <Link to={"/sign-in"} className='text-sm text-emerald-600'>
                                            <Button variant={"outline"} className='mt-4 text-emerald-600 hover:bg-emerald-100'> <LogInIcon className='w-4 h-4' /> Sign-In</Button>
                                        </Link>
                                    </>
                                )
                                :
                                (
                                    <>
                                        <Form {...form}>
                                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                                <FormField name='email' control={form.control} render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className='text-muted-foreground text-xs font-semibold'>Masukan email yang anda ingat. </FormLabel>
                                                        <FormControl>
                                                            <Input className='md:w-sm' placeholder='moyokapit@project.com' {...field} />
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
                                                                <p className=' items-center flex gap-1 text-emerald-600'><MailCheckIcon />Reset Password</p>
                                                            )
                                                        }
                                                    </Button>
                                                    <Link to="/sign-in" className='text-sm text-emerald-600'>
                                                        <Button variant={"outline"} className=' hover:text-emerald-600 hover:bg-emerald-100 cursor-pointer gap-1'> <LogInIcon className='w-2 h-2' /> Sign-In</Button>
                                                    </Link>
                                                </div>
                                            </form>
                                        </Form>
                                    </>
                                )
                        }
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ForgotPassword