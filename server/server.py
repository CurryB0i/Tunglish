from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from fastapi import HTTPException
from bcrypt import hashpw, gensalt
from dotenv import load_dotenv
import secrets
import os

load_dotenv()
app = FastAPI()
client = MongoClient(os.getenv("DATABSE_URL"))
db = client["main"]
userCollection = db["users"]
parallelCorpusCollection = db["parallel_corpus"]

app.add_middleware(
  CORSMiddleware,
  allow_origins=[
    "http://localhost:5500",
    "http://127.0.0.1:5500"
  ],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

class SecretUser(BaseModel):
  email: str
  password: str
  secret: str

class User(BaseModel):
  email: str
  password: str

class Entry(BaseModel):
  email: str
  token: str
  english: str
  tunglish: str

@app.get("/")
def read_root():
  return { "ok": True, "status_code": 200, "detail": "Hello World!" }

@app.post("/signup")
def signup(user: SecretUser):
  if user.secret != os.getenv("SECRET"): 
    raise HTTPException(status_code=401, detail="Unauthorized!")
  
  exists = userCollection.find_one({ "email": user.email })
  if exists:
    raise HTTPException(status_code=409, detail="User exists!")
  
  if not user.email.strip() or not user.password.strip():
    raise HTTPException(status_code=400, detail="Required field missing!")

  password = hashpw(user.password.encode('utf-8'), gensalt(10))
  user = userCollection.insert_one({ "email": user.email, "password": password })

  return { "ok": True, "status_code": 200, "message": "Authorized" }

from bcrypt import checkpw

@app.post("/login")
def login(user: User):
  if not user.email.strip() or not user.password.strip():
    raise HTTPException(status_code=400, detail="Required field missing!")

  existing = userCollection.find_one({ "email": user.email })

  if not existing:
    raise HTTPException(status_code=404, detail="User Not Found!")

  if not checkpw(user.password.encode('utf-8'), existing['password']):
    raise HTTPException(status_code=401, detail="Wrong Password!")
  
  token = secrets.token_hex(32)
  userCollection.update_one(
    { "email": user.email },
    { "$set": { "token": token } }
  )
  
  return { "ok": True, "token": token, "status_code": 200, "message": "Authorized" }

@app.post("/engToTung")
async def add_entry(entry: Entry):
  if not entry.email or not entry.token or \
     not entry.english.strip() or not entry.tunglish.strip():
    raise HTTPException(status_code=400, detail="Required fields missing!")
  
  existing = userCollection.find_one({ "email": entry.email })
  if not existing:
    raise HTTPException(status_code=401, detail="Unauthorized!")
  
  if entry.token != existing['token']:
    raise HTTPException(status_code=401, detail="Unauthorized!")

  parallelCorpusCollection.insert_one({ "english": entry.english, "tunglish": entry.tunglish })
  return { "ok": True, "status_code": 200, "message": "Entry added successfully"}
