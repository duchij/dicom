<?php
/**
 * @author bduchaj
 *
 */
class main {
    
   

    /**
     * @var log $log logovacie funkcie
     */
    var $log;

    /**
     * @var smarty $smarty work with smarty template engine
     */
    var $smarty;

    /**
     * @var $commJs  Function with ascynv callbacks
     */
    var $commJs;

    /**
     * @var db the SQLlite object....
     */
    var $db;

    var $url;

    function __construct(){

        $this->log = new log();

        $this->db = new db();

        $this->smarty = new Smarty();

        $this->smarty->template_dir = APP_DIR."templates/";
        $this->smarty->compile_dir  = APP_DIR."../smarty/templates_c/";
        $this->smarty->config_dir   = APP_DIR."../smarty/configs/";
        $this->smarty->cache_dir    = APP_DIR."../smarty/cache/";

        $this->smarty->assign("orthancUrl",O_URL);

        $this->url = O_URL;
        
        $this->smarty->assign("webUrl",WEB_URL);

        $this->smarty->assign("router",ROUTER);

        $this->commJs = new commJs();
        

    }
    /**
     * Modifies return parameters
     *
     * @param boolean $status
     * @param mixed $result
     * @return array($status,$result);
     */
    public function resultStatus($status,$result){
        return array("status"=>$status,"result"=>$result);
    }

    public function resultData($resultStatus){
        return $resultStatus["result"];
    }

    public function loadObject($name){
        if (isset($GLOBALS[$name])){
            $class = &$GLOBALS[$name];
        }else{
            if (file_exists(INCLUDE_DIR.$name.".class.php")){

               require_once INCLUDE_DIR.$name.'.class.php';

               $class = new $name();
            }else{
                return NULL;
            }
        }
        return $class;
    }

    /**
     *
     * Funkcia zavola triedu a instancuje dla formularu ktory ju zavolal a odovzda jej webovsky request.
     *
     * @param array $data REQUEST data
     *
     * @todo toto treba obohatit a furu veci :)
     */
    public function run($data)
    {
        
        if (isset($data["x"])&& $data["x"]=="1"){
            $this->runAsync($data);
            return true;
        }
        
        if (isset($data["c"])) {

            $classStr = $data["c"];

            if (file_exists(INCLUDE_DIR.$classStr.".class.php"))
            {
                if (isset($GLOBALS[$classStr])){
                     $class = $GLOBALS[$classStr];
                }else{
                    require_once INCLUDE_DIR.$classStr.'.class.php';
                    $class = new $classStr();
                }
                if (isset($data["m"])){
                    $method = $data["m"];
                    if (method_exists($class, $method)){
                        $class->$method($data);
                    }else{
                        $this->smarty->assign("gError","Method {$method} in class {$classStr} Not Exists !!!!");
                        $this->smarty->display("main.tpl");
                        exit;
                    }

                }
            }
            else
            {
                echo "no such class exiting";
                exit;
            }

        }
        else  //fallback trieda
        {
           $this->smarty->display("main.tpl");
           //echo "No sync class defined exiting";
        }
    }
    
    function runAsync($data){
        $this->commJs->getRespond($data["data"],"rjson");
    }
    
    function showErrorMsg($error){
        $this->smarty->assign("error",$error);
        $this->smarty->display("main.tpl");
        exit;
    }
    

}

?>