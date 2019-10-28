<!DOCTYPE html>
<html lang="zh" class="no-js demo-1">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"> 
		<meta name="viewport" content="width=device-width, initial-scale=1.0"> 
		<script src="../../../../core/js/jquery-3.3.1.js"></script>
		<script src="js/Helper.js"></script>
		<script src="js/keyboard.js"></script>
		<script src="js/const.js"></script>
		<script src="js/level.js"></script>
		<script src="js/crackAnimation.js"></script>
		<script src="js/prop.js"></script>
		<script src="js/bullet.js"></script>
		<script src="js/tank.js"></script>
		<script src="js/num.js"></script>
		<script src="js/menu.js"></script>
		<script src="js/map.js"></script>
		<script src="js/Collision.js"></script>
		<script src="js/stage.js"></script>
		<script src="js/main.js"></script>
		<link rel="stylesheet" type="text/css" href="css/default.css" />
		<style type="text/css">
			#canvasDiv canvas{
				position:absolute;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<div class="main clearfix">
				<div id="canvasDiv" >
					<canvas id="wallCanvas" ></canvas> 
					<canvas id="tankCanvas" ></canvas>
					<canvas id="grassCanvas" ></canvas>
					<canvas id="overCanvas" ></canvas> 
					<canvas id="stageCanvas" ></canvas>
				</div>
			</div>
			<div class="desc"><span style="font-size:16px;font-weight:bold;color:black;">游戏说明：</span><br>先点击游戏<br>方向键选玩家<br>按回车键开始游戏<br><span style="font-size:16px;font-weight:bold;color:black;">玩家1：</span><br>w-上<br>a-左<br>s-下<br>d-右<br>space-射击<br><span style="font-size:16px;font-weight:bold;color:black;">玩家2：</span><br>方向键<br>enter-射击<br><span style="font-size:16px;font-weight:bold;color:black;">跳关卡:</span><br>n-下一关<br>p-上一关。</div>
		</div><!-- /container -->
		
	</body>
	<script>
		document.oncontextmenu=new Function("event.returnValue=false;");//屏蔽右键
	</script>
</html>