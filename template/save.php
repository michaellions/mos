<?php
/************************************************
* @link http://www.mossoft.com/
* @author michaellions | e-mail:michael.lions@gmail.com
* @copyright mossoft 2017.(hangzhou)Co.,Ltd
* @license http://mossoft.com/licenses/license.txt
如现在/a/b/c/s.php要调用根目录下的 /bb/s2.txt，则：
“../../../bb/s2.txt”
表示向上返回到b再向上到a再向上到根目录然后到bb下 .
*************************************************/
header("Cache-Control: no-cache, must-revalidate");//清除浏览器缓存,否者数据不会实时更新
if(isset($_REQUEST["baseMsg"])){//基本消息设置到文件
  file_put_contents('../data/system/messages.json', $_REQUEST["baseMsg"]); 
}
if(isset($_REQUEST["userMsg"])){//用户消息设置到文件
  file_put_contents('../data/user/'.$_REQUEST["username"].'/messages.json', $_REQUEST["userMsg"]); 
}
if(isset($_REQUEST["desktop"])){//用户的桌面设置到文件 
  file_put_contents('../data/user/'.$_REQUEST["username"].'/desktop.json', $_REQUEST["desktop"]); 
}
if(isset($_REQUEST["usersetup"])){//用户的所有设置到文件 
  file_put_contents('../data/user/'.$_REQUEST["username"].'/setup.json', $_REQUEST["usersetup"]); 
}
if(isset($_REQUEST["cmenu"])){//用户的右键菜单到文件 
  file_put_contents('../data/user/'.$_REQUEST["username"].'/cmenu.json', $_REQUEST["cmenu"]); 
}
if(isset($_REQUEST["css"])){//生成的css到文件 
  file_put_contents($_REQUEST["cssfile"], $_REQUEST["css"]); 
}
