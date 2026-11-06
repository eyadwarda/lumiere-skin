FROM nginx:alpine

COPY index.html styles.css app.js supabase-config.js supabase-storefront.js admin.html admin.js favicon.ico /usr/share/nginx/html/

EXPOSE 80
