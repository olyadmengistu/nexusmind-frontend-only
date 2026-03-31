import React, { useState, useRef } from 'react';
import { API_CONFIG } from '../src/config/api';

interface VideoUploadProps {
  user: any;
  onClose: () => void;
  onUploadSuccess: (video: any) => void;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ user, onClose, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [problemDescription, setProblemDescription] = useState('');
  const [problemCategory, setProblemCategory] = useState('');
  const [problemUrgency, setProblemUrgency] = useState('medium');
  const [problemSeverity, setProblemSeverity] = useState('medium');
  const [problemTags, setProblemTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please select a video file.');
      return;
    }

    // Validate file size (100MB max)
    if (file.size > 100 * 1024 * 1024) {
      setError('File size must be less than 100MB.');
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Create preview
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadeddata = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setPreview(canvas.toDataURL('image/jpeg'));
      }
    };
    video.src = URL.createObjectURL(file);
  };

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('video', selectedFile);
      formData.append('caption', problemDescription);
      formData.append('problem_category', problemCategory);
      formData.append('problem_urgency', problemUrgency);
      formData.append('problem_severity', problemSeverity);
      formData.append('hashtags', problemTags);

      const token = localStorage.getItem('nexusmind_token');
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VIDEO_UPLOAD}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onUploadSuccess(data.video);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file) {
      const fakeEvent = {
        target: { files: [file] }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(fakeEvent);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Upload Video</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Upload Area */}
        <div className="p-4">
          {!selectedFile ? (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="mb-4">
                <i className="fas fa-video text-4xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-medium mb-2">Upload Video</h3>
              <p className="text-gray-600 mb-4">
                Share a video explaining your problem to get help from the NexusMind community
              </p>
              <p className="text-sm text-gray-500">
                MP4, WebM, or MOV (Max 100MB, 9:16 aspect ratio recommended)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Preview */}
              <div className="relative">
                {preview ? (
                  <img
                    src={preview}
                    alt="Video preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <i className="fas fa-video text-4xl text-gray-400"></i>
                  </div>
                )}
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview(null);
                  }}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>

              {/* Problem Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Problem Description *</label>
                <textarea
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder="Describe the problem you need help with..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                  maxLength={1000}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  {problemDescription.length}/1000 characters
                </p>
              </div>

              {/* Problem Category */}
              <div>
                <label className="block text-sm font-medium mb-2">Problem Category</label>
                <select
                  value={problemCategory}
                  onChange={(e) => setProblemCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  <option value="technical">Technical Issue</option>
                  <option value="educational">Educational Help</option>
                  <option value="business">Business Problem</option>
                  <option value="personal">Personal Challenge</option>
                  <option value="creative">Creative Solution</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Problem Severity and Urgency */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Severity</label>
                  <select
                    value={problemSeverity}
                    onChange={(e) => setProblemSeverity(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Urgency</label>
                  <select
                    value={problemUrgency}
                    onChange={(e) => setProblemUrgency(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              {/* Problem Tags */}
              <div>
                <label className="block text-sm font-medium mb-2">Problem Tags</label>
                <input
                  type="text"
                  value={problemTags}
                  onChange={(e) => setProblemTags(e.target.value)}
                  placeholder="#technical #help #urgent #solution-needed"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Add relevant tags to help others find your problem
                </p>
              </div>

              {/* File Info */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-sm text-gray-600">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading Problem...</span>
                </div>
              ) : (
                'Share Problem'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;
