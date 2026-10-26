"""Extract decorative assets from the supplied homepage boards (requires Pillow).

Text and controls are rendered by HTML; only the detailed illustrations and the
sample document remain raster assets. Source boards are preserved for comparison.
"""
from pathlib import Path

from PIL import Image


ASSETS = Path(__file__).resolve().parents[1] / "assets" / "mastergo-v2"


def crop(source, box, name):
    image = Image.open(ASSETS / source).convert("RGBA").crop(box)
    image.save(ASSETS / name, "WEBP", lossless=True)
    print(f"{name}: {image.width} x {image.height}")


crop("figma-evaluation-board.png", (920, 1, 1263, 207), "talent-network.webp")
crop("figma-strategy-board.png", (858, 38, 1279, 546), "strategy-report-preview.webp")
for name, x in [("data", 95), ("analysis", 247), ("conclusion", 399), ("report", 551)]:
    crop("figma-strategy-board.png", (x, 302, x + 70, 375), f"strategy-{name}-icon.webp")

# The labels sit inside smooth, empty areas of the original loop. Restore the
# background only at those labels, leaving the ring, nodes and outlines intact.
loop = Image.open(ASSETS / "figma-loop-infinity.png").convert("RGBA")
for x0, y0, x1, y1, sample_x in [(134, 113, 198, 165, 120), (410, 113, 474, 165, 490)]:
    for y in range(y0, y1):
        for x in range(x0, x1):
            loop.putpixel((x, y), loop.getpixel((sample_x, y)))
for y in range(126, 145):
    for x in range(278, 328):
        loop.putpixel((x, y), loop.getpixel((302, 118)))
loop.save(ASSETS / "research-loop-art.webp", "WEBP", lossless=True)
print(f"research-loop-art.webp: {loop.width} x {loop.height}")
