# Usar una imagen base de Node.js
FROM node:14

# Establecer el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiar los archivos del paquete.json y paquete-lock.json
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Exponer el puerto que tu aplicación utilizará
EXPOSE 3000

# Comando para iniciar la aplicación
CMD [ "node", "server/server.js" ]
