import { create } from 'zustand';
import { apiService } from '@/lib/axios';
import { BlogPost, BlogPostCreate, BlogPostUpdate, PaginatedResponse } from '@/types/api';
import { toast } from 'sonner';

interface BlogPostsState {
  blogPosts: BlogPost[];
  currentBlogPost: BlogPost | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;

  // Actions
  fetchBlogPosts: (params?: { page?: number; limit?: number; search?: string }) => Promise<void>;
  fetchBlogPost: (id: string) => Promise<void>;
  createBlogPost: (data: BlogPostCreate) => Promise<void>;
  updateBlogPost: (id: string, data: BlogPostUpdate) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;
  publishBlogPost: (id: string) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
  setSearchQuery: (query: string) => void;
  clearError: () => void;
  clearCurrentBlogPost: () => void;
}

export const useBlogPostsStore = create<BlogPostsState>((set, get) => ({
  blogPosts: [],
  currentBlogPost: null,
  pagination: null,
  isLoading: false,
  error: null,
  searchQuery: '',

  fetchBlogPosts: async (params) => {
    console.log('🔄 Blog Posts Store: Starting fetchBlogPosts with params:', params);
    set({ isLoading: true, error: null });

    try {
      const { searchQuery } = get();
      console.log('🔍 Blog Posts Store: searchQuery:', searchQuery);

      const response: any = await apiService.getBlogPosts({
        ...params,
      });

      console.log('📡 Blog Posts Store: Full API response:', response);
      console.log('📊 Blog Posts Store: response.data:', response.data);
      console.log('🔢 Blog Posts Store: response.data type:', typeof response.data);
      console.log('📋 Blog Posts Store: response.data is array:', Array.isArray(response.data));
      console.log('📄 Blog Posts Store: response.pagination:', response.pagination);

      const responseData = response.data || {};

      const blogPostsArray = Array.isArray(responseData.data) ? responseData.data : Array.isArray(responseData) ? responseData : [];
      const pagination = {
        page: responseData.current_page || 1,
        limit: responseData.per_page || 15,
        total: responseData.total || 0,
        totalPages: responseData.last_page || 1,
      };

      console.log('✅ Blog Posts Store: Final blog posts array:', blogPostsArray);
      console.log('📏 Blog Posts Store: Blog posts array length:', blogPostsArray.length);

      set({
        blogPosts: blogPostsArray,
        pagination: pagination,
        isLoading: false,
      });

      console.log('🎯 Blog Posts Store: State updated successfully');

      // Verify the state was actually updated
      const { blogPosts: updatedBlogPosts } = get();
      console.log('🔍 Blog Posts Store: Post-update verification - blog posts:', updatedBlogPosts);
      console.log('🔍 Blog Posts Store: Post-update verification - blog posts length:', updatedBlogPosts.length);
    } catch (error: any) {
      console.error('❌ Blog Posts Store: Error in fetchBlogPosts:', error);
      console.error('❌ Blog Posts Store: Error response:', error.response);
      console.error('❌ Blog Posts Store: Error response data:', error.response?.data);

      const errorMessage = error.response?.data?.message || 'Failed to fetch blog posts';
      set({
        blogPosts: [],
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },

  fetchBlogPost: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiService.getBlogPost(id);
      const blogPost = (response as any).data || response;
      console.log('📄 Blog Posts Store: Individual blog post response:', response);
      console.log('📄 Blog Posts Store: Extracted blog post:', blogPost);

      set({
        currentBlogPost: blogPost,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch blog post details';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
    }
  },

  createBlogPost: async (data: BlogPostCreate) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiService.createBlogPost(data);
      const newBlogPost = (response as any).data || response;
      console.log('✅ Blog Posts Store: Created blog post:', newBlogPost);

      // Add to the beginning of the list
      const { blogPosts } = get();
      set({
        blogPosts: [newBlogPost, ...blogPosts],
        isLoading: false,
      });

      toast.success('Blog post created successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create blog post';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
      throw error;
    }
  },

  updateBlogPost: async (id: string, data: BlogPostUpdate) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiService.updateBlogPost(id, data);
      const updatedBlogPost = (response as any).data || response;
      console.log('✅ Blog Posts Store: Updated blog post:', updatedBlogPost);

      // Update in the list
      const { blogPosts } = get();
      const updatedBlogPosts = blogPosts.map(post =>
        post.id === parseInt(id) ? updatedBlogPost : post
      );

      set({
        blogPosts: updatedBlogPosts,
        currentBlogPost: updatedBlogPost,
        isLoading: false,
      });

      toast.success('Blog post updated successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update blog post';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
      throw error;
    }
  },

  deleteBlogPost: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      await apiService.deleteBlogPost(id);
      console.log('✅ Blog Posts Store: Deleted blog post with ID:', id);

      // Remove from the list
      const { blogPosts } = get();
      const filteredBlogPosts = blogPosts.filter(post => post.id !== parseInt(id));

      set({
        blogPosts: filteredBlogPosts,
        isLoading: false,
      });

      toast.success('Blog post deleted successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete blog post';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
      throw error;
    }
  },

  publishBlogPost: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiService.publishBlogPost(id);
      const publishedBlogPost = (response as any).data || response;
      console.log('✅ Blog Posts Store: Published blog post:', publishedBlogPost);

      // Update in the list
      const { blogPosts } = get();
      const updatedBlogPosts = blogPosts.map(post =>
        post.id === parseInt(id) ? publishedBlogPost : post
      );

      set({
        blogPosts: updatedBlogPosts,
        currentBlogPost: publishedBlogPost,
        isLoading: false,
      });

      toast.success('Blog post published successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to publish blog post';
      set({
        error: errorMessage,
        isLoading: false,
      });
      toast.error(errorMessage);
      throw error;
    }
  },

  uploadImage: async (file: File) => {
    try {
      console.log('📤 Blog Posts Store: Uploading image:', file.name);
      const response = await apiService.uploadBlogPostImage(file);
      console.log('✅ Blog Posts Store: Image uploaded successfully:', response);
      const imagePath = response.image_path || (response as any).data?.image_path;
      console.log('📍 Blog Posts Store: Extracted image path:', imagePath);
      return imagePath;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to upload image';
      console.error('❌ Blog Posts Store: Image upload failed:', error);
      toast.error(errorMessage);
      throw error;
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  clearError: () => {
    set({ error: null });
  },

  clearCurrentBlogPost: () => {
    set({ currentBlogPost: null });
  },
}));