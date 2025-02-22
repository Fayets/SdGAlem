from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from src.db import db
from pony.orm import *
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.controllers.auth_controller import router as auth_router
from src.controllers.users_controller import router as users_router
from src.controllers.product_controller import router as product_router
from src.controllers.category_controller import router as category_router
<<<<<<< HEAD
#from src.controllers.sale_controller import router as sale_router
=======
>>>>>>> 405771247fff7b4b255287220e9baf1ee23150f6

app = FastAPI()

# Mapeando las entidades a tablas (si no existe la tabla, la crea)
db.generate_mapping(create_tables=True)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lista de Rutas
# Auth
app.include_router(auth_router, prefix="/auth", tags=["auth"])

# Usuarios
app.include_router(users_router, prefix="/users", tags=["usuarios"])

# Productos
app.include_router(product_router, prefix="/products", tags=["productos"])

# Categorias
app.include_router(category_router, prefix="/categories", tags=["categorias"])

<<<<<<< HEAD
#Ventas
#app.include_router(sale_router, prefix="/sales", tags=["ventas"])

=======
>>>>>>> 405771247fff7b4b255287220e9baf1ee23150f6
# Personalizar el esquema de seguridad en OpenAPI para usar Bearer tokens
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = app._original_openapi()  # Cambiado a _original_openapi
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }
    for path in openapi_schema["paths"].values():
        for method in path.values():
            method["security"] = [{"BearerAuth": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema

# Guardamos la referencia original del método openapi
app._original_openapi = app.openapi
# Reemplazamos el método openapi por nuestra función personalizada
app.openapi = custom_openapi