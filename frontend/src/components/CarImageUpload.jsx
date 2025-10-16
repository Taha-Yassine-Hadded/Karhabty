import React, { useState, useRef } from 'react';

const CarImageUpload = ({ onImageSelect, currentImage, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(currentImage || null);
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
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileSelect = (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Send file to parent
    onImageSelect(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="car-image-upload-wrapper">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />
      
      {preview ? (
        <div className="image-preview-container">
          <div className="image-preview">
            <img src={preview} alt="Car preview" />
            <div className="image-overlay">
              <button
                type="button"
                onClick={handleClick}
                className="btn-change"
              >
                <i className="fas fa-sync-alt"></i> Change
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="btn-remove"
              >
                <i className="fas fa-trash"></i> Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`dropzone ${isDragging ? 'dragging' : ''} ${error ? 'error' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="dropzone-content">
            <i className="fas fa-cloud-upload-alt"></i>
            <h4>Drag & drop your car image here</h4>
            <p>or click to browse</p>
            <span className="file-info">PNG, JPG, JPEG up to 5MB</span>
          </div>
        </div>
      )}
      
      {error && <div className="upload-error">{error}</div>}

      <style jsx>{`
        .car-image-upload-wrapper {
          width: 100%;
        }

        .dropzone {
          border: 2px dashed #dc3545;
          border-radius: 12px;
          padding: 40px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%);
        }

        .dropzone:hover {
          border-color: #c82333;
          background: linear-gradient(135deg, #ffebeb 0%, #ffd6d6 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.15);
        }

        .dropzone.dragging {
          border-color: #c82333;
          background: linear-gradient(135deg, #ffe0e0 0%, #ffc7c7 100%);
          border-width: 3px;
        }

        .dropzone.error {
          border-color: #dc3545;
          background: #fff0f0;
        }

        .dropzone-content i {
          font-size: 48px;
          color: #dc3545;
          margin-bottom: 15px;
          display: block;
        }

        .dropzone-content h4 {
          color: #333;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .dropzone-content p {
          color: #666;
          margin-bottom: 10px;
        }

        .file-info {
          font-size: 12px;
          color: #999;
        }

        .image-preview-container {
          width: 100%;
        }

        .image-preview {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .image-preview img {
          width: 100%;
          height: 250px;
          object-fit: cover;
          display: block;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .image-preview:hover .image-overlay {
          opacity: 1;
        }

        .btn-change,
        .btn-remove {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-change {
          background: #28a745;
          color: white;
        }

        .btn-change:hover {
          background: #218838;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
        }

        .btn-remove {
          background: #dc3545;
          color: white;
        }

        .btn-remove:hover {
          background: #c82333;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
        }

        .upload-error {
          color: #dc3545;
          font-size: 13px;
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .upload-error::before {
          content: '⚠';
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

export default CarImageUpload;
