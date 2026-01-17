#!/usr/bin/env python3
"""
BlueBlocks Brand Asset Generator using fal.ai
Generates logos, mascot images, token imagery, and marketing assets
"""

import os
import sys
import json
import time
import requests
from pathlib import Path

# fal.ai API configuration
FAL_API_KEY = "123816ab-599b-4784-882c-6c14888d1788:03e39cce07aeca9e061017440a16a868"

# Use synchronous endpoint for simplicity
FAL_API_URL = "https://fal.run/fal-ai/flux-pro/v1.1"

# Output directory
OUTPUT_DIR = Path(__file__).parent.parent / "brand-assets"

# Image generation prompts organized by category
PROMPTS = {
    "logos": [
        {
            "name": "logo-geometric-blocks",
            "prompt": "Minimalist cryptocurrency token logo, two interlocking 3D blue cubes forming 'BB' letters, gradient from deep blue #0066CC to cyan #00A3E0, subtle golden accent line, clean pure white background, vector style flat design, suitable for favicon and app icon, professional fintech aesthetic, no text, centered composition",
            "size": "square_hd"
        },
        {
            "name": "logo-healthcare-fusion",
            "prompt": "Modern blockchain logo combining blue cubic blocks with subtle medical cross symbol integrated into design, hexagonal badge shape, gradient blue #0066CC to #00A3E0, minimalist clean design, cryptocurrency token style, pure white background, suitable for healthcare technology brand, no text",
            "size": "square_hd"
        },
        {
            "name": "logo-circular-token",
            "prompt": "Circular cryptocurrency coin logo design, embossed 'BBT' letters in center, geometric blockchain pattern border, metallic blue and gold color scheme, 3D rendered coin face, premium fintech aesthetic, pure white background, centered",
            "size": "square_hd"
        },
        {
            "name": "logo-simple-bb",
            "prompt": "Ultra minimalist logo mark, stylized 'BB' monogram made of connected blue squares/blocks, flat design, #0066CC blue color, clean geometric shapes, tech startup logo style, pure white background, centered, no gradients",
            "size": "square_hd"
        },
    ],
    "mascot": [
        {
            "name": "mascot-main",
            "prompt": "Cute 3D mascot character made of translucent blue cubic blocks stacked together forming a friendly robot-like body, LED screen face showing happy smile with digital eyes, wearing tiny white doctor coat, glowing warm golden heart visible inside translucent chest, rounded friendly approachable design, Pixar-style 3D render, soft studio lighting, pure white background, healthcare technology mascot, full body standing pose",
            "size": "square_hd"
        },
        {
            "name": "mascot-waving",
            "prompt": "Friendly blue cube robot mascot waving hello with one blocky arm raised, made of stacked transparent blue geometric blocks, digital LED smiley face with happy eyes, small stethoscope around neck, golden warm glow emanating from chest area, 3D rendered character, welcoming friendly pose, clean pure white background, healthcare blockchain mascot, Pixar animation style",
            "size": "square_hd"
        },
        {
            "name": "mascot-thinking",
            "prompt": "Cute blue block robot mascot in thinking pose, blocky hand on chin contemplating, glowing lightbulb appearing above head, translucent blue cubic geometric body, wearing small round glasses, tiny doctor coat, intelligent friendly curious expression on LED face, 3D Pixar style render, pure white background, problem solving concept",
            "size": "square_hd"
        },
        {
            "name": "mascot-shield",
            "prompt": "Blue cube robot mascot holding glowing protective energy shield, heroic protective stance, blocks forming armor-like pattern on body, golden accents and trim, determined but friendly expression on LED face, healthcare data security guardian concept, 3D render Pixar style, pure white background, full body",
            "size": "square_hd"
        },
        {
            "name": "mascot-thumbsup",
            "prompt": "Cheerful blue block robot mascot giving enthusiastic thumbs up gesture, big happy smile on LED screen face, made of translucent blue cubes, golden heart glowing in chest, success approval concept, 3D Pixar animation style, pure white background, healthcare mascot",
            "size": "square_hd"
        },
        {
            "name": "mascot-celebrate",
            "prompt": "Blue cube robot mascot jumping with joy celebration pose, arms raised in excitement, confetti and golden BBT coins floating around, huge happy expression on LED face, translucent blue block body, sparkle effects, success celebration concept, 3D Pixar style render, pure white background",
            "size": "square_hd"
        },
    ],
    "tokens": [
        {
            "name": "token-gold-coin",
            "prompt": "Photorealistic 3D render of premium golden cryptocurrency coin, 'BBT' letters embossed in center with medical cross symbol, intricate blockchain hexagon pattern engraved around edge, blue enamel accent details, highly reflective polished metallic gold surface, dramatic studio lighting with rim light, dark gradient background, product photography",
            "size": "square_hd"
        },
        {
            "name": "token-stack",
            "prompt": "Elegant stack of blue and gold cryptocurrency coins, 'BBT' clearly visible embossed on top coin face, metallic sheen reflections, artfully scattered arrangement with some coins on edge showing thickness, professional product photography style, soft shadows, white marble surface, shallow depth of field",
            "size": "landscape_16_9"
        },
        {
            "name": "token-hero-floating",
            "prompt": "Large detailed cryptocurrency token floating and spinning in dramatic pose, blue metallic finish with polished gold trim accents, 'BBT' in center with subtle medical cross, volumetric god rays lighting, subtle lens flare, dark moody gradient background, premium fintech hero image, 3D render",
            "size": "landscape_16_9"
        },
        {
            "name": "token-blue-silver",
            "prompt": "Premium cryptocurrency coin, brushed blue metallic surface, silver chrome accents, 'BBT' engraved in center, blockchain circuit pattern border, floating with soft shadow beneath, clean studio lighting, pure white background, product shot",
            "size": "square_hd"
        },
    ],
    "marketing": [
        {
            "name": "pot-of-gold",
            "prompt": "Fantasy treasure scene, ornate golden cauldron pot overflowing with glowing blue cryptocurrency coins marked 'BBT', magical golden light rays emanating from pot, sparkles and particle effects, subtle rainbow arc in misty background, treasure discovery concept, 3D render, cinematic lighting, dark atmospheric background",
            "size": "landscape_16_9"
        },
        {
            "name": "spilled-treasure",
            "prompt": "Blue and gold BBT cryptocurrency coins dramatically spilling and cascading from tipped ornate treasure chest, 'BBT' visible on scattered coins, coins rolling across dark polished wood surface, dramatic side lighting creating long shadows, wealth abundance concept, photorealistic 3D render, cinematic composition",
            "size": "landscape_16_9"
        },
        {
            "name": "raining-tokens",
            "prompt": "Dynamic scene of blue BBT cryptocurrency coins falling like golden rain from above, motion blur on falling coins, some coins in sharp focus mid-fall, golden sparkle and glitter particle effects throughout, celebration wealth prosperity concept, dark gradient background, 3D render cinematic",
            "size": "portrait_16_9"
        },
        {
            "name": "wallet-overflow",
            "prompt": "Futuristic holographic digital wallet interface glowing blue, overflowing with BBT tokens floating upward and outward, holographic UI elements and data visualizations, cyberpunk neon aesthetic with blue and gold colors, technology wealth concept, dark background, 3D render",
            "size": "landscape_16_9"
        },
        {
            "name": "medical-data-shield",
            "prompt": "Glowing blue blockchain cubes forming protective dome shield around floating holographic medical records and health data, energy barrier effect, healthcare data protection visualization, blue and gold color scheme, futuristic technology concept, dark background with blue ambient light, 3D render",
            "size": "landscape_16_9"
        },
        {
            "name": "hero-banner",
            "prompt": "Wide cinematic banner image, friendly blue cube robot mascot (Blocky) standing proudly in front of futuristic smart hospital building, BBT golden coins floating in arc around mascot, blockchain network visualization in sky connecting buildings, optimistic bright lighting, healthcare technology future concept, 3D render Pixar style",
            "size": "landscape_16_9"
        },
    ]
}


