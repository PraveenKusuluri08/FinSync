import os
from app import app
from dotenv import load_dotenv
from app.config import dbConfig
load_dotenv()

PORT = os.getenv('PORT') or 8080
isProduction = not os.getenv("APPLICATION_MODE") == "PRODUCTION" or True

# dbConfig.DB_Config()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(PORT),debug=isProduction)