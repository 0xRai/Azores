const searchBar = document.getElementById('searchBar');

searchBar.addEventListener("keyup", function(e) {
    // need to use two if statements. e.code === "Enter" || "NumpadEnter" makes the script submit immediately after inputting a key.
    if (e.code === "Enter") {
        if (document.getElementById("searchBar").value !== '') {
            e.preventDefault();
            document.getElementById("searchBarBtn").click();
        }

    }
    if (e.code === "NumpadEnter") {
        if (document.getElementById("searchBar").value !== '') {
            e.preventDefault();
            document.getElementById("searchBarBtn").click();
        }

    }
})