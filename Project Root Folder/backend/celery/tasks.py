from celery import shared_task
import os
import csv
import time
from flask_excel import make_response_from_query_sets
from backend.models import db, Service
from flask import current_app

#Addition for checking
@shared_task(ignore_results=False)
def add(x,y):
    time.sleep(10)
    return x+y

#Creating CSV File
@shared_task(ignore_result=True)
def create_csv():
    resource=Service.query.with_entities(Service.service_name, Service.service_description)
    csv_out=make_response_from_query_sets(resource, ['name','description'], 'csv', file_name="file.csv")

    with open('./user-downloads/file.csv','wb') as file:
        file.write(csv_out.data)

    return 'file.csv'