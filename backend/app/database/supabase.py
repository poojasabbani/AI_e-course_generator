from supabase import Client, create_client
from app.core.config import settings

print("SUPABASE_URL =", settings.SUPABASE_URL)

supabase: Client = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_SERVICE_ROLE_KEY,
)