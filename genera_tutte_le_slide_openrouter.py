"""
Darflem — Generazione automatica di tutte le slide Flux.2 Pro via OPENROUTER
==============================================================================
Sostituisce la versione fal.ai: OpenRouter espone Flux.2 Pro con un'API
REST unificata diversa (POST /api/v1/images, non fal_client), quindi lo
script è stato riscritto da zero per questo endpoint.

Non generate qui (per scelta, vedi documenti):
  - Static01/Slide4 e Static03/Slide4 (badge "60 nights") -> fai in Canva/Figma
  - Static02/Slide3 (split screen) -> composito in post, vedi componi_slide3.py

SETUP
-----
1. pip install requests pillow
2. export OPENROUTER_API_KEY="la-tua-api-key-openrouter"
3. Metti la foto reale del prodotto Darflem in questa cartella con il nome
   darflem_bottiglia_originale.jpg (o modifica REFERENCE_IMAGE_PATH sotto)
4. python genera_tutte_le_slide_openrouter.py

COSTO
-----
Lo script traccia il costo REALE riga per riga (campo "usage.cost" che
OpenRouter restituisce in ogni risposta) e stampa il totale speso alla
fine. C'è anche un tetto di sicurezza opzionale (MAX_BUDGET_USD) che ferma
lo script se il budget stimato residuo non basta più.

La reference image viene ridimensionata automaticamente (vedi
MAX_REFERENCE_DIMENSION) prima di essere inviata, perché OpenRouter/Flux.2
Pro fattura l'input a $0.015/megapixel: una foto enorme non aggiunge
fedeltà utile ma costa di più a ogni chiamata.
"""

import base64
import os
from io import BytesIO
from pathlib import Path

import requests
from PIL import Image

# ============ CONFIGURAZIONE ============
REFERENCE_IMAGE_PATH = "darflem_bottiglia_originale.jpg"
OUTPUT_ROOT = Path("output_slides")
MODEL = "black-forest-labs/flux.2-pro"
IMAGE_SIZE = "1080x1920"          # pixel espliciti, come da documentazione OpenRouter
OUTPUT_FORMAT = "jpeg"
MAX_REFERENCE_DIMENSION = 2000    # px sul lato lungo, contiene il costo di input
MAX_BUDGET_USD = 12.0             # tetto di sicurezza, alza/abbassa a piacere

API_URL = "https://openrouter.ai/api/v1/images"


def load_reference_as_data_url(path: str) -> str:
    """Ridimensiona la reference (se serve) e la converte in base64 data URL,
    che OpenRouter accetta direttamente in input_references."""
    img = Image.open(path).convert("RGB")
    w, h = img.size
    longest = max(w, h)
    if longest > MAX_REFERENCE_DIMENSION:
        scale = MAX_REFERENCE_DIMENSION / longest
        img = img.resize((int(w * scale), int(h * scale)))
        print(f"Reference ridimensionata da {w}x{h} a {img.size[0]}x{img.size[1]} "
              f"(~{img.size[0]*img.size[1]/1_000_000:.2f} MP) per contenere il costo di input.")

    buf = BytesIO()
    img.save(buf, format="JPEG", quality=92)
    b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
    return f"data:image/jpeg;base64,{b64}"


