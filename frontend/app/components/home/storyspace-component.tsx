import { LucideCheckCircle, LucideCode, LucideCopy, LucideCopyCheck } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import oneLight from 'react-syntax-highlighter/dist/esm/styles/prism/one-light.js'
import { FacebookIcon, FacebookShareButton, FacebookShareCount, LinkedinIcon, LinkedinShareButton, RedditIcon, RedditShareButton, TelegramIcon, TelegramShareButton, ThreadsIcon, ThreadsShareButton, TwitterShareButton, WhatsappIcon, WhatsappShareButton, XIcon } from "react-share"
import { toast } from "sonner"
import type { commentProps } from "@/types"
import { useAuth } from "@/providers/auth-context"
import { postData } from "@/lib/fetch-utils"



const MarkdownContent = ({ content }: { content: string }) => {
    if (!content) return null
    return (
        <div className="">
            <div className="text-justify prose prose-slate dark:prose-invert max-w-none">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                        code({ node, className, children, ...props }: any) {
                            const match = /language-(\w+)/.exec(className || '')
                            const language = match ? match[1] : ''
                            const isInline = !className
                            return !isInline
                                ? (<CodeBlock
                                    code={String(children).replace(/\n$/, '')}
                                    language={language} />)
                                : (<code className="px-1 py-0.5 bg-sky-50 rounded-md text-sm" {...props}>{children}</code>)
                        },
                        p({ children }) {
                            return <p className="mb-4 leading-[22px]">{children}</p>
                        },
                        strong({ children }) {
                            return <strong>{children}</strong>
                        },
                        em({ children }) {
                            return <em>{children}</em>
                        },
                        ul({ children }) {
                            return <ul className="list-disc pl-6 space-y-2 my-4">{children}</ul>
                        },
                        ol({ children }) {
                            return <ol className="list-decimal pl-6 space-y-2 my-4">{children}</ol>
                        },
                        li({ children }) {
                            return <li className="mb-2 leading-[22px]">{children}</li>
                        },
                        blockquote({ children }) {
                            return <blockquote className="border-l-4 border-gray-200 pl-4 italic my-4">{children}</blockquote>
                        },
                        h1({ children }) {
                            return <h1 className="text-2xl font-bold mt-6 mb-4">{children}</h1>
                        },
                        h2({ children }) {
                            return <h2 className="text-xl font-bold mt-6 mb-3">{children}</h2>
                        },
                        h3({ children }) {
                            return <h3 className="text-lg mt-5 mb-2">{children}</h3>
                        },
                        h4({ children }) {
                            return <h4 className="text-base font-bold mt-4 mb-2">{children}</h4>
                        },
                        a({ children, href }) {
                            return <a href={href} className="text-blue-600 hover:underline">{children}</a>
                        },
                        table({ children }) {
                            return (
                                <div className="overflow-x-auto my-4">
                                    <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
                                        {children}
                                    </table>
                                </div>
                            )
                        },
                        thead({ children }) {
                            return <thead className="bg-gray-50">{children}</thead>
                        },
                        tbody({ children }) {
                            return <tbody className="divide-y divide-gray-200">{children}</tbody>
                        },
                        tr({ children }) {
                            return <tr>{children}</tr>
                        },
                        th({ children }) {
                            return <th className="px-3 py-2 text-left text-xs font-medium to-gray-500 uppercase tracking-wider">{children}</th>
                        },
                        td({ children }) {
                            return <td className="px-3 py-2 whitespace-nowrap text-sm">{children}</td>
                        },
                        hr() {
                            return <hr className="my-6 border-gray-200" />
                        },
                        img({ src, alt }) {
                            return <img className="my-4 max-w-full rounded" src={src} alt={alt} />
                        },
                    }}
                >{content}</ReactMarkdown>
            </div>
        </div >
    )
}

