/* eslint-disable @typescript-eslint/no-explicit-any */
// app/lib/services/billboard-service.ts
import { apiClient } from "@/app/lib/api/client";

export interface Billboard {
  _id: string;
  title: string;
  description?: string;
  location: string;
  state?: string;
  city?: string;
  landmark: string;
  serviceType: string;
  mediaType: string;
  rate: number;
  originalPrice?: number;
  dimensions: string;
  impressions: number;
  images: string[];
  targetAudience: string[];
  availability: boolean;
  availableIn?: number;
  rating: number;
  reviews: number;
  features: string[];
  createdAt?: string;
  updatedAt?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  trafficData?: {
    dailyTraffic: number;
    peakHours: string[];
    vehicleCount: number;
  };
  specifications?: {
    width: number;
    height: number;
    lighting: string;
    visibility: string;
  };
  [key: string]: any; // Allows any other fields from backend
}

export interface SearchParams {
  location?: string;
  state?: string;
  city?: string;
  serviceType?: string;
  mediaType?: string;
  landmark?: string;
  minRate?: number;
  maxRate?: number;
  printProductType?: string;
  targetAudience?: string;
  dimensions?: string;
  minImpressions?: number;
  maxImpressions?: number;
  limit?: number;
  page?: number;
  sortBy?: 'rate' | 'impressions' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  availableOnly?: boolean;
}

export interface SearchResponse {
  data?: Billboard[];
  foundItems?: Billboard[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  filters?: {
    availableLocations: string[];
    availableServiceTypes: string[];
    availableMediaTypes: string[];
    priceRange: {
      min: number;
      max: number;
    };
  };
  [key: string]: any;
}

export interface PopularBillboard {
  _id: string;
  title: string;
  location: string;
  impressions: number;
  image: string;
  rate: number;
}

export class BillboardService {
  private readonly baseUrl = '/billboards';

  // Get all billboards (no filters, just pagination)
  async getAllBillboards(page: number = 1, limit: number = 12): Promise<SearchResponse> {
    return this.searchBillboards({
      page,
      limit,
    });
  }

  // Search billboards with filters
  async searchBillboards(params: SearchParams = {}): Promise<SearchResponse> {
    const queryParams = new URLSearchParams();
    
    // Only add params if they have values
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
    
    // If no params, call without query string
    const queryString = queryParams.toString();
    const url = queryString 
      ? `${this.baseUrl}/search?${queryString}`
      : `${this.baseUrl}/search`;
    
    console.log("Calling API:", url); // Debug log
    
    const response = await apiClient.get<SearchResponse>(url);
    
    console.log("API response:", response); // Debug log
    
    // Transform response to ensure data consistency
    const billboards = (response.data || response.foundItems || []) as Billboard[];
    
    return {
      ...response,
      foundItems: billboards.map(billboard => ({
        ...billboard,
        rating: billboard.rating || 0,
        reviews: billboard.reviews || 0,
        impressions: billboard.impressions || 0,
        features: billboard.features || [],
        images: billboard.images && billboard.images.length > 0 
          ? billboard.images 
          : ['/billboard-placeholder.jpg'],
      })),
    };
  }

  async getBillboardById(id: string): Promise<Billboard> {
    const response = await apiClient.get<Billboard>(`${this.baseUrl}/${id}`);
    return {
      ...response,
      rating: response.rating || 0,
      reviews: response.reviews || 0,
      impressions: response.impressions || 0,
      features: response.features || [],
      images: response.images && response.images.length > 0 
        ? response.images 
        : ['/billboard-placeholder.jpg'],
    };
  }

  async getFeaturedBillboards(limit: number = 6): Promise<PopularBillboard[]> {
    const response = await apiClient.get<PopularBillboard[]>(`${this.baseUrl}/featured?limit=${limit}`);
    return response;
  }

  async getBillboardsByLocation(location: string, limit?: number): Promise<Billboard[]> {
    const params: SearchParams = { location, limit: limit || 10, page: 1 };
    const response = await this.searchBillboards(params);
    return response.foundItems || [];
  }

  async getBillboardsByServiceType(serviceType: string, limit?: number): Promise<Billboard[]> {
    const params: SearchParams = { serviceType, limit: limit || 10, page: 1 };
    const response = await this.searchBillboards(params);
    return response.foundItems || [];
  }

  async getFilterOptions(): Promise<{
    locations: string[];
    serviceTypes: string[];
    mediaTypes: string[];
    priceRange: { min: number; max: number };
  }> {
    try {
      const response = await apiClient.get<{
        locations: string[];
        serviceTypes: string[];
        mediaTypes: string[];
        priceRange: { min: number; max: number };
      }>(`${this.baseUrl}/filters`);
      return response;
    } catch (error) {
      const searchResponse = await this.searchBillboards({ limit: 1 });
      const sampleBillboard = (searchResponse.foundItems || [])[0];
      
      return {
        locations: ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano', 'Enugu'],
        serviceTypes: ['Outdoor Advertising', 'Indoor Advertising', 'Digital Signage'],
        mediaTypes: ['Led Billboard', 'Static Billboard', 'Digital Screen', 'Gantry', 'Wall Wrap'],
        priceRange: {
          min: sampleBillboard?.rate || 5000,
          max: 500000,
        },
      };
    }
  }

  async getNearbyBillboards(lat: number, lng: number, radius: number = 5): Promise<Billboard[]> {
    const response = await apiClient.get<Billboard[]>(`${this.baseUrl}/nearby`, {
      params: { lat, lng, radius }
    });
    return response;
  }

  async getSimilarBillboards(billboardId: string, limit: number = 4): Promise<Billboard[]> {
    const response = await apiClient.get<Billboard[]>(`${this.baseUrl}/${billboardId}/similar`, {
      params: { limit }
    });
    return response;
  }

   // Favorite/Unfavorite a billboard
  async toggleFavorite(billboardId: string): Promise<{ message: string; isFavorited: boolean }> {
    const response = await apiClient.post<{ message: string; isFavorited: boolean }>(
      `${this.baseUrl}/favorite`,
      { billboardId }
    );
    return response;
  }

  // Get user's favorite billboards
  async getFavorites(): Promise<Billboard[]> {
    const response = await apiClient.get<{ favorites: Billboard[] }>(`${this.baseUrl}/favorite`);
    return response.favorites || [];
  }

  // Check if a billboard is favorited
  async isFavorite(billboardId: string): Promise<boolean> {
    const favorites = await this.getFavorites();
    return favorites.some(fav => fav._id === billboardId);
  }

  
}


export const billboardService = new BillboardService();