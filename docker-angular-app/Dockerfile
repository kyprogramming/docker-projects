# Use a lightweight web server image , alpine - smallest in size and performance oriented
FROM node:alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the HTML, CSS, and JavaScript files into the container
COPY . /usr/src/app

# install dependencies inside the container
RUN npm install -g @angular/cli
RUN npm install 

# Expose port 4200 to the outside world
EXPOSE 4200

# Command to start the nginx server
CMD ["ng", "serve", "--host", "0.0.0.0"]