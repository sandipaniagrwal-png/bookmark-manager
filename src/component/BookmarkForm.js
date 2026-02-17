"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function BookmarkForm({ userId }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const addBookmark = async () => {
  if (!title || !url) return;

  setLoading(true);

  const formattedUrl = url.startsWith("http")
    ? url
    : `https://${url}`;

  const tempBookmark = {
    id: Date.now(), // temporary id
    title,
    url: formattedUrl,
    user_id: userId,
    created_at: new Date().toISOString(),
  };

  // 1️⃣ Immediately update UI
  window.dispatchEvent(
    new CustomEvent("bookmark-added", { detail: tempBookmark })
  );

  setTitle("");
  setUrl("");

  // 2️⃣ Insert into DB (background)
  await supabase.from("bookmarks").insert([
    {
      title,
      url: formattedUrl,
      user_id: userId,
    },
  ]);

  setLoading(false);
};


  return (
    <div className="bg-black shadow-md rounded-xl p-6 mb-6 border">
      <h2 className="text-lg font-semibold mb-4">Add New Bookmark</h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter bookmark title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Enter website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={addBookmark}
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white transition 
          ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Adding...
            </span>
          ) : (
            "Add Bookmark"
          )}
        </button>
      </div>
    </div>
  );
}
