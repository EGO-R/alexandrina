import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DEFAULT_IMAGES } from "@/config";
import { Video } from "@/types";

export default function VideoCard({ id, name, preview, videoUrl, author, privacyType }: Video) {
  // Проверяем загрузку изображения
  const [imgError, setImgError] = useState(false);
  const imgSrc = imgError ? DEFAULT_IMAGES.thumbnail : preview;

  return (
    <div className="card group">
      <Link href={`/video/${id}`}>
        <div className="relative h-40 w-full overflow-hidden">
          <Image
            src={imgSrc}
            alt={name}
            fill
            className="object-cover transform transition-transform group-hover:scale-105"
            onError={() => setImgError(true)}
            unoptimized={true}
          />
          {privacyType === "PRIVATE" && (
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
              Приватное
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/video/${id}`}>
          <h3 className="font-semibold text-text-primary line-clamp-2 group-hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>
        
        <Link href={`/channel/${author.id}`} className="mt-2 flex items-center">
          <span className="text-sm text-text-secondary hover:text-primary transition-colors">
            {author.name}
          </span>
        </Link>
      </div>
    </div>
  );
}
