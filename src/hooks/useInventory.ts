
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export function useInventory() {
  const queryClient = useQueryClient();

  // Fetch all items for current user
  const { data, isLoading, error } = useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_items")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Tables<"inventory_items">[];
    },
  });

  // Add item
  const addItem = useMutation({
    mutationFn: async (item: Omit<TablesInsert<"inventory_items">, "user_id" | "id" | "created_at" | "last_updated">) => {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Failed to get current user. Please login again.");
      const { data, error } = await supabase
        .from("inventory_items")
        .insert([
          {
            ...item,
            user_id: user.id,
            last_updated: new Date().toISOString().slice(0, 10),
          },
        ]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });

  // Update item
  const updateItem = useMutation({
    mutationFn: async ({ id, ...values }: TablesUpdate<"inventory_items"> & { id: string }) => {
      const { data, error } = await supabase
        .from("inventory_items")
        .update({ ...values, last_updated: new Date().toISOString().slice(0,10) })
        .eq("id", id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });

  // Delete item
  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("inventory_items")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });

  return {
    data,
    isLoading,
    error,
    addItem,
    updateItem,
    deleteItem,
  };
}
