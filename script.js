const apiKeys = {
    chatGPT: "sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    huggingFace: "hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    gemini: "AIzaSyxxxxxxxxxxxxxxxxxxxxxxxx"
};

let questions = [
    { question: "Is your character fictional?", answers: ["yes", "no"], next: ["Is from book?", "Is historical?"] },
    { question: "Is from book?", answers: ["yes", "no"], next: ["Is hero?", "Is villain?"] },
    { question: "Is hero?", answers: ["yes", "no"], next: ["Is male?", "Is female?"] },
    { question: "Is male?", answers: ["yes", "no"], next: ["Does have powers?", "Is normal?"] },
    { question: "Does have powers?", answers: ["yes", "no"], next: ["Is from Marvel?", "Is from DC?"] }
];

let currentQuestion = 0;

function startGame() {
    document.getElementById("gameArea").style.display = "block";
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion >= questions.length) {
        getAIResponse();
        return;
    }

    let nextQ = questions[currentQuestion].question;
    document.getElementById("gameArea").innerHTML = `
        <p>${nextQ}</p>
        <input type='radio' id='yes' name='answer' value='yes' onclick='nextQuestion()'>
        <label for='yes'>Yes</label>
        <input type='radio' id='no' name='answer' value='no' onclick='nextQuestion()'>
        <label for='no'>No</label>
    `;
}

// AI API Call
async function getAIResponse() {
    let input = "Based on the answers given, guess the character:";
    
    let url = "https://api.openai.com/v1/chat/completions";
    let headers = { "Authorization": `Bearer ${apiKeys.chatGPT}`, "Content-Type": "application/json" };
    let body = JSON.stringify({ model: "gpt-4", messages: [{ role: "user", content: input }], max_tokens: 100 });

    try {
        let response = await fetch(url, { method: "POST", headers, body });
        let data = await response.json();

        document.getElementById("gameArea").innerHTML = `
            <p><strong>AI Guess:</strong> ${data.choices[0]?.message?.content || "No guess available!"}</p>
        `;
    } catch (error) {
        document.getElementById("gameArea").innerHTML = `<p>Error fetching AI response!</p>`;
    }
}