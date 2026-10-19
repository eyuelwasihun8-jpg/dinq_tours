import React, { useState, useRef } from 'react';
import { Upload, Loader2, Image as ImageIcon, X, Check, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function UploadWidget({ onUpload, currentImage, label = 'Upload Image' }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Upload file directly to Cloudinary via REST API (no widget)
  const uploadFile = async (file) => {
    // Validate
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPG, PNG, WebP)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be smaller than 10MB');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', 'dinq-cms');

      // Use XMLHttpRequest to track upload progress
      const xhr = new XMLHttpRequest();
      
      const promise = new Promise((resolve, reject) => {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error('Upload failed'));
          }
        };

        xhr.onerror = () => reject(new Error('Network error'));

        xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
        xhr.send(formData);
      });

      const result = await promise;
      
      // Add timestamp to URL to bust cache
      const freshUrl = `${result.secure_url}?v=${Date.now()}`;
      
      onUpload(freshUrl, result);
      toast.success('Image uploaded successfully!');
      setProgress(100);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 500);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    onUpload('');
    toast.success('Image removed');
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
          {label}
        </label>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />

      {currentImage ? (
        /* ============ EXISTING IMAGE PREVIEW ============ */
        <div className="relative group rounded-xl overflow-hidden border-2 border-stone-200 bg-stone-100 aspect-video">
          <img 
            src={currentImage} 
            alt="Current" 
            className="w-full h-full object-cover"
            key={currentImage}
          />
          
          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={openFileDialog}
              disabled={uploading}
              className="bg-white hover:bg-stone-100 text-stone-900 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-colors disabled:opacity-50"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              <span>Replace Image</span>
            </button>
            <button
              type="button"
              onClick={removeImage}
              disabled={uploading}
              className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              <span>Remove</span>
            </button>
          </div>

          {/* Upload progress overlay */}
          {uploading && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-10 h-10 text-[#C88A2E] animate-spin" />
              <div className="w-48 bg-stone-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-[#C88A2E] transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-white text-xs font-bold">Uploading... {progress}%</span>
            </div>
          )}
        </div>
      ) : (
        /* ============ UPLOAD DROPZONE ============ */
        <div
          onClick={openFileDialog}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
            dragOver 
              ? 'border-[#C88A2E] bg-amber-50 scale-[1.02]' 
              : uploading
              ? 'border-amber-400 bg-amber-50'
              : 'border-stone-300 hover:border-[#C88A2E] bg-stone-50 hover:bg-amber-50/50'
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="w-12 h-12 text-[#C88A2E] animate-spin" />
              <div className="w-full max-w-xs bg-stone-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-[#C88A2E] transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-bold text-stone-700">
                {progress < 100 ? `Uploading... ${progress}%` : 'Processing...'}
              </span>
            </>
          ) : (
            <>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                dragOver ? 'bg-[#C88A2E] text-white' : 'bg-amber-100 text-[#C88A2E]'
              }`}>
                <ImageIcon className="w-8 h-8" />
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-stone-900 mb-1">
                  {dragOver ? '📥 Drop image here' : 'Click or drag image to upload'}
                </div>
                <div className="text-xs text-stone-500">
                  PNG, JPG, WebP • Max 10MB
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openFileDialog();
                }}
                className="btn-gold px-5 py-2 rounded-lg text-xs font-bold mt-1"
              >
                Choose File
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}