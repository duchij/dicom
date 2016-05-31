<?php
class log{
    /**
     * Logovacia funkcia pre chyby ev zistenie stavu nejakej premenej.
     *
     * Tvoria sa dva logy jejden ddmmrrrr.log je klasicky log kde sa zaznamenavaju veci
     * druhy ddmmrrrr_error.log ak mame nejaku chybu
     * napr sql je vo formate ako sa posiela do db.....
     *
     *
     * @param mixed $what co chceme aby sa zobrazilo
     * @param string $debug nejaka znacka, ktoru budeme v logu hladat
     * @param boolean $error ak chcemedat do error logu
     */
    public function logData($what,$trunc = false,$debug="LOG",$error=false)
    {
        if ($error == false)
        {
            $datum  = date("dmY");
            $fp = fopen(APP_DIR."/log/{$datum}.log","a+");
            	
            $str = date("d.m.Y H:i:s")."..>{$debug}";
            $str .= "................".PHP_EOL;
            
            if ($trunc)
            {
                $whatTmp = substr(print_r($what,true),0,1000);
                $str .= $whatTmp.PHP_EOL.">>>>>....data truncated...> to stop put false in logData".PHP_EOL;
            }
            else 
            {
                $whatTmp = print_r($what,true);
                $str.=  $whatTmp.PHP_EOL.PHP_EOL;
            }
            
            $str = str_replace(array("\r", "\n"), array('', "\r\n"), $str);
    
            fwrite($fp,$str);
            fclose($fp);
        }
        else
        {
            $datum  = date("dmY");
            $fp = fopen("log/{$datum}_error.log","a+");
            	
            $str = date("d.m.Y H:i:s")."..........>{$debug}";
            $str .= "==========================================================================".PHP_EOL;
            $str .= print_r($what,true).PHP_EOL;
            	
            $str = str_replace(array("\r", "\n"), array('', "\r\n"), $str);
            	
            fwrite($fp,$str);
            fclose($fp);
        }
    }
}

return "log";
