import { BlogPostsTable } from '@/components/data-tables/blog-posts-table';

export default function BlogPostsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Blog Posts Management</h1>
        <p className="text-muted-foreground">
          Create and manage blog posts for the main website
        </p>
      </div>

      <BlogPostsTable />
    </div>
  );
}