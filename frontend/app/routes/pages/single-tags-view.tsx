import { useAuth } from '@/providers/auth-context'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'

const SingleTagsView = () => {
    const { slug } = useParams()
    const navigate = useNavigate()
    const [blogPostData, setBlogPostData] = useState(null)
    const [comments, setComments] = useState(null)
    // const {user, setOpenAuthForm} = useAuth()
    const { user } = useAuth()

    return (
        <div>TAGS VIEW</div>
    )
}

export default SingleTagsView