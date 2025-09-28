import { Link } from 'react-router'
import type { Route } from '../../+types/root'
import Noted from '@/components/utils/title-cilik'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import Image from '@/components/utils/image'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Moyokapit Project" },
    { name: "description", content: "Dega Nion Don.." },
  ]
}
const Homepage = () => {
  return (
    <div className="flex flex-col md:gap-4 md:px-8">
      <Noted title='Home' link='/' page='Landing Page' />
      <div className="flex items-center justify-between gap-4">
        <div className="">
          <h1 className="text-gray-800 text-2xl text-center sm:text-justify md:text-left md:text-3xl lg:text-4xl font-bold tracking-wide">
            Keluarga Pelajar Mahasiswa Indonesia Bolaang Mongondow Raya (KPMIBM-R)
            <span className="italic text-sm md:text-xl text-center"> ~ Mototompiaan, Mototabian, bo Mototanoban</span>
          </h1>
        </div>
        <Link to="/sign-in" className="hidden md:flex relative">
          <svg
            viewBox="0 0 200 200"
            width="150"
            height="200"
            className="text-lg tracking-wide animate-spin animatedButton"
          >
            <path id="circlePath" fill="none" d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" />
            <text className="font-cabella text-2xl tracking-widest">
              <textPath href="#circlePath" startOffset="52%">Dega nion don •</textPath>
              <textPath href="#circlePath" startOffset="0%">Write your story •</textPath>
            </text>
          </svg>
          <Button type="button" variant={"ghost"} className="absolute top-0 left-0 right-0 bottom-0 m-auto w-25 h-25 rounded-full flex items-center justify-center">
            <Image src="/logo/logo-utama-besar.png" alt="Logo create cerita" className='w-35' w={35} h={35} />
          </Button>
        </Link>
      </div>
        <Separator/>
    </div>
  )
}

export default Homepage