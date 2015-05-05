importScripts('ga.js','../libs/object.js','galib.js','myga.js');

	var iterations,it_count;
	var migrationAt;
	var migratorsprop;
	var ga;

	function eval_ga(){
		var i,j,x;
		x=ga.next();
		//ga.worker.postMessage({type:'info',generation:ga.generation,g:x});
		if(ga.ct(x) || it_count==iterations-1){
		 	it_count=iterations;
			ga.worker.postMessage({type:'solfound',genotype:JSON.stringify(ga.P.objectAt(0))});
			/*for(i=0;i<ga.genotype.length;i++)
				ga.worker.postMessage({type:'info',generation:'----'+i,g:ga.P.objectAt(0).code[i]});
			ga.worker.postMessage({type:'state',state:'end-eval'});*/
		}
		it_count++;
	}
	function do_cicle(){
		var i;
		for(i=0;i<migrationAt&&it_count<iterations-1;i++)
			eval_ga();
	}
	function migrate(){
		var i,P=new Ojs(),tam=ga.length*migratorsprop;
		for(i=0;i<tam;i++)
			P[i]=ga.P[i];
		return P;
	}
	self.onmessage=function(e){
		switch(e.data.cmd)
		{
			case 'start':
				iterations=e.data.num;
				it_count=0;
				do_cicle();
				break;
			case 'migration':
				ga.worker.postMessage({type:'migration',P:JSON.stringify(migrate())});
				if(e.data.P){
					ga.fext(new Ojs(JSON.parse(e.data.P)));
					ga.fred();
				}
				do_cicle();
				break;
			case 'conf':
				if(e.data.migrationAt) migrationAt=e.data.migrationAt;
				if(e.data.migratorsprop) migratorsprop=e.data.migratorsprop;
				if(e.data.objetive) objetive=new Ojs(e.data.objetive);
				break;
			case 'init': 
				var ngens=calc_gens(objetive);
				ga = new GA(self,{codification:objetive,length:ngens},Math.floor(Math.log(objetive.getLength())/Math.LN2*ngens*0.1))
				ga.init();
				break;
		}
	}
	function calc_gens(codification){
		var i,len=codification.getLength(),sum=0;
		for(i=0;i<len;i++)
			sum+=codification.objectAt(i);
		return sum;
	}