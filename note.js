var inlineNotes={};
const pts=require("./pts");
const ref=function(tag,closing){
	if (!closing){
		const target=tag.attributes.target;
		const type=tag.attributes.type;
		if (target.substr(0,4)=="#PTS" && type!=="PTS_hide"){
			const ptskpos=pts.encodePTS(target.substr(5));
			this.putArticleField("pts",ptskpos);
		}
	}
}
const note=function(tag,closing,kpos,tpos,start,end){
	if (closing) {
		/*
		if (tag.attributes.place!=="foot text") {
			console.log(tag)
		}
		*/
		const str=this.substring(start,end);
		//n==page number + seq on that page
		const n=tag.attributes.n;
		if (!n) {
			//possible cbeta-notes, only have target.
			return ;
		}

		const notekpos=inlineNotes[n];
		if (!notekpos) {
			throw "cannot find note "+tag.attributes.n;
		}
		if (typeof notekpos!=="number") {
			for (var i=0;i<notekpos.length;i++){
				const p=notekpos[i];
				if (i) {
					this.putArticleField("note","*"+notekpos[0],p);//point to same def
				}else this.putArticleField("note",str,p);
			}
		} else {
			this.putArticleField("note",str,notekpos);	
		}
	}
}
const anchor=function(tag){
	const n=tag.attributes.n;
	if (!n) return; //might be type="cp-app"

	if (inlineNotes[n] && inlineNotes[n]!=this.kPos) {
		if (tag.attributes.type==="star") { //pointing to same ndef
			if (typeof inlineNotes[n]==="number") {
				inlineNotes[n]=[inlineNotes[n],this.kPos];	
			} else{
				inlineNotes[n].push(this.kPos);
			}
		} else {
			debugger;
			throw "Repeat note "+n+JSON.stringify(inlineNotes);
		}
	}
	inlineNotes[n]=this.kPos;
}
const noteFileStart=function(){
	//N01n001_002 and N02n001_006 have same note id 0252002 
	inlineNotes={};//reset, 
}
module.exports={ref,note,anchor,noteFileStart};