import cloudinary
import cloudinary.uploader
import cloudinary.api

config = cloudinary.config(secure=True)

def upload_file(file):
    upload = cloudinary.uploader.upload(file)
    return upload['url']
