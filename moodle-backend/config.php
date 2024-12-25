<?php  // Moodle configuration file

unset($CFG);
global $CFG;
$CFG = new stdClass();
$CFG->lang = 'en';

// 数据库设置
$CFG->dbtype    = 'mysqli';  // 数据库类型（MySQL 或 MariaDB）
$CFG->dblibrary = 'native';
$CFG->dbhost    = 'db';  // 将数据库主机名修改为 'db'
$CFG->dbname    = 'moodle_db';
$CFG->dbuser    = 'moodleuser';
$CFG->dbpass    = 'yourpassword';
$CFG->prefix    = 'mdl_';
$CFG->dboptions = array (
  'dbpersist' => 0,
  'dbport' => '',  // 如果使用默认的 MySQL 端口（3306），则留空
  'dbsocket' => '',
  'dbcollation' => 'utf8mb4_unicode_ci',
);

// 网站地址和数据目录
$CFG->wwwroot   = 'http://localhost:8080/moodle';  // 您的 Moodle 网站 URL
$CFG->dataroot  = '/var/www/moodledata';  // Moodle 数据目录的路径
$CFG->admin     = 'admin';  // 管理目录

$CFG->directorypermissions = 0755;  // 目录权限设置
$CFG->corsalloweddomains = array("https://eduai.andy-lu.dev");  // 允许的 CORS 域名

$CFG->authloginviaemail = true;

// 调试设置（已关闭）
@error_reporting(0);
@ini_set('display_errors', '1');
$CFG->debug = 32767;
$CFG->debugdisplay = 1;

require_once(__DIR__ . '/lib/setup.php');

// 文件末尾不需要 PHP 结束标签，防止空白字符的问题
