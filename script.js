const ui = {
    userGrid: document.getElementById("userGrid"),
    resultText: document.getElementById("resultText"),
    searchInput: document.getElementById("searchInput"),
    refreshBtn: document.getElementById("refreshBtn"),
    loadingState: document.getElementById("loadingState"),
    errorState: document.getElementById("errorState")
}


let allUsers = [];

function showLoading(isLoading) {
    ui.loadingState.classList.toggle("hidden", !isLoading);
    ui.userGrid.classList.toggle("hidden", isLoading);
}

function showError(message) {
    ui.errorState.textContent = message;
    ui.errorState.classList.remove("hidden");
}

function renderUsers(users = []) {
    
    ui.userGrid.innerHTML = users.map(
        (user) => `
            <div class="bg-gray-800 p-4 rounded-lg border border-gray-800 shadow-sm hover:shadow-md transition">
                <img src="${user.picture.medium}" alt="${user.name.first}" class="w-16 h-16 rounded-full mx-auto mb-3">
                <h3 class="text-lg text-gray-100 font-semibold text-center">${user.name.first} ${user.name.last}</h3>
                <p class="text-sm text-gray-300 text-center">
                    ${user.location.country}
                </p>
                <p class="text-sm text-gray-400 mt-2">${user.email}</p>
                <p class="text-sm text-gray-400"> ${user.phone}</p>
                <p class="text-sm text-gray-400"> ${user.dob.age}</p>
            </div>
        `
    ).join("")

    ui.resultText.textContent = `Showing ${users.length} user${users.length ==1 ? "" : "s"} ` // Showing 8 users, Showing 1 user
}

function hideError() {
    ui.errorState.classList.add("hidden");
}


function filterAndRender() {
    const term = ui.searchInput.value.toLowerCase();

    const filtered = allUsers.filter(
        (user) =>
            `${user.name.first} ${user.name.last}`.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)

    )
    renderUsers(filtered);
}



async function fetchUsers() {
    showLoading(true);
    hideError();

    try {
        const res = await fetch("https://randomuser.me/api/?results=100");
        if(!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        allUsers = data.results;
        renderUsers(allUsers);
    } catch (error) {
        console.log("Fetch Error", error);
        showError("Could not load users. Check your connection and try again");
        ui.userGrid.classList.add("hidden");
    } finally {
        showLoading(false);
    }
}

ui.searchInput.addEventListener("input", filterAndRender);
ui.refreshBtn.addEventListener("click", fetchUsers);

await fetchUsers()
