const firebaseConfig = {
  apiKey: "AIzaSyCBB_brF7W8c4DhJLML3Q0hoTondFC70tE",
  authDomain: "maos-talentosas.firebaseapp.com",
  databaseURL: "https://maos-talentosas-default-rtdb.firebaseio.com",
  projectId: "maos-talentosas",
  storageBucket: "maos-talentosas.firebasestorage.app",
  messagingSenderId: "933747392934",
  appId: "1:933747392934:web:8d11be0d291102d9c64f67"
};
firebase.initializeApp(firebaseConfig);
var db = firebase.database();

var QRCode=(function(){
"use strict";
var QRErrorCorrectLevel={L:1,M:0,Q:3,H:2};
function QRPolynomial(num,shift){if(num.length==undefined)throw new Error(num.length+"/"+shift);var offset=0;while(offset<num.length&&num[offset]==0)offset++;this.num=new Array(num.length-offset+shift);for(var i=0;i<num.length-offset;i++)this.num[i]=num[i+offset];}
QRPolynomial.prototype={get:function(index){return this.num[index]},getLength:function(){return this.num.length},multiply:function(e){var num=new Array(this.getLength()+e.getLength()-1);for(var i=0;i<this.getLength();i++)for(var j=0;j<e.getLength();j++)num[i+j]^=QRMath.gexp(QRMath.glog(this.get(i))+QRMath.glog(e.get(j)));return new QRPolynomial(num,0)},mod:function(e){if(this.getLength()-e.getLength()<0)return this;var ratio=QRMath.glog(this.get(0))-QRMath.glog(e.get(0));var num=new Array(this.getLength());for(var i=0;i<this.getLength();i++)num[i]=this.get(i);for(var i=0;i<e.getLength();i++)num[i]^=QRMath.gexp(QRMath.glog(e.get(i))+ratio);return new QRPolynomial(num,0).mod(e)}};
var QRMath={glog:function(n){if(n<1)throw new Error("glog("+n+")");return QRMath.LOG_TABLE[n]},gexp:function(n){while(n<0)n+=255;while(n>=256)n-=255;return QRMath.EXP_TABLE[n]},EXP_TABLE:new Array(256),LOG_TABLE:new Array(256)};
for(var i=0;i<8;i++)QRMath.EXP_TABLE[i]=1<<i;
for(var i=8;i<256;i++)QRMath.EXP_TABLE[i]=QRMath.EXP_TABLE[i-4]^QRMath.EXP_TABLE[i-5]^QRMath.EXP_TABLE[i-6]^QRMath.EXP_TABLE[i-8];
for(var i=0;i<255;i++)QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]]=i;
function QRRSBlock(totalCount,dataCount){this.totalCount=totalCount;this.dataCount=dataCount;}
QRRSBlock.RS_BLOCK_TABLE=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]];
QRRSBlock.getRSBlocks=function(typeNumber,errorCorrectLevel){var rsBlock=QRRSBlock.getRsBlockTable(typeNumber,errorCorrectLevel);if(rsBlock==undefined)throw new Error("bad rs block @ typeNumber:"+typeNumber+"/errorCorrectLevel:"+errorCorrectLevel);var length=rsBlock.length/3;var list=[];for(var i=0;i<length;i++){var count=rsBlock[i*3+0];var totalCount=rsBlock[i*3+1];var dataCount=rsBlock[i*3+2];for(var j=0;j<count;j++)list.push(new QRRSBlock(totalCount,dataCount));}return list;};
QRRSBlock.getRsBlockTable=function(typeNumber,errorCorrectLevel){switch(errorCorrectLevel){case QRErrorCorrectLevel.L:return QRRSBlock.RS_BLOCK_TABLE[(typeNumber-1)*4+0];case QRErrorCorrectLevel.M:return QRRSBlock.RS_BLOCK_TABLE[(typeNumber-1)*4+1];case QRErrorCorrectLevel.Q:return QRRSBlock.RS_BLOCK_TABLE[(typeNumber-1)*4+2];case QRErrorCorrectLevel.H:return QRRSBlock.RS_BLOCK_TABLE[(typeNumber-1)*4+3];default:return undefined;}};
function QRBitBuffer(){this.buffer=[];this.length=0;}
QRBitBuffer.prototype={get:function(index){var bufIndex=Math.floor(index/8);return((this.buffer[bufIndex]>>>(7-index%8))&1)==1},put:function(num,length){for(var i=0;i<length;i++)this.putBit(((num>>>(length-i-1))&1)==1)},getLengthInBits:function(){return this.length},putBit:function(bit){var bufIndex=Math.floor(this.length/8);if(this.buffer.length<=bufIndex)this.buffer.push(0);if(bit)this.buffer[bufIndex]|=(0x80>>>(this.length%8));this.length++;}};
var QRMode={MODE_NUMBER:1<<0,MODE_ALPHA_NUM:1<<1,MODE_8BIT_BYTE:1<<2,MODE_KANJI:1<<3};
function QR8bitByte(data){this.mode=QRMode.MODE_8BIT_BYTE;this.data=data;this.parsedData=[];for(var i=0,l=this.data.length;i<l;i++){var byteArray=[];var code=this.data.charCodeAt(i);if(code>0xFFF0&&code<0xFFFD){byteArray[0]=0xEF;byteArray[1]=0xBB;byteArray[2]=0xBF;}else if(code>0x0FFF){byteArray[0]=0xF0|((code&0x1C0000)>>>18);byteArray[1]=0x80|((code&0x3F000)>>>12);byteArray[2]=0x80|((code&0xFC0)>>>6);byteArray[3]=0x80|(code&0x3F);}else if(code>0x07FF){byteArray[0]=0xE0|((code&0xF000)>>>12);byteArray[1]=0x80|((code&0xFC0)>>>6);byteArray[2]=0x80|(code&0x3F);}else if(code>0x007F){byteArray[0]=0xC0|((code&0x7C0)>>>6);byteArray[1]=0x80|(code&0x3F);}else{byteArray[0]=code;}this.parsedData.push(byteArray);}this.parsedData=Array.prototype.concat.apply([],this.parsedData);if(this.parsedData.length!=this.data.length){this.parsedData.unshift(191);this.parsedData.unshift(187);this.parsedData.unshift(239);}}
QR8bitByte.prototype={getLength:function(buffer){return this.parsedData.length},write:function(buffer){for(var i=0,l=this.parsedData.length;i<l;i++)buffer.put(this.parsedData[i],8);}};
function QRCodeModel(typeNumber,errorCorrectLevel){this.typeNumber=typeNumber;this.errorCorrectLevel=errorCorrectLevel;this.modules=null;this.moduleCount=0;this.dataCache=null;this.dataList=[];}
QRCodeModel.prototype={addData:function(data){var newData=new QR8bitByte(data);this.dataList.push(newData);this.dataCache=null;},isDark:function(row,col){if(row<0||this.moduleCount<=row||col<0||this.moduleCount<=col)throw new Error(row+","+col);return this.modules[row][col];},getModuleCount:function(){return this.moduleCount;},make:function(){this.makeImpl(false,this.getBestMaskPattern());},makeImpl:function(test,maskPattern){this.moduleCount=this.typeNumber*4+17;this.modules=new Array(this.moduleCount);for(var row=0;row<this.moduleCount;row++){this.modules[row]=new Array(this.moduleCount);for(var col=0;col<this.moduleCount;col++)this.modules[row][col]=null;}this.setupPositionProbePattern(0,0);this.setupPositionProbePattern(this.moduleCount-7,0);this.setupPositionProbePattern(0,this.moduleCount-7);this.setupPositionAdjustPattern();this.setupTimingPattern();this.setupTypeInfo(test,maskPattern);if(this.typeNumber>=7)this.setupTypeNumber(test);if(this.dataCache==null)this.dataCache=QRCodeModel.createData(this.typeNumber,this.errorCorrectLevel,this.dataList);this.mapData(this.dataCache,maskPattern);},setupPositionProbePattern:function(row,col){for(var r=-1;r<=7;r++){if(row+r<=-1||this.moduleCount<=row+r)continue;for(var c=-1;c<=7;c++){if(col+c<=-1||this.moduleCount<=col+c)continue;if((0<=r&&r<=6&&(c==0||c==6))||(0<=c&&c<=6&&(r==0||r==6))||(2<=r&&r<=4&&2<=c&&c<=4))this.modules[row+r][col+c]=true;else this.modules[row+r][col+c]=false;}}},getBestMaskPattern:function(){var minLostPoint=0;var pattern=0;for(var i=0;i<8;i++){this.makeImpl(true,i);var lostPoint=QRUtil.getLostPoint(this);if(i==0||minLostPoint>lostPoint){minLostPoint=lostPoint;pattern=i;}}return pattern;},setupTimingPattern:function(){for(var r=8;r<this.moduleCount-8;r++){if(this.modules[r][6]!=null)continue;this.modules[r][6]=(r%2==0);}for(var c=8;c<this.moduleCount-8;c++){if(this.modules[6][c]!=null)continue;this.modules[6][c]=(c%2==0);}},setupPositionAdjustPattern:function(){var pos=QRUtil.getPatternPosition(this.typeNumber);for(var i=0;i<pos.length;i++){for(var j=0;j<pos.length;j++){var row=pos[i];var col=pos[j];if(this.modules[row][col]!=null)continue;for(var r=-2;r<=2;r++){for(var c=-2;c<=2;c++){if(r==-2||r==2||c==-2||c==2||(r==0&&c==0))this.modules[row+r][col+c]=true;else this.modules[row+r][col+c]=false;}}}}},setupTypeNumber:function(test){var bits=QRUtil.getBCHTypeNumber(this.typeNumber);for(var i=0;i<18;i++){var mod=(!test&&((bits>>i)&1)==1);this.modules[Math.floor(i/3)][i%3+this.moduleCount-8-3]=mod;}for(var i=0;i<18;i++){var mod=(!test&&((bits>>i)&1)==1);this.modules[i%3+this.moduleCount-8-3][Math.floor(i/3)]=mod;}},setupTypeInfo:function(test,maskPattern){var data=(this.errorCorrectLevel<<3)|maskPattern;var bits=QRUtil.getBCHTypeInfo(data);for(var i=0;i<15;i++){var mod=(!test&&((bits>>i)&1)==1);if(i<6)this.modules[i][8]=mod;else if(i<8)this.modules[i+1][8]=mod;else this.modules[this.moduleCount-15+i][8]=mod;}for(var i=0;i<15;i++){var mod=(!test&&((bits>>i)&1)==1);if(i<8)this.modules[8][this.moduleCount-i-1]=mod;else if(i<9)this.modules[8][15-i-1+1]=mod;else this.modules[8][15-i-1]=mod;}this.modules[this.moduleCount-8][8]=(!test);},mapData:function(data,maskPattern){var inc=-1;var row=this.moduleCount-1;var bitIndex=7;var byteIndex=0;for(var col=this.moduleCount-1;col>0;col-=2){if(col==6)col--;while(true){for(var c=0;c<2;c++){if(this.modules[row][col-c]==null){var dark=false;if(byteIndex<data.length)dark=((data[byteIndex]>>>bitIndex)&1)==1;var mask=QRUtil.getMask(maskPattern,row,col-c);if(mask)dark=!dark;this.modules[row][col-c]=dark;bitIndex--;if(bitIndex==-1){byteIndex++;bitIndex=7;}}}row+=inc;if(row<0||this.moduleCount<=row){row-=inc;inc=-inc;break;}}};}};
QRCodeModel.PAD0=0xEC;QRCodeModel.PAD1=0x11;
QRCodeModel.createData=function(typeNumber,errorCorrectLevel,dataList){var rsBlocks=QRRSBlock.getRSBlocks(typeNumber,errorCorrectLevel);var buffer=new QRBitBuffer();for(var i=0;i<dataList.length;i++){var data=dataList[i];buffer.put(data.mode,4);buffer.put(data.getLength(),QRUtil.getLengthInBits(data.mode,typeNumber));data.write(buffer);}var totalDataCount=0;for(var i=0;i<rsBlocks.length;i++)totalDataCount+=rsBlocks[i].dataCount;if(buffer.getLengthInBits()>totalDataCount*8)throw new Error("code length overflow. ("+buffer.getLengthInBits()+">"+totalDataCount*8+")");if(buffer.getLengthInBits()+4<=totalDataCount*8)buffer.put(0,4);while(buffer.getLengthInBits()%8!=0)buffer.putBit(false);while(true){if(buffer.getLengthInBits()>=totalDataCount*8)break;buffer.put(QRCodeModel.PAD0,8);if(buffer.getLengthInBits()>=totalDataCount*8)break;buffer.put(QRCodeModel.PAD1,8);}return QRCodeModel.createBytes(buffer,rsBlocks);};
QRCodeModel.createBytes=function(buffer,rsBlocks){var offset=0;var maxDcCount=0;var maxEcCount=0;var dcdata=new Array(rsBlocks.length);var ecdata=new Array(rsBlocks.length);for(var r=0;r<rsBlocks.length;r++){var dcCount=rsBlocks[r].dataCount;var ecCount=rsBlocks[r].totalCount-dcCount;maxDcCount=Math.max(maxDcCount,dcCount);maxEcCount=Math.max(maxEcCount,ecCount);dcdata[r]=new Array(dcCount);for(var i=0;i<dcdata[r].length;i++)dcdata[r][i]=0xff&buffer.buffer[i+offset];offset+=dcCount;var rsPoly=QRUtil.getErrorCorrectPolynomial(ecCount);var rawPoly=new QRPolynomial(dcdata[r],rsPoly.getLength()-1);var modPoly=rawPoly.mod(rsPoly);ecdata[r]=new Array(rsPoly.getLength()-1);for(var i=0;i<ecdata[r].length;i++){var modIndex=i+modPoly.getLength()-ecdata[r].length;ecdata[r][i]=(modIndex>=0)?modPoly.get(modIndex):0;}}var totalCodeCount=0;for(var i=0;i<rsBlocks.length;i++)totalCodeCount+=rsBlocks[i].totalCount;var data=new Array(totalCodeCount);var index=0;for(var i=0;i<maxDcCount;i++)for(var r=0;r<rsBlocks.length;r++){if(i<dcdata[r].length)data[index++]=dcdata[r][i];}for(var i=0;i<maxEcCount;i++)for(var r=0;r<rsBlocks.length;r++){if(i<ecdata[r].length)data[index++]=ecdata[r][i];}return data;};
var QRUtil={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],
getPatternPosition:function(typeNumber){return QRUtil.PATTERN_POSITION_TABLE[typeNumber-1];},
getMask:function(maskPattern,i,j){switch(maskPattern){case 0:return(i+j)%2==0;case 1:return i%2==0;case 2:return j%3==0;case 3:return(i+j)%3==0;case 4:return(Math.floor(i/2)+Math.floor(j/3))%2==0;case 5:return(i*j)%2+(i*j)%3==0;case 6:return((i*j)%2+(i*j)%3)%2==0;case 7:return((i+j)%2+(i*j)%3)%2==0;default:throw new Error("bad maskPattern:"+maskPattern);}},
getErrorCorrectPolynomial:function(errorCorrectLength){var a=new QRPolynomial([1],0);for(var i=0;i<errorCorrectLength;i++)a=a.multiply(new QRPolynomial([1,QRMath.gexp(i)],0));return a;},
getLengthInBits:function(mode,type){if(1<=type&&type<10){switch(mode){case QRMode.MODE_NUMBER:return 10;case QRMode.MODE_ALPHA_NUM:return 9;case QRMode.MODE_8BIT_BYTE:return 8;case QRMode.MODE_KANJI:return 8;default:throw new Error("mode:"+mode);}}else if(type<27){switch(mode){case QRMode.MODE_NUMBER:return 12;case QRMode.MODE_ALPHA_NUM:return 11;case QRMode.MODE_8BIT_BYTE:return 16;case QRMode.MODE_KANJI:return 10;default:throw new Error("mode:"+mode);}}else if(type<41){switch(mode){case QRMode.MODE_NUMBER:return 14;case QRMode.MODE_ALPHA_NUM:return 13;case QRMode.MODE_8BIT_BYTE:return 16;case QRMode.MODE_KANJI:return 12;default:throw new Error("mode:"+mode);}}else{throw new Error("type:"+type);}},
getLostPoint:function(qrCode){var moduleCount=qrCode.getModuleCount();var lostPoint=0;for(var row=0;row<moduleCount;row++){for(var col=0;col<moduleCount;col++){var sameCount=0;var dark=qrCode.isDark(row,col);for(var r=-1;r<=1;r++){if(row+r<0||moduleCount<=row+r)continue;for(var c=-1;c<=1;c++){if(col+c<0||moduleCount<=col+c)continue;if(r==0&&c==0)continue;if(dark==qrCode.isDark(row+r,col+c))sameCount++;}}if(sameCount>5)lostPoint+=(3+sameCount-5);}}for(var row=0;row<moduleCount-1;row++){for(var col=0;col<moduleCount-1;col++){var count=0;if(qrCode.isDark(row,col))count++;if(qrCode.isDark(row+1,col))count++;if(qrCode.isDark(row,col+1))count++;if(qrCode.isDark(row+1,col+1))count++;if(count==0||count==4)lostPoint+=3;}}for(var row=0;row<moduleCount;row++){for(var col=0;col<moduleCount-6;col++){if(qrCode.isDark(row,col)&&!qrCode.isDark(row,col+1)&&qrCode.isDark(row,col+2)&&qrCode.isDark(row,col+3)&&qrCode.isDark(row,col+4)&&!qrCode.isDark(row,col+5)&&qrCode.isDark(row,col+6))lostPoint+=40;}}for(var col=0;col<moduleCount;col++){for(var row=0;row<moduleCount-6;row++){if(qrCode.isDark(row,col)&&!qrCode.isDark(row+1,col)&&qrCode.isDark(row+2,col)&&qrCode.isDark(row+3,col)&&qrCode.isDark(row+4,col)&&!qrCode.isDark(row+5,col)&&qrCode.isDark(row+6,col))lostPoint+=40;}}var darkCount=0;for(var col=0;col<moduleCount;col++){for(var row=0;row<moduleCount;row++){if(qrCode.isDark(row,col))darkCount++;}}var ratio=Math.abs(100*darkCount/moduleCount/moduleCount-50)/5;lostPoint+=ratio*10;return lostPoint;},
getBCHTypeInfo:function(data){var d=data<<10;while(QRUtil.getBCHDigit(d)-QRUtil.getBCHDigit(1335)>=0)d^=(1335<<(QRUtil.getBCHDigit(d)-QRUtil.getBCHDigit(1335)));return((data<<10)|d)^21522;},
getBCHTypeNumber:function(data){var d=data<<12;while(QRUtil.getBCHDigit(d)-QRUtil.getBCHDigit(7973)>=0)d^=(7973<<(QRUtil.getBCHDigit(d)-QRUtil.getBCHDigit(7973)));return(data<<12)|d;},
getBCHDigit:function(data){var digit=0;while(data!=0){digit++;data>>>=1;}return digit;}};
return{toCanvas:function(canvas,text,options,callback){try{var ecl=QRErrorCorrectLevel.M;var typeNumber=0;for(var i=1;i<=40;i++){var rsBlocks=QRRSBlock.getRSBlocks(i,ecl);var totalDataCount=0;for(var j=0;j<rsBlocks.length;j++)totalDataCount+=rsBlocks[j].dataCount;var data=new QR8bitByte(text);if(data.getLength()+Math.ceil((4+QRUtil.getLengthInBits(QRMode.MODE_8BIT_BYTE,i))/8)<=totalDataCount){typeNumber=i;break;}}if(typeNumber===0){if(callback)callback(new Error("Data too long"));return;}var qr=new QRCodeModel(typeNumber,ecl);qr.addData(text);qr.make();var size=options&&options.width?options.width:200;var margin=options&&options.margin!==undefined?options.margin:2;var mc=qr.getModuleCount();var cellSize=Math.floor(size/mc);var actualSize=cellSize*mc+margin*2;canvas.width=actualSize;canvas.height=actualSize;var ctx=canvas.getContext('2d');var dark=(options&&options.color&&options.color.dark)||'#000000';var light=(options&&options.color&&options.color.light)||'#ffffff';ctx.fillStyle=light;ctx.fillRect(0,0,actualSize,actualSize);ctx.fillStyle=dark;for(var r=0;r<mc;r++){for(var c=0;c<mc;c++){if(qr.isDark(r,c))ctx.fillRect(margin+c*cellSize,margin+r*cellSize,cellSize,cellSize);}}if(callback)callback(null);}catch(e){if(callback)callback(e);}}};
})();

