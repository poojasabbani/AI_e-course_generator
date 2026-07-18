"""Auth deps: verify Supabase JWT and expose current user."""
# from fastapi import Depends, HTTPException, status
# from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
# import jwt
# from app.core.config import settings


# bearer = HTTPBearer(auto_error=False)


# def get_current_user(creds: HTTPAuthorizationCredentials = Depends(bearer)):
#     if not creds:
#         raise HTTPException(status.HTTP_401_UNAUTHORIZED)
#     try:
#         payload = jwt.decode(
#             creds.credentials,
#             settings.SUPABASE_JWT_SECRET,
#             algorithms=["HS256"],
#             audience="authenticated",
#         )
#     except jwt.PyJWTError:
#         raise HTTPException(status.HTTP_401_UNAUTHORIZED)
#     return {"id": payload["sub"], "email": payload.get("email")}
