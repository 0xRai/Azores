// Credits: https://www.javascripttutorial.net/javascript-dom/javascript-infinite-scroll/
// Thanks for helping out a beginner. 

(function() {

    const postsEl = document.querySelector('.posts');
    const loaderEl = document.querySelector('.loader');
    // Get the API Post
    const getposts = async(skip, limit) => {
        const API_URL = `/api/i/?&skip=${skip}&limit=${limit}`;
        const response = await fetch(API_URL);
        // handle 404
        if (!response.ok) {
            throw new Error(`An error occurred: ${response.status}`);
        }
        return await response.json();
    }

    // show the posts
    const showPosts = (posts) => {
        posts.forEach(post => {
            const postEl = document.createElement('div');
            postEl.classList.add('post');
            postEl.innerHTML = `
                                        <div class="post-row">
                                        <div class="post-section" id="rating">
                                            <p>
                                                ${post.rating}
                                            </p>
                                        </div>
                                        <div class="post-section img-fluid">
                                            <img src="/images/testicon.png" alt="" class="">
                                        </div>
                                        <div class="post-section">
                                            <div class="post-col">
                                                <a href="/c/${post.community}/posts/${post.URLid}/${post.titleURL}" class="post-title">
                                                    ${post.title}
                                                </a>
                                                <p class="post-small">
                                                    Submitted by <a href="/user/${post.author}" class="community-redirect">${post.author}</a>
                                                    to <a href="/c/${post.community}" class="community-redirect">
                                                    c/${post.community}
                                                    </a>
                                                    • ${post.dateCreatedFormat}
                            
                                                </p>
                                                    <div class="post-row">
                                                        <p class="post-small">
                                                            <a href="/c/${post.community}/posts/${post.URLid}/${post.titleURL}/#comments">
                                                                ${post.comments} comments
                                                            </a>
                                                        </p>
                                                    </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
        `;

            postsEl.appendChild(postEl);
        });
    };

    const noMorePosts = () => {
        const noMore = document.createElement('p');
        noMore.innerText = 'No more posts :(';
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
                    if (response.posts.length === 0) {
                        noMorePosts();
                    } else {
                        showPosts(response.posts);
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