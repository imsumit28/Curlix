import { useState, useEffect } from 'react';

const STORAGE_KEY = 'curlix_links';

export function useLocalLinks() {
  const [links, setLinks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  }, [links]);

  function saveLink(linkData) {
    setLinks((prev) => [linkData, ...prev]);
  }

  function removeLink(shortCode) {
    setLinks((prev) => prev.filter((l) => l.short_code !== shortCode));
  }

  return { links, saveLink, removeLink };
}
