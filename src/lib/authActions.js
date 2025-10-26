"use client";

import { supabase } from "@/lib/supabaseClient";

// ✅ Helper function to create a profile if missing
export async function ensureUserProfile(user) {
  if (!user) return;

  // Check if profile already exists
  const { data: existing, error: fetchError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    // PGRST116 = no rows found
    console.error("Error checking profile:", fetchError.message);
    return;
  }

  if (!existing) {
    // Create new profile
    const { error: insertError } = await supabase.from("profiles").insert([
      {
        id: user.id,
        email: user.email,
        plan: "free", // default plan
      },
    ]);

    if (insertError) {
      console.error("Error creating profile:", insertError.message);
    } else {
      console.log("✅ Profile created for:", user.email);
    }
  } else {
    console.log("Profile already exists for:", user.email);
  }
}

// ✅ GitHub Sign-In
export async function signInWithGitHub() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) throw error;

    return data;
  } catch (err) {
    console.error("GitHub Auth Error:", err.message);
    throw err;
  }
}

// ✅ Google Sign-In
export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) throw error;

    return data;
  } catch (err) {
    console.error("Google Auth Error:", err.message);
    throw err;
  }
}
