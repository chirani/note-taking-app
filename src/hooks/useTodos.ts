import { listTodos } from "@/db";
import { useDb } from "@/hooks/useDb";
import { useQuery } from "@tanstack/react-query";

/** All todos, ordered by due date. */
export function useTodos() {
  const db = useDb();

  return useQuery({
    queryKey: ["todos"],
    queryFn: () => listTodos(db),
    staleTime: 0,
  });
}
