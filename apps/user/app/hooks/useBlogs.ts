/* eslint-disable @typescript-eslint/no-explicit-any */
// app/hooks/useBlogs.ts
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { blogService, Blog, BlogSearchParams } from "@/app/lib/blog/blog-service";

interface UseBlogsOptions extends BlogSearchParams {
  autoFetch?: boolean;
}

interface UseBlogsReturn {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
  total: number;
  refetch: () => Promise<void>;
}

export function useBlogs(options: UseBlogsOptions = {}): UseBlogsReturn {
  const { autoFetch = true, ...searchParams } = options;
  
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  
  const isMounted = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchBlogs = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);

    try {
      const response = await blogService.getBlogs({
        ...searchParams,
        page: 1,
        limit: 50,
      });

      if (!isMounted.current) return;

      setBlogs(response.data);
      setTotal(response.total);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.error("Failed to fetch blogs:", err);
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : "Failed to load blogs");
        setBlogs([]);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [searchParams.keyword, searchParams.category, searchParams.tags]);

  useEffect(() => {
    isMounted.current = true;
    
    if (autoFetch) {
      fetchBlogs();
    }
    
    return () => {
      isMounted.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchBlogs, autoFetch]);

  return {
    blogs,
    loading,
    error,
    total,
    refetch: fetchBlogs,
  };
}