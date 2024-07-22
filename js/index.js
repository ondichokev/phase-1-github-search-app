document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("#github-form");
    const userList = document.querySelector("#user-list");
    const repoList = document.querySelector("#repos-list");
    const toggleButton = document.querySelector("#toggle-button");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const searchInput = document.querySelector("#search").value;

        // Clear previous search results
        userList.innerHTML = "";
        repoList.innerHTML = "";

        // Search for users matching the input
        fetch(`https://api.github.com/search/users?q=${searchInput}`, {
            headers: {
                "Accept": "application/vnd.github.v3+json"
            }
        })
        .then(response => response.json())
        .then(data => {
            data.items.forEach(user => {
                renderUser(user);
            });
        })
        .catch(error => console.error("Error searching users:", error));
    });

    function renderUser(user) {
        const userItem = document.createElement("li");
        const userLink = document.createElement("a");
        userLink.href = user.html_url;
        userLink.target = "_blank";

        const avatar = document.createElement("img");
        avatar.src = user.avatar_url;
        avatar.alt = `${user.login} avatar`;
        avatar.classList.add("avatar");

        const username = document.createElement("span");
        username.textContent = user.login;

        userLink.appendChild(avatar);
        userLink.appendChild(username);
        userItem.appendChild(userLink);
        userList.appendChild(userItem);

        userItem.addEventListener("click", function() {
            fetchUserRepos(user.login);
        });
    }

    function fetchUserRepos(username) {
        fetch(`https://api.github.com/users/${username}/repos`, {
            headers: {
                "Accept": "application/vnd.github.v3+json"
            }
        })
        .then(response => response.json())
        .then(repos => {
            repoList.innerHTML = ""; // Clear previous repo list
            repos.forEach(repo => {
                renderRepo(repo);
            });
        })
        .catch(error => console.error(`Error fetching repositories for ${username}:`, error));
    }

    function renderRepo(repo) {
        const repoItem = document.createElement("li");
        const repoLink = document.createElement("a");
        repoLink.href = repo.html_url;
        repoLink.target = "_blank";
        repoLink.textContent = repo.name;

        repoItem.appendChild(repoLink);
        repoList.appendChild(repoItem);
    }

    toggleButton.addEventListener("click", function() {
        const searchLabel = document.querySelector("label[for='search']");
        const currentPlaceholder = document.querySelector("#search").placeholder;

        if (currentPlaceholder === "Search by GitHub Username") {
            searchLabel.textContent = "Search Repositories:";
            document.querySelector("#search").placeholder = "Enter keyword...";
        } else {
            searchLabel.textContent = "Search Users:";
            document.querySelector("#search").placeholder = "Enter GitHub username...";
        }
    });
});
