// pages/legal.jsx  (or app/legal/page.jsx)
"use client";
import React from "react";

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-[#121212] font-mono text-white px-6 py-16 leading-relaxed">
      {/* Header */}
      <header className="text-center mb-20">
        <div
          onClick={() => {
            window.location.href = "/";
          }}
          className="flex cursor-pointer justify-center items-center mb-6"
        >
          <img
            src="/logo_sm.svg"
            alt="Tenshin Logo"
            className="w-16 h-16 rounded-md shadow-lg"
          />
          <h1 className="text-6xl font-bold ml-4 tracking-tight text-[#ff8383]">
            Tenshin
          </h1>
        </div>

        <h1 className="text-4xl font-bold mb-2 text-[#ff8383]">
          Legal & Policies
        </h1>
        <p className="text-gray-300 mb-4">
          Built with ❤️ by Rishi Sidharda · India
        </p>

        {/* Social links */}
        <div className="flex justify-center space-x-6 mt-4">
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#ff8383] transition-colors"
          >
            Twitter
          </a>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#ff8383] transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#ff8383] transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </header>

      <div className="max-w-3xl mx-auto space-y-20">
        {/* --- Privacy Policy --- */}
        <section id="privacy-policy">
          <h2 className="text-2xl font-semibold text-[#ff8383] mb-4">
            Privacy Policy
          </h2>
          <p>
            Tenshin is a personal note-taking and second-brain app made for
            individuals who value simplicity and privacy. Your notes belong only
            to you — not to us, not to anyone else. We take privacy seriously,
            and this policy explains what we collect and how we handle it.
          </p>

          <h3 className="text-xl font-semibold text-[#ff8383] mt-6 mb-2">
            What We Collect
          </h3>
          <p>
            When you sign up for Tenshin, we collect only a few things we need
            to make the app work:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Your email address (for your account and login)</li>
            <li>Your subscription status (free or pro)</li>
            <li>
              Basic technical info (like device type and version) for app
              improvements
            </li>
          </ul>
          <p className="mt-4">
            We don’t collect or access the actual content of your notes — they
            are fully encrypted and only you can read them.
          </p>

          <h3 className="text-xl font-semibold text-[#ff8383] mt-6 mb-2">
            Free vs. Pro Data Storage
          </h3>
          <p>
            On the free tier, your notes stay entirely on your device. We never
            see them, and nothing is uploaded to our servers.
          </p>
          <p className="mt-3">
            On the pro tier, you can choose to store notes securely in the
            cloud. These files are encrypted before they leave your device and
            remain encrypted on our servers. We cannot decrypt or read them.
          </p>

          <h3 className="text-xl font-semibold text-[#ff8383] mt-6 mb-2">
            Analytics & Cookies
          </h3>
          <p>
            We use small cookies to keep you signed in and to understand general
            app usage through anonymous analytics. This helps us improve Tenshin
            over time — for example, by seeing which pages are most used. We
            don’t use tracking cookies for ads or sell any analytics data.
          </p>

          <h3 className="text-xl font-semibold text-[#ff8383] mt-6 mb-2">
            Data Sharing
          </h3>
          <p>
            We only share minimal data with trusted third-party services that
            help run Tenshin — like payment processors and cloud infrastructure
            providers. We never sell your personal information or share note
            data with anyone.
          </p>

          <h3 className="text-xl font-semibold text-[#ff8383] mt-6 mb-2">
            Your Control
          </h3>
          <p>
            You can delete your account at any time. When you do, all related
            cloud data will be permanently deleted. Locally stored notes remain
            on your device and are under your control.
          </p>
        </section>

        {/* --- Terms of Service --- */}
        <section id="terms-of-service">
          <h2 className="text-2xl font-semibold text-[#ff8383] mb-4">
            Terms of Service
          </h2>
          <p>
            By using Tenshin, you agree to these terms. We’ve kept them short
            and understandable because we believe you deserve clarity.
          </p>

          <h3 className="text-xl font-semibold text-[#ff8383] mt-6 mb-2">
            Personal Use
          </h3>
          <p>
            Tenshin is designed for individuals. You’re welcome to use it for
            personal and creative projects, but it’s not built for team or
            enterprise collaboration.
          </p>

          <h3 className="text-xl font-semibold text-[#ff8383] mt-6 mb-2">
            Plans and Limits
          </h3>
          <p>
            The free tier stores all your notes locally. The pro plan provides
            encrypted cloud storage with a total limit of 5 GB. If you reach
            that limit, syncing will pause until space is freed or your plan is
            upgraded (if higher limits become available in the future).
          </p>

          <h3 className="text-xl font-semibold text-[#ff8383] mt-6 mb-2">
            Canceling Your Subscription
          </h3>
          <p>
            You can cancel your pro subscription anytime. When you do, your
            cloud access will end immediately, and your encrypted files in the
            cloud will be deleted shortly after. Please make sure you’ve backed
            up anything important before canceling.
          </p>

          <h3 className="text-xl font-semibold text-[#ff8383] mt-6 mb-2">
            Reliability & Backups
          </h3>
          <p>
            We work hard to keep Tenshin running smoothly, but we can’t promise
            perfect uptime or guarantee against data loss. Always keep backups
            of your important notes — especially those stored locally.
          </p>

          <h3 className="text-xl font-semibold text-[#ff8383] mt-6 mb-2">
            Liability
          </h3>
          <p>
            Tenshin is provided “as is.” We aren’t responsible for any losses or
            damages caused by using (or not being able to use) the app. You use
            Tenshin at your own discretion.
          </p>
        </section>

        {/* --- Cookie Policy --- */}
        <section id="cookie-policy">
          <h2 className="text-2xl font-semibold text-[#ff8383] mb-4">
            Cookie Policy
          </h2>
          <p>
            Tenshin uses cookies to keep things running smoothly and help us
            understand how people use the app.
          </p>

          <h3 className="text-xl font-semibold text-[#ff8383] mt-6 mb-2">
            Essential Cookies
          </h3>
          <p>
            These cookies handle basic functions like logging in, maintaining
            your session, and syncing between devices. Without them, Tenshin
            wouldn’t work properly.
          </p>

          <h3 className="text-xl font-semibold text-[#ff8383] mt-6 mb-2">
            Analytics Cookies
          </h3>
          <p>
            We use simple analytics to see general usage trends — like how many
            people visit or which features are popular. This data is anonymous
            and helps improve the app. We do not use advertising or tracking
            cookies.
          </p>

          <h3 className="text-xl font-semibold text-[#ff8383] mt-6 mb-2">
            Managing Cookies
          </h3>
          <p>
            You can control or clear cookies anytime in your browser or device
            settings. If you disable essential cookies, certain parts of Tenshin
            (like staying signed in) may not work as expected.
          </p>
        </section>

        {/* --- Refund & Cancellation Policy --- */}
        <section id="refund-policy">
          <h2 className="text-2xl font-semibold text-[#ff8383] mb-4">
            Refund & Cancellation Policy
          </h2>
          <p>
            Tenshin Pro is a subscription-based service billed in advance. Once
            a payment is processed, it’s non-refundable. You can cancel your
            subscription anytime, and billing will stop at the end of your
            current period.
          </p>

          <p className="mt-4">
            When you cancel, cloud storage access ends immediately, and any
            encrypted notes stored there will be deleted shortly afterward. To
            avoid losing data, please export or back up your notes before
            canceling.
          </p>

          <p className="mt-4">
            If you believe there’s been an issue with billing or an accidental
            charge, you can contact us directly. We’ll review it case by case
            and do our best to help.
          </p>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-24 border-t border-[#ff8383]/30 pt-8 text-center text-sm text-gray-400">
        <p>
          © {new Date().getFullYear()} Tenshin by Rishi Sidharda. All rights
          reserved.
        </p>
      </footer>
    </main>
  );
}
