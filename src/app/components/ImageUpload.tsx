"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
  placeholder?: string;
}

export default function ImageUpload({ onImageUpload, currentImage, placeholder = "Upload memory photo" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cloudinary configuration
  const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "your-cloud-name";
  const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "keepr-uploads";

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    await uploadToCloudinary(file);
  };

  const uploadToCloudinary = async (file: File) => {
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.secure_url) {
        setPreviewUrl(data.secure_url);
        onImageUpload(data.secure_url);
      } else {
        throw new Error('No image URL returned');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      uploadToCloudinary(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onClick={triggerFileInput}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`
          relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
          ${uploading ? 'border-orange-300 bg-orange-50' : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'}
          ${previewUrl ? 'border-orange-200' : ''}
        `}
      >
        {previewUrl ? (
          <div className="relative">
            <Image
              src={previewUrl}
              alt="Memory preview"
              width={400}
              height={300}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <span className="text-white font-medium">Click to change image</span>
            </div>
          </div>
        ) : (
          <div className="py-8">
            {uploading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-orange-600">Uploading image...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                </svg>
                <div>
                  <p className="text-gray-600 font-medium">{placeholder}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Click to browse or drag and drop
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload button alternative */}
      {!previewUrl && !uploading && (
        <button
          onClick={triggerFileInput}
          className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
        >
          Choose Photo
        </button>
      )}

      {/* Clear button */}
      {previewUrl && (
        <button
          onClick={() => {
            setPreviewUrl(null);
            onImageUpload('');
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }}
          className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          Remove Image
        </button>
      )}
    </div>
  );
}