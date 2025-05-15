def is_safe_query(query):
    # Dummy filter for unsafe content
    banned = ["hack", "exploit", "bypass"]
    return not any(word in query.lower() for word in banned)
