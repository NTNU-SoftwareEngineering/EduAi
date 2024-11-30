# 使用官方的 PHP 8.1 与 Apache 基础镜像
FROM php:8.1-apache

# 更新系统并安装必要的依赖库
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    libonig-dev \
    libxml2-dev \
    pkg-config \
    unzip \
    zip \
    curl \
    nano \
    git \
    locales \
    default-mysql-client && \
    docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install -j$(nproc) gd pdo pdo_mysql zip mbstring soap mysqli && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# 设置语言环境
RUN echo "zh_TW.UTF-8 UTF-8" > /etc/locale.gen && \
    echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen && \
    locale-gen && \
    update-locale LANG=zh_TW.UTF-8

# 安装国际化支持
RUN apt-get update && \
    apt-get install -y libicu-dev && \
    docker-php-ext-configure intl && \
    docker-php-ext-install intl

# 安装并启用 exif 扩展
RUN docker-php-ext-install exif && \
    docker-php-ext-enable exif

# 配置并启用 opcache
RUN docker-php-ext-configure opcache --enable-opcache && \
    docker-php-ext-install opcache

# 设置 PHP 配置
RUN echo 'max_input_vars = 5000' >> /usr/local/etc/php/conf.d/docker-php-maxinputvars.ini && \
{ \
    echo 'opcache.enable = 1'; \
    echo 'opcache.memory_consumption=128'; \
    echo 'opcache.interned_strings_buffer=8'; \
    echo 'opcache.max_accelerated_files=10000'; \
    echo 'opcache.revalidate_freq=60'; \
    echo 'opcache.fast_shutdown=1'; \
    echo 'opcache.use_cwd = 1';  \
    echo 'opcache.validate_timestamps = 1'; \
    echo 'opcache.save_comments = 1'; \
    echo 'opcache.enable_file_override = 0'; \
} > /usr/local/etc/php/conf.d/opcache-recommended.ini

# 启用 Apache 的 mod_rewrite 和 mod_headers 模块
RUN a2enmod rewrite && a2enmod headers

# 设置工作目录
WORKDIR /var/www/html

# 复制 Moodle 代码到容器中
COPY . /var/www/html/moodle

# 设置权限
RUN chown -R www-data:www-data /var/www/html/moodle

# 创建 moodledata 目录并设置权限
RUN mkdir -p /var/www/moodledata && \
    chown -R www-data:www-data /var/www/moodledata && \
    chmod -R 770 /var/www/moodledata

# 暴露 80 端口
EXPOSE 80

# 启动 Apache
CMD ["apache2-foreground"]
