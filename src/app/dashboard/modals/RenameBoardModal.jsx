import { useEffect } from "react";
import { Button } from "@/components/ui/button"; // adjust import path
import { Input } from "@/components/ui/input"; // adjust import path

export default function RenameBoardModal({
  newBoardName,
  setNewBoardName,
  saveBoardName,
  setEditingBoardId,
  editingBoardId,
  errorMessage,
  setErrorMessage,
}) {
  // Close modal on Esc key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setEditingBoardId(null);
        setErrorMessage("");
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [setEditingBoardId, setErrorMessage]);

  // Close modal on click outside
  const handleClickOutside = (e) => {
    if (e.target.id === "modal-overlay") {
      setEditingBoardId(null);
      setErrorMessage("");
    }
  };

  return (
    <div
      id="modal-overlay"
      className="fixed font-outfit inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleClickOutside}
    >
      <div className="bg-[#1a1a1a] p-6 rounded-md w-80 shadow-xl">
        <h2 className="text-lg text-white mb-4">Rename Board</h2>
        <Input
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          placeholder="Enter new board name"
          className="flex-1 mb-4 bg-[#2a2a2a] text-gray-200 placeholder-gray-400 rounded-md border-0 border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 px-2 text-sm"
          autoFocus
        />
        {errorMessage && (
          <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
        )}
        <div className="flex justify-end gap-2">
          <Button
            className="cursor-pointer hover:bg-[#3a3a3a] bg-[#2a2a2a]"
            onClick={() => {
              setEditingBoardId(null);
              setErrorMessage("");
            }}
          >
            Cancel
          </Button>
          <Button
            className="cursor-pointer hover:bg-[#3a3a3a] bg-[#2a2a2a]"
            onClick={() => saveBoardName(editingBoardId)}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
