<?php
    $filepath=$_POST["bgfilepath"];//获得背景图片文件名
    if($filepath!==""){
        //$filenamelist=scandir($filepath);
        //echo json_encode($filenamelist);
        //打开当前目录下的目录pic下的子目录common。
        $handler = opendir($filepath);
        while(($filename = readdir($handler)) !== false){
            if($filename !== "." && $filename !== ".."){
                $filenamelist[]=$filename;
            }
        }
        echo json_encode($filenamelist);
        closedir($handler);
    }
