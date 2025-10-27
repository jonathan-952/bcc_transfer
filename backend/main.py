from fastapi import FastAPI
from db import db_connection, get_degree_id, get_degree_requirements
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv
from parser import parse_transcript
from course_matching import course_match

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

@app.get('/degree/{id}')
async def get_degree(id: int):
    
    return get_degree_id(supabase, id)

@app.get('/degree/{id}/requirements')
async def get_requirements(id: int):
    # take in transcript from client and pass to func
    res = get_degree_requirements(supabase, id)
    transcript_courses = parse_transcript('testfile.pdf')

    return course_match(res, transcript_courses)

    
    # extract courses from here