import { useState, useEffect } from "react";

const useSearchQuery = () => {
  const [searchQuery, setSearchQuery] = useState<string>(() => {
    return localStorage.getItem("searchQuery") || "";
  });

  useEffect(() => {
    return () => {
      localStorage.setItem("searchQuery", searchQuery);
    };
  }, [searchQuery]);

  return [searchQuery, setSearchQuery] as const;
};

export default useSearchQuery;
