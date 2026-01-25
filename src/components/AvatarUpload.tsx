'use client';

import React, { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AvatarUploadProps {
    currentImage?: string;
    onImageChange: (imageUrl: string) => void;
    isEditing: boolean;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
    currentImage,
    onImageChange,
    isEditing
}) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setPreviewImage(result);
                onImageChange(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleClick = () => {
        if (isEditing) {
            fileInputRef.current?.click();
        }
    };

    const handleRemoveImage = () => {
        setPreviewImage(null);
        onImageChange('');
    };

    const displayImage = previewImage || currentImage;

    return (
        <div className="relative group">
            <div
                className={`w-32 h-32 rounded-full border-4 border-primary/20 p-1 relative overflow-hidden mx-auto cursor-pointer transition-all ${
                    isEditing ? 'hover:border-primary/40' : ''
                } ${isDragging ? 'border-primary scale-105' : ''}`}
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="w-full h-full rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    {displayImage ? (
                        <img 
                            src={displayImage} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                            <Camera className="w-8 h-8 text-muted-foreground" />
                        </div>
                    )}
                </div>

                {/* Overlay */}
                <AnimatePresence>
                    {isEditing && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Upload className="w-6 h-6 text-white" />
                            <span className="text-xs font-bold uppercase text-white tracking-widest">
                                {displayImage ? 'Change' : 'Upload'}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Remove button */}
                {isEditing && displayImage && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage();
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
            />

            {/* Drag and drop hint */}
            {isEditing && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                    Click or drag & drop to upload
                </p>
            )}
        </div>
    );
};