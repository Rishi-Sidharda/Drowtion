"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Geist_Mono } from "next/font/google";
import { Mail, CheckCircle, ArrowLeft } from "lucide-react";
import Footer from "@/components/ui/footer";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function ResetPasswordRequestPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    // Get the email from the state
    const targetEmail = email;

    // Supabase method for requesting a password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(targetEmail, {
      // The user will be redirected to this URL after clicking the link in the email.
      // This MUST be the URL where your password update page is located.
      redirectTo: `https://tenshin.app/update-password`,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      // For security, don't reveal if the email doesn't exist.
      if (error.status === 404) {
        setSuccessMsg("If an account exists, a reset link has been sent.");
      } else {
        setErrorMsg(`Error: ${error.message}`);
      }
    } else {
      setSuccessMsg(
        "✅ Success! Check your inbox for the password reset link."
      );
      setEmail(""); // Clear the input field
    }
  };

  return (
    <main>
      <section>
        <div className="flex items-center bg-[#121212] justify-center min-h-screen">
          <div
            className={`flex flex-1 flex-col justify-center items-center px-4 py-10 lg:px-6 ${geistMono.variable} font-mono`}>
            <div className="w-full max-w-md bg-[#1a1a1a] rounded-2xl shadow-black shadow-2xl p-10">
              <button
                onClick={() => router.push("/signin")}
                className="flex items-center text-sm font-medium text-gray-400 hover:text-[#ff8383] mb-6 transition-colors">
                <ArrowLeft className="size-4 mr-2" />
                Back to Sign In
              </button>

              <div className="flex items-center space-x-1.5 mb-6">
                <Mail className="size-6 text-[#ff8383]" />
                <h3 className="text-xl font-semibold text-white">
                  Reset Password
                </h3>
              </div>

              <p className="mt-2 text-sm text-gray-400 mb-6">
                Enter your email address below. We'll send you a link to reset
                your password.
              </p>

              {/* Success Message Banner */}
              {successMsg && (
                <div className="mb-6 flex items-start space-x-3 rounded-md bg-[#22c55e]/10 p-4 border border-[#22c55e]">
                  <CheckCircle className="size-5 flex-shrink-0 text-[#22c55e] mt-0.5" />
                  <p className="text-sm font-medium text-white">{successMsg}</p>
                </div>
              )}

              <form onSubmit={handleRequestReset} className="space-y-6">
                <div>
                  <Label
                    htmlFor="email-reset"
                    className="text-sm text-white font-medium">
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    id="email-reset"
                    name="email-reset"
                    required
                    placeholder="ok@tenshin.app"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading || !!successMsg}
                    className="mt-2 text-white border-[#2a2a2a] border-2 rounded-md"
                  />
                </div>

                {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}

                <Button
                  type="submit"
                  className="w-full py-2 font-medium bg-[#ff8383] hover:bg-[#ff8383]/80 focus:bg-[#ff8383] cursor-pointer"
                  disabled={loading || !!successMsg}>
                  {loading ? "Sending Link..." : "Send Reset Link"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
