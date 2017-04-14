var prevpage;
var inP;
const TEI=function(tag,closing){
	if (closing) {
		inlineNotes={};
		this.stop();
		return;
	}
	const id=tag.attributes["xml:id"];
	if (id){
		var sid=id.substr(id.length-5);
		if (sid[0]==="n") sid=sid.substr(1);
		this.putField("sid",sid);
	}
}
const lb=function(tag){
	if (!this.started)return; //ignore lb in apparatus after </body>

	const pbn=tag.attributes.n;

	const page=(parseInt(pbn,10)-1);
	const line=parseInt(pbn.substr(5))-1;
	const pb=pbn.substr(0,4);

	this.emitLine();

	if (this._pb!==pb && page===0) {
		this.addBook();
	}

	if (this.bookCount){
		const kpos=this.makeKPos(this.bookCount,page,line,0);
		this.newLine(kpos, this.tPos);
		if (!this.articlePos){
			this.articlePos=kpos;
			this.articleTPos=this.tPos;
		}
		if (!inP) { //if not a paragraph , every lb start a new paragraph (for lg and l)
			this.putEmptyArticleField("p",kpos,this.articleCount);
		}
	}
	this._pb=pb;
	this._pbline=line;
}

const p=function(tag,closing){
	if (!this.started) return;
	if (closing) {
		inP=false;
	} else {
		inP=true;
		this.putEmptyArticleField("p",this.kPos,this.articleCount);
	}
}
const milestone=function(tag){
	if (tag.attributes.unit==="juan"){
		this.putField("juan",parseInt(tag.attributes.n,10));	
	}
}
module.exports={p,lb,TEI,milestone};