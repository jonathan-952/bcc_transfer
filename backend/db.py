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
            supabase.table('requirements.2')
            .select('program_id,requirement_id,courses,count,credits')
            .eq('program_id', program_id)
            .execute()
        )
        return res.data
    except Exception as e:
        print(e)
        
