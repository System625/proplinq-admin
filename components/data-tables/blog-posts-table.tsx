'use client';

import { useEffect, useState } from 'react';
import { useBlogPostsStore } from '@/stores/blog-posts-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Search, Eye, Edit, Trash2, Plus, Send } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { BlogPostModals } from '@/components/modals/blog-post-modals';
import { BlogPostEditModal } from '@/components/modals/blog-post-edit-modal';
import { BlogPostDeleteModal } from '@/components/modals/blog-post-delete-modal';
import { BlogPost, BlogPostCreate, BlogPostUpdate } from '@/types/api';
import Image from 'next/image';
import { toast } from 'sonner';

export function BlogPostsTable() {
  const {
    blogPosts,
    pagination,
    isLoading,
    searchQuery,
    fetchBlogPosts,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    publishBlogPost,
    uploadImage,
  } = useBlogPostsStore();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debouncedSearch = useDebounce(localSearch, 500);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [createFormData, setCreateFormData] = useState<BlogPostCreate>({
    title: '',
    excerpt: '',
    content: '',
    image: '',
  });
  const [editFormData, setEditFormData] = useState<BlogPostUpdate>({});
  const [createImagePreview, setCreateImagePreview] = useState<string>('');
  const [editImagePreview, setEditImagePreview] = useState<string>('');

  useEffect(() => {
    fetchBlogPosts({ page: 1 });
  }, [fetchBlogPosts]);

  const handlePageChange = (page: number) => {
    fetchBlogPosts({ page });
  };

  const filteredBlogPosts =
    blogPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(debouncedSearch.toLowerCase()),
    ) || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getEncodedImageUrl = (imageUrl: string) => {
    if (!imageUrl) return '';
    try {
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/');
      const encodedPath = pathParts.map(part => encodeURIComponent(part)).join('/');
      return `${url.protocol}//${url.host}${encodedPath}`;
    } catch {
      return imageUrl;
    }
  };

  // Modal handlers
  const handleCreateClick = () => {
    setCreateFormData({
      title: '',
      excerpt: '',
      content: '',
      image: '',
    });
    setCreateImagePreview('');
    setIsCreateModalOpen(true);
  };

  const handleViewClick = (blogPost: BlogPost) => {
    setSelectedBlogPost(blogPost);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (blogPost: BlogPost) => {
    setSelectedBlogPost(blogPost);
    setEditFormData({
      title: blogPost.title,
      excerpt: blogPost.excerpt,
      content: blogPost.content,
      image: blogPost.image,
    });
    setEditImagePreview(blogPost.image);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (blogPost: BlogPost) => {
    setSelectedBlogPost(blogPost);
    setIsDeleteModalOpen(true);
  };

  const handleCreateFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCreateFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('📷 BlogPostsTable: File selected for create:', file.name, file.size);

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload a JPEG, PNG, JPG, GIF, or SVG image.');
        e.target.value = ''; // Reset input
        return;
      }

      // Validate file size (2MB max)
      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSizeInBytes) {
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        toast.error(`Image size (${fileSizeMB}MB) exceeds the maximum allowed size of 2MB. Please choose a smaller image.`);
        e.target.value = ''; // Reset input
        return;
      }

      // Store the file object temporarily
      setCreateFormData(prev => ({ ...prev, image: file as unknown as string }));

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setCreateImagePreview(previewUrl);
    }
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('📷 BlogPostsTable: File selected for edit:', file.name, file.size);

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload a JPEG, PNG, JPG, GIF, or SVG image.');
        e.target.value = ''; // Reset input
        return;
      }

      // Validate file size (2MB max)
      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSizeInBytes) {
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        toast.error(`Image size (${fileSizeMB}MB) exceeds the maximum allowed size of 2MB. Please choose a smaller image.`);
        e.target.value = ''; // Reset input
        return;
      }

      // Store the file object temporarily
      setEditFormData(prev => ({ ...prev, image: file as unknown as string }));

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setEditImagePreview(previewUrl);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log('🔄 BlogPostsTable: Create submit started');
    console.log('📝 BlogPostsTable: Form data:', createFormData);

    // Validate form data
    if (createFormData.title.length > 255) {
      toast.error('Title must not exceed 255 characters');
      setIsSubmitting(false);
      return;
    }
    if (createFormData.excerpt.length > 500) {
      toast.error('Excerpt must not exceed 500 characters');
      setIsSubmitting(false);
      return;
    }
    if (createFormData.content.length < 100) {
      toast.error('Content must be at least 100 characters');
      setIsSubmitting(false);
      return;
    }

    try {
      let imagePath = '';
      if (createFormData.image && typeof createFormData.image === 'object' && 'name' in createFormData.image) {
        const file = createFormData.image as File;
        console.log('📤 BlogPostsTable: Uploading image file:', file.name);
        imagePath = await uploadImage(file);
        console.log('✅ BlogPostsTable: Image uploaded successfully:', imagePath);
      }

      const blogPostData = {
        title: createFormData.title,
        excerpt: createFormData.excerpt,
        content: createFormData.content,
        image: imagePath,
      };

      console.log('📤 BlogPostsTable: Sending data:', blogPostData);

      await createBlogPost(blogPostData);
      setIsCreateModalOpen(false);
      setCreateFormData({
        title: '',
        excerpt: '',
        content: '',
        image: '',
      });
      setCreateImagePreview('');
      console.log('✅ BlogPostsTable: Create successful');
    } catch (error) {
      console.error('❌ BlogPostsTable: Create error:', error);
      // Error is handled in the store
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBlogPost) return;

    setIsSubmitting(true);

    console.log('🔄 BlogPostsTable: Edit submit started');
    console.log('📝 BlogPostsTable: Edit form data:', editFormData);

    // Validate form data
    if (editFormData.title && editFormData.title.length > 255) {
      toast.error('Title must not exceed 255 characters');
      setIsSubmitting(false);
      return;
    }
    if (editFormData.excerpt && editFormData.excerpt.length > 500) {
      toast.error('Excerpt must not exceed 500 characters');
      setIsSubmitting(false);
      return;
    }
    if (editFormData.content && editFormData.content.length < 100) {
      toast.error('Content must be at least 100 characters');
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare update data
      const updateData: Partial<BlogPostUpdate> = {};

      if (editFormData.title) updateData.title = editFormData.title;
      if (editFormData.excerpt) updateData.excerpt = editFormData.excerpt;
      if (editFormData.content) updateData.content = editFormData.content;

      if (editFormData.image && typeof editFormData.image === 'object' && 'name' in editFormData.image) {
        const file = editFormData.image as File;
        console.log('📤 BlogPostsTable: Uploading new image file:', file.name);
        const imagePath = await uploadImage(file);
        updateData.image = imagePath;
        console.log('✅ BlogPostsTable: Image uploaded successfully:', imagePath);
      }

      console.log('📤 BlogPostsTable: Sending update data:', updateData);

      await updateBlogPost(selectedBlogPost.id.toString(), updateData);
      setIsEditModalOpen(false);
      setSelectedBlogPost(null);
      setEditFormData({});
      setEditImagePreview('');
      console.log('✅ BlogPostsTable: Edit successful');
    } catch {
      // Error is handled in the store
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBlogPost) return;

    setIsSubmitting(true);
    try {
      await deleteBlogPost(selectedBlogPost.id.toString());
      setIsDeleteModalOpen(false);
      setSelectedBlogPost(null);
    } catch {
      // Error is handled in the store
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublishClick = async (blogPost: BlogPost) => {
    setIsSubmitting(true);
    try {
      await publishBlogPost(blogPost.id.toString());
    } catch {
      // Error is handled in the store
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && (!blogPosts || blogPosts.length === 0)) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Blog Posts Management</CardTitle>
            <Button disabled>
              <Plus className="h-4 w-4 mr-2" />
              Create Blog Post
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search blog posts..."
              className="pl-10"
              disabled
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Blog Posts Management</CardTitle>
            <Button onClick={handleCreateClick} className="bg-proplinq-blue hover:bg-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Create Blog Post
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search blog posts..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {!blogPosts || blogPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No blog posts found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery ? `No blog posts match "${searchQuery}"` : 'There are no blog posts to display at the moment.'}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBlogPosts && filteredBlogPosts.map((blogPost) => (
                  <Card key={blogPost.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700">
                      {blogPost.image ? (
                        <Image
                          src={getEncodedImageUrl(blogPost.image)}
                          alt={blogPost.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-lg line-clamp-2 flex-1">{blogPost.title}</h3>
                        {blogPost.is_published && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Published
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{blogPost.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                        <div className="space-y-1">
                          <p>Created: {formatDate(blogPost.created_at)}</p>
                          <p>Updated: {formatDate(blogPost.updated_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t">
                        {!blogPost.is_published && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePublishClick(blogPost)}
                            disabled={isSubmitting}
                            className="flex-1 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Publish
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewClick(blogPost)}
                          className="flex-1"
                        >
                          <Eye className="h-4 w-4 mr-1" />                          
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(blogPost)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />                          
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(blogPost)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                    {pagination.total} blog posts
                  </p>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (pagination.page > 1) {
                              handlePageChange(pagination.page - 1);
                            }
                          }}
                          className={pagination.page === 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>

                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }

                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(pageNum);
                              }}
                              isActive={pagination.page === pageNum}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (pagination.page < pagination.totalPages) {
                              handlePageChange(pagination.page + 1);
                            }
                          }}
                          className={pagination.page === pagination.totalPages ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <BlogPostModals
        // Create modal
        isCreateModalOpen={isCreateModalOpen}
        createFormData={createFormData}
        createImagePreview={createImagePreview}
        onCreateModalClose={() => setIsCreateModalOpen(false)}
        onCreateFormChange={handleCreateFormChange}
        onCreateFileChange={handleCreateFileChange}
        onCreateSubmit={handleCreateSubmit}

        // View modal
        selectedBlogPost={selectedBlogPost}
        isViewModalOpen={isViewModalOpen}
        onViewModalClose={() => setIsViewModalOpen(false)}

        // Common
        isSubmitting={isSubmitting}
      />

      <BlogPostEditModal
        isOpen={isEditModalOpen}
        selectedBlogPost={selectedBlogPost}
        editFormData={editFormData}
        editImagePreview={editImagePreview}
        isSubmitting={isSubmitting}
        onClose={() => setIsEditModalOpen(false)}
        onFormChange={handleEditFormChange}
        onFileChange={handleEditFileChange}
        onSubmit={handleEditSubmit}
      />

      <BlogPostDeleteModal
        isOpen={isDeleteModalOpen}
        selectedBlogPost={selectedBlogPost}
        isSubmitting={isSubmitting}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}