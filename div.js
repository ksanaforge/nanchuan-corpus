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
	if (closing) {
		const depth=parseInt(tag.attributes.level);
		this._divdepth=depth;
		this.handlers.head.apply(this,arguments);
	}
}
const cb_mulu_finalize=function(){
//	this.handlers.head_subtree_finalize.call(this);
}
var titletext="";
const milestone=function(tag){
	if (tag.attributes.unit=="juan"){
		const juan=tag.attributes.n;
		this.putArticle(titletext+"-"+juan);
	}
}
const title=function(tag,closing,kpos,tpos,start,end){
	if (closing) {
		titletext=this.substring(start,end);
		const at=titletext.lastIndexOf(",");
		if (at>-1) {
			titletext=titletext.substr(at).trim();
		}
	}
}
module.exports={cb_div,head,cb_mulu,cb_mulu_finalize,milestone,title};