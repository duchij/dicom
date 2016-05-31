<?php

class orthanc extends main {

    /**
     * @var string $cUrl client Orthanc url
     */
    var $cUrl;
    /**
     * @var PDOObject $db sqlite3 PDO object for manipulating Orthanc storage...
     */
    var $db;

    function __construct()
    {
        parent::__construct();
    }

    public function debug($data)
    {
        var_dump($data);
    }


    /**
     * Nacita vsetkych pacientov zo sqlite db ktori su importovani v orthancu
     * v jednej Query
     * @return mixed|mixed[] tabulka je result['table']
     */
    public function getPatientsDbData()
    {
        $sql = "SELECT t_dtags.id,group_concat(t_dtags.value,';') as value,t_resources.publicId
                        FROM MainDicomTags AS t_dtags
                INNER JOIN Resources AS t_resources ON t_resources.internalId = t_dtags.id
                WHERE (t_dtags.tagGroup = 16 AND (t_dtags.tagElement = 16 or t_dtags.tagElement = 32) )
                AND (t_resources.parentId IS NULL)
                GROUP BY t_resources.publicId
                -- SORT BY value
            ";
        $res = $this->db->table($sql);

        return $res;

    }

    /*
     * Function make CURL call to server...
     * $url string $url
     */
    public function _curl_c($url,$postFields=NULL)
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, false);

        if ($postFields!==NULL){
            if (is_array($postFields)){
                $postStr = json_encode($postFields);
                curl_setopt($ch,CURLOPT_POSTFIELDS,$postStr);
            }
            if (is_string($postFields)){
                curl_setopt($ch,CURLOPT_POSTFIELDS,$postFields);
            }
        }
        $result = curl_exec($ch);
        curl_close($ch);
        if ($result===FALSE){
            $errNo = curl_errno($ch);
            return $this->resultStatus(false,curl_strerror($errNo));
        }else{
            return $this->resultStatus(true,json_decode($result,true));
        }
    }



    /**
     * Function creates Query/Retrieve call to PACS a gets the answers, return array with answers...
     * @param array $queryObject Associative Array to JSON for Orthanc
     * @param string $modality modality - the PACS server to be QR
     * @return array(status,result) $result  associative array status FALSE/TRUE result = data to return...
     */
    public function queryAndRetrieve($queryObject,$modality)
    {
        $url = O_C_URL."/modalities/".$modality."/query";

        $res = $this->_curl_c($url,$queryObject);

        if ($res["status"] === FALSE){
            return $res;
        }

        $queryData = $res["result"];

        $url = O_C_URL.$queryData["Path"]."/answers";

        $ansArr = $this->getContent2($url);

        if ($ansArr["status"]===false){
            return $this->resultStatus(false,$ansArr);
        }

        $resData = array();
        foreach ($ansArr["result"] as $key=>$value) {
            $url = O_C_URL.$queryData["Path"]."/answers/".$value."/content";
            $dataTmp = $this->getContent2($url);

            if ($dataTmp["status"]===false){
                return $this->resultStatus(false, $dataTmp["result"]);
            }

            $tmpArr = array();
            foreach ($dataTmp["result"] as $content){
                $tmpArr[$content["Name"]] = $content["Value"];
                $tmpArr["retrieveID"] = $key;
                $tmpArr["Path"] = $queryData["Path"];
            }

            $resData[] = $tmpArr;
        }
        return $this->resultStatus(true, $resData);
    }

    public function moveQRData($data,$modality)
    {
        $url = O_C_URL.$data["path"]."/answers/".$data["rId"]."/retrieve";

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_POSTFIELDS,$modality);
        $result = curl_exec($ch);
        curl_close($ch);

        if ($result===FALSE){
            $er = curl_errno($ch);
            return array("status"=>false,"result"=>curl_strerror($er));
        }

        return array("status"=>true,"result"=>$result);

    }

    public function moveAllQRPatients($data,$modality)
    {
        $url = O_C_URL.$data["path"]."/answers";
        $answers = $this->getContents($url);
        $ansArr = json_decode($answers);

        $result = array();
        foreach ($ansArr as $row)
        {
            $url = O_C_URL.$data["path"]."/answers/".$row."/retrieve";

            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HEADER, false);
            curl_setopt($ch, CURLOPT_POSTFIELDS,$modality);
            $result[$row] = json_decode(curl_exec($ch));
            curl_close($ch);
        }
        return $result;
    }

    public function getPNGContents($url,$includePath = false,$data=array())
    {
        $options  = array(
            "http"=>array(
                'header'  => "Content-type: image/png\r\n",
                'method'  => 'GET',
                'content' =>http_build_query($data),
            ),
        );

        $context = stream_context_create($options);

        $data = file_get_contents($url,$includePath,$context);

        return $data;
    }

    private function createDirStructure($instance)
    {
        $dirName1 = substr($instance, 0,2);
        $dirName2 = substr($instance, 2,2);

        $osDir = PUBLIC_DIR."pictures".DIRECTORY_SEPARATOR.$dirName1.DIRECTORY_SEPARATOR.$dirName2.DIRECTORY_SEPARATOR;
        $webDir = "pictures".DIRECTORY_SEPARATOR.$dirName1.DIRECTORY_SEPARATOR.$dirName2.DIRECTORY_SEPARATOR;
        $result = true;

        if (!file_exists($osDir))
        {
            $result = mkdir($osDir,0777,true);
        }

        return array("status"=>$result,"osDir"=>$osDir,"webDir"=>$webDir);


    }

    public function createVideoFromSeriesInstance($seriesData,$recreateVideo = false)
    {

        $seriesID = $seriesData["ID"];

        $pDir = PUBLIC_DIR."videos".DIRECTORY_SEPARATOR.$seriesID;
        $createFiles = false;

        if (!file_exists($pDir)){
                mkdir($pDir,0777,true);
                $createFiles = true;
        }

        if ($createFiles==true || $recreateVideo==true)
        {
            foreach ($seriesData["Instances"] as $key=>$value){

                $fileName = "img_".$key.".png";
                $fileNameDir = $pDir.DIRECTORY_SEPARATOR.$fileName;
                if (!file_exists($fileNameDir)){
                    $picData = $this->getPNGContents(O_URL."/instances/".$value."/preview");
                    file_put_contents($fileNameDir, $picData);
                }
            }
        }

        $finalName = $pDir.DIRECTORY_SEPARATOR.$seriesID.".flv";
        $flvFile = $seriesID.DIRECTORY_SEPARATOR.$seriesID.".flv";

        if (!file_exists($finalName) || $recreateVideo==true){
            $cmd = sprintf(IM_DIR."ffmpeg -y -start_number 0 -i %s/img_%%d.png -c:v libx264 -pix_fmt yuv420p -vf 'curves=lighter' %s",$pDir,$finalName);
            //echo $cmd;
            exec($cmd,$output,$return_var);
            if ($return_var==0){
                $dirData = glob($pDir."/*.png");
                foreach ($dirData as $file){
                    unlink($file);
                }
            }
            return array("file"=>$flvFile,"output"=>$output,"status"=>$return_var);
        }else{
            return array("file"=>$flvFile,"status"=>0);
        }


    }


    /** Creates PNG/JPG files from ORTHANC with UUID.png/.jpg and 50% smaller with UUID_small.png/jpg
     *
     * @param array $seriesData for the Study
     * @param string $extension (lowerCase) - PNG if no setted, or JPG, files are saved into strctured diretory tree from UUID
     *
     * @return mixed|array $result -  returns arrays Instance->Extension->origFile|thumbFile,
     *          if pictures are newly created returns convert-output and status form ImageMagick, or FALSE if error
     */
    public function createFilesFromSeriesInstances($seriesData,$extension="png")
    {
        $extension = strtolower($extension);

        $result = array();
        foreach ($seriesData["Instances"] as $instance){

           // foreach ($row["Instances"] as $instance){

                $dirData  = $this->createDirStructure($instance);

                if (!$dirData["status"]){
                    return false;
                }

                $picDir = $dirData["osDir"];
                $webDir = $dirData["webDir"];
                $fileName = $picDir.$instance;

                $fileNameExt = sprintf("%s.png",$fileName);

                if (!file_exists($fileNameExt)){

                    $picData = $this->getPNGContents(O_URL."/instances/".$instance."/preview");

                        if (file_put_contents($fileNameExt,$picData)!=FALSE){

                        $command="";
                        $fileTmp  = basename($fileName);
                        switch ($extension){
                            case "png": //resizes the image to 50% of size to png

                                $command = sprintf(IM_DIR."convert %s.png -resize 50%% %s_small.png",$fileName,$fileName);

                                exec($command,$output,$status);

                                $result[$instance][$extension]["resize"]["output"] = $output;
                                $result[$instance][$extension]["resize"]["status"] = $status;

                                $result[$instance][$extension]["origFile"] = $webDir.$fileTmp.".png";
                                $result[$instance][$extension]["thumbFile"] = $webDir.$fileTmp."_small.png";
                                break;
                            case "jpg":
                                $command = sprintf(IM_DIR."convert %s.png %s.jpg",$fileName,$fileName);

                                exec($command,$output,$status);
                                $result[$instance][$extension]["convert"]["output"] = $output;
                                $result[$instance][$extension]["convert"]["status"] = $status;

                                $command = sprintf(IM_DIR."convert %s.jpg -resize 50%% %s_small.jpg",$fileName,$fileName);
                                exec($command,$output,$status);

                                $result[$instance][$extension]["resize"]["output"] = $output;
                                $result[$instance][$extension]["resize"]["status"] = $status;

                                $result[$instance][$extension]["origFile"] = $webDir.$fileTmp.".jpg";
                                $result[$instance][$extension]["thumbFile"] = $webDir.$fileTmp."_small.jpg";

                                break;
                        }
                    }
                    else{
                        return false;
                    }
                }
                else{
                    $fileTmp  = basename($fileName);
                    switch ($extension){
                        case "png":
                            $result[$instance][$extension]["origFile"] = $webDir.$fileTmp.".png";
                            $result[$instance][$extension]["thumbFile"] = $webDir.$fileTmp."_small.png";
                            break;
                        case "jpg":
                            $result[$instance][$extension]["origFile"] = $webDir.$fileTmp.".jpg";
                            $result[$instance][$extension]["thumbFile"] = $webDir.$fileTmp."_small.jpg";
                            break;
                    }
                }
           // }
        }
        return $result;
    }
    /**
     * Gets Content in DICOM Tags from QueryRetrieve procedure
     * @param string $path
     * @param string $id
     * @return associative array
     */
    public function getQueriesContent($path,$id)
    {

        $url = O_C_URL.$path."/answers/".$id."/content";
        return $this->getContent2($url);

    }


    public function saveFileByID($id)
    {
        $url = $this->url."/instances/".$id."/preview";

        return $this->getPNGContents($url);
    }

    private function getContents($url,$includePath = false,$data=array())
    {
        $options  = array(
            "http"=>array(
                'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
                'method'  => 'GET',
                'content' =>http_build_query($data),
            ),
        );

        $context = stream_context_create($options);
        return file_get_contents($url,$includePath,$context);
    }


    private function getContent2($url)
    {
    	$ch = curl_init($url);
    	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    	curl_setopt($ch, CURLOPT_HEADER, false);
    	$data = curl_exec($ch);
    	
        curl_close($ch);
        if ($data===FALSE){
            $er = curl_errno($ch);
            return $this->resultStatus(false,curl_strerror($er));
        }else{
            return $this->resultStatus(true, json_decode($data,true));
        }

    }



    public function getInstances()
    {

        $url = $this->url."/instances";
        $options = array(
            'http' => array(
                'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
                'method'  => 'GET',
                //'content' => http_build_query($data),
            ),
        );
        $context  = stream_context_create($options);
        $result = file_get_contents($url, false, $context);

        if ($result === FALSE) { /* Handle error */ }

        return $result;
    }

    public function getAllPatients()
    {
        $url = $this->url."/patients";
        $options  = array(
            "http"=>array(
                'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
                'method'  => 'GET',
            ),
        );
        $context = stream_context_create($options);
        $result = file_get_contents($url,false,$context);

        return $result;
    }

    public function getPatientDataArr($data)
    {
        $url = $this->url."/patients/";

        $result = $this->getContents($url,false,$data);
        return json_decode($result);
    }


    /**
     * Nacita jednotlive serie a pre danu studiu
     * @param string $uuid UUID serie, vrati zoznam instancii
     * @return array vrati associativne pole s informaciou o studi a obsahom Instances
     */
    public function getSeriesData($uuid)
    {
        $url = $this->url."/series/".$uuid;
        return $this->getContent2($url);
    }

    public function getPatientData($uuid)
    {
        $url = $this->url."/patients/".$uuid;
        return $this->getContent2($url);


    }
    /**
     * Vrati cez curl ID pacienta na Dicom Servery pozor vzhladom na to ze ide cez DICOM protokol nie je rychly
     * @param string $birthNumber Rodne cislo bez lomky
     * @return mixed|mixed[] Vrati pole obsahuje ID,Path,Type, alebo FALSE
     */
    public function findPatientData($birthNumber)
    {
        $birthNumber = trim($birthNumber);
        if (strlen($birthNumber)==0) {
            return FALSE;
        }
        else {
            $url = $this->url."/tools/lookup";
            return $this->_curl_c($url,$birthNumber);
        }
    }

    /**
     * Nacita jednotlive studie a pre daneho pacienta podla UUID
     * @param string $uuid UUID serie, vrati zoznam instancii
     * @return mixed|mixed[] vrati associativne pole s informaciou o studi a obsahom Instances
     */

    public function getStudyByID($uuid)
    {
        $url = $this->url."/studies/".$uuid;
        return $this->getContent2($url);
    }



    public function simplifiedTags($instance)
    {
        $url = $this->url."/instances/".$instance."/simplified-tags";

        $data = array();
        $options = array(
            'http' => array(
                'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
                'method'  => 'GET',
                //'content' => http_build_query($data),
            ),
        );

        $context = stream_context_create($options);
        $result = file_get_contents($url,false,$context);

        return $result;

    }

    public function getDicomInstances($data)
    {
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, false);

        $ch = curl_init($this->url."/instance");
    }



    /** Searches Orthanc server for PatientID/BirthNumber in REST Call Api /tools/lookup
     * @param birthNumber $id BirthNumber of Patient
     * @return mixed|array $patientData returns mixed array Patient->Studies->Series->Instances
     */

    public function searchOrthancPatientID($id)
    {
        $res = $this->findPatientData($id);

        if ($res["status"]){
            $res = $this->getPatientData($res["result"][0]["ID"]);

            if ($res["status"] === false){
                return $this->resultStatus(false, $res["result"]);
            }
            return array("status"=>true,"result"=>$res["result"]);
        }

    }

    /** Searches Orthanc server for PatientName in REST Call Api /tools/find
     * @param PatientName $name Name of Patient, may contain *
     * @return mixed|array $patientData returns mixed array Patients (MainDicomTags)
     */
    public function searchOrthancPatientName($name)
    {
        $url = $this->url."/tools/find";

        $searchQuery = array(
                        "Level"=>"Patient",
                        "Query"=>array("PatientName"=>$name),
        );

        $searchStr = json_encode($searchQuery);

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_POSTFIELDS,$searchStr);
        $data = curl_exec($ch);
        curl_close($ch);
        if ($data === FALSE){
            $er = curl_errno($ch);
            return array("status"=>false,"result"=>curl_strerror($er));
        }else{
            $result = json_decode($data,true);

            $patientData = array();

            foreach ($result as $pID){
                $res = $this->getPatientData($pID);
                if (!$res["status"]){
                    return $res;
                }else{
                    $patientData[] = $this->resultData($res);
                }
            }

            return $this->resultStatus(true, $patientData);
        }



        return $patientData;
    }
    /** Searches ORTHANC for Studies by Date in format yyyymmdd if - appended it show all studies from this date
     *
     * @param date $date dateformat yyyymmdd possible -
     *
     * @return mixed|array array of avaible Studies
     */
    public function searchOrthancBYDate($date)
    {
        $url = $this->url."/tools/find";

        $searchQuery = array(
            "Level"=>"Patient",
            "Query"=>array("StudyDate"=>$date),
        );

        $res = $this->_curl_c($url,$searchQuery);

        if ($res["status"] === false){
            return $this->resultStatus(false, $res["result"]);
        }
           
        $studiesData = array();

        foreach ($res["result"] as $uuid){
            $res2 = $this->getPatientData($uuid);
            if ($res2["status"]){
                $studiesData[] = $res2["result"];
            }else{
                return $this->resultStatus(false,$res2["result"]);
            }
        }
        return $this->resultStatus(true,$studiesData);
    }

    /**
     * @param data $data Formated array for dicom query
     * @return array($status,$result);
     */
    public function getStudiesByDate($data)
    {
        $url = $this->url."/tools/find";
        $res = $this->_curl_c($url,$data);
        return $res;
    }
    
    public function _c_delete($url,$data){
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,$url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
        $result = curl_exec($ch);
        curl_close($ch);
        
        if ($result===FALSE){
            $errNo = curl_errno($ch);
            return $this->resultStatus(false,curl_strerror($errNo));
        }else{
            return $this->resultStatus(true,json_decode($result,true));
        }
        
    }
    
    
    public function searchOrthancByQuery($query){
        $url = $this->url."/tools/find";
        return $this->_curl_c($url,$query);
    }
}



?>

