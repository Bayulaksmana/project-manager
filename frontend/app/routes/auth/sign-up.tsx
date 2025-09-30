import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useSignUpMutation } from '@/hooks/use-auth'
import { signUpSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Home, HomeIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, Router, useNavigate } from 'react-router'
import { toast } from 'sonner'
import type z from 'zod'


export type SignupFormData = z.infer<typeof signUpSchema>

const SignUp = () => {
    const navigate = useNavigate()
    const form = useForm<SignupFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    })
    const { mutate, isPending } = useSignUpMutation()
    const handleOnSubmit = (value: SignupFormData) => {
        mutate(value, {
            onSuccess: () => {
                toast.success(`Akun berhasil didaftarkan dengan alamat email : ${value.email}`, {
                    description: "Verifikasi email telah dikirim, cek folder spam anda"
                })
                form.reset()
                navigate("/sign-in")
            },
            onError: (error: any) => {
                const errorMessage = error.response?.data?.message
                toast.error(errorMessage)
            }
        })
    }
    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4'>
            <Link to={"/"}>
                <Button className='absolute top-2 left-2 hover:text-sky-600' variant='outline'>
                    <Home /><span className='hidden md:block'>Homepage</span>
                </Button>
            </Link>
            <Card className='max-w-md w-full shadow-md'>
                <CardHeader className='text-center items-center justify-center'>
                    <img src="/logo/logo-utama-hitam.png" alt="" width="250" />
                    <CardTitle className='text-4xl font-cabella'>Dega Nion Don</CardTitle>
                    <CardDescription className='text-muted-foreground text-sm font-semibold'>Buat akun anggota KPMIBM-R</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleOnSubmit)} className='space-y-2'>
                            <FormField control={form.control} name='email' render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-gray-600'>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="email@example.co.id" autoComplete='email' {...field} />
                                    </FormControl>
                                    <FormMessage className='text-xs' />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name='name' render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-gray-600'>Full Name</FormLabel>
                                    <FormControl>
                                        <Input type="name" placeholder="Mosagol Ulea" autoComplete='off' {...field} />
                                    </FormControl>
                                    <FormMessage className='text-xs' />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name='password' render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-gray-600'>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="********" autoComplete='new-password' {...field} />
                                    </FormControl>
                                    <FormMessage className='text-xs' />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name='confirmPassword' render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-gray-600'>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="********" autoComplete='new-password' {...field} />
                                    </FormControl>
                                    <FormMessage className='text-xs' />
                                </FormItem>
                            )} />
                            <Button type='submit' className='w-full mt-2 hover:bg-emerald-600' disabled={isPending} >
                                {isPending ? "Signing Up..." : "Create Account"}
                            </Button>
                        </form>
                    </Form>
                    <CardFooter className='flex justify-center'>
                        <div className="mt-6 flex flex-col items-center gap-2">
                            <p className="text-sm text-muted-foreground">
                                Already have account KPMIBM-R ?&nbsp;
                                <Link to="/sign-in" className='underline font-bold text-emerald-600 hover:text-emerald-500'>Sign In</Link>
                            </p>
                        </div>
                    </CardFooter>
                </CardContent>
            </Card>
        </div>
    )
}

export default SignUp