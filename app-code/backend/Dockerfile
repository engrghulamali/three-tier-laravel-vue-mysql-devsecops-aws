# ----------------------------------------
# Stage 1: Build Laravel dependencies
FROM php:8.2-fpm-alpine AS build

# Install dependencies and PHP extensions
RUN apk add --no-cache \
    bash \
    git \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    libxpm-dev \
    libzip-dev \
    oniguruma-dev \
    zip \
    unzip \
    autoconf \
    build-base

RUN docker-php-ext-configure gd --with-jpeg --with-webp --with-xpm && \
    docker-php-ext-install gd pdo pdo_mysql zip bcmath mbstring opcache

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set work directory
WORKDIR /var/www

# Copy Laravel application
COPY . .

# Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set permissions
RUN chown -R www-data:www-data storage bootstrap/cache && \
    chmod -R 775 storage bootstrap/cache && \
    chmod +x artisan


# ----------------------------------------
# Stage 2: Production container
FROM php:8.2-fpm-alpine

# Install dependencies: nginx, supervisor, PHP extensions
RUN apk add --no-cache \
    bash \
    nginx \
    supervisor \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    libxpm-dev \
    libzip-dev \
    oniguruma-dev \
    zip \
    unzip

RUN docker-php-ext-configure gd --with-jpeg --with-webp --with-xpm && \
    docker-php-ext-install gd pdo pdo_mysql zip bcmath mbstring opcache

# Set work directory
WORKDIR /var/www

# Copy built app from previous stage
COPY --from=build /var/www /var/www

# Copy configuration files
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./supervisord.conf /etc/supervisord.conf

# Final permissions
RUN chown -R www-data:www-data storage bootstrap/cache && \
    chmod -R 775 storage bootstrap/cache

# Expose HTTP port
EXPOSE 80

# Launch Supervisor to run nginx and php-fpm
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
