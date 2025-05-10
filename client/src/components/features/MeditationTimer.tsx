import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/useToast";

export function MeditationTimer() {
  const [duration, setDuration] = useState(300); // 5 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Create audio element programmatically
    const audio = new Audio();
    audio.src = "/assets/audio/meditation-sound.mp3";
    audio.loop = true;
    audio.volume = 0.5;
    audio.load(); // Force preload
    audioRef.current = audio;

    // Check if audio failed to load
    audio.addEventListener('error', (e) => {
      toast({
        title: "Audio Error",
        description: "Meditation sound could not be loaded. Using silent meditation mode.",
        variant: "destructive",
      });
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [toast]);

  useEffect(() => {
    setTimeLeft(duration);
    setProgress(0);
  }, [duration]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current!);
            setIsActive(false);
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (!isActive && intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  useEffect(() => {
    setProgress(100 - (timeLeft / duration) * 100);
  }, [timeLeft, duration]);

  const toggleTimer = () => {
    setIsActive(!isActive);
    if (!isActive) {
      if (timeLeft === 0) {
        setTimeLeft(duration);
        setProgress(0);
      }
      if (audioRef.current && !isMuted) {
        audioRef.current.play().catch(e => {
          toast({
            title: "Audio Error",
            description: "Meditation sound could not be played. Using silent meditation mode.",
            variant: "destructive",
          });
        });
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration);
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDurationChange = (value: number[]) => {
    const newDuration = value[0] * 60; // Convert minutes to seconds
    setDuration(newDuration);
    setTimeLeft(newDuration);
    setProgress(0);
    setIsActive(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // Tree growth stages based on progress
  const treeStage = Math.min(Math.floor(progress / 20), 4);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">Growing Tree Meditation</h3>
        <p className="text-green-700 dark:text-green-400">
          Set a timer and watch the tree grow as you meditate
        </p>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-64 h-64 relative mb-8">
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-green-200 dark:bg-green-900 rounded-full" />

          {/* Tree trunk */}
          <div
            className="absolute bottom-8 left-1/2 w-4 bg-amber-800 dark:bg-amber-900 rounded-full origin-bottom transition-all duration-500"
            style={{
              height: `${Math.min(20 + progress * 0.6, 80)}px`,
              marginLeft: "-8px",
            }}
          />

          {/* Tree foliage */}
          {treeStage >= 0 && (
            <div
              className="absolute rounded-full bg-green-500 dark:bg-green-700 transition-all duration-500"
              style={{
                bottom: "28px",
                left: "50%",
                marginLeft: "-20px",
                width: "40px",
                height: "40px",
                opacity: Math.min(progress / 20, 1),
                transform: `scale(${Math.min(progress / 20, 1)})`,
              }}
            />
          )}

          {treeStage >= 1 && (
            <div
              className="absolute rounded-full bg-green-500 dark:bg-green-700 transition-all duration-500"
              style={{
                bottom: "48px",
                left: "50%",
                marginLeft: "-25px",
                width: "50px",
                height: "50px",
                opacity: Math.min((progress - 20) / 20, 1),
                transform: `scale(${Math.min((progress - 20) / 20, 1)})`,
              }}
            />
          )}

          {treeStage >= 2 && (
            <div
              className="absolute rounded-full bg-green-500 dark:bg-green-700 transition-all duration-500"
              style={{
                bottom: "78px",
                left: "50%",
                marginLeft: "-30px",
                width: "60px",
                height: "60px",
                opacity: Math.min((progress - 40) / 20, 1),
                transform: `scale(${Math.min((progress - 40) / 20, 1)})`,
              }}
            />
          )}

          {treeStage >= 3 && (
            <div
              className="absolute rounded-full bg-green-500 dark:bg-green-700 transition-all duration-500"
              style={{
                bottom: "118px",
                left: "50%",
                marginLeft: "-35px",
                width: "70px",
                height: "70px",
                opacity: Math.min((progress - 60) / 20, 1),
                transform: `scale(${Math.min((progress - 60) / 20, 1)})`,
              }}
            />
          )}

          {treeStage >= 4 && (
            <div
              className="absolute rounded-full bg-green-500 dark:bg-green-700 transition-all duration-500"
              style={{
                bottom: "168px",
                left: "50%",
                marginLeft: "-25px",
                width: "50px",
                height: "50px",
                opacity: Math.min((progress - 80) / 20, 1),
                transform: `scale(${Math.min((progress - 80) / 20, 1)})`,
              }}
            />
          )}
        </div>

        <div className="text-4xl font-bold text-green-800 dark:text-green-300 mb-6">
          {formatTime(timeLeft)}
        </div>

        <Card className="w-full max-w-md border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-green-700 dark:text-green-400">
                  <span>Duration (minutes)</span>
                  <span>{duration / 60}</span>
                </div>
                <Slider
                  defaultValue={[duration / 60]}
                  min={1}
                  max={30}
                  step={1}
                  onValueChange={handleDurationChange}
                  disabled={isActive}
                  className="[&_[role=slider]]:bg-green-600"
                />
              </div>

              <div className="flex justify-center space-x-4">
                <Button
                  onClick={toggleTimer}
                  className={`w-12 h-12 rounded-full ${
                    isActive
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isActive ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 ml-0.5" />
                  )}
                </Button>
                <Button
                  onClick={resetTimer}
                  variant="outline"
                  className="w-12 h-12 rounded-full border-green-600 text-green-700 hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-900/30"
                  disabled={timeLeft === duration && !isActive}
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
                <Button
                  onClick={toggleMute}
                  variant="outline"
                  className="w-12 h-12 rounded-full border-green-600 text-green-700 hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-900/30"
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center text-sm text-green-600 dark:text-green-500 mt-6">
        {isActive ? (
          <p>Take deep breaths and focus on the present moment...</p>
        ) : timeLeft === 0 ? (
          <p>Meditation complete! How do you feel?</p>
        ) : (
          <p>Press play to start your meditation session</p>
        )}
      </div>
    </div>
  );
}