from flask import current_app as app, request, jsonify, render_template
from flask_security import auth_required, verify_password, hash_password
from backend.models import db

datastore= app.security.datastore

@app.get('/')
def home():
    return render_template('index.html')

@app.get('/protected')
@auth_required('token')
def protected():
    return '<h1> Only accessible by Authenticated User </h1>'
    
@app.route('/login', methods=['POST'])
def login():
    data=request.get_json()

    email=data.get('email')
    password=data.get('password')

    if not email or not password:
        return jsonify({"message" : "Invalid Inputs"}), 404

    user=datastore.find_user(email=email)

    if not user:
        return jsonify({"message" : "Invalid Email or Password"}), 404
    
    if verify_password(password, user.password):
        return jsonify({'token' : user.get_auth_token(), 'email' : user.email, 'role' : user.roles[0].name, 'id' : user.id})
    
    return jsonify({"message" : "Wrong Password"}), 400

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if not email or not password or role not in ['Customer', 'Professional']:
        return jsonify({"message" : "invalid inputs"}), 404
    
    user = datastore.find_user(email = email)

    if user:
        return jsonify({"message" : "user already exists"}), 404

    try :
        datastore.create_user(email = email, password = hash_password(password), roles = [role], active = True)
        db.session.commit()
        return jsonify({"message" : "user created"}), 200
    except:
        db.session.rollback()
        return jsonify({"message" : "error creating user"}), 400
