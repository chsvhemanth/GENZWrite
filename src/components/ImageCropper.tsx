import React, { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';

interface Area {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface ImageCropperProps {
  imageSrc: string;
  aspect?: number;
  onCancel: () => void;
  onCropped: (blobUrl: string) => void;
}

// Utility to crop using canvas and return a blob URL
async function getCroppedImg(imageSrc: string, crop: Area): Promise<string> {
  const image = document.createElement('img');
  image.src = imageSrc;
  await new Promise((res) => (image.onload = res));

  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width * scaleX;
  canvas.height = crop.height * scaleY;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width * scaleX,
    crop.height * scaleY
  );
  return await new Promise<string>((resolve) => {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob!);
      resolve(url);
    }, 'image/png');
  });
}

export const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, aspect = 1, onCancel, onCropped }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixelsLocal: Area) => {
    setCroppedAreaPixels(croppedAreaPixelsLocal);
  }, []);

  const handleDone = async () => {
    if (!croppedAreaPixels) return;
    const url = await getCroppedImg(imageSrc, croppedAreaPixels);
    onCropped(url);
  };

  return (
    <div className="space-y-3">
      <div className="relative h-64 bg-muted rounded-md overflow-hidden">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" className="px-3 py-2 text-sm border rounded-md" onClick={onCancel}>Cancel</button>
        <button type="button" className="px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md" onClick={handleDone}>Crop</button>
      </div>
    </div>
  );
};


