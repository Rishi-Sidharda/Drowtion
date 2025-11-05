"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, LogOut, Edit, Trash2, ExternalLink } from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [boards, setBoards] = useState({});
  const [editingBoardId, setEditingBoardId] = useState(null);
  const [newBoardName, setNewBoardName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  // Fetch user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      const currentUser = data?.user || null;
      setUser(currentUser);
      if (!currentUser) window.location.href = "/signin";
    };
    getUser();
  }, []);

  // Load boards from localStorage
  useEffect(() => {
    const savedBoards = JSON.parse(localStorage.getItem("boards") || "{}");
    setBoards(savedBoards);
  }, []);

  const createNewBoard = () => {
    const id = `Untitled-${Date.now()}`;
    const savedBoards = JSON.parse(localStorage.getItem("boards") || "{}");
    savedBoards[id] = {
      name: id,
      elements: [],
      appState: {},
      files: {},
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem("boards", JSON.stringify(savedBoards));
    setBoards(savedBoards);
    router.push(`/board?id=${encodeURIComponent(id)}`);
  };

  const openBoard = (id) => router.push(`/board?id=${encodeURIComponent(id)}`);

  const deleteBoard = (id) => {
    const savedBoards = JSON.parse(localStorage.getItem("boards") || "{}");
    delete savedBoards[id];
    localStorage.setItem("boards", JSON.stringify(savedBoards));
    setBoards(savedBoards);
  };

  const startRenaming = (id, currentName) => {
    setEditingBoardId(id);
    setNewBoardName(currentName);
    setErrorMessage("");
  };

  const saveBoardName = (oldId) => {
    const trimmed = newBoardName.trim();
    if (!trimmed) return setErrorMessage("Board name cannot be empty.");

    const savedBoards = JSON.parse(localStorage.getItem("boards") || "{}");
    if (savedBoards[trimmed] && trimmed !== oldId) {
      setErrorMessage("A board with that name already exists.");
      return;
    }

    const boardData = savedBoards[oldId];
    delete savedBoards[oldId];
    savedBoards[trimmed] = { ...boardData, name: trimmed };
    localStorage.setItem("boards", JSON.stringify(savedBoards));
    setBoards(savedBoards);
    setEditingBoardId(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/signin";
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-100 flex flex-col">
      {/* Top Navbar */}
      <header className="flex items-center justify-between p-5 border-b border-gray-800 bg-[#141414]/90 backdrop-blur-md">
        <h1 className="text-xl font-semibold tracking-tight">
          🎨 <span className="text-white">Board Dashboard</span>
        </h1>
        <div className="flex items-center gap-3">
          {user && (
            <span className="text-sm text-gray-400 hidden sm:block">
              {user.email}
            </span>
          )}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-[#1e1e1e] border-gray-700 hover:bg-gray-800"
          >
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Button>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-semibold">Your Boards</h2>
          <Button
            onClick={createNewBoard}
            className="bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4 mr-2" /> New Board
          </Button>
        </div>

        {/* Boards Grid */}
        {Object.keys(boards).length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-400 h-[60vh] border border-dashed border-gray-700 rounded-xl">
            <p className="text-sm">No boards yet. Create your first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Object.keys(boards).map((id) => {
              const board = boards[id];
              const isEditing = editingBoardId === id;
              return (
                <div
                  key={id}
                  className="relative group bg-[#1b1b1b] hover:bg-[#222] border border-gray-800 rounded-xl p-5 transition-all shadow-lg"
                >
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Input
                        value={newBoardName}
                        onChange={(e) => setNewBoardName(e.target.value)}
                        className="bg-[#111] border-gray-700 text-gray-100"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={() => saveBoardName(id)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-md font-medium truncate mb-2 text-white">
                        {board.name}
                      </h3>
                      <p className="text-xs text-gray-500 mb-4">
                        Updated {new Date(board.updatedAt).toLocaleString()}
                      </p>

                      <div className="flex justify-between">
                        <Button
                          size="sm"
                          onClick={() => openBoard(id)}
                          className="bg-gray-800 hover:bg-gray-700"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" /> Open
                        </Button>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => startRenaming(id, board.name)}
                            className="bg-gray-700 hover:bg-gray-600 text-white"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteBoard(id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {errorMessage && (
          <p className="text-red-500 text-sm mt-4">{errorMessage}</p>
        )}
      </main>
    </div>
  );
}
