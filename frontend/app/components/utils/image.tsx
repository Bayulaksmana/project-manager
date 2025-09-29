import { IKImage } from "imagekitio-react"

interface ImageProps {
    src: string,
    className: string,
    alt: string,
    w: number,
    h: number,
}

const Image = ({ src, className, alt, w, h }: ImageProps) => {
    return (
        <IKImage urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
            path={src}
            className={className}
            loading="lazy"
            lqip={{ active: true, quality: 90, blur: 0, threshold: 30 }}
            alt={alt}
            width={w}
            height={h}
            transformation={[
                {
                    width: w,
                    height: h,
                },
            ]}
        />
    )
}

export default Image