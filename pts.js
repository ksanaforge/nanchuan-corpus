const makeKPos=require("ksana-corpus-builder").makeKPos;
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
		kpos=makeKPos(volstart[r[1]] ,parseInt(r[2],10)-1,0,0,"pts");
	} else {
		const vol=volstart[r[1]]+parseInt(r[2],10);
		kpos=makeKPos(vol ,parseInt(r[3],10)-1,0,0,"pts");
	}
	return kpos;
}
module.exports={encodePTS};