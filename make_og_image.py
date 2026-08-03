#!/usr/bin/env python3
"""Build the link-preview image (Open Graph, 1200x630).

This is what people see when the site is shared on WhatsApp, LinkedIn or Facebook.
Without it, WhatsApp scrapes the page and picks an arbitrary image - which is why the
old plain bottle kept showing up. Run after changing product photography.
"""
import os
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "Images", "og-preview.jpg")
BOTTLE = os.path.join(HERE, "Images", "spray-15ml.png")

W, H = 1200, 630
INK = (20, 33, 29)
GREEN = (31, 122, 77)
MUTED = (107, 122, 115)
BG = (250, 252, 250)


def font(size, bold=False):
    for name in (("segoeuib.ttf", "arialbd.ttf") if bold else ("segoeui.ttf", "arial.ttf")):
        path = os.path.join("C:\\Windows\\Fonts", name)
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


canvas = Image.new("RGB", (W, H), BG)
draw = ImageDraw.Draw(canvas)

# soft brand band down the right, so the bottle sits on something
draw.rectangle([W - 430, 0, W, H], fill=(234, 245, 239))

# product shot, right side
if os.path.exists(BOTTLE):
    bottle = Image.open(BOTTLE).convert("RGBA")
    target_h = 520
    ratio = target_h / bottle.height
    bottle = bottle.resize((int(bottle.width * ratio), target_h), Image.LANCZOS)
    canvas.paste(bottle, (W - 430 + (430 - bottle.width) // 2, (H - target_h) // 2), bottle)

x, y = 72, 150
draw.text((x, y), "MintAura", font=font(78, True), fill=INK)
w = draw.textlength("MintAura", font=font(78, True))
draw.text((x + w + 8, y + 12), "®", font=font(30, True), fill=GREEN)

draw.text((x, y + 96), "Herbal Breath Freshener", font=font(34), fill=GREEN)
draw.text((x, y + 156), "Fresh Breath. Bold Confidence.", font=font(30, True), fill=INK)

draw.line([(x, y + 214), (x + 90, y + 214)], fill=GREEN, width=4)
draw.text((x, y + 238), "Touchless washroom dispensers for", font=font(25), fill=MUTED)
draw.text((x, y + 274), "restaurants, bars & offices in Mumbai", font=font(25), fill=MUTED)
draw.text((x, y + 330), "Free 1-week trial", font=font(27, True), fill=GREEN)

canvas.save(OUT, "JPEG", quality=88, optimize=True)
print(f"wrote {OUT}  ({os.path.getsize(OUT)//1024} KB, {W}x{H})")
