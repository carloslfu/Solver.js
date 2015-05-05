importScripts('GA.js','../libs/object.js','GAlib.js','myGA.js');

	var iterations,it_count;
	var migrationAt;
	var ga;
	
	function sol_found(sol){
		it_count=iterations;
		ga.worker.postMessage({type:'info',generation:'best genotype',g:''});
		for(i=0;i<ga.genotype.length;i++)
			ga.worker.postMessage({type:'info',generation:'----'+i,g:sol.code[i]});
		ga.worker.postMessage({type:'state',state:'end-eval'});
	}
	function eval_ga(){
		var i,j,x;
		x=ga.next();
		ga.worker.postMessage({type:'info',generation:ga.generation,g:x});
		if(ga.ct(x) || it_count==iterations-1){
		 	sol_found(ga.P.objectAt(0));
		}
		it_count++;
	}
	function do_cicle(){
		var i;
		for(i=0;i<migrationAt&&it_count<iterations-1;i++)
			eval_ga();
		if(it_count<iterations-1)
			ga.worker.postMessage({type:'migration'});
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
				ga.fext(new Ojs(JSON.parse(e.data.P)));
				ga.fred();
				ga.worker.postMessage({type:'info',generation:ga.generation,g:'migration done...'});
				do_cicle();
				break;
			case 'solfound':
				sol_found(new Ojs(JSON.parse(e.data.genotype)));
				break;
			case 'init':
				var ngens=calc_gens(objetive);
			 	ga = new GA(self,{codification:objetive,length:ngens},Math.floor(Math.log(objetive.getLength())/Math.LN2*ngens*0.1))
				ga.init();
				break;
			case 'conf':
				if(e.data.migrationAt) migrationAt=e.data.migrationAt;
				if(e.data.objetive) objetive=new Ojs(e.data.objetive);
				break;
		}
	}
	function calc_gens(codification){
		var i,len=codification.getLength(),sum=0;
		for(i=0;i<len;i++)
			sum+=codification.objectAt(i);
		return sum;
	}