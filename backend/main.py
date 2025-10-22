from fastapi import FastAPI
import backend.db as db
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

    supabase = db.db_connection(db_url, db_key)
    yield
    
        
app = FastAPI(lifespan=lifespan)

@app.get('/')
async def main():
    return 

@app.get('/degree/${id}')
async def get_degree(id: int):
    
    return db.get_degree(supabase, id)

