from PIL import Image
import glob
import os

# Create the frames

frames = []
imgs = glob.glob("pngs_container/*.png")
name = imgs[1].split("/")[1].split("_")[0]
speed = int(imgs[1].split("/")[1].split("_")[1])

for i in range(len(imgs)):
    fn = f"pngs_container/{name}_{speed}_{i}.png"
    new_frame = Image.open(f"pngs_container/{name}_{speed}_{i}.png")
    frames.append(new_frame)
    os.remove(fn)


# Save into a GIF file that loops forever
frames[0].save(f"extracted_gifs/{name}.gif", format='GIF',
               append_images=frames[1:],
               save_all=True,
               duration=speed, loop=0)
