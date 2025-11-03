# fetch total credits for degree
# iterate through requirements:
    # if course fulfilled -> push course to fe and add to total credit count
    # if requirement courses null, skip

# need to fill in for electives
# unless course grade is less than C, label as unsure
def course_match(requirements, transcript_courses):
    total_credits = 0
    courses = []
    used_courses = []
    t_course_list = [element['course_code'] for element in transcript_courses if element['TR'] != 1]

    # keep track of used transcript courses to avoid double counting
    # keep all logic the same but can remove used course from candidate pool directly

    for requirement in requirements:
        requirement_courses = [c.strip() for c in requirement['courses'].split(',')] if requirement['courses'] != None else []

        matched_courses = set(requirement_courses).intersection(set(t_course_list))
        matched_courses = [course for course in matched_courses if course not in used_courses]

        # if matched courses is over required count -> take smaller of the 2
        

        matched_count = min(requirement['count'] or 0, len(matched_courses))


        fulfilled = (matched_courses)[:matched_count]


        total_credits += matched_count * (requirement['credits'] or 0)

        used_courses += fulfilled

        courses += fulfilled
    return {
        'total_credits': total_credits,
        'courses' : courses,
        # label as review if either transfer or not directly in requirements, can still fulfill elective
        'review' : [element['course_code'] for element in transcript_courses if element['TR'] == 1 or element['course_code'] not in courses]
    }



        


