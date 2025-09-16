"use client";

import { useState, useEffect, useCallback } from "react";
import { get } from "../lib/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import UnlockModal from "../components/UnlockModal";

interface Memory {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  isLocked: boolean;
  keyword?: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
}

interface User {
  name: string;
  email?: string;
}

export default function MemoryWall() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [unlockModal, setUnlockModal] = useState<{
    isOpen: boolean;
    memoryId: number;
    memoryTitle: string;
  }>({
    isOpen: false,
    memoryId: 0,
    memoryTitle: ""
  });
  const router = useRouter();

  const loadMemories = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Loading memories with token:", token ? "present" : "missing");
      
      const response = await get("/memories/unlocked", token || undefined);
      console.log("API Response:", response);
      
      if (response && Array.isArray(response)) {
        setMemories(response);
        console.log("Loaded memories from API:", response.length);
      } else if (response && response.error) {
        console.error("API Error:", response.error);
        loadMockData();
      } else {
        console.log("No data from API, loading mock data");
        loadMockData();
      }
    } catch (error) {
      console.error("Failed to load memories:", error);
      loadMockData();
    }
  }, []);

  const loadMockData = () => {
    // Fallback to mock data if API fails
    const mockMemories: Memory[] = [
      {
        id: 1,
        title: "Sunset Beach",
        description: "Warm breeze, pastel sky, first trip together.",
        imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
        isLocked: true,
        createdAt: "2024-01-15"
      },
      {
        id: 2,
        title: "Picnic in the Park",
        description: "Blue blanket, polaroids, too many cherries.",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        isLocked: true,
        createdAt: "2024-02-20"
      },
      {
        id: 3,
        title: "Grandma's Birthday",
        description: "Her laugh lit the whole room.",
        imageUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop",
        isLocked: false,
        keyword: "petals",
        createdAt: "2024-03-10"
      },
      {
        id: 4,
        title: "Rainy City Stroll",
        description: "Neon reflections and shared umbrella.",
        imageUrl: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=300&fit=crop",
        isLocked: true,
        createdAt: "2024-04-05"
      },
      {
        id: 5,
        title: "Slow Sunday",
        description: "Cinnamon coffee and soft jazz.",
        imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
        isLocked: false,
        keyword: "cinnamon",
        createdAt: "2024-05-12"
      }
    ];
    setMemories(mockMemories);
    console.log("Loaded mock data:", mockMemories.length, "memories");
  };

  const handleUnlockClick = (memoryId: number, memoryTitle: string) => {
    setUnlockModal({
      isOpen: true,
      memoryId,
      memoryTitle
    });
  };

  const handleUnlockSuccess = () => {
    loadMemories(); // Reload memories after unlock
  };

  const handleCloseModal = () => {
    setUnlockModal({
      isOpen: false,
      memoryId: 0,
      memoryTitle: ""
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Load user info from token or make API call
    const userData: User = { name: "Alex" }; // This would come from JWT decode or API
    setUser(userData);

    // Load memories
    loadMemories();
  }, [router, loadMemories]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const filteredMemories = memories.filter(memory =>
    memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    memory.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="KEEPR Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-xl font-semibold text-gray-900">KEEPR</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push("/add-memory")}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                </svg>
                Add Memory
              </button>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-sm font-medium">A</span>
                </div>
                <span className="text-gray-700">{user?.name}</span>
                <button 
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your KEEPR Collection</h2>
          <p className="text-gray-600">Unlocked memories appear here</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
            </svg>
            <input
              type="text"
              placeholder="Search memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy("recent")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === "recent" 
                  ? "bg-orange-100 text-orange-700" 
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Most Recent
            </button>
            <button
              onClick={() => setSortBy("liked")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === "liked" 
                  ? "bg-orange-100 text-orange-700" 
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Most Liked
            </button>
            <button
              onClick={() => setSortBy("date")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === "date" 
                  ? "bg-orange-100 text-orange-700" 
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              By Date
            </button>
          </div>
        </div>

        {/* Memory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMemories.map((memory) => (
            <div key={memory.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="relative">
                <Image
                  src={memory.imageUrl}
                  alt={memory.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                {memory.isLocked && (
                  <button
                    onClick={() => handleUnlockClick(memory.id, memory.title)}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 616 0z" clipRule="evenodd"/>
                    </svg>
                  </button>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{memory.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{memory.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`rounded-full px-3 py-1 flex items-center gap-1 ${
                      memory.isLocked ? 'bg-red-100' : 'bg-green-100'
                    }`}>
                      <svg className={`w-3 h-3 ${
                        memory.isLocked ? 'text-red-500' : 'text-green-500'
                      }`} fill="currentColor" viewBox="0 0 20 20">
                        {memory.isLocked ? (
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 616 0z" clipRule="evenodd"/>
                        ) : (
                          <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd"/>
                        )}
                      </svg>
                      <span className={`text-xs ${
                        memory.isLocked ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {memory.isLocked ? "Locked" : "Unlocked"}
                      </span>
                    </div>
                  </div>
                  
                  {!memory.isLocked && memory.keyword && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded-full">{memory.keyword}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredMemories.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No memories found</h3>
            <p className="text-gray-600 mb-6">Start creating memories to see them here</p>
            <button 
              onClick={() => router.push("/add-memory")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Add Your First Memory
            </button>
          </div>
        )}
      </main>

      {/* Unlock Modal */}
      <UnlockModal
        isOpen={unlockModal.isOpen}
        onClose={handleCloseModal}
        memoryId={unlockModal.memoryId}
        memoryTitle={unlockModal.memoryTitle}
        onUnlock={handleUnlockSuccess}
      />
    </div>
  );
}