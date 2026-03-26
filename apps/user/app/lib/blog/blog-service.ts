/* eslint-disable @typescript-eslint/no-explicit-any */
// app/lib/blog/blog-service.ts
import { apiClient } from "@/app/lib/api/client";

export interface Blog {
  _id: string;
  headline: string;
  subHeadline: string;
  image: string;
  category: string;
  tags: string[];
  body: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  // For compatibility with existing components
  title?: string;
  excerpt?: string;
  content?: string;
  slug?: string;
  date?: string;
  readTime?: number;
}

export interface BlogAssets {
  tags: string[];
  categories: string[];
}

export interface BlogComment {
  _id: string;
  blogId: string;
  name: string;
  email: string;
  comment: string;
  createdAt: string;
}

export interface BlogSearchParams {
  keyword?: string;
  category?: string;
  tags?: string;
  page?: number;
  limit?: number;
}

export interface BlogResponse {
  data: Blog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class BlogService {
  private readonly baseUrl = '/blogs';

  async getAssets(): Promise<BlogAssets> {
    try {
      const response = await apiClient.get<BlogAssets>(`${this.baseUrl}/assets`);
      return response;
    } catch (error: any) {
      if (error?.status === 304) {
        console.log("Assets not modified, using cached data");
        return { tags: [], categories: [] };
      }
      throw error;
    }
  }

  async getBlogs(params: BlogSearchParams = {}): Promise<BlogResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.keyword) queryParams.append('keyword', params.keyword);
    if (params.category) queryParams.append('category', params.category);
    if (params.tags) queryParams.append('tags', params.tags);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    const url = `${this.baseUrl}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    try {
      const response = await apiClient.get<Blog[]>(url);
      
      // Response is directly an array of blogs
      const blogs = Array.isArray(response) ? response : [];
      
      return {
        data: blogs,
        total: blogs.length,
        page: params.page || 1,
        limit: params.limit || 9,
        totalPages: Math.ceil(blogs.length / (params.limit || 9)),
      };
    } catch (error: any) {
      if (error?.status === 304) {
        console.log("Blogs not modified, using cached data");
        return {
          data: [],
          total: 0,
          page: params.page || 1,
          limit: params.limit || 9,
          totalPages: 0,
        };
      }
      throw error;
    }
  }

  async getBlogById(id: string): Promise<Blog> {
    try {
      const response = await apiClient.get<Blog>(`${this.baseUrl}/${id}`);
      return response;
    } catch (error: any) {
      if (error?.status === 304) {
        console.log("Blog not modified, using cached data");
        throw new Error("Blog data not available");
      }
      throw error;
    }
  }

  async getBlogBySlug(slug: string): Promise<Blog> {
    try {
      // First try to get by ID (since the endpoint might not have slug support)
      // If slug is a valid ObjectId, try to get by ID
      if (slug.match(/^[0-9a-fA-F]{24}$/)) {
        try {
          return await this.getBlogById(slug);
        } catch {
          // If ID fetch fails, continue to try other methods
        }
      }
      
      // If not an ID or ID fetch failed, search blogs and find by slug
      const response = await this.getBlogs({ limit: 100 });
      const blog = response.data.find(b => {
        const blogSlug = b.headline?.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        return blogSlug === slug || b._id === slug;
      });
      
      if (!blog) {
        throw new Error("Blog not found");
      }
      
      return blog;
    } catch (error: any) {
      if (error?.status === 304) {
        console.log("Blog not modified, using cached data");
        throw new Error("Blog data not available");
      }
      throw error;
    }
  }

  async getComments(blogId: string): Promise<BlogComment[]> {
    try {
      const response = await apiClient.get<BlogComment[]>(`${this.baseUrl}/${blogId}/comments`);
      return response;
    } catch (error: any) {
      if (error?.status === 304) {
        console.log("Comments not modified, using cached data");
        return [];
      }
      throw error;
    }
  }

  async addComment(blogId: string, data: { name: string; email: string; comment: string }): Promise<BlogComment> {
    const response = await apiClient.post<BlogComment>(`${this.baseUrl}/comments`, { ...data, blogId });
    return response;
  }
}

export const blogService = new BlogService();