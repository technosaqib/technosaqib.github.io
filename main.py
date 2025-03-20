from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ Fix CORS to allow GitHub Pages to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use ["https://technosaqib.github.io"] for security
    allow_credentials=True,
    allow_methods=["*"],  # ✅ Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to Technosaqib AI API"}

# ✅ Ensure this endpoint allows POST requests
@app.post("/ask")
async def ask(request: Request):
    try:
        data = await request.json()  # ✅ Read JSON data from request
        question = data.get("question", "")

        if not question:
            return {"message": "Please provide a question."}

        # ✅ Your AI logic (replace this with actual AI response)
        response = f"AI Response: You asked '{question}'"

        return {"message": response}

    except Exception as e:
        return {"error": f"Failed to process request: {str(e)}"}