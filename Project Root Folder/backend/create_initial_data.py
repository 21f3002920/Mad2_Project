from flask import current_app as app
from datetime import datetime
from backend.models import db, Customer, Professional, Service, ServiceRequest
from flask_security import SQLAlchemyUserDatastore, hash_password

with app.app_context():
    db.create_all()

    userdatastore : SQLAlchemyUserDatastore = app.security.datastore

    userdatastore.find_or_create_role(name = 'Admin', description = 'superuser')
    userdatastore.find_or_create_role(name = 'Customer', description = 'general user')
    userdatastore.find_or_create_role(name = 'Professional', description = 'general user')

    if (not userdatastore.find_user(email = 'a')):
        userdatastore.create_user(email = 'a', password = hash_password('a'), roles = ['Admin'] )
    if (not userdatastore.find_user(email = 'c')):
        userdatastore.create_user(email = 'c', password = hash_password('c'), roles = ['Customer'] )
    if (not userdatastore.find_user(email = 'p')):
        userdatastore.create_user(email = 'p', password = hash_password('p'), roles = ['Professional'] ) # for testing

    db.session.commit()

    customer_user = userdatastore.find_user(email='c')
    professional_user = userdatastore.find_user(email='p')

    new_customer = Customer(
        c_name="Rishab R",
        c_userid=customer_user.id,
        c_flag=0,
        c_address="Bangalore",
        c_pincode=560099,
        c_phone=9876543210
        )
    db.session.add(new_customer)
    db.session.commit()

    new_professional1 = Professional(
        p_userid=professional_user.id,
        p_serviceid=2,
        p_experience=3,
        p_flag=0,
        p_name="Raghu",
        p_active=True,
        p_aadhaarnumber="555555555555",
        p_phone=9887765544,
        p_pincode=560089
    )
    db.session.add(new_professional1)
    db.session.commit()


    new_service1 = Service(
        service_name="Haircut for Men",
        service_baseprice=1000,
        service_time=2,
        service_description="Haircut and Beard shape up for Men"
    )
    new_service2 = Service(
        service_name="Car Washing",
        service_baseprice=500,
        service_time=1,
        service_description="Interior and Exterior cleaning"
    )
    new_service3 = Service(
        service_name="Pool Cleaning",
        service_baseprice=2000,
        service_time=3,
        service_description="Cleaning and Chlorination of Swimming Pool"
    )
    db.session.add(new_service1)
    db.session.add(new_service2)
    db.session.add(new_service3)
    db.session.commit()
    
