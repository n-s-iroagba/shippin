"use client"

import { protectedApi, publicApi } from "@/utils/apiUtils"
import { useState, useEffect } from "react"

export function useGetList<T>(endpoint: string,isProtected?:boolean) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
   setLoading(true);
      setError(null); 
      try {
        const method = isProtected ? protectedApi.get : publicApi.get
        const response = await method<T[]>(endpoint)

        setData(response)
      } catch (err) {
        console.error(err)
        setError("Failed to fetch data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [endpoint, isProtected])

  return { data, loading, error }
}

export function useGetSingle<T>(endpoint: string,isProtected?:boolean) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {


    const fetchData = async () => {
        const method = isProtected ? protectedApi.get : publicApi.get
        
      setLoading(true);
      setError(null); // reset error state
      try {
      const response = await method<T>(endpoint);
        setData(response);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, isProtected]);

  return { data, loading, error };
}
