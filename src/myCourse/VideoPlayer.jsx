import { useRef, useEffect } from "react";

const VideoPlayer = ({ title, videoUrl }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && videoUrl) {
      videoRef.current.load(); 
    }
  }, [videoUrl]);

  if (!videoUrl) {
    return (
      <div className="aspect-video bg-black rounded-lg flex items-center justify-center text-white">
        No video available
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>

      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full rounded-lg object-cover "
          controls
          preload="metadata"
          controlsList="nodownload"
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
