from PIL import Image, ImageDraw

WIDTH=500
HEIGHT=500

TEMPLATE_COLOR = 153
GUIDE_COLOR = 0


## line1 
im = Image.new('RGBA', (WIDTH, HEIGHT), (255, 255, 255, 0))
draw = ImageDraw.Draw(im)
draw.line([(100, HEIGHT/2), (WIDTH-100, HEIGHT/2)]
        , fill=(TEMPLATE_COLOR, 0, 0), width=3
        )
im.save('line1/template.png', "PNG")

im = Image.new('RGBA', (WIDTH, HEIGHT), (255, 255, 255, 0))
draw = ImageDraw.Draw(im)
draw.line([(99, HEIGHT/2), (101, HEIGHT/2)]
        , fill=(GUIDE_COLOR, 0, 0), width=3
        )
draw.line([(WIDTH-101, HEIGHT/2), (WIDTH-99, HEIGHT/2)]
        , fill=(GUIDE_COLOR, 0, 0), width=3
        )
im.save('line1/guide.png', "PNG")


## ellipse1
im = Image.new('RGBA', (WIDTH, HEIGHT), (255, 255, 255, 0))
draw = ImageDraw.Draw(im)
draw.ellipse([(100, 100), (WIDTH-100, HEIGHT-100)]
    , outline=(TEMPLATE_COLOR, 0, 0))
im.save('circle1/template.png', "PNG")

im = Image.new('RGBA', (WIDTH, HEIGHT), (255, 255, 255, 0))
draw = ImageDraw.Draw(im)
draw.rectangle([(100, 100), (WIDTH-100, HEIGHT-100)]
    , outline=(GUIDE_COLOR, 0, 0))
im.save('circle1/guide.png', "PNG")
