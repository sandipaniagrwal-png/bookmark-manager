"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import BookmarkForm from "@/component/BookmarkForm";
import BookmarkList from "@/component/BookmarkList";

export default function Home() {
  const [session, setSession] = useState(null);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      if (!data.session) {
        router.push("/login");
      }
    };

    getSession();

    // Listen for auth changes (IMPORTANT)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          router.push("/login");
        } else {
          setSession(session);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    setLoadingLogout(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error.message);
      setLoadingLogout(false);
    }
    // No need to manually redirect
    // onAuthStateChange will handle it
  };

  if (!session) return null;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Bookmarks</h1>

        <button
          onClick={handleLogout}
          disabled={loadingLogout}
          className={`px-4 py-2 rounded-lg text-white transition
          ${
            loadingLogout
              ? "bg-red-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 cursor-pointer"
          }`}
        >
          {loadingLogout ? "Logging out..." : "Logout"}
        </button>
      </div>

      <BookmarkForm userId={session.user.id} />
      <BookmarkList userId={session.user.id} />
    </div>
  );
}
