document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("ask-form");
    const questionInput = document.getElementById("question");
    const responseDiv = document.getElementById("response");

    // Change this URL to your deployed Render API
    const API_URL = "https://technosaqib-github-io.onrender.com/ask";

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        const question = questionInput.value.trim();

        if (question === "") {
            responseDiv.innerHTML = "<p>Please enter a question.</p>";
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ question: question }),
            });

            if (!response.ok) {
                throw new Error("Server error. Please try again.");
            }

            const data = await response.json();
            responseDiv.innerHTML = `<p><strong>AI Response:</strong> ${data.message}</p>`;
        } catch (error) {
            responseDiv.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    });
});