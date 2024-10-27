# 使用官方的 PHP 8.1 與 Apache 基礎映像
FROM php:8.1-apache

# 更新系統並安裝必要的依賴庫
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

# 設置語言環境
RUN echo "zh_TW.UTF-8 UTF-8" > /etc/locale.gen && \
    echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen && \
    locale-gen && \
    update-locale LANG=zh_TW.UTF-8

# 安裝國際化支持
RUN apt-get update && \
    apt-get install -y libicu-dev && \
    docker-php-ext-configure intl && \
    docker-php-ext-install intl

# 安裝並啟用 exif 擴展
RUN docker-php-ext-install exif && \
    docker-php-ext-enable exif

# 配置並啟用 opcache
RUN docker-php-ext-configure opcache --enable-opcache && \
    docker-php-ext-install opcache

# 設置 PHP 配置
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

# 啟用 Apache 的 mod_rewrite 和 mod_headers 模塊
RUN a2enmod rewrite && a2enmod headers

# 設置工作目錄
WORKDIR /var/www/html

# 創建 moodledata 目錄並設置權限
RUN mkdir -p /var/www/moodledata && \
    chown -R www-data:www-data /var/www/moodledata && \
    chmod -R 770 /var/www/moodledata

# 複製本地文件到容器中的工作目錄
COPY . /var/www/html

# 設置工作目錄的權限
RUN chown -R www-data:www-data /var/www/html

# 暴露 80 端口
EXPOSE 80

# 啟動 Apache
CMD ["apache2-foreground"]
