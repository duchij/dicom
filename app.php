<?php
header("Access-Control-Allow-Origin: *");
DEFINE("APP_DIR",__DIR__.DIRECTORY_SEPARATOR);

$settings = yaml_parse_file(APP_DIR."/settings/main.yaml");

DEFINE("SQL_DB", $settings["storage_url"]);
DEFINE("O_URL",$settings["main_server"]); //Main DICOM/ORTHANC Server
DEFINE("O_C_URL",$settings["client_server"]); //Client DICOM/ORTHANC
DEFINE("WEB_URL",$settings["web_url"]);
DEFINE("ROUTER",$settings["router"]);
DEFINE("INCLUDE_DIR",__DIR__.DIRECTORY_SEPARATOR."include".DIRECTORY_SEPARATOR);
DEFINE("IM_DIR",$settings["imagemagick_dir"]);
DEFINE("PUBLIC_DIR",__DIR__.DIRECTORY_SEPARATOR."public".DIRECTORY_SEPARATOR);


//require_once INCLUDE_DIR.'orthanc.class.php';
require_once INCLUDE_DIR.'log.class.php';
require_once APP_DIR.'../smarty/Smarty.class.php';
require_once INCLUDE_DIR."commJs.class.php";
require_once INCLUDE_DIR."db.class.php";
require_once INCLUDE_DIR.'main.class.php';
require_once INCLUDE_DIR.'orthanc.class.php';

?>