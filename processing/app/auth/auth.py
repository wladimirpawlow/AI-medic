import jwt
import os
from flask import request
from flask_smorest import abort
from app.manage_app.config import Config

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_KEY_PATH = os.path.join(BASE_DIR, "keys", "public.pem")


def load_public_key():
    with open(PUBLIC_KEY_PATH, "rb") as f:
        return f.read()

def verify_token(token, audience="*", expected_type=None):
    payload = jwt.decode(
        token,
        load_public_key(),
        algorithms=["RS256"],
        audience=audience,
        issuer="spawnx_users",
        leeway=10
    )
    if expected_type and payload.get("type") != expected_type:
        raise jwt.InvalidTokenError("Token type mismatch")
    return payload


def check_token(open_routes):
    if request.path in open_routes:
        return

    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        abort(401, message="Missing or invalid token")

    token = auth_header.replace("Bearer ", "")
    try:
        request.jwt_payload = verify_token(token, expected_type="access")
    except Exception as e:
        abort(401, message=f"Invalid access token: {e}")
