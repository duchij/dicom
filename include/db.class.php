<?php


class db {
    var $db;
    var $log;
    
    function __construct(){
		
        if (isset($GLOBALS["log"])){
            $this->log = &$GLOBALS["log"];
        }else{
            $this->log = new log();
        }
		
		try{
			$this->db = new PDO("sqlite:".SQL_DB);
		}
        catch (PDOException $e)
		{
			echo $e->getMessage();
			$this->log->logData($e->getMessage(),false,"chyba v inicializacii db");
			//exit;
		}
		
		//echo "ll";
        
    }
    
    function table($query){
        
        $results = $this->db->query($query);
        $table = array();
        $i=0;
        
        if ($results){
            while ($row = $results->fetch(PDO::FETCH_ASSOC))
            {
                $table[$i] = $row;
                $i++;
            } 
            $result["status"]= true;
            $result["table"] = $table;
            
        }
        else{
            $result["status"] = false;
			$tmp = $this->db->errorInfo();
            $result["msg"] = $tmp[2];
            
        }
        return $result;
            
    }
    
    function execute($query)
    {
		//$query = $this->db->quote($query);
        $res = $this->db->exec($query);
        
        if ($res){
            return array("status"=>true,"result"=>"deleted");
        }
        else
        {
            $tmp = $this->db->errorInfo();
            return array("status"=>false,"result"=> $tmp[2]);
        }
    }
    
    function update($data,$table,$updateItem,$updateId){
        $result = array();
        $setColVal = array();
        
        foreach ($data as $key=>$value){
            $escStr = trim($value);
            array_push($setColVal,"{$key}='{$escStr}'");
        }
        $valStr = join(",",$setColVal);
        
        $query = sprintf("UPDATE %s SET %s WHERE %s=%d",$table,$valStr,$updateItem,$updateId);
       // $query = $this->db->quote($query);
        $res = $this->db->exec($query);
        
        if ($res){
            return array("status"=>true,"result"=>"ok");
        }
        else{
			$tmp = $this->db->errorInfo();
            return array("status"=>false,"result"=>$tmp[2]);
        }
        
        
    }
    
    function row($query)
    {
		if (strpos($query,"LIMIT 1")==false){
            $query." LIMIT 1";
        }
        
        $this->log->logData($query,false,"row sql query");
        
        $results = $this->db->query($query);
        $this->log->logData($results);
        if ($results){
            return $results->fetch(PDO::FETCH_ASSOC);
        }
        else{
            $tmp = $this->db->errorInfo();
            $this->log->logData($tmp[2],fasle,"error in row");
            return false;
        }
    }
    
    function buildSql($string,$data)
    {
        //foreach ($data as $key=>$value)
    }
    
    
    function insert_row($table,$data,$lastId = false)
    {
        $result = array();   
        $cols = array();
        $values = array();
        
        foreach ($data as $key=>$value)
        {
            array_push($cols,$key);
            
            $escStr = trim($value);
            array_push($values,"'{$escStr}'");
        }
        
        $colsStr = join(",",$cols);
        $valStr = join(",",$values);
        
        
        $sql = sprintf("INSERT INTO %s (%s) VALUES(%s)",$table,$colsStr,$valStr);
		//$sql = $this->db->quote($sql);
        $res = $this->db->exec($sql);
        
        
        if ($res){
            $result["status"] = true;
            if ($lastId){
                $result["lastId"] = $this->db->lastInsertId();
            }
        }
        else{
            $result["status"] = false;
            $tmp = $this->db->errorInfo();
            $result["msg"] = $tmp[2];
            $result["sql"] = $sql;
        }
        
        return $result;
        
    }
}

?>