# Imagen base de node
FROM node:16.15.0

# Creacion de un directorio
WORKDIR /usr/src/app

# Copia del codigo dentro del contenedor de Docker
COPY . .

# Instalación de módulos necesarios
RUN npm install package.json
RUN npm install -g truffle@5.5.9

# Exposicion de un puerto del contenedor de Docker
EXPOSE 3000

# Entrypoint para la ejecucion de la DApp
ENTRYPOINT [ "sh" ]

