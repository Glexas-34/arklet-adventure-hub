import { useState, useEffect, useCallback } from "react";
import { Rarity, InventoryItem } from "@/data/gameData";

const STORAGE_KEY = "blookInv";

type Inventory = Record<string, InventoryItem>;

export function useInventory() {
  const [inventory, setInventory] = useState<Inventory>(() => {
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

  return {
    inventory,
    addItem,
    getTotalItems,
    getUniqueCount,
    clearInventory,
  };
}
