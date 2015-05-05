/*	arista=function(from,to,value){
		this.to=to;
		this.from=from;
		this.value=value;
	}
	laberinto=[new arista('0O','1E',1),new arista('0N','2S',1),
	new arista('0S','3N',1),new arista('2E','4O',2),
	new arista('4S','5N',1),new arista('3E','7O',3),
	new arista('6S','7N',2),new arista('4E','6O',1)];
*/
	GA.prototype.ct=function(x)
	{
	return x==2*this.genotype.length+1+10;
	}
	genotype.prototype.mutate=function(gmax) {
		var g=this.g;
		if(randomdist(new Ojs({true:gmax+1,false:g+1}))=="true"){
			this.code[rndint(0,this.length-1)]=randomdist(this.codification);
			this.calc_g(); //recalc g
		}
	}
	var objetive;
	genotype.prototype.calc_g=function(){
		var i,good=0,cont=new Ojs(),objlength=objetive.getLength();
	//distribucion de cantidades
		for(i=0;i<objlength;i++)
			cont[objetive.objectNameAt(i)]=0;
		for(i=0;i<this.length;i++)
			cont[this.code[i]]++;
		for(i=0;i<objlength;i++)
			if(objetive.objectAt(i)>=cont[objetive.objectNameAt(i)])
				good+=cont[objetive.objectNameAt(i)];
			else
				good+=objetive.objectAt(i);
	//exepciones
		//excepciones de vecindad
		var maxerr=this.length-1,err=0;
		for(i=0;i<this.length-1;i++)
			if(this.code[i]==this.code[i+1])
				err++;
		good+=maxerr-err;
		//excepciones directas
		if(this.code[0]!=objetive.objectNameAt(0))
			good++;
		if(this.code[1]!=objetive.objectNameAt(2))
			good++;
		//rangos de excepcion
		var a=1,b=10,target=objetive.objectNameAt(4);
		var maxerr=b-a+1,err=0;
		for(i=a;i<=b;i++)
			if(this.code[i]==target)
				err++;
		good+=maxerr-err;
		this.g=good;
	}