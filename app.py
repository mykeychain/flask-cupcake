"""Flask app for Cupcakes"""

from flask import Flask, jsonify, request

from models import db, connect_db, Cupcake

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

connect_db(app)
db.create_all()

app.config['SECRET_KEY'] = "I'LL NEVER TELL!!"


@app.route('/api/cupcakes')
def show_all_cupcakes():
    """
    Returns list of serialized Cupcake instances in JSON format.
    {cupcakes: [{id, falvor, size, rating, image},...]} """

    cupcakes = Cupcake.query.all()
    serialized = [cupcake.serialize() for cupcake in cupcakes]

    return jsonify(cupcakes=serialized)



@app.route('/api/cupcakes/<cupcake_id>')
def show_cupcake_details(cupcake_id):
    """ Returns cupcake details in JSON format. """

    cupcake = Cupcake.query.get_or_404(cupcake_id)
    serialized = cupcake.serialize()

    return jsonify(cupcake=serialized)



@app.route('/api/cupcakes', methods=["POST"])
def create_new_cupcake():
    """ Creates new cupcake. """

    flavor = request.json["flavor"]
    size = request.json["size"]
    rating = request.json["rating"]
    image = request.json["image"]

    new_cupcake = Cupcake(
                        flavor=flavor,
                        size=size,
                        rating=rating,
                        image=image
                        )
    
    db.session.add(new_cupcake)
    db.session.commit()

    serialized = new_cupcake.serialize()

    return (jsonify(cupcake=serialized), 201)