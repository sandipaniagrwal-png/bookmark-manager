"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function BookmarkList({ userId }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
  const handleNewBookmark = (event) => {
    setBookmarks((prev) => [event.detail, ...prev]);
  };

  window.addEventListener("bookmark-added", handleNewBookmark);

  return () => {
    window.removeEventListener("bookmark-added", handleNewBookmark);
  };
}, []);

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
  };

  const deleteBookmark = async (id) => {
  setDeletingId(id);

  // 1️⃣ Remove instantly from UI
  setBookmarks((prev) => prev.filter((b) => b.id !== id));

  // 2️⃣ Delete in background
  await supabase.from("bookmarks").delete().eq("id", id);

  setDeletingId(null);
};


  return (
    <div className="bg-black shadow-md rounded-xl p-6 border">
      {/* Heading */}
      <h2 className="text-lg font-semibold mb-4">Bookmark List</h2>

      {bookmarks.length === 0 ? (
        <p className="text-gray-500 text-center">
          No bookmarks added yet.
        </p>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="flex justify-between items-center border rounded-lg p-4"
            >
              <div>
                <h3 className="font-semibold">{bookmark.title}</h3>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm hover:underline"
                >
                  {bookmark.url}
                </a>
              </div>

              <button
                onClick={() => deleteBookmark(bookmark.id)}
                disabled={deletingId === bookmark.id}
                className={`px-4 py-2 rounded-lg text-white transition 
                  ${
                    deletingId === bookmark.id
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 cursor-pointer"
                  }`}
              >
                {deletingId === bookmark.id ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Deleting...
                  </span>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
