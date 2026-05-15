import React, { useState, useRef } from 'react';
import { Link } from 'react-router';

interface PredictResponse {
  label: string;
  confidence: number;
  prediction: any[];
  num_classes: number;
}

const Predict: React.FC = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem("access_token");

    if (!token) {
      alert('No authorization token found. You must be logged in to upload an image.');
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/predict', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Server connection error');
      }

      const data: PredictResponse = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error during recognition:', error);
      alert('Failed to recognize the can. Check the console.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center p-6 relative overflow-x-hidden font-sans text-white"
      style={{
        backgroundColor: "#1a1a1a",
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 2px,
          rgba(255,255,255,.03) 2px,
          rgba(255,255,255,.03) 4px
        )`,
      }}
    >
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="w-10 h-10 border-2 border-lime-500 rounded-lg flex items-center justify-center text-lime-500 hover:bg-lime-500 hover:text-black transition-colors text-lg font-bold"
          title="Home"
        >
          ⌂
        </Link>
      </div>

      <div className="w-full max-w-2xl mt-16 flex flex-col items-center">
        <h1 className="text-3xl text-lime-500 font-bold text-center mb-8 uppercase tracking-widest">
          Can Checker
        </h1>

        <div className="w-full bg-[#1a1a1a]/80 backdrop-blur-sm border-2 border-lime-500/30 rounded-lg p-8 shadow-xl flex flex-col items-center">
          <p className="text-base mb-8 font-bold text-center">
            Have a can in your collection but don't know its flavor? Upload a picture and we'll tell you everything about it!
          </p>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          <div 
            className="cursor-pointer flex flex-col items-center justify-center mb-5 transition-transform duration-200 hover:scale-[1.02]" 
            onClick={handleImageClick}
          >
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Can preview" 
                className="max-w-full max-h-[400px] rounded-xl mb-5 shadow-[0_0_20px_rgba(0,0,0,0.8)] border-2 border-lime-500/50 object-contain" 
              />
            ) : (
              <div className="w-[250px] h-[350px] border-2 border-dashed border-lime-500 rounded-xl flex items-center justify-center text-lime-500 font-bold bg-lime-500/5 hover:bg-lime-500/10 transition-colors text-center p-4">
                Click to upload an image
              </div>
            )}
          </div>

          {isLoading && (
            <div className="text-lime-500 font-bold animate-pulse mt-4">
              Analyzing image...
            </div>
          )}
          
          {result && !isLoading && (
            <div className="mt-6 flex flex-col gap-2 text-center p-4 border-2 border-lime-500/30 rounded-lg w-full max-w-sm bg-black/40">
              <p className="m-0 text-lg font-bold">
                Result: <span className="text-lime-500">{result.label}</span>
              </p>
              <p className="m-0 text-lg font-bold">
                Confidence: <span className="text-lime-500">{(result.confidence * 100).toFixed(2)}%</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Predict;