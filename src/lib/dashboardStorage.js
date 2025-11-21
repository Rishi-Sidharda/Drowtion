// lib/dashboardStorage.js (New File)

import { openDB } from "idb";

// --- INDEXEDDB SETUP (Copied from lib/storage.js to ensure consistency) ---

const DB_NAME = "BoardStorage";
const DB_VERSION = 2;

async function getDb() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("boardDataStore")) {
        db.createObjectStore("boardDataStore", { keyPath: "key" });
      }
      if (!db.objectStoreNames.contains("tenshinStore")) {
        db.createObjectStore("tenshinStore", { keyPath: "key" });
      }
    },
  });
}

// --- EXPORTED DASHBOARD FUNCTIONS ---

/**
 * Loads all dashboard metadata and board data containers from IndexedDB.
 * Handles migration from old localStorage data if necessary.
 * @param {string} STORAGE_KEY - The user-specific key for metadata.
 * @param {string} BOARD_DATA_KEY - The user-specific key for board content container.
 * @param {object | null} user - The current Supabase user object.
 * @returns {Promise<object>} The dashboard state object.
 */
export async function loadDashboardData({ STORAGE_KEY, BOARD_DATA_KEY, user }) {
  if (!STORAGE_KEY || !BOARD_DATA_KEY) {
    // Return default data if keys are not ready (same as original guard)
    return {
      folders: {},
      boards: {},
      ui: { collapsedFolders: {} },
      boardsData: {},
      userId: user ? user.id : null,
    };
  }

  try {
    const db = await getDb();

    // 1. ASYNC LOAD TENSIN (METADATA)
    const tenshin = await db.get("tenshinStore", STORAGE_KEY);

    // 2. ASYNC LOAD BOARDS DATA CONTAINER
    const boardsData = (await db.get("boardDataStore", BOARD_DATA_KEY)) || {};

    if (tenshin) {
      const folders = tenshin.folders || {};
      const boards = tenshin.boards || {};
      const ui = tenshin.ui || { collapsedFolders: {} };

      // Ensure folders have arrays + expanded default (as in original logic)
      Object.keys(folders).forEach((fid) => {
        if (!Array.isArray(folders[fid].boards)) folders[fid].boards = [];
        if (folders[fid].expanded === undefined) folders[fid].expanded = true;
      });

      return { folders, boards, ui, boardsData, userId: tenshin.userId };
    }

    // --- MIGRATION LOGIC (FROM OLD LOCALSTORAGE) ---

    // The oldRaw check is kept synchronous as we are migrating from old localStorage
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

      const currentUserId = user ? user.id : "unknown-migrated";
      const newTopWithId = {
        key: STORAGE_KEY, // Key for IndexedDB storage
        folders: {},
        boards,
        ui: { collapsedFolders: {} },
        userId: currentUserId,
      };

      const newBoardsDataWithKey = {
        key: BOARD_DATA_KEY, // Key for IndexedDB storage
        ...newBoardsData,
      };

      // ASYNC WRITE MIGRATED DATA TO INDEXEDDB
      await db.put("tenshinStore", newTopWithId);
      await db.put("boardDataStore", newBoardsDataWithKey);

      // Remove old localStorage item AFTER successful migration
      try {
        localStorage.removeItem("boards");
      } catch (e) {}

      return {
        folders: newTopWithId.folders,
        boards: newTopWithId.boards,
        ui: newTopWithId.ui,
        boardsData: newBoardsData,
        userId: currentUserId,
      };
    }

    // nothing found
    return {
      folders: {},
      boards: {},
      ui: { collapsedFolders: {} },
      boardsData: {},
      userId: user ? user.id : null,
    };
  } catch (e) {
    console.error("loadDashboardData error", e);
    return {
      folders: {},
      boards: {},
      ui: { collapsedFolders: {} },
      boardsData: {},
      userId: user ? user.id : null,
    };
  }
}

/**
 * Saves dashboard metadata (folders, boards, ui) to IndexedDB (tenshinStore).
 * @param {object} metadata - The new metadata object (folders, boards, ui).
 * @param {string} STORAGE_KEY - The user-specific key for metadata.
 * @param {object | null} user - The current Supabase user object.
 * @returns {Promise<void>}
 */
export async function saveDashboardMetadata({ metadata, STORAGE_KEY, user }) {
  if (!STORAGE_KEY) return;

  try {
    const db = await getDb();

    // Load existing tenshin data to merge and preserve userId
    const existing = (await db.get("tenshinStore", STORAGE_KEY)) || {
      key: STORAGE_KEY,
      boards: {},
      folders: {},
      ui: { collapsedFolders: {} },
      userId: user ? user.id : null,
    };

    const merged = {
      key: STORAGE_KEY, // Required for db.put
      userId: existing.userId || (user ? user.id : null),
      folders: metadata.folders ?? existing.folders,
      boards: metadata.boards ?? existing.boards,
      ui: metadata.ui ?? existing.ui,
    };

    // Write the merged tenshin metadata
    await db.put("tenshinStore", merged);
  } catch (e) {
    console.error("saveDashboardMetadata error", e);
  }
}

/**
 * Deletes a board from both the metadata (tenshinStore) and the content (boardDataStore).
 * @param {string} boardId - The ID of the board to delete.
 * @param {object} data - The current dashboard state object containing folders and boards.
 * @param {string} STORAGE_KEY - The user-specific key for metadata.
 * @param {string} BOARD_DATA_KEY - The user-specific key for board content container.
 * @returns {Promise<object>} The updated metadata object (folders, boards, ui) to set in state.
 */
export async function deleteBoardFromDashboard({
  boardId,
  data,
  STORAGE_KEY,
  BOARD_DATA_KEY,
}) {
  if (!STORAGE_KEY || !BOARD_DATA_KEY) {
    throw new Error("Storage keys are not defined for deletion.");
  }

  const db = await getDb();

  // --- 1. PREPARE UPDATED METADATA ---
  const newData = {
    folders: { ...(data.folders || {}) },
    boards: { ...(data.boards || {}) },
    ui: { ...(data.ui || { collapsedFolders: {} }) },
  };
  const board = newData.boards[boardId];
  if (!board) return newData; // Board already gone

  // Remove board ID from any folder list
  Object.keys(newData.folders).forEach((fid) => {
    const f = { ...newData.folders[fid] };
    if (Array.isArray(f.boards) && f.boards.includes(boardId)) {
      f.boards = f.boards.filter((b) => b !== boardId);
      newData.folders[fid] = f;
    }
  });

  // Delete board from the list
  delete newData.boards[boardId];

  // --- 2. ASYNC WRITE NEW METADATA (tenshinStore) ---
  const tenshin = (await db.get("tenshinStore", STORAGE_KEY)) || {};
  const updatedTenshin = {
    ...tenshin,
    key: STORAGE_KEY,
    ...newData, // Overwrite boards, folders, ui
  };
  await db.put("tenshinStore", updatedTenshin);

  // --- 3. ASYNC DELETE BOARD CONTENT (boardDataStore) ---
  try {
    const boardsData = (await db.get("boardDataStore", BOARD_DATA_KEY)) || {};
    delete boardsData[boardId];

    // Write the modified boardsData container back
    await db.put("boardDataStore", { key: BOARD_DATA_KEY, ...boardsData });
  } catch (e) {
    console.error("Failed to delete board data from storage", e);
  }

  // Return the updated metadata structure to update the React state
  return newData;
}
