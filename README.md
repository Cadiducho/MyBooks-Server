# MyBooks - Server

El servidor gestiona todas las conexiones a la base de datos desde cualquiera de las aplicaciones que se conecten a la API

## Objetos
* **User**: Usuario, contiene sus datos y puede acceder a bibliotecas
* **Library**: Bibliotecas. Son multiusuario, contienen libros
* **Book**: Libros. Únicos en cada biblioteca, se presupone que son accesibles por todos los usuarios de esa biblioteca
