import React, { useState, useRef } from 'react';
import { MediaItem } from '../src/types';
import { getAuth } from 'firebase/auth';
import { API_CONFIG, buildMediaUrl } from '../src/config/api';

interface MediaUploadProps {
  mediaFiles: MediaItem[];
  onMediaChange: (files: MediaItem[]) => void;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ mediaFiles, onMediaChange }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    console.log('Starting upload for', files.length, 'files');
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
        console.log('Adding file to upload:', file.name, file.size, 'bytes');
      });

      const uploadUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPLOAD_MULTIPLE}`;
      console.log('Upload URL:', uploadUrl);

      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          console.log('Upload progress:', progress + '%');
          setUploadProgress(progress);
        }
      });

      // Set timeout for faster error detection
      xhr.timeout = 10000; // 10 seconds

      return new Promise<void>((resolve, reject) => {
        xhr.onload = () => {
          console.log('XHR Status:', xhr.status);
          console.log('XHR Response:', xhr.responseText);
          
          setIsUploading(false);
          setUploadProgress(0);
          
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            const newMediaFiles: MediaItem[] = response.media.map((file: any) => ({
              id: file.id,
              type: file.type,
              url: file.url,
              name: file.fileName,
              size: file.size
            }));
            onMediaChange([...mediaFiles, ...newMediaFiles]);
            console.log('✅ Upload successful:', newMediaFiles);
            resolve();
          } else {
            const errorResponse = xhr.responseText ? JSON.parse(xhr.responseText) : {};
            console.error('❌ Upload failed:', errorResponse);
            reject(new Error(errorResponse.error || `Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          setIsUploading(false);
          setUploadProgress(0);
          console.error('❌ XHR Error:', xhr);
          console.error('❌ Network error - backend likely not running');
          reject(new Error('Backend server not accessible. Please ensure the backend is running on localhost:3001'));
        };

        xhr.ontimeout = () => {
          setIsUploading(false);
          setUploadProgress(0);
          console.error('❌ Upload timeout - backend not responding');
          reject(new Error('Upload timeout. Backend server may not be running or is too slow.'));
        };

        console.log('Sending request to:', uploadUrl);
        xhr.open('POST', uploadUrl);
        // xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
      });
    } catch (error) {
      console.error('❌ Upload error:', error);
      setIsUploading(false);
      setUploadProgress(0);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload files. Please try again.';
      alert(errorMessage);
    }
  };

  const removeMediaFile = (fileId: string) => {
    const updatedFiles = mediaFiles.filter(file => file.id !== fileId);
    onMediaChange(updatedFiles);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="media-upload">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      
      {/* Upload Progress */}
      {isUploading && (
        <div className="upload-progress p-3 bg-blue-50 rounded-lg mb-2 border border-blue-200">
          <div className="text-sm text-blue-600 mb-2 font-medium">
            {uploadProgress === 0 ? (
              <><i className="fa-solid fa-spinner fa-spin mr-2"></i>Connecting to server...</>
            ) : (
              <><i className="fa-solid fa-cloud-upload-alt mr-2"></i>Uploading... {uploadProgress}%</>
            )}
          </div>
          <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          {uploadProgress === 0 && (
            <div className="text-xs text-blue-500 mt-2">
              If this takes too long, the backend server may not be running.
            </div>
          )}
        </div>
      )}

      {/* Media Preview Grid */}
      {mediaFiles.length > 0 && (
        <div className="media-preview-grid mb-3">
          <div className="grid grid-cols-2 gap-2">
            {mediaFiles.map((file) => (
              <div key={file.id} className="relative group">
                {file.type === 'image' ? (
                  <img
                    src={buildMediaUrl(file.url)}
                    alt={file.fileName}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ) : (
                  <video
                    src={buildMediaUrl(file.url)}
                    className="w-full h-32 object-cover rounded-lg"
                    controls
                  />
                )}
                
                {/* Remove button */}
                <button
                  onClick={() => removeMediaFile(file.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <i className="fa-solid fa-times text-xs"></i>
                </button>
                
                {/* File type indicator */}
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {file.type === 'video' ? (
                    <i className="fa-solid fa-video mr-1"></i>
                  ) : (
                    <i className="fa-solid fa-image mr-1"></i>
                  )}
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleImageClick}
        disabled={isUploading || mediaFiles.length >= 10}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <i className="fa-solid fa-plus mr-2"></i>
        {mediaFiles.length >= 10 ? 'Maximum files reached' : 'Add Photos/Videos'}
      </button>
    </div>
  );
};

export default MediaUpload;
