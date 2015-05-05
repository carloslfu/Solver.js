//Utilities for ag.js
function rndint(a,b)
{
	return Math.floor(Math.random()*(b-a+1)+a);
}
function toeven(num)
{
	num=Math.floor(num);
	if(num%2==0)
		return num;
	else
		return num-1;
}
function randomdist(dist){
	var n,sum;
	n=Math.random();
	sum=0;
	dist.forEach(function(el){
		sum+=dist[el];
	});
	//normalize the probability of all elements
	dist.forEach(function(el){
		dist[el]=dist[el]/sum;
	});
	//cal
	var limit=0;
	var rndel=null;
	dist.forEach(function(el){
		if(limit<=n && n<limit+dist[el])
		{
			rndel=el;
			return 0;//foreach loop finalize
		}
		limit+=dist[el];
	});
	return rndel;
}
function normalize(dist){
	var n,sum;
	n=Math.random();
	sum=0;
	dist.forEach(function(el){
		sum+=dist[el];
	});
	//normalize the probability of all elements
	dist.forEach(function(el){
		dist[el]=dist[el]/sum;
	});
}
function randomdist_norm(dist){
	var n,sum;
	n=Math.random();
	//cal
	var limit=0;
	var rndel=null;
	dist.forEach(function(el){
		if(limit<=n && n<limit+dist[el])
		{
			rndel=el;
			return 0;//foreach loop finalize
		}
		limit+=dist[el];
	});
	return rndel;
}