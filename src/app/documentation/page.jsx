// pages/documentation.jsx  (or app/documentation/page.jsx)
"use client";
import React from "react";

export default function DocumentationPage() {
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
          Documentation
        </h1>
        <p className="text-gray-300 mb-4">
          Your guide to using Tenshin’s Excalidraw + Markdown features
        </p>
      </header>

      <div className="max-w-3xl mx-auto space-y-20">
        {/* --- Getting Started --- */}
        <section id="getting-started">
          <h2 className="text-2xl font-semibold text-[#ff8383] mb-4">
            Getting Started
          </h2>
          <p>
            Tenshin lets you draw, plan, and take notes in Excalidraw style,
            with the magic of Markdown. Here’s how to start:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Open your Excalidraw board in Tenshin.</li>
            <li>
              Press <kbd>Ctrl + /</kbd> to open the command palette.
            </li>
            <li>Select "Add Markdown" and type your content.</li>
            <li>
              Hit enter — your markdown will appear directly on the board!
            </li>
          </ul>
        </section>

        {/* --- Markdown Syntax --- */}
        <section id="markdown-syntax">
          <h2 className="text-2xl font-semibold text-[#ff8383] mb-4">
            Markdown Commands
          </h2>
          <p>Here’s what you can add to your board:</p>

          <ul className="list-disc list-inside mt-2 space-y-2">
            <li>
              <strong># Heading</strong> – Adds a heading. Example:{" "}
              <code># My Title</code>
            </li>
            <li>
              <strong>&gt; Quote</strong> – Adds a blockquote. Example:{" "}
              <code>&gt; Inspiration!</code>
            </li>
            <li>
              <strong>Paragraph</strong> – Just type your text to add a
              paragraph.
            </li>
            <li>
              <strong>&gt;&gt; Mem</strong> – Special callout style for “mem”.
              Example: <code>&gt;&gt; Remember this</code>
            </li>
            <li>
              <strong>---</strong> – Divider line. Just type three dashes to
              separate sections.
            </li>
          </ul>
        </section>

        {/* --- Keyboard Shortcuts --- */}
        <section id="keyboard-shortcuts">
          <h2 className="text-2xl font-semibold text-[#ff8383] mb-4">
            Keyboard Shortcuts
          </h2>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>
              <kbd>Ctrl + /</kbd> – Open command palette to add markdown.
            </li>
            <li>
              <kbd>Esc</kbd> – Close command palette.
            </li>
          </ul>
        </section>

        {/* --- FAQ --- */}
        <section id="faq">
          <h2 className="text-2xl font-semibold text-[#ff8383] mb-4">FAQ</h2>

          <h3 className="text-xl font-semibold text-[#ff8383] mt-6 mb-2">
            Can I add images or drawings?
          </h3>
          <p>
            Yes! You can use Excalidraw tools alongside Markdown to add
            drawings, shapes, and sketches.
          </p>

          <h3 className="text-xl font-semibold text-[#ff8383] mt-6 mb-2">
            What happens if I type unsupported markdown?
          </h3>
          <p>
            Anything outside the supported syntax will appear as plain text on
            your board.
          </p>

          <h3 className="text-xl font-semibold text-[#ff8383] mt-6 mb-2">
            Can I edit my markdown later?
          </h3>
          <p>
            Yes! Just click on the markdown element on your board and edit it
            directly.
          </p>

          <h3 className="text-xl font-semibold text-[#ff8383] mt-6 mb-2">
            Do my notes get saved automatically?
          </h3>
          <p>
            If you’re using the Pro plan with cloud storage, everything is saved
            encrypted automatically. Free-tier notes stay local to your device.
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
