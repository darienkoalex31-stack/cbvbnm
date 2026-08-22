"""
Darflem — Static02 "The Honest Label" — composito Slide 3 (split screen)
==========================================================================
Non è una generazione Flux: prende la Slide 1 (bottiglia generica sfocata)
e la Slide 2 (bottiglia Darflem nitida) già generate, e le impila con una
linea divisoria, come descritto nel documento Static02 v2 ESECUTIVO.

USO
---
pip install pillow

python componi_slide3.py \
  --top output_slides/static02/slide1/static02_slide1_v1.jpg \
  --bottom output_slides/static02/slide2/static02_slide2_v1.jpg \
  --out output_slides/static02/slide3/static02_slide3_final.jpg

Scegli manualmente quali varianti di slide1/slide2 usare come top/bottom
prima di lanciare lo script (dopo lo Step 3 - Selezione del workflow).
"""

import argparse

from PIL import Image, ImageDraw

FINAL_WIDTH = 1080
FINAL_HEIGHT = 1920
HALF_HEIGHT = FINAL_HEIGHT // 2
DIVIDER_COLOR = (212, 212, 212)  # #D4D4D4, come da documento
DIVIDER_THICKNESS = 4


def crop_to_half(img_path: str) -> Image.Image:
    img = Image.open(img_path).convert("RGB")
    img = img.resize((FINAL_WIDTH, FINAL_HEIGHT))
    top = (FINAL_HEIGHT - HALF_HEIGHT) // 2
    return img.crop((0, top, FINAL_WIDTH, top + HALF_HEIGHT))


def main():
    parser = argparse.ArgumentParser(description="Componi la Slide 3 split-screen di Static02")
    parser.add_argument("--top", required=True, help="Immagine Slide 1 (bottiglia generica sfocata)")
    parser.add_argument("--bottom", required=True, help="Immagine Slide 2 (bottiglia Darflem nitida)")
    parser.add_argument("--out", required=True, help="Percorso file di output")
    args = parser.parse_args()

    top_half = crop_to_half(args.top)
    bottom_half = crop_to_half(args.bottom)

    canvas = Image.new("RGB", (FINAL_WIDTH, FINAL_HEIGHT), "white")
    canvas.paste(top_half, (0, 0))
    canvas.paste(bottom_half, (0, HALF_HEIGHT))

    draw = ImageDraw.Draw(canvas)
    y = HALF_HEIGHT
    draw.rectangle(
        [0, y - DIVIDER_THICKNESS // 2, FINAL_WIDTH, y + DIVIDER_THICKNESS // 2],
        fill=DIVIDER_COLOR,
    )

    canvas.save(args.out, quality=95)
    print(f"Salvato: {args.out}")


if __name__ == "__main__":
    main()
