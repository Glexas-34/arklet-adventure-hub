import { useState, useEffect, useCallback } from "react";
import { Rarity, InventoryItem, packs } from "@/data/gameData";

const STORAGE_KEY = "blookInv";
export const PRIVILEGED_USERS = ["Admin___Levi", "jamesishim", "Adam"];

type Inventory = Record<string, InventoryItem>;

function buildFullInventory(): Inventory {
  const inv: Inventory = {};
  Object.values(packs).forEach((packItems) => {
    packItems.forEach(([name, rarity]) => {
      inv[name] = { name, rarity: rarity as Rarity, count: 999 };
    });
  });
  return inv;
}

function isPrivilegedUser(): boolean {
  try {
    const nick = localStorage.getItem("playerNickname");
    return nick !== null && PRIVILEGED_USERS.includes(nick);
  } catch {
    return false;
  }
}

export function useInventory() {
  const [inventory, setInventory] = useState<Inventory>(() => {
    // If admin, always grant everything on load
    if (isPrivilegedUser()) {
      const fullInv = buildFullInventory();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fullInv));
      return fullInv;
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
  }, [inventory]);

  const addItem = useCallback((name: string, rarity: Rarity) => {
    setInventory((prev) => {
      const existing = prev[name];
      return {
        ...prev,
        [name]: {
          name,
          rarity,
          count: existing ? existing.count + 1 : 1,
        },
      };
    });
  }, []);

  const getTotalItems = useCallback(() => {
    return Object.values(inventory).reduce((sum, item) => sum + item.count, 0);
  }, [inventory]);

  const getUniqueCount = useCallback(() => {
    return Object.keys(inventory).length;
  }, [inventory]);

  const clearInventory = useCallback(() => {
    setInventory({});
  }, []);

   const updateItemCount = useCallback((name: string, delta: number) => {
     setInventory((prev) => {
       const existing = prev[name];
       if (!existing) return prev;

       const newCount = existing.count + delta;
       if (newCount <= 0) {
         const { [name]: _, ...rest } = prev;
         return rest;
       }

       return {
         ...prev,
         [name]: { ...existing, count: newCount },
       };
     });
   }, []);

  const grantAllBlooks = useCallback(() => {
    setInventory(buildFullInventory());
  }, []);

  return {
    inventory,
    addItem,
    getTotalItems,
    getUniqueCount,
    clearInventory,
    updateItemCount,
    grantAllBlooks,
  };
}
