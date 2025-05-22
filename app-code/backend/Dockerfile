# Stage 1: Composer install and build dependencies
FROM php:8.2-fpm-alpine AS build

# Install system dependencies and PHP extensions needed by Laravel
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

# Install PHP extensions
RUN docker-php-ext-configure gd --with-jpeg --with-webp --with-xpm && \
    docker-php-ext-install gd pdo pdo_mysql zip bcmath mbstring opcache

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy composer files and install dependencies
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Copy application source code
COPY . .

# Set permissions for Laravel storage and bootstrap cache
RUN chmod +x artisan && \
    chown -R www-data:www-data storage bootstrap/cache && \
    chmod -R 775 storage bootstrap/cache

# Stage 2: Production image
FROM php:8.2-fpm-alpine

# Install system dependencies and PHP extensions (same as build stage)
RUN apk add --no-cache \
    bash \
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

# Copy installed app from build stage
COPY --from=build /var/www /var/www

# Set working directory
WORKDIR /var/www

# Set permissions again (just to be safe)
RUN chown -R www-data:www-data storage bootstrap/cache && \
    chmod -R 775 storage bootstrap/cache

# Expose port 9000 (default PHP-FPM port)
EXPOSE 9000

# Start PHP-FPM server
CMD ["php-fpm"]
