# fetch total credits for degree
# iterate through requirements:
    # if course fulfilled -> push course to fe and add to total credit count
    # if requirement courses null, skip

# on fe display courses 


def course_match(requirements, transcript_courses):
    total_credits = 0
    courses = []
    for requirement in requirements:
        course_list = [element['course_code'] for element in transcript_courses]
        requirement_courses = set(requirement['courses']).intersection(set(course_list))
        total_credits += min(requirement['count'], len(requirement_courses)) * requirement['credits']
        matched_count = min(requirement['count'], len(requirement_courses))
        courses += list(requirement_courses)[:matched_count]

    return {
        'total_credits': total_credits,
        'courses' : courses
    }



        


