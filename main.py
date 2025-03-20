from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI"}

@app.get("/ask")
def ask():
    return {"message": "This is the /ask endpoint"}
