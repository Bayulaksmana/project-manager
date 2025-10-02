import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { uploadImage, useSignUpMutation } from '@/hooks/use-auth'
import { signUpSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Home, ImagePlusIcon, LockKeyhole, LockKeyholeOpen } from 'lucide-react'
import { useRef, useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import type z from 'zod'


export type SignupFormData = z.infer<typeof signUpSchema>
const SignUp = () => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>();
    const [show, setShow] = useState(false)
    const navigate = useNavigate()
    const form = useForm<SignupFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            profilePicture: "",
            adminAccessToken: "",
        }
    })
    const { mutate, isPending } = useSignUpMutation()
    const handleClick = () => {
        fileInputRef.current?.click();
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0]
            if (!file) { return toast.error("Silahkan uploade file gambar *jpg | *jpeg | *png ") }
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file))
            toast.success("Upload avatar jelekmu berhasil");
        } catch (err: any) {
            console.error("Upload failed:", err.response?.data || err.message);
            toast.error("Upload photo tidak bisa, kemungkinan photomu otu jelek!");
        }
    }
    const handleOnSubmit: SubmitHandler<SignupFormData> = async (value) => {
        if (!selectedFile) {
            return toast.error("Silakan pilih avatar terlebih dahulu");
        }
        const imageUrl = await uploadImage(selectedFile) as { imageUrl: string }
        const payload = { ...value, profilePicture: imageUrl.imageUrl };
        mutate(payload, {
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
        <div className='min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4 bg-cover opacity-95'
            style={{
                backgroundImage: "url('/image-tone.jpg')"
            }}
        >
            <Link to={"/"}>
                <Button className='absolute top-2 left-2 hover:text-sky-600 hover:-translate-y-1' variant='outline'>
                    <Home /><span className='hidden md:block'>Homepage</span>
                </Button>
            </Link>
            <Card className='max-w-md w-full shadow-md'>
                <CardHeader className='text-center items-center justify-center'>
                    {preview ? (
                        <><img
                            src={preview}
                            alt="Preview"
                            className="shine-effect shadow-2xl mx-17 w-24 h-24 rounded-full object-cover border-4 border-emerald-300"
                            style={{ animation: "spin 15s linear infinite" }}
                        />
                        </>
                    ) :
                        <img src="/logo/logo-utama-hitam.png" alt="" width="250" />
                    }
                    <CardTitle className='text-4xl font-cabella'>Dega Nion Don</CardTitle>
                    <CardDescription className='text-muted-foreground text-sm font-semibold'>Buat akun anggota KPMIBM-R</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleOnSubmit)} className='space-y-2'>
                            <div className="flex w-full items-end justify-between">
                                <FormField control={form.control} name='adminAccessToken' render={({ field }) => (
                                    <FormItem >
                                        <FormLabel className='text-gray-600'>Code Invitation</FormLabel>
                                        <FormControl>
                                            <Input type="text" className='md:w-10/6' placeholder="Code of cadre development" autoComplete='off' {...field} />
                                        </FormControl>
                                        <FormMessage className='text-xs' />
                                    </FormItem>
                                )} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <Button title='Add Avatar Image' type='button' variant={'ghost'} size={'lg'} name='pofilePicture' onClick={handleClick}>
                                    <ImagePlusIcon className='size-6' />
                                </Button>
                            </div>
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
                                        <Input type="name" placeholder="Mosagol" autoComplete='off' {...field} />
                                    </FormControl>
                                    <FormMessage className='text-xs' />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name='password' render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-gray-600'>Password</FormLabel>
                                    <FormControl>
                                        <Input type={show ? "text" : "password"} placeholder="********" autoComplete='new-password' {...field} />
                                    </FormControl>
                                    <FormMessage className='text-xs' />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name='confirmPassword' render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-gray-600'>Confirm Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input type={show ? "text" : "password"} placeholder="********" autoComplete='new-password' {...field} />
                                            <button
                                                type="button"
                                                onClick={() => setShow(!show)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                                            >
                                                {show ? <LockKeyhole size={18} className='text-red-400' /> : <LockKeyholeOpen size={18} className='text-emerald-400' />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage className='text-xs' />
                                </FormItem>
                            )} />
                            <Button type='submit' className='w-full mt-2 bg-linear-to-r from-emerald-800 to-emerald-400' disabled={isPending} >
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