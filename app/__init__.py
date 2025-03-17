from flask import Flask
from . import routes

app = Flask(__name__)

#Create a register blueprint for the test_routes

app.register_blueprint(routes.test_routes.test_routes_blueprint)

app.register_blueprint(routes.user_routes.users_blueprint)

app.register_blueprint(routes.expenses_blueprint)

app.register_blueprint(routes.group_routes_blueprint)

app.register_blueprint(routes.calendar_blueprint)


