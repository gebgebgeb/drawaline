from PIL import Image, ImageDraw
import os
import numpy as np
import json

WIDTH=500
HEIGHT=500

TEMPLATE_COLOR = (153, 0, 0)
GUIDE_COLOR = (0, 0, 0)
BG_COLOR = (255, 255, 255, 0)

[(100, HEIGHT/2), (WIDTH-100, HEIGHT/2)]

DATA_DIR = 'public/templates'

def draw_point(draw, location, radius, color):
    bounding_rectangle = (location[0]-radius, location[1]-radius
            , location[0]+radius, location[1]+radius)
    draw.ellipse(bounding_rectangle
        , fill=color
        , outline=None
        )

def make_line_template(title, endpoint1, endpoint2):
    dirname = ''.join(title.split()).lower()
    out_dir = os.path.join(DATA_DIR, dirname)
    if not os.path.exists(out_dir):
        os.mkdir(out_dir)
    im = Image.new('RGBA', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(im)
    draw.line([tuple(endpoint1), tuple(endpoint2)]
            , fill=TEMPLATE_COLOR
            , width=3
            )
    im.save(os.path.join(out_dir, 'template.png'), "PNG")

    im = Image.new('RGBA', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(im)
    draw_point(draw, endpoint1, 2, GUIDE_COLOR)
    draw_point(draw, endpoint2, 2, GUIDE_COLOR)
    im.save(os.path.join(out_dir, 'guide.png'), "PNG")

    with open(os.path.join(out_dir, 'metadata.json'), 'w') as f:
        json.dump({'instructions': 'Draw the line between the two points'
            , 'title': title
            , 'subcollection': 'Lines'
            }, f)

center = np.array([WIDTH/2, HEIGHT/2])
angles = np.array([0, 1/4, 1/2, 3/4]) * np.pi
offsets = [230*np.array([np.cos(angle), np.sin(angle)]) for angle in angles]
for i, o in enumerate(offsets):
    make_line_template('Line %d' % i, center-o, center+o)

## ellipse1
im = Image.new('RGBA', (WIDTH, HEIGHT), (255, 255, 255, 0))
draw = ImageDraw.Draw(im)
draw.ellipse([(100, 100), (WIDTH-100, HEIGHT-100)]
    , outline=TEMPLATE_COLOR)
im.save(os.path.join(DATA_DIR, 'circle1/template.png'), "PNG")

im = Image.new('RGBA', (WIDTH, HEIGHT), (255, 255, 255, 0))
draw = ImageDraw.Draw(im)
draw.rectangle([(100, 100), (WIDTH-100, HEIGHT-100)]
    , outline=GUIDE_COLOR)
im.save(os.path.join(DATA_DIR, 'circle1/guide.png'), "PNG")

with open(os.path.join(DATA_DIR, 'circle1/metadata.json'), 'w') as f:
    json.dump({'instructions': 'Draw the circle bounded by the square'}, f)
