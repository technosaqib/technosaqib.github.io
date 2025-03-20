from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ Fix: Allow GitHub Pages to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to ["https://technosaqib.github.io"] for better security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to Technosaqib AI API"}

@app.post("/ask")
async def ask(request: Request):
    data = await request.json()
    question = data.get("question", "")

    # Your AI logic (replace with actual AI processing)
    response = f"AI Response: You asked '{question}'"

    return {"message": response}