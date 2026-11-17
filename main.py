from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from datetime import datetime
import os


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

client = MongoClient(os.environ["MONGO_URI"])
db = client["ISIS2304E13202620"]

@app.get("/")
def inicio():
    return {"Estado": "API funcionando correctamente"}


@app.get("/listings")
def get_listings():
    return list(db.listings.find({}, {"_id":0}))


@app.get("/listings/{id_listing}")
def get_listing_by_id(id_listing: int):
    listing = db.listings.find_one({"_id": id_listing}, {"_id":0})
    return listing or {}


@app.post("/listings")
def post_listing(datos:dict):
    datos["created_at"] = datetime.now().isoformat
    db.listings.insert_one(datos)
    return {"message": "Listing created"} 