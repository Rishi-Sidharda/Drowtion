import React, { useRef, useEffect } from "react";
import { Folder, Star, Ban, Brush, Ellipsis } from "lucide-react";

export default function SelectFolderViewSection({
  data,
  selectedFolderId,
  setSelectedFolderId,
  dropdownOpen,
  setDropdownOpen,
  ICONS,
  startEditingIcon,
  startRenaming,
  handleBoardMenuClick,
  openBoard,
  loadingUser,
}) {
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="mt-10 font-outfit">
      <h3 className="text-lg font-medium mb-4">Browse by Folder</h3>

      {/* Dropdown */}
      <div className="relative inline-block w-56" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full bg-[#202020] hover:bg-[#2a2a2a] text-white cursor-pointer py-1 px-2 rounded-md flex justify-between items-center">
          <span className="truncate flex items-center gap-2 min-w-0">
            {selectedFolderId === "all" && (
              <>
                <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-600 rounded-sm shrink-0">
                  <Folder className="w-3 h-3 text-white" />
                </span>
                All Boards
              </>
            )}

            {selectedFolderId === "favourites" && (
              <>
                <span className="inline-flex items-center justify-center w-5 h-5 bg-yellow-600 rounded-sm shrink-0">
                  <Star className="w-3 h-3 text-white" />
                </span>
                Favourites
              </>
            )}

            {selectedFolderId === "none" && (
              <>
                <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-700 rounded-sm shrink-0">
                  <Ban className="w-3 h-3 text-white" />
                </span>
                No Folder
              </>
            )}

            {data.folders[selectedFolderId] &&
              (() => {
                const folder = data.folders[selectedFolderId];
                const Icon = ICONS[folder.icon] || Folder;
                return (
                  <>
                    <span
                      className="inline-flex items-center justify-center w-5 h-5 rounded-sm shrink-0"
                      style={{ background: folder.color }}>
                      <Icon className="w-3 h-3 text-white" />
                    </span>
                    <p className="truncate min-w-0">{folder.name}</p>
                  </>
                );
              })()}
          </span>
        </button>

        {dropdownOpen && (
          <div className="absolute z-50 mt-2 w-full bg-[#202020] rounded-md shadow-lg py-1">
            {/* All */}
            <div
              className="px-2 py-1.5 hover:bg-[#2a2a2a] rounded-md cursor-pointer flex items-center gap-2"
              onClick={() => {
                setSelectedFolderId("all");
                setDropdownOpen(false);
              }}>
              <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-600 rounded-sm shrink-0">
                <Folder className="w-3 h-3 text-white" />
              </span>
              All Boards
            </div>

            {/* None */}
            <div
              className="px-2 py-1.5 hover:bg-[#2a2a2a] rounded-md cursor-pointer flex items-center gap-2"
              onClick={() => {
                setSelectedFolderId("none");
                setDropdownOpen(false);
              }}>
              <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-700 rounded-sm shrink-0">
                <Ban className="w-3 h-3 text-white" />
              </span>
              No Folder
            </div>

            {/* User folders */}
            {Object.values(data.folders || {}).map((folder) => {
              const Icon = ICONS[folder.icon] || Folder;
              return (
                <div
                  key={folder.id}
                  className="px-2 py-1.5 rounded-md hover:bg-[#2a2a2a] cursor-pointer flex items-center gap-2"
                  onClick={() => {
                    setSelectedFolderId(folder.id);
                    setDropdownOpen(false);
                  }}>
                  <span
                    className="inline-flex shrink-0 items-center justify-center w-5 h-5 rounded-sm"
                    style={{ background: folder.color }}>
                    <Icon className="w-3 h-3 text-white" />
                  </span>
                  <p className="truncate min-w-0">{folder.name}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Boards Grid */}
      <div className="flex w-full">
        {/* Left half: boards list */}
        <div className="w-1/2 pr-4 flex flex-col mt-4 gap-2 ">
          {/* --- NEW LOADING CONDITION --- */}
          {loadingUser ? (
            // Render 7 full-width, animated placeholder boards when loading
            Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                // Match the actual card appearance (w-full, bg-[#202020], rounded-md, flex items-center, shadow-sm, px-1 py-1)
                className="w-full bg-[#202020] rounded-md flex items-center justify-between shadow-sm px-1 py-1 h-10 animate-pulse">
                {/* Left colored bar placeholder */}
                <div className="h-6 w-2 ml-1 rounded-sm mr-2 bg-[#2a2a2a]"></div>

                {/* Icon placeholder */}
                <div className="p-1.5 rounded-lg bg-[#2a2a2a] w-7 h-7"></div>

                {/* Name placeholder (takes up remaining space) */}
                <div className="h-4 bg-[#2a2a2a] rounded ml-2 mr-2 flex-1"></div>

                {/* Menu button placeholder */}
                <div className="p-1.5 rounded-lg bg-[#2a2a2a] w-7 h-7"></div>
              </div>
            ))
          ) : (
            <>
              {/* --- Folder: "all" --- */}
              {selectedFolderId === "all" &&
                (() => {
                  const allBoards = Object.values(data.boards || {});

                  if (allBoards.length === 0) {
                    return (
                      <div className="flex flex-col items-center justify-center text-gray-500 h-36 rounded-md w-full bg-[#1a1a1a]">
                        <p className="text-sm font-light">
                          No boards yet. Create your first one!
                        </p>
                      </div>
                    );
                  }

                  return allBoards.map((board) => {
                    const Icon = ICONS[board.icon] || Brush;
                    const folder = board.folderId
                      ? data.folders[board.folderId]
                      : null;

                    return (
                      <div
                        key={board.id}
                        className="board-card-container w-full bg-[#202020] hover:bg-[#2a2a2a] rounded-md flex items-center justify-between shadow-sm hover:shadow-md transition cursor-pointer px-1 py-1"
                        onClick={() => openBoard(board.id)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          handleBoardMenuClick(e, board.id);
                        }}>
                        {/* Left colored bar */}
                        <div
                          className="h-6 w-2 ml-1 rounded-sm mr-2"
                          style={{
                            backgroundColor: folder?.color || "#6b7280",
                          }}
                        />

                        {/* Icon */}
                        <div
                          className="p-1.5 rounded-lg hover:bg-[#3a3a3a] transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditingIcon(board.id);
                          }}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>

                        {/* Name */}
                        <h3
                          className="text-white text-sm truncate ml-1 mr-2 flex-1"
                          onDoubleClick={() =>
                            startRenaming(board.id, board.name)
                          }>
                          {board.name}
                        </h3>

                        {/* Menu button */}
                        <span
                          className="text-white p-1.5 rounded-lg hover:bg-[#3a3a3a]"
                          onClick={(e) => handleBoardMenuClick(e, board.id)}>
                          <Ellipsis className="w-4 h-4" />
                        </span>
                      </div>
                    );
                  });
                })()}

              {/* --- Folder: "none" (Boards without folders) --- */}
              {selectedFolderId === "none" &&
                (() => {
                  const unassignedBoards = Object.values(data.boards || {})
                    .filter((board) => !board.folderId)
                    .sort(
                      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
                    );

                  if (unassignedBoards.length === 0) {
                    return (
                      <div className="flex flex-col items-center justify-center text-gray-500 h-36 rounded-md w-full bg-[#1a1a1a]">
                        <p className="text-sm font-light">
                          No unassigned boards here.
                        </p>
                      </div>
                    );
                  }

                  return unassignedBoards.map((board) => {
                    const Icon = ICONS[board.icon] || Brush;

                    return (
                      <div
                        key={board.id}
                        className="board-card-container w-full bg-[#202020] hover:bg-[#2a2a2a] rounded-md flex items-center justify-between shadow-sm hover:shadow-md transition cursor-pointer px-1 py-1"
                        onClick={() => openBoard(board.id)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          handleBoardMenuClick(e, board.id);
                        }}>
                        {/* Left colored bar */}
                        <div
                          className="h-6 w-2 ml-1 rounded-sm mr-2"
                          style={{ backgroundColor: "#6b7280" }}
                        />

                        {/* Icon */}
                        <div
                          className="p-1.5 rounded-lg hover:bg-[#3a3a3a] transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditingIcon(board.id);
                          }}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>

                        {/* Name */}
                        <h3
                          className="text-white text-sm truncate ml-1 mr-2 flex-1"
                          onDoubleClick={() =>
                            startRenaming(board.id, board.name)
                          }>
                          {board.name}
                        </h3>

                        {/* Menu button */}
                        <span
                          className="text-white p-1.5 rounded-lg hover:bg-[#3a3a3a]"
                          onClick={(e) => handleBoardMenuClick(e, board.id)}>
                          <Ellipsis className="w-4 h-4" />
                        </span>
                      </div>
                    );
                  });
                })()}

              {/* --- Folder: "Specific Folder ID" --- */}
              {selectedFolderId !== "all" &&
                selectedFolderId !== "favourites" &&
                selectedFolderId !== "none" &&
                (() => {
                  const folderBoards = (
                    data.folders[selectedFolderId]?.boards || []
                  )
                    .map((id) => data.boards[id])
                    .filter(Boolean);

                  if (folderBoards.length === 0) {
                    return (
                      <div className="flex flex-col items-center justify-center text-gray-500 h-36 rounded-md w-full bg-[#1a1a1a]">
                        <p className="text-sm font-light">
                          No boards found in this folder.
                        </p>
                      </div>
                    );
                  }

                  return folderBoards.map((board) => {
                    const Icon = ICONS[board.icon] || Brush;
                    const folder = data.folders[selectedFolderId];

                    return (
                      <div
                        key={board.id}
                        className="board-card-container w-full bg-[#202020] hover:bg-[#2a2a2a] rounded-md flex items-center justify-between shadow-sm hover:shadow-md transition cursor-pointer px-1 py-1"
                        onClick={() => openBoard(board.id)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          handleBoardMenuClick(e, board.id);
                        }}>
                        {/* Left colored bar */}
                        <div
                          className="h-6 w-2 ml-1 rounded-sm mr-2"
                          style={{
                            backgroundColor: folder?.color || "#6b7280",
                          }}
                        />

                        {/* Icon */}
                        <div
                          className="p-1.5 rounded-lg hover:bg-[#3a3a3a] transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditingIcon(board.id);
                          }}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>

                        {/* Name */}
                        <h3
                          className="text-white text-sm truncate ml-1 mr-2 flex-1"
                          onDoubleClick={() =>
                            startRenaming(board.id, board.name)
                          }>
                          {board.name}
                        </h3>

                        {/* Menu button */}
                        <span
                          className="text-white p-1.5 rounded-lg hover:bg-[#3a3a3a]"
                          onClick={(e) => handleBoardMenuClick(e, board.id)}>
                          <Ellipsis className="w-4 h-4" />
                        </span>
                      </div>
                    );
                  });
                })()}

              {/* NOTE: You should also add a check for selectedFolderId === "favourites" if that is a valid case */}
            </>
          )}
        </div>

        {/* Right half of the component (not shown in the original prompt, kept for structure) */}
        <div className="w-1/2">
          {/* ... other content for the right half ... */}
        </div>
      </div>
    </section>
  );
}
