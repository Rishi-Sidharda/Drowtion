import React from "react";
import { Folder, Star, Ban, Brush, Ellipsis } from "lucide-react";

export default function SelectFolderViewSection({
  data,
  selectedFolderId,
  setSelectedFolderId,
  dropdownOpen,
  setDropdownOpen,
  ICONS,
  timeAgo,
  startEditingIcon,
  startRenaming,
  handleBoardMenuClick,
  openBoard,
}) {
  return (
    <section className="mt-10">
      <h3 className="text-lg mb-4">Browse by Folder</h3>

      {/* Dropdown */}
      <div className="relative inline-block w-56">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full bg-[#202020] hover:bg[#2a2a2a] text-white cursor-pointer py-2 px-3 rounded-md flex justify-between items-center"
        >
          <span className="truncate flex items-center gap-2">
            {selectedFolderId === "all" && (
              <>
                <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-600 rounded-sm">
                  <Folder className="w-3 h-3 text-white" />
                </span>
                All Boards
              </>
            )}

            {selectedFolderId === "favourites" && (
              <>
                <span className="inline-flex items-center justify-center w-5 h-5 bg-yellow-600 rounded-sm">
                  <Star className="w-3 h-3 text-white" />
                </span>
                Favourites
              </>
            )}

            {selectedFolderId === "none" && (
              <>
                <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-700 rounded-sm">
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
                      className="inline-flex items-center justify-center w-5 h-5 rounded-sm"
                      style={{ background: folder.color }}
                    >
                      <Icon className="w-3 h-3 text-white" />
                    </span>
                    {folder.name}
                  </>
                );
              })()}
          </span>
          <span>▾</span>
        </button>

        {dropdownOpen && (
          <div className="absolute z-50 mt-2 w-full bg-[#2a2a2a] rounded-md shadow-lg py-1">
            {/* All */}
            <div
              className="px-3 py-2 hover:bg-[#2a2a2a] cursor-pointer flex items-center gap-2"
              onClick={() => {
                setSelectedFolderId("all");
                setDropdownOpen(false);
              }}
            >
              <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-600 rounded-sm">
                <Folder className="w-3 h-3 text-white" />
              </span>
              All Boards
            </div>

            {/* None */}
            <div
              className="px-3 py-2 hover:bg-[#2a2a2a] cursor-pointer flex items-center gap-2"
              onClick={() => {
                setSelectedFolderId("none");
                setDropdownOpen(false);
              }}
            >
              <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-700 rounded-sm">
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
                  className="px-3 py-2 hover:bg-[#2a2a2a] cursor-pointer flex items-center gap-2"
                  onClick={() => {
                    setSelectedFolderId(folder.id);
                    setDropdownOpen(false);
                  }}
                >
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-sm"
                    style={{ background: folder.color }}
                  >
                    <Icon className="w-3 h-3 text-white" />
                  </span>
                  {folder.name}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Boards Grid */}
      <div className="flex flex-wrap gap-4 py-4 justify-start">
        {/* All */}
        {selectedFolderId === "all" &&
          Object.values(data.boards || {}).map((board) => {
            const Icon = ICONS[board.icon] || Brush;
            const folder = board.folderId ? data.folders[board.folderId] : null;

            return (
              <div
                key={board.id}
                className="board-card-container w-36 h-36 bg-[#202020] hover:bg-[#2a2a2a] rounded-md flex flex-col justify-between shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 hover:scale-105 cursor-pointer"
                onClick={() => openBoard(board.id)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleBoardMenuClick(e, board.id);
                }}
              >
                <div
                  className="h-3 w-full rounded-t-lg"
                  style={{ backgroundColor: folder?.color || "#6b7280" }}
                />

                <div className="p-3 flex flex-col gap-5 h-full">
                  <div className="flex items-center justify-between">
                    <div
                      className="p-1 rounded hover:bg-[#3a3a3a] transition hover:scale-110"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditingIcon(board.id);
                      }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <span
                      className="text-white p-1 rounded hover:bg-[#3a3a3a]"
                      onClick={(e) => handleBoardMenuClick(e, board.id)}
                    >
                      <Ellipsis />
                    </span>
                  </div>

                  <div>
                    <h3
                      className="text-white text-md truncate"
                      onDoubleClick={() => startRenaming(board.id, board.name)}
                    >
                      {board.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {timeAgo(board.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

        {/* None */}
        {selectedFolderId === "none" &&
          Object.values(data.boards || {})
            .filter((board) => !board.folderId)
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .map((board) => {
              const Icon = ICONS[board.icon] || Brush;

              return (
                <div
                  key={board.id}
                  className="board-card-container w-36 h-36 bg-[#202020] hover:bg-[#2a2a2a] rounded-md flex flex-col justify-between shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 hover:scale-105 cursor-pointer"
                  onClick={() => openBoard(board.id)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleBoardMenuClick(e, board.id);
                  }}
                >
                  <div
                    className="h-3 w-full rounded-t-lg"
                    style={{ backgroundColor: "#6b7280" }}
                  />

                  <div className="p-3 flex flex-col gap-5 h-full">
                    <div className="flex items-center justify-between">
                      <div
                        className="p-1 rounded hover:bg-[#3a3a3a] transition hover:scale-110"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditingIcon(board.id);
                        }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      <span
                        className="text-white p-1 rounded hover:bg-[#3a3a3a]"
                        onClick={(e) => handleBoardMenuClick(e, board.id)}
                      >
                        <Ellipsis />
                      </span>
                    </div>

                    <div>
                      <h3
                        className="text-white text-md truncate"
                        onDoubleClick={() =>
                          startRenaming(board.id, board.name)
                        }
                      >
                        {board.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {timeAgo(board.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

        {/* Specific */}
        {selectedFolderId !== "all" &&
          selectedFolderId !== "favourites" &&
          selectedFolderId !== "none" &&
          (data.folders[selectedFolderId]?.boards || [])
            .map((id) => data.boards[id])
            .filter(Boolean)
            .map((board) => {
              const Icon = ICONS[board.icon] || Brush;
              const folder = data.folders[selectedFolderId];

              return (
                <div
                  key={board.id}
                  className="board-card-container w-36 h-36 bg-[#202020] hover:bg-[#2a2a2a] rounded-md flex flex-col justify-between shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 hover:scale-105 cursor-pointer"
                  onClick={() => openBoard(board.id)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleBoardMenuClick(e, board.id);
                  }}
                >
                  <div
                    className="h-3 w-full rounded-t-lg"
                    style={{ backgroundColor: folder?.color || "#6b7280" }}
                  />

                  <div className="p-3 flex flex-col gap-5 h-full">
                    <div className="flex items-center justify-between">
                      <div
                        className="p-1 rounded hover:bg-[#3a3a3a] transition hover:scale-110"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditingIcon(board.id);
                        }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      <span
                        className="text-white p-1 rounded hover:bg-[#3a3a3a]"
                        onClick={(e) => handleBoardMenuClick(e, board.id)}
                      >
                        <Ellipsis />
                      </span>
                    </div>

                    <div>
                      <h3
                        className="text-white text-md truncate"
                        onDoubleClick={() =>
                          startRenaming(board.id, board.name)
                        }
                      >
                        {board.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {timeAgo(board.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </section>
  );
}
