const newCommentHandler = async (event) => {
  event.preventDefault();

  const commentName = document.querySelector('#comment-name').value.trim();
  const comment = document.querySelector('#comment-text').value.trim();
  const blogId = document.querySelector('#blog-id').value.trim();

  console.log(blogId);

  if (blogId && commentName && comment) {
    const response = await fetch(`/api/comment`, {
      method: 'POST',
      body: JSON.stringify({
        blog_id: blogId,
        name: commentName,
        comment: comment,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace('/');
    } else {
      alert('Failed to post comment!');
    }
  }
};

document
  .querySelector('.new-comment')
  .addEventListener('submit', newCommentHandler);
