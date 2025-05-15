import yaml

def get_all_topics():
    with open('data/topics.yaml', 'r') as f:
        topics = yaml.safe_load(f)
    return topics
