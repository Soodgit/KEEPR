"use client";

import { useState } from "react";
import { post } from "../lib/api";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AddMemory() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    keyword: "",
    imageUrl: ""
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData(prev => ({
      ...prev,
      imageUrl: url
    }));
    
    // Only set preview if URL looks valid
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token") ?? undefined;
      
      // Validate form data
      if (!formData.title.trim()) {
        alert("Please enter a memory title");
        return;
      }
      
      if (!formData.description.trim()) {
        alert("Please enter a memory description");
        return;
      }
      
      if (!formData.keyword.trim()) {
        alert("Please enter a keyword to lock this memory");
        return;
      }

      console.log("Submitting memory:", formData);
      
      const response = await post("/memories", formData, token);
      
      if (response.error) {
        alert(`Error: ${response.error}`);
      } else {
        alert("Memory created successfully!");
        // Clear form
        setFormData({
          title: "",
          description: "",
          keyword: "",
          imageUrl: ""
        });
        setImagePreview(null);
        router.push("/wall");
      }
    } catch (error) {
      console.error("Error creating memory:", error);
      alert("Failed to create memory. Please check if the backend server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.back()}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Create New KEEPR Memory</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Image Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Memory Photo
              </label>
              <div className="space-y-4">
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleImageUrlChange}
                  placeholder="Enter image URL (e.g., from Unsplash)"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
                
                {imagePreview && (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={imagePreview}
                      alt="Memory preview"
                      fill
                      className="object-cover"
                      onError={() => {
                        console.log("Image failed to load:", imagePreview);
                        setImagePreview(null);
                      }}
                      onLoad={() => {
                        console.log("Image loaded successfully:", imagePreview);
                      }}
                    />
                  </div>
                )}
                
                {!imagePreview && (
                  <div className="w-full h-64 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                      </svg>
                      <p className="text-gray-500">Enter an image URL to preview</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Memory Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Give your memory a title..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Memory Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe this memory..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>

            {/* Secret Keyword */}
            <div>
              <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-2">
                Secret Keyword
                <span className="text-xs text-gray-500 ml-2">
                  (Required to unlock this memory later)
                </span>
              </label>
              <input
                type="text"
                id="keyword"
                name="keyword"
                value={formData.keyword}
                onChange={handleInputChange}
                placeholder="Enter a secret word to lock this memory..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                This keyword will be required to view this memory on the wall
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !formData.title || !formData.keyword}
                className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm2 5a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                    </svg>
                    Create Memory
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}