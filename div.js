var divdepth=0;
const head=function(tag,closing){
	if (closing) {
	} else {
	}
}
const cb_div=function(tag,closing){
	if (closing) {
		divdepth--;
	} else {
		divdepth++;
	}
}
const cb_mulu=function(tag,closing){
	const depth=tag.attributes.level;
	const removetext=true; //text inside cb:mulu is added by CBETA, not part of Nanchuan corpus
	return this.handlers.head_subtree.call(this,tag,closing,depth,removetext);
}
const cb_mulu_finalize=function(){
	this.handlers.head_subtree_finalize.call(this);
}
var titletext="";
const milestone=function(tag){
	if (tag.attributes.unit=="juan"){
		const juan=tag.attributes.n;
		this.putField("article",  titletext+"-"+juan);
	}
}
const title=function(tag,closing){
	if (closing) {
		var str=this.popText();
		const comma=str.lastIndexOf(",");
		if (comma>0) str=str.substr(comma+1);
		titletext=str;//cannot put field now, kpos pointing to previous file
	} else {
		return true;
	}
}
module.exports={cb_div,head,cb_mulu,cb_mulu_finalize,milestone,title};