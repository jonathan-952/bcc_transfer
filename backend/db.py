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

def get_single_requirements(supabase, requirements):
    if not requirements:
        return []
    try:
        res = (
            supabase.table('requirements')
            .select('requirement_id, courses, credits')
            .in_('requirement_id', requirements)
            .not_.is_("courses", 'null')
            .execute()
        )
        return res.data
    except Exception as e:
        print(e)


def get_group_requirements(supabase, requirements):
    if not requirements:
        return []
    try:
        res = (
            supabase.table('requirements')
            .select('courses, credits, group_id, group_count')
            .in_('group_id', requirements)
            .not_.is_("courses", 'null')
            .execute()
        )
        ordered = {}
        [ordered.setdefault(row["group_id"], []).append(row) for row in res.data]
        groups = [
            {
                "group_id": gid,
                "groups": [
                    {
                        "courses": item["courses"],
                        "credits": item["credits"],
                        "group_count": item["group_count"],
                    }
                    for item in items
                ],
                "total": len(items),
            }
            for gid, items in ordered.items()
        ]

        return groups
    except Exception as e:
        print(e)