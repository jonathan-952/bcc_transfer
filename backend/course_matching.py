# fetch total credits for degree
# iterate through requirements:
    # if course fulfilled -> push course to fe and add to total credit count
    # if requirement courses null, skip

# need to fill in for electives
# unless course grade is less than C, label as unsure
def course_match(requirements, transcript_courses):
    fulfilled_courses = []
    used_courses = []
    t_course_list = [element['course_code'] for element in transcript_courses if element['TR'] != 1]

    # keep track of used transcript courses to avoid double counting
    # keep all logic the same but can remove used course from candidate pool directly

    group_requirements = [req for req in requirements if req['group_id']]
    group_requirements.sort(key = lambda req: req['group_id'])

    solo_requirements = [req for req in requirements if not req['group_id']]

    cur_fulfilled = 0
    cur_group = 0 if not len(group_requirements) else group_requirements[0]['group_id']

    # loop through group requirements
    for requirement in group_requirements:

        if cur_fulfilled >= requirement['group_count'] and requirement['group_count'] == cur_group:
            continue
        
        if cur_fulfilled >= requirement['group_count'] and requirement['group_count'] != cur_group:
            cur_group = requirement['group_count']
            cur_fulfilled = 0


        requirement_courses = [c.strip() for c in requirement['courses'].split(',')] if requirement['courses'] != None else []

        matched_courses = set(requirement_courses).intersection(set(t_course_list))
        matched_courses = [course for course in matched_courses if course not in used_courses]

        # if matched courses is over required count -> take smaller of the 2
        
        matched_count = min(requirement['count'] or 0, len(matched_courses))


        fulfilled = (matched_courses)[:matched_count]

        used_courses += fulfilled

        fulfilled_courses += fulfilled

        cur_fulfilled += 1


    # logic for solo requirements stays the same
    for requirement in solo_requirements:
        requirement_courses = [c.strip() for c in requirement['courses'].split(',')] if requirement['courses'] != None else []

        matched_courses = set(requirement_courses).intersection(set(t_course_list))
        matched_courses = [course for course in matched_courses if course not in used_courses]

        # if matched courses is over required count -> take smaller of the 2
        

        matched_count = min(requirement['count'] or 0, len(matched_courses))


        fulfilled = (matched_courses)[:matched_count]

        used_courses += fulfilled

        fulfilled_courses += fulfilled
    return {
        'courses' : fulfilled_courses,
        # label as review if either transfer or not directly in requirements, can still fulfill elective
        'review' : [element['course_code'] for element in transcript_courses if element['TR'] == 1 or element['course_code'] not in fulfilled_courses]
    }

# 2 arrays: grouped requirements and solo

# for group requirements:
#   if requirement fulfilled:
#       add to group count
#       mark course(s) as used
#   if group count reached:
#       break loop, move onto next group


        


