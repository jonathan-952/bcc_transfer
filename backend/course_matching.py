# fetch total credits for degree
# iterate through requirements:
    # if course fulfilled -> push course to fe and add to total credit count
    # if requirement courses null, skip

# need to fill in for electives
# unless course grade is less than C, label as unsure
def course_match(requirements, transcript_courses):
    fulfilled_courses = []
    unfulfilled_requirements = []
    unfulfilled_group_requirements = []
    used_courses = []
    t_course_list = [element['course_code'] for element in transcript_courses if element['TR'] != 1]

    # keep track of used transcript courses to avoid double counting
    # keep all logic the same but can remove used course from candidate pool directly

    group_requirements = [req for req in requirements if req['group_id']]
    group_requirements.sort(key = lambda req: req['group_id'])

    solo_requirements = [req for req in requirements if not req['group_id']]

    cur_fulfilled = 0
    cur_group = 0 if not len(group_requirements) else group_requirements[0]['group_id']
    last_group_count = None if not len(group_requirements) else group_requirements[-1]['group_count']

    # loop through group requirements
    for requirement in group_requirements:

        if cur_fulfilled >= requirement['group_count'] and requirement['group_id'] == cur_group:
            continue

        if cur_fulfilled < requirement['group_count'] and requirement['group_id'] != cur_group:
            unfulfilled_group_requirements.append(cur_group)

        if requirement['group_id'] != cur_group:
            cur_group = requirement['group_id']
            cur_fulfilled = 0

        requirement_courses = [c.strip() for c in requirement['courses'].split(',')] if requirement['courses'] != None else []

        matched_courses = set(requirement_courses).intersection(set(t_course_list))
        matched_courses = [course for course in matched_courses if course not in used_courses]

        # if matched courses is over required count -> take smaller of the 2
        
        matched_count = min(requirement['count'] or 0, len(matched_courses))

        if matched_count:
            fulfilled = (matched_courses)[:matched_count]

            used_courses += fulfilled

            fulfilled_courses += fulfilled

            cur_fulfilled += 1

    if cur_group and last_group_count and cur_fulfilled < last_group_count:
        unfulfilled_group_requirements.append(cur_group)


    # logic for solo requirements stays the same
    for requirement in solo_requirements:
        requirement_courses = [c.strip() for c in requirement['courses'].split(',')] if requirement['courses'] != None else []

        matched_courses = set(requirement_courses).intersection(set(t_course_list))
        matched_courses = [course for course in matched_courses if course not in used_courses]

        # if matched courses is over required count -> take smaller of the 2
        

        matched_count = min(requirement['count'] or 0, len(matched_courses))

        if not matched_count:
            unfulfilled_requirements.append(requirement['requirement_id'])


        fulfilled = (matched_courses)[:matched_count]

        used_courses += fulfilled

        fulfilled_courses += fulfilled

    return {
        'courses' : fulfilled_courses,
        # label as review if either transfer or not directly in requirements, can still fulfill elective
        'review' : [element['course_code'] for element in transcript_courses if element['TR'] == 1 or element['course_code'] not in fulfilled_courses],
        'unfulfilled' : unfulfilled_requirements,
        'unfulfilled_group' : unfulfilled_group_requirements
    }

# 2 arrays: grouped requirements and solo

# for group requirements:
#   if requirement fulfilled:
#       add to group count
#       mark course(s) as used
#   if group count reached:
#       break loop, move onto next group


        