def generate_image(prompt: str, name: str, category: str, size: str = "square_hd") -> str:
    """Generate a single image using fal.ai API (synchronous)"""

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
        # Synchronous request - will wait for result
        response = requests.post(FAL_API_URL, headers=headers, json=payload, timeout=120)

        if response.status_code != 200:
            print(f"  Error: {response.status_code} - {response.text[:200]}")
            return None

        result = response.json()

        # Extract image URL
        if "images" in result and len(result["images"]) > 0:
            image_url = result["images"][0].get("url")
            if image_url:
                # Download the image
                output_path = OUTPUT_DIR / category / f"{name}.png"
                print(f"  Downloading to {output_path}...")

                img_response = requests.get(image_url, timeout=60)
                if img_response.status_code == 200:
                    with open(output_path, "wb") as f:
                        f.write(img_response.content)
                    print(f"  Saved: {output_path}")
                    return str(output_path)
                else:
                    print(f"  Error downloading image: {img_response.status_code}")
        else:
            print(f"  No image in response: {json.dumps(result)[:200]}")

    except requests.exceptions.Timeout:
        print(f"  Timeout waiting for image generation")
    except Exception as e:
        print(f"  Exception: {e}")

    return None


def main():
    """Generate all brand assets"""

    print("=" * 60)
    print("BlueBlocks Brand Asset Generator")
    print("=" * 60)
    print()

    # Create output directories
    for category in PROMPTS.keys():
        (OUTPUT_DIR / category).mkdir(parents=True, exist_ok=True)

    generated = []
    failed = []

    # Check for specific category argument
    categories_to_process = list(PROMPTS.keys())
    if len(sys.argv) > 1:
        arg = sys.argv[1]
        if arg in PROMPTS:
            categories_to_process = [arg]
        else:
            print(f"Unknown category: {arg}")
            print(f"Available: {', '.join(PROMPTS.keys())}")
            sys.exit(1)

    # Process each category
    for category in categories_to_process:
        items = PROMPTS[category]
        print(f"\n{'=' * 40}")
        print(f"Category: {category.upper()}")
        print(f"{'=' * 40}")

        for item in items:
            name = item["name"]
            prompt = item["prompt"]
            size = item.get("size", "square_hd")

            print(f"\nGenerating: {name}")
            print(f"  Prompt: {prompt[:60]}...")

            result = generate_image(prompt, name, category, size)

            if result:
                generated.append(result)
            else:
                failed.append(name)

            # Small delay between requests
            time.sleep(0.5)

    # Summary
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

    print(f"\nOutput directory: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