// ─── STATE ───────────────────────────────────────────────
var S = JSON.parse(localStorage.getItem('maos_v3') || '{}');
if(!S.pedidos) S.pedidos = [];
if(!S.evento)  S.evento  = {nome:'', data:''};
if(!S.cardapio) S.cardapio = [];
if(!S.senha)   S.senha   = 'admin123';

function save(){
  localStorage.setItem('maos_v3', JSON.stringify(S));
}
function syncToFirebase(){
  db.ref('evento').set(S.evento);
  db.ref('cardapio').set(S.cardapio.length ? S.cardapio : []);
  db.ref('senha').set(S.senha);
}
function salvarPedidoFirebase(pedido){
  db.ref('pedidos/' + pedido.id).set(pedido);
}
function atualizarPedidoFirebase(pedido){
  db.ref('pedidos/' + pedido.id).set(pedido);
}
function excluirPedidoFirebase(id){
  db.ref('pedidos/' + id).remove();
}
function fmt(v){ return 'R$ ' + Number(v).toFixed(2).replace('.',','); }
function fmtDate(d){ if(!d) return ''; var p=d.split('-'); return p[2]+'/'+p[1]+'/'+p[0]; }

// ─── PEDIDO STATE ─────────────────────────────────────────
var qtds = {};      // {idx: quantidade}
var pgtoSel = 'pix';
var consumoSel = 'local';

