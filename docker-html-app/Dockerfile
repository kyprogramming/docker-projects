# Use a lightweight web server image , alpine - smallest in size and performance oriented
FROM nginx:alpine

# Set the working directory inside the container
WORKDIR /usr/share/nginx/html

# Copy the HTML, CSS, and JavaScript files into the container
COPY . /usr/share/nginx/html

# install dependencies inside the container
# RUN npm install 

# Expose port 80 to the outside world
EXPOSE 80

# Command to start the nginx server
CMD ["nginx", "-g", "daemon off;"]