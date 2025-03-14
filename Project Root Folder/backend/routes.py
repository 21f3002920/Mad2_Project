from flask import current_app as app, request, jsonify, render_template, send_from_directory
from flask_security import auth_required, verify_password, hash_password
from backend.models import db, Customer, Service, Professional
from datetime import datetime
from backend.celery.tasks import create_csv,add
from celery.result import AsyncResult

datastore= app.security.datastore
cache=app.cache

#Cache Check
@app.get('/cache')
@cache.cached(timeout = 5)
def cache():
    return{'time' : str(datetime.now())}

#Celery check1
@app.get('/celery')
def celery():
    task=add.delay(10,20)
    return {'task_id':task.id}

#Celery check2
@app.get('/get-celery-data/<id>')
def getData(id):
    result=AsyncResult(id)

    if result.ready():
        return {'result':result.result}
    else:
        return {'message':'task not ready'},405

#Exporting CSV Data (error)
@app.get('/start-export')
def start_export():
    task=create_csv.delay()
    return {'task_id':task.id}, 200

#Importing image for background
@app.route('/static/images/<path:filename>')
def serve_static_image(filename):
    return send_from_directory('static/images', filename)

#Start Route
@app.get('/')
def home():
    return render_template('index.html')

#Authentication Check
@app.get('/protected')
@auth_required('token')
def protected():
    return '<h1> Only accessible by Authenticated User </h1>'
    
#Login Route
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
        customer = Customer.query.filter_by(c_userid=user.id).first()
        professional = Professional.query.filter_by(p_userid=user.id).first()
        name = customer.c_name if customer else (professional.p_name if professional else "User")

        return jsonify({
            'token': user.get_auth_token(),
            'email': user.email,
            'role': user.roles[0].name,
            'active': user.active,
            'id': user.id,
            'name': name 
        })
    
    return jsonify({'message' : "Incorect Email or Password. Please try again."}), 400

#New User/Professional Registartion
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if not email or not password or role not in ['Customer', 'Professional']:
        return jsonify({"message" : "Invalid inputs"}), 404
    
    user = datastore.find_user(email = email)

    if user:
        return jsonify({"message" : "User already exists. Try using different credentials."}), 404

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

        return jsonify({"message" : "User created Successfully"}), 200
    except:
        db.session.rollback()
        return jsonify({"message" : "Error creating User"}), 400

#Get Method for checking Services- checking using THUNDER CLIENT
@app.route('/public/services', methods=['GET'])
def public_services():
    services = Service.query.all()
    service_list = [{"service_id": s.service_id, "service_name": s.service_name} for s in services]
    return jsonify(service_list)