from flask import jsonify, request
from ..config import dbConfig
from ..utils import file_upload
from datetime import datetime
from bson import ObjectId
from PIL import Image
import pytesseract
import re
import io
import requests
class Receipt_Controller:
    client = dbConfig.DB_Config()
    
    def SaveReceipt(self, user):
        try:
            if not user["email"]:
                return jsonify({"error": "User not found"}), 404
            
            current_user = user["email"]
            receipt_name = request.form.get("receipt_name")
            receipt_description = request.form.get("receipt_description")
            request_file = request.files.get("receipt_image")

            if not receipt_name or not receipt_description or not request_file:
                return jsonify({"error": "All fields are required"}), 400

            if not request_file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                return jsonify({"error": "Invalid file format. Only PNG, JPG, and JPEG are allowed."}), 400

            # Upload the image using your upload logic
            upload_url = file_upload.upload_file(request_file)

            # Save directly into MongoDB using a dictionary
            receipt_data = {
                "receipt_name": receipt_name,
                "receipt_description": receipt_description,
                "receipt_image": upload_url,
                "user": current_user,
                "created_at": datetime.now()
            }

            self.client.receipts.insert_one(receipt_data)

            return jsonify({"message": "Receipt saved successfully"}), 201

        except Exception as e:
            print("Error saving receipt:", e)
            return jsonify({"error": "Internal Server Error"}), 500
    
    
    def GetReceipts(self, user):
        try:
            if not user["email"]:
                return jsonify({"error": "User not found"}), 404
            
            current_user = user["email"]
            receipts = self.client.receipts.find({"user": current_user})
            receipt_list = []

            for receipt in receipts:
                receipt["_id"] = str(receipt["_id"])
                receipt_list.append(receipt)

            return jsonify(receipt_list), 200

        except Exception as e:
            print("Error fetching receipts:", e)
            return jsonify({"error": "Internal Server Error"}), 500
        

    def GetReceiptByIdAndExtractData(self, user, receipt_id):
        print("Receipt ID:", receipt_id)
        try:
            if not user["email"]:
                return jsonify({"error": "User not found"}), 404

            current_user = user["email"]
            print("Current user:", current_user)
            print("Receipt ID:", receipt_id)
            receipt = self.client.receipts.find_one({
                "_id": ObjectId(receipt_id),
                "user": current_user
            })

            if not receipt:
                return jsonify({"error": "Receipt not found"}), 404
            
            print("Receipt found:", receipt)

            extracted_info = self.ExtractInformationFromImage(receipt["receipt_image"])

            merged_data = {
                "receipt_information": {
                    "receipt_name": receipt.get("receipt_name", ""),
                    "receipt_description": receipt.get("receipt_description", ""),
                    "created_at": receipt.get("created_at", ""),
                    "receipt_image": receipt.get("receipt_image", "")
                },
                "extracted_information": extracted_info
            }

            return jsonify(merged_data), 200

        except Exception as e:
            print("Error fetching receipt by ID:", e)
            return jsonify({"error": "Internal Server Error"}), 500

    @staticmethod
    def ExtractInformationFromImage(image_url):
        try:
            # Download the image from URL
            response = requests.get(image_url)
            if response.status_code != 200:
                raise ValueError("Failed to download image from URL")

            img = Image.open(io.BytesIO(response.content))

            # Run OCR
            custom_config = r'--oem 3 --psm 6'
            extracted_text = pytesseract.image_to_string(img, config=custom_config)

            if not extracted_text:
                raise ValueError("Empty OCR result")

            cleaned_text = "\n".join([line.strip() for line in extracted_text.split("\n") if line.strip()])
            lines = cleaned_text.split("\n")

            items = []
            subtotal = tax = total = None

            for line in lines:
                line_lower = line.lower()
                if "subtotal" in line_lower:
                    found = re.findall(r"\d+\.\d{2}", line)
                    if found:
                        subtotal = found[-1]
                elif "tax" in line_lower and not tax:
                    found = re.findall(r"\d+\.\d{2}", line)
                    if found:
                        tax = found[-1]
                elif "total" in line_lower:
                    found = re.findall(r"\d+\.\d{2}", line)
                    if found:
                        total = found[-1]
                elif re.search(r"\d+\.\d{2}", line):
                    items.append(line)

            return {
                "items": items,
                "subtotal": subtotal,
                "tax": tax,
                "total": total,
            }

        except Exception as e:
            print("Error extracting image:", e)
            return {
                "items": [],
                "subtotal": None,
                "tax": None,
                "total": None,
                "raw_text": "Error extracting text from image"
            }