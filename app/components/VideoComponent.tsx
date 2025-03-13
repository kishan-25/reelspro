import { IKImage } from "imagekitio-next";
import Link from "next/link";
import { Play } from "lucide-react";
import { IVideo } from "@/models/Video";

export default function VideoComponent({ video }: { video: IVideo }) {
  return (
    <div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300">
      <figure className="relative px-4 pt-4">
        <Link href={`/videos/${String(video._id)}`} className="relative group w-full">
          <div className="rounded-xl overflow-hidden relative w-full aspect-[9/16]">
            {video?.thumbnailUrl ? (
              <>
                <IKImage
                  path={video.thumbnailUrl}
                  transformation={[{ height: "480", width: "270" }]}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  alt={video.title}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-primary/80 p-3 rounded-full">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-200">
                <span className="text-gray-500">Thumbnail Unavailable</span>
              </div>
            )}
          </div>
        </Link>
      </figure>

      <div className="card-body p-4">
        <Link
          href={`/videos/${String(video._id)}`}
          className="hover:opacity-80 transition-opacity"
        >
          <h2 className="card-title text-lg">{video?.title || "Untitled Video"}</h2>
        </Link>

        <p className="text-sm text-base-content/70 line-clamp-2">
          {video?.description || "No description available."}
        </p>
      </div>
    </div>
  );
}