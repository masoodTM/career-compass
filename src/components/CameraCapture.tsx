import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, RefreshCw, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface CameraCaptureProps {
  onCapture: (photoData: string) => void;
  currentPhoto?: string;
}

const CameraCapture = ({ onCapture, currentPhoto }: CameraCaptureProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(currentPhoto || null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      toast.error("Could not access camera. Please check permissions.");
      console.error("Camera error:", error);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(startCamera, 100);
  };

  const handleClose = () => {
    stopCamera();
    setIsOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        // Set canvas size to 300x300 for cropped output
        canvas.width = 300;
        canvas.height = 300;
        
        // Calculate crop area (center square)
        const size = Math.min(video.videoWidth, video.videoHeight);
        const offsetX = (video.videoWidth - size) / 2;
        const offsetY = (video.videoHeight - size) / 2;
        
        ctx.drawImage(video, offsetX, offsetY, size, size, 0, 0, 300, 300);
        
        const photoData = canvas.toDataURL("image/jpeg", 0.8);
        setCapturedPhoto(photoData);
        onCapture(photoData);
        stopCamera();
        toast.success("Photo captured!");
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            
            if (ctx) {
              canvas.width = 300;
              canvas.height = 300;
              
              // Center crop
              const size = Math.min(img.width, img.height);
              const offsetX = (img.width - size) / 2;
              const offsetY = (img.height - size) / 2;
              
              ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, 300, 300);
              const photoData = canvas.toDataURL("image/jpeg", 0.8);
              setCapturedPhoto(photoData);
              onCapture(photoData);
              toast.success("Photo uploaded!");
              handleClose();
            }
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const retake = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  return (
    <>
      <div className="space-y-3">
        {capturedPhoto ? (
          <div className="flex items-center gap-4">
            <img
              src={capturedPhoto}
              alt="Student photo"
              className="w-20 h-20 rounded-xl object-cover border-2 border-primary/30"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleOpen}
              className="gap-2"
            >
              <RefreshCw size={16} />
              Change Photo
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={handleOpen}
            className="w-full h-12 gap-2 border-dashed border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5"
          >
            <Camera size={20} className="text-primary" />
            📷 Capture Student Photo
          </Button>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-lg glass-card border-primary/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Camera className="text-primary" />
              Capture Student Photo
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {!capturedPhoto ? (
              <>
                <div className="relative aspect-square w-full max-w-sm mx-auto rounded-xl overflow-hidden bg-muted/30 border border-border/50">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {!stream && (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      Starting camera...
                    </div>
                  )}
                  {/* Overlay grid */}
                  <div className="absolute inset-0 border-4 border-primary/30 rounded-xl pointer-events-none" />
                </div>

                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={capturePhoto}
                    variant="neon"
                    size="lg"
                    className="gap-2"
                    disabled={!stream}
                  >
                    <Camera size={20} />
                    Capture
                  </Button>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    <Upload size={20} />
                    Upload from Gallery
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="relative aspect-square w-full max-w-sm mx-auto rounded-xl overflow-hidden">
                  <img
                    src={capturedPhoto}
                    alt="Captured"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex gap-3 justify-center">
                  <Button onClick={retake} variant="outline" className="gap-2">
                    <RefreshCw size={18} />
                    Retake
                  </Button>
                  <Button onClick={handleClose} variant="neon" className="gap-2">
                    Use This Photo
                  </Button>
                </div>
              </>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CameraCapture;
