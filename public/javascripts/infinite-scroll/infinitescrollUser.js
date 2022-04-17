// Credits: https://www.javascripttutorial.net/javascript-dom/javascript-infinite-scroll/
// Thanks for helping out a beginner. 

(function() {

    const postsEl = document.querySelector('.posts');
    const loaderEl = document.querySelector('.loader');
    const activeTabEl = document.querySelector('.tab-active').innerText;
    const activeContentEl = document.querySelector('.content-active').innerText;
    const titleSlice = document.title.slice(0, document.title.trim().indexOf("'"));
    // Get the API Post
    const getContent = async(skip, limit) => {
            const API_URL = `http://localhost:3000/api/u/${titleSlice}?content=${activeContentEl}&sortBy=${activeTabEl}&skip=${skip}&limit=${limit}`;
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
                        ${post.dateCreatedFormat} to <a href="/c/${post.community}" class="community-redirect">
                        c/${post.community}
                    </a>

                    </p>
                        <div class="post-row">
                            <p class="post-small">
                                <a href="/c/${post.community}/posts/${post.URLid}/${post.titleURL}/#comments">
                                    ${post.comments.length} comments
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

    const showComments = (comments) => {
        comments.forEach(comment => {
            const postEl = document.createElement('div');
            postEl.classList.add('post');
            postEl.innerHTML = `
                    <div class="post-row">
                        <div class="post-section" id="rating">
                        <p>${comment.rating}</p>
                    </div>
                    <div class="post-section">
                        <div class="post-col">
                            <div class="post-col">
                                <a
                                    href="/c/${ comment.post.community }/posts/${ comment.post.URLid }/${ comment.post.titleURL }/#${ comment._id }"
                                    class="community-redirect comment-header">
                                    ${comment.post.title}
                                </a>
                                <p class="comment-header post-body">${ comment.body }</p>
                            </div>
                            <p class="post-small">
                                ${comment.dateCreatedFormat} in
                                <a href="/c/${ comment.post.community}/">
                                    c/${ comment.post.community}
                                </a>
                            </p>
                        <div class="post-row"></div>
                    </div>
        `;

            postsEl.appendChild(postEl);
        });
    };

    const noMorePosts = () => {
        const noMore = document.createElement('p');
        noMore.innerText = `No more ${activeContentEl} :(`;
        loaderEl.innerHTML = '';
        loaderEl.appendChild(noMore);

    };

    const hideLoader = () => {
        loaderEl.classList.remove('show');
    };

    const showLoader = () => {
        loaderEl.classList.add('show');
    };

    const hasMoreContent = (skip, limit, total) => {
        const startIndex = 0;
        return total === 0 || startIndex < total;

    };
    // load posts
    const loadContent = async(skip, limit) => {
        // show the loader
        showLoader();
        // 0.5 seconds later
        setTimeout(async() => {
            try {
                // if having more posts to fetch
                if (hasMoreContent(skip, limit, total)) {
                    // call the API to get posts
                    const response = await getContent(skip, limit);
                    if (activeContentEl === 'Posts') {
                        if (response.posts.length === 0) {
                            noMorePosts();
                        } else {
                            showPosts(response.posts);
                        }
                    } else if (activeContentEl === 'Comments') {
                        if (response.comments.length === 0) {
                            noMorePosts();
                        } else {
                            showComments(response.comments);
                        }
                    }
                    // update the total
                    total = response.total;
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
            hasMoreContent(currentSkip, limit, total)) {
            currentSkip += 50;
            loadContent(currentSkip, limit);
        }
    }, {
        passive: true
    });
    // initialize
    loadContent(currentSkip, limit);
})();