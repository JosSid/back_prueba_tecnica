# back_prueba_tecnica

Esta Api esta desarrollada para el registro y administración de usuarios en una base de datos.

Esta API trabaja en conexion a una base de datos de **mongoDB**.

[https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

## Instrucciones para el despliegue :

Para clonar este repositorio ejecuta este comando en la consola de tu ordenador :

```
git clone https://github.com/JosSid/back_prueba_tecnica
```

Ve a la carpeta donde hayas clonado el repositorio e instala las dependencias de la aplicacion:

```
npm install
```
Crea un fichero **.env** el cual rellenaremos segun el contenido del fichero **.env.example**.

**IMPORTANTE**

Asegurate de que en el fichero **.env** este bien la ruta de conexión a tu base de datos.

***
***


**Para arrancar la aplicación en modo producción** :

Ejecuta el comando :
```
npm start
```

**Para arrancar la aplicación en modo desarrollo** :

Ejecuta el comando
```
npm run start-dev
```

## Rutas

### Metodos GET 

### **Metodo GET para obtener un listado de usuarios** :

```
http://localhost:3001/api/user
```

Ejemplo de respuesta:

```json
{
	"result": "SUCCESS",
	"users": [
		{
			"_id": "649ab3c2dc44e8c2e43b2e8c",
			"name": "Josep",
			"phone": "987654321",
			"email": "pepe@pepe.com",
			"createdAt": "Tue, 27 Jun 2023 10:02:42 GMT",
			"updatedAt": "Tue, 27 Jun 2023 10:03:30 GMT"
		},
		{
			"_id": "649ab4bddc44e8c2e43b2e8d",
			"name": "JosSid",
			"phone": "696969696",
			"email": "jossid@jossid.com",
			"createdAt": "Tue, 27 Jun 2023 10:06:53 GMT",
			"updatedAt": "Tue, 27 Jun 2023 10:06:53 GMT"
		}
	]
}
```
***
***
### **Metodo GET para obtener un usuario con el id** :

```
http://localhost:3001/api/user/<id>
```
Ejemplo de respuesta:

```json
{
	"user": {
		"_id": "649ab4bddc44e8c2e43b2e8d",
		"name": "JosSid",
		"phone": "696969696",
		"email": "jossid@jossid.com",
		"createdAt": "Tue, 27 Jun 2023 10:06:53 GMT",
		"updatedAt": "Tue, 27 Jun 2023 10:06:53 GMT"
	},
	"result": "SUCCESS"
}
```
***
***

### Metodos POST

### **Metodo POST para registrar un nuevo nuevo en la base de datos** :
```
http://localhost:3001/api/user
```
Añadiremos un body en la peticion con los siguientes campos:

```sh
{
	"email": "pepe@phone.com",
	"phone": "123456789",
	"password": "12345678",
	"name": "pepe"
}
        
```

Ejemplo de respuesta:

```json
{
	"user": {
		"acknowledged": true,
		"insertedId": "649ac8b2b9521262356a7f9f"
	},
	"result": "SUCCESS"
}
```

### **Metodo POST para hacer login** :

```
http://localhost:3001/api/user/login
```

Añadiremos un body en la peticion con los siguientes campos:

```sh
{
	"email": "pepe@phone.com",
	"password": "12345678"
}
        
```

Ejemplo de respuesta:

```json
{
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDlhYzhiMmI5NTIxMjYyMzU2YTdmOWYiLCJpYXQiOjE2ODc4NjU3MTIsImV4cCI6MTY4Nzk1MjExMn0.SA8rSFv3VmGn3x958Z3PrpY0LwoaSjBK1LQsLzeGGtw",
	"result": "SUCCESS"
}
```
***
***

### Metodos PUT

### **Metodo PUT para actualizar un usuario de la base de datos** :
```
http://localhost:3001/api/user/<_id>
```
Añadiremos un body en formato json en la peticion con los campos que deseemos actualizar.

Podremos actualizar cualquiera de los campos del siguiente ejemplo:

```sh
{
	"email": "hola@phone.com",
	"phone": "123454321",
	"password": "12341234",
	"name": "jose"
}
        
```

Ejemplo de respuesta:

```json
{
	"user": {
		"acknowledged": true,
		"modifiedCount": 1,
		"upsertedId": null,
		"upsertedCount": 0,
		"matchedCount": 1
	},
	"result": "SUCCESS"
}
```
***
***


### **Metodo DELETE para eliminar un contrato de la base de datos** :

```
http://localhost:3001/api/user/<_id>
```

**Elimina definitivamente un contrato de la base de datos**.

Ejemplo de respuesta:

```json
{
	"user": {
		"acknowledged": true,
		"deletedCount": 1
	},
	"result": "SUCCESS"
}
```
