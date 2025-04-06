import { useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VideoTestimonial() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  
  const handlePlayClick = () => {
    setIsPlaying(true);
    // In a real app, this would control the video playback
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    // In a real app, this would control the video audio
  };

  return (
    <div className="max-w-4xl mx-auto relative rounded-2xl overflow-hidden shadow-2xl">
      {/* This would be an actual video in production */}
      <div className="relative aspect-video bg-gray-900">
        <img
          src="https://images.unsplash.com/photo-1581091226033-b62ef1df3e8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
          alt="Video thumbnail"
          className={`w-full h-full object-cover ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
        />
        
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <Button
              className="bg-white text-blue-600 hover:bg-blue-50 rounded-full h-16 w-16 flex items-center justify-center"
              onClick={handlePlayClick}
            >
              <Play className="h-8 w-8" fill="currentColor" />
            </Button>
          </div>
        )}
        
        {isPlaying && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <p className="text-white text-lg">Video would play here in a production environment</p>
          </div>
        )}
        
        <div className="absolute bottom-4 right-4">
          <Button
            variant="outline"
            size="icon"
            className="bg-black/30 border-white/20 backdrop-blur text-white hover:bg-black/40"
            onClick={toggleMute}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6">
        <div className="flex items-start space-x-4">
          <img
            src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80"
            alt="John Davis"
            className="h-12 w-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">John Davis</h3>
            <p className="text-sm text-gray-500">Software Engineering Graduate</p>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              "EduLearn completely changed my career path. I went from working at a restaurant to landing a job at a top tech company in just 6 months. The courses were engaging and the mentorship was invaluable."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
