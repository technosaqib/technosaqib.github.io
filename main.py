from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Message(BaseModel):
    text: str

@app.get("/")
def home():
    return {"message": "API is running"}

@app.post("/chat")
def chat(message: Message):
    return {"reply": f"You said: {message.text}"}
