/*
generate taisho.cor (not inverted)

select a text, give human readible address.

select by vol,page, and jump to the juan.
paste address and jump to the juan and highlight text

paste a serial of address,
return a json structure , containing all the text.

send to Sujato for testing

*/

const {createCorpus,makeKPos}=require("ksana-corpus-builder");

const fs=require("fs");
const sourcepath="../../CBReader/xml/";
const files=fs.readFileSync("nanchuan.lst","utf8").split(/\r?\n/);
//files.length=10;
var prevpage;
var inlineNotes={};
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
		const kpos=this.makeKPos(this.bookCount-1,page,line,0);
		this.newLine(kpos, this.tPos);
	}
	prevpage=pb;
}



const p=function(tag,closing){
	this.putEmptyField("p");	
}
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
const milestone=function(tag){
	if (tag.attributes.unit==="juan"){
		this.putField("juan",parseInt(tag.attributes.n,10));	
	}
}
const bookStart=function(){
//	console.log("book start")
}
const bookEnd=function(){

}
const body=function(tag,closing){
	if (!closing) this.start();
	//closing?this.stop():this.start();
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
			throw "repeat note"+n+JSON.stringify(inlineNotes);
		}
	}
	inlineNotes[n]=this.kPos;
}
const pgpat=/(.+?)\.(\d+)\.(\d+)/;
const pgpat2=/(.+?)\.(\d+)/;
//http://www.palitext.com/palitext/tipitaka.htm 56 volumns
const volstart={
	Vin:0,
	D:6,
	M:9,
	S:13,
	A:19,
	Khp:26,
	Sn:27,

	Pv:28,
	Ap:29,
	Ja:31,
	Vv:33,
	Th:44,
	Thī:55,
	It:50,
	Vibh:49,
	Dhp:44,
	Dhs:43,
	Nidd:51,
	Ud:41,
	Yam:42,
	tuk:43,
	DhkA:44,
	is:45,
	Bv:46,
	Cp:47,
	Pp:49,
	Dv:50,
	Kv:51,
	Vism:52,
	Cūl:53,
	Sp:54,
	"Abhi-s":55,
	Mhv:56,
	Mil:57,
	Dhātuk:58,
	Paṭis:59,
	Paṭṭh:60,
	PA:61
}
const encodePTS=function(str){
	var r=str.match(pgpat);

	if (r&&typeof volstart[r[1]]=="undefined") {
		console.log("unknown",r[1]);
		return 0;
	}

	if (!r) {
		r=str.match(pgpat2);
		
		if (!r) return 0;
		if (r&&typeof volstart[r[1]]=="undefined") {
			console.log("unknown",r[1]);
			return 0;
		}
		return makeKPos(volstart[r[1]] ,r[2],1,0,"pts");
	} else {

		const vol=volstart[r[1]]+(parseInt(r[2])-1);
		return makeKPos(vol ,r[3],1,0,"pts");
	}

}
const ref=function(tag,closing){
	if (!closing){
		const target=tag.attributes.target;
		if (target.substr(0,4)=="#PTS"){
			const ptskpos=encodePTS(target.substr(5));
			this.putField("pts",ptskpos);
		}
	}
}
const note=function(tag,closing){
	if (closing) {
		/*
		if (tag.attributes.place!=="foot text") {
			console.log(tag)
		}
		*/
		const str=this.popText();
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
					this.putField("note","*"+notekpos[0],p);
				}else this.putField("note",str,p);
			}
		} else {
			this.putField("note",str,notekpos);	
		}
	} else {
		return true;//capture
	}
}
const cb_mulu=function(tag,closing){
	if (closing) {
		var s=this.popText();
		this.addText(s);
		this.putField("mulu",tag.attributes.level+","+s);
	} else {
		return true;//push text
	}
}
const fileStart=function(fn,i){
	console.log(fn);
	var at=fn.lastIndexOf("/");
	const f=fn.substr(at+1);
	this.putField("file",f);
}
const onFinalizeFields=function(fields){

}
const options={inputFormat:"xml",bitPat:"nanchuan",textOnly:true}; //set textOnly not to build inverted
const corpus=createCorpus("nanchuan",options);

corpus.setHandlers(
	{TEI,anchor,note,lb,body,p,"cb:mulu":cb_mulu,ref}, //open tag handlers
	{TEI,note,body,"cb:mulu":cb_mulu},  //end tag handlers
	{bookStart,bookEnd,fileStart}  //other handlers
);

files.forEach(fn=>corpus.addFile(sourcepath+fn));

corpus.writeKDB("nanchuan.cor",function(byteswritten){
	console.log(byteswritten,"bytes written")
});
//console.log(corpus.romable.buildROM({date:(new Date()).toString()}));
console.log(corpus.totalPosting,corpus.tPos);
fs.writeFileSync("disorderPages.json",JSON.stringify(corpus.disorderPages,""," "),"utf8");
fs.writeFileSync("longlines.json",JSON.stringify(corpus.longLines,""," "),"utf8");

