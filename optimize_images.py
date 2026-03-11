import os
from PIL import Image


def optimize_images(directory):
    for filename in os.listdir(directory):
        if filename.lower().endswith((".jpg", ".jpeg")):
            filepath = os.path.join(directory, filename)
            try:
                with Image.open(filepath) as img:
                    # Convert to RGB (in case of CMYK or other modes)
                    if img.mode != "RGB":
                        img = img.convert("RGB")

                    # Save with optimization
                    # We keep JPG format but optimize it
                    img.save(filepath, "JPEG", optimize=True, quality=85)
                    print(f"Optimized: {filename}")
            except Exception as e:
                print(f"Error processing {filename}: {e}")


if __name__ == "__main__":
    images_dir = "images/reference/"
    if os.path.exists(images_dir):
        optimize_images(images_dir)
    else:
        print(f"Directory not found: {images_dir}")