def build_jobs(reference_data_url: str):
    return [
        # ---------------- STATIC 01 — "The Receipt" ----------------
        {"static": "static01", "slide": "slide1", "num_images": 4, "reference": False,
         "prompt": (
             "Vertical photograph, realistic bathroom counter bathed in warm morning "
             "sunlight entering from a window on the right side. The counter holds "
             "several half-used hair care products arranged naturally in a lived-in "
             "still-life composition: a thickening shampoo bottle, a volumizing mousse "
             "spray can, a small serum dropper bottle, a biotin supplement bottle — "
             "all generic unbranded packaging. Light marble or pale stone counter "
             "surface. Warm color palette dominated by beige (#F5F0E8) and amber "
             "(#C08552) tones. Soft natural shadows, shallow depth of field with "
             "sharp focus on the products in the foreground. Documentary-style "
             "lifestyle product photography, 35mm film aesthetic, photorealistic, "
             "high detail."
         )},
        {"static": "static01", "slide": "slide2", "num_images": 4, "reference": False,
         "prompt": (
             "Vertical photograph, extreme close-up of a crumpled white paper receipt "
             "resting on a marble bathroom counter. The receipt paper shows natural "
             "creases and a fine printed text texture, captured with the focus and "
             "scale that keeps the print soft and impressionistic rather than sharply "
             "legible. In the softly blurred background, indistinct rounded shapes "
             "suggest hair product bottles. Warm natural window light from the right "
             "casts gentle directional shadows. Shallow depth of field, documentary "
             "photography style, warm beige (#F5F0E8) and amber (#C08552) tones, "
             "intimate and quiet mood. Photorealistic, 35mm film aesthetic, high detail."
         )},
        {"static": "static01", "slide": "slide3", "num_images": 9, "reference": True,
         "prompt": (
             "Keep the glass bottle, the white dropper cap, and the pink-to-lavender "
             "marbled label with all its text and logo exactly as shown in the "
             "reference image, completely unchanged. Place the bottle centered on a "
             "minimal beige linen fabric surface (#F5F0E8). Add soft directional "
             "studio light from the left, creating gentle elegant shadows and generous "
             "negative space around the bottle. Premium apothecary product photography "
             "style, photorealistic, high detail, cinematic product photography look."
         )},
        # ---------------- STATIC 02 — "The Honest Label" ----------------
        {"static": "static02", "slide": "slide1", "num_images": 4, "reference": False,
         "prompt": (
             "Vertical photograph of a generic hair product bottle, kept intentionally "
             "soft and out of focus through shallow depth of field and gentle defocus, "
             "evoking vagueness and a lack of transparency. Generic clear or amber "
             "glass bottle with a plain white label. Warm natural lighting, "
             "documentary style, warm amber (#C08552) and beige (#F5F0E8) tones, "
             "understated slightly suspicious mood. Photorealistic, 35mm film "
             "aesthetic, no visible branding or logos."
         )},
        {"static": "static02", "slide": "slide2", "num_images": 9, "reference": True,
         "prompt": (
             "Keep the glass bottle, the white dropper cap, and the pink-to-lavender "
             "marbled label with all its text and logo exactly as shown in the "
             "reference image, completely unchanged. Reframe as an extreme close-up "
             "product shot with soft directional light from the left, shallow depth "
             "of field, premium apothecary aesthetic, photorealistic, high detail, "
             "cinematic look."
         )},
        # slide3 (split screen) volutamente esclusa: usa componi_slide3.py dopo slide1+slide2
        {"static": "static02", "slide": "slide4", "num_images": 4, "reference": False,
         "prompt": (
             "Vertical photograph, flat lay of natural ingredients on a dark wood "
             "surface: fresh rosemary sprigs, peppermint leaves, nettle leaves, small "
             "glass dishes with cold-pressed golden oils. Warm natural overhead "
             "lighting, editorial style. Clean, educational, honest aesthetic. "
             "Photorealistic, shallow depth of field, high detail."
         )},
        {"static": "static02", "slide": "slide5", "num_images": 6, "reference": True,
         "prompt": (
             "Keep the glass bottle, the white dropper cap, and the pink-to-lavender "
             "marbled label with all its text and logo exactly as shown in the "
             "reference image, completely unchanged. Center it on a minimal beige "
             "linen background (#F5F0E8), soft directional light from the left, "
             "elegant shadows, premium apothecary aesthetic, generous negative space "
             "around the bottle reserved for text overlay. Photorealistic, high "
             "detail, cinematic."
         )},
        # ---------------- STATIC 03 — "60 Nights Guarantee" ----------------
        {"static": "static03", "slide": "slide1", "num_images": 6, "reference": True,
         "prompt": (
             "Keep the glass bottle, the white dropper cap, and the pink-to-lavender "
             "marbled label with all its text and logo exactly as shown in the "
             "reference image, completely unchanged. Center it on a pure black "
             "background (#000000) with a single soft spotlight from above creating "
             "dramatic elegant shadows. Premium minimalist cinematic product "
             "photography, photorealistic, high detail."
         )},
        {"static": "static03", "slide": "slide2", "num_images": 8, "reference": True,
         "prompt": (
             "Close-up photograph of one hand with naturally proportioned fingers, "
             "holding the glass Darflem bottle at a slight tilt. Keep the bottle, "
             "white dropper cap, and marbled pink-to-lavender label exactly as shown "
             "in the reference image, unchanged. The hand applies two to three drops "
             "of golden oil onto a dry scalp along a natural hair part, captured "
             "mid-motion with deliberate slowness. Warm bathroom lighting, shallow "
             "depth of field with the bottle slightly softer in focus than the hand "
             "and scalp. Photorealistic, high detail, cinematic."
         )},
        {"static": "static03", "slide": "slide3", "num_images": 4, "reference": False,
         "prompt": (
             "Vertical photograph, flat lay of natural ingredients on a dark wood "
             "surface: fresh rosemary sprigs, peppermint leaves, nettle leaves, small "
             "glass dishes with cold-pressed golden oils. Warm natural overhead "
             "lighting, editorial style. Clean, educational, scientific but not "
             "sterile mood. Photorealistic, high detail."
         )},
        # slide4 (badge) volutamente esclusa: fai in Canva/Figma
        {"static": "static03", "slide": "slide5", "num_images": 6, "reference": True,
         "prompt": (
             "Keep the glass bottle, the white dropper cap, and the pink-to-lavender "
             "marbled label with all its text and logo exactly as shown in the "
             "reference image, completely unchanged. Center it on a pure black "
             "background (#000000) with a single soft spotlight from above. Premium "
             "minimalist cinematic aesthetic, photorealistic, high detail."
         )},
    ]


