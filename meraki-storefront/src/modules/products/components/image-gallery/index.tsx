import { HttpTypes } from "@medusajs/types"
import { Container, clx } from "@medusajs/ui"
import Image from "next/image"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  return (
    <div className="flex items-start relative">
      <div className="grid grid-cols-1 small:grid-cols-2 gap-4 w-full">
        {images.map((image, index) => {
          return (
            <div
              key={image.id}
              className={clx(
                "relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-ui-bg-subtle",
                {
                  "small:col-span-2": index === 0,
                }
              )}
              id={image.id}
            >
              {!!image.url && (
                <Image
                  src={image.url}
                  priority={index <= 2 ? true : false}
                  className="absolute inset-0 transition-transform duration-500 hover:scale-105"
                  alt={`Product image ${index + 1}`}
                  fill
                  sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                  style={{
                    objectFit: "cover",
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ImageGallery
