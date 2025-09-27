import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { CheckCircle, Copyright, Loader, XCircle } from "lucide-react"
import { Button } from '@/components/ui/button'
import { useVerifyEmailMutation } from '@/hooks/use-auth'
import { toast } from 'sonner'

const VerifyEmail = () => {
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")
    const [isSuccess, setIsSuccess] = useState(false)
    const { mutate, isPending: isVerifying } = useVerifyEmailMutation()
    useEffect(() => {
        if (token) {
            mutate({ token }, {
                onSuccess: () => {
                    setIsSuccess(true)
                },
                onError: (error: any) => {
                    const errorMessage = error.response?.data?.message || "Erorr verify-email in frontend staged"
                    setIsSuccess(false)
                    // console.log(error);
                    toast.error(errorMessage)
                }
            })
        }
    }, [searchParams])
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            {/* <p className='text-sm text-gray-500'>Verifying your email</p> */}
            <img src="/logo/logo-utama-hitam.png" alt="" width="250" />
            <h1 className='text-4xl font-bold font-cabella uppercase'>Verify email address</h1>
            <Card className='w-full max-w-md'>
                <CardHeader>
                    {/* <Link to={"/sign-in"} className='flex items-center justify-center gap-2'>
                        <ArrowRight className='w-4 h-4' />
                        <p className='text-gray-500 font-semibold'>
                            Go to <span className='underline text-emerald-500'>Sign-In</span>
                        </p>
                    </Link> */}
                    <p className='flex justify-center text-xs text-center text-gray-300'>Generate automatic by moyokapit project&nbsp;<Copyright className='w-3 h-3' /> </p>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-self-center ">
                        {isVerifying ?
                            <>
                                <Loader className='w-10 h-10 text-gray-700 animate-spin mb-2' />
                                <h3 className='text-lg font-semibold text-gray-500'>Sedang memverifikasi email...</h3>
                                <p className=' text-gray-600'>Please wait while we verify your email</p>
                            </>
                            : isSuccess ? (
                                <>
                                    <CheckCircle className='w-10 h-10 text-emerald-500 mb-2' />
                                    <h3 className='text-lg font-semibold text-gray-700'>Email berhasil di verifikasi</h3>
                                    <p className=' text-gray-600'>Your email has been verified successfully</p>
                                    <Link to={"/sign-in"} className='text-sm text-emerald-600'>
                                        <Button variant={"outline"} className='mt-4 text-emerald-600 '>Back to Sign-In</Button>
                                    </Link>
                                </>
                            ) :
                                (
                                    <>
                                        <XCircle className='w-10 h-10 text-red-500 mb-2' />
                                        <h3 className='text-lg font-semibold text-gray-700'>Email tidak berhasil di verifikasi</h3>
                                        <p className=' text-gray-600'>Your email verification failed. Please try again</p>
                                        <Link to={"/sign-in"} className='text-sm text-emerald-600'>
                                            <Button variant={"outline"} className='mt-4 text-emerald-600'>Back to Sign-In</Button>
                                        </Link>
                                    </>
                                )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default VerifyEmail