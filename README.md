# Prueba tecnica "Transfers-Serverless-CRUD"

Una Api REST con serverless framework de tranferencias donde puedes hacer un CRUD de las mismas.

1. Clonar el proyecto 

2. Crear el manejador de paquetes
```
npm init --y
```
3. Instalar dependencias
```
npm install
```
3. Deploy a AWS
```
serverless deploy --verbose
( Es necesario tener serverless framework instalado )
```
4. Correr api localmente
```
serverless offline
```

### Estructura de datos

```
[
    {   
        "id": varchar,
        "validated": boolean,
        "inUse": boolean,
        "fechaMovimiento": number,
        "fecha": varchar,
        "validatedAt": varchar,
        "createdAt": varchar,
        "updatedAt": varchar,
        "monto": varchar,
        "tipo": varchar,
        "originName": varchar,
        "originRut": varchar,
        "originAccount": varchar,
        "receiverRut": varchar,
        "receiverAccount": varchar,
        "originBankCode": varchar,
        "originBankName": varchar,
        "comment": varchar,
        "originAccountType": varchar
        }
    ]
```

### Peticiones

```
Peticiones SEED

POST   - Upload JSON file a S3 bucket
GET    - Crear la semilla ( es necesario contar con el archivo en S3 )

Tranferencias CRUD

POST   - Crear la transferncia
GET    - Obtener todas las transferencias
PATCH  - Actualizar información de la transferencia
DELETE - Soft delete a transferencia

```