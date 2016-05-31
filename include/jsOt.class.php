<?php
class jsOt extends main {

    function __construct()
    {
        parent::__construct();
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
        $result= $this->ot->getSeriesData($data["series"]);

        return array("status"=>true,"result"=>$result["Instances"]);
    }


}
return "jsOt";

?>