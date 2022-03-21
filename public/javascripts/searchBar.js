const searchBar = document.getElementById('searchBar');

searchBar.addEventListener("keyup", function(e) {
    if (e.code === "Enter") {
        if (document.getElementById("searchBar").value !== '') {
            e.preventDefault();
            document.getElementById("searchBarBtn").click();
        }

    }
})