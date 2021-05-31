const delButtonHandler = async (event) => {
  console.log('delete');
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');

    const response = await fetch(`/api/blog/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace('/');
    } else {
      alert('Failed to delete blog post');
    }
  } else {
    console.log('error, no data id found');
  }
};

document.querySelector('.delete').addEventListener('click', delButtonHandler);
