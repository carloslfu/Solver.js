Group=function(worker){
	this.worker=worker;
	var ga=new Worker('js/process.js');
	var subga=new Worker('js/subGA.js');
	var objetive={carlos:39,andres:21,juan:21,jose:19,diana:9,claudia:31};
	ga.postMessage({cmd:'conf',migrationAt:4,objetive:objetive});
	subga.postMessage({cmd:'conf',migrationAt:4,migratorsprop:0.3,objetive:objetive});
	ga.postMessage({cmd:'init'});
	sugabga.postMessage({cmd:'init'});
	
	ga.onmessage=function(e){
		switch(e.data.type)
		{
			case 'info':
				println($("#out"),e.data.generation+': '+e.data.g);
				scrolldown($("#out"));
				break;
			case 'state':
				if(e.data.state=='end-eval')
					scrolldown($("#out"));
				break;
			case 'migration':
				subga.postMessage({cmd:'migration'});
				break;
		}
	}

	subga.onmessage=function(e){
		switch(e.data.type)
		{
			case 'migration':
				ga.postMessage({cmd:'migration',P:e.data.P});
				break;
			case 'solfound':
				ga.postMessage({cmd:'solfound',genotype:e.data.genotype});
				break;
		}
	}

	$("#ejecutar").click(function(){
		ga.postMessage({cmd:'conf',migrationAt:4,objetive:objetive});
		subga.postMessage({cmd:'conf',migrationAt:4,migratorsprop:0.3,objetive:objetive});
		ga.postMessage({cmd:'start',num:$("#num").val()});
		subga.postMessage({cmd:'start',num:$("#num").val()});
	});
	$("#reiniciar").click(function(){
		ga.postMessage({cmd:'init'});
		subga.postMessage({cmd:'init'});
		$("#limpiar").click();
	});
	$("#limpiar").click(function(){
		$('#out').html('');
	});
}
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