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

    #Creating Admin Role
    if (not userdatastore.find_user(email = 'a')):
        userdatastore.create_user(email = 'a', password = hash_password('a'), roles = ['Admin'] )
    


    db.session.commit()

    