// ─── INIT ─────────────────────────────────────────────────
function initUI(){
  if(!S.evento.nome){
    document.getElementById('sem-evento').style.display='block';
    document.getElementById('sem-produtos').style.display='none';
    document.getElementById('fluxo-pedido').style.display='none';
    return;
  }
  if(!S.cardapio.length){
    document.getElementById('sem-evento').style.display='none';
    document.getElementById('sem-produtos').style.display='block';
    document.getElementById('fluxo-pedido').style.display='none';
    return;
  }
  document.getElementById('sem-evento').style.display='none';
  document.getElementById('sem-produtos').style.display='none';
  document.getElementById('fluxo-pedido').style.display='block';
  document.getElementById('header-sub').textContent = S.evento.nome;
  var chip = document.getElementById('evento-chip-box');
  chip.innerHTML = '<div class="evento-chip">📅 ' + S.evento.nome + (S.evento.data ? ' · ' + fmtDate(S.evento.data) : '') + '</div>';
  renderCardapioCliente();
}

function init(){
  // Mostra loading
  document.getElementById('sem-evento').style.display='none';
  document.getElementById('sem-produtos').style.display='none';
  document.getElementById('fluxo-pedido').style.display='none';

  // Carrega do Firebase em tempo real
  db.ref('/').on('value', function(snapshot){
    var data = snapshot.val() || {};
    S.evento   = data.evento   || {nome:'', data:''};
    S.cardapio = data.cardapio || [];
    S.senha    = data.senha    || 'admin123';
    // pedidos como array
    var pedidosObj = data.pedidos || {};
    S.pedidos = Object.values(pedidosObj).sort(function(a,b){return a.id-b.id;});
    save();
    initUI();
    // Atualiza painel se admin estiver aberto
    if(document.getElementById('area-admin').style.display !== 'none'){
      renderPainel();
    }
  }, function(error){
    console.error('Firebase error:', error);
    // fallback para localStorage
    initUI();
  });
}

