import React, { useState, useRef } from 'react';
import { Upload, Loader2, X, Plus, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function GalleryUploadWidget({ images = [], onChange, label = 'Image Gallery' }) {
  const [uploading, setUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState({ done: 0, total: 0 });
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const uploadSingleFile = async (file) => {
    if (!file.type.startsWith('image/')) {
      throw new Error('Not an image');
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File too large');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'dinq-cms/galleries');

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Upload failed');
    const data = await response.json();
    // Cache-bust URL
    return `${data.secure_url}?v=${Date.now()}`;
  };

  const uploadMultiple = async (files) => {
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    
    if (validFiles.length === 0) {
      toast.error('Please upload image files only');
      return;
    }

    if (validFiles.length > 10) {
      toast.error('Please upload maximum 10 images at once');
      return;
    }

    setUploading(true);
    setUploadQueue({ done: 0, total: validFiles.length });

    const newUrls = [];
    let successCount = 0;
    let failCount = 0;

    for (const file of validFiles) {
      try {
        const url = await uploadSingleFile(file);
        newUrls.push(url);
        successCount++;
      } catch (error) {
        failCount++;
        console.error('Failed to upload:', file.name, error);
      }
      setUploadQueue(prev => ({ ...prev, done: prev.done + 1 }));
    }

    if (newUrls.length > 0) {
      onChange([...images, ...newUrls]);
      toast.success(`${successCount} image(s) added to gallery${failCount ? ` (${failCount} failed)` : ''}`);
    } else {
      toast.error('All uploads failed');
    }

    setUploading(false);
    setUploadQueue({ done: 0, total: 0 });
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) uploadMultiple(files);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) uploadMultiple(files);
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

  const removeImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
    toast.success('Image removed');
  };

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">{label}</label>
          <span className="text-xs text-stone-500 font-medium">{images.length} image(s)</span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <div 
        className={`relative rounded-xl transition-all ${
          dragOver ? 'ring-4 ring-[#C88A2E]/30 bg-amber-50' : ''
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* Existing Images */}
          {images.map((url, idx) => (
            <div 
              key={`${url}-${idx}`} 
              className="relative group aspect-square rounded-xl overflow-hidden border border-stone-200 bg-stone-100"
            >
              <img 
                src={url} 
                alt={`Gallery ${idx + 1}`} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg px-3 py-1.5 text-xs font-bold flex items-center gap-1 shadow-lg"
                >
                  <X className="w-3 h-3" />
                  Remove
                </button>
              </div>
              <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                #{idx + 1}
              </div>
            </div>
          ))}

          {/* Add Button / Dropzone */}
          <button
            type="button"
            onClick={openFileDialog}
            disabled={uploading}
            className={`aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${
              dragOver 
                ? 'border-[#C88A2E] bg-amber-100 text-[#C88A2E]' 
                : uploading
                ? 'border-amber-400 bg-amber-50 text-amber-600'
                : 'border-stone-300 hover:border-[#C88A2E] bg-stone-50 hover:bg-amber-50/50 text-stone-500 hover:text-[#C88A2E]'
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-[10px] font-bold text-center">
                  Uploading {uploadQueue.done}/{uploadQueue.total}
                </span>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-[#C88A2E]" />
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold">Add Images</div>
                  <div className="text-[10px] text-stone-400">Up to 10 at once</div>
                </div>
              </>
            )}
          </button>
        </div>

        {/* Hint message when dragging */}
        {dragOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-[#C88A2E] text-white px-6 py-3 rounded-xl shadow-2xl font-bold text-sm">
              📥 Drop images to upload
            </div>
          </div>
        )}
      </div>

      {/* Help text */}
      {images.length === 0 && !uploading && (
        <p className="text-xs text-stone-500 flex items-center gap-1">
          <ImageIcon className="w-3 h-3" />
          <span>Click "Add Images" or drag & drop image files here</span>
        </p>
      )}
    </div>
  );
}