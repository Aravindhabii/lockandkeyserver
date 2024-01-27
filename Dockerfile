FROM node:17

#working dir
WORKDIR /app

#Copy package.jsonfile
COPY package.json ./

#Install dependencies
RUN npm install

#Copy all files
COPY . .

#Expose port 3000
EXPOSE 8080

#Run the app
CMD ["npm", "start"]
