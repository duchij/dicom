<?php
require_once INCLUDE_DIR."orthanc.class.php";

class jsOt extends main {
    
    var $ot;

    function __construct()
    {
        parent::__construct();
        
        $this->ot = new orthanc();
    }

    function loadSeries($data)
    {
        $id = $data["id"];

        $seriesData = $this->ot->getSeriesData($id);

        $extension = "jpg";
        $picData = $this->ot->createFilesFromSeriesInstances($seriesData,$extension);
        if (!$picData!=FALSE){
            echo "Error generating pics";
            exit;
        }

        $pictures = array();

        foreach ($seriesData["Instances"] as $instance){
            $pictures[$instance]["bigFile"] = $picData[$instance][$extension]["origFile"];
            $pictures[$instance]["thumbFile"] = $picData[$instance][$extension]["thumbFile"];
        }

        return array("status"=>true,"result"=>$pictures);

    }

    function retrieveAllAsync($data)
    {
        $result = $this->retrieveAllPatients($data);
        return array("status"=>true,"result"=>$result);
    }

    function queryAndRetrieveAsync($data)
    {
        $queryObject = array(
            "Level"=>"Study",
            "Query"=>array(
                "StudyDate"  =>$this->setDicomDate(trim($data["studyDate"])),
            ),
        );

        $queryField = $data["queryField"];

        switch ($queryField){
            case "patientName":
                $queryObject["Query"]["PatientName"] = trim($data["queryText"]);
                break;
            case "patientID":
                $queryObject["Query"]["PatientID"] = trim($data["queryText"]);
                break;
        }
        //$this->ot->debug($queryObject);

        $res = $this->ot->queryAndRetrieve($queryObject,"OSIRKDCH");

        return array("status"=>true,"result"=>$res);

    }

    function autoQueryAndRetrieveAsync($data){
        return $this->autoQueryRetrieve($data);
    }

    function loadSeriesInstancesAsync($data)
    {
        $ot= $this->loadObject("orthanc");
        
        $res= $ot->getSeriesData($data["series"]);
        return $res;
    }
    
    
    function loadDataFromDb($data)
    {
        $series = $data["series"];
        
        $sql = "SELECT [file_location],[file_info] FROM [pic_data] WHERE [series_uuid]={series|s} ORDER BY [order] ASC";
        $rep = array("series"=>$data["series"]);
        
        $sql= $this->db->buildSql($sql, $rep);
        
        $table = $this->db->table($sql);
        
        if ($table["status"]){
            
            foreach ($table["table"] as &$row){
                $row["file_info"] = unserialize($row["file_info"]);
            }
            return array("status"=>true,"result"=>$table["table"]);
        }else{
            return array("status"=>false,"result"=>$table["msg"][2]);
        }
        
        
    }
    
    function moveFromPacs($data)
    {
    	
    	//return var_dump($data);
    	
        
        return $this->ot->moveQRData($data,"OSIRKDCH");
        
    }
    
    

}
return "jsOt";

?>