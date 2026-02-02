import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import { Video, Play, Clock, CheckCircle } from "lucide-react";

function DashboardNav({ active }) {
  return (
    <nav className="bg-white dark:bg-[#262626] border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex space-x-8">
          <a
            href="/dashboard"
            className={`py-4 border-b-2 font-medium font-jetbrains-mono ${
              active === "videos"
                ? "border-orange-500 text-orange-600 dark:text-orange-400"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
          >
            Video Generator
          </a>
          <a
            href="/dashboard/crm"
            className={`py-4 border-b-2 font-medium font-jetbrains-mono ${
              active === "crm"
                ? "border-orange-500 text-orange-600 dark:text-orange-400"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
          >
            CRM
          </a>
        </div>
      </div>
    </nav>
  );
}

export default function DashboardPage() {
  const { data: user, loading: userLoading } = useUser();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    prompt: "",
    quality: "1080p",
  });

  // All hooks must be called before any conditional returns
  useEffect(() => {
    if (user) {
      fetchVideos();
    }
  }, [user]);

  useEffect(() => {
    if (!user && !userLoading && typeof window !== 'undefined') {
      window.location.href = "/account/signin?callbackUrl=/dashboard";
    }
  }, [user, userLoading]);

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/videos");
      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          throw new Error(data.error || "Failed to fetch videos");
        } else {
          const text = await response.text();
          console.error("Expected JSON but got:", text.substring(0, 200));
          throw new Error("Failed to fetch videos - server returned non-JSON response");
        }
      }
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          throw new Error(data.error || "Failed to create video");
        } else {
          const text = await response.text();
          console.error("Expected JSON but got:", text.substring(0, 200));
          throw new Error(`Failed to create video - server returned ${response.status} with non-JSON response`);
        }
      }

      const data = await response.json();
      setFormData({ title: "", description: "", prompt: "", quality: "1080p" });
      await fetchVideos();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Conditional returns come AFTER all hooks
  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1E1E1E] flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400 font-jetbrains-mono">
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1E1E1E]">
      <header className="bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
            VideoAI Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-400 font-jetbrains-mono">
              {user.email}
            </span>
            <a
              href="/account/logout"
              className="px-4 py-2 text-sm bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-jetbrains-mono"
            >
              Sign Out
            </a>
          </div>
        </div>
      </header>

      <DashboardNav active="videos" />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Video Generator Form */}
          <div className="bg-white dark:bg-[#262626] rounded-xl p-8 shadow-lg dark:ring-1 dark:ring-gray-700">
            <div className="flex items-center mb-6">
              <Video className="text-orange-500 mr-3" size={24} />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                Generate New Video
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-jetbrains-mono">
                  Video Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 font-jetbrains-mono"
                  placeholder="My awesome video"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-jetbrains-mono">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 font-jetbrains-mono"
                  placeholder="Brief description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-jetbrains-mono">
                  AI Prompt
                </label>
                <textarea
                  name="prompt"
                  required
                  rows="4"
                  value={formData.prompt}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 font-jetbrains-mono resize-none"
                  placeholder="Describe the video you want to create..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-jetbrains-mono">
                  Quality
                </label>
                <select
                  name="quality"
                  value={formData.quality}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 font-jetbrains-mono"
                >
                  <option value="1080p">1080p (Standard)</option>
                  <option value="4K">4K (Premium)</option>
                  <option value="8K">8K (Enterprise)</option>
                </select>
              </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg font-jetbrains-mono text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 font-jetbrains-mono"
              >
                {loading ? "Generating..." : "Generate Video"}
              </button>
            </form>
          </div>

          {/* Recent Videos */}
          <div className="bg-white dark:bg-[#262626] rounded-xl p-8 shadow-lg dark:ring-1 dark:ring-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-jetbrains-mono">
              Recent Videos
            </h2>

            <div className="space-y-4">
              {videos.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 text-center py-8 font-jetbrains-mono">
                  No videos yet. Create your first one!
                </p>
              ) : (
                videos.map((video) => (
                  <div
                    key={video.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-[#1E1E1E] transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 font-jetbrains-mono">
                          {video.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-jetbrains-mono">
                          {video.description || "No description"}
                        </p>
                        <div className="flex items-center space-x-2">
                          {video.status === "processing" && (
                            <>
                              <Clock className="text-orange-500" size={16} />
                              <span className="text-xs text-orange-600 dark:text-orange-400 font-jetbrains-mono">
                                Processing
                              </span>
                            </>
                          )}
                          {video.status === "completed" && (
                            <>
                              <CheckCircle
                                className="text-green-500"
                                size={16}
                              />
                              <span className="text-xs text-green-600 dark:text-green-400 font-jetbrains-mono">
                                Completed
                              </span>
                            </>
                          )}
                          {video.status === "pending" && (
                            <>
                              <Clock className="text-gray-500" size={16} />
                              <span className="text-xs text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                                Pending
                              </span>
                            </>
                          )}
                          <span className="text-xs text-gray-500 font-jetbrains-mono">
                            •
                          </span>
                          <span className="text-xs text-gray-500 font-jetbrains-mono">
                            {video.quality}
                          </span>
                        </div>
                      </div>
                      {video.video_url && (
                        <button className="ml-4 p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                          <Play size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
