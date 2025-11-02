# fetch total credits for degree
# iterate through requirements:
    # if course fulfilled -> push course to fe and add to total credit count
    # if requirement courses null, skip

# need to fill in for electives
# unless course grade is less than C, label as unsure
def course_match(requirements, transcript_courses):
    print('requirements: ',requirements)
    print('transcript: ', transcript_courses)
    total_credits = 0
    courses = []
    t_course_list = [element['course_code'] for element in transcript_courses if element['TR'] != 1]


    for requirement in requirements:
        requirement_courses = [c.strip() for c in requirement['courses'].split(',')] if requirement['courses'] != None else []

        matched_courses = set(requirement_courses).intersection(set(t_course_list))

        # if matched courses is over required count -> take min
        total_credits += min(requirement['count'] or 0, len(matched_courses)) * (requirement['credits'] or 0)

        matched_count = min(requirement['count'] or 0, len(matched_courses))
        courses += list(matched_courses)[:matched_count]
    return {
        'total_credits': total_credits,
        'courses' : courses,
        # label as review if either transfer or not directly in requirements, can still fulfill elective
        'review' : [element['course_code'] for element in transcript_courses if element['TR'] == 1 or element['course_code'] not in courses]
    }



        


