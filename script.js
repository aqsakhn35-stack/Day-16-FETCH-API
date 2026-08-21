const API_URL = "https://jsonplaceholder.typicode.com/users";

const loadingState = document.getElementById("loadingState");
const errorState = document.getElementById("errorState");
const emptyState = document.getElementById("emptyState");
const userGrid = document.getElementById("userGrid");
const errorMessage = document.getElementById("errorMessage");
const reloadBtn = document.getElementById("reloadBtn");
const retryBtn = document.getElementById("retryBtn");

function showState(name) {
  loadingState.hidden = name !== "loading";
  errorState.hidden = name !== "error";
  emptyState.hidden = name !== "empty";
  userGrid.hidden = name !== "data";
}

function createUserCard(user) {
  const card = document.createElement("article");
  card.className = "user-card";

  const tab = document.createElement("div");
  tab.className = "user-card__tab";
  tab.textContent = user.name ? user.name.charAt(0).toUpperCase() : "?";
  card.appendChild(tab);

  const name = document.createElement("h3");
  name.className = "user-card__name";
  name.textContent = user.name || "Unnamed user";
  card.appendChild(name);

  const username = document.createElement("p");
  username.className = "user-card__username";
  username.textContent = user.username ? `@${user.username}` : "";
  card.appendChild(username);

  const divider = document.createElement("hr");
  divider.className = "user-card__divider";
  card.appendChild(divider);

  card.appendChild(buildRow("&#9993;", user.email, true));
  card.appendChild(buildRow("&#9742;", user.phone, true));
  card.appendChild(buildRow("&#127760;", user.website, true));

  if (user.company && user.company.name) {
    const company = document.createElement("div");
    company.className = "user-card__company";
    const strong = document.createElement("strong");
    strong.textContent = user.company.name;
    const tagline = document.createElement("span");
    tagline.textContent = user.company.catchPhrase || "";
    company.appendChild(strong);
    company.appendChild(tagline);
    card.appendChild(company);
  }

  return card;
}

function buildRow(iconHtml, text, mono) {
  const row = document.createElement("div");
  row.className = "user-card__row";

  const icon = document.createElement("span");
  icon.className = "icon";
  icon.innerHTML = iconHtml;
  row.appendChild(icon);

  const value = document.createElement("span");
  if (mono) value.classList.add("mono");
  value.textContent = text || "Not provided";
  row.appendChild(value);

  return row;
}

function renderUsers(users) {
  userGrid.innerHTML = "";
  users.forEach((user) => userGrid.appendChild(createUserCard(user)));
}

async function loadUsers() {
  showState("loading");
  reloadBtn.classList.add("is-spinning");

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const users = await response.json();

    if (!Array.isArray(users) || users.length === 0) {
      showState("empty");
      return;
    }

    renderUsers(users);
    showState("data");
  } catch (error) {
    console.error("Failed to load users:", error);
    errorMessage.textContent =
      error.message === "Failed to fetch"
        ? "We couldn't reach the server. Check your internet connection and try again."
        : `Something went wrong while loading the directory (${error.message}).`;
    showState("error");
  } finally {
    reloadBtn.classList.remove("is-spinning");
  }
}

reloadBtn.addEventListener("click", loadUsers);
retryBtn.addEventListener("click", loadUsers);

document.addEventListener("DOMContentLoaded", loadUsers);