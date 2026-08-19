/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/app/lib/api/client";

export interface Billboard {
  _id: string;
  partnerId?: string;
  availableDate?: string;
  printProductType?: string;
  mediaType?: string;
  dimension?: string;
  orientation?: string;
  visibility?: string;
  illumination?: string;
  format?: string;
  description?: string;
  locationAddress?: string;
  state?: string;
  city?: string;
  landmark?: string;
  approvalStatus?: string;
  height?: number;
  width?: number;
  size?: string;
  price?: number;
  photos?: string[];
  hotDeal?: boolean;
  rating?: number;
  favorite?: boolean;
  features?: string[];
  createdAt?: string;
  updatedAt?: string;

  // Normalized / legacy fields used by UI
  title?: string;
  location?: string;
  rate?: number;
  originalPrice?: number;
  dimensions?: string;
  impressions?: number;
  images?: string[];
  targetAudience?: string[];
  availability?: boolean;
  availableIn?: number;
  reviews?: number;
  serviceType?: string;
  units?: string;
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
  [key: string]: any;
}

export interface ExploreResult {
  count: number;
  limit: number;
  totalPages: number;
  nextPage: number | null;
  currentPage: number;
  foundItems: Billboard[];
}

export interface ExploreResponse {
  result: ExploreResult;
}

export interface LandingPageResponse {
  landingPageBillboards: Record<string, Billboard[]>;
}

export interface ExploreParams {
  page?: number;
  limit?: number;
  location?: string;
  state?: string;
  city?: string;
  mediaType?: string;
  printProductType?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: string | number | undefined;
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
  sortBy?: "rate" | "impressions" | "rating" | "createdAt" | "price";
  sortOrder?: "asc" | "desc";
  availableOnly?: boolean;
  [key: string]: string | number | boolean | undefined;
}

