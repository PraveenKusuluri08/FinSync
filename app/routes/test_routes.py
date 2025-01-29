from flask import Blueprint

test_routes_blueprint = Blueprint("test_routes",__name__)

@test_routes_blueprint.get("/helloworld")
def hello_world():
    return "Hello, World!"