function renderCardapioCliente(){
  var el = document.getElementById('cardapio-cliente');
  S.cardapio.forEach(function(p, i){
    if(qtds[i] === undefined) qtds[i] = 0;
  });
  el.innerHTML = S.cardapio.map(function(p, i){
    return '<div class="produto-item">' +
      '<div><div class="produto-nome">' + p.nome + '</div>' +
      '<div class="produto-preco">' + fmt(p.preco) + ' / unidade</div></div>' +
      '<div class="qty-control">' +
        '<button class="qty-btn" onclick="changeQty(' + i + ',-1)">−</button>' +
        '<div class="qty-num" id="qty-' + i + '">' + (qtds[i]||0) + '</div>' +
        '<button class="qty-btn" onclick="changeQty(' + i + ',1)">+</button>' +
      '</div>' +
    '</div>';
  }).join('');
  atualizarTotal();
}

function changeQty(i, delta){
  qtds[i] = Math.max(0, (qtds[i]||0) + delta);
  document.getElementById('qty-' + i).textContent = qtds[i];
  atualizarTotal();
}

function atualizarTotal(){
  var total = 0;
  S.cardapio.forEach(function(p,i){ total += (qtds[i]||0) * p.preco; });
  document.getElementById('total-display').textContent = fmt(total);
  var temItem = total > 0;
  var btn = document.getElementById('btn-passo2');
  btn.disabled = !temItem;
  btn.style.opacity = temItem ? '1' : '.4';
  btn.style.cursor = temItem ? 'pointer' : 'not-allowed';
}

