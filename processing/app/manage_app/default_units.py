import uuid
import os
import psycopg2
import traceback
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from app.model.models import create_all_tables, drop_all_tables


def ensure_database_exists():
    db_name = os.getenv('DB_NAME')
    port = os.getenv('DB_PORT')
    host = os.getenv('DB_HOST')

    try:
        conn = psycopg2.connect(
            dbname='postgres',
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            host=host,
            port=port
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    except Exception as e:
        traceback.print_exc()
        raise

    cur = conn.cursor()
    cur.execute(
        "SELECT 1 FROM pg_database WHERE datname = %s;",
        (db_name,)
    )
    exists = cur.fetchone()
    if not exists:
        cur.execute(f'CREATE DATABASE "{db_name}";')
        # print(f'Database "{db_name}" created')
    else:
        pass
        # print(f'Database "{db_name}" already exists')
    cur.close()
    conn.close()


def create_tables():
    create_all_tables()
    # drop_all_tables()
    pass

