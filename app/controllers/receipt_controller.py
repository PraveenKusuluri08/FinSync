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
import dateparser
import uuid
from ..models import expense_model
class Receipt_Controller:
    client = dbConfig.DB_Config()
    
    import uuid
from flask import jsonify, request
from datetime import datetime
from ..config import dbConfig
from ..utils import file_upload
from ..models import expense_model  # adjust this path if needed

class Receipt_Controller:
    client = dbConfig.DB_Config()

    def SaveReceipt(self, user):
        try:
            if not user.get("email"):
                return jsonify({"error": "User not found"}), 404

            current_email = user["email"]
            request_file = request.files.get("receipt_image")

            if not request_file:
                return jsonify({"error": "Receipt image is required"}), 400

            if not request_file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                return jsonify({"error": "Invalid file format. Only PNG, JPG, and JPEG are allowed."}), 400

            # Upload image
            upload_url = file_upload.upload_file(request_file)

            # Extract data from image
            extracted_info = self.ExtractInformationFromImage(upload_url)

            # Validate essential fields
            if not extracted_info.get("merchant_name") or not extracted_info.get("total") or not extracted_info.get("purchase_date"):
                return jsonify({"error": "Could not extract necessary information from receipt."}), 422

            # Format items as description string
            items_list = extracted_info.get("items", [])
            description = ", ".join([f"{item['name']} - {item['price']}" for item in items_list]) if items_list else "No items listed"

            # Prepare expense data
            expense_id = uuid.uuid4().hex
            expense_data = {
                "expense_id": expense_id,
                "user_id": current_email,
                "merchant": extracted_info["merchant_name"],
                "date": extracted_info["purchase_date"],
                "category": extracted_info["category"],
                "amount": extracted_info["total"],
                "description": description,
                "is_personal_expense": True,
                "is_group_expense": False,
                "image_url": upload_url,
            }

            insert_result = self.client.expenses.insert_one(expense_data)
            expense_data["_id"] = str(insert_result.inserted_id)

            return jsonify({
                "message": "Receipt processed and personal expense stored successfully",
                "data": expense_data
            }), 201

        except Exception as e:
            print("Error in SaveReceipt:", e)
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
            if not user.get("email"):
                return jsonify({"error": "User not found"}), 404

            current_user = user["email"]
            print("Current user:", current_user)

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
            print("Downloading image from:", image_url)
            response = requests.get(image_url)

            print("Image download status:", response.status_code)
            if response.status_code != 200:
                return {
                    "merchant_name": None,
                    "merchant_address": None,
                    "purchase_date": None,
                    "category": "Others",
                    "items": [],
                    "subtotal": None,
                    "tax": None,
                    "total": None,
                    "raw_text": f"Failed to fetch image: HTTP {response.status_code}"
                }

            try:
                img = Image.open(io.BytesIO(response.content))
                print("Image loaded successfully. Format:", img.format)
            except Exception as e:
                print("Image loading failed:", e)
                return {
                    "merchant_name": None,
                    "merchant_address": None,
                    "purchase_date": None,
                    "category": "Others",
                    "items": [],
                    "subtotal": None,
                    "tax": None,
                    "total": None,
                    "raw_text": f"Image open failed: {str(e)}"
                }

            # Run OCR
            custom_config = r'--oem 3 --psm 6'
            extracted_text = pytesseract.image_to_string(img, config=custom_config)
            print("Raw OCR Text:", extracted_text)

            if not extracted_text.strip():
                return {
                    "merchant_name": None,
                    "merchant_address": None,
                    "purchase_date": None,
                    "category": "Others",
                    "items": [],
                    "subtotal": None,
                    "tax": None,
                    "total": None,
                    "raw_text": "OCR returned empty text"
                }

            cleaned_text = "\n".join([line.strip() for line in extracted_text.split("\n") if line.strip()])
            lines = cleaned_text.split("\n")

            merchant_name = lines[0] if len(lines) > 0 else None
            merchant_address = "\n".join(lines[1:4]) if len(lines) > 3 else None

            # Extract purchase date
            purchase_date = None
            for line in lines:
                parsed_date = dateparser.parse(line, settings={'PREFER_DAY_OF_MONTH': 'first'})
                if parsed_date:
                    purchase_date = parsed_date.strftime("%Y-%m-%d")
                    break

            # Extract items
            items = []
            item_pattern = re.compile(r"(.*)\s+(\d+\.\d{2})$")
            subtotal = tax = total = None

            for line in lines:
                line_lower = line.lower()
                if "subtotal" in line_lower and not subtotal:
                    found = re.findall(r"\d+\.\d{2}", line)
                    if found:
                        subtotal = found[-1]
                elif "tax" in line_lower and not tax:
                    found = re.findall(r"\d+\.\d{2}", line)
                    if found:
                        tax = found[-1]
                elif "total" in line_lower and not total:
                    found = re.findall(r"\d+\.\d{2}", line)
                    if found:
                        total = found[-1]
                elif item_pattern.match(line):
                    match = item_pattern.match(line)
                    items.append({
                        "name": match.group(1).strip(),
                        "price": match.group(2)
                    })

            def infer_category(name):
                if not name:
                    return "Others"
                name_lower = name.lower()
                if "walmart" in name_lower:
                    return "Groceries"
                elif "best buy" in name_lower:
                    return "Electronics"
                elif "costco" in name_lower:
                    return "Wholesale"
                else:
                    return "Others"

            return {
                "merchant_name": merchant_name,
                "merchant_address": merchant_address,
                "purchase_date": purchase_date,
                "category": infer_category(merchant_name),
                "items": items,
                "subtotal": subtotal,
                "tax": tax,
                "total": total,
                "raw_text": cleaned_text
            }

        except Exception as e:
            print("OCR Process Failed:", e)
            return {
                "merchant_name": None,
                "merchant_address": None,
                "purchase_date": None,
                "category": "Others",
                "items": [],
                "subtotal": None,
                "tax": None,
                "total": None,
                "raw_text": f"Exception occurred: {str(e)}"
            }