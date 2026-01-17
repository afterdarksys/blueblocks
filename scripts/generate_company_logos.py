#!/usr/bin/env python3
"""
Company Logo Generator using fal.ai
Generates logos for After Dark Systems brands
"""

import os
import sys
import json
import time
import requests
from pathlib import Path

# fal.ai API configuration
FAL_API_KEY = "123816ab-599b-4784-882c-6c14888d1788:03e39cce07aeca9e061017440a16a868"
FAL_API_URL = "https://fal.run/fal-ai/flux-pro/v1.1"

# Output directory
OUTPUT_DIR = Path(__file__).parent.parent / "brand-assets" / "companies"

# Company logo prompts
COMPANIES = {
    "afterdarksystems": [
        {
            "name": "ads-logo-main",
            "prompt": "Professional technology company logo for 'After Dark Systems', dark theme, sleek crescent moon integrated with circuit board patterns, deep purple and electric blue gradient, subtle stars, minimalist modern design, tech startup aesthetic, pure black background, vector style, centered",
            "size": "square_hd"
        },
        {
            "name": "ads-logo-light",
            "prompt": "Professional technology company logo for 'After Dark Systems', dark crescent moon with glowing edges integrated with circuit traces, deep purple #4A0080 and blue #00A3E0 accents, minimalist modern design, tech company aesthetic, pure white background, vector style flat design, centered",
            "size": "square_hd"
        },
        {
            "name": "ads-icon",
            "prompt": "Minimalist app icon, stylized crescent moon made of circuit board traces, glowing purple and blue edges, dark tech aesthetic, suitable for favicon, pure black background, simple geometric, no text",
            "size": "square_hd"
        },
        {
            "name": "ads-mascot",
            "prompt": "Friendly 3D owl mascot character with glowing purple eyes, wearing tiny headphones, feathers made of circuit patterns, tech-savvy nocturnal creature, soft purple and blue lighting, Pixar style 3D render, dark gradient background, After Dark Systems tech mascot",
            "size": "square_hd"
        },
    ],
    "onedns": [
        {
            "name": "onedns-logo-main",
            "prompt": "Modern DNS service company logo, large stylized number '1' integrated with globe/network lines, clean blue #0066CC and green #00CC66 gradient, technology networking aesthetic, minimalist flat design, pure white background, vector style, professional SaaS branding",
            "size": "square_hd"
        },
        {
            "name": "onedns-logo-dark",
            "prompt": "Modern DNS service company logo, large stylized number '1' integrated with globe/network connection lines, glowing blue and green neon accents, technology networking aesthetic, minimalist design, pure black background, vector style",
            "size": "square_hd"
        },
        {
            "name": "onedns-icon",
            "prompt": "Minimalist app icon, stylized number '1' with small globe or network node integrated, blue and green gradient, suitable for favicon, clean geometric design, white background, no text",
            "size": "square_hd"
        },
        {
            "name": "onedns-hero",
            "prompt": "Wide banner image showing global DNS network visualization, glowing blue connection lines spanning 3D Earth globe, data packets flowing, futuristic network infrastructure concept, dark space background with blue and green accents, cinematic 3D render",
            "size": "landscape_16_9"
        },
    ],
    "dnsscience": [
        {
            "name": "dnsscience-logo-main",
            "prompt": "Scientific DNS research company logo, DNA double helix morphing into network nodes and connection lines, laboratory science meets technology, teal #008080 and white color scheme, clean modern design, pure white background, vector style, research institution aesthetic",
            "size": "square_hd"
        },
        {
            "name": "dnsscience-logo-dark",
            "prompt": "Scientific DNS research company logo, glowing DNA helix transforming into network topology, teal and cyan neon glow, science meets technology fusion, dark background, modern minimalist design, vector style",
            "size": "square_hd"
        },
        {
            "name": "dnsscience-icon",
            "prompt": "Minimalist app icon, stylized DNA helix combined with network node symbol, teal color, scientific technology aesthetic, suitable for favicon, white background, simple geometric, no text",
            "size": "square_hd"
        },
        {
            "name": "dnsscience-lab",
            "prompt": "Futuristic DNS research laboratory scene, holographic displays showing DNS query visualizations and network graphs, scientists analyzing data, glowing teal and blue interfaces, high-tech research facility, cinematic 3D render, dark ambient lighting",
            "size": "landscape_16_9"
        },
    ],
    "veribits": [
        {
            "name": "veribits-logo-main",
            "prompt": "Verification and security company logo, checkmark symbol integrated with binary code pattern or blockchain blocks, trustworthy green #00AA44 and blue color scheme, clean professional design, fintech security aesthetic, pure white background, vector style",
            "size": "square_hd"
        },
        {
            "name": "veribits-logo-dark",
            "prompt": "Verification and security company logo, glowing checkmark with binary digits flowing around it, green and blue neon accents, blockchain verification concept, dark background, modern minimalist design, vector style",
            "size": "square_hd"
        },
        {
            "name": "veribits-icon",
            "prompt": "Minimalist app icon, stylized checkmark made of small squares/bits, green color, verification security aesthetic, suitable for favicon, white background, simple geometric, no text",
            "size": "square_hd"
        },
        {
            "name": "veribits-shield",
            "prompt": "3D security shield with checkmark in center, digital verification concept, binary code patterns flowing around shield, green and blue glow, blockchain verification technology, dark gradient background, premium 3D render",
            "size": "square_hd"
        },
    ],
    "darkapi": [
        {
            "name": "darkapi-logo-main",
            "prompt": "Developer API platform logo, stylized angle brackets < > or curly braces containing lightning bolt, dark purple #6B21A8 and electric blue accents, code developer aesthetic, modern tech startup design, pure black background, vector style, hacker aesthetic",
            "size": "square_hd"
        },
        {
            "name": "darkapi-logo-light",
            "prompt": "Developer API platform logo, stylized code brackets with lightning bolt or pulse line, dark purple and blue gradient, modern developer tools aesthetic, clean design, pure white background, vector style flat design",
            "size": "square_hd"
        },
        {
            "name": "darkapi-icon",
            "prompt": "Minimalist app icon, stylized angle brackets < > or API symbol, dark purple with blue accent, developer tools aesthetic, suitable for favicon, black background, simple geometric, no text",
            "size": "square_hd"
        },
        {
            "name": "darkapi-code",
            "prompt": "Developer workspace scene, multiple holographic code windows floating in dark space, API endpoints and JSON data visualized, purple and blue neon glow, cyberpunk developer aesthetic, dark atmospheric background, cinematic 3D render",
            "size": "landscape_16_9"
        },
    ],
}


