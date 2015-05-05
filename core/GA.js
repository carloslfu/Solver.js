//Algoritmos geneticos - implementacion javascript - ver 1.4
//genotype
genotype = function(gen){
	this.length=gen.length;
	this.codification=gen.codification;
	this.code=[];
	this.g=0;
	this.init=function() {
		normalize(this.codification);
		for(i=0;i<this.length;i++)
			this.code[i]=randomdist_norm(this.codification);
		this.calc_g();
	}
}
//Genetic Algoritm object
GA = function (worker,gen,P0){

this.init=function()
{
	this.P0=P0;
	this.length=P0;
	this.genotype=gen;
	this.generation=0;
	this.worker=worker;
	this.P=new Ojs();
	var i;
	for(i=0;i<this.P0;i++){
		this.P[i]=new genotype(this.genotype);
		this.P[i].init();
	}
	this.P.sortIndexed(function(a,b){return b.g-a.g});
}
this.fsel=function() //with errs
{
	return this.P;
}
this.fprod=function(parents)
{
	var i,aux,len=parents.getLength(),cont=0,children=new Ojs();
	var ndist=new Ojs({true:100,false:0});//cross 100% parents
	normalize(ndist);
	for(i=0;i<len/2;i++){
		if(randomdist_norm(ndist)=="true")
		{
			aux=this.fcross(parents[i],parents[i+len/2]);
			children[cont]=aux[0];
			children[cont+1]=aux[1];
		}
		else
		{
			children[cont]=parents[i];
			children[cont+1]=parents[i+len/2];
		}
		cont+=2;
	}
	return children;
}
this.fcross=function(p1,p2){
	var len=p1.length,i,child1=new genotype(this.genotype),child2=new genotype(this.genotype);
	//apply random privileged cross mask
	var ndist=new Ojs({1:p1.g,2:p2.g});
	normalize(ndist);
	for(i=0;i<len;i++)
		if(randomdist_norm(ndist)==1)
		{
			child1.code[i]=p1.code[i];
			child2.code[i]=p2.code[i];
		}
		else
		{
			child1.code[i]=p2.code[i];
			child2.code[i]=p1.code[i];
		}
	//clacs g
	child1.calc_g();child2.calc_g();
	return [child1,child2];
}
this.fmut=function(children)
{
	var len=children.getLength(),i;
	for(i=0;i<len;i++){
		children[i].mutate(this.P.objectAt(0).g);
	}
}
this.fext=function(children)
{
	var i,len=children.getLength(),lenp=this.length;
	for(i=lenp;i<lenp+len;i++)
		this.P[i]=new Ojs(children[i-lenp]);;
}
this.fred=function()
{//cut reduction
	var i,lenp=this.P.getLength();
	this.P.sortIndexed(function(a,b){return b.g-a.g});
	for(i=this.length;i<lenp;i++)
		delete this.P[i];
}
this.next=function(){
	var x,parents,children;
	//se selecciona toda la poblacion
	children=this.fprod(this.fsel());
	this.fmut(children);
	//this.freplace(children);
	this.fext(children);
	this.fred();
	this.generation++;
	return this.P.objectAt(0).g;
}
this.init();
}