const CodeBlock = ({ code, language }: { code: string, language: string }) => {
    const [copied, setCopied] = useState(false)
    const copyCode = () => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }
    return (
        <div className="relative my-6 rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                    <LucideCode size={16} className="text-gray-500" />
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{language || 'code'}</span>
                </div>
                <Button onClick={copyCode} className="text-gray-500 hover:text-gray-700 focus:outline-none" aria-label="Copy Code">
                    {copied
                        ? (<LucideCheckCircle size={16} className="text-emerald-500" />)
                        : (<LucideCopy size={16} className="" />)
                    }
                    {copied && (<span className="absolute -top-8 right-0 bg-black text-white text-xs rounded-md px-2 py-1 opacity-80 group-hover:opacity-100 transition">Copied!</span>)}
                </Button>
            </div>
            <SyntaxHighlighter
                language={language}
                style={oneLight}
                costumStyle={{ fontSize: 12.5, margin: 0, padding: "1rem", background: "transparent" }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    )
}

const SharePost = ({ title }: { title: string }) => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : ""
    const [isCopied, setIsCopied] = useState(false)
    const handleCopyClick = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            setIsCopied(true)
            toast.success("✅ Link berhasil disalin!")
            setTimeout(() => setIsCopied(false), 2000)
        }).catch((err) => { console.error("Gagal copy link", err); toast.error("❌ Gagal menyalin link") })
    }
    return (
        <div className="my-6">
            <p className="font-medium text-lg mb-3 text-gray-600">Bagikan Story</p>
            <div className="flex gap-4 items-center flex-wrap">
                <FacebookShareButton url={shareUrl} >
                    <FacebookIcon size={32} round={true} />
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl}>
                    <XIcon size={32} round={true} />
                </TwitterShareButton>
                <LinkedinShareButton url={shareUrl}>
                    <LinkedinIcon size={32} round={true} />
                </LinkedinShareButton>
                <TelegramShareButton url={shareUrl}>
                    <TelegramIcon size={32} round={true} />
                </TelegramShareButton>
                <WhatsappShareButton url={shareUrl}>
                    <WhatsappIcon size={32} round={true} />
                </WhatsappShareButton>
                <ThreadsShareButton url={shareUrl}>
                    <ThreadsIcon size={32} round={true} />
                </ThreadsShareButton>
                <RedditShareButton url={shareUrl}>
                    <RedditIcon size={32} round={true} />
                </RedditShareButton>
                <Button title="Copy Link Story" onClick={handleCopyClick} className="bg-sky-200 hover:bg-sky-300 text-black font-medium rounded-full border-2 border-sky-100 hover:border-sky-400 hover:text-sky-700">
                    {
                        isCopied
                            ? <LucideCopyCheck className="text=[20px]" />
                            : <LucideCopy className="text=[20px]" />
                    }
                </Button>
            </div>
            <FacebookShareCount url={shareUrl}>
                {(shareCount) => <span className="myShareCountWrapper">{shareCount}</span>}
            </FacebookShareCount>
        </div>
    )
}

const CommentInfoCard = ({ comId, authorName, authorPhoto, content, updateOn, post, replies, getAllComments, onDelete }: commentProps) => {
    const { user } = useAuth()
    const [replyText, setReplyText] = useState("")
    const [showReplyFrom, setShowReplayFrom] = useState(false)
    const [showSubReplies, setShowSubReplies] = useState(false)

    const handleCancelReply = () => {
        setReplyText("")
        setShowReplayFrom(false)
    }
    const handleAddReply = async (postId: any, commentId: any) => {
        try {
            const response = await postData(`/comments/${postId}`, {
                content: replyText,
                parentComment: commentId
            }) as { response: any }
            console.log(response)
            toast.success("success")
            setReplyText("")
            setShowReplayFrom(false)
            getAllComments()
        } catch (error: any) {
            const msg = error.message
            toast.error(msg)
        }
    }

    return (
        <div className="">comment</div>
    )
}


export { MarkdownContent, SharePost, CommentInfoCard }