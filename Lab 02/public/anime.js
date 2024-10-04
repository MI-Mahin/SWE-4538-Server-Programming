const params = new URLSearchParams(window.location.search);
const email = params.get("email");

document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch(`/api/anime?email=${encodeURIComponent(email)}`);
  const animeList = await response.json();

  const animeListElement = document.getElementById("animeList");
  animeList.forEach((anime, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
            ${anime.name} - ${anime.description || "No description"}
            <button onclick="editAnime(${index})">Edit</button>
        `;
    animeListElement.appendChild(listItem);
  });
});

async function editAnime(index) {
  const newDescription = prompt("Enter new description:");
  if (newDescription) {
    const response = await fetch("/api/anime/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, index, description: newDescription }),
    });

    if (response.ok) {
      alert("Description updated!");
      location.reload(); // Reload the page to update the list
    } else {
      alert("Error updating description.");
    }
  }
}

document.getElementById("logoutButton").addEventListener("click", () => {
  window.location.href = "/login.html"; // Implement logout functionality as needed
});
