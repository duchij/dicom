<?php
require_once INCLUDE_DIR."orthanc.class.php";

class dicom extends main {

    /**
     * @var object $OT orthanc manipulating class
     */
    var $ot;


    function __construct(){
        parent::__construct();

        $this->ot = new orthanc();
    }


    function parseStudyDate($date){
        $year = substr($date, 0, 4);
        $month = substr($date,4,2);
        $day = substr($date,6,2);
        return "{$day}.{$month}.{$year}";
    }

    function parseStudyTime($time){
        $timeArr = explode(".",$time);
        $hour = substr($timeArr[0],0,2);
        $min = substr($timeArr[0],2,2);
        $sec = substr($timeArr[0],4,2);

        return "{$hour}:{$min}:{$sec}";
    }

    function getPatients()
    {
        $res = $this->ot->getPatientsDbData();
        //var_dump($res);
        $this->smarty->assign("data",$res["table"]);
        $this->smarty->display("main.tpl");
    }

    function getStudyData($pId)
    {
       $data =  $this->ot->getPatientData($pId);
       //$this->smarty->assign("patientData",$data['MainDicomTags']);

        //$study = $this->getCo

       foreach ($data["Studies"] as $key=>$value) {
           $data["Studies"][$key] = $this->ot->getStudyByID($value);

           foreach ($data["Studies"][$key]["Series"] as $key2=>$value2){
               $data["Studies"][$key]["Series"][$key2] = $this->ot->getSeriesData($value2);
           }
       }

//        $this->ot->debug($data);

       $this->smarty->assign_by_ref("studiesData",$data);
       $this->smarty->display("series.tpl");
    }

    function getSeriesData($id,$createVideo=false)
    {
        $seriesData = $this->ot->getSeriesData($id);
        $extension = "jpg";

        //$this->ot->debug($seriesData);

        $modality = $seriesData["MainDicomTags"]["Modality"];

        if (($modality == "CT" || $modality=="MR" || $modality=="PT") && $createVideo){

            $vidData = $this->ot->createVideoFromSeriesInstance($seriesData);

            $this->smarty->assign("video",$vidData["file"]);
            $this->smarty->assign_by_ref("seriesData",$seriesData);
            $this->smarty->display("showserie.tpl");
        }
        else
        {
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

            if ($picData!=FALSE)
            {
                $this->smarty->assign_by_ref("picData",$pictures);
                $this->smarty->assign_by_ref("seriesData",$seriesData);
                $this->smarty->display("showserie.tpl");
            }
            else {
                echo "error";
            }
        }
    }


    function queryAndRetrieve1()
    {
        $this->smarty->display("query.tpl");
    }

