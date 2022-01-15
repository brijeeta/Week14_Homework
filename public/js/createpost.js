async function newFormHandler(event) {
    event.preventDefault();
    const title = document.querySelector('input[name="post-title"]').value;
    const post_text = document.querySelector('textarea[name="post-text"]').value;

    // Send fetch request to add a new blog
    const response = await fetch(`/api/posts/createnew`, {
        method: 'POST',
        body: JSON.stringify({
            title,
            contents,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    //if the blog is added, the 'all' template will be rerendered
    console.log(response)
    if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);