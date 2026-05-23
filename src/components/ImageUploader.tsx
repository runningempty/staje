import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { storage, ref, uploadBytes, getDownloadURL } from '../lib/firebase';

interface ImageUploaderProps {
  currentUrl: string;
  onUpload: (url: string) => void;
  label?: string;
  folder?: string;
}

export function ImageUploader({ currentUrl, onUpload, label, folder = 'images' }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file) return;
    
    setUploading(true);
    try {
      const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      onUpload(url);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>}
      
      <div 
        className={`relative group h-32 rounded-2xl border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center text-center p-4 ${
          dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 bg-white/5 hover:border-white/20'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={onFileChange}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Uploading...</span>
          </div>
        ) : currentUrl ? (
          <>
            <img 
              src={currentUrl} 
              alt="Preview" 
              className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-10 transition-opacity"
            />
            <div className="relative z-10 flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="w-5 h-5 text-white" />
              <span className="text-[10px] text-white uppercase font-bold tracking-widest">Change Image</span>
            </div>
            <div className="absolute top-2 right-2 z-20">
               <ImageIcon className="w-4 h-4 text-white/40" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-500">
            <Upload className="w-6 h-6" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Drop image here or click</span>
          </div>
        )}
      </div>
    </div>
  );
}
