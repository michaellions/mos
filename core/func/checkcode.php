<?php
   /*   网站验证码程序
    *   运行环境： PHP5.0.18 下调试通过
    *   需要 gd2 图形库支持（PHP.INI中 php_gd2.dll开启）
    *   文件名: checkcode.php
    *   作者： Micros micros@163.com
    *   Date:2015-09-11
    *   技术支持：micros
    */
//ini_set('display_errors', 'Off');
session_start();
function random($len) {
    $srcstr = "2346789ABCDEFHJKLMNPRTUVWXYZ";
    mt_srand();
    $strs = "";
    for ($i = 0; $i < $len; $i++) {
        $strs.= $srcstr[mt_rand(0, 26)];
    }
    return $strs;
}
//随机生成的字符串
$str = random(6); 
//验证码图片的宽度
$width  = 70;      
//验证码图片的高度
$height = 35;     
//声明需要创建的图层的图片格式
@ header("Content-Type:image/png");
//创建一个图像层
$im = imagecreate($width, $height);
//背景色
$back = imagecolorallocate($im, 0xFF, 0xFF, 0xFF);
//模糊点颜色
$pix  = imagecolorallocate($im, 135, 206, 250);
//字体色
$fontcolor = imagecolorallocate($im, 0,0, 255);
//边框色
$bcolor = imagecolorallocate($im,204,204,204);
//绘模糊作用的点
mt_srand();
for ($i = 0; $i < 400; $i++) {
    imagesetpixel($im, mt_rand(0, $width), mt_rand(0, $height), $pix);
}
//输出字符
imagestring($im, 8, 7, 9, $str, $fontcolor);
/* imagestring($image,$font,$x,$y,$string,$color)
image-图像资源,返回的图像创建功能之一, 如imagecreatetruecolor()。
font-可以是1、2、3、4、5为内置的 字体在latin2编码(更高的数字对应于较大的字体)或任何你的 注册自己的字体标识imageloadfont()。
x-左上角的x坐标。
y-左上角的y坐标。
string-写入字符串。
color-一种颜色标识符创建imagecolorallocate()。*/
//输出矩形
imagerectangle($im, 0, 0, $width -1, $height -1, $bcolor);
//输出图片
imagepng($im);
imagedestroy($im);
//$str = md5(strtolower($str));
//选择 cookie
//SetCookie("verification", $str, time() + 7200, "/");
 
//选择 Session
$_SESSION["verification"] = strtolower($str);
