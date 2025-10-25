from fastapi import FastAPI
from db import db_connection, get_degree_id
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

# api endpoints:
#   fetch a degree by id
#   fetch all requirements by degree id
#   fetch courses by requirement id
# 


supabase = None
@asynccontextmanager
async def lifespan(app: FastAPI):

    global supabase
    load_dotenv()

    DB_URL = os.getenv("DB_URL", "")
    DB_KEY = os.getenv('DB_KEY', "")
    try:
        supabase = db_connection(DB_KEY, DB_URL)
    except Exception as e:
        print(e)
    yield
    
        
app = FastAPI(lifespan=lifespan)

@app.get('/')
async def main():
    return {"message": "works"}

@app.get('/degree/{id}')
async def get_degree(id: int):
    
    return get_degree_id(supabase, id)