function getTotal(){
  var total = 0;
  S.cardapio.forEach(function(p,i){ total += (qtds[i]||0) * p.preco; });
  return total;
}

function getItens(){
  return S.cardapio.map(function(p,i){ return {nome:p.nome, preco:p.preco, qtd:qtds[i]||0, subtotal:(qtds[i]||0)*p.preco}; }).filter(function(x){return x.qtd>0;});
}

// ─── STEPS ────────────────────────────────────────────────
function setStep(n){
  for(var i=1;i<=3;i++){
    var dot = document.getElementById('step'+i);
    if(i < n){ dot.className='step-dot done'; dot.textContent='✓'; }
    else if(i === n){ dot.className='step-dot active'; dot.textContent=i; }
    else{ dot.className='step-dot'; dot.textContent=i; }
  }
  for(var i=1;i<=2;i++){
    document.getElementById('line'+i).className = 'step-line' + (i < n ? ' done' : '');
  }
  document.querySelectorAll('[id^=passo]').forEach(function(el){ el.classList.remove('active'); });
  document.getElementById('passo'+n).classList.add('active');
}

function irPasso1(){ setStep(1); }

function irPasso2(){
  if(getTotal() <= 0) return;
  setStep(2);
}

function irPasso3(){
  var nome = document.getElementById('p-nome').value.trim();
  if(!nome){ alert('Informe seu nome para continuar.'); return; }
  // monta resumo
  var itens = getItens();
  document.getElementById('resumo-itens').innerHTML = itens.map(function(it){
    return '<div class="resumo-item"><span>' + it.qtd + '× ' + it.nome + '</span><span>' + fmt(it.subtotal) + '</span></div>';
  }).join('');
  document.getElementById('resumo-total').textContent = fmt(getTotal());
  var pgtoLabels = {pix:'Pix',cartao:'Cartão',dinheiro:'Dinheiro',depois:'Pagar depois'};
  var consumoLabels = {local:'Comer na hora', viagem:'Para viagem'};
  var dadosHtml = '<b style="color:var(--text)">' + nome + '</b>';
  var tel = document.getElementById('p-tel').value.trim();
  if(tel) dadosHtml += '<br>' + tel;
  dadosHtml += '<br>Consumo: ' + consumoLabels[consumoSel];
  dadosHtml += '<br>Pagamento: ' + pgtoLabels[pgtoSel];
  var dp = document.getElementById('p-data-pagto').value;
  if(pgtoSel==='depois' && dp) dadosHtml += ' · pagar em ' + fmtDate(dp);
  document.getElementById('resumo-dados').innerHTML = dadosHtml;
  setStep(3);
}

