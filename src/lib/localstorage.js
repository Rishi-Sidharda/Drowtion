const STORAGE_KEY = "tenshin";
const BOARD_DATA_KEY = "boardData";

export function loadFromStorage() {
  try {
    const tenshinRaw = localStorage.getItem(STORAGE_KEY);
    const boardsDataRaw = localStorage.getItem(BOARD_DATA_KEY);
    const boardsData = boardsDataRaw ? JSON.parse(boardsDataRaw) : {};

    if (tenshinRaw) {
      const parsed = JSON.parse(tenshinRaw);
      const folders = parsed.folders || {};
      const boards = parsed.boards || {};
      const ui = parsed.ui || { collapsedFolders: {} };

      // ensure folders have arrays + expanded default
      Object.keys(folders).forEach((fid) => {
        if (!Array.isArray(folders[fid].boards)) folders[fid].boards = [];
        if (folders[fid].expanded === undefined) folders[fid].expanded = true;
      });

      return { folders, boards, ui, boardsData };
    }

    // migrate from old "boards" key if present
    const oldRaw = localStorage.getItem("boards");
    if (oldRaw) {
      const oldParsed = JSON.parse(oldRaw);
      const boards = {};
      const newBoardsData = {};

      Object.keys(oldParsed).forEach((id) => {
        const board = oldParsed[id];
        boards[id] = {
          id,
          name: board.name || "Untitled Board",
          icon: board.icon || "Brush",
          folderId: board.folderId || null,
          isFavorite: board.isFavorite || false,
          updatedAt: board.updatedAt || new Date().toISOString(),
        };
        newBoardsData[id] = {
          elements: board.elements || [],
          appState: board.appState || {},
          files: board.files || {},
        };
      });

      const newTop = { folders: {}, boards, ui: { collapsedFolders: {} } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTop));
      localStorage.setItem(BOARD_DATA_KEY, JSON.stringify(newBoardsData));

      try {
        localStorage.removeItem("boards");
      } catch (e) {}

      return {
        folders: {},
        boards,
        ui: { collapsedFolders: {} },
        boardsData: newBoardsData,
      };
    }

    // nothing found
    return {
      folders: {},
      boards: {},
      ui: { collapsedFolders: {} },
      boardsData: {},
    };
  } catch (e) {
    console.error("loadFromStorage error", e);
    return {
      folders: {},
      boards: {},
      ui: { collapsedFolders: {} },
      boardsData: {},
    };
  }
}
