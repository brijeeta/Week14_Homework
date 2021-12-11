// const delButtonHandler = async(event) => {
//     if (event.target.hasAttribute('data-id')) {
//         const id = event.target.getAttribute('data-id');

//         const response = await fetch(`/api/reviews/${id}`, {
//             method: 'DELETE',
//         });

//         if (response.ok) {
//             document.location.replace('/readreview');
//         } else {
//             alert('Failed to delete blog');
//         }
//     }
// };

// document
//     .querySelector('.blog-details')
//     .addEventListener('click', delButtonHandler);