function selecionarConsumo(el, val){
  consumoSel = val;
  document.querySelectorAll('#cons-local, #cons-viagem').forEach(function(o){ o.classList.remove('selected'); });
  el.classList.add('selected');
}

function selecionarPgto(el, val){
  pgtoSel = val;
  document.querySelectorAll('.pgto-op').forEach(function(o){ o.classList.remove('selected'); });
  el.classList.add('selected');
  document.getElementById('grupo-data').style.display = val === 'depois' ? 'block' : 'none';
}

function confirmarPedido(){
  var nome = document.getElementById('p-nome').value.trim();
  var itens = getItens();
  if(!nome || !itens.length) return;
  var novoPedido = {
    id: Date.now(),
    nome: nome,
    tel: document.getElementById('p-tel').value.trim(),
    itens: itens,
    total: getTotal(),
    pagamento: pgtoSel,
    dataPagto: pgtoSel==='depois' ? document.getElementById('p-data-pagto').value : '',
    consumo: consumoSel,
    status: pgtoSel==='depois' ? 'depois' : 'pendente',
    hora: new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}),
    evento: S.evento.nome || '',
    dataEvento: S.evento.data || ''
  };
  S.pedidos.push(novoPedido);
  save();
  salvarPedidoFirebase(novoPedido);
  // reset
  S.cardapio.forEach(function(_,i){ qtds[i]=0; });
  document.getElementById('p-nome').value='';
  document.getElementById('p-tel').value='';
  document.getElementById('p-data-pagto').value='';
  pgtoSel='pix';
  consumoSel='local';
  document.getElementById('cons-local').classList.add('selected');
  document.getElementById('cons-viagem').classList.remove('selected');
  document.querySelectorAll('.pgto-op').forEach(function(o,i){ o.classList.toggle('selected',i===0); });
  document.getElementById('grupo-data').style.display='none';

  var msg = document.getElementById('success-msg');
  msg.style.display='block';
  // volta pro passo 1 após 3s
  setTimeout(function(){
    msg.style.display='none';
    renderCardapioCliente();
    setStep(1);
  }, 3000);
}

// ─── ADMIN ────────────────────────────────────────────────
function abrirModalSenha(){
  document.getElementById('modal-senha').classList.add('show');
  document.getElementById('input-senha').value='';
  document.getElementById('senha-erro').style.display='none';
  setTimeout(function(){ document.getElementById('input-senha').focus(); }, 100);
}

function fecharModalSenha(){
  document.getElementById('modal-senha').classList.remove('show');
}

function verificarSenha(){
  var v = document.getElementById('input-senha').value;
  if(v === S.senha){
    fecharModalSenha();
    document.getElementById('area-cliente').style.display='none';
    document.getElementById('area-admin').style.display='block';
    renderPainel();
    renderConfig();
    // esconde botão admin
    document.querySelector('[onclick="abrirModalSenha()"]').style.display='none';
  } else {
    document.getElementById('senha-erro').style.display='block';
    document.getElementById('input-senha').select();
  }
}

function sairAdmin(){
  document.getElementById('area-admin').style.display='none';
  document.getElementById('area-cliente').style.display='block';
  document.querySelector('[onclick="abrirModalSenha()"]').style.display='inline-block';
}

function switchAdmin(t){
  document.querySelectorAll('.admin-tab').forEach(function(b,i){ b.classList.toggle('active',['painel','relatorio','config'][i]===t); });
  document.querySelectorAll('#area-admin .tab-content').forEach(function(c){ c.classList.remove('active'); });
  document.getElementById('admin-'+t).classList.add('active');
  if(t==='relatorio') renderRelatorio();
}

var pgtoLabel = {pix:'Pix',cartao:'Cartão',dinheiro:'Dinheiro',depois:'Depois'};

