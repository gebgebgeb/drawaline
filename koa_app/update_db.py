from pymongo import MongoClient
import os
import json

client = MongoClient('localhost', 27017)
db = client.drawing_dev
templates = db.templates

TEMPLATES_DIR = 'public/templates'
for template_dirname in os.listdir(TEMPLATES_DIR):
    full_template_dir = os.path.join(TEMPLATES_DIR, template_dirname)
    if os.path.isdir(full_template_dir):
        replace = True
        query = {'dirname': template_dirname}
        template = templates.find_one(query)
        if template is None:
            template = {'dirname': template_dirname}
            replace = False
        with open(os.path.join(full_template_dir, 'metadata.json'),'r') as f:
            metadata = json.load(f)
        for key, value in metadata.items():
            template[key] = value
        if replace:
            templates.replace_one(query, template)
        else:
            templates.insert_one(template)
