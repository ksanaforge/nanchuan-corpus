const {createCorpus}=require("ksana-corpus-builder");
const fs=require("fs");
const sourcepath="../../../CBETA2016/CBReader/xml/";
const files=fs.readFileSync("nanchuan.lst","utf8").split(/\r?\n/);
files.length=329;
//files.length=3;
/*
N49 之後PTS 冊號未確定
*/

const body=function(tag,closing){
	if (!closing) this.start();
}

const fileStart=function(fn,i){
	console.log(fn);
	noteFileStart();
	var at=fn.lastIndexOf("/");
	const f=fn.substr(at+1);
//	const kpos=this.nextLineStart(this.kPos); //this.kPos point to last char of previos file
	this.putField("file",f);
}

const {milestone,title,cb_div,cb_mulu,head,cb_mulu_finalize}=require("./div");
const {note,anchor,ref,noteFileStart}=require("./note");
const {lb,p,TEI}=require("./format");

const options={inputFormat:"xml",id:"nanchuan"
,removePunc:true,title:"南傳大藏經"}; //set textOnly not to build inverted
const corpus=createCorpus(options);

const finalize=function(){
	cb_mulu_finalize.call(this);
}

corpus.setHandlers(
	{TEI,title,milestone,anchor,note,lb,body,p,"cb:div":cb_div,head,"cb:mulu":cb_mulu,ref},
	{TEI,title,note,body,"cb:div":cb_div,head,"cb:mulu":cb_mulu},
	{fileStart,finalize}  //other handlers
);

files.forEach(fn=>corpus.addFile(sourcepath+fn));

corpus.writeKDB("nanchuan.cor",function(byteswritten){
	console.log(byteswritten,"bytes written")
});
//console.log(corpus.romable.buildROM({date:(new Date()).toString()}));
console.log(corpus.totalPosting,corpus.tPos);
//fs.writeFileSync("disorderPages.json",JSON.stringify(corpus.disorderPages,""," "),"utf8");
fs.writeFileSync("longlines.json",JSON.stringify(corpus.longLines,""," "),"utf8");