function renderPainel(){
  var fs = document.getElementById('filtro-status').value;
  var fp = document.getElementById('filtro-pgto').value;
  var ps = S.pedidos.slice().reverse();
  if(fs) ps = ps.filter(function(p){return p.status===fs;});
  if(fp) ps = ps.filter(function(p){return p.pagamento===fp;});
  var recebido = S.pedidos.filter(function(p){return p.status==='pago';}).reduce(function(a,p){return a+p.total;},0);
  var areceber = S.pedidos.filter(function(p){return p.status!=='pago';}).reduce(function(a,p){return a+p.total;},0);
  document.getElementById('m-total').textContent = S.pedidos.length;
  document.getElementById('m-recebido').textContent = fmt(recebido);
  document.getElementById('m-areceber').textContent = fmt(areceber);
  var el = document.getElementById('lista-pedidos');
  if(!ps.length){ el.innerHTML='<div class="empty">Nenhum pedido.</div>'; return; }
  el.innerHTML = ps.map(function(p){
    return '<div class="pedido-card">' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">' +
        '<div>' +
          '<div style="font-weight:700;font-size:14px">' + p.nome + '</div>' +
          '<div style="font-size:12px;color:var(--text2);margin-top:3px">' + p.hora + ' · ' + (p.consumo==='viagem'?'🥡 Para viagem':'🪑 Na hora') + ' · ' + (pgtoLabel[p.pagamento]||p.pagamento) + (p.dataPagto?' · até '+fmtDate(p.dataPagto):'') + (p.tel?' · '+p.tel:'') + '</div>' +
          '<div style="font-size:12px;color:var(--text2);margin-top:2px">' + p.itens.map(function(it){return it.qtd+'× '+it.nome;}).join(', ') + '</div>' +
        '</div>' +
        '<div style="text-align:right;flex-shrink:0">' +
          '<div style="font-weight:700;font-size:15px">' + fmt(p.total) + '</div>' +
          '<span class="badge badge-' + p.status + '">' + (p.status==='pago'?'Pago':p.status==='depois'?'Depois':'Pendente') + '</span>' +
        '</div>' +
      '</div>' +
      '<div style="display:flex;gap:6px;margin-top:8px;justify-content:flex-end">' +
        (p.status!=='pago' ? '<button class="btn-sm" onclick="marcarPago('+p.id+')" style="background:var(--green-bg);border-color:var(--green);color:var(--green-text)">✓ Pago</button>' : '<button class="btn-sm" onclick="desmarcarPago('+p.id+')">Desfazer</button>') +
        '<button class="btn-sm" onclick="excluirPedido('+p.id+')" style="color:var(--red);border-color:var(--red)">🗑</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

function marcarPago(id){ var p=S.pedidos.find(function(p){return p.id===id;}); if(p){p.status='pago';save();atualizarPedidoFirebase(p);renderPainel();} }
function desmarcarPago(id){ var p=S.pedidos.find(function(p){return p.id===id;}); if(p){p.status=p.pagamento==='depois'?'depois':'pendente';save();atualizarPedidoFirebase(p);renderPainel();} }
function excluirPedido(id){ if(!confirm('Excluir pedido?'))return; S.pedidos=S.pedidos.filter(function(p){return p.id!==id;}); save();excluirPedidoFirebase(id);renderPainel(); }

function renderRelatorio(){
  var el = document.getElementById('tabela-rel');
  if(!S.pedidos.length){ el.innerHTML='<div class="empty">Nenhum pedido.</div>'; return; }

  var totalGeral = S.pedidos.reduce(function(a,p){return a+p.total;},0);
  var totalPago  = S.pedidos.filter(function(p){return p.status==='pago';}).reduce(function(a,p){return a+p.total;},0);
  var totalAReceber = S.pedidos.filter(function(p){return p.status!=='pago';}).reduce(function(a,p){return a+p.total;},0);
  var consumoLabel = {local:'🪑 Na hora', viagem:'🥡 Para viagem'};

  var resumoHtml =
    '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px">' +
      '<div class="metric"><div class="metric-val">' + S.pedidos.length + '</div><div class="metric-label">Pedidos</div></div>' +
      '<div class="metric"><div class="metric-val" style="font-size:14px">' + fmt(totalPago) + '</div><div class="metric-label">Recebido</div></div>' +
      '<div class="metric"><div class="metric-val" style="font-size:14px">' + fmt(totalAReceber) + '</div><div class="metric-label">A receber</div></div>' +
    '</div>';

  var cardsHtml = S.pedidos.slice().reverse().map(function(p){
    return '<div style="background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-lg);padding:14px;margin-bottom:10px">' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:8px">' +
        '<div>' +
          '<div style="font-weight:700;font-size:14px">' + p.nome + '</div>' +
          '<div style="font-size:12px;color:var(--text2);margin-top:2px">' + (p.tel||'') + '</div>' +
        '</div>' +
        '<div style="text-align:right;flex-shrink:0">' +
          '<div style="font-weight:700;font-size:16px">' + fmt(p.total) + '</div>' +
          '<span class="badge badge-' + p.status + '">' + (p.status==='pago'?'Pago':p.status==='depois'?'Depois':'Pendente') + '</span>' +
        '</div>' +
      '</div>' +
      '<div style="border-top:1px solid var(--border);padding-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px 12px;font-size:12px">' +
        '<div style="color:var(--text3)">Horário</div><div style="color:var(--text)">' + p.hora + '</div>' +
        '<div style="color:var(--text3)">Itens</div><div style="color:var(--text)">' + p.itens.map(function(i){return i.qtd+'× '+i.nome;}).join(', ') + '</div>' +
        '<div style="color:var(--text3)">Pagamento</div><div style="color:var(--text)">' + (pgtoLabel[p.pagamento]||p.pagamento) + (p.dataPagto?' · '+fmtDate(p.dataPagto):'') + '</div>' +
        '<div style="color:var(--text3)">Consumo</div><div style="color:var(--text)">' + (consumoLabel[p.consumo]||'—') + '</div>' +
      '</div>' +
    '</div>';
  }).join('');

  var totalHtml =
    '<div style="background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:14px;display:flex;justify-content:space-between;align-items:center;margin-top:4px">' +
      '<span style="font-weight:700;font-size:14px">Total geral</span>' +
      '<span style="font-weight:700;font-size:18px">' + fmt(totalGeral) + '</span>' +
    '</div>';

  el.innerHTML = resumoHtml + cardsHtml + totalHtml;
}

function exportarCSV(){
  var rows=[['Hora','Nome','Telefone','Itens','Total','Pagamento','Status','Data pgto','Evento']];
  S.pedidos.forEach(function(p){rows.push([p.hora,p.nome,p.tel,p.itens.map(function(i){return i.qtd+'x '+i.nome;}).join('; '),p.total.toFixed(2),p.pagamento,p.status,p.dataPagto||'',p.evento]);});
  var csv=rows.map(function(r){return r.map(function(v){return'"'+String(v).replace(/"/g,'""')+'"';}).join(',');}).join('\n');
  var a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8;'}));a.download='pedidos_maos_talentosas.csv';a.click();
}

function exportarJSON(){
  var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(S,null,2)],{type:'application/json'}));a.download='backup_maos_talentosas.json';a.click();
}

function importarJSON(){
  var inp=document.createElement('input');inp.type='file';inp.accept='.json';
  inp.onchange=function(e){
    var f=e.target.files[0];if(!f)return;
    var r=new FileReader();r.onload=function(ev){
      try{var d=JSON.parse(ev.target.result);
        if(!confirm('Importar '+( d.pedidos?.length||0)+' pedidos?'))return;
        if(d.pedidos)S.pedidos=[...S.pedidos,...d.pedidos.filter(function(np){return!S.pedidos.find(function(ep){return ep.id===np.id;});})];
        if(d.evento&&d.evento.nome)S.evento=d.evento;
        if(d.cardapio)S.cardapio=d.cardapio;
        if(d.senha)S.senha=d.senha;
        save();alert('Importado!');renderConfig();
      }catch(e){alert('Arquivo inválido.');}
    };r.readAsText(f);
  };inp.click();
}

function limparPedidos(){ if(!confirm('Apagar TODOS os pedidos?'))return; S.pedidos=[];save();db.ref('pedidos').remove();renderPainel();renderRelatorio();alert('Pedidos apagados.'); }

function renderConfig(){
  document.getElementById('cfg-ev-nome').value=S.evento.nome||'';
  document.getElementById('cfg-ev-data').value=S.evento.data||'';
  renderCfgCardapio();
}

function salvarEvento(){
  S.evento.nome=document.getElementById('cfg-ev-nome').value.trim();
  S.evento.data=document.getElementById('cfg-ev-data').value;
  save();syncToFirebase();alert('Evento salvo!');
}

function salvarSenha(){
  var ns=document.getElementById('cfg-senha').value.trim();
  if(!ns){alert('Digite a nova senha.');return;}
  S.senha=ns;save();syncToFirebase();document.getElementById('cfg-senha').value='';alert('Senha atualizada!');
}

function renderCfgCardapio(){
  var el=document.getElementById('cfg-cardapio-list');
  if(!S.cardapio.length){el.innerHTML='<p style="font-size:13px;color:var(--text3);margin-bottom:8px">Nenhum produto ainda.</p>';return;}
  el.innerHTML=S.cardapio.map(function(p,i){
    return '<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);font-size:13px">' +
      '<span style="flex:1">'+p.nome+'</span><span style="color:var(--text2)">'+fmt(p.preco)+'</span>' +
      '<button class="btn-sm" onclick="removeProduto('+i+')" style="padding:2px 8px">×</button>' +
    '</div>';
  }).join('')+'<div style="height:4px"></div>';
}

function addProduto(){
  var nome=document.getElementById('cfg-prod-nome').value.trim();
  var preco=parseFloat(document.getElementById('cfg-prod-preco').value)||0;
  if(!nome){alert('Informe o nome.');return;}
  S.cardapio.push({nome:nome,preco:preco});save();syncToFirebase();
  document.getElementById('cfg-prod-nome').value='';
  document.getElementById('cfg-prod-preco').value='';
  renderCfgCardapio();
}

function removeProduto(i){S.cardapio.splice(i,1);save();syncToFirebase();renderCfgCardapio();}

function gerarQR(){
  var url=document.getElementById('cfg-url').value.trim();
  if(!url){alert('Cole o link do site.');return;}
  var canvas=document.getElementById('qr-canvas');
  QRCode.toCanvas(canvas,url,{width:200,margin:2,color:{dark:'#1a1a1a',light:'#ffffff'}},function(err){
    if(err){alert('Erro: '+err);return;}
    document.getElementById('qr-result').style.display='block';
    document.getElementById('qr-placeholder').style.display='none';
    document.getElementById('qr-url-text').textContent=url;
  });
}

function baixarQR(){
  var canvas=document.getElementById('qr-canvas');
  var a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download='qrcode_maos_talentosas.png';a.click();
}

// ─── START ────────────────────────────────────────────────
init();