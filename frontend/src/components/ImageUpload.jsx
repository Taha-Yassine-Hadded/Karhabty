import React, { useState, useRef } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ImageUpload = ({ onImageUpload, currentImage, className = "" }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(currentImage || null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/api/admin/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageUrl = response.data.imageUrl;
      setPreviewImage(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${imageUrl}`);
      onImageUpload(imageUrl);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {previewImage ? (
        <div className="relative">
          <div className="w-full h-48 border-2 border-gray-300 rounded-lg overflow-hidden">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              type="button"
              onClick={handleClick}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
              title="Change image"
            >
              <i className="fas fa-edit text-sm"></i>
            </button>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
              title="Remove image"
            >
              <i className="fas fa-trash text-sm"></i>
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-sm">Uploading...</p>
              </>
            ) : (
              <>
                <i className="fas fa-cloud-upload-alt text-4xl mb-4 text-blue-600"></i>
                <p className="text-sm font-medium">
                  {isDragging ? 'Drop image here' : 'Drag & drop an image here'}
                </p>
                <p className="text-xs mt-1">or click to browse</p>
                <p className="text-xs text-gray-400 mt-2">PNG, JPG, JPEG up to 5MB</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;