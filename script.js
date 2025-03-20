document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("ask-form");
    const questionInput = document.getElementById("question");
    const responseDiv = document.getElementById("response");

    // Your deployed AI API on Render
    const API_URL = "https://technosaqib-github-io.onrender.com/ask";

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent page reload

        const question = questionInput.value.trim();
        if (question === "") {
            responseDiv.innerHTML = "<p>Please enter a question.</p>";
            return;
        }

        responseDiv.innerHTML = "<p>⏳ Asking AI...</p>"; // Loading message

        try {
            console.log("Sending request to API URL:", API_URL);
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ question: question }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Received data from API:", data);
            responseDiv.innerHTML = `<p><strong>AI Response:</strong> ${data.message}</p>`;
        } catch (error) {
            console.error("Fetch error:", error); // Log the error to the console
            responseDiv.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    });
});