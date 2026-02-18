"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function BookmarkList({ userId }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!userId) return;

    // 1️⃣ Fetch existing bookmarks
    const fetchBookmarks = async () => {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error) {
        setBookmarks(data || []);
      }
    };

    fetchBookmarks();

    // 2️⃣ Realtime subscription
    const channel = supabase
      .channel(`bookmarks-${userId}`) // unique per user
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("Realtime event:", payload);

          if (payload.eventType === "INSERT") {
            setBookmarks((prev) => [payload.new, ...prev]);
          }

          if (payload.eventType === "DELETE") {
            setBookmarks((prev) =>
              prev.filter((b) => b.id !== payload.old.id)
            );
          }

          if (payload.eventType === "UPDATE") {
            setBookmarks((prev) =>
              prev.map((b) =>
                b.id === payload.new.id ? payload.new : b
              )
            );
          }
        }
      )
      .subscribe();

    // 3️⃣ Cleanup on unmount or user change
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const deleteBookmark = async (id) => {
    setDeletingId(id);

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete error:", error.message);
    }

    setDeletingId(null);
  };

  return (
    <div className="bg-black shadow-md rounded-xl p-6 border border-gray-700">
      <h2 className="text-lg font-semibold mb-4 text-white">
        Bookmark List
      </h2>

      {bookmarks.length === 0 ? (
        <p className="text-gray-400 text-center">
          No bookmarks added yet.
        </p>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="flex justify-between items-center border border-gray-700 rounded-lg p-4"
            >
              <div>
                <h3 className="font-semibold text-white">
                  {bookmark.title}
                </h3>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 text-sm hover:underline"
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
                {deletingId === bookmark.id
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
