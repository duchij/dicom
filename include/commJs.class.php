<?php


class commJs {
    
    
    
    function __construct(){
        //parent::init();
    }
    
    public function commJs_result($status,$data)
    {
        return array("status"=>$status,"result"=>$data);
    }
    
    
    private function parseJsonData($data,$client)
    {
        $result = null;
        
        if ($client == "json"){
          
          $result = array("request"=>$data["request"]);
           
          if (is_array($data)){
              $result["callClass"] = $this->getPathClassModule($data["path"]);
              $result["status"] = true;
          }
           
          if (is_string($data)){
               
              $inData = json_decode($data,true);
               
              if ($inData==NULL){
                  $result["status"] = FALSE;
                  $result["result"] = "BAD Encoded JSON request in string";
              }
              else {
                  $result["callClass"] =$this->getPathClassModule($data["path"]);
                  $result["status"] = true;
              }
          }
      } 
      if ($client =="rjson") {
          
          
          $inData = json_decode($data,true);
          
          if ($inData==NULL){
              $result["status"] = FALSE;
              $result["result"] = "BAD Encoded JSON request in string";
          }
          else {
              
              if (isset($inData["multi"])){
                  foreach ($inData["multi"] as &$row){
                    if (is_array($row)){
                        
                        $result["QUEUE"][$row["id"]] = array(
                            "request"=>$row["request"],
                            "callClass"=>$this->getPathClassModule($row["path"]),
                            "id"=>$row["id"]
                        );
                        
                    }
                      
                  }
              }
              else{
                  $result["request"] = $inData["request"];
                  $result["callClass"] = $inData["path"];
              }
              
              
//               $result["request"] = $inData["request"];
//               $result["callClass"] =$this->getPathClassModule($inData["path"]);
              $result["status"] = true;
          }
          
      } 
        
        return $result;
    }
    
    private function getPathClassModule($path)
    {
        $pathArr = explode("/",$path);
        $pathLn = count($pathArr);
        
        $class = $pathArr[$pathLn-1];
        
        unset($pathArr[$pathLn-1]);
        
        $resPath = join("/",$pathArr);
                
        return array("modulePath"=>$resPath,"methodCall"=>$class);
    }
    
    /***
     * Funkcia vracia Data podla JSON stringu
     * @param array $data (path=odkaz na metodu triedy v subore .class.php, request= data ako pole co posielame)
     * 
     * echo json_encoded (status = TRUE/FALSE, result = pole vysledkov) 
     * 
     */
    public function getRespond($data,$client)
    {
        $result = $this->parseJsonData($data,$client);
        
        //$this->avh($result,ime3);
        
        $respond = null;
        if ($result["status"]){
            
            if (isset($result["QUEUE"])){
                
                foreach ($result["QUEUE"] as &$row ){
					
                    $module = $row["callClass"]["modulePath"];
                    
                    $classCall = $this->loadClass($module);
                
                    if ($classCall==NULL)
                    {
                        $respond[$row["id"]]=array(
                            "status"    =>FALSE,
                            "result"     =>"MODULE/CLASS: ".$module." not exists !!!"
                        );
                    }
                    else{
                        $fnc = $row["callClass"]["methodCall"];
                
                        if (method_exists($classCall, $fnc)) {
                
                            $res = $classCall->$fnc($row["request"]);
                
                            $respond[$row["id"]] = array(
                                "status"=>  $res["status"],
                                "result"=>  $res["result"],
                                "id"=>$row["id"]
                            );
                        }
                        else {
                            $respond[$row["id"]] = array(
                                "status" => FALSE,
                                "result" => "Method : ".$fnc." not exists !!!!",
                                "id"=>$row["id"]
                            );
                        }
                    }
                }
            }
            else{
                $module = $result["callClass"]["modulePath"];
                $classCall = $this->loadClass($module);
                
                if ($classCall==NULL)
                {
                    $respond=array(
                        "status"    =>FALSE,
                        "result"     =>"MODULE/CLASS: ".$module." not exists !!!"
                    );
                }else{
                    $fnc = $result["callClass"]["methodCall"];
                    
                    if (method_exists($classCall, $fnc)) {
                    
                        $res = $classCall->$fnc($result["request"]);
                    
                        $respond = array(
                            "status"=>  $res["status"],
                            "result"=>  $res["result"],
                        );
                    }
                    else {
                        $respond= array(
                            "status" => FALSE,
                            "result" => "Method : ".$fnc." not exists !!!!",
                        );
                    }
                }
            }
        }
        else{
            $respond = array(
                "status"        => FALSE,
                "result"         => "Error Data not parsed "
            );
        }
       
        echo json_encode($respond);
    }
    
    private function loadClass($module)
    {
    
        if (isset($GLOBALS[$module])) {
            return $GLOBALS[$module];
        }
        else{
            $class = require_once INCLUDE_DIR.$module.".class.php";
    
            $obj = new $class();
            $GLOBALS[$module] = $obj;
    
            return $obj;
        }
    }
    
    
}
return "commJs";
?>