def generate_one_image(prompt: str, reference_data_url: str | None, api_key: str) -> dict:
    payload = {
        "model": MODEL,
        "prompt": prompt,
        "size": IMAGE_SIZE,
        "output_format": OUTPUT_FORMAT,
    }
    if reference_data_url:
        payload["input_references"] = [
            {"type": "image_url", "image_url": {"url": reference_data_url}}
        ]

    resp = requests.post(
        API_URL,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        json=payload,
        timeout=120,
    )
    resp.raise_for_status()
    return resp.json()


def run_job(job: dict, reference_data_url: str, api_key: str, spent_so_far: float) -> tuple[Path, float]:
    out_dir = OUTPUT_ROOT / job["static"] / job["slide"]
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"\n>>> Genero {job['static']}/{job['slide']} "
          f"({job['num_images']} varianti){' [con reference]' if job['reference'] else ''} ...")

    job_cost = 0.0
    for i in range(1, job["num_images"] + 1):
        if spent_so_far + job_cost > MAX_BUDGET_USD:
            print(f"    !! STOP: raggiunto MAX_BUDGET_USD (${MAX_BUDGET_USD:.2f}). "
                  f"Alza il tetto in cima allo script se vuoi continuare.")
            break

        ref = reference_data_url if job["reference"] else None
        try:
            result = generate_one_image(job["prompt"], ref, api_key)
        except requests.HTTPError as e:
            print(f"    !! errore variante {i}: {e} — {e.response.text[:300]}")
            continue

        img_data = result["data"][0]
        cost = result.get("usage", {}).get("cost", 0.0)
        job_cost += cost

        dest = out_dir / f"{job['static']}_{job['slide']}_v{i}.jpg"
        dest.write_bytes(base64.b64decode(img_data["b64_json"]))
        print(f"    salvato: {dest}  (costo: ${cost:.4f}, totale job finora: ${job_cost:.4f})")

    return out_dir, job_cost


def main():
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        raise SystemExit(
            "Errore: variabile d'ambiente OPENROUTER_API_KEY non impostata.\n"
            "Esegui prima: export OPENROUTER_API_KEY='...'"
        )

    if not Path(REFERENCE_IMAGE_PATH).exists():
        raise SystemExit(
            f"Errore: non trovo la foto prodotto '{REFERENCE_IMAGE_PATH}'.\n"
            "Mettila in questa cartella o modifica REFERENCE_IMAGE_PATH in cima al file."
        )

    reference_data_url = load_reference_as_data_url(REFERENCE_IMAGE_PATH)
    jobs = build_jobs(reference_data_url)

    total_images = sum(j["num_images"] for j in jobs)
    print(f"\nTotale slide-job: {len(jobs)} | Totale immagini pianificate: {total_images}")
    print(f"Tetto di sicurezza: ${MAX_BUDGET_USD:.2f}\n")

    total_spent = 0.0
    for job in jobs:
        _, job_cost = run_job(job, reference_data_url, api_key, total_spent)
        total_spent += job_cost
        print(f"    >> Speso totale finora: ${total_spent:.4f}")
        if total_spent >= MAX_BUDGET_USD:
            print("Tetto di sicurezza raggiunto, interrompo qui.")
            break

    print(f"\nFatto. Costo reale totale di questa run: ${total_spent:.4f}")
    print("Controlla la cartella output_slides/ per tutte le varianti generate.")
    print("Prossimi passi manuali:")
    print("  - Static01/Slide4, Static03/Slide4 (badge '60 nights'): falli in Canva/Figma")
    print("  - Static02/Slide3 (split screen): usa componi_slide3.py su slide1 + slide2")


if __name__ == "__main__":
    main()
