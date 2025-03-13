"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IKVideo } from "imagekitio-next";
import { ChevronUp, ChevronDown } from "lucide-react";
import { IVideo } from "@/models/Video";
import { apiClient } from "@/lib/api-client";
import { useNotification } from "@/app/components/Notification";

export default function VideoPage() {
  const params = useParams();
  const router = useRouter();
  const { showNotification } = useNotification();
  const [video, setVideo] = useState<IVideo | null>(null);
  const [allVideos, setAllVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch current video
        const videoData = await apiClient.getVideo(params.id as string);
        setVideo(videoData);
        
        // Fetch all videos for navigation
        const allVideosData = await apiClient.getVideos();
        setAllVideos(allVideosData);
        
        // Find index of current video
        const index = allVideosData.findIndex(
          (v) => v._id?.toString() === params.id
        );
        if (index !== -1) {
          setCurrentIndex(index);
        }
      } catch (error) {
        console.error("Error fetching video:", error);
        showNotification("Failed to load video", "error");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id, showNotification]);

  const navigateToVideo = (direction: "next" | "prev") => {
    if (allVideos.length <= 1) return;
    
    let newIndex;
    if (direction === "next") {
      newIndex = (currentIndex + 1) % allVideos.length;
    } else {
      newIndex = (currentIndex - 1 + allVideos.length) % allVideos.length;
    }
    
    const nextVideoId = allVideos[newIndex]._id?.toString();
    if (nextVideoId) {
      router.push(`/videos/${nextVideoId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Video not found</h1>
        <button 
          className="btn btn-primary mt-4"
          onClick={() => router.push("/")}
        >
          Back to home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Video player container */}
      <div className="flex-1 relative">
        {/* Video player */}
        <div className="absolute inset-0 flex items-center justify-center">
          <IKVideo
            path={video.videoUrl}
            transformation={[{ height: "1920", width: "1080" }]}
            controls={video.controls ?? true}
            autoPlay
            loop
            className="h-full max-h-screen max-w-screen-sm mx-auto object-contain"
          />
        </div>
        
        {/* Navigation arrows */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-8">
          <button 
            onClick={() => navigateToVideo("prev")}
            className="bg-black/30 hover:bg-black/50 p-2 rounded-full text-white"
            aria-label="Previous video"
          >
            <ChevronUp size={24} />
          </button>
          <button 
            onClick={() => navigateToVideo("next")}
            className="bg-black/30 hover:bg-black/50 p-2 rounded-full text-white"
            aria-label="Next video"
          >
            <ChevronDown size={24} />
          </button>
        </div>
      </div>
      
      {/* Video info */}
      <div className="p-4 bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 right-0 text-white">
        <h1 className="text-xl font-bold">{video.title}</h1>
        <p className="mt-2 opacity-80 line-clamp-2">{video.description}</p>
      </div>
    </div>
  );
}