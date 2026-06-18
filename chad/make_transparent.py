from PIL import Image
import numpy as np

# Load the image
img = Image.open("cheez-motion-logo.png")

# Convert to RGBA if it's not already
if img.mode != 'RGBA':
    img = img.convert('RGBA')

# Get the image data as array
img_array = np.array(img)

# Define white threshold (anything close to white will become transparent)
white_threshold = 240

# Create a mask for white pixels
# Check if all RGB channels are above the threshold
white_mask = (
    (img_array[:, :, 0] > white_threshold) &
    (img_array[:, :, 1] > white_threshold) &
    (img_array[:, :, 2] > white_threshold)
)

# Set the alpha channel to 0 (transparent) for white pixels
img_array[white_mask, 3] = 0

# Create new image from the modified array
transparent_img = Image.fromarray(img_array, 'RGBA')

# Save back to the same file
transparent_img.save("cheez-motion-logo.png", 'PNG')
print("Logo saved with transparent background!")
