// lib/api-client.ts

import { IVideo } from "@/models/Video";

interface VideoFormData {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  controls?: boolean;
  transformation?: {
    height?: number;
    width?: number;
    quality?: number;
  };
}

export const apiClient = {
  /**
   * Fetch all videos from the API
   * @returns Promise resolving to an array of video objects
   */
  getVideos: async (): Promise<IVideo[]> => {
    const response = await fetch('/api/videos');
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch videos');
    }
    return response.json();
  },
  
  /**
   * Fetch a single video by ID
   * @param id The video ID to fetch
   * @returns Promise resolving to a single video object
   */
  getVideo: async (id: string): Promise<IVideo> => {
    const response = await fetch(`/api/videos/${id}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch video');
    }
    return response.json();
  },
  
  /**
   * Create a new video
   * @param data The video data to submit
   * @returns Promise resolving to the created video object
   */
  createVideo: async (data: VideoFormData): Promise<IVideo> => {
    const response = await fetch('/api/videos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to create video');
    }
    
    return response.json();
  },

  /**
   * Update an existing video
   * @param id The ID of the video to update
   * @param data The updated video data
   * @returns Promise resolving to the updated video object
   */
  updateVideo: async (id: string, data: Partial<VideoFormData>): Promise<IVideo> => {
    const response = await fetch(`/api/videos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to update video');
    }
    
    return response.json();
  },

  /**
   * Delete a video
   * @param id The ID of the video to delete
   * @returns Promise resolving to a success message
   */
  deleteVideo: async (id: string): Promise<{ success: boolean }> => {
    const response = await fetch(`/api/videos/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to delete video');
    }
    
    return response.json();
  },
  
  /**
   * Like or unlike a video
   * @param id The ID of the video to like/unlike
   * @returns Promise resolving to the updated video with like count
   */
  toggleLikeVideo: async (id: string): Promise<IVideo> => {
    const response = await fetch(`/api/videos/${id}/like`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to like/unlike video');
    }
    
    return response.json();
  },
  
  /**
   * Get authentication status
   * @returns Promise resolving to the user session data
   */
  getAuthStatus: async (): Promise<{ authenticated: boolean; user?: unknown }> => {
    const response = await fetch('/api/auth/session');
    if (!response.ok) {
      return { authenticated: false };
    }
    const data = await response.json();
    return {
      authenticated: !!data.user,
      user: data.user || null,
    };
  }
};