    function queryAndRetrieve2($data)
    {
        $this->smarty->assign("postData",$data);

        $queryObject = array(
            "Level"=>"Study",
            "Query"=>array(
                "StudyDate"     =>$this->setDicomDate(trim($data["studyDate"])),
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


        $res = $this->ot->queryAndRetrieve($queryObject,"TOMOCON");

        $this->ot->debug($res);

        if ($res["status"])
        {
            $this->smarty->assign("QRData",$res["result"]);
        }
        else {
            $this->smarty->assign("Error",$res["result"]);
        }

        $this->smarty->display("query.tpl");
    }




    /**
     * Generates dicom date format correspondig to text...
     * @param string $idf eg. tooday, yesterday etc....
     * @return string $result in dicom format yyyymmdd-
     */

    public function setDicomDate($idf)
    {
        $result="";
        $dt = new DateTime();
        switch ($idf){
            case "today":
                $result=date("Ymd");
                break;
            case "yesterday":
                $tmpD = $dt->modify("-1 day");
                $result = $tmpD->format("Ymd-");
                break;
            case "lastWeek":
                $tmpD = $dt->modify("-7 day");
                $result = $tmpD->format("Ymd-");
                break;
            case "lastMonth":
                $tmpD = $dt->modify("-30 day");
                $result = $tmpD->format("Ymd-");
                break;
            case "anyDate":
                $result="*";
                break;
        }

        return $result;
    }

    function retrieveAllPatients($data)
    {
        $this->ot->moveAllQRPatients($data, "OCLIENT");
    }

    function retrievePatient($data)
    {
        $this->ot->moveQRData($data, "OCLIENT");
    }

    function searchOrthanc($data)
    {
        $query="";
        if (isset($data["queryDate"]) && strlen(trim($data["queryDate"]))>0){

            $query = $data["queryDate"];
        }else{
            if (isset($data["query"]))
            {
                if (strpos($data["query"],"*")===false){
                    $query = $data["query"]."*";
                }else{
                    $query = $data["query"];
                }
            }
        }
        
        
        if (isset($query))
        {
            if (strpos($query," ")!==false){
                $tmp = explode(" ",$query);
                $query = trim($tmp[0])."*";
            }
            if (preg_match('/^bn[0-9]{10}$/', $query)){
                $query = str_replace("bn", "", $query);
                $res = $this->ot->searchOrthancPatientID($query);
                if ($res["status"]){
                    $patientData[] = $res["result"];
                }
            }
            if (preg_match('/^[a-zA-Z]+\*$/',$query)){
                $res = $this->ot->searchOrthancPatientName($query);
                if ($res["status"]){
                    $patientData = $res["result"];
                }
            }
            if (preg_match('/^[a-zA-Z]+$/',$query)){
                $res = $this->ot->searchOrthancPatientName("{$query}*");

                if ($res["status"]){
                    $patientData = $res["result"];
                }
            }
            if (preg_match('/^[0-9]{8}$/',$query)){
                $res = $this->ot->searchOrthancBYDate($query);
                if ($res["status"]){
                    $patientData = $res["result"];
                }
            }
            if (!isset($patientData)){
                $this->smarty->assign("noMatch","Nenajdené žiadne štúdie....");
                $this->smarty->display("series.tpl");
                exit;
            }
            if (is_array($patientData) && count($patientData) > 0){

                foreach ($patientData as &$patient){

                    $patient["MainDicomTags"]["PatientName"] = str_replace("^", " ", $patient["MainDicomTags"]["PatientName"]);
                    foreach ($patient["Studies"] as &$study){

                        $res = $this->ot->getStudyByID($study);

                        if ($res["status"]===false){
                            return $res;
                        }

                        $study = $res["result"];
                        $study["MainDicomTags"]["StudyDate"] = $this->parseStudyDate($study["MainDicomTags"]["StudyDate"]);
                        $study["MainDicomTags"]["StudyTime"] = $this->parseStudyTime($study["MainDicomTags"]["StudyTime"]);

                        foreach ($study["Series"] as &$serie){
                            $res = $this->ot->getSeriesData($serie);

                            if ($res["status"]===false){
                                return $res;
                            }
                            $serie = $res["result"];
                        }
                    }
                }
                $this->smarty->assign_by_ref("result",$patientData);
            }else{
                $this->smarty->assign("noMatch","Nenajdené žiadne štúdie....");
            }

            $this->smarty->display("series.tpl");
        }
        else {
            $this->smarty->display("searchP.tpl");
        }

    }



    /**
     * Function takes argument filterDate=last_NUMBER_days/months/years and prepares the dicomQuery which then sends to PACS server
     * Beware if you take a wide range it can take a lot of time to download all queries from pacs server....
     * @param string $request example: filterDate=last_3_months (query and retreieves studies from last 3 months)
     */

    function autoQueryRetrieve($request)
    {
        $dicomDate="";
        $dicomTime="";

        if (isset($request["filterDate"])&&!empty($request["filterDate"])){

            $match  = preg_match('/^([a-z]+)_([0-9]{1,2})_([a-z]+)$/',$request["filterDate"],$data);
            if ($match){

                $timeOffset = $data[1];
                $timeCount = $data[2];
                $timeName = $data[3];

                $dt = new DateTime();
                $date = $dt->modify("-{$timeCount} {$timeName}");
                $dicomDate = $date->format("Ymd-");
            }
            else{
                $this->log->logData("Bad filterDate format",false,"Bad filter",true);
                exit;
            }
        }else{
            $dicomDate = date("Ymd-");
        }

       if (isset($request["filterTime"])&&!empty($request["filterTime"])){

            $match  = preg_match('/^([a-z]+)_([0-9]{1,3})_([a-z]+)$/',$request["filterTime"],$data);

            if ($match){

                $timeOffset = $data[1];
                $timeCount = $data[2];
                $timeName = $data[3];

                $dt = new DateTime();
                $date = $dt->modify("-{$timeCount} {$timeName}");
                $dicomTime = $date->format("Hi-");

            }
            else{
                 $this->log->logData("Bad filterTime format",false,"Bad filter",true);
                 exit;
            }
        }

        $dicomQuery = array(
                "Level"=>"Study",
                "Query"=>array("StudyDate"=>$dicomDate,"StudyTime"=>$dicomTime,"PatientName"=>""),
        );


        $result = array();
        $this->log->logData("Starting QR Operation",false);

        $res = $this->ot->queryAndRetrieve($dicomQuery, "TOMOCON");


        if ($res["status"]){
            $this->log->logData($result,true,"QR Result");
            $result["queryRetrieveData"] = $res["result"];

            $qrData = array();

            foreach ($res["result"] as $row){

                $qCont = $this->ot->getQueriesContent($row["Path"], $row["retrieveID"]);
                if ($qCont["status"]===false){
                }
                $qrData[]=array(
                    "path"  =>$row["Path"],
                    "rId"   =>$row["retrieveID"],
                    "content" =>$qCont["result"],
                );
            }
            $result["queryRetrieveData"]=$qrData;
            foreach ($qrData as $qrRow){
                //var_dump($qrRow);
                $result["moveData"][]= $this->ot->moveQRData($qrRow, "OSIRKDCH");
            }

            $this->log->logData($result,false,"MOVE OK");
            echo "OK";
            exit;
            //return array("status"=>true,"result"=>$result);
        }
        else{
             $this->log->logData($res["result"],false,"Error in QR OP",true);
            //return array("status"=>false,"result"=>$res["result"]);
        }
    }


    public function searchForm($data){
        $this->smarty->display("searchP.tpl");
    }

    function runAsync($data)
    {
        $this->commJs->getRespond($data["data"], "rjson");
    }


    function delStudies($data){

        $match  = preg_match('/^([a-z]+)_([0-9]{1,3})_([a-z]+)$/',$data["filterDate"],$parsed);

        if ($match){
            $timeOffset =   $parsed[1];
            $timeCount =    $parsed[2];
            $timeName =     $parsed[3];

            $dt = new DateTime();
            $date = $dt->modify("-{$timeCount} {$timeName}");
            $now = date("Ymd");
            $dicomDate = $date->format("-Ymd");
        }else{
            $this->log->logData("Bad filterDate format",false,"Bad filter",true);
            exit;
        }

        $query = array("Level"=>"Study","Query"=>array("StudyDate"=>$dicomDate));

        $res = $this->ot->getStudiesByDate($query);

        if ($res["status"]){
            $studies = $res["result"];

            if (isset($data["dryRun"]) && intval($data["dryRun"]==0)){

                foreach ($studies as $study)
                {
                    $url  = $this->url."/studies/{$study}";
                    $res1 = $this->ot->_c_delete($url, $data);

                    if ($res1["status"]===false){
                        $this->log->logData($data,false,"Error in CURL delete",true);
                        exit;
                    }
                }
            }else{
                echo "Dry Run...";
                var_dump($res);
                exit;
            }
        }
        else{
            $this->log->logData($res,false,"Error getting studies",true);
        }
        echo "OK";
        $this->log->logData("Delete completed sucsesfully",false,"",false);
    }

    function searchByDateTimeModality($data,$modality=NULL)
    {
        //var_dump($modality);
        $dicomDate=$data["dicomDate"];
        $dicomTime=$data["dicomTime"];

        $query = array("Level"=>"Study","Query"=>array());

        if (!empty($dicomDate)){
            $query["Query"]["StudyDate"]=$dicomDate;
        }

        if (!empty($dicomTime)){
            $query["Query"]["StudyTime"]=$dicomTime;
        }

        if ($modality!==NULL){
            $query["Query"]["Modality"]=$modality;
        }
        $res = $this->ot->searchOrthancByQuery($query);
        $patientData = array();
        if ($res["status"]===FALSE){
            $this->smarty->assign("error",$res["result"]);
        }else{
            $studyNum=0;
            foreach ($res["result"] as &$study){
                $res2= $this->ot->getStudyByID($study);
                $study = $res2["result"];

                $study["MainDicomTags"]["StudyDate"] = $this->parseStudyDate($study["MainDicomTags"]["StudyDate"]);
                $study["MainDicomTags"]["StudyTime"] = $this->parseStudyTime($study["MainDicomTags"]["StudyTime"]);
                $serieNum=0;
                foreach ($study["Series"] as &$serie){

                    $res3 = $this->ot->getSeriesData($serie);
                    if ($modality!==NULL && $modality!=="ALL" && strpos($modality,$res3["result"]["MainDicomTags"]["Modality"])!==FALSE){
                        
                         $serie = $res3["result"];
                         
                         $finalData[$studyNum] = $study;
                    }else{
                        if ($modality!=="ALL"){
                            unset($study["Series"][$serieNum]);
                        }
                    }

                    if ($modality==="ALL"){
                        $serie = $res3["result"];
                    }
                    $serieNum++;
                }
                if ($modality==="ALL"){
                    $finalData[] = $study;
                }
                $studyNum++;
            }

              // var_dump($finalData);
            $this->smarty->assign("parameter",$data["parameter"]);
            $this->smarty->assign_by_ref("result",$finalData);
        }
        $this->smarty->display("searchRes.tpl");
    }

    function toDay(){
        $data = array("dicomDate"=>date("Ymd"),"dicomTime"=>"");
        $data["parameter"] = "Dnes";
        $this->searchByDateTimeModality($data,"ALL");
    }

    function toDayXA(){
        $data = array("dicomDate"=>date("Ymd"),"dicomTime"=>"");
        $data["parameter"] = "Dnes XA";

        $this->searchByDateTimeModality($data,"XA");
    }

    function todayCR(){
        $data = array("dicomDate"=>date("Ymd"),"dicomTime"=>"");
        $data["parameter"] = "Dnes RTG";

        $this->searchByDateTimeModality($data,"CR");
    }

    function yesterdayXA(){
        $dt = new DateTime();
        $yesterday = $dt->modify("-1 day");
        $yStr = $yesterday->format("Ymd");
        $data = array("dicomDate"=>$yStr,"dicomTime"=>"");
        $data["parameter"] = "Včerajšie XA";

        $this->searchByDateTimeModality($data,"XA");
    }

    function lastHour()
    {
        $dt = new DateTime();
        $hourDt = $dt->modify("-1 hour");
        $hour = $dt->format("Hi-");
        $today = date("Ymd");
        $data = array("dicomDate"=>$today,"dicomTime"=>$hour);
        $data["parameter"] = "Posledná hodina";

        $this->searchByDateTimeModality($data,"ALL");
    }

}
?>