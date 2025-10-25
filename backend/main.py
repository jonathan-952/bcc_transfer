from fastapi import FastAPI
from db import db_connection, get_degree
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

    db_url = os.getenv("DB_URL")
    db_key = os.getenv('DB_KEY')

    supabase = db_connection(db_url, db_key)
    yield
    
        
app = FastAPI(lifespan=lifespan)

@app.get('/')
async def main():
    return {"message": "works"}

@app.get('/degree/${id}')
async def get_degree(id: int):
    
    return get_degree(supabase, id)

