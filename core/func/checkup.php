<?php
  session_start();/*启动SESSION*/
  $vcode=$_POST["vcode"];
  $lname=$_POST["lname"];
  $lpassword=$_POST["lpsw"];
  $dbpsw=$_POST["dbpsw"];
  $rem=$_POST["rem"];
  if($vcode!="NoCode"){
    if(strtolower(trim($vcode))==$_SESSION["verification"]){/*验证码正确则输出1*/
      if(strtolower(trim($lpassword))==strtolower(trim($dbpsw))){
        if ($rem=="true"){/*如果用户选择了记录登录状态,就把用户名放到cookie里面,30天内免登陆*/
          setcookie("mos_user_id",$lname, time()+3600*24*30,'/');
          setcookie("rem","true",time()+3600*24*30,'/');
        }else{
          setcookie("mos_user_id",$lname,0,'/');
        };
        echo "1";
      }else{
        echo "登入错误，密码不正确！";  
      } 
    }else{
      echo "登入错误，验证码错误！";
    };
  }else{
    if(strtolower(trim($lpassword))==strtolower(trim($dbpsw))){
      if ($rem=="true"){/*如果用户选择了记录登录状态,就把用户名放到cookie里面,30天内免登陆*/
        setcookie("mos_user_id",$lname, time()+3600*24*30,'/');
        setcookie("rem","true",time()+3600*24*30,'/');
      }else{
        setcookie("mos_user_id",$lname,0,'/');
      };
      echo "1";
    }else{
      echo "登入错误，密码不正确！";  
    }
  };

