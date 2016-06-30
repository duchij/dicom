<?php


class db{
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
			//$this->db = $this->open(SQL_DB);
		}
        catch (PDOException $e)
		{
			//echo $e->getMessage();
			$this->log->logData($e->getMessage(),false,"chyba v inicializacii db");
			exit;
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
        
        $pattern = "/\[([a-zA-Z_0-9-]+)\.([a-zA-Z_0-9]+)\]/";
        $replacement = "`$1`.`$2`";
        $string = preg_replace($pattern, $replacement, $string);
        
        $pattern = "/\[([a-zA-Z_0-9-]+)\]/";
       
        $replacement = "`$1`";
        $string = preg_replace($pattern, $replacement, $string);
        
        
        foreach ($data as $key=>$value){
            $pattern1 = "/({".$key."\|s)}/";
            
            if (preg_match($pattern1,$string)){
                $replacement = "'".$value."'";
                $string = preg_replace($pattern1, $replacement,$string);
            }
            
            $pattern2 = "/({".$key."\|i)}/";
            
            if (preg_match($pattern2,$string)){
                $replacement = intval($value);
                $string = preg_replace($pattern2, $replacement,$string);
            }
           
            
        }
        
        return $string;
    }
    
    
    function insert_row($table,$data,$lastId = false)
    {
        
       // var_dump($data);
        $result = array();   
        $cols = array();
        $values = array();
        
        foreach ($data as $key=>$value)
        {
            array_push($cols,$key);
            
            var_dump($key);
            //$escStr = trim($value);
            $val = $this->db->quote($value,PDO::PARAM_STR);
            array_push($values,$val);
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
        $this->db = null;
        return $result;
        
    }
    
    
    /**
    * Vlozi pole riadkov do tabulky v transakci s on key update value
    *
    * @param string $table nazov tabulky
    * @param array $data zlozene pole
    *
    * @return multitype:boolean NULL
    */
    public function insert_rows($table,$data,$parameter="")
    {
        $result = array();
        
        $colLen = count($data);
        
        $colArr = array();
        
        $colValArr = array();
        
        
        $col_str = "";
        
        $col_val = "";
        
        $col_update = "";
      
        for ($row=0; $row<$colLen; $row++)
        {
            $tmpArr = array();
            $r=0;
            foreach ($data[$row] as $key=>$value)
            {
                if ($value != NULL)
                {
                    $valTmp = $this->db->quote($value,PDO::PARAM_STR);
                    $tmpArr[$r] = $valTmp;
                }else {
                    $tmpArr[$r]='NULL';
                }
                $r++;

            }
            $colValArr[$row] = "(".implode(",",$tmpArr).")";
        }
        
        $i=0;
        foreach ($data[0] as $key=>$value)
        {
            $colArr[$i] ="`{$key}`";
            $i++;
        }
        $col_str = implode(",",$colArr);
        $col_val = implode(",",$colValArr);
        
        $sql = sprintf("INSERT %s INTO `%s` (%s) VALUES %s",$parameter,$table,$col_str,$col_val);
        
        
        $res = $this->db->exec($sql);
        
        
        if ($res === FALSE)
        {
           
            $result['result'] = $this->db->errorInfo();
            $this->log->logData('Chyba SQL: ' . $sql . ' Error: ' . $result['result'][2],false,"error in insert_rows",true);
            $result['status'] = FALSE;
        }
        else
        {
            $this->log->logData($sql,false,"sql from insert_rows");
            $result['status'] = TRUE;
        }
        $this->db=null;
        return $result;
    }
    
}

?>