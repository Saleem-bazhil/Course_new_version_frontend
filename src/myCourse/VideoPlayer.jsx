import { Play, Pause, Volume2, Maximize, Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const VideoPlayer = ({ title, videoUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState([0]);
  const [volume, setVolume] = useState([80]);

  return (
   <div className="w-full">
      {/* Video Container */}
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden group">
        {/* Placeholder for video */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted/20 to-background">
          {!isPlaying && (
            <button
              onClick={() => setIsPlaying(true)}
              className="w-20 h-20 rounded-full bg-primary/90 hover:bg-primary flex items-center justify-center transition-all hover:scale-110 shadow-lg"
            >
              <Play className="w-8 h-8 text-primary-foreground ml-1" />
            </button>
          )}
        </div>

        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Progress Bar */}
          <div className="mb-3">
            <Slider
              value={progress}
              onValueChange={setProgress}
              max={100}
              step={1}
              className="cursor-pointer"
            />
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-foreground hover:bg-muted/50"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>

              <div className="flex items-center gap-2 group/volume">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-foreground hover:bg-muted/50"
                >
                  <Volume2 className="w-5 h-5" />
                </Button>
                <div className="w-20 opacity-0 group-hover/volume:opacity-100 transition-opacity">
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                  />
                </div>
              </div>

              <span className="text-xs text-muted-foreground">0:00 / 47:00</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-foreground hover:bg-muted/50"
              >
                <Settings className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-foreground hover:bg-muted/50"
              >
                <Maximize className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
