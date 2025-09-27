import { signInSchema } from '@/lib/schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type z from 'zod'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from 'react-router'
import { useLoginMutation } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/providers/auth-context'


type SigninFormData = z.infer<typeof signInSchema>

const SignIn = () => {
    const navigate = useNavigate()
    const { login } = useAuth()
    const form = useForm<SigninFormData>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })
    const { mutate, isPending } = useLoginMutation()
    const handleOnSubmit = (value: SigninFormData) => {
        mutate(value, {
            onSuccess: (data) => {
                login(data)
                // console.log(data)
                toast.success("Login Successfully -> Dashboard")
                navigate("/dashboard")
            },
            onError: (error: any) => {
                const errorMessage = error.response?.data?.message || "Server crush and please try again later"
                toast.error(errorMessage)
            }
        })
    }
    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4'>
            <Card className='max-w-md w-full shadow-md'>
                <CardHeader className='text-center justify-center items-center'>
                    <img src="/logo/logo-utama-hitam.png" alt="" width="250" />
                    <CardTitle className='text-4xl font-cabella'>Dega Nion Don</CardTitle>
                    <CardDescription className='text-muted-foreground text-sm font-semibold'>Masuk dengan akun KPMIBM-R</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleOnSubmit)} className='space-y-2'>
                            <FormField control={form.control} name='email' render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-gray-600'>Username / Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="email@example.co.id" autoComplete='email' {...field} />
                                    </FormControl>
                                    <FormMessage className='text-xs' />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name='password' render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-between">
                                        <FormLabel className='text-gray-600'>Password</FormLabel>
                                        <Link to="/forgot-password" className='text-muted-foreground text-sm hover:text-emerald-600 underline'>
                                            forgot password?
                                        </Link>
                                    </div>
                                    <FormControl>
                                        <Input type="password" placeholder="********" autoComplete='current-password' {...field} />
                                    </FormControl>
                                    <FormMessage className='text-xs' />
                                </FormItem>
                            )} />
                            <Button type='submit' className='w-full mt-2 hover:bg-emerald-600' disabled={isPending} >
                                {isPending ? <Loader2 className='w-4 h-4 mr-1' /> : "Sign In"}
                            </Button>
                        </form>
                    </Form>
                    <CardFooter className='flex items-center justify-center'>
                        <div className="mt-6">
                            <p className="text-sm text-muted-foreground">
                                Don&apos;t have an account?{" "}
                                <Link to="/sign-up" className='underline font-bold text-emerald-600 hover:text-emerald-500'>Sign Up</Link>
                            </p>
                        </div>
                    </CardFooter>
                </CardContent>
            </Card>
        </div>
    )
}

export default SignIn