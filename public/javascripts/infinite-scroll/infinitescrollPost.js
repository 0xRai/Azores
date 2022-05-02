// Credits: https://www.javascripttutorial.net/javascript-dom/javascript-infinite-scroll/
// Thanks for helping out a beginner. 

(function() {
    let URLid
    let titleURL
    const URL = document.URL;

    getPostInfo(URL, '/', 6)
    const postsEl = document.querySelector('.posts');
    const loaderEl = document.querySelector('.loader');
    const activeTabEl = 'New';
    // const activeTabEl = document.querySelector('.tab-active').innerText;
    // const titleSlice = document.title.slice(0, document.title.trim().indexOf(':'));
    console.log(URLid)
    console.log(titleURL)
    const currentUser = document.querySelector('.user').innerText.trim();
    // Get the API Post
    const getposts = async(skip, limit) => {
        const API_URL = `/api/p/${URLid}/${titleURL}?&skip=${skip}&limit=${limit}`;
        const response = await fetch(API_URL);
        // handle 404
        if (!response.ok) {
            throw new Error(`An error occurred: ${response.status}`);
        }
        return await response.json();
    }

    // show the posts
    const showPosts = (comments) => {
        comments.forEach(comment => {
            const postEl = document.createElement('div');
            postEl.classList.add('comment');
            if (currentUser === comment.author) {
                postEl.innerHTML = `
                <div class="post-row" id="${comment._id}">
                <div class="post-section" id="rating">
                    <button>▲</button>
                    <p>
                        ${ comment.rating }
                    </p>
                    <button>▼</button>
                </div>
                <div class="post-section">
                    <div class="post-col">
                        <p class="post-small">
                            <a href="/user/${ comment.author }">
                                ${ comment.author }
                            </a>
                            •
                            ${comment.dateCreatedFormat }
                        </p>
                        <div class="post-body post-small">
                            ${ comment.body }
                        </div>
                            <div class="post-row">
                                <form action="/c/${ comment.post.community }/posts/${ comment.post.URLid }/${ comment.post.titleURL }/comments/${ comment._id}?_method=DELETE" method="POST">
                                    <button class="no-button post-small">Delete</button>
                                </form>
                            </div>
                                <hr>
                    </div>
                </div>
            </div>`;
            } else {
                postEl.innerHTML = `
                <div class="post-row" id="${comment._id}">
                <div class="post-section" id="rating">
                    <button>▲</button>
                    <p>
                        ${ comment.rating }
                    </p>
                    <button>▼</button>
                </div>
                <div class="post-section">
                    <div class="post-col">
                        <p class="post-small">
                            <a href="/user/${ comment.author }">
                                ${ comment.author.username }
                            </a>
                            •
                            ${comment.dateCreatedFormat }
                        </p>
                        <div class="post-body post-small">
                            ${ comment.body }
                        </div>
                                <hr>
                    </div>
                </div>
            </div>`;
            }

            postsEl.appendChild(postEl);
        });
    };

    const noMorePosts = () => {
        const noMore = document.createElement('p');
        noMore.style = `
        color: #262626
        `
        noMore.innerText = 'No more comments :(';
        loaderEl.innerHTML = '';
        loaderEl.appendChild(noMore);

    };

    const hideLoader = () => {
        loaderEl.classList.remove('show');
    };

    const showLoader = () => {
        loaderEl.classList.add('show');
    };

    const hasMorePosts = (skip, limit, total) => {
        const startIndex = 0;
        return total === 0 || startIndex < total;

    };
    // load posts
    const loadPosts = async(skip, limit) => {
        // show the loader
        showLoader();
        // 0.5 seconds later
        setTimeout(async() => {
            try {
                // if having more posts to fetch
                if (hasMorePosts(skip, limit, total)) {
                    // call the API to get posts
                    const response = await getposts(skip, limit);
                    // show posts
                    if (response.comments.length === 0) {
                        noMorePosts();
                    } else {
                        showPosts(response.comments);
                        // update the total
                        total = response.total;
                    }
                }
            } catch (error) {
                console.log(error.message);
            } finally {
                hideLoader();
            }
        }, 500);

    };

    function getPostInfo(string, subString, index) {
        let URLgrab = string.split(subString, index).join(subString).length;
        let URLcrop = URL.slice(URLgrab + 1)
        let URLlength = URLcrop.length
        URLid = URLcrop.substring(0, 6)
        if (URLcrop.includes('#')) {
            let removePound = URLcrop.split('#', 1).join('#').length;
            titleURL = URLcrop.substring(7, removePound)
        } else {
            titleURL = URLcrop.substring(7, URLlength)
        }
        return URLid, titleURL

    }
    // control variables
    let currentSkip = 0;
    const limit = 50;
    let total = 0;


    window.addEventListener('scroll', () => {
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;

        if (scrollTop + clientHeight >= scrollHeight - 5 &&
            hasMorePosts(currentSkip, limit, total)) {
            currentSkip += 50;
            loadPosts(currentSkip, limit);
        }
    }, {
        passive: true
    });
    // initialize
    loadPosts(currentSkip, limit);
})();