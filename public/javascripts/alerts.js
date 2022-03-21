const alert = document.getElementById('alert');

if (alert !== null) {
    alert.addEventListener('click', function() {
        alert.remove();
    })
}