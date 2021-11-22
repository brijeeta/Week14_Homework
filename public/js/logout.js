const logout = async() => {
    const response = await fetch('/api/users/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
        document.location.replace('/');
    } else {
        alert(response.statusText);
    }
};

document.querySelector('#logout').addEventListener('click', logout);

const burgerIcon = document.querySelector('#burger');
const navbarMenu = document.querySelector('#navbarBasicExample');

burgerIcon.addEventListener('click', () => {
    navbarMenu.classList.toggle('is-active');
})