import { listDrafts } from "@/db";
import { useDb } from "@/hooks/useDb";
import { useQuery } from "@tanstack/react-query";

/** All unfinished drafts, most recently edited first. */
export function useDrafts() {
  const db = useDb();

  return useQuery({
    queryKey: ["drafts"],
    queryFn: () => listDrafts(db),
    staleTime: 0,
  });
}
