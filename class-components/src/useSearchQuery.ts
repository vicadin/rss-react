import { useState, useEffect } from "react";

const useSearchQuery = (key: string) => {
  const [searchQuery, setSearchQuery] = useState(() => {
    return localStorage.getItem(key) || "";
  });

  useEffect(() => {
    return () => {
      localStorage.setItem(key, searchQuery);
    };
  }, [key, searchQuery]);

  return [searchQuery, setSearchQuery] as const;
};

export default useSearchQuery;
