'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BlogPost, BlogPostUpdate } from '@/types/api';
import Image from 'next/image';

interface BlogPostEditModalProps {
  isOpen: boolean;
  selectedBlogPost: BlogPost | null;
  editFormData: BlogPostUpdate;
  editImagePreview: string;
  isSubmitting: boolean;
  onClose: () => void;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function BlogPostEditModal({
  isOpen,
  selectedBlogPost,
  editFormData,
  editImagePreview,
  isSubmitting,
  onClose,
  onFormChange,
  onFileChange,
  onSubmit,
}: BlogPostEditModalProps) {
  if (!isOpen || !selectedBlogPost) return null;

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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Blog Post</h3>
        </div>
        <ScrollArea className="h-[500px]">
          <form onSubmit={onSubmit} className="flex flex-col flex-1">
            <div className="flex-1 overflow-hidden">
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title <span className="text-xs text-gray-500">({(editFormData.title || '').length}/255)</span>
                  </label>
                  <Input
                    type="text"
                    name="title"
                    value={editFormData.title || ''}
                    onChange={onFormChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-proplinq-blue focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter blog post title"
                    maxLength={255}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Excerpt <span className="text-xs text-gray-500">({(editFormData.excerpt || '').length}/500)</span>
                  </label>
                  <Textarea
                    name="excerpt"
                    value={editFormData.excerpt || ''}
                    onChange={onFormChange}
                    className="w-full min-h-[80px] px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-proplinq-blue focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter a short excerpt for the blog post"
                    maxLength={500}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Content <span className="text-xs text-gray-500">({(editFormData.content || '').length} characters, min 100)</span>
                  </label>
                  <Textarea
                    name="content"
                    value={editFormData.content || ''}
                    onChange={onFormChange}
                    className="w-full min-h-[200px] px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-proplinq-blue focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter the full content of the blog post (minimum 100 characters)"
                    minLength={100}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Image
                  </label>
                  <Input
                    type="file"
                    name="image"
                    onChange={onFileChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-proplinq-blue focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white cursor-pointer"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/svg+xml"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Accepted formats: JPEG, PNG, JPG, GIF, SVG (max 2MB)
                  </p>
                  {editImagePreview && (
                    <div className="mt-2">
                      <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <Image
                          src={editImagePreview.startsWith('blob:') ? editImagePreview : getEncodedImageUrl(editImagePreview)}
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
                onClick={onClose}
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
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-1" /> Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </motion.div>
    </div>
  );
}