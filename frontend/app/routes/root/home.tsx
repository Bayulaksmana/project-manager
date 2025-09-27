import { Button } from '@/components/ui/button'
import type { Route } from '../../+types/root'
import { Link } from 'react-router'
import { PopoverDemo } from './footer'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Moyokapit Project" },
    { name: "description", content: "Dega Nion Don.." },
  ]
}
const Homepage = () => {
  return (
    <>
      <div className='w-full h-screen flex items-center justify-center gap-2'>
        <Link to="/sign-in">
          <Button className='bg-blue-500 text-white'>Login</Button>
        </Link>
        <Link to="/sign-up">
          <Button variant="outline" className='bg-blue-500 text-white'>Sign Up</Button>
        </Link>
      </div>
      <div className="flex fixed justify-end w-full bottom-4 right-4">
        <PopoverDemo />
      </div>
    </>
  )
}

export default Homepage