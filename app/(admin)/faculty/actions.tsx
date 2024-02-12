"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/actions";

interface FetchFacultiesResult {
  data: any[] | null;
  error: Error | null;
}

export const fetchFaculties = async (): Promise<FetchFacultiesResult> => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const { data, error } = await supabase.from("faculty").select("*");
    if (error) throw error;
    return { data, error: null }; // Return data and null error if successful
  } catch (error: any) {
    return { data: null, error }; // Return null data and error if there's an error
  }
};

export const fetchDepartment = async (): Promise<FetchFacultiesResult> => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const { data, error } = await supabase.from("department").select("*");
    if (error) throw error;
    return { data, error: null }; // Return data and null error if successful
  } catch (error: any) {
    return { data: null, error }; // Return null data and error if there's an error
  }
};
