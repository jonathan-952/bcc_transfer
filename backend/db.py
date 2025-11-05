from supabase import create_client, Client

def db_connection(key: str, url: str):
    supabase: Client = create_client(url, key)

    return supabase

def get_degree_id(supabase, program_id):
    try:
        res = (
            supabase.table('programs')
            .select('total_credits', 'program_id')
            .eq('program_id', program_id)
            .execute()
        )
        return res.data
    except Exception as e: 
        print(e)

def get_degree_requirements(supabase, program_id):
    try:
        res = (
            supabase.table('requirements')
            .select('program_id,requirement_id,courses,count,credits, group_id, group_count')
            .eq('program_id', program_id)
            .execute()
        )
        return res.data
    except Exception as e:
        print(e)

def get_all_schools(supabase):
    try:
        res = (
            supabase.table('schools')
            .select('school_id, school_name')
            .execute()
        )
        return res.data
    except Exception as e: 
        print(e)
        
def get_school_majors(supabase, school_id):
    try:
        res = (
            supabase.table('programs')
            .select('program_name, school_id, total_credits, program_id')
            .eq('school_id', school_id)
            .execute()
        )
        return res.data
    except Exception as e:
        print(e)

def get_courses(supabase, courses):
    try:
        res = (
            supabase.table('courses')
            .select('course_code, course_title, credits')
            .in_('course_code', courses)
            .execute()
        )
        return res.data
    except Exception as e:
        print(e)