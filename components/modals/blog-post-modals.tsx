'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BlogPost, BlogPostCreate } from '@/types/api';
import Image from 'next/image';

interface BlogPostModalsProps {
  // Create modal
  isCreateModalOpen: boolean;
  createFormData: BlogPostCreate;
  createImagePreview: string;
  onCreateModalClose: () => void;
  onCreateFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCreateFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCreateSubmit: (e: React.FormEvent) => void;

  // View modal
  selectedBlogPost: BlogPost | null;
  isViewModalOpen: boolean;
  onViewModalClose: () => void;

  // Common
  isSubmitting: boolean;
}

export function BlogPostModals({
  // Create modal
  isCreateModalOpen,
  createFormData,
  createImagePreview,
  onCreateModalClose,
  onCreateFormChange,
  onCreateFileChange,
  onCreateSubmit,

  // View modal
  selectedBlogPost,
  isViewModalOpen,
  onViewModalClose,

  // Common
  isSubmitting,
}: BlogPostModalsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

  return (
    <>
      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Blog Post</h3>
            </div>
            <ScrollArea className="h-[500px]">
              <form onSubmit={onCreateSubmit} className="flex flex-col flex-1">
                <div className="flex-1 overflow-hidden">
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Title *
                      </label>
                      <Input
                        type="text"
                        name="title"
                        value={createFormData.title}
                        onChange={onCreateFormChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-proplinq-blue focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Enter blog post title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Excerpt *
                      </label>
                      <Textarea
                        name="excerpt"
                        value={createFormData.excerpt}
                        onChange={onCreateFormChange}
                        className="w-full min-h-[80px]"
                        placeholder="Enter a short excerpt for the blog post"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Content *
                      </label>
                      <Textarea
                        name="content"
                        value={createFormData.content}
                        onChange={onCreateFormChange}
                        className="w-full min-h-[200px]"
                        placeholder="Enter the full content of the blog post"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Image *
                      </label>
                      <Input
                        type="file"
                        name="image"
                        onChange={onCreateFileChange}
                        className="w-full"
                        accept="image/*"
                        required
                      />
                      {createImagePreview && (
                        <div className="mt-2">
                          <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                            <Image
                              src={createImagePreview}
                              alt="Preview"
                              fill
                              className="object-cover"
                              onError={() => { }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCreateModalClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-proplinq-blue hover:bg-blue-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-1" /> Create Blog Post
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </ScrollArea>
          </motion.div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedBlogPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Blog Post Details</h3>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-6">
                <div className="space-y-6">
                  {/* Image */}
                  {selectedBlogPost.image && (
                    <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <Image
                        src={getEncodedImageUrl(selectedBlogPost.image)}
                        alt={selectedBlogPost.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Title */}
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {selectedBlogPost.title}
                    </h4>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Excerpt</p>
                    <p className="text-lg text-gray-700 dark:text-gray-300 italic">
                      {selectedBlogPost.excerpt}
                    </p>
                  </div>

                  {/* Content */}
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Content</p>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap text-gray-900 dark:text-white">
                        {selectedBlogPost.content}
                      </p>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Created At</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {formatDate(selectedBlogPost.created_at)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Updated At</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {formatDate(selectedBlogPost.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <Button variant="outline" onClick={onViewModalClose}>
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}