import os
from app import app
from dotenv import load_dotenv
load_dotenv()

PORT = os.getenv('PORT') or 8080
isProduction = os.getenv("APPLICATION_MODE") == "PRODUCTION" or False

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(PORT),debug=isProduction)