from fastapi import FastAPI, Request
import logging
import uvicorn

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    filename="access.log",
    filemode="a"
)

app = FastAPI()

@app.post("/")
async def log_post(request: Request):
    data = await request.body()
    logging.info(f"POST: {request.client.host}, DATA: {data.decode(errors='replace')}")
    return {"status": "ok"}

@app.get("/")
async def log_get(request: Request):
    logging.info(f"GET: {request.client.host}")
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run("app:app", host="localhost", port=8000, reload=False)