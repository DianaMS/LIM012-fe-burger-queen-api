# :hamburger:	:vibration_mode: Burger Queen - API con Node.js

<p align="center">
  <img src="https://user-images.githubusercontent.com/60928490/86297712-a46e5d80-bbc1-11ea-9d84-f6b475ccd5a7.png">
</p>


Un pequeño restaurante de hamburguesas, que está creciendo, necesita un
sistema a través del cual puedan tomar pedidos usando una _tablet_, y enviarlos
a la cocina para que se preparen ordenada y eficientemente.

Este proyecto tiene dos áreas: interfaz (cliente) y API (servidor). Nuestra
clienta nos ha solicitado desarrollar la API que se debe integra con la
interfaz,  que otro equipo de desarrolladoras está trabajando
simultáneamente


***


## 2. Resumen del proyecto

Con una API en este caso nos referimos a un _servidor web_, que es
básicamente un programa que _escucha_ en un puerto de red, a través del cual
podemos enviarle _consultas_ (_request_) y obtener _respuestas_ (_response_).

Un servidor web debe _manejar_ consultas entrantes y producir respuestas a esas
consultas que serán enviadas de vuelta al _cliente_. Cuando hablamos de
_aplicaciones de servidor_, esto implica una arquitectura de _cliente/servidor_,
donde el cliente es un programa que hace consultas a través de una red (por
ejemplo el navegador, cURL, ...), y el _servidor_ es el programa que recibe
estas consultas y las responde.

[Node.js](https://nodejs.org/) nos permite crear servidores web super eficientes
de manera relativamente simple y todo esto usando JavaScript!

En este proyecto partimos de un _boilerplate_ que ya contiene una serie de
_endpoints_ (puntos de conexión o URLs) y nos piden completar la aplicación.
Esto implica que tendremos que partir por leer la implementación existente, y
familiarizarnos con el _stack_ elegido ([Node.js](https://nodejs.org/) y
[Express](https://expressjs.com/)) y complementarlo con un motor de bases de
datos, el cual tu deberás elegir entre [MongoDB](https://www.mongodb.com/) y
[MySQL](https://www.mysql.com/).

La clienta nos ha dado un [link a la documentación](https://laboratoria.github.io/burger-queen-api/)
que especifica el comportamiento esperado de la API que expondremos por
HTTP.  Ahí puedes encontrar todos los detalles de qué _endpoints_ debe
implementar  la aplicación, qué parámetros esperan, qué deben responder, etc.

<p align="center">
  <img src="https://user-images.githubusercontent.com/60928490/89962929-b8b76880-dc0b-11ea-9627-83ed67fdb40e.png">
  <img src="https://user-images.githubusercontent.com/60928490/89962935-bf45e000-dc0b-11ea-89c1-1136ad704318.png">
</p>


***

#### Variables de entorno

Nuestra aplicación usa las siguientes variables de entorno:

* `PORT`: Si no se ha especificado un puerto como argumento de lína de comando,
  podemos usar la variable de entorno `PORT` para especificar el puerto. Valor
  por defecto `8080`.
* `DB_URL`: El _string_ de conexión de _MongoDB_ o _MySQL_. Cuando ejecutemos la
  aplicación en nuestra computadora (en entorno de desarrollo), podemos usar el
  una base de datos local, pero en producción deberemos utilizar las instancias
  configuradas con `docker-compose` (mas sobre esto en la siguiente sección de
  **Deployment**)
* `JWT_SECRET`: Nuestra aplicación implementa autenticación usando JWT (JSON
   Web Tokens). Para poder firmar (cifrar) y verificar (descifrar) los tokens,
  nuestra aplicación necesita un secreto. En local puedes usar el valor por
  defecto (`xxxxxxxx`), pero es muy importante que uses un _secreto_ de verdad
  en producción.
* `ADMIN_EMAIL`: Opcionalmente podemos especificar un email y password para
  el usuario admin (root). Si estos detalles están presentes la aplicación se
  asegurará que exista el usuario y que tenga permisos de administrador. Valor
  por defecto `admin@localhost`.
* `ADMIN_PASSWORD`: Si hemos especificado un `ADMIN_EMAIL`, debemos pasar
  también una contraseña para el usuario admin. Valor por defecto: `changeme`.


***


### Deployment

La aplicación está configurada con `docker-compose` para que pueda ser desplegada sin dificultades en cualquier entorno, al tener dos servidores corriend sobre una misma configuración, se expone los servicios
en diferentes puertos.

Se crea lun servidor en la nube (VPS), se accede a través del `ssh`, clonar repositorio y ejecutar
`docker-compose up` para levantar la aplicación, y quedan online y accesible.

* Heroku:
  - https://appi-burger-queen-client.herokuapp.com/

* AWS:
  - IPv4 Public IP : 18.191.176.140
  - Public DNS (IPv4) : ec2-18-191-176-140.us-east-2.compute.amazonaws.com


