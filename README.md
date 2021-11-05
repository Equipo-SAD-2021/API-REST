# API-REST

Comunicación en NodeJs - Actividad 3

Transformación del módulo que ofrece la funcionalidad de un carrito en un servicio REST.


## Introducción 🚀

Este seminario forma parte de la asignatura de Servicios y Aplicaciones Distribuidas (SAD) impartida en el Máster Universitario en Ingeniería Informática de la UPV. En esta materia se presentan los principios, aproximaciones y tecnologías disponibles para el desarrollo de servicios y aplicaciones distribuidas. 

En concreto, esta actividad gira alrededor de los servicios REST (transferencia de estado representacional). Se prentende transformar el módulo del carro de compra, implementado en el primer seminario de la asignatura, para que se ofrezca a través de un servicio de API REST. Así pues, se hará uso de POSTMAN, uno de los clientes API REST más comunes.


## Pre-requisitos 📋

El *software* necesario para ejecutar el proyecto es:

* **Node** - Entorno de ejecución utilizado que también ara uso de los siguientes paquetes:
  * **express** - Componente backend diseñado para crear aplicaciones web y API, facilitando el uso de peticiones `get`, `put` y `delete`
  * **axios** - Cliente HTTP simple basado en promesas
* **MongoDB** - Base de datos utilizada

Los cuales se han ejecutado en un entorno de desarrollo virtualizado construido con **Vagrant** utilizando **VirtualBox**. Este proceso se detallará en la **Instalación**.


## Instalación 🔧

Partiendo de los VagrantFiles que se nos proporcionó en la asignatura, establecemos una máquina Vagrant cuya configuración está disponible en el directorio `vagrant_config` del repositorio. Para poner esta máquina en funcionamiento se deben seguir los siguiente comandos:

Primero lanzamos el entorno dentro de la carpeta `vagrant_config`:
```
vagrant up
vagrant ssh
```

En este entorno se dispone de una carpeta compartida `/vagrant` que comunica el _host_ con la máquina virtual. Una vez iniciada la máquina, utilizaremos esta carpeta como directorio de trabajo, puesto que nos permitirá acceder desde los ficheros desde los dos puntos. Hecho esto, se instalarán los paquetes necesarios que aparecen en `package.json` mediante la siguiente intrucción:
```
npm install
```

Tras esta instrucción ya tenemos la instalación lista. 

Es importante mencionar que, aunque en el repositorio aparece la carpeta de `vagrant_config` al mismo nivel que los archivos de código para facilitar su organización, en la instalación local se debe tener el **contenido** de `vagrant_config` al mismo nivel que el código para poder disponer de este en `/vagrant`.


## Desarrollo 🛠️
Además de las carpetas `tests` y `vagrant_config`se distinguen dos ficheros que vertebran el proyecto:

* **service_registry**: Servidor donde los servicios se registran para su posterior utilización
* **services**: Actividades que buscan responder las necesidades de un cliente. En este seminario son la base de datos, `database`, y el carrito de la compra, `shoppingcart`

En conjunto permiten realizar las siguientes operaciones sobre un carro:

* Añadir un producto
* Eliminar un producto
* Comprobar su contenido

Además, también se permite Añadir y Eliminar un carro de la compra.


## Pruebas 🔩

Se ha creado una carpeta con nombre `tests` cuyo propósito es la comprobación de la funcionalidad de la actividad realizada. Para realizar la prueba se debe ejecutar desde el interior de la carpeta la orden:
```
npm test
```
Las pruebas se recogen en `CarroCompraTest.js` mientras que `ShoppingCartLocal.js` sirve de interfaz a la API-REST.


## Referencias 📚

A continuación se adjuntan enlaces que han servido de referencia en el desarrollo:

* [Crear un UUIDv4](https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid/2117523#2117523)
* [Serializar parámetros de una consulta](https://stackoverflow.com/questions/1714786/query-string-encoding-of-a-javascript-object/1714899#1714899)


## Autores ✒️

* **Antonio Martínez Leal** - [AntonioM15](https://github.com/AntonioM15)
* **Pablo Moreira Flors** - [pabmoflo](https://github.com/pabmoflo)
* **Borja Sanz Gresa** - [BorjaSanz11](https://github.com/BorjaSanz11)
