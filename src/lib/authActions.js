"use client";

import { supabase } from "@/lib/supabaseClient";

export async function signInWithGitHub() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/dashboard`, // or any route after login
      },
    });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("GitHub Auth Error:", err.message);
    throw err;
  }
}

export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`, // or any route after login
      },
    });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Google Auth Error:", err.message);
    throw err;
  }
}
