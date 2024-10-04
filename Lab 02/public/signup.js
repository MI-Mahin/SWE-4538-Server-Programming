document
  .getElementById("signupForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const favoriteAnimeInput = document.getElementById("favoriteAnime").value;

    // Split the favorite anime input into an array
    const favoriteAnime = favoriteAnimeInput.split(",").map((anime) => ({
      name: anime.trim(),
      description: "", // Initially no description
    }));

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, favoriteAnime }),
    });

    if (response.ok) {
      window.location.href = "/login.html";
    } else {
      alert("Error signing up.");
    }
  });
