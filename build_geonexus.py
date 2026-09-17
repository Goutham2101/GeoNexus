# GeoNexus Full Project Generator
import os, json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def ensure_dirs():
    for d in ['css', 'js', 'assets/images', 'assets/icons', 'assets/models']:
        os.makedirs(os.path.join(BASE_DIR, d), exist_ok=True)
