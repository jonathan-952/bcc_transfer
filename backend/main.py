from fastapi import FastAPI
from db import db_connection, get_degree_id, get_degree_requirements, get_all_schools, get_school_majors
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv
from parser import parse_transcript
from course_matching import course_match


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
    return {'message': 'yuh'}


@app.get('/degree/{id}')
async def get_degree(id: int):
    
    return get_degree_id(supabase, id)

@app.get('/degree/{id}/requirements')
async def get_requirements(id: int, transcript):
    # take in transcript from client and pass to func
    res = get_degree_requirements(supabase, id)
    transcript_courses = parse_transcript(transcript)

    return course_match(res, transcript_courses)
    # extract courses from here

@app.get('/schools')
async def get_schools():
    res = get_all_schools(supabase)

    return res

@app.get('/schools/{selectedSchool}/majors')
async def get_majors(selectedSchool: int):
    res = get_school_majors(supabase, selectedSchool)

    return res