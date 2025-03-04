from flask import current_app as app, request, jsonify, render_template
from flask_security import auth_required, verify_password, hash_password
from backend.models import db, Customer, Service, Professional

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
        return jsonify({'message' : "Invalid Inputs"}), 422

    user=datastore.find_user(email=email)

    if not user:
        return jsonify({'message' : "Incorect Email or Password. Please try again."}), 401
    
    if verify_password(password, user.password):
        return jsonify({'token' : user.get_auth_token(), 'email' : user.email, 'role' : user.roles[0].name, 'active' : user.active})
    
    return jsonify({'message' : "Incorect Email or Password. Please try again."}), 400

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
        if role == "Customer":
            datastore.create_user(email = email, password = hash_password(password), roles = [role], active = True)
            db.session.commit()
        if role == "Professional":
            datastore.create_user(email = email, password = hash_password(password), roles = [role], active = False)
            db.session.commit()

        user1 = datastore.find_user(email=email)
        if not user1:
            return jsonify({"message": "User creation failed"}), 500

        # ✅ Fix: Create Customer or Professional
        if role == "Customer":
            customer = Customer(
                c_userid=user1.id,
                c_name=data.get('name'),
                c_address=data.get('address'),
                c_pincode=data.get('pincode'),
                c_flag=0,
                c_phone=data.get('phone')
            )
            db.session.add(customer)
            db.session.commit()

        if role == "Professional":
            professional = Professional(
                p_name=data.get('name'),
                p_userid= user1.id,
                p_serviceid=data.get('serviceid'),
                p_experience=data.get('experience'),
                p_flag=0,
                p_pincode=data.get('pincode'),
                p_phone=data.get('phone'),
                p_aadhaarnumber=data.get('aadhaar'),
                )
            db.session.add(professional)
            db.session.commit()

        return jsonify({"message" : "success"}), 200
    except:
        db.session.rollback()
        return jsonify({"message" : "error creating user"}), 400

@app.route('/public/services', methods=['GET'])
def public_services():
    services = Service.query.all()
    service_list = [{"service_id": s.service_id, "service_name": s.service_name} for s in services]
    return jsonify(service_list)