$(document).ready(function() {
	var objetive={carlos:39,andres:21,juan:21,jose:19,diana:9,claudia:31};
	var grupo=new Group();
	var islas={};
	islas[0]=new Island({migrationAt:4,migratorsprop:0,objetive:objetive,ag:(new Ojs(myga)).toStr()});
	islas[1]=new Island({migrationAt:4,migratorsprop:0.3,objetive:objetive,ag:(new Ojs(myga)).toStr()});
	grupo.postMessage({cmd:'conf',migrationMode:'centered',center:0});
	grupo.postMessage({cmd:'add',islands:(new Ojs(islas)).toStr()});
	grupo.postMessage({cmd:'init'});

	$("#ejecutar").click(function(){
		grupo.postMessage({cmd:'start',num:$("#num").val()});
	});
	$("#reiniciar").click(function(){
		grupo.postMessage({cmd:'init'});
		$("#limpiar").click();
	});
	$("#limpiar").click(function(){
		$('#out').html('');
	});
});
var numscroll=0;
function println(out,str){
	out.html(out.html()+str+'<br>');
}
function scrolldown(out){
	if(numscroll==1){
		out.animate({scrollTop: out[0].scrollHeight},10);//scroll abajo
		numscroll=0;
	}
	numscroll++;
}