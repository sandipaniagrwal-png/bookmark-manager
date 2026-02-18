"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function BookmarkForm({ userId }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const addBookmark = async () => {
    if (!title.trim() || !url.trim()) return;

    setLoading(true);

    const formattedUrl = url.startsWith("http")
      ? url
      : `https://${url}`;

    try {
      const { error } = await supabase.from("bookmarks").insert([
        {
          title: title.trim(),
          url: formattedUrl,
          user_id: userId,
        },
      ]);

      if (error) {
        console.error("Insert error:", error.message);
        return;
      }

      // Clear inputs only if insert successful
      setTitle("");
      setUrl("");
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black shadow-md rounded-xl p-6 mb-6 border border-gray-700">
      <h2 className="text-lg font-semibold mb-4 text-white">
        Add New Bookmark
      </h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter bookmark title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-700 bg-gray-900 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Enter website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full border border-gray-700 bg-gray-900 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={addBookmark}
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white transition flex items-center justify-center gap-2
          ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:scale-95 cursor-pointer"
          }`}
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Adding...
            </>
          ) : (
            "Add Bookmark"
          )}
        </button>
      </div>
    </div>
  );
}
