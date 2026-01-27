FROM nginx:alpine

# Copy static assets from front directory to nginx serving directory
COPY ./front /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
