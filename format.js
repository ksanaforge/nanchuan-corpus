var prevpage;

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
	const s=this.popBaseText();
	const pbn=tag.attributes.n;
	const page=parseInt(pbn,10)-1;
	const line=parseInt(pbn.substr(5))-1;

	if (line>15) {
		//lines move to <cb:div type="nanchuan-notes">
		return;
	}
	const pb=pbn.substr(0,4);
	if (!this.started)return; //ignore lb in apparatus after </body>

	this.putLine(s);

	if (prevpage!==pb && page===0) {
		this.addBook();
	}

	if (this.bookCount){
		const kpos=this.makeKPos(this.bookCount,page,line,0);
		this.newLine(kpos, this.tPos);
	}
	prevpage=pb;
}



const p=function(tag,closing){
	this.putEmptyBookField("p");	
}
const milestone=function(tag){
	if (tag.attributes.unit==="juan"){
		this.putField("juan",parseInt(tag.attributes.n,10));	
	}
}
module.exports={p,lb,TEI,milestone};