def generate_image(prompt: str, name: str, company: str, size: str = "square_hd") -> str:
    """Generate a single image using fal.ai API"""

    headers = {
        "Authorization": f"Key {FAL_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "prompt": prompt,
        "image_size": size,
        "num_inference_steps": 28,
        "guidance_scale": 3.5,
        "num_images": 1,
        "safety_tolerance": "5",
    }

    print(f"  Generating {name}...")

    try:
        response = requests.post(FAL_API_URL, headers=headers, json=payload, timeout=120)

        if response.status_code != 200:
            print(f"  Error: {response.status_code} - {response.text[:200]}")
            return None

        result = response.json()

        if "images" in result and len(result["images"]) > 0:
            image_url = result["images"][0].get("url")
            if image_url:
                output_path = OUTPUT_DIR / company / f"{name}.png"
                print(f"  Downloading to {output_path}...")

                img_response = requests.get(image_url, timeout=60)
                if img_response.status_code == 200:
                    with open(output_path, "wb") as f:
                        f.write(img_response.content)
                    print(f"  Saved: {output_path}")
                    return str(output_path)
                else:
                    print(f"  Error downloading: {img_response.status_code}")
        else:
            print(f"  No image in response")

    except Exception as e:
        print(f"  Exception: {e}")

    return None


def main():
    print("=" * 60)
    print("Company Logo Generator")
    print("=" * 60)

    # Create output directories
    for company in COMPANIES.keys():
        (OUTPUT_DIR / company).mkdir(parents=True, exist_ok=True)

    generated = []
    failed = []

    # Check for specific company argument
    companies_to_process = list(COMPANIES.keys())
    if len(sys.argv) > 1:
        arg = sys.argv[1]
        if arg in COMPANIES:
            companies_to_process = [arg]
        else:
            print(f"Unknown company: {arg}")
            print(f"Available: {', '.join(COMPANIES.keys())}")
            sys.exit(1)

    for company in companies_to_process:
        items = COMPANIES[company]
        print(f"\n{'=' * 40}")
        print(f"Company: {company.upper()}")
        print(f"{'=' * 40}")

        for item in items:
            name = item["name"]
            prompt = item["prompt"]
            size = item.get("size", "square_hd")

            print(f"\nGenerating: {name}")
            print(f"  Prompt: {prompt[:60]}...")

            result = generate_image(prompt, name, company, size)

            if result:
                generated.append(result)
            else:
                failed.append(name)

            time.sleep(0.5)

    print("\n" + "=" * 60)
    print("GENERATION COMPLETE")
    print("=" * 60)
    print(f"\nGenerated: {len(generated)} images")
    print(f"Failed: {len(failed)} images")

    if generated:
        print("\nGenerated files:")
        for path in generated:
            print(f"  - {path}")

    if failed:
        print("\nFailed:")
        for name in failed:
            print(f"  - {name}")


if __name__ == "__main__":
    main()
