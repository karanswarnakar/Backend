import { useEffect, useState } from "react";
import { useChat } from "../hooks/useChat";
import RecentChat from "../components/RecentChat.jsx"
import SidebarChat from "../components/SidebarChat.jsx"
import TableRow from "../components/TableRow.jsx"


import {
  Search,
  Plus,
  Mic,
  Paperclip,
  Send,
  Settings,
  Share2,
  Sparkles,
  ChevronDown,
  MoreHorizontal,
  Sun,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Volume2,
} from "lucide-react";

const Dashboard = () => {
  const chat = useChat();

  const [message, setMessage] = useState("");

  useEffect(() => {
    chat.initializeSocketConnection();
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    // Replace this with your actual useChat send function
    console.log("Sending:", message);

    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <main className="h-screen w-full overflow-hidden bg-[#0f0f0f] text-white">
      <div className="flex h-full">

        {/* ================= SIDEBAR ================= */}
        <aside className="hidden w-[290px] shrink-0 border-r border-white/10 bg-[#111111] md:flex md:flex-col">

          {/* Profile */}
          <div className="flex items-center justify-between px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-700">
                <Sparkles size={17} />
              </div>

              <span className="text-sm font-semibold">
                Orbit AI
              </span>
            </div>

            <Search
              size={19}
              className="cursor-pointer text-zinc-400 hover:text-white"
            />
          </div>
https://prod.liveshare.vsengsaas.visualstudio.com/join?6C4A94E2E1FD2C2C8C29EF2D4FF977AD3C4E
          {/* New Chat  */}
          <div className="px-4">
            <button
              onClick={() => setMessage("")}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-zinc-200"
            >
              <Plus size={17} />
              New Chat
              <Sparkles size={14} />
            </button>
          </div>

          {/* Saved */}
          <div className="mt-7 px-5">
            <div className="mb-3 flex items-center gap-2 text-xs text-zinc-500">
              <span>☆</span>
              <span>Saved</span>
            </div>

            <SidebarChat
              icon="C"
              title="ChatAI"
            />

            <SidebarChat
              icon="☀"
              title="Image of sun"
            />

            <SidebarChat
              icon="D"
              title="Data Analyst"
            />
          </div>

          <div className="mx-5 my-5 border-t border-white/10" />

          {/* Recent chats */}
          <div className="flex-1 overflow-y-auto px-5">

            <p className="mb-3 text-xs text-zinc-500">
              Today
            </p>

            <RecentChat title="How can I improve my time managemen..." />
            <RecentChat title="What's the best way to learn a new skill..." />
            <RecentChat title="How do I start investing in stocks as a be..." />

            <p className="mb-3 mt-7 text-xs text-zinc-500">
              Yesterday
            </p>

            <RecentChat title="What are the benefits of daily exercise fo..." />
            <RecentChat title="What's the difference between a UI desi..." />
          </div>

          {/* Bottom sidebar */}
          <div className="border-t border-white/10 p-4">

            <button className="mb-4 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white">
              <Sun size={18} />
              Appearance
            </button>

            <div className="flex items-center justify-between">

              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white text-black">
                <User size={17} />
              </div>

              <button className="rounded-full border border-white/10 px-5 py-2 text-xs text-zinc-300 hover:bg-white/5">
                Upgrade to Pro
              </button>

            </div>
          </div>
        </aside>

        {/* ================= MAIN CONTENT ================= */}
        <section className="relative flex min-w-0 flex-1 flex-col bg-[#151515]">

          {/* Header */}
          <header className="flex h-[70px] shrink-0 items-center justify-between border-b border-white/10 px-6">

            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold">
                Orbit AI
              </h1>

              <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-zinc-400">
                Plus
              </span>
            </div>

            <div className="flex items-center gap-2">

              <button className="hidden items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-zinc-300 hover:bg-white/5 sm:flex">
                Configuration
                <Settings size={14} />
              </button>

              <button className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-zinc-300 hover:bg-white/5">
                Share
                <Share2 size={14} />
              </button>

              <button className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-black hover:bg-zinc-200">
                New Chat
                <Sparkles size={13} />
              </button>

            </div>
          </header>

          {/* ================= CHAT AREA ================= */}
          <div className="flex-1 overflow-y-auto">

            <div className="mx-auto flex w-full max-w-[900px] flex-col px-5 py-8">

              {/* User message */}
              <div className="mb-8 flex justify-end">

                <div className="max-w-[600px] rounded-3xl bg-[#292929] px-5 py-3.5 text-sm leading-6 text-zinc-100">
                  What are the best open opportunities by company size?
                </div>

              </div>

              {/* AI response */}
              <div className="mb-6">

                <p className="mb-5 text-sm text-zinc-400">
                  Here's a detailed breakdown of the best opportunities by
                  company size:
                </p>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border border-white/10">

                  {/* Header */}
                  <div className="grid grid-cols-[1fr_1.3fr] border-b border-white/10 bg-white/[0.02] text-sm">

                    <div className="border-r border-white/10 p-4 font-medium">
                      Company Size
                    </div>

                    <div className="p-4 font-medium">
                      Best Opportunities
                    </div>

                  </div>

                  {/* Row */}
                  <TableRow
                    title="Startup (1-50 Employees)"
                    content={
                      <>
                        <p>
                          Flexible roles across various functions
                          (Marketing, Sales, Product).
                        </p>
                        <p>Equity or stock ownership</p>
                        <p>Rapid career growth opportunities</p>
                      </>
                    }
                  />

                  <TableRow
                    title="Small Business (51-200 Employees)"
                    content={
                      <>
                        <p>
                          Roles with greater responsibility compared to
                          larger companies
                        </p>
                        <p>Opportunity to shape business strategies</p>
                        <p>Faster career advancement potential</p>
                      </>
                    }
                  />

                  <TableRow
                    title="Mid-Sized Company (201-1000 Employees)"
                    content={
                      <>
                        <p>More stable structure with room for innovation</p>
                        <p>Access to better resources and mentorship</p>
                        <p>Higher job security compared to startups</p>
                      </>
                    }
                  />

                </div>

                {/* Description */}
                <p className="mt-5 text-sm leading-6 text-zinc-400">
                  Company size significantly impacts the types of opportunities
                  available. Startups are ideal for those seeking rapid growth
                  and willing to take risks, while larger corporations provide
                  stability and long-term benefits.
                </p>

                {/* Message actions */}
                <div className="mt-5 flex items-center gap-4 text-zinc-500">

                  <button className="hover:text-white">
                    <Volume2 size={15} />
                  </button>

                  <button className="hover:text-white">
                    <Copy size={15} />
                  </button>

                  <button className="hover:text-white">
                    <ThumbsUp size={15} />
                  </button>

                  <button className="hover:text-white">
                    <ThumbsDown size={15} />
                  </button>

                  <button className="hover:text-white">
                    <RefreshCw size={15} />
                  </button>

                </div>

              </div>

            </div>

          </div>

          {/* ================= INPUT AREA ================= */}
          <div className="w-full px-4 pb-4">

            <div className="mx-auto max-w-[900px]">

              <div className="rounded-3xl border border-white/10 bg-[#202020] p-3 shadow-2xl">

                {/* Textarea */}
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={2}
                  placeholder="Ask me anything..."
                  className="w-full resize-none bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500"
                />

                {/* Input controls */}
                <div className="flex items-center justify-between px-1 pt-2">

                  <div className="flex items-center gap-2">

                    {/* Source */}
                    <button className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-zinc-300 hover:bg-white/5">
                      Select Source
                      <ChevronDown size={14} />
                    </button>

                    <button className="rounded-full p-2 text-zinc-400 hover:bg-white/5 hover:text-white">
                      <Paperclip size={18} />
                    </button>

                  </div>

                  <div className="flex items-center gap-2">

                    <button className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-zinc-300 hover:bg-white/5">
                      <Mic size={15} />
                      <span className="hidden sm:block">Voice</span>
                    </button>

                    <button
                      onClick={sendMessage}
                      disabled={!message.trim()}
                      className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Send
                      <Send size={14} />
                    </button>

                  </div>

                </div>

              </div>

              <p className="mt-3 text-center text-[11px] text-zinc-600">
                AI can make mistakes. Please verify important information.
              </p>

            </div>

          </div>

        </section>
      </div>
    </main>
  );
};



export default Dashboard;