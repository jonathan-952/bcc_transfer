from fastapi import FastAPI, UploadFile, File, Query
from db import db_connection, get_degree_id, get_degree_requirements, get_all_schools, get_school_majors, get_courses, get_group_requirements, get_single_requirements
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv
from parser import parse_transcript
from course_matching import course_match
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

origins = [
        "http://localhost:3000",
        "http://localhost:8080",
        'https://bcc-transfer-fe.vercel.app',
        'https://www.easiertransfer.tech'
    ]


class Courses(BaseModel):
    courses: List[str]
    review_courses: List[str]

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # List of allowed origins
    allow_credentials=True,  # Allow cookies and authorization headers
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers in the request
)

@app.get('/')
async def main():
    return {'message': 'yuh'}


@app.get('/degree/{id}')
async def get_degree(id: int):
    
    return get_degree_id(supabase, id)

@app.post('/degree/{id}/requirements')
async def get_requirements(id: int, transcript: UploadFile = File(...)):
    # take in transcript from client and pass to func
    res = get_degree_requirements(supabase, id)
    
    transcript_courses = await parse_transcript(transcript)

    res = course_match(res, transcript_courses)

    return res
    # extract courses from here

@app.get('/schools')
async def get_schools():
    res = get_all_schools(supabase)

    return res

@app.get('/schools/{selectedSchool}/majors')
async def get_majors(selectedSchool: int):
    res = get_school_majors(supabase, selectedSchool)

    return res

@app.post('/courses')
async def matched_courses(req: Courses):
    fulfilled = get_courses(supabase, req.courses)
    review = get_courses(supabase, req.review_courses)

    return [fulfilled, review]

@app.get('/unfulfilled')
async def get_unfulfilled_requirements(single: List[int] = Query(default = []), group: List[int] = Query(default = [])):
    group_requirements = get_group_requirements(supabase, group)
    single_requirements = get_single_requirements(supabase, single)

    return [group_requirements, single_requirements]