export interface SearchResponse {
  data?: Billboard[];
  foundItems?: Billboard[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  count?: number;
  currentPage?: number;
  nextPage?: number | null;
  landingPageBillboards?: Record<string, Billboard[]>;
  result?: ExploreResult;
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
  private readonly baseUrl = "/billboards";

  /** Map backend fields → UI-friendly fields */
  private normalizeBillboard(billboard: Billboard): Billboard {
    const photos =
      billboard.photos && billboard.photos.length > 0
        ? billboard.photos
        : billboard.images && billboard.images.length > 0
          ? billboard.images
          : ["/billboard-placeholder.jpg"];

    const rate = billboard.rate ?? billboard.price ?? 0;
    const location =
      billboard.location ||
      billboard.locationAddress ||
      [billboard.city, billboard.state].filter(Boolean).join(", ") ||
      "";

    const dimensions =
      billboard.dimensions ||
      billboard.size ||
      (billboard.height && billboard.width
        ? `${billboard.height}x${billboard.width}`
        : "");

    const title =
      billboard.title ||
      (billboard.mediaType
        ? `${billboard.mediaType}${location ? ` at ${location}` : ""}`
        : "Billboard");

    return {
      ...billboard,
      photos,
      images: photos,
      rate,
      price: billboard.price ?? rate,
      location,
      locationAddress: billboard.locationAddress || location,
      dimensions,
      size: billboard.size || dimensions,
      title,
      rating: billboard.rating ?? 0,
      reviews: billboard.reviews ?? 0,
      impressions: billboard.impressions ?? 0,
      features: billboard.features || [],
      units: billboard.units || billboard.dimension,
    };
  }

  private normalizeList(list: Billboard[] = []): Billboard[] {
    return list
      .map((b) => this.normalizeBillboard(b))
      .sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bDate - aDate;
      });
  }

  // ─────────────────────────────────────────────
  // EXPLORE — all billboards (paginated list)
  // GET /billboards/explore
  // ─────────────────────────────────────────────
  async exploreBillboards(params: ExploreParams = {}): Promise<SearchResponse> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, String(value));
      }
    });

    const queryString = queryParams.toString();
    const url = queryString
      ? `${this.baseUrl}/explore?${queryString}`
      : `${this.baseUrl}/explore`;

    const response = await apiClient.get<ExploreResponse>(url);
    const result = response?.result;
    const items = this.normalizeList(result?.foundItems || []);

    return {
      data: items,
      foundItems: items,
      total: result?.count ?? items.length,
      count: result?.count ?? items.length,
      page: result?.currentPage ?? params.page ?? 1,
      currentPage: result?.currentPage ?? params.page ?? 1,
      limit: result?.limit ?? params.limit ?? 10,
      totalPages: result?.totalPages ?? 1,
      nextPage: result?.nextPage ?? null,
      result,
    };
  }

  // ─────────────────────────────────────────────
  // SEARCH — category groups for landing page
  // GET /billboards/search
  // ─────────────────────────────────────────────
  async searchBillboards(
    params: SearchParams = {}
  ): Promise<SearchResponse> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, String(value));
      }
    });

    const queryString = queryParams.toString();
    const url = queryString
      ? `${this.baseUrl}/search?${queryString}`
      : `${this.baseUrl}/search`;

    const response = await apiClient.get<LandingPageResponse & SearchResponse>(
      url
    );

    const groups = response?.landingPageBillboards || {};
    const normalizedGroups: Record<string, Billboard[]> = {};

    Object.entries(groups).forEach(([key, list]) => {
      normalizedGroups[key] = this.normalizeList(
        Array.isArray(list) ? list : []
      );
    });

    const flattened = Object.values(normalizedGroups).flat();

    return {
      ...response,
      landingPageBillboards: normalizedGroups,
      data: flattened,
      foundItems: flattened,
      total: flattened.length,
      count: flattened.length,
    };
  }

  // Get all billboards via explore
  async getAllBillboards(
    page: number = 1,
    limit: number = 12
  ): Promise<SearchResponse> {
    return this.exploreBillboards({ page, limit });
  }

  async getBillboardById(id: string): Promise<Billboard> {
    try {
      const response = await apiClient.get<Billboard>(
        `${this.baseUrl}/${id}`
      );
      return this.normalizeBillboard(response);
    } catch (error) {
      // Fallback: search explore list
      const exploreResponse = await this.exploreBillboards({
        limit: 100,
        page: 1,
      });
      const match = (exploreResponse.foundItems || []).find(
        (item) =>
          item._id === id || item.id === id || item.billboardId === id
      );

      if (match) {
        return this.normalizeBillboard(match);
      }

      throw error;
    }
  }

  async getFeaturedBillboards(limit: number = 6): Promise<PopularBillboard[]> {
    const response = await apiClient.get<PopularBillboard[]>(
      `${this.baseUrl}/featured?limit=${limit}`
    );
    return response;
  }

  async getBillboardsByLocation(
    location: string,
    limit?: number
  ): Promise<Billboard[]> {
    const response = await this.exploreBillboards({
      location,
      limit: limit || 10,
      page: 1,
    });
    return response.foundItems || [];
  }

  async getBillboardsByServiceType(
    serviceType: string,
    limit?: number
  ): Promise<Billboard[]> {
    const response = await this.exploreBillboards({
      mediaType: serviceType,
      limit: limit || 10,
      page: 1,
    });
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
    } catch {
      const exploreResponse = await this.exploreBillboards({ limit: 50 });
      const items = exploreResponse.foundItems || [];
      const prices = items.map((b) => b.rate || b.price || 0);

      return {
        locations: Array.from(
          new Set(items.map((b) => b.city || b.state).filter(Boolean) as string[])
        ),
        serviceTypes: [
          "Outdoor Advertising",
          "Indoor Advertising",
          "Digital Signage",
        ],
        mediaTypes: Array.from(
          new Set(items.map((b) => b.mediaType).filter(Boolean) as string[])
        ),
        priceRange: {
          min: prices.length ? Math.min(...prices) : 5000,
          max: prices.length ? Math.max(...prices) : 500000,
        },
      };
    }
  }

  async getNearbyBillboards(
    lat: number,
    lng: number,
    radius: number = 5
  ): Promise<Billboard[]> {
    const response = await apiClient.get<Billboard[]>(
      `${this.baseUrl}/nearby`,
      {
        params: { lat, lng, radius },
      }
    );
    return this.normalizeList(response);
  }

  async getSimilarBillboards(
    billboardId: string,
    limit: number = 4
  ): Promise<Billboard[]> {
    const response = await apiClient.get<Billboard[]>(
      `${this.baseUrl}/${billboardId}/similar`,
      {
        params: { limit },
      }
    );
    return this.normalizeList(response);
  }

  async toggleFavorite(
    billboardId: string
  ): Promise<{ message: string; isFavorited: boolean }> {
    return apiClient.post<{ message: string; isFavorited: boolean }>(
      `${this.baseUrl}/favorite`,
      { billboardId }
    );
  }
}

export const billboardService = new BillboardService();