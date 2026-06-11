from datetime import datetime, timedelta, timezone
from jose import jwt
from pwdlib import PasswordHash

# In production, load these from your environmental variables (.env)
SECRET_KEY = "super-secret-key"
ALGORITHM = "HS256"

# Initialize modern pwdlib context (handles bcrypt correctly behind the scenes)
password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    """Hashes a plain text password using the recommended algorithm."""
    return password_hash.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain text password against its hashed counterpart."""
    try:
        return password_hash.verify(plain_password, hashed_password)
    except Exception:
        # Catches malformed hashes safely instead of crashing the server
        return False


def create_access_token(user_id: int) -> str:
    """Generates a secure, time-sensitive JWT access token."""
    # Updated from deprecated utcnow() to modern timezone-aware UTC datetime
    expire = datetime.now(timezone.utc) + timedelta(hours=1)
    
    payload = {
        "user_id": user_id,
        "exp": expire
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )