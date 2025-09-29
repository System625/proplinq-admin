'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BlogPost } from '@/types/api';

interface BlogPostDeleteModalProps {
  isOpen: boolean;
  selectedBlogPost: BlogPost | null;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function BlogPostDeleteModal({
  isOpen,
  selectedBlogPost,
  isSubmitting,
  onClose,
  onConfirm,
}: BlogPostDeleteModalProps) {
  if (!isOpen || !selectedBlogPost) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Confirm Deletion</h3>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-6">
            <p className="text-gray-700 dark:text-gray-300">
              Are you sure you want to delete the blog post{' '}
              <strong>&quot;{selectedBlogPost.title}&quot;</strong>? This action cannot be undone.
            </p>
          </div>
        </ScrollArea>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Deleting...
              </>
            ) : (
              <>
                <X className="w-4 h-4 mr-1" /> Delete
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}