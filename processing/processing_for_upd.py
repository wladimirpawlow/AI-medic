import os
from dotenv import load_dotenv
from app.model.models import db, create_all_tables, drop_all_tables
from app.manage_app.default_units import default_reference

load_dotenv()

if os.getenv('APP_ENV') == 'development':
    port = os.getenv('DB_PORT')
    host = os.getenv('DB_HOST')
else:
    port = 5436
    host = '185.51.10.94'

DATABASE = {
    'host': host,
    'port': port,
    'name': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD')
}

db.init(
    database=DATABASE['name'],
    user=DATABASE['user'],
    password=DATABASE['password'],
    host=DATABASE['host'],
    port=DATABASE['port']
)


drop_all_tables()
create_all_tables()
default_reference()
