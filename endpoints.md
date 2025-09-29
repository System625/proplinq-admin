Blog post flow:
- Create a new blog post
/admin/blog-posts, POST request
{
    "title": "New Blog Post Title",
    "excerpt": "This is a short excerpt of the blog post",
    "content": "This is the full content of the blog post with detailed information.",
    "image": "/storage/blog-images/sample-image.jpg"
}
- Update a blog post
/admin/blog-posts/1, PUT request
{
    "title": "Updated Blog Post Title",
    "excerpt": "Updated excerpt of the blog post",
    "content": "Updated content with more detailed information.",
    "image": "/storage/blog-images/updated-image.jpg"
}
- Delete a blog post
/admin/blog-posts/1, DELETE request
- Get all blog posts
/admin/blog-posts, GET request
