(function(){
var M={},C={};function require(id){id=id.replace(/\\/g,"/");if(id.startsWith("./"))id=id.slice(2);if(!id.endsWith(".js"))id+=".js";if(!M[id]){var hit=Object.keys(M).find(k=>k.endsWith(id));if(hit)id=hit;}if(!M[id])throw new Error("Missing browser module: "+id);if(C[id])return C[id].exports;var m=C[id]={exports:{}};M[id](m,m.exports,function(rel){var base=id.split("/").slice(0,-1).join("/");var full=rel.startsWith(".")?pathNorm(base+"/"+rel):rel;return require(full);});return m.exports;}function pathNorm(p){var a=[];p.split("/").forEach(x=>{if(x==="..")a.pop();else if(x!=="."&&x!=="")a.push(x)});return a.join("/");}
M["src/config.js"]=function(module,exports,require){
module.exports = {
  version: '0.3.0',
  title: '别让它进来',
  subtitle: '把敌人的路线，变成你的武器',
  gameId: 'keep-it-out',
  authEndpoint: 'https://sumind.vip',
  defenseZones: ['长安里','山海关','望江台','青云岭','龙门渡','雁回川','万里营','定远城'],
  avatars: [
    {background:'#E4F5E9',color:'#2B9E66',pixels:['0000111','0000100','0011100','0010000','2210000','2200000','0000000']},
    {background:'#E6F0FA',color:'#2D8BE8',pixels:['0111110','1222221','1203021','1200021','1200021','1100011','0000000']},
    {background:'#FDECE0',color:'#F06A24',pixels:['0001000','0013100','0123210','0012100','0012100','0122210','1111111']},
    {background:'#E8ECE3',color:'#202620',pixels:['1111111','1223221','1233321','1223221','0122210','0012100','0001000']},
    {background:'#EAEEE2',color:'#5E6B5B',pixels:['1111111','1221321','1111111','1312211','1111111','1221231','1111111']},
    {background:'#FFF3DE',color:'#E59A1A',pixels:['0010100','0123210','1233321','0123210','0012100','0122210','1100011']},
    {background:'#EFE8FA',color:'#8558D6',pixels:['0111110','1222221','1312131','1222221','1211121','0111110','0000000']},
    {background:'#FCE6E8',color:'#D9434E',pixels:['1001001','1212121','1223221','1233321','1222221','1111111','0000000']}
  ],
  startEnergy: 250,
  startCore: 12,
  progression: { levelOneDamage:1.4, damageGrowth:1.3, rangeGrowth:.035, rangeMaxBonus:.35, upgradeBase:60, upgradeGrowth:1.32 },
  waves: { baseCount:6, countGrowth:1.55, maxCount:42, hpBase:50, hpPerWave:18, hpGrowth:1.012, speedPerWave:1.25, speedGrowthWaves:32, clearBase:36, clearPerWave:7, flawlessBase:14, flawlessPerWave:2, bossEvery:10, bossStartScale:.5, bossScaleStep:.1, nextWaveDelay:4.5 },
  scoring: { waveGrowth:.1, clearPerWave:80, flawlessPerWave:60, coreEnd:150, energyEnd:.25 },
  grid: { cols: 14, rows: 18, entryRow: 0, exitRow: 17, maxPathSteps:72 },
  enemies: [
    { id:'drone', name:'常体', trait:'标准推进', color:'#E84A67', hpScale:1, speed:43, lifeDamage:1, reward:18, rewardGrowth:.025, score:20, unlockWave:1, weight:.9, weightGrowth:0, maxWeight:.9 },
    { id:'swift', name:'疾体', trait:'高速穿行', color:'#E59A1A', hpScale:.9, speed:62, lifeDamage:1, reward:21, rewardGrowth:.025, score:28, unlockWave:3, weight:.24, weightGrowth:.022, maxWeight:.5 },
    { id:'armored', name:'甲体', trait:'高生命 · 高威胁', color:'#EB6B26', hpScale:1.8, speed:30, lifeDamage:2, reward:29, rewardGrowth:.03, score:42, unlockWave:4, weight:.18, weightGrowth:.016, maxWeight:.38 },
    { id:'warden', name:'核心侵体', trait:'首领 · 抗束缚', color:'#D93848', hpScale:7.5, speed:26, lifeDamage:4, reward:240, rewardGrowth:.05, score:500, slowResistance:.55, unlockWave:10, boss:true }
  ],
  towers: [
    { id:'wall', glyph:'wall', attack:'block', name:'路障', hint:'阻挡改道', cost:45, range:0, rate:999, damage:0, color:'#5E6B5B' },
    { id:'spark', glyph:'spark', attack:'beam', name:'脉冲塔', hint:'高速直击', cost:90, range:112, rate:0.48, damage:16, color:'#2D8BE8' },
    { id:'nova', glyph:'nova', attack:'blast', name:'星爆塔', hint:'范围爆破', cost:145, range:92, rate:1.15, damage:30, splash:46, splashFalloff:.72, color:'#F06A24' },
    { id:'frost', glyph:'frost', attack:'slow', name:'引力塔', hint:'束缚减速', cost:120, range:104, rate:0.82, damage:8, slow:0.56, slowDuration:1.1, color:'#8558D6' }
  ]
};

};
M["src/platform.js"]=function(module,exports,require){
function createPlatform() {
  var isDouyin = typeof tt !== 'undefined' && !!tt.createCanvas;
  var isWechat = !isDouyin && typeof wx !== 'undefined' && !!wx.createCanvas;
  var mini = isDouyin ? tt : (isWechat ? wx : null);
  var isMini = !!mini;
  var canvas = isMini ? mini.createCanvas() : document.createElement('canvas');
  if (!isMini) document.body.appendChild(canvas);
  var info = isMini && mini.getSystemInfoSync ? mini.getSystemInfoSync() : {
    windowWidth: window.innerWidth, windowHeight: window.innerHeight, pixelRatio: window.devicePixelRatio || 1
  };
  var width = info.windowWidth || 390, height = info.windowHeight || 844;
  var safe = info.safeArea || {top:0,bottom:height};
  var dpr = Math.min(info.pixelRatio || 1, 2);
  function sizeCanvas() {
    canvas.width=Math.round(width*dpr);
    canvas.height=Math.round(height*dpr);
  }
  sizeCanvas();
  var ctx = canvas.getContext('2d'); ctx.scale(dpr,dpr);
  var resizeHandlers=[];
  function resizeBrowserCanvas() {
    var nextWidth=window.innerWidth||width,nextHeight=window.innerHeight||height,nextDpr=Math.min(window.devicePixelRatio||1,2);
    if(nextWidth===width&&nextHeight===height&&nextDpr===dpr)return;
    width=nextWidth;height=nextHeight;dpr=nextDpr;
    sizeCanvas();
    ctx.scale(dpr,dpr);
    Object.assign(platform,{width:width,height:height,dpr:dpr,safeBottom:height});
    resizeHandlers.forEach(function(fn){fn();});
  }
  var hapticsEnabled = true, music = null, musicEnabled = true, musicVolume = .45, sfxEnabled = true, sfxVolume = .65, musicInBackground = false, audioUnlocked = false, hidden = false, audioContext = null, showHandlers = [], latestShowOptions = isMini&&mini.getLaunchOptionsSync?mini.getLaunchOptionsSync():{};
  if(isMini&&mini.onShow)mini.onShow(function(options){latestShowOptions=options||{};hidden=false;syncMusic();for(var i=0;i<showHandlers.length;i++)showHandlers[i](latestShowOptions);});
  if(!isMini){
    if(window.addEventListener)window.addEventListener('online',emitShow);
    if(document.addEventListener)document.addEventListener('visibilitychange',function(){if(!document.hidden)emitShow();});
  }
  if(isMini&&mini.onNetworkStatusChange)mini.onNetworkStatusChange(function(status){if(status.isConnected)emitShow();});
  function emitShow(){showHandlers.forEach(function(fn){fn({});});}
  function storageRead(key){
    try{var raw=isMini?mini.getStorageSync(key):localStorage.getItem(key);return raw?JSON.parse(raw):null;}catch(e){return null;}
  }
  function storageWrite(key,value){
    try{
      var store=isMini?mini:null;
      if(value===null){if(store)store.removeStorageSync(key);else localStorage.removeItem(key);}
      else if(store)store.setStorageSync(key,JSON.stringify(value));
      else localStorage.setItem(key,JSON.stringify(value));
      return true;
    }catch(e){return false;}
  }
  function request(options){
    var method=options.method||'GET',headers=Object.assign({},options.headers);
    if(options.data!==undefined)headers['Content-Type']='application/json';
    return new Promise(function(resolve,reject){
      function offline(){var error=new Error('网络不可用，已切换到离线模式');error.offline=true;reject(error);}
      function complete(status,data){
        if(typeof data==='string'){try{data=JSON.parse(data);}catch(e){data=null;}}
        if(status>=200&&status<300&&data&&typeof data==='object'){resolve(data);return;}
        if(status>=500&&(!data||!data.error)){offline();return;}
        var error=new Error(data&&data.message||'云端请求未完成');
        error.status=status;error.code=data&&data.error;reject(error);
      }
      var timer=setTimeout(offline,6500);
      function done(status,data){clearTimeout(timer);complete(status,data);}
      function failed(){clearTimeout(timer);offline();}
      try{
        if(isMini&&mini.request){
          mini.request({url:options.url,method:method,header:headers,data:options.data,timeout:6000,
            success:function(res){done(res.statusCode,res.data);},fail:failed});
        }else if(!isMini&&typeof fetch==='function'){
          var cancel=typeof AbortController==='function'?new AbortController():null;
          if(cancel){clearTimeout(timer);timer=setTimeout(function(){cancel.abort();offline();},6500);}
          fetch(options.url,{method:method,headers:headers,body:options.data===undefined?undefined:JSON.stringify(options.data),
            credentials:'same-origin',redirect:'error',signal:cancel&&cancel.signal}).then(function(res){
            return res.text().then(function(data){done(res.status,data);});
          }).catch(failed);
        }else failed();
      }catch(e){failed();}
    });
  }
  function loginCode(interactive){
    return new Promise(function(resolve,reject){
      if(!isMini||!mini.login){reject(new Error('当前平台无法登录'));return;}
      var timer=setTimeout(function(){reject(new Error('平台登录超时'));},6500);
      mini.login(Object.assign(isDouyin?{force:!!interactive}:{},{
        success:function(result){clearTimeout(timer);if(result.code)resolve(result.code);else reject(new Error('当前平台未登录'));},
        fail:function(){clearTimeout(timer);reject(new Error('平台登录未完成'));}
      }));
    });
  }
  function showMessage(title,content){
    if(isMini&&mini.showModal){mini.showModal({title:title,content:content,showCancel:false});return;}
    if(!isMini&&typeof window.alert==='function')window.alert(title+'\n'+content);
  }
  function chooseLogin(target){
    if(isMini)return;
    try{window.sessionStorage.setItem('sumind:auth-return',JSON.stringify({target:target,expiresAt:Date.now()+30*60*1000}));}catch(e){}
    window.location.assign('/account/login');
  }
  function loginReturn(){
    if(isMini||!apiMeta)return '';
    var hash=window.location.hash;
    if(!/^#(?:account|rank=(?:week|month|all))$/.test(hash))return '';
    window.history.replaceState(window.history.state,'',window.location.pathname+window.location.search);
    return hash.slice(1);
  }
  function onTouch(fn) {
    function emit(clientX,clientY,phase){if(phase==='start'&&!audioUnlocked){audioUnlocked=true;syncMusic();}var r=isMini?{left:0,top:0,width:width,height:height}:canvas.getBoundingClientRect();fn((clientX-r.left)*width/r.width,(clientY-r.top)*height/r.height,phase);}
    if (isMini) {
      mini.onTouchStart(function(e){var p=e.touches[0];if(p)emit(p.clientX,p.clientY,'start');});
      mini.onTouchMove(function(e){var p=e.touches[0];if(p)emit(p.clientX,p.clientY,'move');});
      mini.onTouchEnd(function(e){var p=e.changedTouches&&e.changedTouches[0];if(p)emit(p.clientX,p.clientY,'end');});
      if(mini.onTouchCancel)mini.onTouchCancel(function(e){var p=e.changedTouches&&e.changedTouches[0];if(p)emit(p.clientX,p.clientY,'cancel');});
    } else {
      canvas.addEventListener('pointerdown',function(e){canvas.setPointerCapture&&canvas.setPointerCapture(e.pointerId);emit(e.clientX,e.clientY,'start');});
      canvas.addEventListener('pointermove',function(e){if(e.buttons)emit(e.clientX,e.clientY,'move');});
      canvas.addEventListener('pointerup',function(e){emit(e.clientX,e.clientY,'end');});
      canvas.addEventListener('pointercancel',function(e){emit(e.clientX,e.clientY,'cancel');});
    }
  }
  function vibrate(){ if(hapticsEnabled&&isMini&&mini.vibrateShort) mini.vibrateShort({type:'light'}); }
  function onHide(fn){ if(isMini&&mini.onHide) mini.onHide(function(){hidden=true;syncMusic();fn();}); }
  function onShow(fn){if(typeof fn==='function')showHandlers.push(fn);}
  function isSidebarReturn(){return latestShowOptions&&latestShowOptions.launch_from==='homepage'&&latestShowOptions.location==='sidebar_card';}
  function checkSidebar(done){if(!isDouyin||typeof tt.checkScene!=='function'||typeof tt.navigateToScene!=='function'){done&&done(false);return;}tt.checkScene({scene:'sidebar',success:function(result){done&&done(!!(result&&result.isExist));},fail:function(){done&&done(false);}});}
  function navigateSidebar(done){if(!isDouyin||typeof tt.navigateToScene!=='function'){done&&done(false,{errMsg:'sidebar unsupported'});return;}tt.navigateToScene({scene:'sidebar',success:function(result){done&&done(true,result||null);},fail:function(error){done&&done(false,error||null);}});}
  function getBest(){ try { return +(isMini?mini.getStorageSync('starport_best_v2'):localStorage.getItem('starport_best_v2'))||0; } catch(e){return 0;} }
  function setBest(v){ return storageWrite('starport_best_v2',v); }
  function getScores(){try{var raw=isMini?mini.getStorageSync('starport_scores_v2'):localStorage.getItem('starport_scores_v2');var list=raw?(typeof raw==='string'?JSON.parse(raw):raw):[];return Array.isArray(list)?list:[];}catch(e){return [];}}
  function addScore(entry){try{var list=getScores();list.push({score:Math.max(0,Math.round(+entry.score||0)),wave:Math.max(0,Math.round(+entry.wave||0)),time:+entry.time||Date.now(),duration:Math.max(0,Math.round(+entry.duration||0)),clearedWave:Math.max(0,Math.round(+entry.clearedWave||0)),nickName:String(entry.nickName||'').slice(0,12),motto:String(entry.motto||'').slice(0,24),zone:String(entry.zone||'').slice(0,6),avatarUrl:String(entry.avatarUrl||''),avatarStyle:Math.max(0,Math.min(7,Math.round(+entry.avatarStyle||0)))});list=list.slice(-200);var raw=JSON.stringify(list);isMini?mini.setStorageSync('starport_scores_v2',raw):localStorage.setItem('starport_scores_v2',raw);return true;}catch(e){return false;}}
  function getProfile(){try{var raw=isMini?mini.getStorageSync('starport_profile'):localStorage.getItem('starport_profile');var value=raw?(typeof raw==='string'?JSON.parse(raw):raw):null;return value&&value.nickName?value:null;}catch(e){return null;}}
  function saveProfile(value){try{if(!value){isMini&&mini.removeStorageSync?mini.removeStorageSync('starport_profile'):localStorage.removeItem('starport_profile');return;}var raw=JSON.stringify(value);isMini?mini.setStorageSync('starport_profile',raw):localStorage.setItem('starport_profile',raw);}catch(e){}}
  function acceptUserProfile(result,done){var info=result&&result.userInfo||{},profile={nickName:String(info.nickName||'').trim().slice(0,12),avatarUrl:String(info.avatarUrl||'')};if(!profile.nickName){done&&done(null,{code:'empty',errMsg:'empty user profile'});return;}saveProfile(profile);done&&done(profile,null);}
  function rejectUserProfile(error,done){var message=String(error&&error.errMsg||''),code=error&&error.errNo||error&&error.errorCode||0;if(code===111690||code===111680||/auth deny|privacy permission|user deny/i.test(message))saveProfile(null);done&&done(null,{code:code||'failed',errMsg:message||'profile authorization failed'});}
  function requestLegacyUserProfile(done,retried){tt.getUserInfo({withCredentials:false,success:function(result){acceptUserProfile(result,done);},fail:function(error){var code=error&&error.errNo||error&&error.errorCode||0;if(!retried&&(code===10601||code===10603)&&typeof tt.login==='function'){tt.login({force:false,success:function(){requestLegacyUserProfile(done,true);},fail:function(loginError){rejectUserProfile(loginError,done);}});return;}rejectUserProfile(error,done);}});}
  function requestUserProfile(done){
    if(!isDouyin){done&&done(null,{code:'unsupported',errMsg:'profile authorization is only available in Douyin'});return;}
    if(typeof tt.getUserProfile==='function'){tt.getUserProfile({force:true,success:function(result){acceptUserProfile(result,done);},fail:function(error){rejectUserProfile(error,done);}});return;}
    if(typeof tt.getUserInfo==='function'){requestLegacyUserProfile(done,false);return;}
    done&&done(null,{code:'preview_required',errMsg:'scan to preview on a real Douyin device'});
  }
  function loadImage(url,done){if(!url){done&&done(null);return;}try{var image=canvas.createImage?canvas.createImage():(isMini&&mini.createImage?mini.createImage():(typeof Image!=='undefined'?new Image():null));if(!image){done&&done(null);return;}image.onload=function(){done&&done(image);};image.onerror=function(){done&&done(null);};image.src=url;}catch(e){done&&done(null);}}
  function avatarPng(url){
    return new Promise(function(resolve,reject){
      var timeout=setTimeout(function(){reject(new Error('头像读取超时'));},6000);
      loadImage(url,function(img){
        clearTimeout(timeout);
        try{
          var surface=isMini?(mini.createOffscreenCanvas?mini.createOffscreenCanvas({type:'2d',width:128,height:128}):mini.createCanvas()):document.createElement('canvas');
          surface.width=surface.height=128;
          var context=surface.getContext('2d'),size=Math.min(img.width,img.height);
          if(!size)throw new Error();
          context.drawImage(img,(img.width-size)/2,(img.height-size)/2,size,size,0,0,128,128);
          var bytes=context.getImageData(0,0,128,128).data;
          resolve(require('./avatar-png')(bytes));
        }catch(e){reject(new Error('当前设备无法处理此头像，请重选'));}
      });
    });
  }
  function editText(initial,done,options){options=options||{};var maxLength=Math.max(1,Math.min(30,+options.maxLength||12)),promptText=String(options.prompt||'修改昵称（中文、英文、数字、-、_）');if(isMini&&mini.showKeyboard&&mini.onKeyboardComplete){var finished=false;function cleanup(){mini.offKeyboardComplete&&mini.offKeyboardComplete(complete);}function finish(value){if(finished)return;finished=true;cleanup();value=Array.from(String(value||'').trim()).slice(0,maxLength).join('');done&&done(value||null);}function complete(data){finish(data&&data.value);}mini.onKeyboardComplete(complete);mini.showKeyboard({defaultValue:String(initial||''),maxLength:maxLength,multiple:false,confirmHold:false,confirmType:'done',fail:function(){cleanup();done&&done(null);}});return;}if(!isMini&&typeof window!=='undefined'&&window.prompt){var value=window.prompt(promptText,String(initial||''));done&&done(value===null?null:Array.from(String(value).trim()).slice(0,maxLength).join(''));return;}done&&done(null);}
  function chooseAvatar(previous,source,done){if(typeof source==='function'){done=source;source=null;}if(!isMini||!mini.chooseImage){done&&done(null,{code:'unsupported'});return;}mini.chooseImage({count:1,sourceType:source==='album'||source==='camera'?[source]:['album','camera'],success:function(result){var temp=result&&result.tempFilePaths&&result.tempFilePaths[0];if(!temp){done&&done(null,{code:'empty'});return;}if(mini.getFileSystemManager){try{var fs=mini.getFileSystemManager();fs.saveFile({tempFilePath:temp,success:function(saved){var path=saved&&saved.savedFilePath||temp;if(previous&&previous!==path&&fs.removeSavedFile)fs.removeSavedFile({filePath:previous,fail:function(){}});done&&done(path,null);},fail:function(error){done&&done(null,error||{code:'save_failed'});}});return;}catch(e){}}done&&done(temp,null);},fail:function(error){done&&done(null,error||{code:'choose_failed'});}});}
  function getCollection(){var raw=isMini?mini.getStorageSync('starport_collection_v1'):localStorage.getItem('starport_collection_v1');return raw?(typeof raw==='string'?JSON.parse(raw):raw):null;}
  function setCollection(value){try{var raw=JSON.stringify(value);if(isMini)mini.setStorageSync('starport_collection_v1',raw);else localStorage.setItem('starport_collection_v1',raw);return true;}catch(e){return false;}}
  function getSettings(){try{var raw=isMini?mini.getStorageSync('starport_settings'):localStorage.getItem('starport_settings');return raw?(typeof raw==='string'?JSON.parse(raw):raw):{};}catch(e){return {};}}
  function setSettings(v){try{var raw=JSON.stringify(v);isMini?mini.setStorageSync('starport_settings',raw):localStorage.setItem('starport_settings',raw);}catch(e){}}
  function ensureMusic(){if(music)return music;try{if(isMini&&mini.createInnerAudioContext){music=mini.createInnerAudioContext();music.src='assets/bgm.wav';music.loop=true;}else if(!isMini&&typeof Audio!=='undefined'){music=new Audio('assets/bgm.wav');music.loop=true;}if(music)music.volume=musicVolume;}catch(e){music=null;}return music;}
  function checkStartup(config,onProgress,done){
    var results=[];
    function report(id,label,ok,required,detail){var item={id:id,label:label,ok:!!ok,required:required!==false,detail:detail||''};results.push(item);if(onProgress)onProgress(item);}
    var runtimeOk=!!(canvas&&ctx&&canvas.width>0&&canvas.height>0);report('runtime','运行环境',runtimeOk,true,runtimeOk?'画布已就绪':'无法创建游戏画布');
    var configOk=!!(config&&config.grid&&config.grid.cols>0&&config.grid.rows>0&&Array.isArray(config.towers)&&config.towers.length&&Array.isArray(config.enemies)&&config.enemies.length);report('config','核心配置',configOk,true,configOk?'配置校验通过':'核心配置不完整');
    var storageOk=false;try{var probe='startup_'+Date.now(),key='starport_startup_probe';if(isMini){mini.setStorageSync(key,probe);storageOk=mini.getStorageSync(key)===probe;if(mini.removeStorageSync)mini.removeStorageSync(key);}else{localStorage.setItem(key,probe);storageOk=localStorage.getItem(key)===probe;localStorage.removeItem(key);}}catch(e){storageOk=false;}report('storage','本地存档',storageOk,true,storageOk?'读写正常':'存储空间不可用');
    var player=ensureMusic(),settled=false,timer=null;
    function finishAudio(ok,detail){if(settled)return;settled=true;if(timer)clearTimeout(timer);if(player){if(isMini){if(player.offCanplay)player.offCanplay(ready);if(player.offError)player.offError(failed);}else if(player.removeEventListener){player.removeEventListener('canplaythrough',ready);player.removeEventListener('error',failed);}}report('audio','必要资源',ok,false,detail);if(done)done(results);}
    function ready(){finishAudio(true,'背景音乐已就绪');}function failed(){finishAudio(false,'背景音乐暂不可用');}
    if(!player){finishAudio(false,'当前环境不支持音频');return;}
    if(!isMini&&player.readyState>=3){finishAudio(true,'背景音乐已缓存');return;}
    if(isMini){if(player.onCanplay)player.onCanplay(ready);if(player.onError)player.onError(failed);try{player.src='assets/bgm.wav';}catch(e){failed();return;}}
    else if(player.addEventListener){player.addEventListener('canplaythrough',ready);player.addEventListener('error',failed);try{player.load();}catch(e){failed();return;}}
    timer=setTimeout(function(){finishAudio(false,'资源检查超时，已降级');},2500);
  }
  function syncMusic(){var player=ensureMusic();if(!player)return;player.volume=musicVolume;if(musicEnabled&&audioUnlocked&&(!hidden||musicInBackground)){try{var promise=player.play();if(promise&&promise.catch)promise.catch(function(){});}catch(e){}}else{try{player.pause();}catch(e){}}}
  function playSfx(kind){
    if(!sfxEnabled||!audioUnlocked)return;
    try{
      if(!audioContext){if(isMini&&mini.createWebAudioContext)audioContext=mini.createWebAudioContext();else if(!isMini){var AC=window.AudioContext||window.webkitAudioContext;if(AC)audioContext=new AC();}}
      if(!audioContext)return;if(audioContext.resume)audioContext.resume();
      var now=audioContext.currentTime||0,osc=audioContext.createOscillator(),gain=audioContext.createGain(),tones={tap:520,place:680,upgrade:820,recycle:340,error:180};
      osc.type=kind==='error'?'sawtooth':'sine';osc.frequency.setValueAtTime(tones[kind]||520,now);if(kind==='upgrade')osc.frequency.exponentialRampToValueAtTime(1080,now+.09);
      gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(Math.max(.0001,.12*sfxVolume),now+.012);gain.gain.exponentialRampToValueAtTime(.0001,now+.11);
      osc.connect(gain);gain.connect(audioContext.destination);osc.start(now);osc.stop(now+.12);
    }catch(e){}
  }
  function configureAudio(options){options=options||{};hapticsEnabled=options.haptics!==false;musicEnabled=options.music!==false;musicVolume=clampVolume(options.volume);sfxEnabled=options.sfx!==false;sfxVolume=clampVolume(options.sfxVolume);musicInBackground=options.musicInBackground===true;syncMusic();}
  function clampVolume(v){v=+v;return isFinite(v)?Math.max(0,Math.min(1,v)):.45;}
  var raf = canvas.requestAnimationFrame ? canvas.requestAnimationFrame.bind(canvas) :
    (!isMini && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(cb){ return setTimeout(cb,16); });
  var apiMeta=!isMini&&document.querySelector&&document.querySelector('meta[name="sumind-game-api"]');
  var platform={canvas:canvas,ctx:ctx,width:width,height:height,safeTop:safe.top||0,safeBottom:safe.bottom||height,dpr:dpr,onTouch:onTouch,onHide:onHide,onShow:onShow,isSidebarReturn:isSidebarReturn,checkSidebar:checkSidebar,navigateSidebar:navigateSidebar,vibrate:vibrate,playSfx:playSfx,getBest:getBest,setBest:setBest,getScores:getScores,addScore:addScore,getProfile:getProfile,requestUserProfile:requestUserProfile,loadImage:loadImage,editText:editText,chooseAvatar:chooseAvatar,getCollection:getCollection,setCollection:setCollection,getSettings:getSettings,setSettings:setSettings,configureAudio:configureAudio,checkStartup:checkStartup,raf:raf,isDouyin:isDouyin,isWechat:isWechat,
    name:isDouyin?'douyin':isWechat?'wechat':'web',authEndpoint:apiMeta&&apiMeta.content,request:request,loginCode:loginCode,
    storageRead:storageRead,storageWrite:storageWrite,showMessage:showMessage,chooseLogin:chooseLogin,loginReturn:loginReturn,avatarPng:avatarPng};
  if(!isMini&&window.addEventListener){
    platform.onResize=function(fn){resizeHandlers.push(fn);};
    window.addEventListener('resize',resizeBrowserCanvas);
  }
  return platform;
}
module.exports = createPlatform;

};
M["src/auth.js"]=function(module,exports,require){
'use strict';

function createAuth(platform, options) {
  var base=(options.endpoint||'').replace(/\/+$/,'');
  var endpoint=base&&(/\/api\/game$/.test(base)?base:base+'/api/game');
  var prefix='starport:sumind:'+endpoint+':'+platform.name+':';
  var gamePath='/'+encodeURIComponent(options.gameId);
  var state={status:'idle',platform:platform.name,token:'',playerId:'',identityId:''};
  var loginPending;

  function send(path, method, data, token) {
    var headers={};
    if(token){
      // The website may already use Authorization for Nginx Basic auth.
      if(platform.name==='web')headers['X-SuMind-Game-Token']=token;
      else headers.Authorization='Bearer '+token;
    }
    return platform.request({url:endpoint+path,method:method,data:data,headers:headers});
  }
  function remember(value) {
    state.token=value.token;state.playerId=value.playerId;state.identityId=value.identityId;
    platform.storageWrite(prefix+'session',value);
  }
  function clear() {
    state.token='';state.playerId='';state.identityId='';
    state.status='guest';
    platform.storageWrite(prefix+'session',null);
  }
  function login(interactive) {
    if(!endpoint)return Promise.resolve(state);
    if(loginPending)return loginPending;
    var cached=platform.storageRead(prefix+'session');
    state.status='connecting';
    var credential=platform.name==='web'?Promise.resolve():platform.loginCode(interactive);
    loginPending=credential.then(function(code){
      return send('/auth/login','POST',{platform:platform.name,code:code},cached&&cached.token);
    }).then(function(result){
      remember(result);state.status='ready';return state;
    }).catch(function(error){
      if(error.status===401&&platform.name==='web')clear();
      else{
        if(error.offline&&cached&&cached.token&&cached.identityId&&cached.playerId){
          state.token=cached.token;state.identityId=cached.identityId;state.playerId=cached.playerId;
        }
        state.status=state.token?'offline':'guest';
      }
      throw error;
    }).finally(function(){loginPending=null;});
    return loginPending;
  }
  function gameRequest(action, data) {
    return send(gamePath+'/'+action,data===undefined?'GET':'POST',data,state.token);
  }
  function bindCode() {return send('/auth/bind-code','POST',{},state.token);}
  function bind(code) {
    return send('/auth/bind','POST',{code:code},state.token).then(function(result){
      remember({token:state.token,playerId:result.playerId,identityId:state.identityId});
      return result;
    });
  }
  function updatePlayer(playerId) {
    if(playerId!==state.playerId)remember({token:state.token,playerId:playerId,identityId:state.identityId});
  }
  return {state:state,enabled:!!endpoint,prefix:prefix,login:login,clear:clear,bindCode:bindCode,bind:bind,updatePlayer:updatePlayer,
    request:gameRequest,isAuthenticated:function(){return !!state.token;}};
}
module.exports=createAuth;

};
M["src/avatar-png.js"]=function(module,exports,require){
'use strict';

// Encode the cropped 128px canvas as an RGBA PNG on runtimes without toBlob.
var base64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var crcTable = new Uint32Array(256);
for(var n=0;n<256;n++){
  var crc=n;
  for(var bit=0;bit<8;bit++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);
  crcTable[n]=crc;
}
function write32(bytes,offset,value){
  bytes[offset]=value>>>24;bytes[offset+1]=value>>>16;bytes[offset+2]=value>>>8;bytes[offset+3]=value;
}
function chunk(bytes,offset,name,data){
  write32(bytes,offset,data.length);
  var start=offset+4, end=start+4+data.length;
  for(var i=0;i<4;i++)bytes[start+i]=name.charCodeAt(i);
  bytes.set(data,start+4);
  var crc=0xffffffff;
  for(i=start;i<end;i++)crc=crcTable[(crc^bytes[i])&255]^(crc>>>8);
  write32(bytes,end,crc^0xffffffff);
  return end+4;
}
function encode(bytes){
  var out='';
  for(var i=0;i<bytes.length;i+=3){
    var a=bytes[i],b=bytes[i+1]||0,c=bytes[i+2]||0;
    out+=base64[a>>2]+base64[(a&3)<<4|b>>4]+(i+1<bytes.length?base64[(b&15)<<2|c>>6]:'=')+(i+2<bytes.length?base64[c&63]:'=');
  }
  return out;
}
function storeDeflate(scanlines){
  var data=new Uint8Array(2+10+scanlines.length+4);
  data.set([0x78,0x01]);
  var offset=2,a=1,b=0;
  for(var start=0;start<scanlines.length;start+=65535){
    var len=Math.min(65535,scanlines.length-start);
    data.set([Number(start+len===scanlines.length),len&255,len>>8,~len&255,(~len>>8)&255],offset);
    data.set(scanlines.subarray(start,start+len),offset+5);
    offset+=5+len;
  }
  for(var i=0;i<scanlines.length;i++){a=(a+scanlines[i])%65521;b=(b+a)%65521;}
  write32(data,offset,(b<<16)|a);
  return data;
}
module.exports=function avatarPng(rgba,compress){
  if(rgba.length!==128*128*4)throw new Error('Invalid avatar dimensions');
  var scanlines=new Uint8Array(128*(128*4+1));
  for(var y=0;y<128;y++)scanlines.set(rgba.subarray(y*512,(y+1)*512),y*513+1);
  var data=(compress||storeDeflate)(scanlines);
  var png=new Uint8Array(8+25+12+data.length+12);
  png.set([137,80,78,71,13,10,26,10]);
  var offset=chunk(png,8,'IHDR',new Uint8Array([0,0,0,128,0,0,0,128,8,6,0,0,0]));
  offset=chunk(png,offset,'IDAT',data);
  chunk(png,offset,'IEND',new Uint8Array(0));
  return encode(png);
};

};
M["src/i18n.js"]=function(module,exports,require){
var exact = {
  'zh-Hant': {
    '无尽防卫协议':'無盡防衛協議','把路线':'把路線','变成武器':'變成武器','每一座塔，既是火力，也是侵体的下一次转弯。':'每一座塔，既是火力，也是侵體的下一次轉彎。','实时战术沙盘':'即時戰術沙盤','最佳得分':'最佳得分','装置类型':'裝置類型','挑战上限':'挑戰上限','进入防线':'進入防線','清场后自动续波':'清場後自動續波','生命归零，本局结束':'生命歸零，本局結束','自由寻路  ·  路障改道  ·  多类装置':'自由尋路  ·  路障改道  ·  多類裝置','设置':'設定','返回首页':'返回首頁','语言':'語言','简体中文':'簡體中文','繁体中文':'繁體中文','英文':'英文','游戏设置':'遊戲設定','自动暂停':'自動暫停','进入后台时暂停战斗':'進入後台時暫停戰鬥','震动反馈':'震動回饋','音乐':'音樂','音乐音量':'音樂音量','开启':'開啟','关闭':'關閉','游戏版本':'遊戲版本','波次':'波次','侵体':'侵體','布防资金':'佈防資金','生命':'生命','建筑':'建築','积分':'積分','装置维护':'裝置維護','左右滑动选择装置':'左右滑動選擇裝置','首页':'首頁','重开':'重開','倍速':'倍速','启动第一波':'啟動第一波','继续防守':'繼續防守','暂停防守':'暫停防守','准备完成后开战':'準備完成後開戰','返回当前波次':'返回當前波次','点击暂停进行调整':'點擊暫停進行調整','侵体情报':'侵體情報','返回装置选择':'返回裝置選擇','从这里开始':'從這裡開始','没有固定路线，你决定侵体怎么走':'沒有固定路線，你決定侵體怎麼走','选择一种防御装置':'選擇一種防禦裝置','在任意空格部署':'在任意空格部署','不能彻底封死通道':'不能徹底封死通道','开始规划':'開始規劃','确认重新开始？':'確認重新開始？','当前波次和布防进度将被清空':'目前波次和佈防進度將被清空','取消':'取消','确认重开':'確認重開','返回首页':'返回首頁','暂停可保留本次挑战进度':'暫停可保留本次挑戰進度','暂停挑战':'暫停挑戰','结束本次挑战':'結束本次挑戰','跃迁门失守':'躍遷門失守','调整布局，再次挑战更高波次':'調整佈局，再次挑戰更高波次','最终得分':'最終得分','回收装置':'回收裝置','升级':'升級','不可升级':'不可升級','已满级':'已滿級','返回':'返回','路障':'路障','阻挡改道':'阻擋改道','脉冲塔':'脈衝塔','高速直击':'高速直擊','星爆塔':'星爆塔','范围爆破':'範圍爆破','引力塔':'引力塔','束缚减速':'束縛減速','常体':'常體','标准推进':'標準推進','疾体':'疾體','高速穿行':'高速穿行','甲体':'甲體','高生命 · 高威胁':'高生命 · 高威脅'
  },
  en: {
    '无尽防卫协议':'ENDLESS DEFENSE','把路线':'TURN THE PATH','变成武器':'INTO A WEAPON','每一座塔，既是火力，也是侵体的下一次转弯。':'Every tower shapes both firepower and the enemy route.','实时战术沙盘':'LIVE TACTICAL GRID','最佳得分':'BEST SCORE','装置类型':'DEVICES','挑战上限':'LIMIT','进入防线':'ENTER DEFENSE','清场后自动续波':'Auto-advance after clearing','生命归零，本局结束':'Run ends at zero integrity','自由寻路  ·  路障改道  ·  多类装置':'Dynamic paths  ·  Rerouting  ·  Multiple devices','设置':'SETTINGS','返回首页':'BACK HOME','语言':'LANGUAGE','简体中文':'SIMPLIFIED CHINESE','繁体中文':'TRADITIONAL CHINESE','英文':'ENGLISH','游戏设置':'GAME SETTINGS','自动暂停':'AUTO PAUSE','进入后台时暂停战斗':'Pause combat while in background','震动反馈':'HAPTIC FEEDBACK','音乐':'MUSIC','音乐音量':'MUSIC VOLUME','开启':'ON','关闭':'OFF','游戏版本':'GAME VERSION','波次':'WAVE','侵体':'HOSTILES','布防资金':'Defense funds','生命':'INTEGRITY','建筑':'BUILT','积分':'SCORE','装置维护':'DEVICE SERVICE','左右滑动选择装置':'SWIPE TO CHOOSE A DEVICE','首页':'HOME','重开':'RESTART','倍速':'SPEED','启动第一波':'START WAVE 1','继续防守':'RESUME DEFENSE','暂停防守':'PAUSE DEFENSE','准备完成后开战':'Deploy devices, then begin','返回当前波次':'Return to the current wave','点击暂停进行调整':'Pause to adjust your layout','侵体情报':'HOSTILE INTEL','返回装置选择':'BACK TO DEVICES','从这里开始':'START HERE','没有固定路线，你决定侵体怎么走':'There is no fixed path. You shape the route.','选择一种防御装置':'Choose a defense device','在任意空格部署':'Deploy on an open cell','不能彻底封死通道':'Keep at least one path open','开始规划':'START PLANNING','确认重新开始？':'RESTART THIS RUN?','当前波次和布防进度将被清空':'Wave and layout progress will be cleared','取消':'CANCEL','确认重开':'RESTART','暂停可保留本次挑战进度':'Pause to preserve this run','暂停挑战':'PAUSE RUN','结束本次挑战':'END RUN','跃迁门失守':'GATE BREACHED','调整布局，再次挑战更高波次':'Rebuild and push for a higher wave','最终得分':'FINAL SCORE','回收装置':'RECYCLE','升级':'UPGRADE','不可升级':'NO UPGRADE','已满级':'MAX LEVEL','返回':'BACK','路障':'BARRIER','阻挡改道':'Reroutes hostiles','脉冲塔':'PULSE TOWER','高速直击':'Rapid direct fire','星爆塔':'NOVA TOWER','范围爆破':'Area blast','引力塔':'GRAVITY TOWER','束缚减速':'Damage and slow','常体':'DRIFTER','标准推进':'Standard advance','疾体':'DARTER','高速穿行':'High-speed runner','甲体':'BULWARK','高生命 · 高威胁':'High integrity · High threat'
  }
};
var loadingExact={
  'zh-Hant':{'别让它进来':'別讓它進來','防线启动协议':'防線啟動協議','建立路线 · 守住核心':'建立路線 · 守住核心','路径校准':'路徑校準','正在建立防线':'正在建立防線','完成后自动进入指挥台':'完成後自動進入指揮台','健康游戏忠告':'健康遊戲忠告','适龄 8+':'適齡 8+','抵制不良游戏　拒绝盗版游戏　注意自我保护　谨防受骗上当':'抵制不良遊戲　拒絕盜版遊戲　注意自我保護　謹防受騙上當','适度游戏益脑　沉迷游戏伤身　合理安排时间　享受健康生活':'適度遊戲益腦　沉迷遊戲傷身　合理安排時間　享受健康生活'},
  en:{'别让它进来':'KEEP IT OUT','防线启动协议':'DEFENSE STARTUP','建立路线 · 守住核心':'SHAPE THE ROUTE · HOLD THE CORE','路径校准':'ROUTE CALIBRATION','正在建立防线':'BUILDING DEFENSE','完成后自动进入指挥台':'Command opens automatically when ready','健康游戏忠告':'HEALTHY PLAY NOTICE','适龄 8+':'AGE 8+','抵制不良游戏　拒绝盗版游戏　注意自我保护　谨防受骗上当':'Choose legitimate games · Protect yourself · Stay alert','适度游戏益脑　沉迷游戏伤身　合理安排时间　享受健康生活':'Play moderately · Balance play with daily life'}
};
for(var loadingLang in loadingExact)for(var loadingKey in loadingExact[loadingLang])exact[loadingLang][loadingKey]=loadingExact[loadingLang][loadingKey];
var leaderboardExact={
  'zh-Hant':{'游客指挥官':'遊客指揮官','本地档案':'本地檔案','点击授权抖音头像昵称':'點擊授權抖音頭像暱稱','正在请求授权…':'正在請求授權…','抖音已授权':'抖音已授權','仅抖音内可授权':'僅抖音內可授權','未授权，保持游客身份':'未授權，保持遊客身份','排行榜':'排行榜','本周 · 上周 · 历史':'本週 · 上週 · 歷史','本机战绩 · 按得分排序':'本機戰績 · 按得分排序','本周':'本週','上周':'上週','历史':'歷史','排名':'排名','得分':'得分','暂无战绩':'暫無戰績','完成一局后会自动记录到这里':'完成一局後會自動記錄到這裡','本机记录':'本機記錄'},
  en:{'游客指挥官':'GUEST COMMANDER','本地档案':'LOCAL PROFILE','点击授权抖音头像昵称':'TAP TO AUTHORIZE DOUYIN PROFILE','正在请求授权…':'REQUESTING AUTHORIZATION…','抖音已授权':'DOUYIN AUTHORIZED','仅抖音内可授权':'AVAILABLE IN DOUYIN ONLY','未授权，保持游客身份':'NOT AUTHORIZED · GUEST MODE','排行榜':'LEADERBOARD','本周 · 上周 · 历史':'THIS WEEK · LAST WEEK · ALL TIME','本机战绩 · 按得分排序':'LOCAL RUNS · SORTED BY SCORE','本周':'THIS WEEK','上周':'LAST WEEK','历史':'ALL TIME','排名':'RANK','得分':'SCORE','暂无战绩':'NO RUNS YET','完成一局后会自动记录到这里':'Completed runs will appear here','本机记录':'LOCAL RUN'}
};
for(var leaderboardLang in leaderboardExact)for(var leaderboardKey in leaderboardExact[leaderboardLang])exact[leaderboardLang][leaderboardKey]=leaderboardExact[leaderboardLang][leaderboardKey];
var common = {
  'zh-Hant':{'已重新开始':'已重新開始','已暂停，可继续防守':'已暫停，可繼續防守','第':'第','波来袭':'波來襲','清场完成':'清場完成','战术暂停':'戰術暫停','挑战已停止':'挑戰已停止','继续挑战':'繼續挑戰','战斗速度':'戰鬥速度','已选择':'已選擇','已取消选择':'已取消選擇','路障无需升级':'路障無需升級','装置已满级':'裝置已滿級','布防资金不足':'佈防資金不足','这里需要保持畅通':'這裡需要保持暢通','不能封死通道':'不能封死通道','功能建筑':'功能建築','改变路线':'改變路線','击杀':'擊殺','累计伤害':'累計傷害','伤害':'傷害','攻速':'攻速','射程':'射程','格':'格','改变侵体路线':'改變侵體路線','路线改造':'路線改造','速度':'速度','生命伤害':'生命傷害','历史最佳':'歷史最佳','坚持波次':'堅持波次'},
  en:{'已重新开始':'RUN RESTARTED','已暂停，可继续防守':'PAUSED — TAP RESUME','第':'WAVE ','波来袭':' INCOMING','清场完成':'CLEAR','战术暂停':'TACTICAL PAUSE','挑战已停止':'RUN PAUSED','继续挑战':'RUN RESUMED','战斗速度':'SPEED','已选择':'SELECTED','已取消选择':'SELECTION CLEARED','路障无需升级':'BARRIER CANNOT UPGRADE','装置已满级':'DEVICE AT MAX LEVEL','布防资金不足':'NOT ENOUGH DEFENSE FUNDS','这里需要保持畅通':'KEEP THIS CELL CLEAR','不能封死通道':'KEEP ONE PATH OPEN','功能建筑':'UTILITY','改变路线':'REROUTES PATH','击杀':'KILLS','累计伤害':'TOTAL DAMAGE','伤害':'DAMAGE','攻速':'RATE','射程':'RANGE','格':'CELL','改变侵体路线':'REROUTES HOSTILES','路线改造':'ROUTE CONTROL','速度':'SPEED','生命伤害':'CORE DAMAGE','历史最佳':'BEST SCORE','坚持波次':'WAVE REACHED'}
};
common['zh-Hant']['升级至']='升級至';common['zh-Hant']['功能装置']='功能裝置';
common.en['升级至']='UPGRADE TO';common.en['功能装置']='UTILITY DEVICE';
var settingsExact={
  'zh-Hant':{'分类调整辅助体验':'分類調整輔助體驗','音频':'音訊','战斗':'戰鬥','显示':'顯示','系统':'系統','背景音乐':'背景音樂','战斗中持续播放':'戰鬥中持續播放','后台音乐':'後台音樂','切到后台后继续播放':'切到後台後繼續播放','音效':'音效','操作音效':'操作音效','部署、升级与按钮反馈':'部署、升級與按鈕回饋','音效音量':'音效音量','战斗行为':'戰鬥行為','进入后台时暂停':'進入後台時暫停','关键操作轻震':'關鍵操作輕震','屏幕震动':'螢幕震動','目标受击时反馈':'目標受擊時回饋','记忆倍速':'記憶倍速','下局沿用当前倍速':'下局沿用目前倍速','操作保护':'操作保護','回收确认':'回收確認','防止误删长期培养装置':'防止誤刪長期培養裝置','新手引导':'新手引導','重新查看':'重新查看','战场信息':'戰場資訊','伤害数字':'傷害數字','显示每次命中数值':'顯示每次命中數值','生命条':'生命條','始终':'始終','受伤':'受傷','攻击范围':'攻擊範圍','选中':'選中','视觉效果':'視覺效果','特效强度':'特效強度','完整':'完整','精简':'精簡','减少动态':'減少動態','降低旋转、呼吸与摇晃':'降低旋轉、呼吸與搖晃','高对比度':'高對比度','强化边框与战场网格':'強化邊框與戰場網格','性能与数字':'效能與數字','帧率模式':'幀率模式','省电 30':'省電 30','流畅 60':'流暢 60','数字格式':'數字格式','缩写':'縮寫','关于':'關於','确认回收装置？':'確認回收裝置？','将返还累计投入的 65%':'將返還累計投入的 65%','确认回收':'確認回收'},
  en:{'分类调整辅助体验':'ACCESSIBILITY & PREFERENCES','音频':'AUDIO','战斗':'COMBAT','显示':'DISPLAY','系统':'SYSTEM','背景音乐':'MUSIC','战斗中持续播放':'Play during combat','后台音乐':'BACKGROUND PLAY','切到后台后继续播放':'Continue while app is hidden','音效':'SOUND','操作音效':'SOUND EFFECTS','部署、升级与按钮反馈':'Deploy, upgrade and button cues','音效音量':'SFX VOLUME','战斗行为':'COMBAT BEHAVIOR','进入后台时暂停':'Pause when app is hidden','关键操作轻震':'Light feedback for key actions','屏幕震动':'SCREEN SHAKE','目标受击时反馈':'Feedback when core is hit','记忆倍速':'REMEMBER SPEED','下局沿用当前倍速':'Keep speed for the next run','操作保护':'ACTION SAFETY','回收确认':'CONFIRM RECYCLE','防止误删长期培养装置':'Protect upgraded devices','新手引导':'TUTORIAL','重新查看':'VIEW AGAIN','战场信息':'BATTLE INFO','伤害数字':'DAMAGE NUMBERS','显示每次命中数值':'Show damage on each hit','生命条':'HEALTH BARS','始终':'ALWAYS','受伤':'HURT','攻击范围':'ATTACK RANGE','选中':'SELECTED','视觉效果':'VISUAL EFFECTS','特效强度':'EFFECTS','完整':'FULL','精简':'REDUCED','减少动态':'REDUCE MOTION','降低旋转、呼吸与摇晃':'Reduce rotation, pulse and shake','高对比度':'HIGH CONTRAST','强化边框与战场网格':'Stronger outlines and grid','性能与数字':'PERFORMANCE & NUMBERS','帧率模式':'FRAME RATE','省电 30':'SAVER 30','流畅 60':'SMOOTH 60','数字格式':'NUMBER FORMAT','缩写':'SHORT','关于':'ABOUT','确认回收装置？':'RECYCLE THIS DEVICE?','将返还累计投入的 65%':'Refund 65% of total investment','确认回收':'RECYCLE'}
};
for(var settingsLang in settingsExact)for(var settingsKey in settingsExact[settingsLang])exact[settingsLang][settingsKey]=settingsExact[settingsLang][settingsKey];
var accountExact={
  'zh-Hant':{'查看账户信息':'查看帳戶資訊','账户信息':'帳戶資訊','查看与更新玩家资料':'查看與更新玩家資料','选择游戏内展示的头像和昵称':'選擇遊戲內展示的頭像和暱稱','抖音玩家':'抖音玩家','游客身份':'遊客身分','抖音资料':'抖音資料','游戏身份':'遊戲身分','当前使用平台头像和昵称':'目前使用平台頭像和暱稱','当前使用游戏内自定义资料':'目前使用遊戲內自訂資料','展示身份':'展示身分','已连接 · 点击使用':'已連接 · 點擊使用','未连接 · 点击授权':'未連接 · 點擊授權','本地保存 · 可自定义':'本機儲存 · 可自訂','自定义游戏身份':'自訂遊戲身分','换一个随机昵称':'換一個隨機暱稱','更新抖音资料':'更新抖音資料','关联抖音资料':'關聯抖音資料','关联平台后仍可继续使用游戏身份':'關聯平台後仍可繼續使用遊戲身分','账户状态':'帳戶狀態','账号类型':'帳號類型','授权状态':'授權狀態','已授权':'已授權','未授权':'未授權','资料已与抖音身份关联':'資料已與抖音身分關聯','授权后显示抖音头像昵称':'授權後顯示抖音頭像暱稱','更新头像昵称':'更新頭像暱稱','授权抖音头像昵称':'授權抖音頭像暱稱','头像与昵称仅用于游戏内身份展示':'頭像與暱稱僅用於遊戲內身分展示'},
  en:{'查看账户信息':'VIEW ACCOUNT','账户信息':'ACCOUNT','查看与更新玩家资料':'VIEW AND UPDATE PLAYER PROFILE','选择游戏内展示的头像和昵称':'CHOOSE THE PROFILE SHOWN IN GAME','抖音玩家':'DOUYIN PLAYER','游客身份':'GUEST ACCOUNT','抖音资料':'DOUYIN PROFILE','游戏身份':'GAME IDENTITY','当前使用平台头像和昵称':'Using platform avatar and nickname','当前使用游戏内自定义资料':'Using your custom game identity','展示身份':'DISPLAY IDENTITY','已连接 · 点击使用':'CONNECTED · TAP TO USE','未连接 · 点击授权':'NOT CONNECTED · TAP TO LINK','本地保存 · 可自定义':'SAVED LOCALLY · CUSTOMIZABLE','自定义游戏身份':'CUSTOMIZE GAME IDENTITY','换一个随机昵称':'RANDOMIZE NAME','更新抖音资料':'UPDATE DOUYIN PROFILE','关联抖音资料':'LINK DOUYIN PROFILE','关联平台后仍可继续使用游戏身份':'Linking does not replace your game identity','账户状态':'ACCOUNT STATUS','账号类型':'ACCOUNT TYPE','授权状态':'AUTHORIZATION','已授权':'AUTHORIZED','未授权':'NOT AUTHORIZED','资料已与抖音身份关联':'Profile linked to Douyin identity','授权后显示抖音头像昵称':'Authorize to show your Douyin profile','更新头像昵称':'UPDATE PROFILE','授权抖音头像昵称':'AUTHORIZE DOUYIN PROFILE','头像与昵称仅用于游戏内身份展示':'Avatar and nickname are only shown in the game'}
};
for(var accountLang in accountExact)for(var accountKey in accountExact[accountLang])exact[accountLang][accountKey]=accountExact[accountLang][accountKey];
var profileEditExact={
  'zh-Hant':{'查看和修改玩家资料':'查看和修改玩家資料','玩家资料':'玩家資料','头像和昵称可以分别修改':'頭像和暱稱可以分別修改','已关联抖音账号':'已關聯抖音帳號','未关联平台账号':'未關聯平台帳號','平台资料不会自动覆盖':'平台資料不會自動覆蓋','昵称':'暱稱','修改':'修改','选择头像':'選擇頭像','平台资料':'平台資料','采用平台昵称':'採用平台暱稱','采用平台头像':'採用平台頭像','更新平台资料':'更新平台資料','关联平台账号':'關聯平台帳號','采用平台资料时，头像和昵称互不绑定':'採用平台資料時，頭像和暱稱互不綁定'},
  en:{'查看和修改玩家资料':'VIEW AND EDIT PLAYER PROFILE','玩家资料':'PLAYER PROFILE','头像和昵称可以分别修改':'Edit avatar and nickname separately','已关联抖音账号':'DOUYIN ACCOUNT LINKED','未关联平台账号':'NO PLATFORM ACCOUNT LINKED','平台资料不会自动覆盖':'Platform data never overwrites automatically','昵称':'NICKNAME','修改':'EDIT','选择头像':'CHOOSE AVATAR','平台资料':'PLATFORM PROFILE','采用平台昵称':'USE PLATFORM NAME','采用平台头像':'USE PLATFORM AVATAR','更新平台资料':'UPDATE PLATFORM PROFILE','关联平台账号':'LINK PLATFORM ACCOUNT','采用平台资料时，头像和昵称互不绑定':'Platform avatar and nickname are applied separately'}
};
for(var profileEditLang in profileEditExact)for(var profileEditKey in profileEditExact[profileEditLang])exact[profileEditLang][profileEditKey]=profileEditExact[profileEditLang][profileEditKey];
var customProfileExact={
  'zh-Hant':{'自由修改头像和昵称':'自由修改頭像和暱稱','点击修改头像':'點擊修改頭像','头像':'頭像','从相册选择或拍照':'從相簿選擇或拍照','平台头像和昵称可分别采用':'平台頭像和暱稱可分別採用','仅抖音内可修改头像':'僅抖音內可修改頭像'},
  en:{'自由修改头像和昵称':'EDIT AVATAR AND NICKNAME FREELY','点击修改头像':'TAP TO CHANGE AVATAR','头像':'AVATAR','从相册选择或拍照':'Choose from album or take a photo','平台头像和昵称可分别采用':'Platform avatar and nickname can be applied separately','仅抖音内可修改头像':'AVATAR EDITING IS AVAILABLE IN DOUYIN'}
};
for(var customProfileLang in customProfileExact)for(var customProfileKey in customProfileExact[customProfileLang])exact[customProfileLang][customProfileKey]=customProfileExact[customProfileLang][customProfileKey];
var classicProfileExact={
  'zh-Hant':{'账户资料':'帳戶資料','管理游戏内显示资料':'管理遊戲內顯示資料','查看与管理游戏资料':'查看與管理遊戲資料','已关联抖音':'已關聯抖音','本地玩家':'本機玩家','头像与昵称独立设置':'頭像與暱稱獨立設定','点击头像修改图片':'點擊頭像修改圖片','基本资料':'基本資料','上传头像':'上傳頭像','选择':'選擇','默认头像':'預設頭像','修改资料':'修改資料','编辑资料':'編輯資料','使用默认头像':'使用預設頭像','完成':'完成','平台头像和昵称不会自动覆盖':'平台頭像和暱稱不會自動覆蓋'},
  en:{'账户资料':'ACCOUNT PROFILE','管理游戏内显示资料':'MANAGE YOUR IN-GAME PROFILE','查看与管理游戏资料':'VIEW AND MANAGE YOUR GAME PROFILE','已关联抖音':'DOUYIN LINKED','本地玩家':'LOCAL PLAYER','头像与昵称独立设置':'Avatar and nickname are set separately','点击头像修改图片':'Tap the avatar to change the image','基本资料':'BASIC PROFILE','上传头像':'UPLOAD AVATAR','选择':'CHOOSE','默认头像':'DEFAULT AVATARS','修改资料':'EDIT PROFILE','编辑资料':'EDIT PROFILE','使用默认头像':'USE A DEFAULT AVATAR','完成':'DONE','平台头像和昵称不会自动覆盖':'Platform avatar and nickname never overwrite automatically'}
};
for(var classicProfileLang in classicProfileExact)for(var classicProfileKey in classicProfileExact[classicProfileLang])exact[classicProfileLang][classicProfileKey]=classicProfileExact[classicProfileLang][classicProfileKey];
var tacticalProfileExact={
  'zh-Hant':{'管理账户与平台资料':'管理帳戶與平台資料','已关联平台':'已關聯平台','未关联平台':'未關聯平台','头像和昵称仅用于游戏展示':'頭像和暱稱僅用於遊戲展示','平台关联':'平台關聯','平台昵称':'平台暱稱','尚未获取平台昵称':'尚未取得平台暱稱','采用':'採用','平台头像':'平台頭像','可采用已授权头像':'可採用已授權頭像','关联后可采用平台头像':'關聯後可採用平台頭像','关联平台资料':'關聯平台資料','立即更新':'立即更新','平台资料不会自动覆盖当前游戏资料':'平台資料不會自動覆蓋目前遊戲資料','相册或拍照':'相簿或拍照','上传自定义头像':'上傳自訂頭像','选择默认头像':'選擇預設頭像'},
  en:{'管理账户与平台资料':'MANAGE ACCOUNT AND PLATFORM PROFILE','已关联平台':'PLATFORM LINKED','未关联平台':'PLATFORM NOT LINKED','头像和昵称仅用于游戏展示':'Avatar and nickname are shown only in game','平台关联':'PLATFORM LINK','平台昵称':'PLATFORM NICKNAME','尚未获取平台昵称':'PLATFORM NICKNAME NOT AVAILABLE','采用':'USE','平台头像':'PLATFORM AVATAR','可采用已授权头像':'AUTHORIZED AVATAR AVAILABLE','关联后可采用平台头像':'Link to use the platform avatar','关联平台资料':'LINK PLATFORM PROFILE','立即更新':'UPDATE NOW','平台资料不会自动覆盖当前游戏资料':'Platform data never overwrites your game profile','相册或拍照':'ALBUM OR CAMERA','上传自定义头像':'UPLOAD A CUSTOM AVATAR','选择默认头像':'CHOOSE A DEFAULT AVATAR'}
};
for(var tacticalProfileLang in tacticalProfileExact)for(var tacticalProfileKey in tacticalProfileExact[tacticalProfileLang])exact[tacticalProfileLang][tacticalProfileKey]=tacticalProfileExact[tacticalProfileLang][tacticalProfileKey];
var rankingProfileExact={
  'zh-Hant':{'管理排行榜展示资料':'管理排行榜展示資料','身份卡':'身分卡','这是你在排行榜中的形象':'這是你在排行榜中的形象','防守记录':'防守記錄','尚无已完成战绩':'尚無已完成戰績','选择头像':'選擇頭像','相册':'相簿','完成编辑':'完成編輯','防线宣言':'防線宣言','所属地':'所屬地','所属地为游戏内虚拟资料':'所屬地為遊戲內虛擬資料','选择所属地':'選擇所屬地','仅代表游戏内虚拟身份':'僅代表遊戲內虛擬身分','点击空白区域取消':'點擊空白區域取消','资料将用于本机战绩展示':'資料將用於本機戰績展示','每名玩家仅记录周期最高成绩':'每名玩家僅記錄週期最高成績','周榜':'週榜','月榜':'月榜','总榜':'總榜','排名 / 玩家':'排名 / 玩家','最高得分':'最高得分','完成一次挑战后，最高成绩会出现在这里':'完成一次挑戰後，最高成績會出現在這裡','守住每一条路线':'守住每一條路線','长安里':'長安里','山海关':'山海關','望江台':'望江臺','青云岭':'青雲嶺','龙门渡':'龍門渡','雁回川':'雁回川','万里营':'萬里營','定远城':'定遠城'},
  en:{'管理排行榜展示资料':'MANAGE LEADERBOARD PROFILE','身份卡':'IDENTITY CARD','这是你在排行榜中的形象':'This is how you appear on the leaderboard','防守记录':'DEFENSE RECORD','尚无已完成战绩':'NO COMPLETED RUNS','选择头像':'CHOOSE AVATAR','相册':'ALBUM','完成编辑':'DONE','防线宣言':'DEFENSE MOTTO','所属地':'HOMELAND','所属地为游戏内虚拟资料':'Homeland is a fictional game identity','选择所属地':'CHOOSE HOMELAND','仅代表游戏内虚拟身份':'Fictional in-game identity only','点击空白区域取消':'Tap outside to cancel','资料将用于本机战绩展示':'Used for local leaderboard records','每名玩家仅记录周期最高成绩':'Only each player best score is ranked','周榜':'WEEKLY','月榜':'MONTHLY','总榜':'ALL TIME','排名 / 玩家':'RANK / PLAYER','最高得分':'BEST SCORE','完成一次挑战后，最高成绩会出现在这里':'Your best completed run will appear here','守住每一条路线':'Hold every route','长安里':'CHANGAN','山海关':'SHANHAI','望江台':'WANGJIANG','青云岭':'QINGYUN','龙门渡':'LONGMEN','雁回川':'YANHUI','万里营':'WANLI','定远城':'DINGYUAN'}
};
for(var rankingProfileLang in rankingProfileExact)for(var rankingProfileKey in rankingProfileExact[rankingProfileLang])exact[rankingProfileLang][rankingProfileKey]=rankingProfileExact[rankingProfileLang][rankingProfileKey];
var redesignExact=[["防线指挥室", "防線指揮室", "Defense command"], ["防线", "防線", "Defense"], ["收藏", "收藏", "Collection"], ["我的", "我的", "Profile"], ["签到", "簽到", "Check in"], ["已签到", "已簽到", "Checked in"], ["无尽防守", "無盡防守", "Endless defense"], ["准备部署", "準備部署", "Ready to deploy"], ["查看战绩 ›", "查看戰績 ›", "View records"], ["返回防线", "返回防線", "Back to defense"], ["布防现场已保留，随时继续。", "佈防現場已保留，隨時繼續。", "Your layout is ready to resume."], ["选装置、改路线，守住每一次进攻。", "選裝置、改路線，守住每一次進攻。", "Deploy, reroute, and hold the line."], ["把敌人的路线，变成你的武器", "把敵人的路線，變成你的武器", "Turn their route into your weapon"], ["防守档案", "防守檔案", "Defense record"], ["最高完成波次", "最高完成波次", "Waves cleared"], ["成就", "成就", "Achievements"], ["成就陈列", "成就陳列", "Achievements"], ["编辑头像与资料", "編輯頭像與資料", "Edit avatar and profile"], ["从抖音更新头像和昵称", "從抖音更新頭像和暱稱", "Update from Douyin"], ["正在更新抖音资料…", "正在更新抖音資料…", "Updating Douyin profile…"], ["更新后应用到当前玩家身份", "更新後套用到目前玩家身分", "Apply to your current player identity"], ["防守战绩", "防守戰績", "Defense records"], ["每个周期保留你的最高成绩", "每個週期保留你的最高成績", "Your best result in each period"], ["玩家 / 防守记录", "玩家 / 防守記錄", "Player / record"], ["这里等待你的第一场防守", "這裡等待你的第一場防守", "Your first record starts here"], ["完成挑战后，成绩会自动保存。", "完成挑戰後，成績會自動保存。", "Finish a run to save your score."], ["本机战绩 · 完成挑战后自动保存", "本機戰績 · 完成挑戰後自動保存", "Local records · Saved after each run"], ["离开当前防线？", "離開目前防線？", "Leave this defense?"], ["暂停保留本局；结束会结算成绩。", "暫停保留本局；結束會結算成績。", "Pause to keep it, or finish to save a score."], ["暂停并返回", "暫停並返回", "Pause and leave"], ["结束并结算", "結束並結算", "Finish run"], ["重新开始挑战？", "重新開始挑戰？", "Restart this run?"], ["将清空本局的装置、波次和布防资金。", "將清空本局的裝置、波次和佈防資金。", "This clears the layout, wave and defense funds."], ["已获得的收藏和成就进度会保留。", "已獲得的收藏和成就進度會保留。", "Collections and achievements are kept."], ["回收这个装置？", "回收這個裝置？", "Recycle this device?"], ["返还累计投入的 65%。", "返還累計投入的 65%。", "Refund 65% of the total investment."], ["保留装置", "保留裝置", "Keep device"], ["本次防守结束", "本次防守結束", "Defense complete"], ["先布防，再开战", "先佈防，再開戰", "Deploy before the attack"], ["用三个实际操作熟悉防线。", "用三個實際操作熟悉防線。", "Learn with three hands-on steps."], ["选择装置 → 放入空格 → 启动波次", "選擇裝置 → 放入空格 → 啟動波次", "Choose → Deploy → Start wave"], ["选择一种装置", "選擇一種裝置", "Choose a device"], ["点击空格部署", "點擊空格部署", "Tap a cell to deploy"], ["后台继续播放", "後台繼續播放", "Play in background"], ["后台自动暂停", "後台自動暫停", "Pause in background"], ["受击震屏", "受擊震屏", "Shake on damage"], ["记住战斗倍速", "記住戰鬥倍速", "Remember speed"], ["回收前确认", "回收前確認", "Confirm recycling"], ["重新查看引导", "重新查看引導", "Replay tutorial"], ["返回我的", "返回我的", "Back to profile"], ["按你的习惯调整防守体验", "按你的習慣調整防守體驗", "Make the controls work for you"], ["重新体验引导？", "重新體驗引導？", "Replay the tutorial?"], ["会重新开始本局，已获得收藏保留。", "會重新開始本局，已獲得收藏保留。", "Restarts this run; your collection is kept."], ["点开问题，查看对应操作", "點開問題，查看對應操作", "Open a question to see how it works"], ["装扮收藏", "裝扮收藏", "Cosmetics"], ["每日签到", "每日簽到", "Daily check-in"], ["自由搭配你的防线。", "自由搭配你的防線。", "Make the defense yours."], ["金币", "金幣", "Gold"], ["头像框", "頭像框", "Frames"], ["战绩卡", "戰績卡", "Record cards"], ["资料", "資料", "Profile"], ["装置", "裝置", "Devices"], ["普通", "普通", "Common"], ["精良", "精良", "Uncommon"], ["稀有", "稀有", "Rare"], ["史诗", "史詩", "Epic"], ["传说", "傳說", "Legendary"], ["防线原装", "防線原裝", "Original"], ["加入当前搭配", "加入目前搭配", "Try this look"], ["已加入搭配，保存后生效", "已加入搭配，保存後生效", "Preview added. Save to apply."], ["确认兑换", "確認兌換", "Confirm exchange"], ["已解锁，可加入搭配", "已解鎖，可加入搭配", "Unlocked. Add it to your look."], ["取消变更", "取消變更", "Discard changes"], ["保存变更", "保存變更", "Save changes"], ["保存搭配", "保存搭配", "Save look"], ["搭配已保存", "搭配已保存", "Look saved"], ["今天，也来守一程。", "今天，也來守一程。", "A new day on the defense."], ["北京时间零点刷新，每天手动领取一次。", "北京時間零點刷新，每天手動領取一次。", "Resets at midnight Beijing time."], ["累计七次一轮，断签不会清空进度。", "累計七次一輪，斷簽不會清空進度。", "Seven check-ins per cycle. No streak reset."], ["领取今日奖励", "領取今日獎勵", "Claim today's reward"], ["今日已领取", "今日已領取", "Claimed today"], ["今日奖励已领取", "今日獎勵已領取", "Today's reward claimed"], ["每一次坚守，都留下印记。", "每一次堅守，都留下印記。", "Every defense leaves a mark."], ["达成后手动领取，点击已领徽章切换展示。", "達成後手動領取，點擊已領徽章切換展示。", "Claim rewards, then select up to 3 badges."], ["单局挑战", "單局挑戰", "Single run"], ["永久累计", "永久累計", "Lifetime"], ["奖励已领取", "獎勵已領取", "Reward claimed"], ["取消展示", "取消展示", "Hide badge"], ["展示徽章", "展示徽章", "Show badge"], ["领取奖励", "領取獎勵", "Claim reward"], ["未达成", "未達成", "In progress"], ["展示已更新", "展示已更新", "Badges updated"], ["已拥有", "已擁有", "Owned"], ["橙线工程", "橙線工程", "Orange engineering"], ["新芽守卫", "新芽守衛", "Sprout guard"], ["蓝线信标", "藍線信標", "Blue beacon"], ["工程先锋", "工程先鋒", "Engineering pioneer"], ["环轨守望", "環軌守望", "Orbit watch"], ["橙线纪事", "橙線紀事", "Orange chronicles"], ["星轨档案", "星軌檔案", "Orbital record"], ["青岚庭院", "青嵐庭院", "Breeze garden"], ["远空信标", "遠空信標", "Distant beacon"]];
redesignExact.forEach(function(v){exact["zh-Hant"][v[0]]=v[1];exact.en[v[0]]=v[2];});
[
  ['已拥有，改领','已擁有，改領','Already owned. Claim'],['还差','還差','Need'],['兑换 ·','兌換 ·','Exchange ·'],
  ['金币不足','金幣不足','Not enough gold'],['金币余额已达上限','金幣餘額已達上限','Gold balance limit reached'],
  ['装置图鉴','裝置圖鑑','Device guide'],['放置费用','放置費用','Placement cost'],
  ['预计返还','預計返還','Expected refund'],['已回收装置','已回收裝置','Device recycled'],
  ['布防资金、积分和成绩怎样获得？','佈防資金、積分和成績怎樣取得？','How do I earn defense funds and score?'],
  ['基础属性','基礎屬性','Base stats'],['爆炸半径','爆炸半徑','Blast radius'],
  ['减速','減速','Slow'],['固定等级','固定等級','Fixed level'],['升级成长','升級成長','Upgrade growth'],
  ['升至','升至','Upgrade to'],['每级伤害','每級傷害','Damage per level'],
  ['每级射程','每級射程','Range per level'],['上限','上限','Cap'],
  ['返回战斗','返回戰鬥','Back to battle'],['返回玩法说明','返回玩法說明','Back to help'],
  ['/秒','/秒','/sec'],[' 秒',' 秒',' sec']
].forEach(function(v){exact['zh-Hant'][v[0]]=v[1];exact.en[v[0]]=v[2];});
var replacementKeys={};
function translate(value, lang) {
  var s=String(value), map=exact[lang];
  if(lang==='en'&&s==='简体中文')return 'SIMPLIFIED';
  if(lang==='en'&&s==='繁体中文')return 'TRADITIONAL';
  if(!map)return s;
  if(map[s])return map[s];
  var partial=common[lang]||{};if(!replacementKeys[lang]){for(var p in partial)if(!map[p])map[p]=partial[p];replacementKeys[lang]=Object.keys(map).sort(function(a,b){return b.length-a.length;});}var keys=replacementKeys[lang];
  for(var i=0;i<keys.length;i++)if(s.indexOf(keys[i])>=0)s=s.split(keys[i]).join(map[keys[i]]);
  if(lang==='en')s=s.replace(/第\s*(\d+)\s*WAVE来袭/,'WAVE $1 INCOMING').replace(/清场完成\s*\+(\d+)\s*Defense funds/,'CLEAR  +$1 Defense funds').replace(/历史BEST SCORE\s*(\d+)/,'BEST SCORE $1').replace(/坚持WAVE\s*(\d+)/,'WAVE REACHED $1').replace(/LIFE\s*-(\d+)/,'INTEGRITY -$1');
  return s;
}
module.exports=translate;

};
M["src/collection.js"]=function(module,exports,require){
'use strict';
// The local collection also drives the offline game and its previews.
var CFG = require('./config');
var QUALITIES = [
  {name:'普通',color:'#64736D'}, {name:'精良',color:'#28744B'},
  {name:'稀有',color:'#286DAD'}, {name:'史诗',color:'#8655A8'},
  {name:'传说',color:'#A66616'}
];
var ITEMS = [
  {id:'frame_leaf',type:'frame',name:'新芽守卫',quality:1,color:'#28744B',pattern:0,source:'signin',hint:'累计签到第 3 次',fallback:100},
  {id:'frame_signal',type:'frame',name:'蓝线信标',quality:2,color:'#286DAD',pattern:1,source:'shop',price:240},
  {id:'frame_engineer',type:'frame',name:'工程先锋',quality:2,color:'#B56D27',pattern:2,source:'achievement',hint:'完成「初见核心」',fallback:180},
  {id:'frame_orbit',type:'frame',name:'环轨守望',quality:3,color:'#8655A8',pattern:3,source:'shop',price:600},
  {id:'record_route',type:'record',name:'橙线纪事',quality:2,color:'#B56D27',bg:'#FFF5E9',pattern:0,source:'signin',hint:'累计签到第 7 次',fallback:180},
  {id:'record_orbit',type:'record',name:'星轨档案',quality:3,color:'#8655A8',bg:'#F3EDFA',pattern:1,source:'shop',price:600},
  {id:'profile_garden',type:'profile',name:'青岚庭院',quality:1,color:'#28744B',bg:'#EAF3EB',pattern:0,source:'shop',price:180},
  {id:'profile_beacon',type:'profile',name:'远空信标',quality:3,color:'#665596',bg:'#EEEDF6',pattern:1,source:'achievement',hint:'完成「三十重防线」',fallback:360}
];
CFG.towers.forEach(function(t){ITEMS.push({id:'device_engineer_'+t.id,type:'device',device:t.id,name:'橙线工程 · '+t.name,quality:2,color:'#B56D27',bg:'#FFF1DD',pattern:2,source:'shop',price:t.attack==='block'?180:300});});
var ACHIEVEMENTS = [
  {id:'place',name:'第一块拼图',description:'累计成功部署 1 个装置',stat:'placed',target:1,coins:40},
  {id:'upgrade',name:'精密维护',description:'累计升级装置 1 次',stat:'upgrades',target:1,coins:50},
  {id:'kills100',name:'清理航道',description:'累计击败 100 个侵体',stat:'kills',target:100,coins:100},
  {id:'kills1000',name:'防线常青',description:'累计击败 1000 个侵体',stat:'kills',target:1000,coins:240},
  {id:'boss',name:'初见核心',description:'累计击败 1 个核心侵体',stat:'bosses',target:1,item:'frame_engineer'},
  {id:'wave10',name:'十重防线',description:'单局完成第 10 波',stat:'bestClear',target:10,coins:120,single:true},
  {id:'wave20',name:'二十重防线',description:'单局完成第 20 波',stat:'bestClear',target:20,coins:240,single:true},
  {id:'wave30',name:'三十重防线',description:'单局完成第 30 波',stat:'bestClear',target:30,item:'profile_beacon',single:true},
  {id:'flawless',name:'滴水不漏',description:'单局累计完成 5 次无损清场',stat:'bestFlawless',target:5,coins:100,single:true},
  {id:'variety',name:'协同布防',description:'单局成功部署全部现有攻击装置',stat:'variety',target:1,coins:100,single:true},
  {id:'signin7',name:'七日之约',description:'累计签到 7 次',stat:'signins',target:7,coins:100},
  {id:'runs10',name:'常驻指挥',description:'累计结算 10 局至少完成 1 波的挑战',stat:'runs',target:10,coins:160}
];
var DAYS = [{coins:30},{coins:40},{item:'frame_leaf'},{coins:50},{coins:60},{coins:80},{item:'record_route'}];
function clone(v){return JSON.parse(JSON.stringify(v));}
function integer(v){return Number.isFinite(+v)?Math.max(0,Math.min(1000000000,Math.floor(+v))):0;}
function item(id){return ITEMS.find(function(v){return v.id===id;});}
function day(now){return Math.floor((now+8*3600000)/86400000);}
function fresh(){var devices={};CFG.towers.forEach(function(t){devices[t.id]='';});return {version:1,coins:0,owned:[],equipped:{device:devices,frame:'',record:'',profile:''},stats:{},claimed:[],badges:[],signins:0,lastDay:-1};}
function normalize(raw){
  var s=fresh();if(!raw||raw.version!==1)return s;
  s.coins=integer(raw.coins);s.signins=integer(raw.signins);s.lastDay=Number.isInteger(raw.lastDay)?raw.lastDay:-1;
  s.owned=Array.isArray(raw.owned)?raw.owned.filter(function(id,i,a){return item(id)&&a.indexOf(id)===i;}):[];
  ACHIEVEMENTS.forEach(function(a){s.stats[a.stat]=integer(raw.stats&&raw.stats[a.stat]);});s.stats.signins=s.signins;
  s.claimed=Array.isArray(raw.claimed)?raw.claimed.filter(function(id,i,a){return ACHIEVEMENTS.some(function(v){return v.id===id;})&&a.indexOf(id)===i;}):[];
  s.badges=Array.isArray(raw.badges)?raw.badges.filter(function(id,i,a){return s.claimed.indexOf(id)>=0&&a.indexOf(id)===i;}).slice(0,3):[];
  var e=raw.equipped||{};
  ['frame','record','profile'].forEach(function(type){var v=item(e[type]);if(v&&v.type===type&&s.owned.indexOf(v.id)>=0)s.equipped[type]=v.id;});
  CFG.towers.forEach(function(t){var v=item(e.device&&e.device[t.id]);if(v&&v.type==='device'&&v.device===t.id&&s.owned.indexOf(v.id)>=0)s.equipped.device[t.id]=v.id;});
  return s;
}
function Collection(platform){
  this.p=platform;this.error='';this.dirty=false;
  try{var raw=platform.getCollection?platform.getCollection():null;if(raw&&raw.version!==1)throw new Error('unknown version');this.state=normalize(raw);
    if(!raw&&platform.getScores){var highest=0;platform.getScores().forEach(function(r){highest=Math.max(highest,integer(r.clearedWave===undefined?Math.max(0,(+r.wave||0)-1):r.clearedWave));});this.state.stats.bestClear=highest;}
  }catch(e){this.state=fresh();this.readFailed=true;this.error='收藏存档读取失败，请重新进入';}
}
Collection.prototype.commit=function(next){
  if(this.readFailed)return false;
  var save=this.cloudCache||this.p.setCollection;
  try{if(!save||save(next)!==true)throw new Error('storage');}
  catch(e){this.error='保存失败，奖励未领取，请重试';return false;}
  this.state=next;this.error='';this.dirty=false;return true;
};
Collection.prototype.flush=function(){return !this.dirty||this.commit(clone(this.state));};
Collection.prototype.canSign=function(now){return day(now===undefined?Date.now()+(this.clockOffset||0):now)>this.state.lastDay;};
Collection.prototype.useCloud=function(snapshot,writeCache){
  this.cloudCache=writeCache;
  this.state=normalize(Object.assign({version:1,coins:snapshot.wallet.coins},snapshot.collection));
  // The wallet is a global balance and may grow across games.
  this.state.coins=snapshot.wallet.coins;
  this.clockOffset=snapshot.serverTime-Date.now();
  this.readFailed=false;this.error='';this.dirty=false;
};
Collection.prototype.cloudChange=function(action,value,request){
  var data={};
  if(action==='buy')data.itemId=value;
  if(action==='equip')data.equipped=clone(value);
  if(action==='claim')data.achievementId=value;
  if(action==='badge'){data.badgeId=value;data.enabled=this.state.badges.indexOf(value)<0;}
  var route=action==='sign'?'signin':action==='claim'?'claim-achievement':action;
  return request(route,data);
};
Collection.prototype.rewardLabel=function(reward){var v=item(reward.item);return v?(this.state.owned.indexOf(v.id)>=0?'已拥有，改领 '+v.fallback+' 金币':v.name):reward.coins+' 金币';};
function grant(s,reward){var v=item(reward.item);if(v){if(s.owned.indexOf(v.id)>=0)s.coins+=v.fallback||0;else s.owned.push(v.id);}else s.coins+=reward.coins||0;}
Collection.prototype.sign=function(now){
  now=now===undefined?Date.now()+(this.clockOffset||0):now;if(!this.canSign(now))return false;
  var s=clone(this.state);grant(s,DAYS[s.signins%7]);s.signins++;s.stats.signins=s.signins;s.lastDay=day(now);return this.commit(s);
};
Collection.prototype.claim=function(id){
  var a=ACHIEVEMENTS.find(function(v){return v.id===id;}),s=clone(this.state);
  if(!a||s.claimed.indexOf(id)>=0||(s.stats[a.stat]||0)<a.target)return false;
  grant(s,a);s.claimed.push(id);return this.commit(s);
};
Collection.prototype.buy=function(id){var v=item(id),s=clone(this.state);if(!v||v.source!=='shop'||s.owned.indexOf(id)>=0||s.coins<v.price)return false;s.coins-=v.price;s.owned.push(id);return this.commit(s);};
Collection.prototype.equip=function(draft){var raw=clone(this.state);raw.equipped=clone(draft);var s=normalize(raw);if(JSON.stringify(s.equipped)!==JSON.stringify(draft)){this.error='只能装备已拥有的装扮';return false;}return this.commit(s);};
Collection.prototype.badge=function(id){var s=clone(this.state),i=s.badges.indexOf(id);if(s.claimed.indexOf(id)<0)return false;if(i>=0)s.badges.splice(i,1);else{if(s.badges.length>=3){this.error='最多展示 3 枚，请先取消一枚';return false;}s.badges.push(id);}return this.commit(s);};
Collection.prototype.add=function(stat,n){this.state.stats[stat]=integer((this.state.stats[stat]||0)+n);this.dirty=true;};
Collection.prototype.max=function(stat,n){if(n>(this.state.stats[stat]||0)){this.state.stats[stat]=integer(n);this.dirty=true;}};
Collection.prototype.ready=function(){var s=this.state;return ACHIEVEMENTS.filter(function(a){return s.claimed.indexOf(a.id)<0&&(s.stats[a.stat]||0)>=a.target;}).length;};
module.exports={Collection:Collection,items:ITEMS,qualities:QUALITIES,achievements:ACHIEVEMENTS,days:DAYS,item:item,day:day,clone:clone};

};
M["src/collection-ui.js"]=function(module,exports,require){
'use strict';
var Catalog=require('./collection');
var CFG=require('./config');
module.exports=function(Game,ui){
  var rr=ui.rr,pxBox=ui.pxBox,pixelSprite=ui.pixelSprite,text=ui.text,icon=ui.icon,fit=ui.fit,hit=ui.hit,colors=ui.colors;
  var categories=[['device','装置'],['frame','头像框'],['record','战绩卡'],['profile','资料']];
  var homeButtons=[{x:24,y:552,w:164,h:52,label:'装扮收藏',tab:'collection'},{x:202,y:552,w:164,h:52,label:'每日签到',tab:'signin'}];
  var accountButtons=[{x:24,y:440,w:164,h:44,label:'我的装扮',tab:'collection'},{x:202,y:440,w:164,h:44,label:'成就',tab:'achievements'}];
  var listView={x:16,y:358,w:358,h:224};
  function box(c,r,fill,stroke){pxBox(c,r.x,r.y,r.w,r.h,fill,stroke||colors.line,colors.shadow,2);}
  function selected(g,type,device){var e=g.collection.state.equipped;return Catalog.item(type==='device'?e.device[device]:e[type]);}
  function activeMotion(g){return !g.settings.reduceMotion&&g.settings.effects==='full';}
  Game.prototype.collectionItem=function(type,device){return selected(this,type,device);};
  Game.prototype.paintFrame=function(x,y,r,override){
    var v=override===undefined?selected(this,'frame'):override;if(!v)return;
    var c=this.c,edge=Math.round(r+4),left=Math.round(x-edge),top=Math.round(y-edge),size=edge*2;
    var step=activeMotion(this)&&v.quality>=3&&(Math.floor(this.time*3)%2)?1:0;
    c.save();c.fillStyle=v.color;
    c.fillRect(left+2,top,size-4,2);c.fillRect(left+2,top+size-2,size-4,2);
    c.fillRect(left,top+2,2,size-4);c.fillRect(left+size-2,top+2,2,size-4);
    var corners=[[left-2-step,top-2-step],[left+size-4+step,top-2-step],[left-2-step,top+size-4+step],[left+size-4+step,top+size-4+step]];
    for(var i=0;i<4;i++){
      var cx=corners[i][0],cy=corners[i][1];
      if(v.pattern===0){c.fillStyle=v.color;c.fillRect(cx,cy,6,2);c.fillRect(cx,cy,2,6);}
      else if(v.pattern===1){c.fillStyle=colors.ink;c.fillRect(Math.round(x-6),top-3,12,3);c.fillRect(Math.round(x-6),top+size,12,3);c.fillStyle=v.color;c.fillRect(Math.round(x-4),top-2,8,2);}
      else if(v.pattern===2){c.fillStyle=colors.ink;c.fillRect(cx,cy,6,6);c.fillStyle=v.color;c.fillRect(cx+1,cy+1,4,4);}
      else{c.fillStyle=v.color;c.fillRect(cx,cy,5,5);c.fillStyle='#FFFFFF';c.fillRect(cx+1,cy+1,2,2);}
    }
    c.restore();
  };
  Game.prototype.paintRecord=function(x,y,w,h,override){
    var v=override===undefined?selected(this,'record'):override,c=this.c;
    pxBox(c,x,y,w,h,v?v.bg:colors.surface,v?v.color:colors.line,colors.shadow,2);
    if(v){
      c.save();c.beginPath();c.rect(x+2,y+2,w-4,h-4);c.clip();
      c.fillStyle=v.color;c.fillRect(x+2,y+6,4,h-12);
      c.globalAlpha=.18;
      if(v.pattern===0){for(var i=0;i<3;i++){var rx=x+w-84+i*22;c.fillRect(rx,y+h-38-i*10,4,36+i*10);c.fillRect(rx,y+h-38-i*10,28,4);}}
      else{for(var k=0;k<3;k++){var s=20+k*16;c.fillRect(x+w-16-s,y+12+k*6,s,3);c.fillRect(x+w-16-s,y+12+k*6,3,s);}}
      if(v.quality>=3&&activeMotion(this)){c.globalAlpha=.75;c.fillRect(x+w-20,y+12+(Math.floor(this.time*2)%2)*4,6,6);}
      c.restore();
    }
  };
  Game.prototype.paintProfile=function(override,rect){
    var v=override===undefined?selected(this,'profile'):override,c=this.c,r=rect||{x:0,y:78,w:390,h:632};
    if(!v)return;c.save();c.fillStyle=v.bg;c.fillRect(r.x,r.y,r.w,r.h);c.beginPath();c.rect(r.x,r.y,r.w,r.h);c.clip();
    c.fillStyle=v.color;c.globalAlpha=.14;
    if(v.pattern===0){for(var i=0;i<8;i++){var bw=36+(i%3)*14,bh=24+(i%4)*16;c.fillRect(r.x+12+i*48,r.y+r.h-bh,bw,bh);}}
    else{for(var j=0;j<4;j++){var sz=32+j*24;c.fillRect(r.x+r.w-24-sz,r.y+28+j*12,sz,4);c.fillRect(r.x+r.w-24-sz,r.y+28+j*12,4,sz);}
      if(activeMotion(this)){c.globalAlpha=.45;c.fillRect(r.x+r.w-44+(Math.floor(this.time*2)%2)*8,r.y+44,8,8);}}
    c.restore();
  };
  var DEVICE_PIXELS={
    wall:['1111111','1221321','1111111','1312211','1111111','1221231','1111111'],
    spark:['0001000','0013100','0123210','0012100','0012100','0122210','1111111'],
    nova:['0010100','0123210','1233321','0123210','0012100','0122210','1100011'],
    frost:['0001000','0102010','0013100','1231321','0013100','0102010','0001000'],
    fallback:['0111110','1232321','0122210','0012100','0122210','1222221','1111111']
  };
  Game.prototype.paintDevice=function(cfg,x,y,size,override){
    var v=override===undefined?selected(this,'device',cfg.id):override,c=this.c,key=cfg.glyph||cfg.id,rows=DEVICE_PIXELS[key]||DEVICE_PIXELS.fallback;
    var mainColor=v?v.color:cfg.color;
    if(v){
      var boxR=Math.max(6,Math.round(size*.68));
      pxBox(c,x-boxR,y-boxR,boxR*2,boxR*2,v.bg,v.color,null,2);
      pixelSprite(c,rows,x,y,Math.max(1.4,size*.9/7),{'1':colors.ink,'2':mainColor,'3':'#FFFFFF'});
    }else{
      pixelSprite(c,rows,x,y,Math.max(1.5,size/7),{'1':colors.ink,'2':mainColor,'3':'#FFFFFF'});
    }
  };
  Game.prototype.collectionEntries=function(account){
    var g=this,c=g.c,buttons=account?accountButtons:homeButtons;
    buttons.forEach(function(r){var held=g.collectionEntryGesture&&!g.collectionEntryGesture.moved&&g.collectionEntryGesture.b===r;box(c,r,held?colors.tealSoft:colors.surface,colors.line);text(c,r.label,r.x+16,r.y+r.h/2,14,colors.teal,'left',850);text(c,'›',r.x+r.w-18,r.y+r.h/2,20,colors.teal,'center',800);
      if(r.tab==='signin'&&g.collection.canSign()||r.tab==='achievements'&&g.collection.ready()){c.fillStyle=colors.orange;c.fillRect(r.x+r.w-37,r.y+9,6,6);}});
    if(!account)text(c,'金币 '+this.collection.state.coins+'  ·  成就待领 '+this.collection.ready(),24,636,12,colors.muted,'left',750);
  };
  Game.prototype.collectionAccountRecord=function(){
    var c=this.c,s=this.collection.state;this.paintRecord(24,596,342,110);
    text(c,'防守记录',40,616,12,colors.muted,'left',800);
    text(c,'最佳 '+this.best,40,643,17,colors.ink,'left',900);
    text(c,'已完成 '+(s.stats.bestClear||0)+' 波',350,643,12,colors.teal,'right',800);
    if(!s.badges.length)text(c,'在成就页选择展示徽章',40,684,11,colors.muted,'left',750);
    s.badges.forEach(function(id,i){var a=Catalog.achievements.find(function(v){return v.id===id;});pxBox(c,36+i*104,667,98,28,colors.surface,colors.line,null,2);text(c,a.name,85+i*104,681,11,colors.teal,'center',800);});
  };
  Game.prototype.openCollection=function(tab){
    this.collectionOrigin=this.screen;this.screen='collection';this.collectionTab=tab;this.collectionCategory='device';this.collectionDevice=CFG.towers[0].id;
    this.collectionDraft=Catalog.clone(this.collection.state.equipped);this.collectionPreview=undefined;this.collectionReturnTab=null;this.collectionScroll=0;this.collectionMessage='';this.collectionConfirm='';this.collectionHits=[];this.pressState=null;
    this.refreshCloud();
  };
  Game.prototype.collectionNotice=function(ok,message){this.collectionMessage=ok?message:this.collection.error||'条件未满足';if(ok)this.p.playSfx('upgrade');else this.p.playSfx('error');};
  Game.prototype.collectionList=function(){var g=this;return Catalog.items.filter(function(v){return v.type===g.collectionCategory&&(v.type!=='device'||v.device===g.collectionDevice);});};
  Game.prototype.collectionTouch=function(x,y,phase){
    var g=this;
    if(g.screen!=='collection'){
      var buttons=g.screen==='home'&&!g.sidebarGuideOpen?homeButtons:g.screen==='account'&&!g.profileEditor?accountButtons:[];
      if(!g.collectionEntryGesture&&g.screen==='home'&&g.sidebarSupported&&!g.sidebarRewardClaimed){var fx=g.sidebarFloatX,fy=g.sidebarFloatY;if(g.sidebarFloatDrag||hit({x:fx-(g.sidebarReturned&&fx>=163?60:0),y:fy-8,w:g.sidebarReturned?124:72,h:80},x,y))return false;}
      if(phase==='start'){var b=buttons.find(function(v){return hit(v,x,y);});if(!b)return false;g.collectionEntryGesture={x:x,y:y,b:b,moved:false};g.pressState=null;return true;}
      var e=g.collectionEntryGesture;if(!e)return false;if((x-e.x)*(x-e.x)+(y-e.y)*(y-e.y)>100)e.moved=true;
      if(phase==='end'||phase==='cancel'){g.collectionEntryGesture=null;if(phase==='end'&&!e.moved&&hit(e.b,x,y))g.openCollection(e.b.tab);}return true;
    }
    if(phase==='cancel'){g.collectionGesture=null;return true;}
    if(phase==='start'){g.collectionGesture={x:x,y:y,scroll:g.collectionScroll||0,moved:false,action:(g.collectionHits||[]).find(function(h){return hit(h.r,x,y);})};return true;}
    var p=g.collectionGesture;if(!p)return true;var dx=x-p.x,dy=y-p.y;if(dx*dx+dy*dy>100)p.moved=true;
    if(phase==='move'&&p.moved){var isList=g.collectionTab==='collection'&&hit(listView,p.x,p.y),isAchievements=g.collectionTab==='achievements'&&p.y>=218&&p.y<668;if(isList||isAchievements){var max=isList?Math.max(0,(g.collectionList().length+1)*76-224):Math.max(0,Catalog.achievements.length*128-450);g.collectionScroll=Math.max(0,Math.min(max,p.scroll-dy));}}
    if(phase==='end'){g.collectionGesture=null;if(!p.moved&&p.action&&hit(p.action.r,x,y)){p.action.fn();g.collectionHits=[];}}
    return true;
  };
};

};
M["src/cloud-game.js"]=function(module,exports,require){
'use strict';

var Catalog=require('./collection');
var CFG=require('./config');

module.exports=function(Game){
  function scope(game,identity,key){
    return game.p.auth.prefix+CFG.gameId+':'+identity+':'+key;
  }
  function isCurrent(game,identity){
    return game.p.auth.state.identityId===identity && !!identity;
  }
  function errorText(error){return error.message||'云端请求未完成，请重试';}
  function customAvatar(player){
    var url=player.avatarUrl||'';
    return /\/api\/game\/avatar-style\/[0-7]$/.test(url)?'':url;
  }

  Game.prototype.applyCloudPlayer=function(player){
    if(!player||this.identityDraft)return;
    this.ensureProfile();
    var g=this,url=customAvatar(player),changed=this.localAvatarUrl!==url;
    this.localNickName=player.nickName;
    this.localMotto=player.motto;
    this.localDefenseZone=player.zone;
    this.localAvatarStyle=player.avatarStyle||0;
    this.localAvatarUrl=url;
    if(changed){
      this.customAvatarImage=null;
      if(url&&this.p.loadImage)this.p.loadImage(url,function(image){if(g.localAvatarUrl===url)g.customAvatarImage=image;});
    }
  };

  Game.prototype.acceptCloudState=function(snapshot,identity,requestedPlayer,offline){
    var g=this,auth=this.p.auth,playerId=snapshot.player.playerId;
    if(!isCurrent(this,identity)||(requestedPlayer&&requestedPlayer!==auth.state.playerId&&playerId!==auth.state.playerId))return;
    var previous=this.cloudView;
    if(previous&&previous.player.playerId===playerId&&previous.revision>snapshot.revision)return;
    var key=scope(this,identity,'offline:'+playerId);
    var collectionDraft=this.collectionDraft;
    var cleanDraft=collectionDraft&&JSON.stringify(collectionDraft)===JSON.stringify(this.collection.state.equipped);
    var switched=!previous||previous.player.playerId!==playerId;
    if(switched&&this.identityDraft){
      this.deferredCloudState=[snapshot,identity,requestedPlayer,offline];
      return;
    }
    if(switched){
      this.collection=new Catalog.Collection(this.p);
    }
    this.cloudView=snapshot;
    this.cloudOnline=!offline;
    this.collection.useCloud(snapshot,function(value){return g.p.storageWrite(key,value);});
    if(offline){
      this.collection.clockOffset=0;
      var copy=this.p.storageRead(key);
      if(copy&&copy.version===1)this.collection.state=copy;
    }else{
      this.p.storageWrite(scope(this,identity,'state'),snapshot);
      this.p.storageWrite(key,null);
    }
    if(collectionDraft&&(switched||cleanDraft))this.collectionDraft=Catalog.clone(this.collection.state.equipped);
    auth.updatePlayer(playerId);
    this.best=Math.max(snapshot.bestScore,this.pendingScores(identity).reduce(function(best,run){return Math.max(best,run.score);},0));
    var localPlayer=offline&&this.p.storageRead(scope(this,identity,'profile:'+playerId));
    if(!offline)this.p.storageWrite(scope(this,identity,'profile:'+playerId),null);
    this.cloudPlayer=localPlayer||snapshot.player;
    this.applyCloudPlayer(this.cloudPlayer);
    this.profileStatus=offline?'离线游玩 · 战绩将在联网后提交':'SuMind 云端资料';
  };

  Game.prototype.useGuest=function(){
    if(!this.cloudView)return;
    this.cloudView=null;this.cloudPlayer=null;this.cloudOnline=false;this.deferredCloudState=null;
    if(this.identityDraft)this.endIdentityEdit(false);
    this.collection=new Catalog.Collection(this.p);
    if(this.collectionDraft)this.collectionDraft=Catalog.clone(this.collection.state.equipped);
    this.best=this.p.getBest();
    this.profileInitialized=false;
    this.ensureProfile();
  };
  Game.prototype.applyDeferredCloudState=function(){
    var pending=this.deferredCloudState;
    this.deferredCloudState=null;
    if(pending){this.acceptCloudState.apply(this,pending);this.flushCloudScores();}
  };
  Game.prototype.refreshCloud=function(interactive){
    var g=this,auth=this.p.auth;
    if(!auth||!auth.enabled)return Promise.resolve(false);
    if(this.cloudRefresh)return this.cloudRefresh;
    function fetchState(){
      var identity=auth.state.identityId,player=auth.state.playerId;
      return auth.request('state').then(function(snapshot){g.acceptCloudState(snapshot,identity,player);return true;});
    }
    var ready=auth.isAuthenticated()?fetchState().catch(function(error){
      if(error.status!==401)throw error;
      auth.clear();g.useGuest();
      return auth.login(interactive).then(fetchState);
    }):auth.login(interactive).then(fetchState);
    this.cloudRefresh=ready.then(function(){
      g.lastCloudError=null;
      g.flushCloudScores();
      if(g.screen==='leaderboard')g.refreshLeaderboard();
      return true;
    }).catch(function(error){
      g.lastCloudError=error;
      g.cloudOnline=false;
      if(!auth.isAuthenticated())g.useGuest();
      if(error.offline&&auth.isAuthenticated()&&!g.cloudView){
        var cached=g.p.storageRead(scope(g,auth.state.identityId,'state'));
        if(cached&&cached.player.playerId===auth.state.playerId){
          g.acceptCloudState(cached,auth.state.identityId,auth.state.playerId,true);
        }
      }
      g.profileStatus=error.status===401&&auth.state.platform==='web'?'登录 SuMind 后可同步三端进度':errorText(error);
      return false;
    }).finally(function(){g.cloudRefresh=null;});
    return this.cloudRefresh;
  };

  Game.prototype.collectionAction=function(action,value,message){
    if(this.collectionPending)return;
    var g=this,auth=this.p.auth,collection=this.collection;
    function local(){
      g.collectionNotice(collection[action](value),g.cloudView?'离线 · '+message:message);
    }
    if(!this.cloudOnline||!auth||!auth.isAuthenticated()){local();return;}
    var identity=auth.state.identityId,player=auth.state.playerId;
    this.collectionPending=true;this.collectionMessage='正在同步…';
    return collection.cloudChange(action,value,auth.request).then(function(snapshot){
      g.acceptCloudState(snapshot,identity,player);
      if(isCurrent(g,identity))g.collectionNotice(true,message);
    }).catch(function(error){
      if(!isCurrent(g,identity))return;
      if(error.offline){g.cloudOnline=false;local();return;}
      if(error.status===401||error.status===409)g.refreshCloud();
      collection.error=errorText(error);g.collectionNotice(false,message);
    }).finally(function(){g.collectionPending=false;});
  };

  Game.prototype.restoreLoginReturn=function(){
    var target=this.p.loginReturn&&this.p.loginReturn();
    if(target==='account')this.screen='account';
    else if(target&&/^rank=(week|month|all)$/.test(target)){
      this.screen='leaderboard';this.leaderboardTab=target.slice(5);this.leaderboardScroll=0;
      this.refreshLeaderboard();
    }
  };
  Game.prototype.manageCloudLogin=function(){
    var g=this,auth=this.p.auth;
    if(!auth||!auth.enabled)return;
    this.refreshCloud(true).then(function(ok){
      if(ok)return;
      if(auth.state.platform==='web'&&g.lastCloudError&&g.lastCloudError.status===401){
        if(!g.over&&(g.wave>0||g.towers.length)){
          g.p.showMessage('本局尚未结束','可以继续防守，结算后再登录 SuMind。');return;
        }
        g.p.chooseLogin(g.screen==='leaderboard'?'game-rank-'+g.leaderboardTab:'game-account');
      }else g.p.showMessage('SuMind 云存档',g.profileStatus);
    });
  };
  Game.prototype.showCloudBindCode=function(){
    var g=this,auth=this.p.auth;
    if(!this.cloudOnline||!auth.isAuthenticated()){this.manageCloudLogin();return;}
    if(this.bindingBusy)return;
    this.bindingBusy=true;
    auth.bindCode().then(function(result){
      g.p.showMessage('绑定码 '+result.code,'请在另一端的「我的」中输入这 6 位数字。绑定码有效期为 10 分钟。');
    }).catch(function(error){g.p.showMessage('生成绑定码失败',errorText(error));})
      .finally(function(){g.bindingBusy=false;});
  };
  Game.prototype.enterCloudBindCode=function(){
    var g=this,auth=this.p.auth;
    if(!this.cloudOnline||!auth.isAuthenticated()){this.manageCloudLogin();return;}
    if(this.bindingBusy)return;
    this.p.editText('',function(code){
      if(!code||g.bindingBusy)return;
      if(!/^\d{6}$/.test(code)){g.p.showMessage('绑定码无效','请输入 6 位数字。');return;}
      g.bindingBusy=true;
      auth.bind(code).then(function(){
        return Promise.resolve(g.cloudRefresh).then(function(){return g.refreshCloud();});
      }).then(function(ok){g.p.showMessage('账号已绑定',ok?'三端进度已同步。':'稍后联网即可同步。');})
        .catch(function(error){g.p.showMessage('绑定未完成',errorText(error));})
        .finally(function(){g.bindingBusy=false;});
    },{maxLength:6,prompt:'输入另一端生成的 6 位绑定码'});
  };

  Game.prototype.saveSharedProfile=function(draft){
    if(!this.cloudView)return false;
    var fields={};
    [['nickName','localNickName'],['motto','localMotto'],['zone','localDefenseZone'],['avatarStyle','localAvatarStyle'],
      ['avatarUrl','localAvatarUrl']].forEach(function(keys){
        if(this[keys[1]]!==draft[keys[1]])fields[keys[0]]=this[keys[1]];
      },this);
    this.updateSharedProfile(fields,draft);
    return true;
  };
  Game.prototype.updateSharedProfile=function(fields,draft){
    var g=this,auth=this.p.auth,identity=auth.state.identityId,playerId=auth.state.playerId;
    if(this.cloudProfilePending)return;
    function exit(){
      g.cloudProfilePending=false;
      if(draft&&g.identityDraft===draft)g.endIdentityEdit(false);
    }
    function offline(){
      var key=scope(g,identity,'profile:'+playerId);
      var player=Object.assign({},g.p.storageRead(key)||g.cloudView.player,fields);
      if(!g.p.storageWrite(key,player)){g.p.showMessage('资料未保存','本机无法写入存档，请重试。');return;}
      exit();
      g.cloudPlayer=player;
      g.applyCloudPlayer(player);
      g.profileStatus='已保存离线资料';
    }
    if(!this.cloudOnline){offline();return;}
    this.cloudProfilePending=true;
    var payload=Object.assign({},fields);
    var ready=fields.avatarUrl&&!/^https:\/\//i.test(fields.avatarUrl)?this.p.avatarPng(fields.avatarUrl).then(function(png){
      payload.avatarPng=png;delete payload.avatarUrl;
    }):Promise.resolve();
    ready.then(function(){
      if(!isCurrent(g,identity))return;
      return auth.request('profile',payload);
    }).then(function(snapshot){
      if(!snapshot||!isCurrent(g,identity))return;
      exit();g.acceptCloudState(snapshot,identity,playerId);
    }).catch(function(error){
      if(!isCurrent(g,identity))return;
      if(error.offline){g.cloudOnline=false;offline();return;}
      if(error.status===401)g.refreshCloud();
      g.p.showMessage('资料未保存',errorText(error));
    }).finally(function(){g.cloudProfilePending=false;});
  };

  Game.prototype.markRunOwner=function(){
    if(this.runOwner!==undefined)return;
    this.runOwner=this.cloudView?this.p.auth.state.identityId:'';
    this.runCollection=this.collection;
  };
  Game.prototype.recordRunStat=function(key,value,maximum){
    this.markRunOwner();
    this.runStats[key]=maximum?Math.max(this.runStats[key]||0,value):(this.runStats[key]||0)+value;
    if(!this.runOwner||!this.cloudOnline)this.runCollection[maximum?'max':'add'](key,value);
  };
  Game.prototype.pendingScores=function(identity){
    if(this.scoreQueues&&this.scoreQueues[identity])return this.scoreQueues[identity];
    var saved=this.p.storageRead(scope(this,identity,'scores'));
    return Array.isArray(saved)?saved:[];
  };
  Game.prototype.savePendingScores=function(identity,runs){
    if(!this.scoreQueues)this.scoreQueues={};
    this.scoreQueues[identity]=runs;
    return this.p.storageWrite(scope(this,identity,'scores'),runs.length?runs:null);
  };
  Game.prototype.submitRun=function(entry){
    if(this.runOwner){
      var runs=this.pendingScores(this.runOwner).slice();
      var runId=Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)+'-'+Math.random().toString(36).slice(2);
      runs.push({runId:runId,score:entry.score,wave:entry.wave,clearedWave:entry.clearedWave,duration:entry.duration,statsDelta:this.runStats});
      this.runResultId=runId;
      this.runSaveStatus=this.savePendingScores(this.runOwner,runs)?'战绩已保存 · 等待同步':'战绩暂存于当前游戏';
      if(isCurrent(this,this.runOwner))this.best=Math.max(this.best,entry.score);
      this.flushCloudScores();
      return;
    }
    var savedBest=entry.score<=this.p.getBest()||this.p.setBest(entry.score)!==false;
    if(!this.cloudView)this.best=Math.max(this.best,entry.score);
    var savedScore=this.p.addScore&&this.p.addScore(entry)!==false;
    this.runSaveStatus=savedBest&&savedScore?'本局已保存到当前设备':'本机存档写入失败';
  };
  Game.prototype.flushCloudScores=function(){
    var g=this,auth=this.p.auth;
    if(this.sendingScores)return this.sendingScores;
    if(!this.cloudOnline||!auth||!auth.isAuthenticated())return;
    var identity=auth.state.identityId;
    function sendNext(){
      var next=g.pendingScores(identity)[0],requestedPlayer=auth.state.playerId;
      if(!next||!isCurrent(g,identity))return Promise.resolve();
      function remove(){
        g.savePendingScores(identity,g.pendingScores(identity).filter(function(run){return run.runId!==next.runId;}));
      }
      return auth.request('score',next).then(function(snapshot){
        remove();g.acceptCloudState(snapshot,identity,requestedPlayer);
        if(g.runResultId===next.runId)g.runSaveStatus='战绩已同步至 SuMind';
        if(g.screen==='leaderboard')g.refreshLeaderboard();
        return sendNext();
      },function(error){
        if(error.status===400||error.status===409){remove();if(g.runResultId===next.runId)g.runSaveStatus='战绩未能上报';g.notify(errorText(error),3);return sendNext();}
        if(error.offline)g.cloudOnline=false;
        if(error.status===401)g.refreshCloud();
      });
    }
    this.sendingScores=sendNext().finally(function(){g.sendingScores=null;});
    return this.sendingScores;
  };

  Game.prototype.refreshLeaderboard=function(){
    var g=this,auth=this.p.auth,tab=this.leaderboardTab;
    if(!auth||!auth.enabled)return;
    if(!this.rankRequests)this.rankRequests={};
    var player=this.cloudOnline&&auth.state.playerId,route='leaderboard?tab='+encodeURIComponent(tab);
    var existing=this.rankRequests[tab];
    if(existing&&existing.player===player)return existing.promise;
    var request={player:player};
    this.rankRequests[tab]=request;
    request.promise=auth.request(route+(player?'&personal=1':'')).catch(function(error){
      if(!player||error.status!==401)throw error;
      g.refreshCloud();
      return auth.request(route);
    }).then(function(result){
      if(g.rankRequests[tab]!==request)return;
      if(!g.cloudRanks)g.cloudRanks={};
      if(!g.rankInfo)g.rankInfo={};
      g.cloudRanks[tab]=result.entries;
      g.rankInfo[tab]={updatedAt:Date.now(),offline:false,player:player,ownRank:result.ownRank};
    }).catch(function(){
      if(g.rankRequests[tab]!==request)return;
      if(!g.rankInfo)g.rankInfo={};
      g.rankInfo[tab]=Object.assign({},g.rankInfo[tab],{offline:true});
    }).finally(function(){if(g.rankRequests[tab]===request)delete g.rankRequests[tab];});
    return request.promise;
  };
  Game.prototype.drawRankAvatar=function(row,x,y,r){
    if(!row.playerId){this.drawIdentityAvatar(x,y,r);return;}
    var g=this,url=customAvatar(row);
    if(!this.rankImages)this.rankImages=new Map();
    if(url&&!this.rankImages.has(url)){
      if(this.rankImages.size>=300)this.rankImages.delete(this.rankImages.keys().next().value);
      this.rankImages.set(url,null);
      this.p.loadImage(url,function(image){if(g.rankImages.has(url))g.rankImages.set(url,image);});
    }
    var image=this.rankImages.get(url);
    this.drawLocalAvatar(x,y,r,row.avatarStyle||0);
    if(image)this.c.drawImage(image,x-r+2,y-r+2,2*r-4,2*r-4);
  };
};

};
M["src/presentation.js"]=function(module,exports,require){
'use strict';
// Clean Pixel (Style B) presentation layer. Owns current screens and shared hit rectangles.
// Game rules, profile drafts and the collection ledger remain separate.
var CFG=require('./config'),Catalog=require('./collection'),translate=require('./i18n');
module.exports=function(Game,u){
  var P=u.colors,pxBox=u.pxBox,txt=u.text,native=u.native,metric=u.metric,fit=u.fit,icon=u.icon,hit=u.hit,compact=u.compact;
  var navY=708;

  function surface(g,title,subtitle,back){
    var c=g.c;g.designActions=[];g.designScreen=g.screen;
    c.fillStyle=P.bg;c.fillRect(0,0,390,780);
    if(back)button(g,{x:16,y:16,w:52,h:44},'‹',back,'quiet');
    if(title)txt(c,title,back?82:24,38,23,P.ink,'left',800);
    if(subtitle)txt(c,subtitle,24,76,12,P.muted,'left',600);
  }
  function action(g,r,fn){g.designActions.push({r:r,fn:fn});}
  function button(g,r,label,fn,kind,disabled){
    var c=g.c,held=!disabled&&g.designGesture&&!g.designGesture.moved&&hit(r,g.designGesture.x,g.designGesture.y);
    var dark=kind==='primary',accent=kind==='orange',quiet=kind==='quiet';
    var fill=disabled?'#DCE2CE':dark?P.teal:accent?P.orange:held?P.tealSoft:quiet?P.soft:P.surface;
    var border=disabled?'#939E88':P.line;
    var shadow=disabled||held||quiet?null:(dark||accent?P.btnShadow:P.shadow);
    var ox=held?1:0,oy=held?1:0;
    pxBox(c,r.x+ox,r.y+oy,r.w,r.h,fill,border,shadow,2);
    txt(c,fit(c,translate(label,g.settings.language),r.w-16,14,700),r.x+r.w/2+ox,r.y+r.h/2+oy,14,disabled?P.muted:dark||accent?'#FFFFFF':P.ink,'center',700);
    if(!disabled)action(g,r,fn);
  }
  function rule(c,y,x,w){c.fillStyle=P.gridLine;c.fillRect(x||24,y,w||342,2);}
  function saveLocation(g){
    if(g.cloudView)return g.cloudOnline?'已连接 SuMind · 跨端存档':'离线游玩 · 当前设备缓存';
    if(g.cloudRefresh)return '正在连接 SuMind · 可继续游玩';
    return '游客游玩 · 进度保存在当前'+(g.p.name==='web'?'浏览器':'设备');
  }
  function backCollection(g){if(g.collectionReturnTab){g.collectionTab=g.collectionReturnTab;g.collectionReturnTab=null;g.collectionScroll=0;return;}g.collectionDraft=null;g.screen=g.collectionOrigin||'home';g.collectionHits=[];}
  function go(g,where){g.collectionDraft=null;g.profileEditor=false;g.designGesture=null;g.pressState=null;g.designActions=[];if(where==='collection'){g.openCollection('collection');g.collectionOrigin='home';}else g.screen=where;if(where==='account')g.refreshCloud();}

  function nav(g,on){
    var c=g.c;
    pxBox(c,20,navY+4,350,62,P.surface,P.line,P.shadow,2);
    [['home','防线','building'],['collection','收藏','image'],['account','我的','home']].forEach(function(v,i){
      var x=24+i*114,active=on===v[0];
      if(active)pxBox(c,x+7,navY+10,100,50,P.teal,P.line,null,2);
      if(v[0]==='account')g.drawIdentityAvatar(x+57,navY+26,10);
      else icon(c,v[2],x+57,navY+25,active?'#FFFFFF':P.ink,16);
      txt(c,v[1],x+57,navY+48,11,active?'#FFFFFF':P.ink,'center',700);
      action(g,{x:x,y:navY+6,w:114,h:60},function(){if(on!==v[0])go(g,v[0]);});
    });
  }

  function row(g,y,label,detail,fn){
    var c=g.c,r={x:16,y:y,w:358,h:64},held=g.designGesture&&!g.designGesture.moved&&hit(r,g.designGesture.x,g.designGesture.y);
    pxBox(c,24,y+2,342,60,held?P.tealSoft:P.surface,P.line,P.shadow,2);
    txt(c,label,40,y+22,15,P.ink,'left',700);
    if(detail)txt(c,fit(c,detail,276,12,500),40,y+44,12,P.muted,'left',500);
    txt(c,'›',348,y+32,22,P.teal,'center',700);
    action(g,r,fn);
  }

  function equipped(g,type,device){var d=g.collectionDraft||g.collection.state.equipped;return Catalog.item(type==='device'?d.device[device]:d[type])||null;}
  function preview(g){return g.collectionPreview===undefined?equipped(g,g.collectionCategory,g.collectionDevice):g.collectionPreview;}

  function deviceToolbar(g){
    var c=g.c,bar=u.deviceBar,rail=bar.rail;
    c.save();c.beginPath();c.rect(rail.x,rail.y,rail.w,rail.h+4);c.clip();
    CFG.towers.forEach(function(cfg,i){
      var r=g.deviceTileRect(i),selected=cfg.id===g.selected;
      var affordable=g.energy>=g.placementCost(cfg,g.placementLevels[cfg.id]||1);
      pxBox(c,r.x,r.y,r.w,r.h,selected?P.tealSoft:affordable?P.surface:P.soft,selected?P.teal:P.line,P.shadow,2);
      c.save();if(!affordable)c.globalAlpha=.48;
      g.paintDevice(cfg,r.x+r.w/2,r.y+r.h/2,40);
      c.restore();
    });
    c.restore();
    icon(c,'info',bar.info.x+bar.info.w/2,bar.info.y+bar.info.h/2,P.ink,34);

    var cfg=g.selectedDevice();
    if(!cfg)return;
    var r=bar.detail,cy=r.y+r.h/2,block=cfg.attack==='block';
    var level=block?1:g.placementLevels[cfg.id]||1,cost=g.placementCost(cfg,level);
    pxBox(c,r.x,r.y,r.w,r.h,P.surface,P.line,P.shadow,2);
    var name=fit(c,translate(cfg.name,g.settings.language),140,13,800);
    var priceX=r.x+30+Math.ceil(c.measureText(name).width);
    var priceText=compact(cost)+' '+translate('布防资金',g.settings.language),priceLimit=bar.decrease.x-6;
    var stacked=c.measureText(priceText).width>priceLimit-priceX;
    native(c,name,r.x+14,cy-(stacked?8:0),13,P.ink,'left',800);
    if(stacked)priceX=r.x+14;
    else txt(c,'·',priceX-8,cy,12,P.muted,'center',700);
    native(c,fit(c,priceText,priceLimit-priceX,13,800),priceX,cy+(stacked?9:0),13,g.energy>=cost?P.orange:P.red,'left',800);
    if(block){txt(c,'固定等级',300,cy,12,P.muted,'center',700);return;}

    [[bar.decrease,'−',level>1],[bar.increase,'+',g.energy>=g.placementCost(cfg,level+1)]].forEach(function(v){
      var box=v[0];
      pxBox(c,box.x+3,box.y+6,box.w-6,box.h-12,v[2]?P.tealSoft:P.soft,P.line,null,2);
      txt(c,v[1],box.x+box.w/2,cy,18,v[2]?P.ink:P.muted,'center',800);
    });
    metric(c,'Lv.'+level,298,cy,14,P.ink,'center',800);
  }

  Game.prototype.home=function(){
    this.ensureProfile();var g=this,c=this.c;surface(g,'防线指挥室','',null);
    txt(c,'别让它进来',24,108,33,P.ink,'left',800);
    txt(c,'把敌人的路线，变成你的武器',24,144,13,P.muted,'left',600);
    txt(c,saveLocation(g),24,163,11,P.muted,'left',600);
    button(g,{x:286,y:94,w:80,h:44},g.collection.canSign()?'签到':'已签到',function(){g.openCollection('signin');},'quiet');
    if(g.collection.canSign()){c.fillStyle=P.ink;c.fillRect(353,99,8,8);c.fillStyle=P.orange;c.fillRect(354,100,6,6);}

    pxBox(c,24,176,342,302,P.surface,P.line,P.shadow,2);
    txt(c,this.wave>0?'当前防线':'无尽防守',42,202,13,P.ink,'left',700);
    txt(c,this.wave>0?'第 '+this.wave+' 波':'准备部署',348,202,12,P.teal,'right',700);

    var grid=CFG.grid,sx=55,sy=228,cw=20,ch=12.4;
    c.save();c.beginPath();c.rect(40,220,310,244);c.clip();
    for(var y=0;y<grid.rows;y++)for(var x=0;x<grid.cols;x++){
      c.fillStyle=(x+y)%2?'#F3F6E7':'#E9EFE0';
      c.fillRect(sx+x*cw,sy+y*ch,cw-2,ch-2);
    }
    var route=this.findPath(0,grid.entryRow)||[],motion=!this.settings.reduceMotion,t=this.time||0;
    c.strokeStyle=P.teal;c.lineWidth=2.5;c.lineJoin='miter';
    if(c.setLineDash){c.setLineDash([6,4]);c.lineDashOffset=motion?-Math.floor(t*16%10):0;}
    c.beginPath();route.forEach(function(q,i){var px=sx+q[0]*cw+9,py=sy+q[1]*ch+5;if(i)c.lineTo(px,py);else c.moveTo(px,py);});c.stroke();
    if(c.setLineDash)c.setLineDash([]);
    if(motion&&route.length>1){
      var progress=t*.65%(route.length-1),segment=Math.floor(progress),blend=progress-segment,a=route[segment],b=route[segment+1];
      var rx=Math.round(sx+(a[0]+(b[0]-a[0])*blend)*cw+9),ry=Math.round(sy+(a[1]+(b[1]-a[1])*blend)*ch+5);
      c.fillStyle=P.ink;c.fillRect(rx-4,ry-4,8,8);c.fillStyle=P.orange;c.fillRect(rx-3,ry-3,6,6);
    }
    this.towers.forEach(function(tw){g.paintDevice(tw.cfg,sx+tw.col*cw+9,sy+tw.row*ch+5,9);});
    var stX=Math.round(sx+9),stY=Math.round(sy+grid.entryRow*ch+5),exitX=Math.round(sx+(grid.cols-1)*cw+9),exitY=Math.round(sy+grid.exitRow*ch+5);
    pxBox(c,stX-6,stY-5,12,10,P.teal,P.ink,null,0);c.fillStyle='#FFFFFF';c.fillRect(stX-1,stY-1,3,3);
    pxBox(c,exitX-6,exitY-5,12,10,P.orange,P.ink,null,0);c.fillStyle=motion&&(Math.floor(t*3)%2)?'#FFFFFF':'#FFE0C2';c.fillRect(exitX-2,exitY-2,4,4);
    c.restore();

    pxBox(c,24,494,342,60,P.surface,P.line,P.shadow,2);
    txt(c,'最佳得分',40,512,11,P.muted,'left',600);
    metric(c,compact(this.best),40,536,24,P.ink,'left',800);
    button(g,{x:246,y:502,w:110,h:44},'查看战绩 ›',function(){g.screen='leaderboard';g.refreshLeaderboard();},'quiet');

    if(!this.sidebarSupported||this.sidebarRewardClaimed){
      txt(c,this.wave>0?'布防现场已保留，随时继续。':'选装置、改路线，守住每一次进攻。',24,585,12,P.muted,'left',600);
    }
    button(g,{x:24,y:616,w:342,h:64},this.wave>0?'继续防守':'进入防线',function(){g.screen='game';g.tutorial=false;if(!g.settings.tutorialSeen&&g.wave===0)g.tutorialPrompt=true;g.p.vibrate();},'orange');
    nav(g,'home');

    if(this.sidebarSupported&&!this.sidebarRewardClaimed){
      var r={x:24,y:562,w:342,h:46},ready=this.sidebarReturned,held=this.designGesture&&!this.designGesture.moved&&hit(r,this.designGesture.x,this.designGesture.y),blink=!this.settings.reduceMotion&&(Math.floor((this.time||0)*3)%2);
      pxBox(c,r.x,r.y,r.w,r.h,ready?P.orangeSoft:held?P.tealSoft:'#E6F2EA',P.line,null,2);
      pxBox(c,34,571,28,28,ready?P.orange:P.teal,P.ink,null,0);
      icon(c,'money',48,585,'#FFFFFF',13);
      txt(c,ready?'补给已送达':'侧栏补给',70,578,13,P.ink,'left',700);
      txt(c,ready?'今日可领取 80 布防资金':'从抖音首页侧边栏返回即可领取',70,596,9,P.muted,'left',600);
      pxBox(c,284,571,74,28,ready?P.orange:P.surface,P.line,null,2);
      txt(c,ready?'领取 +80':'去完成',321,585,11,ready?'#FFFFFF':P.teal,'center',700);
      if(!ready&&blink)txt(c,'›',275,585,14,P.teal,'center',700);
      action(g,r,function(){if(g.sidebarReturned)g.claimSidebarReward();else g.sidebarGuideOpen=true;});
    }
    if(this.notices.length)txt(c,fit(c,this.notices[this.notices.length-1].text,330,11,600),195,696,11,P.teal,'center',600);
    if(this.sidebarGuideOpen)this.sidebarGuide();
  };

  Game.prototype.accountPage=function(){
    if(this.profileEditor)return;this.ensureProfile();var g=this,c=this.c,s=this.collection.state;surface(g,'我的','',null);this.paintProfile();
    button(g,{x:166,y:16,w:72,h:44},'设置',function(){g.screen='settings';},'quiet');
    this.drawIdentityAvatar(65,146,38);
    txt(c,fit(c,this.localNickName,230,23,800),122,126,23,P.ink,'left',800);
    txt(c,fit(c,this.localMotto,230,13,500),122,158,13,P.muted,'left',500);
    pxBox(c,122,176,74,24,P.tealSoft,P.line,null,2);
    txt(c,this.localDefenseZone,159,188,11,P.teal,'center',700);
    txt(c,saveLocation(g),24,210,11,P.muted,'left',600);
    button(g,{x:24,y:224,w:342,h:46},'编辑头像与资料',function(){g.beginIdentityEdit();},'outline');
    this.paintRecord(24,294,342,134);
    txt(c,'防守档案',42,318,12,P.muted,'left',600);
    metric(c,compact(this.best),42,358,29,P.ink,'left',800);
    txt(c,'历史最佳',42,394,11,P.muted,'left',500);
    metric(c,''+(s.stats.bestClear||0),346,358,29,P.teal,'right',800);
    txt(c,'最高完成波次',346,394,11,P.muted,'right',500);
    row(g,449,'成就',s.badges.length?'展示中 · '+s.badges.map(function(id){return Catalog.achievements.find(function(a){return a.id===id;}).name;}).join(' / '):'已领取 '+s.claimed.length+' 项 · 可领 '+g.collection.ready()+' 项',function(){g.openCollection('achievements');});
    if(this.p.isDouyin||!this.p.auth||!this.p.auth.enabled){
      row(g,531,g.profileBusy?'正在更新抖音资料…':'从抖音更新头像和昵称','更新后应用到当前玩家身份',function(){if(!g.profileBusy)g.requestProfile(true);});
    }
    if(this.p.auth&&this.p.auth.enabled){
      if(this.cloudView&&this.cloudOnline){
        button(g,{x:24,y:610,w:162,h:44},'生成绑定码',function(){g.showCloudBindCode();},'outline',this.bindingBusy);
        button(g,{x:204,y:610,w:162,h:44},'输入绑定码',function(){g.enterCloudBindCode();},'outline',this.bindingBusy);
      }else{
        var loginLabel=this.cloudRefresh?'正在连接 SuMind…':this.cloudView?'重试云端同步':'登录 SuMind';
        button(g,{x:24,y:610,w:342,h:44},loginLabel,function(){g.manageCloudLogin();},'outline',!!this.cloudRefresh);
      }
    }
    if(g.profileStatus&&g.profileStatus!=='玩家资料')txt(c,fit(c,g.profileStatus,342,12,600),24,g.p.auth&&g.p.auth.enabled?678:625,12,P.muted,'left',600);
    nav(g,'account');
  };

  Game.prototype.profileEditorModal=function(){
    if(!this.identityDraft)this.beginIdentityEdit();var g=this,c=this.c,R=u.geometry;surface(g,'','',null);this.paintProfile();
    pxBox(c,16,16,80,44,P.soft,P.line,null,2);
    txt(c,'‹ 返回',56,38,14,P.ink,'center',700);
    txt(c,'编辑资料',195,38,22,P.ink,'center',800);
    this.drawIdentityAvatar(195,122,42);
    pxBox(c,214,138,26,26,P.teal,P.line,null,2);
    icon(c,'camera',227,151,'#FFFFFF',14);

    c.save();c.beginPath();c.rect(R.avatarRail.x,R.avatarRail.y,R.avatarRail.w,R.avatarRail.h);c.clip();
    for(var i=0;i<8;i++){
      var x=21+i*78-(this.profileAvatarScroll||0),on=!this.localAvatarUrl&&this.localAvatarStyle===i;
      if(on)pxBox(c,x,190,68,66,P.tealSoft,P.teal,null,2);
      this.drawLocalAvatar(x+34,223,23,i);
    }
    c.restore();

    [[R.editorName,'昵称',this.localNickName],[R.editorMotto,'防线宣言',this.localMotto]].forEach(function(v){
      pxBox(c,24,v[0].y+4,342,64,P.surface,P.line,P.shadow,2);
      txt(c,v[1],40,v[0].y+21,11,P.muted,'left',600);
      txt(c,fit(c,v[2],252,16,700),40,v[0].y+47,16,P.ink,'left',700);
      pxBox(c,308,v[0].y+22,46,28,P.soft,P.line,null,2);
      txt(c,'编辑',331,v[0].y+36,11,P.teal,'center',700);
    });

    txt(c,'虚拟家园',24,468,14,P.ink,'left',700);
    c.save();c.beginPath();c.rect(R.homeRail.x,R.homeRail.y,R.homeRail.w,R.homeRail.h);c.clip();
    u.zones.forEach(function(zone,idx){
      var hx=16+idx*122-(g.profileHomeScroll||0),on=zone===g.localDefenseZone;
      pxBox(c,hx,486,114,58,on?P.tealSoft:P.surface,on?P.teal:P.line,null,2);
      txt(c,zone,hx+57,515,14,on?P.teal:P.ink,'center',700);
    });
    c.restore();

    if(this.identityChanged()){
      pxBox(c,R.profileCancel.x,R.profileCancel.y,R.profileCancel.w,R.profileCancel.h,P.surface,P.line,P.shadow,2);
      txt(c,'取消变更',101,624,15,P.ink,'center',700);
      pxBox(c,R.profileDone.x,R.profileDone.y,R.profileDone.w,R.profileDone.h,P.teal,P.line,P.btnShadow,2);
      txt(c,g.cloudProfilePending?'正在保存…':'保存变更',289,624,15,'#FFFFFF','center',700);
    }
    if(this.avatarPickerOpen){
      var menu=this.avatarMenuGeometry();
      pxBox(c,menu.panel.x,menu.panel.y,menu.panel.w,menu.panel.h,P.surface,P.line,P.btnShadow,2);
      c.fillStyle=P.gridLine;c.fillRect(menu.panel.x+6,menu.camera.y,menu.panel.w-12,2);
      [[menu.album,'image','相册选择'],[menu.camera,'camera','拍照上传']].forEach(function(v){
        icon(c,v[1],v[0].x+18,v[0].y+22,P.teal,14);
        txt(c,v[2],v[0].x+36,v[0].y+22,12,P.ink,'left',700);
      });
    }
  };

  Game.prototype.pageHeader=function(title,subtitle){
    var c=this.c;pxBox(c,16,16,52,44,P.soft,P.line,null,2);
    txt(c,'‹',42,38,24,P.ink,'center',700);txt(c,title,82,36,23,P.ink,'left',800);txt(c,subtitle,82,66,12,P.muted,'left',600);
  };

  Game.prototype.leaderboard=function(){
    this.ensureProfile();var g=this,c=this.c,scores=this.leaderboardScores(),view=u.geometry.leaderboardViewport;
    var tab=g.leaderboardTab,cloud=g.cloudRanks&&g.cloudRanks[tab],loading=g.rankRequests&&g.rankRequests[tab];
    var rank=g.rankInfo&&g.rankInfo[tab],auth=g.p.auth,canLogin=auth&&auth.enabled&&!g.cloudOnline;
    surface(g,'防守战绩','每位玩家每个周期保留一条最高战绩',function(){g.screen='home';});
    [['周榜','week'],['月榜','month'],['总榜','all']].forEach(function(v,i){
      button(g,{x:24+i*114,y:108,w:106,h:46},v[0],function(){g.leaderboardTab=v[1];g.leaderboardScroll=0;g.refreshLeaderboard();},g.leaderboardTab===v[1]?'primary':'quiet');
    });
    txt(c,'玩家 / 防守记录',24,183,12,P.muted,'left',600);txt(c,'最高得分',366,183,12,P.muted,'right',600);
    this.leaderboardScroll=Math.max(0,Math.min(this.leaderboardScroll||0,Math.max(0,scores.length*94-view.h)));
    c.save();c.beginPath();c.rect(view.x,view.y,view.w,view.h);c.clip();
    if(!scores.length){
      pxBox(c,24,224,342,176,P.surface,P.line,P.shadow,2);
      txt(c,loading?'正在载入战绩…':cloud?'本期暂无战绩':rank&&rank.offline?'暂时无法加载榜单':'这里等待你的第一场防守',195,294,19,P.ink,'center',800);
    }
    scores.forEach(function(v,i){
      var y=204+i*94-g.leaderboardScroll;if(y+82<204||y>670)return;
      g.paintRecord(16,y,358,82);
      txt(c,''+(v.rank||i+1),35,y+40,11,P.teal,'center',800);
      g.drawRankAvatar(v,65,y+41,17);
      txt(c,fit(c,v.nickName||g.localNickName,151,14,700),92,y+19,14,P.ink,'left',700);
      metric(c,compact(v.score),352,y+22,19,P.orange,'right',800);
      txt(c,fit(c,v.motto||(!v.playerId?g.localMotto:''),252,11,500),92,y+41,11,P.muted,'left',500);
      txt(c,fit(c,(v.zone||g.localDefenseZone)+' · 第 '+v.wave+' 波 · '+u.duration(v.duration),252,12,600),92,y+63,12,P.muted,'left',600);
    });
    c.restore();
    var subtitle=cloud?'三端共用排行榜':loading?'正在连接排行榜':'本机游客战绩';
    if(cloud&&rank&&rank.offline)subtitle='三端榜单 · 上次获取 '+new Date(rank.updatedAt).toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'});
    if(cloud&&rank&&!rank.offline&&auth&&g.cloudOnline&&rank.player===auth.state.playerId){
      if(typeof rank.ownRank==='number')subtitle='三端榜单 · 我的排名第 '+rank.ownRank+' 位';
      else if(rank.ownRank===null)subtitle='三端榜单 · 本期暂无个人战绩';
    }
    txt(c,subtitle,195,696,12,P.muted,'center',600);
    button(g,{x:24,y:720,w:canLogin?112:342,h:44},'返回防线',function(){g.screen='home';},'outline');
    if(canLogin)button(g,{x:148,y:720,w:218,h:44},g.cloudView?'重试云端同步':'登录后查看我的排名',function(){g.manageCloudLogin();},'outline',!!g.cloudRefresh);
  };

  Game.prototype.hud=function(){
    var c=this.c;txt(c,'无尽防守',18,24,13,P.ink,'left',800);
    pxBox(c,14,44,362,86,P.surface,P.line,P.shadow,2);
    txt(c,'波次',30,65,11,P.muted,'left',600);
    metric(c,String(this.wave).padStart(2,'0'),30,98,32,P.ink,'left',800);
    c.fillStyle=P.gridLine;c.fillRect(102,56,2,62);
    var alive=this.enemies.filter(function(e){return !e.dead;}).length;
    var stats=[['侵体',alive+this.spawnLeft,116,68,P.ink],['布防资金',this.energy,246,68,P.teal],['生命',this.core,116,105,P.red],['积分',compact(this.score),246,105,P.ink]];
    stats.forEach(function(v){
      txt(c,v[0],v[2],v[3],11,P.muted,'left',600);
      metric(c,String(v[1]),v[2]+112,v[3],18,v[4],'right',800);
    });
  };

  Game.prototype.bottom=function(){
    var g=this,c=this.c;c.fillStyle=P.bg;c.fillRect(0,554,390,226);
    if(this.inspectEnemy){
      var e=this.inspectEnemy,cfg=e.cfg||this.enemyConfig(e.kind);
      pxBox(c,8,564,374,56,P.surface,P.line,P.shadow,2);
      txt(c,cfg.name+' · '+cfg.trait,24,582,14,P.ink,'left',800);
      txt(c,'生命 '+Math.ceil(e.hp)+' / '+Math.ceil(e.max)+' · 抵达伤害 '+e.lifeDamage,24,604,12,P.muted,'left',600);
      pxBox(c,8,628,374,44,P.tealSoft,P.line,null,2);
      txt(c,'返回装置选择',195,650,14,P.teal,'center',700);
    }else if(this.inspect){
      var t=this.inspect,b=t.cfg.attack==='block';
      pxBox(c,8,564,374,56,P.surface,P.line,P.shadow,2);
      this.paintDevice(t.cfg,28,592,18);
      txt(c,t.cfg.name+' · Lv.'+t.level,52,581,14,P.ink,'left',800);
      txt(c,b?'阻挡改道':'伤害 '+Math.round(this.towerDamage(t.cfg,t.level))+' · 射程 '+this.towerRange(t.cfg,t.level)+' · 攻速 '+(1/t.cfg.rate).toFixed(2)+'/秒',52,604,12,P.muted,'left',600);
      if(!b)txt(c,'击杀 '+(t.kills||0),368,581,11,P.muted,'right',700);
      [[8,120,'返回',P.surface,P.ink],[135,120,b?'固定等级':'升级',b?P.soft:P.tealSoft,b?P.muted:P.teal],[262,120,'回收装置',P.orangeSoft,P.red]].forEach(function(v){
        pxBox(c,v[0],628,v[1],44,v[3],P.line,null,2);
        var price=v[0]===135&&!b?translate(g.upgradeCost(t.cfg,t.level)+' 布防资金',g.settings.language):'';
        txt(c,v[2],v[0]+v[1]/2,price?642:650,13,v[4],'center',700);
        if(price)native(c,fit(c,price,v[1]-8,10,700),v[0]+v[1]/2,660,10,v[4],'center',700);
      });
    }else deviceToolbar(g);
    [[8,50,'home','首页'],[64,50,'restart','重开'],[338,44,'','倍速']].forEach(function(v){
      pxBox(c,v[0],692,v[1],68,P.surface,P.line,P.shadow,2);
      if(v[2])icon(c,v[2],v[0]+v[1]/2,716,P.ink,16);
      else txt(c,g.speed+'×',v[0]+v[1]/2,716,15,g.speed===2?P.orange:P.ink,'center',800);
      txt(c,v[3],v[0]+v[1]/2,746,11,P.muted,'center',600);
    });
    var ready=this.wave===0||this.paused;
    pxBox(c,120,692,210,68,ready?P.teal:P.orange,P.line,P.btnShadow,2);
    txt(c,this.wave===0?'启动第一波':this.paused?'继续防守':'暂停防守',225,720,17,'#FFFFFF','center',800);
    txt(c,this.wave===0?'布防完成后开始':'暂停后可调整防线',225,745,11,'#FFFFFF','center',600);
    if(this.notices.length){
      var n=this.notices[this.notices.length-1];c.save();c.globalAlpha=Math.min(1,n.t/.3);
      pxBox(c,32,487,326,44,P.ink,P.line,null,2);
      native(c,fit(c,translate(n.text,g.settings.language),302,12,600),195,509,12,'#FFFFFF','center',600);
      c.restore();
    }
  };

  function dialog(g,title,description,left,right,extra){
    var c=g.c;c.fillStyle='rgba(20,26,20,.58)';c.fillRect(0,0,390,780);
    pxBox(c,24,286,342,234,P.surface,P.line,P.btnShadow,2);
    txt(c,title,44,334,22,P.ink,'left',800);
    txt(c,description,44,382,13,P.muted,'left',600);
    if(extra)txt(c,extra,44,412,12,P.teal,'left',600);
    pxBox(c,32,454,156,52,P.soft,P.line,null,2);
    pxBox(c,202,454,156,52,P.teal,P.line,P.btnShadow,2);
    txt(c,left,110,480,14,P.ink,'center',700);
    txt(c,right,280,480,14,'#FFFFFF','center',700);
  }
  Game.prototype.homeConfirm=function(){dialog(this,'离开当前防线？','暂停保留本局；结束会结算成绩。','暂停并返回','结束并结算');};
  Game.prototype.restartConfirm=function(){dialog(this,'重新开始挑战？','将清空本局的装置、波次和布防资金。','继续防守','确认重开','已获得的收藏和成就进度会保留。');};
  Game.prototype.recycleConfirm=function(){dialog(this,'回收这个装置？','返还累计投入的 65%。','保留装置','确认回收',this.inspect?'预计返还 '+Math.floor((this.inspect.spent||this.inspect.cfg.cost)*.65)+' 布防资金':'');};

  Game.prototype.modal=function(){
    var c=this.c;c.fillStyle='rgba(20,26,20,.58)';c.fillRect(0,0,390,780);
    this.paintRecord(24,235,342,360);
    txt(c,'本次防守结束',44,276,23,P.ink,'left',800);
    txt(c,'最终得分',44,324,12,P.muted,'left',600);
    metric(c,compact(this.score),44,372,42,P.orange,'left',800);
    txt(c,'到达第 '+this.wave+' 波 · 坚守 '+u.duration(this.runSeconds),44,426,13,P.ink,'left',600);
    txt(c,'历史最佳 '+compact(this.best),44,462,13,P.muted,'left',600);
    if(this.runSaveStatus)txt(c,this.runSaveStatus,44,490,12,P.muted,'left',600);
    pxBox(c,48,516,294,52,P.orange,P.line,P.btnShadow,2);
    txt(c,'返回防线',195,542,15,'#FFFFFF','center',800);
  };

  Game.prototype.tutorialChoice=function(){
    var c=this.c;c.fillStyle='rgba(20,26,20,.58)';c.fillRect(0,0,390,780);
    pxBox(c,24,246,342,258,P.surface,P.line,P.btnShadow,2);
    txt(c,'先布防，再开战',44,289,24,P.ink,'left',800);
    txt(c,'用三个实际操作熟悉防线。',44,329,14,P.muted,'left',600);
    pxBox(c,44,360,302,42,P.tealSoft,P.line,null,2);
    txt(c,'选择装置 → 放入空格 → 启动波次',195,381,13,P.teal,'center',700);
    pxBox(c,36,430,148,56,P.soft,P.line,null,2);
    pxBox(c,206,430,148,56,P.teal,P.line,P.btnShadow,2);
    txt(c,'直接开始',110,458,14,P.ink,'center',700);
    txt(c,'开始引导',280,458,14,'#FFFFFF','center',700);
  };

  Game.prototype.guide=function(){
    var c=this.c,step=this.tutorial,box=step===1?{x:6,y:618,w:378,h:68}:step===2?{x:16,y:142,w:358,h:406}:{x:116,y:688,w:218,h:76},y=step===1?440:566;
    c.save();c.fillStyle='rgba(20,26,20,.58)';
    c.fillRect(0,0,390,box.y);c.fillRect(0,box.y,box.x,box.h);c.fillRect(box.x+box.w,box.y,390-box.x-box.w,box.h);c.fillRect(0,box.y+box.h,390,780-box.y-box.h);
    pxBox(c,box.x,box.y,box.w,box.h,null,P.orange,null,2);
    c.restore();
    pxBox(c,24,y,342,85,P.surface,P.line,P.btnShadow,2);
    txt(c,'步骤 '+step+' / 3',42,y+25,12,P.teal,'left',700);
    txt(c,['','选择一种装置','点击空格部署','启动第一波'][step],42,y+55,18,P.ink,'left',800);
    pxBox(c,316,82,58,44,P.surface,P.line,null,2);
    txt(c,'跳过',345,104,13,P.ink,'center',700);
  };

  Game.prototype.sidebarGuide=function(){
    var c=this.c;c.fillStyle='rgba(20,26,20,.58)';c.fillRect(0,0,390,780);
    pxBox(c,24,154,342,438,P.surface,P.line,P.btnShadow,2);
    txt(c,'侧栏补给',44,192,23,P.ink,'left',800);
    pxBox(c,328,162,28,28,P.soft,P.line,null,2);
    txt(c,'×',342,176,18,P.ink,'center',700);
    txt(c,'每天完成复访，可领取 80 布防资金。',44,234,13,P.muted,'left',600);
    ['返回抖音首页','在首页侧边栏找到本游戏','点击游戏图标，再次进入领取'].forEach(function(s,i){
      var sy=284+i*68;
      pxBox(c,44,sy-16,32,32,i===2?P.orangeSoft:P.tealSoft,P.line,null,2);
      txt(c,String(i+1),60,sy,15,i===2?P.orange:P.teal,'center',800);
      txt(c,s,90,sy,14,P.ink,'left',700);
    });
    pxBox(c,48,514,294,52,P.teal,P.line,P.btnShadow,2);
    txt(c,'前往抖音首页侧边栏',195,540,14,'#FFFFFF','center',700);
  };

  function settingRows(g){
    return g.settingsTab==='audio'?[
      ['背景音乐','music','toggle'],['音乐音量','volume','slider'],['后台继续播放','musicInBackground','toggle'],['操作音效','sfx','toggle'],['音效音量','sfxVolume','slider']
    ]:g.settingsTab==='battle'?[
      ['后台自动暂停','autoPause','toggle'],['震动反馈','haptics','toggle'],['受击震屏','screenShake','toggle'],['记住战斗倍速','rememberSpeed','toggle'],['回收前确认','recycleConfirm','toggle'],['重新查看引导','tutorial','link']
    ]:g.settingsTab==='display'?[
      ['伤害数字','damageNumbers','toggle'],['生命条','healthBars','choice',[['始终','always'],['受伤','damaged'],['关闭','off']]],['攻击范围','rangeMode','choice',[['选中','selected'],['始终','always'],['关闭','off']]],['特效强度','effects','choice',[['完整','full'],['精简','reduced'],['关闭','off']]],['减少动态','reduceMotion','toggle'],['高对比度','highContrast','toggle']
    ]:[['语言','language','choice',[['简体','zh-Hans'],['繁體','zh-Hant'],['English','en']]],['帧率','fpsMode','choice',[['30 帧',30],['60 帧',60]]],['数字格式','numberFormat','choice',[['缩写','short'],['完整','full']]],['玩法说明','help','link'],['游戏版本','version','text']];
  }

  Game.prototype.settingsPage=function(){
    var g=this,c=this.c;surface(g,'游戏设置','按你的习惯调整防守体验',null);
    [['音频','audio'],['战斗','battle'],['显示','display'],['系统','system']].forEach(function(v,i){
      button(g,{x:24+i*87,y:103,w:81,h:44},v[0],function(){g.settingsTab=v[1];},g.settingsTab===v[1]?'primary':'quiet');
    });
    settingRows(g).forEach(function(v,i){
      var y=166+i*84,r={x:24,y:y,w:342,h:76};
      pxBox(c,24,y+2,342,72,P.surface,P.line,P.shadow,2);
      txt(c,v[0],40,v[2]==='slider'||v[2]==='choice'?y+21:y+38,14,P.ink,'left',700);
      if(v[2]==='toggle'){
        var on=g.settings[v[1]];
        pxBox(c,296,y+23,54,30,on?P.teal:P.soft,P.line,null,0);
        pxBox(c,on?324:300,y+27,22,22,'#FFFFFF',P.line,null,0);
        action(g,r,function(){g.settings[v[1]]=!g.settings[v[1]];g.saveSettings();});
      }else if(v[2]==='slider'){
        var value=g.settings[v[1]],track={x:28,y:y+33,w:334,h:44};
        metric(c,Math.round(value*100)+'%',350,y+21,12,P.teal,'right',800);
        pxBox(c,40,y+47,310,12,P.soft,P.line,null,0);
        c.fillStyle=P.teal;c.fillRect(42,y+49,Math.max(2,Math.round(306*value)),8);
        pxBox(c,40+306*value-7,y+41,14,24,P.orange,P.line,null,0);
        g.designActions.push({r:track,slider:v[1]});
      }else if(v[2]==='choice'){
        var w=222/v[3].length;
        v[3].forEach(function(o,j){
          button(g,{x:134+j*w,y:y+24,w:w-4,h:44},o[0],function(){g.settings[v[1]]=o[1];g.saveSettings();},g.settings[v[1]]===o[1]?'primary':'quiet');
        });
      }else if(v[2]==='link'){
        txt(c,'›',348,y+38,22,P.teal,'center',700);
        action(g,r,function(){if(v[1]==='help')g.screen='howto';else g.designTutorialConfirm=true;});
      }else{
        metric(c,'v'+CFG.version,350,y+38,14,P.muted,'right',700);
      }
    });
    button(g,{x:24,y:716,w:342,h:48},'返回我的',function(){g.screen='account';},'outline');
    if(g.designTutorialConfirm){
      g.designActions=[];dialog(g,'重新体验引导？','会重新开始本局，已获得收藏保留。','取消','开始引导');
      action(g,{x:32,y:454,w:156,h:52},function(){g.designTutorialConfirm=false;});
      action(g,{x:202,y:454,w:156,h:52},function(){g.designTutorialConfirm=false;g.reset();g.screen='game';g.startTutorial();});
    }
  };

  Game.prototype.howToPlayPage=function(){
    var g=this,c=this.c;surface(g,'玩法说明','点开问题，查看对应操作',function(){g.screen='settings';});
    var y=112;
    this.howToItems().forEach(function(v,i){
      var open=g.howtoOpen===i,h=open?122:62;
      pxBox(c,24,y,342,h,open?P.tealSoft:P.surface,P.line,P.shadow,2);
      txt(c,v.q,40,y+29,13,P.ink,'left',700);
      txt(c,open?'−':'+',346,y+29,19,P.teal,'center',800);
      action(g,{x:16,y:y,w:358,h:56},function(){g.howtoOpen=open?-1:i;});
      if(open){
        c.fillStyle=P.gridLine;c.fillRect(40,y+54,310,2);
        v.a.forEach(function(s,j){txt(c,s,40,y+74+j*22,12,P.muted,'left',600);});
      }
      y+=h+12;
    });
    button(g,{x:24,y:716,w:342,h:44},'装置图鉴',function(){g.openDeviceGuide();},'outline');
  };

  Game.prototype.openDeviceGuide=function(){
    this.deviceGuideReturn=this.screen;
    this.deviceGuideIndex=Math.max(0,CFG.towers.findIndex(function(cfg){return cfg.id===this.selected;},this));
    this.screen='device-guide';
    this.designGesture=null;
  };

  Game.prototype.deviceGuidePage=function(){
    var g=this,c=this.c,index=this.deviceGuideIndex,cfg=CFG.towers[index],block=cfg.attack==='block';
    function back(){g.screen=g.deviceGuideReturn;g.deviceGuideReturn=null;}
    surface(g,'装置图鉴','',back);
    pxBox(c,24,90,342,174,P.surface,P.line,P.shadow,2);
    button(g,{x:38,y:141,w:48,h:48},'‹',function(){g.deviceGuideIndex--;},'quiet',index===0);
    button(g,{x:304,y:141,w:48,h:48},'›',function(){g.deviceGuideIndex++;},'quiet',index===CFG.towers.length-1);
    g.paintDevice(cfg,195,148,48);
    txt(c,cfg.name,195,199,21,P.ink,'center',800);
    txt(c,cfg.hint,195,228,13,P.muted,'center',650);
    metric(c,(index+1)+' / '+CFG.towers.length,195,284,12,P.teal,'center',750);

    var stats=[['放置费用',cfg.cost+' 布防资金']];
    if(!block)stats.push(['伤害',Math.round(g.towerDamage(cfg,1))],['射程',g.towerRange(cfg,1)],['攻速',(1/cfg.rate).toFixed(2)+'/秒']);
    if(cfg.splash)stats.push(['爆炸半径',cfg.splash]);
    if(cfg.slow)stats.push(['减速',Math.round((1-cfg.slow)*100)+'% · '+cfg.slowDuration+' 秒']);
    txt(c,block?'基础属性':'Lv.1 '+translate('基础属性',g.settings.language),24,324,14,P.ink,'left',800);
    pxBox(c,24,344,342,stats.length*38+4,P.surface,P.line,P.shadow,2);
    stats.forEach(function(v,i){
      var y=365+i*38;
      if(i)rule(c,y-19,38,314);
      txt(c,v[0],42,y,13,P.muted,'left',700);
      txt(c,v[1],348,y,14,P.ink,'right',800);
    });
    var y=362+stats.length*38;
    txt(c,block?'固定等级':'升级成长',24,y,14,P.ink,'left',800);
    if(block){
      txt(c,'阻挡改道',24,y+28,13,P.muted,'left',650);
    }else{
      var p=CFG.progression;
      txt(c,'升至 Lv.2 · '+g.upgradeCost(cfg,1)+' 布防资金',24,y+25,13,P.muted,'left',650);
      txt(c,'每级伤害 ×'+p.damageGrowth,24,y+47,13,P.muted,'left',650);
      txt(c,'每级射程 +'+Number((p.rangeGrowth*100).toFixed(2))+'% · 上限 +'+Number((p.rangeMaxBonus*100).toFixed(2))+'%',24,y+69,13,P.muted,'left',650);
    }
    button(g,{x:24,y:716,w:342,h:44},g.deviceGuideReturn==='game'?'返回战斗':'返回玩法说明',back,'outline');
  };

  Game.prototype.loading=function(){
    var c=this.c,s=this.startup||{complete:0,total:4,items:[]},p=Math.min(1,s.complete/Math.max(1,s.total));
    c.fillStyle=P.bg;c.fillRect(0,0,390,780);
    native(c,'别让它进来',24,148,36,P.ink,'left',800);
    native(c,'摆路障 · 改路线 · 守住终点',24,192,14,P.muted,'left',600);
    pxBox(c,24,250,342,276,P.surface,P.line,P.shadow,2);
    native(c,s.failed?'检查未通过':'准备进入防线',42,284,17,P.ink,'left',800);
    pxBox(c,42,312,306,16,P.soft,P.line,null,0);
    if(p>0){c.fillStyle=s.failed?P.red:P.teal;c.fillRect(44,314,Math.round(302*p),12);}
    ['运行环境','核心配置','本地存档','必要资源'].forEach(function(label,i){
      var v=s.items[i],status=!v?'等待检查':v.ok?'已就绪':v.required?'失败':'已降级',col=v&&!v.ok?P.red:P.teal;
      var ry=362+i*38;
      c.fillStyle=col;c.fillRect(42,ry-4,8,8);
      native(c,label,58,ry,13,P.ink,'left',600);
      native(c,status,348,ry,13,col,'right',700);
    });
    if(s.failed){
      pxBox(c,44,548,302,44,P.orange,P.line,P.btnShadow,2);
      native(c,'重新执行启动检查',195,570,14,'#FFFFFF','center',700);
    }
    rule(c,620);
    native(c,'健康游戏忠告 · 适龄 8+',24,648,13,P.ink,'left',700);
    native(c,'抵制不良游戏　拒绝盗版游戏',24,681,12,P.muted,'left',500);
    native(c,'注意自我保护　谨防受骗上当',24,703,12,P.muted,'left',500);
    native(c,'适度游戏益脑　沉迷游戏伤身',24,725,12,P.muted,'left',500);
    native(c,'合理安排时间　享受健康生活',24,747,12,P.muted,'left',500);
  };

  Game.prototype.presentationTouch=function(x,y,phase){
    var g=this,managed=['home','settings','howto','leaderboard','device-guide'].indexOf(g.screen)>=0||g.screen==='account'&&!g.profileEditor||g.screen==='collection';if(!managed)return false;
    if(g.screen==='home'&&g.sidebarGuideOpen)return false;
    if(!g.designGesture&&(g.screen==='leaderboard'&&hit(u.geometry.leaderboardViewport,x,y)||g.leaderboardGesture))return false;
    if(!g.designGesture&&g.screen==='collection'&&((g.collectionTab==='collection'&&y>=358&&y<582)||(g.collectionTab==='achievements'&&y>=218&&y<668)||g.collectionGesture))return false;
    if(phase==='cancel'){g.designGesture=null;return true;}
    if(phase==='start'){g.designGesture={x:x,y:y,screen:g.screen,moved:false,target:(g.designScreen===g.screen?g.designActions||[]:[]).find(function(a){return hit(a.r,x,y);})};if(g.designGesture.target&&g.designGesture.target.slider)sliderAt(g.designGesture.target);return true;}
    function sliderAt(a){g.settings[a.slider]=Math.max(0,Math.min(1,(x-a.r.x)/a.r.w));g.saveSettings();}
    var p=g.designGesture;if(!p)return true;if((x-p.x)*(x-p.x)+(y-p.y)*(y-p.y)>100||g.screen!==p.screen)p.moved=true;
    if(p.target&&p.target.slider&&phase==='move')sliderAt(p.target);
    if(phase==='end'){g.designGesture=null;if(!p.moved&&p.target&&hit(p.target.r,x,y)&&p.target.fn){p.target.fn();g.p.playSfx('tap');g.designActions=[];}}
    return true;
  };

  Game.prototype.collectionPage=function(){
    var g=this,c=this.c,s=this.collection.state,tab=this.collectionTab;
    surface(g,tab==='collection'?'装扮收藏':tab==='signin'?'每日签到':'成就陈列',g.cloudView?(g.cloudOnline?'SuMind 云存档':'当前设备缓存'):'当前设备进度',function(){backCollection(g);});
    g.collectionHits=[];
    function b(r,label,fn,kind,disabled){button(g,r,label,fn,kind,disabled);}
    if(tab==='collection'){
      txt(c,'金币 '+s.coins,366,76,12,P.teal,'right',700);
      [['device','装置'],['frame','头像框'],['record','战绩卡'],['profile','资料']].forEach(function(v,i){
        b({x:24+i*87,y:100,w:81,h:44},v[1],function(){g.collectionCategory=v[0];g.collectionPreview=undefined;g.collectionScroll=0;g.collectionConfirm='';},g.collectionCategory===v[0]?'primary':'quiet');
      });
      var type=g.collectionCategory,device=g.collectionDevice,v=preview(g),q=Catalog.qualities[v?v.quality:0];
      pxBox(c,24,158,342,188,P.surface,P.line,P.shadow,2);
      if(type==='device'){
        var idx=CFG.towers.findIndex(function(t){return t.id===device;}),cfg=CFG.towers[idx];
        g.paintDevice(cfg,195,222,48,v);
        b({x:34,y:200,w:48,h:44},'‹',function(){g.collectionDevice=CFG.towers[(idx-1+CFG.towers.length)%CFG.towers.length].id;g.collectionPreview=undefined;g.collectionConfirm='';},'quiet');
        b({x:308,y:200,w:48,h:44},'›',function(){g.collectionDevice=CFG.towers[(idx+1)%CFG.towers.length].id;g.collectionPreview=undefined;g.collectionConfirm='';},'quiet');
        txt(c,cfg.name+' · '+cfg.hint,195,288,15,P.ink,'center',700);
      }else if(type==='frame'){
        g.drawLocalAvatar(195,228,40,g.localAvatarStyle||0);g.paintFrame(195,228,40,v);
        txt(c,g.localNickName,195,298,16,P.ink,'center',700);
      }else if(type==='record'){
        g.paintRecord(40,176,310,124,v);
        txt(c,'防守记录',58,200,12,P.muted,'left',600);
        metric(c,compact(g.best),58,242,30,P.ink,'left',800);
        txt(c,'排行 · 结算 · 个人战绩通用',58,280,12,P.muted,'left',600);
      }else{
        g.paintProfile(v,{x:32,y:166,w:326,h:144});
        pxBox(c,32,166,326,144,null,P.line,null,2);
        g.drawIdentityAvatar(77,222,25);
        txt(c,g.localNickName,120,214,18,P.ink,'left',700);
        txt(c,g.localMotto,120,246,12,P.muted,'left',600);
      }
      txt(c,q.name+' · '+(v?v.name:'防线原装'),195,326,12,q.color,'center',700);

      var items=[null].concat(g.collectionList()),max=Math.max(0,items.length*76-224);
      g.collectionScroll=Math.max(0,Math.min(max,g.collectionScroll||0));
      c.save();c.beginPath();c.rect(16,358,364,224);c.clip();
      items.forEach(function(item,i){
        var y=358+i*76-g.collectionScroll,owned=!item||s.owned.indexOf(item.id)>=0,on=(item?item.id:'')===(v?v.id:''),quality=Catalog.qualities[item?item.quality:0];
        if(y+68<358||y>582)return;
        pxBox(c,24,y,342,66,on?P.tealSoft:P.surface,on?P.teal:P.line,P.shadow,2);
        txt(c,item?item.name:'防线原装',40,y+22,14,P.ink,'left',700);
        txt(c,quality.name,40,y+46,12,quality.color,'left',700);
        txt(c,owned?'已拥有':item.source==='shop'?item.price+' 金币':item.hint,350,y+46,12,P.muted,'right',600);
        g.collectionHits.push({r:{x:24,y:Math.max(358,y),w:342,h:Math.max(0,Math.min(582,y+68)-Math.max(358,y))},fn:function(){g.collectionPreview=item;g.collectionConfirm='';g.collectionMessage='';}});
      });
      c.restore();

      var owned=!v||s.owned.indexOf(v.id)>=0;
      if(owned)b({x:24,y:594,w:342,h:44},'加入当前搭配',function(){if(type==='device')g.collectionDraft.device[device]=v?v.id:'';else g.collectionDraft[type]=v?v.id:'';g.collectionMessage='已加入搭配，保存后生效';},'outline');
      else if(v.source==='shop')b({x:24,y:594,w:342,h:44},g.collectionConfirm===v.id?'确认兑换 · '+v.price+' 金币':s.coins<v.price?'还差 '+(v.price-s.coins)+' 金币':'兑换 · '+v.price+' 金币',function(){if(g.collectionConfirm!==v.id){g.collectionConfirm=v.id;return;}g.collectionAction('buy',v.id,'已解锁，可加入搭配');g.collectionConfirm='';},'primary',s.coins<v.price||g.collectionPending);
      else b({x:24,y:594,w:342,h:44},v.hint+' ›',function(){g.collectionReturnTab='collection';g.collectionTab=v.source==='signin'?'signin':'achievements';g.collectionScroll=0;},'outline');

      var changed=JSON.stringify(g.collectionDraft)!==JSON.stringify(s.equipped);
      b({x:24,y:650,w:112,h:44},'取消变更',function(){g.collectionDraft=Catalog.clone(s.equipped);g.collectionPreview=undefined;g.collectionMessage='';},'quiet',!changed);
      b({x:148,y:650,w:218,h:44},'保存搭配',function(){g.collectionAction('equip',g.collectionDraft,'搭配已保存');},'orange',!changed||g.collectionPending);
      nav(g,'collection');
    }else if(tab==='signin'){
      txt(c,'今天，也来守一程。',24,120,24,P.ink,'left',800);
      txt(c,'第 '+(Math.floor(s.signins/7)+1)+' 轮 · 已累计签到 '+s.signins+' 次',24,156,13,P.muted,'left',600);
      Catalog.days.forEach(function(reward,i){
        var wide=i===6,x=wide?24:24+(i%2)*177,y=wide?486:196+Math.floor(i/2)*96,w=wide?342:165,on=i===s.signins%7,done=i<s.signins%7;
        pxBox(c,x,y,w,82,on?P.tealSoft:done?P.soft:P.surface,on?P.teal:P.line,P.shadow,2);
        txt(c,'第 '+(i+1)+' 次'+(done?' · 已领':''),x+16,y+25,12,P.muted,'left',600);
        native(c,fit(c,translate(g.collection.rewardLabel(reward),g.settings.language),w-32,14,700),x+16,y+56,14,on?P.teal:P.ink,'left',700);
      });
      txt(c,'北京时间零点刷新，每天手动领取一次。',24,598,12,P.muted,'left',600);
      txt(c,'累计七次一轮，断签不会清空进度。',24,622,12,P.muted,'left',600);
      b({x:24,y:656,w:342,h:56},g.collection.canSign()?'领取今日奖励':'今日已领取',function(){g.collectionAction('sign',undefined,'今日奖励已领取');},'orange',!g.collection.canSign()||g.collectionPending);
    }else{
      txt(c,'每一次坚守，都留下印记。',24,116,21,P.ink,'left',800);
      txt(c,'已领取 '+s.claimed.length+' / '+Catalog.achievements.length+' · 展示 '+s.badges.length+' / 3',24,152,13,P.muted,'left',600);
      txt(c,'达成后手动领取，点击已领徽章切换展示。',24,184,12,P.muted,'left',600);
      g.collectionScroll=Math.max(0,Math.min(Catalog.achievements.length*128-450,g.collectionScroll||0));
      c.save();c.beginPath();c.rect(16,218,364,450);c.clip();
      Catalog.achievements.forEach(function(a,i){
        var y=218+i*128-g.collectionScroll;if(y+120<218||y>668)return;
        var ready=(s.stats[a.stat]||0)>=a.target,claimed=s.claimed.indexOf(a.id)>=0,shown=s.badges.indexOf(a.id)>=0;
        pxBox(c,24,y,342,116,P.surface,P.line,P.shadow,2);
        txt(c,a.name,40,y+23,16,P.ink,'left',800);
        txt(c,a.single?'单局挑战':'永久累计',350,y+23,11,P.muted,'right',600);
        txt(c,a.description,40,y+49,12,P.muted,'left',600);
        metric(c,Math.min(a.target,s.stats[a.stat]||0)+' / '+a.target,40,y+73,12,P.teal,'left',800);
        txt(c,claimed?'奖励已领取':g.collection.rewardLabel(a),40,y+97,11,P.muted,'left',600);
        var r={x:244,y:y+63,w:106,h:44};
        pxBox(c,r.x,r.y,r.w,r.h,claimed?(shown?P.tealSoft:P.surface):ready?P.orange:P.soft,P.line,null,2);
        txt(c,claimed?(shown?'取消展示':'展示徽章'):ready?'领取奖励':'未达成',297,y+85,12,claimed?P.teal:ready?'#FFFFFF':P.muted,'center',700);
        if((claimed||ready)&&!g.collectionPending&&r.y>=218&&r.y+r.h<=668)g.collectionHits.push({r:r,fn:function(){g.collectionAction(claimed?'badge':'claim',a.id,claimed?'展示已更新':'奖励已领取');}});
      });
      c.restore();
    }
    var message=g.collectionMessage||g.collection.error;
    if(message){
      if(tab==='collection'){c.fillStyle=P.bg;c.fillRect(24,60,232,28);txt(c,fit(c,message,232,11,700),24,76,11,P.teal,'left',700);}
      else txt(c,fit(c,message,330,11,700),195,746,11,P.teal,'center',700);
    }
  };
};

};
M["src/starport-game.js"]=function(module,exports,require){
var CFG = require('./config');
var translate = require('./i18n');
var Collection = require('./collection').Collection;
var ACTIVE_LANG = 'zh-Hans', ACTIVE_NUMBER_FORMAT = 'short';
var TAU = Math.PI*2;
var BASE_H = 780, CELL = 22, CELL_X = 25, GRID_X = 20, GRID_Y = 146, GEOM_SCALE = CELL/27;
var DEVICE_VIEW_W = 374, DEVICE_CARD_W = 144, DEVICE_CARD_GAP = 8, DEVICE_CARD_STEP = DEVICE_CARD_W+DEVICE_CARD_GAP;
var DEVICE_BAR={
  rail:{x:10,y:622,w:312,h:60},tileWidth:68,tileStep:78,
  info:{x:330,y:622,w:52,h:60},detail:{x:8,y:568,w:374,h:44},
  decrease:{x:215,y:568,w:44,h:44},increase:{x:337,y:568,w:44,h:44}
};
var DEFENSE_ZONES=CFG.defenseZones;
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function compact(v){v=Math.round(v);if(ACTIVE_NUMBER_FORMAT==='full')return''+v;if(v>=1000000000)return(v/1000000000).toFixed(v>=10000000000?0:1)+'B';if(v>=1000000)return(v/1000000).toFixed(v>=10000000?0:1)+'M';if(v>=10000)return(v/1000).toFixed(v>=100000?0:1)+'K';return''+v;}
function playerName(value){value=String(value||'').trim().slice(0,12);return value&&/^[\u3400-\u9FFFA-Za-z0-9_-]+$/.test(value)?value:null;}
function platformPlayerName(value){value=String(value||'').replace(/[\u0000-\u001F\u007F-\u009F]/g,'').trim();if(!value)return null;return Array.from(value).slice(0,12).join('');}
function profileText(value,max){value=String(value||'').replace(/[\u0000-\u001F\u007F-\u009F]/g,'').trim();return Array.from(value).slice(0,max).join('');}
function shortText(value,max){var chars=Array.from(String(value||''));return chars.length>max?chars.slice(0,Math.max(1,max-1)).join('')+'…':chars.join('');}
function fitText(c,value,maxWidth,size,weight){var chars=Array.from(String(value||'')),result=chars.join(''),suffix='…';c.font=(weight||600)+' '+size+'px system-ui,"Microsoft YaHei",sans-serif';if(c.measureText(result).width<=maxWidth)return result;while(chars.length&&c.measureText(chars.join('')+suffix).width>maxWidth)chars.pop();return chars.length?chars.join('')+suffix:suffix;}
function durationText(seconds){seconds=Math.max(0,Math.round(+seconds||0));if(!seconds)return'--:--';var minutes=Math.floor(seconds/60),secs=seconds%60;return(minutes<10?'0':'')+minutes+':'+(secs<10?'0':'')+secs;}
function todayKey(){var d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();}
function dist(a,b){var x=a.x-b.x,y=a.y-b.y;return Math.sqrt(x*x+y*y);}
function rr(c,x,y,w,h,r,fill,stroke){pxBox(c,x,y,w,h,fill,stroke,null,r>0?2:0);}
function pxBox(c,x,y,w,h,fill,border,shadow,step){
  x=Math.round(x);y=Math.round(y);w=Math.max(2,Math.round(w));h=Math.max(2,Math.round(h));
  var s=step===undefined?2:step;if(w<8||h<8)s=0;
  if(shadow){c.fillStyle=shadow;if(s>0){c.fillRect(x+3+s,y+3,w-s*2,h);c.fillRect(x+3,y+3+s,w,h-s*2);}else c.fillRect(x+3,y+3,w,h);}
  if(border&&!fill){
    c.fillStyle=border;
    if(s>0&&w>=8&&h>=8){
      c.fillRect(x+s,y,w-s*2,2);c.fillRect(x+s,y+h-2,w-s*2,2);
      c.fillRect(x,y+s,2,h-s*2);c.fillRect(x+w-2,y+s,2,h-s*2);
      c.fillRect(x+2,y+2,2,2);c.fillRect(x+w-4,y+2,2,2);c.fillRect(x+2,y+h-4,2,2);c.fillRect(x+w-4,y+h-4,2,2);
    }else{c.fillRect(x,y,w,2);c.fillRect(x,y+h-2,w,2);c.fillRect(x,y,2,h);c.fillRect(x+w-2,y,2,h);}
    return;
  }
  if(border){c.fillStyle=border;if(s>0){c.fillRect(x+s,y,w-s*2,h);c.fillRect(x,y+s,w,h-s*2);}else c.fillRect(x,y,w,h);}
  if(fill){var bw=border?2:0;c.fillStyle=fill;if(s>0&&!border){c.fillRect(x+s,y,w-s*2,h);c.fillRect(x,y+s,w,h-s*2);}else if(w>bw*2&&h>bw*2)c.fillRect(x+bw,y+bw,w-bw*2,h-bw*2);}
}
function pixelSprite(c,rows,cx,cy,unit,palette){
  var h=rows.length,w=rows[0].length,u=Math.max(1,unit),ox=Math.round(cx-w*u/2),oy=Math.round(cy-h*u/2), step=Math.max(1,Math.ceil(u));
  for(var r=0;r<h;r++)for(var k=0;k<w;k++){var ch=rows[r].charAt(k),col=palette[ch];if(col){c.fillStyle=col;c.fillRect(Math.round(ox+k*u),Math.round(oy+r*u),step,step);}}
}
var PIXEL_ICONS={
  play:['0100000','0110000','0111000','0111100','0111000','0110000','0100000'],
  pause:['0110110','0110110','0110110','0110110','0110110','0110110','0110110'],
  home:['0001000','0011100','0111110','1111111','0110110','0110110','0110110'],
  restart:['0111110','1100011','1000001','1000111','1100000','0111110','0000000'],
  speed:['1001000','1101100','1111110','1111111','1111110','1101100','1001000'],
  invader:['0011100','0111110','1101011','1111111','0101010','1000001','0000000'],
  money:['0111110','1101011','1011101','1001001','1011101','1101011','0111110'],
  life:['0110110','1111111','1111111','1111111','0111110','0011100','0001000'],
  building:['1111111','1010101','1111111','1010101','1111111','1010101','1111111'],
  spark:['0001000','0011000','0111110','0001100','0011000','0110000','0000000'],
  nova:['0010100','0111110','1110111','0111110','0011100','0110110','0000000'],
  frost:['0001000','0101010','0011100','1110111','0011100','0101010','0001000'],
  wall:['1110111','1110111','0000000','1101110','1101110','0000000','1110111'],
  image:['1111111','1000101','1010001','1111011','1111111','1111111','0000000'],
  camera:['0011100','1111111','1001001','1010101','1001001','1111111','0000000'],
  info:['0111110','1000001','1001001','1000001','1001001','1001001','0111110']
};
function text(c,s,x,y,size,color,align,weight){size=Math.max(9,size);c.font=(weight||600)+' '+size+'px system-ui,"Microsoft YaHei",sans-serif';c.fillStyle=color;c.textAlign=align||'left';c.textBaseline='middle';c.fillText(translate(s,ACTIVE_LANG),x,y);}
function nativeText(c,s,x,y,size,color,align,weight){size=Math.max(9,size);c.font=(weight||600)+' '+size+'px system-ui,"Microsoft YaHei",sans-serif';c.fillStyle=color;c.textAlign=align||'left';c.textBaseline='middle';c.fillText(String(s),x,y);}
function metric(c,s,x,y,size,color,align,weight){size=Math.max(9,size);c.font=(weight||800)+' '+size+'px Consolas,"Roboto Mono","Microsoft YaHei",monospace';c.fillStyle=color;c.textAlign=align||'right';c.textBaseline='middle';c.fillText(s,x,y);}
function icon(c,type,x,y,color,size){var rows=PIXEL_ICONS[type]||PIXEL_ICONS.building;pixelSprite(c,rows,x,y,Math.max(1.2,(size||16)/7),{'1':color});}
var routeCommandIconBase=icon;
function gear(c,x,y,color,size){pixelSprite(c,['0011100','0110110','1100011','1001001','1100011','0110110','0011100'],x,y,Math.max(1.4,(size||20)/7),{'1':color});}
function controlIcon(c,x,y,color,size){gear(c,x,y,color,size);}
function avatarGlyph(c,style,x,y,r){var avatar=CFG.avatars[clamp(style,0,7)];pixelSprite(c,avatar.pixels,x,y,Math.max(1.5,r*1.3/7),{'1':'#202620','2':avatar.color,'3':'#FFFFFF'});}
function avatarExtraGlyph(c,style,x,y,r){avatarGlyph(c,style,x,y,r);}
function weekStart(time){var d=new Date(time),day=(d.getDay()+6)%7;d.setHours(0,0,0,0);d.setDate(d.getDate()-day);return d.getTime();}
function Game(p){this.p=p;this.collection=new Collection(p);this.achievementReady=this.collection.ready();this.c=p.ctx;var saved=p.getSettings();this.settings={language:saved.language==='zh-Hant'||saved.language==='en'?saved.language:'zh-Hans',autoPause:saved.autoPause!==false,haptics:saved.haptics!==false,music:saved.music!==false,volume:isFinite(+saved.volume)?clamp(+saved.volume,0,1):.45,sfx:saved.sfx!==false,sfxVolume:isFinite(+saved.sfxVolume,0,1)?clamp(+saved.sfxVolume,0,1):.65,musicInBackground:saved.musicInBackground===true,damageNumbers:saved.damageNumbers!==false,healthBars:['always','damaged','off'].indexOf(saved.healthBars)>=0?saved.healthBars:'always',rangeMode:['selected','always','off'].indexOf(saved.rangeMode)>=0?saved.rangeMode:'selected',effects:['full','reduced','off'].indexOf(saved.effects)>=0?saved.effects:'full',screenShake:saved.screenShake!==false,rememberSpeed:saved.rememberSpeed!==false,battleSpeed:+saved.battleSpeed===2?2:1,recycleConfirm:saved.recycleConfirm!==false,reduceMotion:saved.reduceMotion===true,highContrast:saved.highContrast===true,fpsMode:+saved.fpsMode===30?30:60,numberFormat:saved.numberFormat==='full'?'full':'short',tutorialSeen:saved.tutorialSeen===true,localMotto:profileText(saved.localMotto,24),localDefenseZone:DEFENSE_ZONES.indexOf(saved.localDefenseZone)>=0?saved.localDefenseZone:'',sidebarRewardDay:String(saved.sidebarRewardDay||''),sidebarFloatX:isFinite(+saved.sidebarFloatX)?+saved.sidebarFloatX:310,sidebarFloatY:isFinite(+saved.sidebarFloatY)?+saved.sidebarFloatY:548};this.settingsTab='audio';this.leaderboardTab='week';this.howtoOpen=-1;this.p.configureAudio(this.settings);this.resizeViewport();this.reset();this.screen='loading';this.startup={items:[],complete:0,total:4,failed:false,finished:false};}
Game.prototype.resizeViewport=function(){
  var p=this.p,safeTop=p.safeTop||0,usable=(p.safeBottom||p.height)-safeTop;
  this.W=p.width;this.H=p.height;
  this.scale=Math.min(this.W/390,usable/BASE_H);
  this.ox=(this.W-390*this.scale)/2;
  this.oy=safeTop+(usable-BASE_H*this.scale)/2;
};
Game.prototype.runStartup=function(runner){
  var self=this;this.startupRunner=runner;this.screen='loading';this.startup={items:[],complete:0,total:4,failed:false,finished:false};
  runner(function(item){self.startup.items.push(item);self.startup.complete=self.startup.items.length;},function(results){results=results||self.startup.items;self.startup.finished=true;self.startup.failed=results.some(function(item){return item.required&&!item.ok;});if(!self.startup.failed){self.screen='home';self.restoreLoginReturn();}});
};
Game.prototype.reset=function(){
  if(this.collection)this.collection.flush();
  this.cachedDefenseRoute=null;this.runStats={};this.runOwner=undefined;this.runCollection=null;this.runFlawless=0;this.runCleared=0;this.runDevices={};this.runSeconds=0;
  this.runResultId=null;this.runSaveStatus='';
  ACTIVE_NUMBER_FORMAT=this.settings.numberFormat;
  this.energy=CFG.startEnergy;this.core=CFG.startCore;this.wave=0;this.score=0;this.best=this.cloudView?this.best:this.p.getBest();this.enemies=[];this.towers=[];this.shots=[];this.particles=[];this.notices=[];this.lifeFloats=[];this.damageFloats=[];this.coreHit=0;this.shake=0;this.selected=null;this.selectedLevel=1;this.placementLevels={};this.inspect=null;this.inspectEnemy=null;this.deviceScroll=0;this.deviceDrag=null;this.confirmRestart=false;this.confirmHome=false;this.confirmRecycle=false;this.running=false;this.paused=false;this.lifecyclePaused=false;this.speed=this.settings.rememberSpeed&&+this.settings.battleSpeed===2?2:1;this.spawnLeft=0;this.bossLeft=0;this.bossActive=false;this.waveCoreStart=this.core;this.spawnTimer=0;this.nextWaveTimer=0;this.over=false;this.victory=false;this.time=0;this.fps=0;this.fpsFrames=0;this.fpsElapsed=0;this.screen='home';this.tutorial=0;this.tutorialPrompt=false;
};
Game.prototype.notify=function(message,duration){var d=duration||1.4;this.notices.push({text:message,t:d,duration:d});if(this.notices.length>4)this.notices.shift();};
Game.prototype.saveSettings=function(){ACTIVE_NUMBER_FORMAT=this.settings.numberFormat;this.p.setSettings(this.settings);this.p.configureAudio(this.settings);};
Game.prototype.ensureProfile=function(){if(this.profileInitialized)return;this.profileInitialized=true;this.profile=this.p.getProfile?this.p.getProfile():null;this.avatarImage=null;this.customAvatarImage=null;var saved=this.p.getSettings?this.p.getSettings():{};this.identityMode='local';this.localNickName=playerName(saved.localNickName)||this.randomIdentityName();this.localMotto=profileText(saved.localMotto,24)||'守住每一条路线';this.localDefenseZone=DEFENSE_ZONES.indexOf(saved.localDefenseZone)>=0?saved.localDefenseZone:DEFENSE_ZONES[Math.floor(Math.random()*DEFENSE_ZONES.length)];this.localAvatarStyle=clamp(Math.round(+saved.localAvatarStyle||0),0,7);this.localAvatarUrl=String(saved.localAvatarUrl||'');this.profileStatus='玩家资料';this.persistIdentity();var self=this;if(this.profile&&this.profile.avatarUrl&&this.p.loadImage)this.p.loadImage(this.profile.avatarUrl,function(image){self.avatarImage=image;});if(this.localAvatarUrl&&this.p.loadImage)this.p.loadImage(this.localAvatarUrl,function(image){self.customAvatarImage=image;});};
Game.prototype.requestProfile=function(adopt){var self=this;this.ensureProfile();if(this.profileBusy)return;this.profileBusy=true;this.profileStatus='正在请求授权…';if(!this.p.requestUserProfile){this.profileBusy=false;this.profileStatus='仅抖音内可授权';return;}this.p.requestUserProfile(function(profile,error){self.profileBusy=false;if(profile){self.profile=profile;self.avatarImage=null;self.profileStatus='抖音已授权';if(adopt)self.usePlatformIdentity();if(profile.avatarUrl&&self.p.loadImage)self.p.loadImage(profile.avatarUrl,function(image){self.avatarImage=image;});self.p.playSfx('upgrade');self.p.vibrate();}else{self.profile=self.p.getProfile?self.p.getProfile():null;var code=error&&error.code;self.profileStatus=code==='unsupported'?'仅抖音内可授权':code==='preview_required'?'请扫码真机授权':code===10601||code===111696?'请先登录后重试':'未授权，保持游客身份';self.p.playSfx('error');}});};
Game.prototype.startTutorial=function(){this.tutorialPrompt=false;this.tutorial=1;this.selected=null;this.deviceScroll=0;this.notify('先选择一种装置',1.2);};
Game.prototype.finishTutorial=function(){this.tutorial=0;this.settings.tutorialSeen=true;this.saveSettings();this.notify('引导完成，防线交给你了',1.8);this.p.playSfx('upgrade');};
Game.prototype.restartRun=function(){this.reset();this.screen='game';this.tutorial=false;this.notify('已重新开始',1.2);this.p.vibrate();};
Game.prototype.gx=function(col){return GRID_X+(col+.5)*CELL_X;};Game.prototype.gy=function(row){return GRID_Y+(row+.5)*CELL;};
Game.prototype.blocked=function(col,row,extra){if(extra&&extra.col===col&&extra.row===row)return true;for(var i=0;i<this.towers.length;i++)if(this.towers[i].col===col&&this.towers[i].row===row)return true;return false;};
Game.prototype.findPath=function(startCol,startRow,extra){var g=CFG.grid,queue=[[startCol,startRow]],seen={},prev={},key=startCol+','+startRow;seen[key]=true;var dirs=[[1,0],[-1,0],[0,1],[0,-1]],endKey=(g.cols-1)+','+g.exitRow;while(queue.length){var cur=queue.shift(),ck=cur[0]+','+cur[1];if(ck===endKey){var cells=[];while(ck!==key){var bits=ck.split(',');cells.unshift([+bits[0],+bits[1]]);ck=prev[ck];}return cells;}for(var i=0;i<4;i++){var nc=cur[0]+dirs[i][0],nr=cur[1]+dirs[i][1],nk=nc+','+nr;if(nc<0||nc>=g.cols||nr<0||nr>=g.rows||seen[nk]||this.blocked(nc,nr,extra))continue;seen[nk]=true;prev[nk]=ck;queue.push([nc,nr]);}}return null;};
Game.prototype.routeFrom=function(col,row){var cells=this.findPath(clamp(col,0,CFG.grid.cols-1),clamp(row,0,CFG.grid.rows-1));if(!cells)return null;var self=this;return cells.map(function(q){return{x:self.gx(q[0]),y:self.gy(q[1])};});};
Game.prototype.start=function(){var self=this;this.sidebarSupported=false;this.sidebarReturned=!!(this.p.isSidebarReturn&&this.p.isSidebarReturn());this.sidebarRewardClaimed=this.settings.sidebarRewardDay===todayKey();this.sidebarGuideOpen=false;this.sidebarFloatX=clamp(this.settings.sidebarFloatX,8,318)<163?8:318;this.sidebarFloatY=clamp(this.settings.sidebarFloatY,92,610);this.sidebarFloatDrag=null;if(this.p.checkSidebar)this.p.checkSidebar(function(supported){self.sidebarSupported=!!supported;});this.p.onTouch(function(x,y,phase){self.touch((x-self.ox)/self.scale,(y-self.oy)/self.scale,phase||'start');});if(this.p.onResize)this.p.onResize(function(){self.touch(0,0,'cancel');self.resizeViewport();self.draw();});this.p.onHide(function(){self.handleHide();});this.p.onShow(function(options){self.handleShow(options);});var last=Date.now();function loop(){var now=Date.now(),elapsed=(now-last)/1000;if(self.settings.fpsMode===30&&elapsed<.03){self.p.raf(loop);return;}var dt=Math.min(.04,elapsed);last=now;self.fpsFrames++;self.fpsElapsed+=dt;if(self.fpsElapsed>=.5){self.fps=Math.round(self.fpsFrames/self.fpsElapsed);self.fpsFrames=0;self.fpsElapsed=0;}self.update(dt);self.draw();self.p.raf(loop);}loop();};
Game.prototype.handleHide=function(){this.collection.flush();if(this.settings.autoPause&&this.screen==='game'&&!this.over&&this.wave>0&&!this.paused){this.paused=true;this.lifecyclePaused=true;}};
Game.prototype.handleShow=function(options){if(this.settings.sidebarRewardDay!==todayKey())this.sidebarRewardClaimed=false;if(options&&options.launch_from==='homepage'&&options.location==='sidebar_card'){this.sidebarReturned=true;this.notify('已从侧边栏返回',1.5);}if(!this.lifecyclePaused)return;this.lifecyclePaused=false;this.notify('已暂停，可继续防守',1.5);};
Game.prototype.claimSidebarReward=function(){if(!this.sidebarReturned||this.sidebarRewardClaimed)return;this.sidebarRewardClaimed=true;this.settings.sidebarRewardDay=todayKey();this.energy+=80;this.saveSettings();this.p.playSfx('upgrade');this.p.vibrate();this.notify('侧栏补给已领取  +80 布防资金',1.8);};
var previousPresentation_sidebarGuide=function(){var c=this.c;c.save();c.fillStyle='rgba(18,41,36,.48)';c.fillRect(0,0,390,780);rr(c,24,154,342,438,24,'#FFFEFB','#B8D0C8');text(c,'侧栏补给',48,190,22,UI.ink,'left',900);text(c,'每天从抖音首页侧边栏返回即可领取',48,218,9,UI.muted,'left',750);rr(c,272,176,66,32,13,'#FFF2E7','#F0C39C');icon(c,'money',289,192,UI.orange,10);text(c,'+80',326,192,12,UI.orange,'right',900);text(c,'×',338,176,20,UI.muted,'center',700);var steps=[['1','返回抖音首页','离开小游戏，回到抖音首页'],['2','打开首页侧边栏','在首页侧边栏找到《别让它进来》'],['3','点击游戏图标返回','返回游戏后即可领取今日补给']];for(var i=0;i<steps.length;i++){var y=268+i*78;rr(c,48,y-20,34,34,11,i===2?'#FFF2E7':UI.tealSoft,null);text(c,steps[i][0],65,y-3,13,i===2?UI.orange:UI.teal,'center',900);text(c,steps[i][1],98,y-10,12,UI.ink,'left',900);text(c,steps[i][2],98,y+12,8,UI.muted,'left',750);}rr(c,48,514,294,52,16,UI.teal,'#176D5C');text(c,'前往抖音首页侧边栏',195,540,14,'#FFFFFF','center',900);c.restore();};
Game.prototype.startWave=function(){if(this.running||this.over)return;this.markRunOwner();var waves=CFG.waves||{};this.nextWaveTimer=0;this.wave++;this.spawnLeft=Math.min(waves.maxCount||42,(waves.baseCount||6)+Math.floor(this.wave*(waves.countGrowth||1.55)));this.bossLeft=this.wave%(waves.bossEvery||10)===0?1:0;this.bossActive=this.bossLeft>0;this.waveCoreStart=this.core;this.spawnTimer=.15;this.running=true;this.notify(this.bossActive?'第 '+this.wave+' 波 · 核心侵体来袭':'第 '+this.wave+' 波来袭',this.bossActive?2:1.5);this.p.vibrate();};
Game.prototype.enemyConfig=function(id){for(var i=0;i<CFG.enemies.length;i++)if(CFG.enemies[i].id===id)return CFG.enemies[i];return CFG.enemies[0];};
Game.prototype.pickEnemyConfig=function(w){var pool=[],total=0;for(var i=0;i<CFG.enemies.length;i++){var cfg=CFG.enemies[i];if(cfg.boss||w<cfg.unlockWave)continue;var weight=Math.min(cfg.maxWeight,cfg.weight+Math.max(0,w-cfg.unlockWave)*cfg.weightGrowth);total+=weight;pool.push({cfg:cfg,end:total});}var roll=Math.random()*total;for(i=0;i<pool.length;i++)if(roll<=pool[i].end)return pool[i].cfg;return CFG.enemies[0];};
Game.prototype.spawn=function(){var w=this.wave,g=CFG.grid,waves=CFG.waves||{},cfg;if(this.bossLeft>0&&this.spawnLeft===1){cfg=this.enemyConfig('warden');this.bossLeft--;}else cfg=this.pickEnemyConfig(w);var base=(waves.hpBase||50)+w*(waves.hpPerWave||18),bossIndex=cfg.boss?Math.max(1,Math.floor(w/(waves.bossEvery||10))):0,bossScale=cfg.boss?Math.min(1,(waves.bossStartScale||.7)+Math.max(0,bossIndex-1)*(waves.bossScaleStep||.075)):1,hp=base*Math.pow(waves.hpGrowth||1.012,Math.max(0,w-1))*cfg.hpScale*bossScale,route=this.routeFrom(0,g.entryRow),speedSteps=Math.min(Math.max(0,w-1),waves.speedGrowthWaves||32);this.enemies.push({x:this.gx(0),y:this.gy(g.entryRow),route:route,routeIndex:0,hp:hp,max:hp,speed:(cfg.speed+speedSteps*(waves.speedPerWave||1.25))*GEOM_SCALE,kind:cfg.id,cfg:cfg,lifeDamage:cfg.lifeDamage,slow:0,slowFactor:1,dead:false});};
Game.prototype.loseLife=function(e){if(e.dead)return;e.dead=true;if(this.inspectEnemy===e)this.inspectEnemy=null;if(this.core<=0)return;var damage=Math.max(1,e.lifeDamage||1),actual=Math.min(this.core,damage),g=CFG.grid;this.core-=actual;this.coreHit=.5;if(this.settings.screenShake&&!this.settings.reduceMotion)this.shake=.32;this.lifeFloats.push({x:this.gx(g.cols-1),y:this.gy(g.exitRow)-8,t:.8,maxT:.8,damage:actual});this.p.vibrate();if(this.core<=0)this.finish(false);};
Game.prototype.update=function(dt){this.time+=dt;if(this.screen==='loading')return;var ready=this.collection.ready();if(ready>this.achievementReady&&this.screen==='game')this.notify('新成就已达成，可前往成就页领奖',2);this.achievementReady=ready;if(this.shake>0)this.shake=Math.max(0,this.shake-dt);for(var n=this.notices.length-1;n>=0;n--){this.notices[n].t-=dt;if(this.notices[n].t<=0)this.notices.splice(n,1);}for(var df=this.damageFloats.length-1;df>=0;df--){this.damageFloats[df].t-=dt;if(this.damageFloats[df].t<=0)this.damageFloats.splice(df,1);}if(this.paused||this.over||this.confirmRestart||this.confirmHome||this.confirmRecycle)return;if(this.screen!=='game')return;if(this.wave>0)this.runSeconds+=dt;dt*=this.speed;for(var si=this.shots.length-1;si>=0;si--){this.shots[si].t-=dt;if(this.shots[si].t<=0)this.shots.splice(si,1);}
  if(!this.running&&this.wave>0&&this.nextWaveTimer>0){this.nextWaveTimer-=dt;if(this.nextWaveTimer<=0)this.startWave();}
  if(this.running&&this.spawnLeft>0){this.spawnTimer-=dt;if(this.spawnTimer<=0){this.spawn();this.spawnLeft--;this.spawnTimer=Math.max(.42,1.02-this.wave*.035);}}
  if(this.coreHit>0)this.coreHit=Math.max(0,this.coreHit-dt);for(var lf=this.lifeFloats.length-1;lf>=0;lf--){this.lifeFloats[lf].t-=dt;if(this.lifeFloats[lf].t<=0)this.lifeFloats.splice(lf,1);}for(var i=this.enemies.length-1;i>=0;i--){var e=this.enemies[i];if(e.dead){if(this.inspectEnemy===e)this.inspectEnemy=null;this.enemies.splice(i,1);continue;}if(e.slow>0)e.slow-=dt;else e.slowFactor=1;var target=e.route[e.routeIndex];if(!target){this.loseLife(e);continue;}var dx=target.x-e.x,dy=target.y-e.y,d=Math.sqrt(dx*dx+dy*dy),move=e.speed*(e.slow>0?e.slowFactor||1:1)*dt;if(move>=d){e.x=target.x;e.y=target.y;e.routeIndex++;if(e.routeIndex>=e.route.length)this.loseLife(e);}else{e.x+=dx/d*move;e.y+=dy/d*move;}}
  if(this.over)return;
  for(var j=0;j<this.towers.length;j++){var t=this.towers[j];if(t.cfg.attack==='block')continue;t.cool-=dt;if(t.cool<=0){var target=this.pickTarget(t);if(target){t.cool=t.cfg.rate;this.fire(t,target);}}}
  for(var k=this.particles.length-1;k>=0;k--){var q=this.particles[k];q.t-=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;if(q.t<=0)this.particles.splice(k,1);}
  if(this.running&&this.spawnLeft===0&&this.enemies.length===0){this.running=false;this.bossActive=false;var waves=CFG.waves||{},scoreCfg=CFG.scoring||{},bonus=(waves.clearBase||36)+this.wave*(waves.clearPerWave||7),flawless=this.core===this.waveCoreStart,flawlessFunds=flawless?(waves.flawlessBase||14)+this.wave*(waves.flawlessPerWave||2):0;this.energy+=bonus+flawlessFunds;this.score+=this.wave*(scoreCfg.clearPerWave||80)+(flawless?this.wave*(scoreCfg.flawlessPerWave||60):0);this.nextWaveTimer=waves.nextWaveDelay||4.5;this.runCleared=this.wave;this.recordRunStat('bestClear',this.wave,true);if(flawless)this.runFlawless++;this.recordRunStat('bestFlawless',this.runFlawless,true);this.collection.flush();this.notify((flawless?'无损清场':'清场完成')+'  +'+(bonus+flawlessFunds)+' 布防资金',1.8);}
};
Game.prototype.pickTarget=function(t){var best=null,prog=-Infinity,range=this.towerRange(t.cfg,t.level)*GEOM_SCALE;for(var i=0;i<this.enemies.length;i++){var e=this.enemies[i],next=e.route&&e.route[e.routeIndex],remaining=next?dist(e,next):0,p=e.routeIndex-remaining/Math.max(CELL_X,CELL);if(!e.dead&&dist(t,e)<=range&&p>prog){best=e;prog=p;}}return best;};
Game.prototype.fire=function(t,e){var cfg=t.cfg,damage=this.towerDamage(cfg,t.level),kind=cfg.attack||'beam',duration=kind==='blast'?.34:kind==='slow'?.28:.13;if(this.settings.effects!=='off')this.shots.push({kind:kind,x1:t.x,y1:t.y,x2:e.x,y2:e.y,color:cfg.color,r:(cfg.splash||30)*GEOM_SCALE,t:duration,maxT:duration});var victims=[e];if(cfg.splash)victims=this.enemies.filter(function(v){return!v.dead&&dist(v,e)<cfg.splash*GEOM_SCALE;});for(var i=0;i<victims.length;i++){var v=victims[i],hitDamage=v===e?damage:damage*(cfg.splashFalloff||1),dealt=Math.min(v.hp,hitDamage);v.hp-=hitDamage;t.damageDone=(t.damageDone||0)+dealt;if(this.settings.damageNumbers)this.damageFloats.push({x:v.x,y:v.y-8,t:.55,maxT:.55,damage:Math.max(1,Math.round(dealt)),color:cfg.color});if(cfg.slow){var slowFactor=Math.max(.42,cfg.slow-.025*Math.max(0,t.level-1)),resist=(v.cfg&&v.cfg.slowResistance)||0;v.slowFactor=1-(1-slowFactor)*(1-resist);v.slow=Math.max(v.slow,(cfg.slowDuration||1.1)*(1+.08*Math.max(0,t.level-1)));}if(v.hp<=0&&!v.dead){v.dead=true;if(this.inspectEnemy===v)this.inspectEnemy=null;t.kills=(t.kills||0)+1;this.recordRunStat('kills',1);if(v.cfg&&v.cfg.boss)this.recordRunStat('bosses',1);var enemyCfg=v.cfg||this.enemyConfig(v.kind),reward=Math.round(enemyCfg.reward*(1+Math.max(0,this.wave-1)*(enemyCfg.rewardGrowth||0))),scoreCfg=CFG.scoring||{},killScore=Math.round((enemyCfg.score||20)*(1+Math.max(0,this.wave-1)*(scoreCfg.waveGrowth||.1)));this.energy+=reward;this.score+=killScore;if(enemyCfg.boss){this.notify('核心侵体已消除  +'+reward+' 布防资金',2);this.p.vibrate();}this.burst(v.x,v.y,cfg.color);}}};
Game.prototype.burst=function(x,y,color){var count=this.settings.effects==='full'?7:this.settings.effects==='reduced'?3:0;for(var i=0;i<count;i++){var a=Math.random()*TAU;this.particles.push({x:x,y:y,vx:Math.cos(a)*40,vy:Math.sin(a)*40,t:.45,color:color});}};
Game.prototype.finish=function(win){
  if(this.over)return;this.over=true;this.victory=win;this.running=false;
  if(this.runCleared>0)this.recordRunStat('runs',1);
  (this.runCollection||this.collection).flush();this.ensureProfile();
  var scoreCfg=CFG.scoring||{};
  this.score+=Math.round(this.core*(scoreCfg.coreEnd||150)+this.energy*(scoreCfg.energyEnd||.25));
  this.energy=0;
  if(this.wave>0){
    this.markRunOwner();
    this.submitRun({score:this.score,wave:this.wave,time:Date.now(),duration:this.runSeconds,clearedWave:this.runCleared,
      nickName:this.localNickName,motto:this.localMotto,zone:this.localDefenseZone,avatarUrl:this.localAvatarUrl,avatarStyle:this.localAvatarStyle});
  }else if(!this.cloudView&&this.score>this.best){this.best=this.score;this.runSaveStatus=this.p.setBest(this.best)===false?'本机存档写入失败':'最高分已保存到本机';}
};
Game.prototype.leaderboardScores=function(){if(this.cloudRanks&&this.cloudRanks[this.leaderboardTab])return this.cloudRanks[this.leaderboardTab];var list=this.p.getScores?this.p.getScores():[],now=Date.now(),from=0,to=Infinity,date=new Date(now);if(this.leaderboardTab==='week'){from=weekStart(now);to=from+7*86400000;}else if(this.leaderboardTab==='month'){from=new Date(date.getFullYear(),date.getMonth(),1).getTime();to=new Date(date.getFullYear(),date.getMonth()+1,1).getTime();}list=list.filter(function(v){return v&&+v.time>=from&&+v.time<to;}).sort(function(a,b){var ad=+a.duration>0?+a.duration:Infinity,bd=+b.duration>0?+b.duration:Infinity;return(+b.score||0)-(+a.score||0)||(+b.wave||0)-(+a.wave||0)||ad-bd||(+a.time||0)-(+b.time||0);});return list.length?[list[0]]:[];};
Game.prototype.cellAt=function(x,y){var col=Math.floor((x-GRID_X)/CELL_X),row=Math.floor((y-GRID_Y)/CELL);return col>=0&&col<CFG.grid.cols&&row>=0&&row<CFG.grid.rows?{col:col,row:row,x:this.gx(col),y:this.gy(row)}:null;};
var combatTouch=function(x,y){if(this.screen==='home'){if(y>568&&y<636){this.screen='game';this.tutorial=false;if(this.wave>0)this.notify('战术暂停',1.2);this.p.vibrate();}return;}if(this.over){if(x>=48&&x<342&&y>=516&&y<568){this.reset();}return;}if(this.tutorial){this.tutorial=false;return;}if(this.confirmRecycle){if(y>=454&&y<506&&x>=32&&x<188){this.confirmRecycle=false;return;}if(y>=454&&y<506&&x>=202&&x<358){this.recycleInspected();return;}if(x<24||x>=366||y<286||y>=520)this.confirmRecycle=false;return;}if(this.confirmRestart){if(y>=454&&y<506&&x>=32&&x<188){this.confirmRestart=false;return;}if(y>=454&&y<506&&x>=202&&x<358){this.restartRun();return;}if(x<24||x>=366||y<286||y>=520)this.confirmRestart=false;return;}if(this.confirmHome){if(y>=454&&y<506&&x>=32&&x<188){this.confirmHome=false;this.paused=true;this.screen='home';return;}if(y>=454&&y<506&&x>=202&&x<358){this.finish(false);this.reset();return;}if(x<24||x>=366||y<286||y>=520)this.confirmHome=false;return;}if(y>=692&&y<760){if(x>=8&&x<58){this.confirmHome=true;}else if(x>=64&&x<114){this.confirmRestart=true;}else if(x>=120&&x<330){if(this.wave===0&&!this.running)this.startWave();else{this.paused=!this.paused;this.notify(this.paused?'挑战已停止':'继续挑战',1);}}else if(x>=338&&x<382){this.speed=this.speed===1?2:1;if(this.settings.rememberSpeed){this.settings.battleSpeed=this.speed;this.saveSettings();}this.notify('战斗速度 '+this.speed+'×',.9);}return;}
  if(this.inspectEnemy&&x>=8&&x<382&&y>=628&&y<672){this.inspectEnemy=null;return;}
  if(this.inspect&&y>=628&&y<672){if(x>=8&&x<128){this.inspect=null;}else if(x>=135&&x<255){if(this.inspect.cfg.attack==='block'){this.notify('路障无需升级',1);return;}var cost=this.upgradeCost(this.inspect.cfg,this.inspect.level);if(this.energy>=cost){this.energy-=cost;this.inspect.spent=(this.inspect.spent||this.inspect.cfg.cost)+cost;this.inspect.level++;this.recordRunStat('upgrades',1);this.collection.flush();this.p.playSfx('upgrade');this.p.vibrate();}else{this.p.playSfx('error');this.notify('布防资金不足',1);}}else if(x>=262&&x<382){if(this.settings.recycleConfirm)this.confirmRecycle=true;else this.recycleInspected();}return;}
  var hitEnemy=this.findEnemyTarget?this.findEnemyTarget(x,y):null;if(hitEnemy){this.inspectEnemy=hitEnemy;this.inspect=null;this.selected=null;return;}
  var cell=this.cellAt(x,y)||(y>=GRID_Y-10&&y<GRID_Y+CFG.grid.rows*CELL+10&&this.findBoardTarget?this.findBoardTarget(x,y):null);if(cell){for(var j=0;j<this.towers.length;j++)if(this.towers[j].col===cell.col&&this.towers[j].row===cell.row){this.inspect=this.towers[j];this.inspectEnemy=null;this.selected=null;return;}if(this.inspect||this.inspectEnemy){this.inspect=null;this.inspectEnemy=null;return;}if(!this.selected)return;var occupied=this.enemies.some(function(e){return Math.floor((e.x-GRID_X)/CELL_X)===cell.col&&Math.floor((e.y-GRID_Y)/CELL)===cell.row;});var reserved=(cell.col===0&&cell.row===CFG.grid.entryRow)||(cell.col===CFG.grid.cols-1&&cell.row===CFG.grid.exitRow);if(occupied||reserved){this.notify('这里需要保持畅通',1.2);return;}var cfg=CFG.towers.filter(function(v){return v.id===this.selected;},this)[0],placeLevel=cfg.attack==='block'?1:this.selectedLevel,placeCost=this.placementCost(cfg,placeLevel);if(this.energy<placeCost){this.p.playSfx('error');this.notify('布防资金不足',1);return;}var candidateRoute=this.findPath(0,CFG.grid.entryRow,cell);if(!candidateRoute){this.p.playSfx('error');this.notify('不能封死通道',1.3);this.p.vibrate();return;}if(cfg.attack==='block'&&candidateRoute.length>(CFG.grid.maxPathSteps||72)){this.p.playSfx('error');this.notify('路线过长，请保留更直接的通道',1.5);return;}this.energy-=placeCost;this.towers.push({col:cell.col,row:cell.row,x:cell.x,y:cell.y,cfg:cfg,cool:.2,level:placeLevel,spent:placeCost,kills:0,damageDone:0});this.runDevices[cfg.id]=true;this.recordRunStat('placed',1);if(CFG.towers.filter(function(t){return t.attack!=='block';}).every(function(t){return this.runDevices[t.id];},this))this.recordRunStat('variety',1,true);this.collection.flush();this.repathEnemies();this.p.playSfx('place');this.p.vibrate();return;}
};
Game.prototype.recycleInspected=function(){if(!this.inspect){this.confirmRecycle=false;return;}this.energy+=Math.floor((this.inspect.spent||this.inspect.cfg.cost)*.65);this.towers.splice(this.towers.indexOf(this.inspect),1);this.inspect=null;this.confirmRecycle=false;this.repathEnemies();this.p.playSfx('recycle');};
Game.prototype.touchBase=combatTouch;
Game.prototype.upgradeCost=function(cfg,level){var p=CFG.progression||{},base=p.upgradeBase||60,growth=p.upgradeGrowth||1.55;return Math.max(5,Math.round(base*Math.pow(growth,Math.max(0,level-1))/5)*5);};
Game.prototype.placementCost=function(cfg,level){var total=cfg.cost;if(cfg.attack==='block')return total;for(var lv=1;lv<Math.max(1,level);lv++)total+=this.upgradeCost(cfg,lv);return total;};
Game.prototype.towerDamage=function(cfg,level){var p=CFG.progression||{},base=p.levelOneDamage||1.45,growth=p.damageGrowth||1.22;return cfg.attack==='block'?0:cfg.damage*base*Math.pow(growth,Math.max(0,level-1));};
Game.prototype.towerRange=function(cfg,level){if(cfg.attack==='block')return 0;var p=CFG.progression||{},bonus=Math.min(p.rangeMaxBonus||.35,Math.max(0,level-1)*(p.rangeGrowth||.035));return Math.round(cfg.range*(1+bonus));};
Game.prototype.deviceScrollMax=function(){
  return Math.max(0,(CFG.towers.length-1)*DEVICE_BAR.tileStep+DEVICE_BAR.tileWidth-DEVICE_BAR.rail.w);
};
Game.prototype.deviceTileRect=function(index){
  var rail=DEVICE_BAR.rail;
  return {x:rail.x+index*DEVICE_BAR.tileStep-this.deviceScroll,y:rail.y,w:DEVICE_BAR.tileWidth,h:rail.h};
};
Game.prototype.deviceAtPoint=function(x,y){
  if(!rcHit(DEVICE_BAR.rail,x,y))return null;
  var index=Math.floor((x-DEVICE_BAR.rail.x+this.deviceScroll)/DEVICE_BAR.tileStep);
  return CFG.towers[index]&&rcHit(this.deviceTileRect(index),x,y)?CFG.towers[index]:null;
};
Game.prototype.selectedDevice=function(){
  return CFG.towers.find(function(cfg){return cfg.id===this.selected;},this);
};
Game.prototype.selectDevice=function(cfg){
  this.selected=this.selected===cfg.id?null:cfg.id;
  if(!this.selected)return;
  this.selectedLevel=cfg.attack==='block'?1:this.placementLevels[cfg.id]||1;
  this.p.playSfx('tap');
  if(this.tutorial===1){this.tutorial=2;this.notify('很好，现在部署到战场空格',1.3);}
};
Game.prototype.adjustPlacementLevel=function(cfg,delta){
  var level=this.placementLevels[cfg.id]||1,next=Math.max(1,level+delta);
  if(next===level)return;
  if(delta>0&&this.energy<this.placementCost(cfg,next)){this.notify('布防资金不足',1);return;}
  this.placementLevels[cfg.id]=next;this.selectedLevel=next;
  this.p.playSfx('tap');
};
Game.prototype.canUseDeviceBar=function(){
  return this.screen==='game'&&!this.over&&(!this.tutorial||this.tutorial===1)&&!this.tutorialPrompt&&
    !this.confirmRestart&&!this.confirmHome&&!this.confirmRecycle&&!this.inspect&&!this.inspectEnemy;
};
Game.prototype.deviceBarTouch=function(x,y,phase){
  if(this.deviceDrag){
    if(phase==='cancel'||!this.canUseDeviceBar()){this.deviceDrag=null;return true;}
    var drag=this.deviceDrag,dx=x-drag.x,dy=y-drag.y;
    if(dx*dx+dy*dy>100)drag.moved=true;
    if(drag.moved)this.deviceScroll=clamp(drag.scroll-dx,0,this.deviceScrollMax());
    if(phase==='end'){
      this.deviceDrag=null;
      var tapped=this.deviceAtPoint(x,y);
      if(!drag.moved&&tapped&&tapped===drag.device)this.selectDevice(tapped);
    }
    return true;
  }
  if(phase!=='start'||!this.canUseDeviceBar())return false;
  if(rcHit(DEVICE_BAR.rail,x,y)){
    this.deviceScroll=clamp(this.deviceScroll,0,this.deviceScrollMax());
    this.deviceDrag={x:x,y:y,scroll:this.deviceScroll,device:this.deviceAtPoint(x,y),moved:false};
    return true;
  }
  if(rcHit(DEVICE_BAR.info,x,y)){
    this.openDeviceGuide();
    this.p.playSfx('tap');
    return true;
  }
  var cfg=this.selectedDevice();
  if(!cfg||!rcHit(DEVICE_BAR.detail,x,y))return false;
  if(cfg.attack!=='block'){
    if(rcHit(DEVICE_BAR.decrease,x,y))this.adjustPlacementLevel(cfg,-1);
    if(rcHit(DEVICE_BAR.increase,x,y))this.adjustPlacementLevel(cfg,1);
  }
  return true;
};
var routedTouch=function(x,y,phase){
  phase=phase||'start';
  if(this.screen==='loading'){if(phase==='start'&&this.startup&&this.startup.failed&&this.startupRunner&&rcHit(RC2.loadingRetry,x,y))this.runStartup(this.startupRunner);return;}
  if(this.screen==='leaderboard'){if(phase!=='start')return;if(rcHit(RC2.back,x,y)){this.screen='home';this.p.vibrate();return;}if(y>=100&&y<154){var rankTab=Math.floor((x-16)/120);if(rankTab>=0&&rankTab<3){this.leaderboardTab=['week','month','all'][rankTab];this.p.playSfx('tap');}return;}return;}
  if(this.screen==='account'){if(phase!=='start')return;if(this.profileEditor){if(this.zonePickerOpen){if(x<28||x>362||y<300||y>630){this.zonePickerOpen=false;return;}for(var zi=0;zi<DEFENSE_ZONES.length;zi++){var zx=44+(zi%2)*157,zy=350+Math.floor(zi/2)*56;if(x>=zx&&x<zx+145&&y>=zy&&y<zy+48){this.localDefenseZone=DEFENSE_ZONES[zi];this.persistIdentity();this.zonePickerOpen=false;this.p.playSfx('tap');this.p.vibrate();return;}}this.zonePickerOpen=false;return;}if(y>=16&&y<68||y>=704&&y<760){this.profileEditor=false;this.zonePickerOpen=false;this.p.vibrate();return;}if(x>=300&&x<374&&y>=362&&y<414){this.editPlayerAvatar();return;}if(y>=424&&y<492){for(var modalAvatar=0;modalAvatar<4;modalAvatar++){var avatarX=16+modalAvatar*90;if(x>=avatarX&&x<avatarX+82){this.selectDefaultAvatar(modalAvatar);return;}}return;}if(y>=516&&y<568){this.editPlayerNickname();return;}if(y>=578&&y<630){this.editPlayerMotto();return;}if(y>=640&&y<692){this.zonePickerOpen=true;this.p.playSfx('tap');return;}return;}if(y>=16&&y<68||y>=704&&y<760){this.screen='home';this.p.vibrate();return;}if(x>=30&&x<146&&y>=108&&y<286||x>=232&&x<358&&y>=232&&y<278){this.profileEditor=true;this.zonePickerOpen=false;this.p.vibrate();return;}if(y>=330&&y<430){if(!this.profile){this.requestProfile();return;}this.usePlatformIdentity();return;}if(y>=430&&y<520){this.requestProfile();return;}return;}
  if(this.screen==='settings'){this.settingsTouch(x,y,phase);return;}
  if(this.screen==='howto'){if(phase!=='start')return;if(rcHit(RC2.back,x,y)||rcHit(RC2.settingsHome,x,y)){this.screen='settings';this.p.vibrate();return;}var faqY=96;for(var faqIndex=0;faqIndex<this.howToItems().length;faqIndex++){var faqHeight=64+(this.howtoOpen===faqIndex?58:0);if(y>=faqY&&y<faqY+64){this.howtoOpen=this.howtoOpen===faqIndex?-1:faqIndex;this.p.playSfx('tap');this.p.vibrate();return;}faqY+=faqHeight+10;}return;}
  if(this.screen==='home'&&phase==='start'&&x>=14&&x<190&&y>=10&&y<62){this.screen='account';this.p.vibrate();return;}
  if(this.screen==='home'&&phase==='start'&&x>=198&&x<372&&y>=372&&y<444){this.screen='leaderboard';this.p.vibrate();return;}
  if(this.screen==='home'&&phase==='start'&&y>=488&&y<556){if(x>=18&&x<86){this.screen='settings';this.p.vibrate();return;}if(x>=94&&x<372){this.screen='game';this.tutorial=false;if(this.wave>0)this.notify('战术暂停',1.2);this.p.vibrate();if(!this.settings.tutorialSeen&&this.wave===0)this.tutorialPrompt=true;return;}return;}
  if(this.tutorialPrompt){if(phase!=='start')return;if(y>=430&&y<486&&x>=36&&x<184){this.tutorialPrompt=false;this.settings.tutorialSeen=true;this.saveSettings();this.notify('可以随时在设置中重看引导',1.4);return;}if(y>=430&&y<486&&x>=206&&x<354){this.startTutorial();this.p.vibrate();return;}return;}
  if(this.tutorial&&phase==='start'&&x>=316&&x<374&&y>=82&&y<126){this.finishTutorial();return;}
  if(this.tutorial===2&&phase==='start'){if(y<GRID_Y||y>=GRID_Y+CFG.grid.rows*CELL){this.notify('请点击战场中的空格',1);return;}var before=this.towers.length,step=this.tutorial;this.tutorial=0;this.touchBase(x,y);this.tutorial=step;if(this.towers.length>before){this.tutorial=3;this.notify('部署成功，启动第一波',1.3);}return;}
  if(this.tutorial===3&&phase==='start'){if(y>=692&&y<760&&x>=120&&x<330){this.tutorial=0;this.touchBase(x,y);this.finishTutorial();}else this.notify('点击下方“启动第一波”',1);return;}
  if(this.tutorial&&this.tutorial!==1)return;
  if(this.screen==='game'&&phase==='start'&&this.wave===0&&x>=8&&x<58&&y>=692&&y<760){this.screen='home';this.p.vibrate();return;}
  if(this.deviceBarTouch(x,y,phase))return;
  if(phase!=='start')return;this.touchBase(x,y);
};
Game.prototype.repathEnemies=function(){this.cachedDefenseRoute=null;for(var i=0;i<this.enemies.length;i++){var e=this.enemies[i],col=clamp(Math.round((e.x-this.gx(0))/CELL_X),0,CFG.grid.cols-1),row=clamp(Math.round((e.y-this.gy(0))/CELL),0,CFG.grid.rows-1),route=this.routeFrom(col,row);if(route){e.route=route;e.routeIndex=0;}}};
var drawScene=function(){var c=this.c,s=this.scale;ACTIVE_LANG=this.settings.language;c.setTransform(1,0,0,1,0,0);c.fillStyle=this.screen==='home'||this.screen==='loading'||this.screen==='account'||this.screen==='leaderboard'||this.screen==='howto'?UI.bg:UI.bg;c.fillRect(0,0,this.p.canvas.width,this.p.canvas.height);c.save();var sx=this.screen==='game'&&this.shake>0?(Math.random()-.5)*5*this.shake/.32:0,sy=this.screen==='game'&&this.shake>0?(Math.random()-.5)*4*this.shake/.32:0;c.setTransform(this.p.dpr*s,0,0,this.p.dpr*s,this.p.dpr*(this.ox+sx),this.p.dpr*(this.oy+sy));this.bg();if(this.screen==='loading'){this.loading();c.restore();return;}if(this.screen==='collection'){this.collectionPage();c.restore();return;}if(this.screen==='home'){this.home();c.restore();return;}if(this.screen==='account'){this.accountPage();if(this.profileEditor)this.profileEditorModal();c.restore();return;}if(this.screen==='leaderboard'){this.leaderboard();c.restore();return;}if(this.screen==='settings'){this.settingsPage();c.restore();return;}if(this.screen==='howto'){this.howToPlayPage();c.restore();return;}if(this.screen==='device-guide'){this.deviceGuidePage();c.restore();return;}this.hud();this.board();this.bottom();if(this.tutorial)this.guide();if(this.tutorialPrompt)this.tutorialChoice();if(this.over)this.modal();if(this.confirmRestart)this.restartConfirm();if(this.confirmHome)this.homeConfirm();if(this.confirmRecycle)this.recycleConfirm();c.restore();};
Game.prototype.bg=function(){};
var settingsTouchBase=function(x,y,phase){var tab=this.settingsTab;if(tab==='audio'&&(phase==='start'||phase==='move')){if(y>=318&&y<374){this.settings.volume=clamp((x-48)/294,0,1);this.saveSettings();return;}if(y>=500&&y<556){this.settings.sfxVolume=clamp((x-48)/294,0,1);this.saveSettings();return;}}if(phase!=='start')return;if(y>=88&&y<134){var ti=Math.floor((x-16)/90);if(ti>=0&&ti<4){this.settingsTab=['audio','battle','display','system'][ti];this.p.playSfx('tap');}return;}if(y>=704&&y<760){this.screen='home';this.p.vibrate();return;}if(tab==='audio'){if(y>=170&&y<224)this.settings.music=!this.settings.music;else if(y>=230&&y<286)this.settings.musicInBackground=!this.settings.musicInBackground;else if(y>=414&&y<466)this.settings.sfx=!this.settings.sfx;else return;}else if(tab==='battle'){if(y>=168&&y<222)this.settings.autoPause=!this.settings.autoPause;else if(y>=228&&y<282)this.settings.haptics=!this.settings.haptics;else if(y>=288&&y<342)this.settings.screenShake=!this.settings.screenShake;else if(y>=348&&y<402)this.settings.rememberSpeed=!this.settings.rememberSpeed;else if(y>=446&&y<500)this.settings.recycleConfirm=!this.settings.recycleConfirm;else if(y>=556&&y<620){this.screen='game';this.tutorial=true;this.p.playSfx('tap');return;}else return;}else if(tab==='display'){if(y>=168&&y<222)this.settings.damageNumbers=!this.settings.damageNumbers;else if(y>=240&&y<294)this.settings.healthBars=['always','damaged','off'][clamp(Math.floor((x-182)/59),0,2)];else if(y>=310&&y<364)this.settings.rangeMode=['selected','always','off'][clamp(Math.floor((x-182)/59),0,2)];else if(y>=424&&y<478)this.settings.effects=['full','reduced','off'][clamp(Math.floor((x-182)/59),0,2)];else if(y>=494&&y<548)this.settings.reduceMotion=!this.settings.reduceMotion;else if(y>=554&&y<608)this.settings.highContrast=!this.settings.highContrast;else return;}else{if(y>=176&&y<234)this.settings.language=x<142?'zh-Hans':x<264?'zh-Hant':'en';else if(y>=288&&y<342)this.settings.fpsMode=x<270?30:60;else if(y>=368&&y<422)this.settings.numberFormat=x<270?'short':'full';else if(y>=556&&y<620){this.screen='howto';this.p.playSfx('tap');this.p.vibrate();return;}else return;}this.saveSettings();this.p.playSfx('tap');this.p.vibrate();};
Game.prototype.settingsTouchBase=settingsTouchBase;
Game.prototype.settingsTouch=function(x,y,phase){if(x<16||x>=374)return;if(this.settingsTab==='battle'&&phase==='start'&&y>=556&&y<620){this.reset();this.screen='game';this.startTutorial();this.p.playSfx('tap');return;}this.settingsTouchBase(x,y,phase);};
Game.prototype.toggle=function(y,on){var c=this.c;rr(c,302,y-14,56,28,14,on?'#269E84':'#DCE7E3',on?'#1F8A72':'#C1D2CC');c.fillStyle='#FFFFFF';c.beginPath();c.arc(on?344:316,y,10,0,TAU);c.fill();};
Game.prototype.settingRow=function(y,label,hint,on){var c=this.c;text(c,label,32,y-(hint?7:0),12,'#173D35','left',850);if(hint)text(c,hint,32,y+13,8,'#78918B','left',700);this.toggle(y,on);};
Game.prototype.segment=function(y,items,value){var c=this.c,x=182,w=176/items.length;for(var i=0;i<items.length;i++){var on=value===items[i][1];rr(c,x+i*w,y-22,w-4,44,10,on?'#E5F5EF':'#F6FAF8',on?'#269E84':'#DCE7E3');text(c,items[i][0],x+i*w+(w-4)/2,y,8,on?'#1F7C69':'#607E76','center',850);}};
Game.prototype.slider=function(y,value,enabled){var c=this.c,sx=48,sw=294,px=sx+sw*value;c.strokeStyle='#D4E3DE';c.lineWidth=8;c.lineCap='round';c.beginPath();c.moveTo(sx,y);c.lineTo(sx+sw,y);c.stroke();c.strokeStyle=enabled?'#269E84':'#AFC4BD';c.beginPath();c.moveTo(sx,y);c.lineTo(px,y);c.stroke();c.fillStyle='#FFFFFF';c.strokeStyle=enabled?'#1F8A72':'#8FA69E';c.lineWidth=3;c.beginPath();c.arc(px,y,10,0,TAU);c.fill();c.stroke();metric(c,Math.round(value*100)+'%',342,y-18,9,'#476B63','right',850);};
var settingsPageBaseRenderer=function(){var c=this.c;c.fillStyle='#F3F7F5';c.fillRect(0,0,390,780);text(c,'游戏设置',20,42,22,'#173D35','left',900);text(c,'分类调整辅助体验',20,65,8,'#78918B','left',750);rr(c,16,88,358,46,14,'#E6EFEB',null);var tabs=[['音频','audio'],['战斗','battle'],['显示','display'],['系统','system']],tabSize=this.settings.language==='en'?8:11;for(var i=0;i<4;i++){var x=16+i*90,on=this.settingsTab===tabs[i][1];rr(c,x+3,91,79,40,11,on?'#FFFFFF':null,on?'#B3CFC4':null);text(c,tabs[i][0],x+42.5,111,tabSize,on?'#1F7C69':'#607E76','center',850);}if(this.settingsTab==='audio')this.settingsAudio();else if(this.settingsTab==='battle')this.settingsBattle();else if(this.settingsTab==='display')this.settingsDisplay();else this.settingsSystem();rr(c,16,704,358,56,16,'#FFFFFF','#AFCFC4');text(c,'返回首页',195,732,14,'#285E55','center',900);};
Game.prototype.settingsAudio=function(){var c=this.c;text(c,'音乐',20,154,10,'#66837D','left',850);rr(c,16,166,358,214,18,'#FFFFFF','#C9DDD6');this.settingRow(196,'背景音乐','战斗中持续播放',this.settings.music);c.fillStyle='#E4EEEA';c.fillRect(32,226,326,1);this.settingRow(258,'后台音乐','切到后台后继续播放',this.settings.musicInBackground);text(c,'音乐音量',32,308,9,'#66837D','left',800);this.slider(346,this.settings.volume,this.settings.music);text(c,'音效',20,398,10,'#66837D','left',850);rr(c,16,410,358,156,18,'#FFFFFF','#C9DDD6');this.settingRow(440,'操作音效','部署、升级与按钮反馈',this.settings.sfx);text(c,'音效音量',32,490,9,'#66837D','left',800);this.slider(528,this.settings.sfxVolume,this.settings.sfx);};
Game.prototype.settingsBattle=function(){var c=this.c;text(c,'战斗行为',20,154,10,'#66837D','left',850);rr(c,16,166,358,246,18,'#FFFFFF','#C9DDD6');var rows=[['自动暂停','进入后台时暂停',194,this.settings.autoPause],['震动反馈','关键操作轻震',254,this.settings.haptics],['屏幕震动','目标受击时反馈',314,this.settings.screenShake],['记忆倍速','下局沿用当前倍速',374,this.settings.rememberSpeed]];for(var i=0;i<rows.length;i++){if(i)c.fillStyle='#E4EEEA',c.fillRect(32,rows[i][2]-30,326,1);this.settingRow(rows[i][2],rows[i][0],rows[i][1],rows[i][3]);}text(c,'操作保护',20,432,10,'#66837D','left',850);rr(c,16,444,358,176,18,'#FFFFFF','#C9DDD6');this.settingRow(472,'回收确认','防止误删长期培养装置',this.settings.recycleConfirm);c.fillStyle='#E4EEEA';c.fillRect(32,512,326,1);text(c,'新手引导',32,580,12,'#173D35','left',850);rr(c,238,556,120,48,12,'#F5F9F7','#AFCFC4');text(c,'重新查看',298,580,10,'#285E55','center',850);};
Game.prototype.settingsDisplay=function(){var c=this.c;text(c,'战场信息',20,154,10,'#66837D','left',850);rr(c,16,166,358,210,18,'#FFFFFF','#C9DDD6');this.settingRow(194,'伤害数字','显示每次命中数值',this.settings.damageNumbers);text(c,'生命条',32,267,11,'#173D35','left',850);this.segment(267,[['始终','always'],['受伤','damaged'],['关闭','off']],this.settings.healthBars);text(c,'攻击范围',32,337,11,'#173D35','left',850);this.segment(337,[['选中','selected'],['始终','always'],['关闭','off']],this.settings.rangeMode);text(c,'视觉效果',20,404,10,'#66837D','left',850);rr(c,16,416,358,202,18,'#FFFFFF','#C9DDD6');text(c,'特效强度',32,451,11,'#173D35','left',850);this.segment(451,[['完整','full'],['精简','reduced'],['关闭','off']],this.settings.effects);this.settingRow(521,'减少动态','降低旋转、呼吸与摇晃',this.settings.reduceMotion);this.settingRow(581,'高对比度','强化边框与战场网格',this.settings.highContrast);};
Game.prototype.settingsSystem=function(){var c=this.c;text(c,'语言',20,154,10,'#66837D','left',850);rr(c,16,166,358,80,18,'#FFFFFF','#C9DDD6');var langs=[['简体中文','zh-Hans'],['繁體中文','zh-Hant'],['English','en']];for(var i=0;i<3;i++){var x=24+i*118,on=this.settings.language===langs[i][1];rr(c,x,176,110,58,14,on?'#E5F5EF':'#F8FBFA',on?'#269E84':'#DCE7E3');nativeText(c,langs[i][0],x+55,205,i===2?9:10,on?'#1F7C69':'#607E76','center',850);}text(c,'性能与数字',20,270,10,'#66837D','left',850);rr(c,16,282,358,154,18,'#FFFFFF','#C9DDD6');text(c,'帧率模式',32,315,11,'#173D35','left',850);this.segment(315,[['省电 30','30'],['流畅 60','60']],''+this.settings.fpsMode);text(c,'数字格式',32,395,11,'#173D35','left',850);this.segment(395,[['缩写','short'],['完整','full']],this.settings.numberFormat);text(c,'关于',20,464,10,'#66837D','left',850);rr(c,16,476,358,64,16,'#FFFFFF','#C9DDD6');text(c,'游戏版本',32,508,11,'#66837D','left',800);metric(c,'v'+CFG.version,356,508,11,'#285E55','right',850);rr(c,16,556,358,64,16,'#FFFFFF','#AFCFC4');text(c,'玩法说明',32,582,12,'#173D35','left',850);text(c,'布防、装置、侵体与积分规则',32,603,8,'#78918B','left',700);text(c,'查看  ›',356,588,10,'#269E84','right',850);};
Game.prototype.howToItems=function(){return[{q:'怎样部署装置和改变路线？',a:['在下方选择装置，再点击战场空格部署。','路障不能封死通道，路线最长为72步。']},{q:'四种装置分别有什么作用？',a:['脉冲负责直击，星爆负责群攻，引力负责减速，','路障只改变路线，不会攻击。']},{q:'升级、射程和回收如何计算？',a:['升级提高伤害与射程；射程最多增加35%。','回收会返还该装置累计投入的65%。']},{q:'侵体和Boss会怎样变强？',a:['波次提高后数量、生命和速度逐步增长。','每10波出现核心侵体，首战后逐次增强。']},{q:'布防资金、积分和成绩怎样获得？',a:['击破、清场及无损清场会提供奖励。','主动结束或生命耗尽都会结算并保存成绩。']}];};
var previousPresentation_howToPlayPage=function(){var c=this.c,items=this.howToItems(),y=96;c.fillStyle=UI.bg;c.fillRect(0,0,390,780);this.pageHeader('玩法说明','点击问题展开答案');for(var i=0;i<items.length;i++){var open=this.howtoOpen===i,h=64+(open?58:0);rr(c,16,y,358,h,16,UI.surface,open?'#8EC6B6':UI.line);rr(c,28,y+16,32,32,10,open?UI.tealSoft:UI.soft,open?'#B7D8CD':UI.line);metric(c,''+(i+1),44,y+32,9,open?UI.teal:UI.muted,'center',900);text(c,fitText(c,translate(items[i].q,ACTIVE_LANG),260,12,850),72,y+32,12,UI.ink,'left',850);text(c,open?'⌃':'⌄',350,y+32,14,open?UI.teal:UI.muted,'center',900);if(open){c.fillStyle=UI.soft;c.fillRect(72,y+61,278,1);for(var j=0;j<items[i].a.length;j++)text(c,fitText(c,translate(items[i].a[j],ACTIVE_LANG),310,10,750),32,y+80+j*22,10,UI.muted,'left',750);}y+=h+10;}rr(c,16,704,358,56,16,UI.surface,UI.line);text(c,'返回设置',195,732,14,UI.teal,'center',900);};
var homeEnemiesLegacy=function(x0,y0,cell){var c=this.c,mid=cell/2,route=[[0,0],[2,0],[2,4],[5,4],[5,6],[9,6],[9,7],[12,7]],points=[],segments=[],total=0;for(var i=0;i<route.length;i++)points.push({x:x0+route[i][0]*cell+mid,y:y0+route[i][1]*cell+mid});for(i=0;i<points.length-1;i++){var dx=points[i+1].x-points[i].x,dy=points[i+1].y-points[i].y,len=Math.sqrt(dx*dx+dy*dy);segments.push({a:points[i],dx:dx,dy:dy,len:len});total+=len;}var colors=['#FF6F85','#FF9B6A','#A68AE8'];for(var e=0;e<3;e++){var travel=(this.time*28+e*total/3)%total,seg=segments[0];for(i=0;i<segments.length;i++){if(travel<=segments[i].len){seg=segments[i];break;}travel-=segments[i].len;}var ratio=travel/seg.len,px=seg.a.x+seg.dx*ratio,py=seg.a.y+seg.dy*ratio,angle=Math.atan2(seg.dy,seg.dx),color=colors[e];c.save();c.globalAlpha=.18;c.fillStyle=color;c.beginPath();c.arc(px-Math.cos(angle)*6,py-Math.sin(angle)*6,4,0,TAU);c.fill();c.globalAlpha=1;c.translate(px,py);c.rotate(angle+Math.PI/2);c.fillStyle='#FFFFFF';c.strokeStyle=color;c.lineWidth=1.4;c.beginPath();c.moveTo(0,-5);c.lineTo(4,4);c.lineTo(-4,4);c.closePath();c.fill();c.stroke();c.fillStyle=color;c.beginPath();c.arc(0,1,1.5,0,TAU);c.fill();c.restore();}};
var ENEMY_PIXELS={
  drone:['011110','122221','132231','122221','010010'],
  swift:['0011100','0122210','1232321','0122210','0100010'],
  armored:['0111110','1222221','1231321','1223221','1122211','0122210','0110110'],
  warden:['100101001','111212111','012222210','122313221','123131321','122313221','012222210','011202110','010000010']
};
Game.prototype.board=function(){var c=this.c,g=CFG.grid,contrast=this.settings.highContrast;pxBox(c,14,138,362,412,UI.surface,contrast?UI.teal:UI.line,UI.shadow,2);for(var r=0;r<g.rows;r++)for(var col=0;col<g.cols;col++){var x=GRID_X+col*CELL_X,y=GRID_Y+r*CELL,isEntry=col===0&&r===g.entryRow,isCore=col===g.cols-1&&r===g.exitRow;if(isEntry||isCore)continue;c.fillStyle=(r+col)%2?(contrast?'#E4ECD0':'#F4F7EA'):(contrast?'#D8E2C2':'#ECF0DF');c.fillRect(x+1,y+1,CELL_X-2,CELL-2);if(contrast){c.fillStyle='#A6B494';c.fillRect(x+1,y+1,CELL_X-2,1);}}
  if(this.paused||!this.running){var planned=this.cachedDefenseRoute||(this.cachedDefenseRoute=this.findPath(0,g.entryRow)||[]);c.save();c.strokeStyle=contrast?UI.ink:'#7A9978';c.lineWidth=2.5;c.setLineDash&&c.setLineDash([4,4]);c.beginPath();for(var pi=0;pi<planned.length;pi++){var px=this.gx(planned[pi][0]),py=this.gy(planned[pi][1]);if(pi)c.lineTo(px,py);else c.moveTo(px,py);}c.stroke();if(c.setLineDash)c.setLineDash([]);c.restore();}
  for(var i=0;i<this.towers.length;i++)this.drawTower(this.towers[i]);for(i=0;i<this.enemies.length;i++)this.drawEnemy(this.enemies[i]);for(i=this.shots.length-1;i>=0;i--){var sh=this.shots[i];this.drawShot(sh);}for(i=0;i<this.particles.length;i++){var q=this.particles[i],qx=Math.round(q.x),qy=Math.round(q.y);c.globalAlpha=q.t/.45;c.fillStyle=UI.ink;c.fillRect(qx-3,qy-3,6,6);c.fillStyle=q.color;c.fillRect(qx-2,qy-2,4,4);}c.globalAlpha=1;this.drawPortals();this.drawLifeFeedback();this.drawDamageFeedback();
};
Game.prototype.drawPortals=function(){var c=this.c,g=CFG.grid,ex=Math.round(this.gx(0)),ey=Math.round(this.gy(g.entryRow)),cx=Math.round(this.gx(g.cols-1)),cy=Math.round(this.gy(g.exitRow)),blink=!this.settings.reduceMotion&&(Math.floor(this.time*3)%2===0);
  pxBox(c,ex-9,ey-8,18,16,UI.teal,UI.ink,null,2);c.fillStyle=blink?'#FFFFFF':'#BFF0D2';c.fillRect(ex-2,ey-2,4,4);
  pxBox(c,cx-9,cy-8,18,16,UI.orange,UI.ink,null,2);c.fillStyle=blink?'#FFFFFF':'#FFE0C2';c.fillRect(cx-3,cy-3,6,6);
};
Game.prototype.drawTower=function(t){var c=this.c,sel=t===this.inspect,range=this.towerRange(t.cfg,t.level),showRange=range&&(this.settings.rangeMode==='always'||this.settings.rangeMode==='selected'&&sel);
  if(showRange){c.save();c.strokeStyle=t.cfg.color;c.lineWidth=2;c.globalAlpha=sel?.42:.16;if(c.setLineDash)c.setLineDash([5,4]);c.beginPath();c.arc(t.x,t.y,range*GEOM_SCALE,0,TAU);c.stroke();if(c.setLineDash)c.setLineDash([]);c.restore();}
  var bob=!this.settings.reduceMotion&&t.cfg.attack!=='block'&&(Math.floor((this.time*2.5+t.col*.3+t.row*.2))%2)?-1:0;
  if(sel)pxBox(c,t.x-11,t.y-10,22,20,UI.tealSoft,UI.teal,null,2);
  else if(t.cfg.attack!=='block'){c.fillStyle='#DFE6CE';c.fillRect(Math.round(t.x-8),Math.round(t.y-7),16,15);}
  this.paintDevice(t.cfg,t.x,t.y+bob,15);
  if(t.level>1&&t.cfg.attack!=='block'){var pips=Math.min(4,t.level-1);for(var p=0;p<pips;p++){c.fillStyle=UI.orange;c.fillRect(Math.round(t.x-7+p*4),Math.round(t.y+7),3,2);}}
};
Game.prototype.drawShot=function(sh){var c=this.c,p=clamp(1-sh.t/sh.maxT,0,1),alpha=1-p,x1=Math.round(sh.x1),y1=Math.round(sh.y1),x2=Math.round(sh.x2),y2=Math.round(sh.y2);c.save();c.strokeStyle=sh.color;c.fillStyle=sh.color;c.globalAlpha=alpha;
  if(sh.kind==='blast'){var rad=Math.round(sh.r*(.3+.7*p));pxBox(c,x2-rad,y2-rad,rad*2,rad*2,null,sh.color,null,2);c.globalAlpha=alpha*.2;c.fillRect(x2-rad+2,y2-rad+2,Math.max(2,rad*2-4),Math.max(2,rad*2-4));}
  else if(sh.kind==='slow'){c.lineWidth=2;if(c.setLineDash)c.setLineDash([4,4]);c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();if(c.setLineDash)c.setLineDash([]);pxBox(c,x2-8,y2-8,16,16,null,sh.color,null,2);}
  else{var mx=Math.round((x1+x2)/2);c.lineWidth=2.5;c.beginPath();c.moveTo(x1,y1);c.lineTo(mx,y1);c.lineTo(mx,y2);c.lineTo(x2,y2);c.stroke();c.fillRect(x2-4,y2-1,8,2);c.fillRect(x2-1,y2-4,2,8);}
  c.restore();
};
Game.prototype.drawEnemy=function(e){var c=this.c,cfg=e.cfg||this.enemyConfig(e.kind),color=cfg.color,isBoss=!!cfg.boss,step=!this.settings.reduceMotion&&(Math.floor(this.time*6)%2)?-1:0;
  if(e===this.inspectEnemy||isBoss){var ar=isBoss?13:10;pxBox(c,e.x-ar,e.y-ar,ar*2,ar*2,null,e===this.inspectEnemy?UI.teal:color,null,2);}
  var rows=ENEMY_PIXELS[isBoss?'warden':e.kind]||ENEMY_PIXELS.drone,unit=isBoss?2.2:e.kind==='armored'?2:2;
  pixelSprite(c,rows,e.x,e.y+step,unit,{'1':e.slow>0?UI.violet:UI.ink,'2':color,'3':'#FFFFFF'});
  var showBar=this.settings.healthBars==='always'||this.settings.healthBars==='damaged'&&e.hp<e.max;
  if(showBar){var half=isBoss?13:8,bx=Math.round(e.x-half),by=Math.round(e.y-(isBoss?16:12));c.fillStyle=UI.ink;c.fillRect(bx-1,by-1,half*2+2,5);c.fillStyle='#E2E8D2';c.fillRect(bx,by,half*2,3);c.fillStyle=color;c.fillRect(bx,by,Math.round(half*2*clamp(e.hp/e.max,0,1)),3);}
};
Game.prototype.drawLifeFeedback=function(){var c=this.c,g=CFG.grid,cx=Math.round(this.gx(g.cols-1)),cy=Math.round(this.gy(g.exitRow));if(this.coreHit>0){var r=Math.round(10+(1-this.coreHit/.5)*10);c.save();c.globalAlpha=this.coreHit/.5;pxBox(c,cx-r,cy-r,r*2,r*2,null,UI.red,null,2);c.restore();}for(var i=0;i<this.lifeFloats.length;i++){var f=this.lifeFloats[i],p=1-f.t/f.maxT;c.save();c.globalAlpha=clamp(f.t/.35,0,1);text(c,'生命 -'+f.damage,f.x-8,f.y-p*24,10,UI.red,'right',900);c.restore();}};
Game.prototype.drawDamageFeedback=function(){var c=this.c;for(var i=0;i<this.damageFloats.length;i++){var f=this.damageFloats[i],p=1-f.t/f.maxT;c.save();c.globalAlpha=clamp(f.t/.2,0,1);metric(c,'-'+f.damage,f.x,f.y-p*18,9,f.color,'center',900);c.restore();}};
var bottomBaseRenderer=function(){var c=this.c;c.fillStyle='#F3F7F5';c.fillRect(0,550,390,230);c.strokeStyle='#C9DDD6';c.beginPath();c.moveTo(34,550);c.lineTo(356,550);c.stroke();text(c,this.inspect?'装置维护':'左右滑动选择装置',8,558,7,'#78918B','left',850);
  if(this.inspect){var it=this.inspect,ic=it.cfg.color,isWall=it.cfg.attack==='block',glyph=it.cfg.glyph||it.cfg.id,damage=isWall?'—':Math.round(this.towerDamage(it.cfg,it.level)),attackSpeed=isWall?'—':(1/it.cfg.rate).toFixed(2)+'/秒',attackRange=isWall?'—':it.cfg.range,record=isWall?'功能建筑 · 改变路线':'击杀 '+(it.kills||0)+' · 累计伤害 '+Math.round(it.damageDone||0),nextCost=isWall?0:this.upgradeCost(it.cfg,it.level);rr(c,8,566,374,50,12,'#FFFFFF',ic);rr(c,15,579,24,24,6,'#FFFFFF',ic);this.paintDevice(it.cfg,27,591,13);text(c,it.cfg.name+'  '+(isWall?'功能型':'Lv.'+it.level),47,576,10,'#173D35','left',850);text(c,'伤害 '+damage+' · 攻速 '+attackSpeed+' · 射程 '+attackRange,47,592,8,'#607E76','left',800);text(c,record+' · 格 '+(it.col+1)+','+(it.row+1),47,607,8,'#78918B','left',750);rr(c,8,622,120,50,12,'#FFFFFF','#C9DDD6');text(c,'返回',68,647,11,'#476B63','center',850);rr(c,135,622,120,50,12,isWall?'#EDF1EF':'#E7F5EF',isWall?'#C9DDD6':'#AFCFC4');if(isWall)text(c,'功能装置',195,647,10,'#78918B','center',850);else{text(c,'升级至 Lv.'+(it.level+1),195,638,9,'#27665A','center',850);icon(c,'money',178,656,'#D47B2D',8);metric(c,compact(nextCost),216,656,9,'#27665A','right',850);}rr(c,262,622,120,50,12,'#FFF0F1','#E6B8C0');text(c,'回收装置',322,647,10,'#A84859','center',850);}else{c.save();c.beginPath();c.rect(8,566,DEVICE_VIEW_W,104);c.clip();for(var i=0;i<CFG.towers.length;i++){var t=CFG.towers[i],x=8+i*DEVICE_CARD_STEP-this.deviceScroll,y=568,isBlock=t.attack==='block',level=isBlock?1:(this.placementLevels[t.id]||1),on=t.id===this.selected,cost=this.placementCost(t,level),canBuy=this.energy>=cost,glyph=t.glyph||t.id,fg=canBuy?'#173D35':'#84958F',muted=canBuy?'#607E76':'#9AA8A3';rr(c,x,y,DEVICE_CARD_W,102,14,on?'#FFFFFF':canBuy?'#F9FCFB':'#EDF1EF',on?t.color:'#C9DDD6');c.fillStyle=on?t.color:canBuy?'#D6E6E1':'#C9D1CE';c.fillRect(x+14,y,DEVICE_CARD_W-28,3);rr(c,x+10,y+10,40,40,11,canBuy?'#FFFFFF':'#E5E9E7',canBuy?t.color:'#AAB8B3');icon(c,glyph,x+30,y+30,canBuy?t.color:'#AAB8B3',19);text(c,t.name,x+59,y+16,11,fg,'left',900);text(c,t.hint,x+59,y+34,8,muted,'left',750);rr(c,x+125,y+9,42,22,11,canBuy?'#FFF7EF':'#E3E8E6',canBuy?'#F0C39C':'#C9D1CE');icon(c,'money',x+135,y+20,canBuy?'#B86424':'#9AA8A3',8);metric(c,compact(cost),x+161,y+20,9,canBuy?'#A95320':'#8C9A95','right',900);c.strokeStyle='#DCE8E4';c.beginPath();c.moveTo(x+10,y+54);c.lineTo(x+166,y+54);c.stroke();text(c,isBlock?'改变侵体路线':'伤害 '+Math.round(this.towerDamage(t,level))+'  ·  射程 '+t.range,x+10,y+61,8,muted,'left',800);if(isBlock){rr(c,x+8,y+67,160,29,9,on?t.color:'#E8F0ED',on?t.color:'#C9DDD6');text(c,'Ⅰ  路线改造',x+88,y+82,9,on?'#FFFFFF':'#607E76','center',850);}else{var canDown=level>1,canUp=this.energy>=this.placementCost(t,level+1);rr(c,x+8,y+67,50,29,9,canDown?'#EDF5F2':'#E3E8E6','#C9DDD6');text(c,'−',x+33,y+82,14,canDown?'#476B63':'#98A6A1','center',900);rr(c,x+63,y+67,50,29,9,on?t.color:'#EDF5F2',on?t.color:'#C9DDD6');text(c,'Lv.'+level,x+88,y+82,level>99?8:9,on?'#FFFFFF':'#476B63','center',900);rr(c,x+118,y+67,50,29,9,canUp?'#EDF5F2':'#E3E8E6','#C9DDD6');text(c,'+',x+143,y+82,14,canUp?'#476B63':'#98A6A1','center',900);}}c.restore();var maxScroll=this.deviceScrollMax();if(maxScroll>0){var trackX=286,trackW=88,contentW=CFG.towers.length*DEVICE_CARD_STEP-DEVICE_CARD_GAP,thumbW=Math.max(24,trackW*DEVICE_VIEW_W/contentW),thumbX=trackX+(trackW-thumbW)*(this.deviceScroll/maxScroll);c.fillStyle='#D7E6E1';c.fillRect(trackX,556,trackW,2);c.fillStyle='#78918B';c.fillRect(thumbX,556,thumbW,2);}}
  var mainLabel=this.wave===0?'启动第一波':this.paused?'继续防守':'暂停防守',mainColor=this.wave===0||this.paused?'#269E84':'#D9893B';rr(c,120,692,210,68,14,this.wave===0||this.paused?'#E5F5EF':'#FFF3E7',mainColor);icon(c,this.wave===0||this.paused?'play':'pause',143,726,mainColor,16);text(c,mainLabel,225,718,14,'#173D35','center',900);text(c,this.wave===0?'准备完成后开战':this.paused?'返回当前波次':'点击暂停进行调整',225,739,8,'#78918B','center',750);var tools=[['⌂','首页',8,50],['↻','重开',64,50],[this.speed+'×','倍速',338,44]];for(var ti=0;ti<tools.length;ti++){var b=tools[ti],active=ti===2&&this.speed===2;rr(c,b[2],692,b[3],68,12,active?'#EEECFF':'#FFFFFF',active?'#8D77D8':'#C9DDD6');text(c,b[0],b[2]+b[3]/2,716,b[0].length>1?10:13,active?'#725DBB':'#476B63','center',900);text(c,b[1],b[2]+b[3]/2,742,8,active?'#725DBB':'#78918B','center',850);}for(var ni=0;ni<this.notices.length;ni++){var notice=this.notices[ni],fade=clamp(notice.t/.55,0,1),progress=clamp(1-notice.t/notice.duration,0,1),by=350-progress*30;c.save();c.globalAlpha=fade;c.shadowColor='rgba(42,79,70,.16)';c.shadowBlur=14;c.shadowOffsetY=5;rr(c,76,by-20,238,40,12,'rgba(255,255,255,.9)','rgba(164,198,187,.75)');c.shadowColor='transparent';text(c,notice.text,195,by,12,'#245B52','center',850);c.restore();}
};
Game.prototype.bottomBase=bottomBaseRenderer;
var bottomEnemyRenderer=function(){this.bottomBase();if(!this.inspectEnemy)return;var c=this.c,enemy=this.inspectEnemy,cfg=enemy.cfg||this.enemyConfig(enemy.kind),hp=Math.max(0,Math.ceil(enemy.hp)),speed=Math.round(enemy.speed/GEOM_SCALE);c.fillStyle='#F3F7F5';c.fillRect(0,550,390,126);c.strokeStyle='#C9DDD6';c.beginPath();c.moveTo(34,550);c.lineTo(356,550);c.stroke();text(c,'侵体情报',8,558,7,'#78918B','left',850);rr(c,8,566,374,50,12,'#FFFFFF',cfg.color);c.fillStyle='#F1FAF7';c.strokeStyle=cfg.color;c.lineWidth=2;c.beginPath();c.arc(28,591,11,0,TAU);c.fill();c.stroke();text(c,cfg.name+' · '+cfg.trait,48,579,10,'#173D35','left',900);text(c,'生命 '+hp+'/'+Math.ceil(enemy.max)+' · 速度 '+speed+' · 生命伤害 '+enemy.lifeDamage,48,598,9,'#607E76','left',800);rr(c,8,622,374,50,12,'#FFFFFF','#C9DDD6');text(c,'返回装置选择',195,647,11,'#476B63','center',850);};
Game.prototype.bottomWideCards=bottomEnemyRenderer;
var bottomCardsRenderer=function(){this.bottomWideCards();if(this.inspect||this.inspectEnemy)return;var c=this.c;c.fillStyle='#F3F7F5';c.fillRect(0,550,390,126);c.strokeStyle='#C9DDD6';c.beginPath();c.moveTo(34,550);c.lineTo(356,550);c.stroke();text(c,'左右滑动选择装置',8,558,7,'#78918B','left',850);c.save();c.beginPath();c.rect(8,566,DEVICE_VIEW_W,104);c.clip();for(var i=0;i<CFG.towers.length;i++){var t=CFG.towers[i],x=8+i*DEVICE_CARD_STEP-this.deviceScroll,y=568,isBlock=t.attack==='block',level=isBlock?1:(this.placementLevels[t.id]||1),on=t.id===this.selected,cost=this.placementCost(t,level),canBuy=this.energy>=cost,glyph=t.glyph||t.id,fg=canBuy?'#173D35':'#84958F',muted=canBuy?'#607E76':'#9AA8A3';rr(c,x,y,DEVICE_CARD_W,102,14,on?'#FFFFFF':canBuy?'#F9FCFB':'#EDF1EF',on?t.color:'#C9DDD6');c.fillStyle=on?t.color:canBuy?'#D6E6E1':'#C9D1CE';c.fillRect(x+12,y,DEVICE_CARD_W-24,3);rr(c,x+9,y+9,34,34,10,canBuy?'#FFFFFF':'#E5E9E7',canBuy?t.color:'#AAB8B3');icon(c,glyph,x+26,y+26,canBuy?t.color:'#AAB8B3',16);text(c,t.name,x+51,y+15,10,fg,'left',900);text(c,t.hint,x+51,y+33,7,muted,'left',750);rr(c,x+98,y+8,38,21,10,canBuy?'#FFF7EF':'#E3E8E6',canBuy?'#F0C39C':'#C9D1CE');icon(c,'money',x+106,y+18.5,canBuy?'#B86424':'#9AA8A3',7);metric(c,compact(cost),x+132,y+18.5,8,canBuy?'#A95320':'#8C9A95','right',900);c.strokeStyle='#DCE8E4';c.beginPath();c.moveTo(x+8,y+52);c.lineTo(x+136,y+52);c.stroke();text(c,isBlock?'改变侵体路线':'伤害 '+Math.round(this.towerDamage(t,level))+' · 射程 '+t.range,x+8,y+61,7,muted,'left',800);if(isBlock){rr(c,x+8,y+67,128,29,9,on?t.color:'#E8F0ED',on?t.color:'#C9DDD6');text(c,'Ⅰ  路线改造',x+72,y+82,9,on?'#FFFFFF':'#607E76','center',850);}else{var canDown=level>1,canUp=this.energy>=this.placementCost(t,level+1);rr(c,x+8,y+67,38,29,9,canDown?'#EDF5F2':'#E3E8E6','#C9DDD6');text(c,'−',x+27,y+82,14,canDown?'#476B63':'#98A6A1','center',900);rr(c,x+53,y+67,38,29,9,on?t.color:'#EDF5F2',on?t.color:'#C9DDD6');text(c,'Lv.'+level,x+72,y+82,level>99?7:8,on?'#FFFFFF':'#476B63','center',900);rr(c,x+98,y+67,38,29,9,canUp?'#EDF5F2':'#E3E8E6','#C9DDD6');text(c,'+',x+117,y+82,14,canUp?'#476B63':'#98A6A1','center',900);}}c.restore();var maxScroll=this.deviceScrollMax();if(maxScroll>0){var trackX=286,trackW=88,contentW=CFG.towers.length*DEVICE_CARD_STEP-DEVICE_CARD_GAP,thumbW=Math.max(24,trackW*DEVICE_VIEW_W/contentW),thumbX=trackX+(trackW-thumbW)*(this.deviceScroll/maxScroll);c.fillStyle='#D7E6E1';c.fillRect(trackX,556,trackW,2);c.fillStyle='#78918B';c.fillRect(thumbX,556,thumbW,2);}};
var previousPresentation_tutorialChoice=function(){var c=this.c;c.fillStyle='rgba(28,57,51,.48)';c.fillRect(0,0,390,780);c.save();c.shadowColor='rgba(28,57,51,.2)';c.shadowBlur=24;c.shadowOffsetY=8;rr(c,24,246,342,258,24,'#FFFFFF','#AFCFC4');c.restore();text(c,'第一次来吗？',195,292,22,'#173D35','center',900);text(c,'用 3 个实际操作快速熟悉防线',195,328,11,'#66837D','center',750);var steps=['选择装置','部署装置','启动第一波'];for(var i=0;i<3;i++){c.fillStyle=['#51CADD','#F2A04E','#8D77D8'][i];c.beginPath();c.arc(83+i*112,374,15,0,TAU);c.fill();text(c,''+(i+1),83+i*112,374,11,'#FFFFFF','center',900);text(c,steps[i],83+i*112,404,9,'#476B63','center',800);}rr(c,36,430,148,56,14,'#FFFFFF','#BFD4CD');text(c,'直接开始',110,458,12,'#476B63','center',850);rr(c,206,430,148,56,14,'#269E84','#1F8A72');text(c,'开始引导',280,458,12,'#FFFFFF','center',900);};
var guideBaseRenderer=function(){var c=this.c,step=this.tutorial,box=step===1?{x:6,y:558,w:378,h:120}:step===2?{x:16,y:142,w:358,h:406}:{x:116,y:688,w:218,h:76};c.save();c.fillStyle='rgba(23,61,53,.5)';c.fillRect(0,0,390,box.y);c.fillRect(0,box.y,box.x,box.h);c.fillRect(box.x+box.w,box.y,390-box.x-box.w,box.h);c.fillRect(0,box.y+box.h,390,780-box.y-box.h);c.restore();c.save();c.strokeStyle=step===1?'#51CADD':step===2?'#F2A04E':'#269E84';c.lineWidth=3;rr(c,box.x,box.y,box.w,box.h,16,null,c.strokeStyle);c.restore();var by=step===1?450:566,heading=step===1?'第 1 步 · 选择装置':step===2?'第 2 步 · 部署装置':'第 3 步 · 启动第一波',hint=step===1?'点击下方任意一张装置卡片':step===2?'点击战场中的空格，系统会检查路线':'点击启动按钮，让侵体开始推进';rr(c,22,by,346,82,18,'#FFFFFF','#BFD4CD');text(c,heading,40,by+25,14,'#173D35','left',900);text(c,hint,40,by+53,10,'#607E76','left',750);rr(c,316,82,58,44,12,'#FFFFFF','#BFD4CD');text(c,'跳过',345,104,9,'#607E76','center',850);};
var restartConfirmBase=function(){var c=this.c;c.fillStyle='rgba(28,57,51,.44)';c.fillRect(-this.ox/this.scale,-this.oy/this.scale,this.W/this.scale,this.H/this.scale);c.save();c.shadowColor='rgba(28,57,51,.2)';c.shadowBlur=24;c.shadowOffsetY=8;rr(c,32,286,326,234,24,'#FFFFFF','#AFCFC4');c.restore();icon(c,'restart',60,326,'#D7792C',24);text(c,'确认重新开始？',52,370,22,'#173D35','left',900);text(c,'当前波次和布防进度将被清空',52,408,11,'#66837D','left',700);rr(c,48,454,140,52,14,'#FFFFFF','#BFD4CD');text(c,'取消',118,480,13,'#476B63','center',850);rr(c,202,454,140,52,14,'#D95D73','#C94E62');text(c,'确认重开',272,480,13,'#FFFFFF','center',850);};
var recycleConfirmBase=function(){var c=this.c;c.fillStyle='rgba(28,57,51,.44)';c.fillRect(-this.ox/this.scale,-this.oy/this.scale,this.W/this.scale,this.H/this.scale);c.save();c.shadowColor='rgba(28,57,51,.2)';c.shadowBlur=24;c.shadowOffsetY=8;rr(c,32,286,326,234,24,'#FFFFFF','#AFCFC4');c.restore();text(c,'确认回收装置？',52,348,22,'#173D35','left',900);text(c,'将返还累计投入的 65%',52,392,12,'#66837D','left',700);rr(c,48,454,140,52,14,'#FFFFFF','#BFD4CD');text(c,'取消',118,480,13,'#476B63','center',850);rr(c,202,454,140,52,14,'#D95D73','#C94E62');text(c,'确认回收',272,480,13,'#FFFFFF','center',850);};
var homeConfirmBase=function(){var c=this.c;c.fillStyle='rgba(28,57,51,.44)';c.fillRect(-this.ox/this.scale,-this.oy/this.scale,this.W/this.scale,this.H/this.scale);c.save();c.shadowColor='rgba(28,57,51,.2)';c.shadowBlur=24;c.shadowOffsetY=8;rr(c,24,286,342,234,24,'#FFFFFF','#AFCFC4');c.restore();icon(c,'home',52,326,'#269E84',24);text(c,'返回首页',44,370,22,'#173D35','left',900);text(c,'暂停可保留本次挑战进度',44,408,12,'#66837D','left',700);rr(c,32,454,156,52,14,'#FFFFFF','#BFD4CD');text(c,'暂停挑战',110,480,12,'#476B63','center',850);rr(c,202,454,156,52,14,'#D95D73','#C94E62');text(c,'结束本次挑战',280,480,12,'#FFFFFF','center',850);};
var resultBaseRenderer=function(){var c=this.c;c.fillStyle='rgba(44,75,69,.32)';c.fillRect(-this.ox/this.scale,-this.oy/this.scale,this.W/this.scale,this.H/this.scale);this.paintRecord(38,245,314,340);text(c,'跃迁门失守',195,291,25,'#C94E62','center',850);text(c,'调整布局，再次挑战更高波次',195,326,13,'#66837D','center');text(c,'最终得分',195,376,11,'#78918B','center');text(c,''+this.score,195,408,32,'#D7792C','center',850);text(c,'历史最佳',66,452,10,UI.muted,'left');metric(c,compact(this.best),66,478,18,UI.ink,'left',900);text(c,'坚持波次',324,452,10,UI.muted,'right');metric(c,''+this.wave,324,478,18,UI.teal,'right',900);rr(c,73,516,244,52,15,'#F29A4A');text(c,'返回首页',195,542,16,'#FFFFFF','center',850);};
Game.prototype.randomIdentityName=function(){var a=['微光','巡航','青岚','星脉','远帆','薄荷','云栖','弧光'],b=['守望者','规划师','筑路人','指挥官','观察员','引航员'];return a[Math.floor(Math.random()*a.length)]+b[Math.floor(Math.random()*b.length)];};
Game.prototype.selectIdentity=function(mode){if(mode==='douyin'&&!this.profile)return;this.identityMode=mode==='douyin'?'douyin':'local';this.profileStatus=this.identityMode==='douyin'?'抖音资料':'游戏身份';this.persistIdentity();this.p.playSfx('tap');this.p.vibrate();};
Game.prototype.drawLocalAvatar=function(x,y,r,style){var c=this.c,index=clamp(style,0,7),left=Math.round(x-r),top=Math.round(y-r),size=Math.round(r*2);pxBox(c,left,top,size,size,CFG.avatars[index].background,UI.line,r>=20?UI.shadow:null,2);avatarGlyph(c,index,x,y,r*.82);};
var IDENTITY_FIELDS=['localNickName','localMotto','localDefenseZone','localAvatarStyle','localAvatarUrl'];
Game.prototype.beginIdentityEdit=function(){this.identityDraft={};for(var i=0;i<IDENTITY_FIELDS.length;i++){var key=IDENTITY_FIELDS[i];this.identityDraft[key]=this[key];}this.identityDraft.customAvatarImage=this.customAvatarImage;this.profileEditor=true;this.avatarPickerOpen=false;};
Game.prototype.identityChanged=function(){if(!this.identityDraft)return false;for(var i=0;i<IDENTITY_FIELDS.length;i++){var key=IDENTITY_FIELDS[i];if(this[key]!==this.identityDraft[key])return true;}return false;};
Game.prototype.endIdentityEdit=function(save){if(this.cloudProfilePending)return;var draft=this.identityDraft;if(save&&draft&&this.saveSharedProfile(draft))return;if(!draft){this.profileEditor=false;return;}if(!save){for(var i=0;i<IDENTITY_FIELDS.length;i++)this[IDENTITY_FIELDS[i]]=draft[IDENTITY_FIELDS[i]];this.customAvatarImage=draft.customAvatarImage;}this.identityDraft=null;this.avatarPickerOpen=false;this.profileEditor=false;this.profileEditorGesture=null;if(save)this.persistIdentity();else if(this.cloudPlayer)this.applyCloudPlayer(this.cloudPlayer);this.applyDeferredCloudState();};
Game.prototype.persistIdentity=function(){if(this.identityDraft||!this.settings||this.cloudView)return;this.identityMode='local';this.settings.identityMode='local';this.settings.localNickName=this.localNickName;this.settings.localMotto=this.localMotto||'';this.settings.localDefenseZone=DEFENSE_ZONES.indexOf(this.localDefenseZone)>=0?this.localDefenseZone:DEFENSE_ZONES[0];delete this.settings.localRegion;this.settings.localAvatarStyle=this.localAvatarStyle;this.settings.localAvatarUrl=this.localAvatarUrl||'';this.saveSettings();};
Game.prototype.activeIdentityName=function(){return this.localNickName;};
Game.prototype.drawIdentityAvatar=function(x,y,r){var c=this.c,style=clamp(this.localAvatarStyle,0,7),left=Math.round(x-r),top=Math.round(y-r),size=Math.round(r*2);pxBox(c,left,top,size,size,CFG.avatars[style].background,UI.line,r>=20?UI.shadow:null,r>=14?2:0);c.save();c.beginPath();c.rect(left+2,top+2,Math.max(2,size-4),Math.max(2,size-4));c.clip();if(this.customAvatarImage)c.drawImage(this.customAvatarImage,left+2,top+2,size-4,size-4);else avatarGlyph(c,style,x,y,r*.82);c.restore();this.paintFrame(x,y,r);};
Game.prototype.drawIdentityAvatarCircle=function(x,y,r){var c=this.c,style=clamp(this.localAvatarStyle,0,7),left=x-r,top=y-r,size=r*2,corner=Math.max(16,r*.28);c.save();rr(c,left,top,size,size,corner,'#E6F3EE',null);c.clip();if(this.customAvatarImage)c.drawImage(this.customAvatarImage,left,top,size,size);else if(style<4)avatarGlyph(c,style,x,y,r*.76);else avatarExtraGlyph(c,style,x,y,r*.76);c.restore();c.lineWidth=3;rr(c,left,top,size,size,corner,null,'#8FC4B5');};
Game.prototype.editPlayerNickname=function(){var self=this,session=this.identityDraft;if(!this.p.editText)return;this.p.editText(this.localNickName,function(value){if(session!==self.identityDraft)return;if(!value)return;var safe=playerName(value);if(!safe){self.notify(String(value).indexOf('*')>=0?'昵称包含敏感内容':'仅支持中文、英文、数字、-、_',1.8);self.p.playSfx('error');return;}self.localNickName=safe;self.persistIdentity();self.p.playSfx('upgrade');});};
Game.prototype.editPlayerMotto=function(){var self=this,session=this.identityDraft;if(!this.p.editText)return;this.p.editText(this.localMotto,function(value){if(session!==self.identityDraft)return;value=profileText(value,24);if(!value)return;self.localMotto=value;self.persistIdentity();self.p.playSfx('upgrade');},{maxLength:24,prompt:'填写防线宣言（最多24字）'});};
Game.prototype.usePlatformIdentity=function(){if(!this.profile){this.profileStatus='请先关联平台资料';return;}var self=this,safe=platformPlayerName(this.profile.nickName),avatarUrl=String(this.profile.avatarUrl||'');if(!safe){this.profileStatus='平台昵称为空，请更新资料';this.p.playSfx('error');return;}if(!avatarUrl){this.profileStatus='平台头像暂不可用，请更新资料';this.p.playSfx('error');return;}if(this.cloudView){this.updateSharedProfile({nickName:safe,avatarUrl:avatarUrl});return;}this.localNickName=safe;this.localAvatarUrl=avatarUrl;this.customAvatarImage=this.avatarImage;this.profileStatus='已采用平台头像和昵称';this.persistIdentity();if(!this.customAvatarImage&&this.p.loadImage)this.p.loadImage(avatarUrl,function(image){if(self.localAvatarUrl===avatarUrl)self.customAvatarImage=image;});this.notify(this.profileStatus,1.4);this.p.playSfx('upgrade');this.p.vibrate();};
Game.prototype.drawPlatformAvatar=function(x,y,r){var c=this.c,left=x-r,top=y-r,size=r*2,corner=Math.max(7,r*.42);c.save();c.beginPath();c.moveTo(left+corner,top);c.lineTo(left+size-corner,top);c.quadraticCurveTo(left+size,top,left+size,top+corner);c.lineTo(left+size,top+size-corner);c.quadraticCurveTo(left+size,top+size,left+size-corner,top+size);c.lineTo(left+corner,top+size);c.quadraticCurveTo(left,top+size,left,top+size-corner);c.lineTo(left,top+corner);c.quadraticCurveTo(left,top,left+corner,top);c.closePath();c.fillStyle='#E5F5EF';c.fill();c.clip();if(this.avatarImage)c.drawImage(this.avatarImage,left,top,size,size);else{c.fillStyle='#269E84';c.beginPath();c.arc(x,y-r*.2,r*.27,0,TAU);c.fill();c.beginPath();c.arc(x,y+r*.48,r*.5,Math.PI,TAU);c.fill();}c.restore();rr(c,left,top,size,size,corner,null,'#AFCFC4');};
Game.prototype.editPlayerAvatar=function(source){var self=this,session=this.identityDraft;if(!this.p.chooseAvatar){this.profileStatus='仅抖音内可修改头像';return;}this.p.chooseAvatar(this.localAvatarUrl,source,function(path,error){if(session!==self.identityDraft)return;if(!path){if(error&&error.code==='unsupported')self.profileStatus='仅抖音内可修改头像';return;}self.localAvatarUrl=path;self.customAvatarImage=null;self.persistIdentity();self.p.loadImage(path,function(image){if(session===self.identityDraft&&self.localAvatarUrl===path)self.customAvatarImage=image;});self.p.playSfx('upgrade');self.p.vibrate();});};
Game.prototype.selectDefaultAvatar=function(index){this.localAvatarStyle=clamp(index,0,7);this.localAvatarUrl='';this.customAvatarImage=null;this.persistIdentity();this.p.playSfx('upgrade');this.p.vibrate();};
var profileEditorLegacyA=function(){var c=this.c,name=this.localNickName,list=this.p.getScores?this.p.getScores():[],bestRow=null,scroll=clamp(this.profileEditorScroll||0,0,340);this.profileEditorScroll=scroll;for(var bi=0;bi<list.length;bi++)if(!bestRow||(+list[bi].score||0)>(+bestRow.score||0))bestRow=list[bi];c.save();c.beginPath();c.rect(0,0,390,780);c.clip();c.fillStyle=UI.bg;c.fillRect(0,0,390,780);c.translate(0,-scroll);this.ambientRoutes();c.strokeStyle=UI.ink;c.lineWidth=2.5;c.beginPath();c.moveTo(52,35);c.lineTo(35,52);c.lineTo(52,69);c.stroke();text(c,'沉浸式身份卡',74,43,24,UI.ink,'left',900);text(c,'这是你在排行榜中的形象',74,72,10,UI.muted,'left',750);rr(c,12,106,366,350,26,'rgba(31,83,70,.12)',null);rr(c,16,98,358,350,24,'#FCFDFB','#BFD3CC');this.drawIdentityAvatarCircle(105,236,70);c.fillStyle='#DDEDE7';c.beginPath();c.arc(68,306,20,0,TAU);c.fill();rankIcon(c,68,306,UI.teal,20);text(c,shortText(name,9),202,152,25,UI.ink,'left',900);text(c,'座右铭',202,194,9,'#65A895','left',850);text(c,shortText(this.localMotto,12),202,221,13,UI.ink,'left',850);text(c,'虚拟家园',202,263,9,'#65A895','left',850);text(c,this.localDefenseZone,202,290,14,UI.ink,'left',900);c.fillStyle='#D5E7E1';c.beginPath();c.moveTo(278,322);c.lineTo(354,322);c.lineTo(354,278);c.strokeStyle='#D5E7E1';c.lineWidth=1;c.stroke();rr(c,34,350,322,76,18,'#16483F',null);rankIcon(c,60,388,'#D7ECE5',17);text(c,'防守记录',82,376,8,'#B9D5CC','left',800);if(bestRow){text(c,'第',222,389,10,'#D9E8E3','left',800);metric(c,''+(+bestRow.wave||0),248,389,19,UI.orange,'center',900);text(c,'波 · '+durationText(bestRow.duration),278,389,11,'#FFFFFF','left',850);}else{text(c,'完成首局后点亮战绩',82,402,10,'#FFFFFF','left',850);}text(c,'1. 更换头像',18,495,15,UI.ink,'left',900);text(c,'同一角色 · 不同装束',18,518,8,UI.muted,'left',750);rr(c,302,476,72,46,14,UI.tealSoft,'#B7D8CD');text(c,'相册',338,499,10,UI.teal,'center',900);for(var i=0;i<4;i++){var ax=16+i*90,on=!this.localAvatarUrl&&this.localAvatarStyle===i;rr(c,ax,536,82,78,16,on?'#F7FFFC':UI.surface,on?UI.teal:UI.line);this.drawLocalAvatar(ax+41,575,31,i);if(on){c.fillStyle=UI.teal;c.beginPath();c.arc(ax+67,548,9,0,TAU);c.fill();text(c,'✓',ax+67,548,8,'#FFFFFF','center',900);}}text(c,'2. 编辑信息',18,655,15,UI.ink,'left',900);var rows=[['昵称',name,682],['座右铭',this.localMotto,744]];for(var r=0;r<rows.length;r++){rr(c,16,rows[r][2],358,52,14,UI.surface,UI.line);text(c,rows[r][0],32,rows[r][2]+27,9,UI.muted,'left',800);text(c,shortText(rows[r][1],r?18:12),104,rows[r][2]+27,12,UI.ink,'left',850);text(c,'编辑',352,rows[r][2]+27,9,UI.teal,'right',900);}text(c,'3. 选择虚拟家园',18,835,15,UI.ink,'left',900);for(i=0;i<DEFENSE_ZONES.length;i++){var zx=16+(i%4)*90,zy=862+Math.floor(i/4)*60,zon=DEFENSE_ZONES[i],selected=this.localDefenseZone===zon;rr(c,zx,zy,82,50,14,selected?UI.tealSoft:UI.surface,selected?UI.teal:UI.line);text(c,zon,zx+41,zy+25,10,selected?UI.teal:UI.ink,'center',850);if(selected){c.fillStyle=UI.teal;c.beginPath();c.arc(zx+68,zy+10,7,0,TAU);c.fill();text(c,'✓',zx+68,zy+10,7,'#FFFFFF','center',900);}}rr(c,16,1000,358,62,18,UI.teal,'#176D5C');text(c,'完成编辑',195,1031,17,'#FFFFFF','center',900);text(c,'保存后将作为你在排行榜中的形象展示',195,1090,9,UI.muted,'center',750);c.restore();if(scroll>0){rr(c,381,84,4,620,2,'rgba(35,124,105,.12)');rr(c,381,84+scroll/340*548,4,72,2,UI.teal);}if(this.zonePickerOpen)this.defenseZonePicker();};
var profileEditorTapLegacyA=function(x,y){var cy=y+(this.profileEditorScroll||0);if(cy>=20&&cy<82){this.profileEditor=false;this.zonePickerOpen=false;this.profileEditorScroll=0;this.p.vibrate();return;}if(x>=302&&x<374&&cy>=476&&cy<522){this.editPlayerAvatar();return;}if(cy>=536&&cy<614){for(var i=0;i<4;i++){var ax=16+i*90;if(x>=ax&&x<ax+82){this.selectDefaultAvatar(i);return;}}}if(cy>=682&&cy<734){this.editPlayerNickname();return;}if(cy>=744&&cy<796){this.editPlayerMotto();return;}if(cy>=862&&cy<972){for(i=0;i<DEFENSE_ZONES.length;i++){var zx=16+(i%4)*90,zy=862+Math.floor(i/4)*60;if(x>=zx&&x<zx+82&&cy>=zy&&cy<zy+50){this.localDefenseZone=DEFENSE_ZONES[i];this.persistIdentity();this.p.playSfx('tap');this.p.vibrate();return;}}}if(cy>=1000&&cy<1062){this.profileEditor=false;this.zonePickerOpen=false;this.profileEditorScroll=0;this.p.playSfx('upgrade');this.p.vibrate();}};
/* Faithful 390px adaptation of the selected immersive identity-card mock. */
var profileEditorLegacyB=function(){var c=this.c,name=this.localNickName,list=this.p.getScores?this.p.getScores():[],bestRow=null,scroll=clamp(this.profileEditorScroll||0,0,190);this.profileEditorScroll=scroll;for(var bi=0;bi<list.length;bi++)if(!bestRow||(+list[bi].score||0)>(+bestRow.score||0))bestRow=list[bi];c.save();c.beginPath();c.rect(0,0,390,780);c.clip();c.fillStyle='#F7FAF7';c.fillRect(0,0,390,780);c.translate(0,-scroll);this.ambientRoutes();c.strokeStyle='#16483F';c.lineWidth=3;c.lineCap='round';c.beginPath();c.moveTo(45,28);c.lineTo(28,45);c.lineTo(45,62);c.stroke();text(c,'沉浸式身份卡',64,38,23,'#16483F','left',900);text(c,'这是你在排行榜中的形象',64,68,10,'#718B83','left',750);rr(c,12,99,366,300,26,'rgba(31,83,70,.12)',null);rr(c,16,92,358,300,24,'#FFFEFB','#B8D0C8');this.drawIdentityAvatarCircle(104,210,66);c.fillStyle='#16483F';c.beginPath();c.moveTo(64,273);c.lineTo(82,263);c.lineTo(100,273);c.lineTo(96,294);c.lineTo(68,294);c.closePath();c.fill();text(c,'★',82,279,12,'#D5E9E2','center',900);text(c,shortText(name,9),198,139,25,'#123F37','left',900);text(c,'座右铭',198,181,9,'#69AA98','left',850);text(c,shortText(this.localMotto,12),198,207,13,'#173D35','left',850);text(c,'虚拟家园',198,246,9,'#69AA98','left',850);text(c,this.localDefenseZone,198,273,15,'#173D35','left',900);c.save();c.globalAlpha=.32;c.strokeStyle='#8BBEB0';c.lineWidth=1;c.beginPath();c.moveTo(286,286);c.lineTo(348,286);c.lineTo(348,245);c.stroke();c.restore();rr(c,34,306,322,68,17,'#134A40',null);rankIcon(c,57,339,'#D9EEE7',17);text(c,'防守记录',78,328,8,'#BAD7CE','left',800);c.strokeStyle='#6F9F92';c.lineWidth=1.5;c.beginPath();c.moveTo(142,350);c.quadraticCurveTo(191,315,238,348);c.quadraticCurveTo(271,367,300,336);c.stroke();for(var ni=0;ni<5;ni++){c.fillStyle=ni===3?UI.orange:'#7EA99D';c.beginPath();c.arc(154+ni*34,342+(ni%2?8:-3),ni===3?6:3,0,TAU);c.fill();}if(bestRow){text(c,'第',276,340,9,'#D8EBE5','left',800);metric(c,''+(+bestRow.wave||0),310,340,16,UI.orange,'center',900);text(c,'波',340,340,9,'#FFFFFF','right',850);text(c,durationText(bestRow.duration),340,358,10,'#FFFFFF','right',850);}else{text(c,'完成首局后点亮',340,350,9,'#FFFFFF','right',850);}function sectionBadge(n,y){rr(c,18,y-17,30,30,9,UI.teal,null);text(c,''+n,33,y-2,13,'#FFFFFF','center',900);}sectionBadge(1,432);text(c,'更换头像',58,430,15,UI.ink,'left',900);text(c,'更多头像 ›',368,430,9,UI.muted,'right',800);for(var i=0;i<4;i++){var ax=16+i*90,on=!this.localAvatarUrl&&this.localAvatarStyle===i;rr(c,ax,454,82,72,15,on?'#F7FFFC':UI.surface,on?UI.teal:UI.line);this.drawLocalAvatar(ax+41,490,29,i);if(on){c.fillStyle=UI.teal;c.beginPath();c.arc(ax+67,465,9,0,TAU);c.fill();text(c,'✓',ax+67,465,8,'#FFFFFF','center',900);}}sectionBadge(2,568);text(c,'编辑信息',58,566,15,UI.ink,'left',900);var rows=[['昵称',name,590],['座右铭',this.localMotto,644]];for(var r=0;r<rows.length;r++){rr(c,16,rows[r][2],358,46,13,UI.surface,UI.line);text(c,rows[r][0],30,rows[r][2]+23,9,UI.muted,'left',800);text(c,shortText(rows[r][1],r?18:12),102,rows[r][2]+23,12,UI.ink,'left',850);text(c,'编辑',354,rows[r][2]+23,9,UI.teal,'right',900);}sectionBadge(3,728);text(c,'选择虚拟家园',58,726,15,UI.ink,'left',900);for(i=0;i<DEFENSE_ZONES.length;i++){var zx=16+(i%4)*90,zy=750+Math.floor(i/4)*52,zon=DEFENSE_ZONES[i],selected=this.localDefenseZone===zon;rr(c,zx,zy,82,44,13,selected?UI.tealSoft:UI.surface,selected?UI.teal:UI.line);text(c,zon,zx+41,zy+22,9.5,selected?UI.teal:UI.ink,'center',850);if(selected){c.fillStyle=UI.teal;c.beginPath();c.arc(zx+68,zy+9,7,0,TAU);c.fill();text(c,'✓',zx+68,zy+9,7,'#FFFFFF','center',900);}}rr(c,16,872,358,58,17,UI.teal,'#176D5C');text(c,'完成编辑',195,901,17,'#FFFFFF','center',900);c.fillStyle=UI.orange;c.beginPath();c.moveTo(344,930);c.lineTo(374,900);c.lineTo(374,930);c.closePath();c.fill();text(c,'保存后将作为你在排行榜中的形象展示',195,955,9,UI.muted,'center',750);c.restore();if(scroll>0){rr(c,382,90,3,590,2,'rgba(35,124,105,.12)');rr(c,382,90+scroll/190*526,3,64,2,UI.teal);}};
var profileEditorTapLegacyB=function(x,y){var cy=y+(this.profileEditorScroll||0);if(cy>=16&&cy<78){this.profileEditor=false;this.profileEditorScroll=0;this.p.vibrate();return;}if(cy>=454&&cy<526){for(var i=0;i<4;i++){var ax=16+i*90;if(x>=ax&&x<ax+82){this.selectDefaultAvatar(i);return;}}}if(cy>=590&&cy<636){this.editPlayerNickname();return;}if(cy>=644&&cy<690){this.editPlayerMotto();return;}if(cy>=750&&cy<846){for(i=0;i<DEFENSE_ZONES.length;i++){var zx=16+(i%4)*90,zy=750+Math.floor(i/4)*52;if(x>=zx&&x<zx+82&&cy>=zy&&cy<zy+44){this.localDefenseZone=DEFENSE_ZONES[i];this.persistIdentity();this.p.playSfx('tap');this.p.vibrate();return;}}}if(cy>=872&&cy<930){this.profileEditor=false;this.profileEditorScroll=0;this.p.playSfx('upgrade');this.p.vibrate();}};
Game.prototype.defenseZonePicker=function(){var c=this.c;c.save();c.fillStyle='rgba(20,49,43,.46)';c.fillRect(28,88,334,616);rr(c,28,300,334,330,24,'#FFFFFF','#AFCFC4');text(c,'选择所属地',52,330,17,UI.ink,'left',900);text(c,'仅代表游戏内虚拟身份',338,330,8,UI.muted,'right',750);for(var i=0;i<DEFENSE_ZONES.length;i++){var x=44+(i%2)*157,y=350+Math.floor(i/2)*56,on=this.localDefenseZone===DEFENSE_ZONES[i];rr(c,x,y,145,48,14,on?UI.tealSoft:UI.surface,on?UI.teal:UI.line);text(c,DEFENSE_ZONES[i],x+72.5,y+24,11,on?UI.teal:UI.ink,'center',850);}text(c,'点击空白区域取消',195,594,8,UI.muted,'center',750);c.restore();};
/* Clean Pixel UI system (Style B): crisp stepped pixel frames, hard drop shadows, clear arcade contrast. */
var UI={bg:'#F1F4E6',surface:'#FCFDF7',soft:'#E2E8D2',line:'#242B24',gridLine:'#CFD8BC',shadow:'#C7D0B2',btnShadow:'#181E18',ink:'#202620',muted:'#636E60',teal:'#2B9E66',tealSoft:'#DFF2E5',orange:'#F06A24',orangeSoft:'#FDE9DC',red:'#D9434E',violet:'#8558D6'};
function rankIcon(c,x,y,color,size){var s=(size||18)/18;c.save();c.translate(x,y);c.scale(s,s);c.strokeStyle=color;c.fillStyle=color;c.lineWidth=2;c.lineCap='round';c.strokeRect(-8,2,4,7);c.strokeRect(-2,-3,4,12);c.strokeRect(4,-7,4,16);c.beginPath();c.moveTo(-9,11);c.lineTo(9,11);c.stroke();c.restore();}
function editIcon(c,x,y,color,size){var s=(size||14)/14;c.save();c.translate(x,y);c.scale(s,s);c.strokeStyle=color;c.lineWidth=1.8;c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(-5,5);c.lineTo(-3,0);c.lineTo(3,-6);c.lineTo(6,-3);c.lineTo(0,3);c.closePath();c.stroke();c.beginPath();c.moveTo(-5,5);c.lineTo(-1,4);c.stroke();c.restore();}
Game.prototype.ambientRoutes=function(){var c=this.c,still=this.settings.reduceMotion,t=still?0:this.time*.42,shift=(t*18)%32,pulse=(t*.13)%1;c.save();c.lineWidth=1;c.globalAlpha=.22;c.fillStyle='#B7CEC6';for(var y=-16+shift;y<796;y+=32)for(var x=14;x<390;x+=32){c.beginPath();c.arc(x,y,1.15,0,TAU);c.fill();}var routes=[[[0,104],[74,104],[74,72],[168,72],[168,122],[248,122],[248,88],[390,88]],[[0,642],[54,642],[54,604],[146,604],[146,660],[264,660],[264,622],[390,622]],[[0,528],[92,528],[92,562],[204,562],[204,518],[310,518],[310,550],[390,550]]];for(var r=0;r<routes.length;r++){var route=routes[r];c.strokeStyle=r===1?'#E4B58E':'#A8C9BE';c.globalAlpha=r===1?.16:.2;c.beginPath();c.moveTo(route[0][0],route[0][1]);for(var i=1;i<route.length;i++)c.lineTo(route[i][0],route[i][1]);c.stroke();for(i=1;i<route.length-1;i++){c.fillStyle=r===1?'#E8A36B':'#83B6A6';c.beginPath();c.arc(route[i][0],route[i][1],2.3,0,TAU);c.fill();}if(!still){var lengths=[],total=0;for(i=0;i<route.length-1;i++){var dx=route[i+1][0]-route[i][0],dy=route[i+1][1]-route[i][1],len=Math.sqrt(dx*dx+dy*dy);lengths.push(len);total+=len;}var travel=((pulse+r*.31)%1)*total,px=route[0][0],py=route[0][1];for(i=0;i<lengths.length;i++){if(travel<=lengths[i]){var ratio=travel/lengths[i];px=route[i][0]+(route[i+1][0]-route[i][0])*ratio;py=route[i][1]+(route[i+1][1]-route[i][1])*ratio;break;}travel-=lengths[i];}c.globalAlpha=.28;c.fillStyle=r===1?'#E8843E':'#237C69';c.beginPath();c.arc(px,py,3.2,0,TAU);c.fill();}}c.restore();};
var pageHeaderBaseRenderer=function(title,subtitle){var c=this.c;rr(c,16,16,52,52,15,UI.surface,UI.line);c.strokeStyle=UI.ink;c.lineWidth=2;c.beginPath();c.moveTo(47,30);c.lineTo(36,42);c.lineTo(47,54);c.stroke();text(c,title,84,35,21,UI.ink,'left',900);text(c,subtitle,84,60,8,UI.muted,'left',750);};
var loadingBaseRenderer=function(){
  var c=this.c,state=this.startup||{items:[],complete:0,total:4},p=clamp(state.complete/state.total,0,1),signal=this.settings.reduceMotion?.5:p;
  c.fillStyle=UI.bg;c.fillRect(0,0,390,780);this.ambientRoutes();
  nativeText(c,'防线启动检查',24,48,9,UI.teal,'left',900);nativeText(c,'启动 / 01',366,48,8,UI.muted,'right',800);
  nativeText(c,'别让它进来',24,102,32,UI.ink,'left',900);nativeText(c,'建立路线 · 守住核心',24,140,11,UI.muted,'left',750);
  rr(c,24,174,342,136,24,UI.surface,UI.line);
  nativeText(c,'启动链路',44,198,8,UI.muted,'left',850);nativeText(c,'入口  →  核心',346,198,8,UI.teal,'right',800);
  var route=[[48,260],[104,260],[104,228],[176,228],[176,274],[244,274],[244,240],[324,240]],lengths=[],total=0,i;
  c.strokeStyle='#C4D9D1';c.lineWidth=5;c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(route[0][0],route[0][1]);
  for(i=1;i<route.length;i++){c.lineTo(route[i][0],route[i][1]);var dx=route[i][0]-route[i-1][0],dy=route[i][1]-route[i-1][1],len=Math.sqrt(dx*dx+dy*dy);lengths.push(len);total+=len;}c.stroke();
  c.strokeStyle=UI.teal;c.lineWidth=2;c.beginPath();c.arc(route[0][0],route[0][1],8,0,TAU);c.stroke();c.fillStyle=UI.orange;c.beginPath();c.arc(route[route.length-1][0],route[route.length-1][1],8,0,TAU);c.fill();
  var travel=signal*total,px=route[0][0],py=route[0][1];for(i=0;i<lengths.length;i++){if(travel<=lengths[i]){var ratio=travel/lengths[i];px=route[i][0]+(route[i+1][0]-route[i][0])*ratio;py=route[i][1]+(route[i+1][1]-route[i][1])*ratio;break;}travel-=lengths[i];}
  c.fillStyle=UI.teal;c.beginPath();c.arc(px,py,5,0,TAU);c.fill();
  rr(c,24,330,342,212,20,UI.surface,UI.line);nativeText(c,state.failed?'启动检查未通过':'正在检查启动条件',44,358,13,state.failed?UI.red:UI.ink,'left',900);metric(c,Math.round(p*100)+'%',346,358,14,state.failed?UI.red:UI.teal,'right',900);
  rr(c,44,384,302,7,4,'#DCE6E1');if(p>0)rr(c,44,384,302*p,7,4,state.failed?UI.red:UI.teal);
  var labels=['运行环境','核心配置','本地存档','必要资源'];for(i=0;i<labels.length;i++){var item=state.items[i],y=418+i*27,ok=item&&item.ok,color=!item?UI.muted:ok?UI.teal:item.required?UI.red:UI.orange,status=!item?'检查中':ok?'已就绪':item.required?'失败':'已降级';c.fillStyle=color;c.beginPath();c.arc(49,y,3.5,0,TAU);c.fill();nativeText(c,labels[i],62,y,9,UI.ink,'left',800);nativeText(c,status,344,y,8,color,'right',850);}
  
  c.strokeStyle=UI.line;c.lineWidth=1;c.beginPath();c.moveTo(24,610);c.lineTo(366,610);c.stroke();
  nativeText(c,'健康游戏忠告',24,638,11,UI.ink,'left',900);rr(c,288,620,78,34,12,UI.tealSoft,'#B7D8CD');nativeText(c,'适龄 8+',327,637,10,UI.teal,'center',900);
  nativeText(c,'抵制不良游戏　拒绝盗版游戏　注意自我保护　谨防受骗上当',24,682,9,UI.muted,'left',700);nativeText(c,'适度游戏益脑　沉迷游戏伤身　合理安排时间　享受健康生活',24,708,9,UI.muted,'left',700);
};
var homeBaseRenderer=function(){
  this.ensureProfile();var c=this.c,name=this.activeIdentityName();
  c.fillStyle=UI.bg;c.fillRect(0,0,390,780);this.ambientRoutes();
  rr(c,16,16,148,52,16,UI.surface,UI.line);this.drawIdentityAvatar(42,42,19);
  text(c,fitText(c,name,82,11,900),70,34,11,UI.ink,'left',900);text(c,'查看档案 ›',70,52,9,UI.teal,'left',750);
  rr(c,176,16,52,52,16,UI.surface,UI.line);controlIcon(c,202,42,UI.teal,20);
  text(c,'别让它进来',20,108,30,UI.ink,'left',900);text(c,'把敌人的路线，变成你的武器',20,140,11,UI.muted,'left',750);
  rr(c,16,172,358,228,20,UI.surface,UI.line);this.homeMap();
  rr(c,16,430,358,92,18,UI.surface,UI.line);text(c,'历史最佳',32,454,11,UI.muted,'left',800);
  metric(c,compact(this.best),32,489,28,UI.ink,'left',900);c.strokeStyle=UI.line;c.beginPath();c.moveTo(288,446);c.lineTo(288,506);c.stroke();
  rankIcon(c,334,457,UI.teal,20);text(c,'战绩',334,490,12,UI.teal,'center',900);
  this.collectionEntries(false);
  rr(c,16,690,358,64,18,UI.orange,'#D8732F');icon(c,'play',48,722,'#FFFFFF',20);
  text(c,this.wave>0?'继续防守':'进入防线',88,713,18,'#FFFFFF','left',900);text(c,this.wave>0?'返回当前布防现场':'部署装置后启动波次',88,737,10,'#FFF6EF','left',750);
  text(c,'→',342,722,22,'#FFFFFF','center',800);
if(this.sidebarSupported&&!this.sidebarRewardClaimed){var fx=this.sidebarFloatX,fy=this.sidebarFloatY,ready=this.sidebarReturned,leftDock=fx<163,sideFill=ready?'#FFF1E3':UI.surface,sideStroke=ready?'#EFA566':UI.line;rr(c,fx,fy,64,64,20,sideFill,sideStroke);icon(c,'money',fx+32,fy+24,ready?UI.orange:UI.teal,19);text(c,'侧栏补给',fx+32,fy+50,8,UI.ink,'center',900);rr(c,fx+36,fy-8,36,22,11,ready?UI.orange:'#16483F',ready?'#D8732F':null);text(c,ready?'领取':'+80',fx+54,fy+3,8,'#FFFFFF','center',900);if(ready){var tipX=leftDock?fx+70:fx-60,tipTextX=leftDock?fx+97:fx-33;rr(c,tipX,fy+12,54,30,12,UI.orange,'#D8732F');text(c,'可领取',tipTextX,fy+27,8,'#FFFFFF','center',900);c.fillStyle=UI.orange;c.beginPath();if(leftDock){c.moveTo(fx+70,fy+22);c.lineTo(fx+62,fy+27);c.lineTo(fx+70,fy+32);}else{c.moveTo(fx-6,fy+22);c.lineTo(fx+2,fy+27);c.lineTo(fx-6,fy+32);}c.closePath();c.fill();}}if(this.sidebarGuideOpen)this.sidebarGuide();
};
Game.prototype.homeMap=function(){var c=this.c,x0=33,y0=188,cell=25,mid=cell/2;for(var r=0;r<8;r++)for(var col=0;col<13;col++){var x=x0+col*cell,y=y0+r*cell,isStart=col===0&&r===0,isEnd=col===12&&r===7;rr(c,x+1,y+1,23,23,6,isStart?'#DDF3EB':isEnd?'#FFF0E6':(r+col)%2?'#F1F6F3':'#EBF2EE',isStart?'#58A991':isEnd?'#E8843E':'#D9E5E0');}var walls=[[3,1],[3,2],[3,3],[4,3],[7,2],[8,2],[8,3],[8,4],[10,5]],types=['#78928D','#51AFC0','#E99A52','#8A79C6'];for(var i=0;i<walls.length;i++){var px=x0+walls[i][0]*cell+mid,py=y0+walls[i][1]*cell+mid;c.fillStyle=UI.surface;c.strokeStyle=types[i%types.length];c.lineWidth=2;c.beginPath();c.arc(px,py,7,0,TAU);c.fill();c.stroke();}this.homeEnemies(x0,y0,cell);};
var leaderboardCommand=function(){this.ensureProfile();var c=this.c,scores=this.leaderboardScores();c.fillStyle=UI.bg;c.fillRect(0,0,390,780);this.pageHeader('战绩中心','每名玩家仅记录周期最高成绩');var tabs=[['周榜','week'],['月榜','month'],['总榜','all']];for(var i=0;i<3;i++){var x=16+i*120,on=this.leaderboardTab===tabs[i][1];rr(c,x,100,112,54,15,on?UI.tealSoft:UI.surface,on?UI.teal:UI.line);text(c,tabs[i][0],x+56,127,11,on?UI.teal:UI.muted,'center',850);}text(c,'排名 / 玩家',24,184,8,UI.muted,'left',800);text(c,'最高得分',358,184,8,UI.muted,'right',800);if(!scores.length){rr(c,16,204,358,180,20,UI.surface,UI.line);rankIcon(c,195,252,UI.teal,22);text(c,'还没有战绩',195,298,16,UI.ink,'center',900);text(c,'完成一次挑战后，最高成绩会出现在这里',195,329,9,UI.muted,'center',750);return;}for(i=0;i<scores.length;i++){var y=204+i*94,row=scores[i],name=row.nickName||this.localNickName,motto=row.motto||this.localMotto,zone=DEFENSE_ZONES.indexOf(row.zone)>=0?row.zone:this.localDefenseZone;rr(c,16,y,358,82,17,UI.surface,i<3?'#B8CCC5':UI.line);rr(c,26,y+21,30,30,10,i===0?UI.orangeSoft:UI.soft);metric(c,''+(i+1),41,y+36,10,i===0?UI.orange:UI.teal,'center',900);this.drawIdentityAvatar(78,y+34,20);text(c,shortText(name,10),108,y+22,12,UI.ink,'left',900);text(c,shortText(motto,15),108,y+43,8,UI.muted,'left',750);metric(c,compact(row.score),356,y+25,14,UI.orange,'right',900);text(c,zone+' · 第'+(+row.wave||0)+'波 · '+durationText(row.duration),108,y+65,8,UI.teal,'left',800);}};
var hudLegacy=function(){var c=this.c,alive=0;for(var i=0;i<this.enemies.length;i++)if(!this.enemies[i].dead)alive++;var remaining=alive+this.spawnLeft,status=this.running&&!this.paused?UI.red:UI.teal;c.fillStyle=UI.bg;c.fillRect(0,0,390,138);text(c,'防线状态',16,18,8,UI.muted,'left',800);rr(c,86,8,96,24,12,this.running&&!this.paused?'#FCE8EB':UI.tealSoft,this.running&&!this.paused?'#E6B2BB':'#B7D8CD');text(c,this.running&&!this.paused?'波次进行中':'可调整布防',134,20,8,status,'center',900);rr(c,14,42,362,86,16,UI.surface,UI.line);text(c,'波次',28,58,8,UI.muted,'left',700);metric(c,this.wave<10?'0'+this.wave:''+this.wave,28,88,22,UI.ink,'left',900);c.fillStyle=status;c.fillRect(89,56,3,44);var cells=[['侵体',remaining,108,60,status],['布防资金',this.energy,244,60,UI.orange],['生命',this.core,108,92,UI.red],['积分',compact(this.score),244,92,UI.teal]];for(i=0;i<cells.length;i++){text(c,cells[i][0],cells[i][2],cells[i][3],8,UI.muted,'left',700);metric(c,''+cells[i][1],cells[i][2]+54,cells[i][3],13,cells[i][4],'right',850);}};
var accountCommand=function(){if(this.profileEditor)return;this.ensureProfile();var c=this.c,name=this.localNickName,linked=!!this.profile,safePlatformName=linked?platformPlayerName(this.profile.nickName):'',platformName=linked&&this.profile.nickName?this.profile.nickName:'尚未关联平台资料',adopted=!!(linked&&safePlatformName&&this.localNickName===safePlatformName&&this.localAvatarUrl===String(this.profile.avatarUrl||''));c.fillStyle=UI.bg;c.fillRect(0,0,390,780);this.pageHeader('账户资料','管理排行榜展示资料');rr(c,16,92,358,202,22,UI.surface,UI.line);this.drawIdentityAvatar(76,154,40);text(c,name,136,122,19,UI.ink,'left',900);text(c,adopted?'正在使用平台身份':linked?'平台已关联':'本地身份',136,151,9,adopted||linked?UI.teal:UI.muted,'left',850);text(c,shortText(this.localMotto,18),136,178,9,UI.ink,'left',750);text(c,'所属地 · '+this.localDefenseZone,136,201,8,UI.muted,'left',750);rr(c,232,232,126,46,15,UI.tealSoft,'#B7D8CD');text(c,'编辑资料',295,255,11,UI.teal,'center',900);text(c,'平台资料',20,318,9,UI.muted,'left',850);rr(c,16,330,358,190,20,UI.surface,UI.line);this.drawPlatformAvatar(66,380,26);text(c,'平台身份',106,360,8,UI.muted,'left',750);text(c,platformName,106,382,12,UI.ink,'left',850);text(c,adopted?'当前头像和昵称已同步':linked?'头像与昵称一起采用':'授权后可采用头像和昵称',106,404,8,adopted?UI.teal:UI.muted,'left',700);rr(c,264,356,94,48,13,linked?UI.tealSoft:UI.soft,linked?'#B7D8CD':UI.line);text(c,adopted?'已采用':linked?'采用身份':'关联平台',311,380,10,linked?UI.teal:UI.muted,'center',850);c.fillStyle=UI.soft;c.fillRect(32,430,326,1);text(c,this.profileBusy?'正在连接…':linked?'更新平台资料':'获取平台资料',32,474,11,linked?UI.ink:UI.teal,'left',900);text(c,this.profileBusy?'请稍候':'立即更新',350,474,10,UI.teal,'right',850);text(c,this.profileStatus||'平台头像和昵称只会一起采用',195,554,9,/不可用|不支持|未授权|请先/.test(this.profileStatus||'')?UI.red:UI.muted,'center',750);rr(c,16,704,358,56,16,UI.surface,UI.line);text(c,'返回首页',195,732,14,UI.teal,'center',900);};
var tacticalTouch=routedTouch;
function immediateTouch(game,x,y,phase){if(game.screen==='home'){if(phase!=='start')return;if(game.sidebarGuideOpen){if(x>=326&&x<366&&y>=154&&y<204||x<24||x>=366||y<154||y>=592){game.sidebarGuideOpen=false;return;}if(x>=48&&x<342&&y>=514&&y<566){game.sidebarGuideOpen=false;game.p.navigateSidebar(function(ok){if(!ok)game.notify('当前无法打开侧边栏',1.5);});return;}return;}if(x>=16&&x<192&&y>=16&&y<68){game.screen='account';game.p.vibrate();return;}if(x>=296&&x<374&&y>=430&&y<522){game.screen='leaderboard';game.p.vibrate();return;}if(x>=16&&x<80&&y>=690&&y<754){game.screen='settings';game.p.vibrate();return;}if(x>=90&&x<374&&y>=690&&y<754){game.screen='game';game.tutorial=false;if(game.wave>0)game.notify('战术暂停',1.2);game.p.vibrate();if(!game.settings.tutorialSeen&&game.wave===0)game.tutorialPrompt=true;return;}return;}if(game.screen==='account'&&!game.profileEditor&&phase==='start'){if(y>=310&&y<410){if(!game.profile)game.requestProfile();else game.usePlatformIdentity();return;}if(y>=410&&y<500){game.requestProfile();return;}}tacticalTouch.call(game,x,y,phase);}
var immediateTouchBeforeIdentityLayout=immediateTouch;
immediateTouch=function(game,x,y,phase){
  if(game.screen==='account'&&!game.profileEditor&&phase==='start'){
    if(rcHit(RC2.accountBack,x,y)||rcHit(RC2.accountHome,x,y)){game.screen='home';game.p.vibrate();return;}
    if(rcHit(RC2.accountEdit,x,y)){game.beginIdentityEdit();game.zonePickerOpen=false;game.p.vibrate();return;}
    if(rcHit(RC2.accountConnect,x,y)){game.requestProfile(true);return;}return;
  }immediateTouchBeforeIdentityLayout(game,x,y,phase);
};

var immediateTouchBeforeIntegratedSettings=immediateTouch;
immediateTouch=function(game,x,y,phase){if(game.screen==='home'&&!game.sidebarGuideOpen&&phase==='start'){if(x>=176&&x<228&&y>=16&&y<68){game.screen='settings';game.p.vibrate();return;}if(x>=16&&x<164&&y>=16&&y<68){game.screen='account';game.p.vibrate();return;}if(x>=164&&x<236&&y>=16&&y<68)return;if(x>=16&&x<374&&y>=690&&y<754){game.screen='game';game.tutorial=false;if(game.wave>0)game.notify('战术暂停',1.2);game.p.vibrate();if(!game.settings.tutorialSeen&&game.wave===0)game.tutorialPrompt=true;return;}}immediateTouchBeforeIntegratedSettings(game,x,y,phase);};
Game.prototype.isContinuousTouch=function(y){return this.screen==='settings'&&this.settingsTab==='audio'&&(y>=318&&y<374||y>=500&&y<556);};
Game.prototype.canStartDeviceDrag=function(x,y){return this.canUseDeviceBar()&&rcHit(DEVICE_BAR.rail,x,y);};
var pressTouch=function(x,y,phase){phase=phase||'start';if(this.screen==='account'&&this.profileEditor){var gesture=this.profileEditorGesture;if(phase==='cancel'){this.profileEditorGesture=null;return;}if(phase==='start'){this.profileEditorGesture={startX:x,startY:y,startScroll:this.profileEditorScroll||0,moved:false};return;}if(!gesture)return;var gdx=x-gesture.startX,gdy=y-gesture.startY;if(gdx*gdx+gdy*gdy>100)gesture.moved=true;if(phase==='move'&&gesture.moved)this.profileEditorScroll=clamp(gesture.startScroll-gdy,0,340);if(phase==='end'){this.profileEditorGesture=null;if(!gesture.moved)this.profileEditorTap(x,y);}return;}var press=this.pressState;if(phase==='cancel'){this.pressState=null;if(this.deviceDrag)this.deviceDrag=null;return;}if(phase==='start'){this.pressState={startX:x,startY:y,x:x,y:y,screen:this.screen,cancelled:false,continuous:this.isContinuousTouch(y),deviceDrag:this.canStartDeviceDrag(x,y)};if(this.pressState.continuous||this.pressState.deviceDrag)immediateTouch(this,x,y,'start');return;}if(!press)return;if(press.deviceDrag){immediateTouch(this,x,y,phase);if(phase==='end')this.pressState=null;return;}if(press.continuous){if(phase==='move')immediateTouch(this,x,y,'move');if(phase==='end')this.pressState=null;return;}press.x=x;press.y=y;var dx=x-press.startX,dy=y-press.startY;if(this.screen!==press.screen||dx*dx+dy*dy>100)press.cancelled=true;if(phase==='end'){this.pressState=null;if(!press.cancelled)immediateTouch(this,x,y,'start');}};
var drawWithoutPressFeedback=drawScene;
var drawPressFeedback=function(){drawWithoutPressFeedback.call(this);var press=this.pressState;if(!press||press.cancelled||press.deviceDrag)return;var c=this.c,s=this.scale;c.save();c.setTransform(this.p.dpr*s,0,0,this.p.dpr*s,this.p.dpr*this.ox,this.p.dpr*this.oy);c.globalAlpha=.28;pxBox(c,press.x-14,press.y-14,28,28,UI.tealSoft,UI.line,null,2);c.restore();};
var bottomWithoutRangeProgression=bottomCardsRenderer;
var bottomRangeRenderer=function(){bottomWithoutRangeProgression.call(this);var c=this.c;if(this.inspect){var it=this.inspect,isWall=it.cfg.attack==='block';if(isWall)return;c.fillStyle='#FFFFFF';c.fillRect(44,583,314,18);var damage=Math.round(this.towerDamage(it.cfg,it.level)),attackSpeed=(1/it.cfg.rate).toFixed(2)+'/秒',attackRange=this.towerRange(it.cfg,it.level);text(c,'伤害 '+damage+' · 攻速 '+attackSpeed+' · 射程 '+attackRange,47,592,8,'#607E76','left',800);return;}if(this.inspectEnemy)return;c.save();c.beginPath();c.rect(8,566,DEVICE_VIEW_W,104);c.clip();for(var i=0;i<CFG.towers.length;i++){var t=CFG.towers[i];if(t.attack==='block')continue;var x=8+i*DEVICE_CARD_STEP-this.deviceScroll,level=this.placementLevels[t.id]||1,on=t.id===this.selected,cost=this.placementCost(t,level),canBuy=this.energy>=cost,bg=on?'#FFFFFF':canBuy?'#F9FCFB':'#EDF1EF',muted=canBuy?'#607E76':'#9AA8A3';c.fillStyle=bg;c.fillRect(x+8,622,128,13);text(c,'伤害 '+Math.round(this.towerDamage(t,level))+' · 射程 '+this.towerRange(t,level),x+8,629,7,muted,'left',800);}c.restore();};
// The selected identity-card mock is the visual source of truth. Keep this
// renderer readable because draw and touch geometry must evolve together.
var profileEditorCommandMap=function(){
  var c=this.c,name=this.localNickName,list=this.p.getScores?this.p.getScores():[],bestRow=null;
  var scroll=0;this.profileEditorScroll=0;this.profileAvatarScroll=clamp(this.profileAvatarScroll||0,0,288);this.profileHomeScroll=clamp(this.profileHomeScroll||0,0,610);
  if(!this.identityArtRequested){
    this.identityArtRequested=true;this.identityMapImage=null;this.identityCardCityImage=null;this.homelandLandscapeImage=null;
    var self=this;
    if(this.p.loadImage){
      this.p.loadImage('assets/identity-map-reference-v3.png',function(image){self.identityMapImage=image;});
      this.p.loadImage('assets/identity-card-city-v3.png',function(image){self.identityCardCityImage=image;});
      this.p.loadImage('assets/homeland-landscape-v2.png',function(image){self.homelandLandscapeImage=image;});
    }
  }
  for(var bi=0;bi<list.length;bi++)if(!bestRow||(+list[bi].score||0)>(+bestRow.score||0))bestRow=list[bi];
  c.save();c.beginPath();c.rect(0,0,390,780);c.clip();c.fillStyle='#F7FAF7';c.fillRect(0,0,390,780);c.translate(0,-scroll);
  this.ambientRoutes();
  if(this.identityMapImage){c.save();c.globalAlpha=.78;c.drawImage(this.identityMapImage,0,0,this.identityMapImage.width,this.identityMapImage.height,186,0,204,124);c.restore();}
  c.strokeStyle='#16483F';c.lineWidth=3;c.lineCap='round';c.beginPath();c.moveTo(45,32);c.lineTo(28,49);c.lineTo(45,66);c.stroke();
  text(c,'沉浸式身份卡',64,52,24,'#16483F','left',900);text(c,'这是你在排行榜中的形象',64,82,10,'#718B83','left',750);c.translate(0,30);
  rr(c,12,117,366,282,26,'rgba(31,83,70,.12)',null);rr(c,16,110,358,282,24,'#FFFEFB','#B8D0C8');
  this.drawIdentityAvatarCircle(106,216,70);
  text(c,fitText(c,name,132,22,900),198,139,22,'#123F37','left',900);rr(c,334,123,28,28,9,'#F7FAF7','#BFD3CC');editIcon(c,348,137,UI.teal,14);
  c.strokeStyle='#D9E4E0';c.lineWidth=1;c.beginPath();c.moveTo(198,165);c.lineTo(356,165);c.moveTo(248,174);c.lineTo(248,278);c.moveTo(198,221);c.lineTo(356,221);c.stroke();
  text(c,'座右铭',198,198,9,'#65A895','left',850);text(c,fitText(c,this.localMotto,86,12,850),244,198,12,'#173D35','left',850);rr(c,334,184,28,28,9,'#F7FAF7','#BFD3CC');editIcon(c,348,198,UI.teal,14);
  text(c,'虚拟家园',198,255,9,'#65A895','left',850);text(c,this.localDefenseZone,262,255,15,'#173D35','left',900);
  c.save();rr(c,34,306,322,74,17,'#F7FAF7','#D5E1DC');c.beginPath();c.rect(35,307,320,72);c.clip();if(this.identityCardCityImage){c.globalAlpha=.1;c.drawImage(this.identityCardCityImage,0,0,this.identityCardCityImage.width,this.identityCardCityImage.height,174,306,182,74);}c.restore();
  rankIcon(c,57,328,UI.teal,16);text(c,'防守记录',78,328,9,UI.ink,'left',900);
  c.strokeStyle='#BED2CB';c.lineWidth=2;if(c.setLineDash)c.setLineDash([5,5]);c.beginPath();c.moveTo(72,358);c.quadraticCurveTo(104,367,133,356);c.stroke();if(c.setLineDash)c.setLineDash([]);c.strokeStyle=UI.teal;c.lineWidth=3;c.beginPath();c.moveTo(133,356);c.quadraticCurveTo(182,337,226,348);c.quadraticCurveTo(271,361,322,342);c.stroke();
  c.fillStyle=UI.orange;c.beginPath();c.moveTo(65,351);c.lineTo(77,358);c.lineTo(65,365);c.closePath();c.fill();for(var ni=0;ni<3;ni++){c.fillStyle=ni===2?'#16483F':'#F7FAF7';c.strokeStyle=UI.teal;c.lineWidth=2;c.beginPath();c.arc(151+ni*78,ni===0?351:ni===1?348:342,ni===2?7:5,0,TAU);c.fill();c.stroke();}
  if(bestRow){text(c,'第 '+(+bestRow.wave||0)+' 波',338,327,9,UI.ink,'right',900);text(c,durationText(bestRow.duration),338,362,9,UI.muted,'right',850);}else text(c,'完成首局后点亮',338,362,9,UI.ink,'right',900);
  function sectionBadge(n,y){rr(c,18,y-17,30,30,9,UI.teal,null);text(c,''+n,33,y-2,13,'#FFFFFF','center',900);}
  sectionBadge(1,432);text(c,'更换头像',58,430,15,UI.ink,'left',900);text(c,'更多头像 ›',368,430,9,UI.muted,'right',800);
  c.save();c.beginPath();c.rect(16,454,358,72);c.clip();c.translate(-this.profileAvatarScroll,0);for(var i=0;i<8;i++){var ax=21+i*82,on=!this.localAvatarUrl&&this.localAvatarStyle===i;rr(c,ax,454,72,72,15,on?'#F7FFFC':UI.surface,on?UI.teal:UI.line);this.drawLocalAvatar(ax+36,490,29,i);if(on){c.fillStyle=UI.teal;c.beginPath();c.arc(ax+58,465,9,0,TAU);c.fill();text(c,'✓',ax+58,465,8,'#FFFFFF','center',900);}}c.restore();if(this.profileAvatarScroll<282)text(c,'›',382,490,18,UI.teal,'right',900);
  sectionBadge(2,568);text(c,'选择虚拟家园',58,566,15,UI.ink,'left',900);
  c.save();c.beginPath();c.rect(16,590,358,54);c.clip();c.translate(-this.profileHomeScroll,0);
  for(i=0;i<DEFENSE_ZONES.length;i++){
    var zx=16+i*122,zy=590,zon=DEFENSE_ZONES[i],selected=this.localDefenseZone===zon;
    rr(c,zx,zy,114,52,14,selected?'#F2FBF7':UI.surface,selected?UI.teal:UI.line);
    if(this.homelandLandscapeImage){c.save();c.beginPath();c.rect(zx+2,zy+2,110,48);c.clip();c.globalAlpha=selected ? .5 : .3;var sw=this.homelandLandscapeImage.width/4,si=i%4;c.drawImage(this.homelandLandscapeImage,si*sw,0,sw,this.homelandLandscapeImage.height,zx,zy+12,114,40);c.restore();}
    c.fillStyle='rgba(255,255,255,.58)';c.fillRect(zx+1,zy+1,112,22);text(c,zon,zx+18,zy+16,10,selected?UI.teal:UI.ink,'left',900);
    if(selected){c.fillStyle=UI.teal;c.beginPath();c.arc(zx+99,zy+11,8,0,TAU);c.fill();text(c,'✓',zx+99,zy+11,7,'#FFFFFF','center',900);}
  }c.restore();
  if(this.profileHomeScroll<604){text(c,'›',382,617,18,UI.teal,'right',900);}
  rr(c,16,658,358,58,17,UI.teal,'#176D5C');text(c,'完成编辑',195,687,17,'#FFFFFF','center',900);c.fillStyle=UI.orange;c.beginPath();c.moveTo(344,716);c.lineTo(374,686);c.lineTo(374,716);c.closePath();c.fill();text(c,'保存后将作为你在排行榜中的形象展示',195,741,9,UI.muted,'center',750);
  c.restore();
};
var profileEditorTapCommandMap=function(x,y){var cy=y;if(cy>=16&&cy<88){this.profileEditor=false;this.profileEditorScroll=0;this.p.vibrate();return;}if(x>=322&&x<378&&cy>=145&&cy<189){this.editPlayerNickname();return;}if(x>=322&&x<378&&cy>=213&&cy<257){this.editPlayerMotto();return;}if(cy>=454&&cy<526){var ah=x+(this.profileAvatarScroll||0)-21,ai=Math.floor(ah/82);if(ai>=0&&ai<8&&ah-ai*82<=72){this.selectDefaultAvatar(ai);return;}}if(cy>=590&&cy<644){var hx=x+(this.profileHomeScroll||0)-16,hi=Math.floor(hx/122);if(hi>=0&&hi<DEFENSE_ZONES.length&&hx-hi*122<=114){this.localDefenseZone=DEFENSE_ZONES[hi];this.persistIdentity();this.p.playSfx('tap');this.p.vibrate();return;}}if(cy>=658&&cy<716){this.profileEditor=false;this.profileEditorScroll=0;this.p.playSfx('upgrade');this.p.vibrate();}};
var touchWithoutProfileHomeCarousel=pressTouch;
var sidebarTouch=function(x,y,phase){phase=phase||'start';if(this.screen==='home'&&this.sidebarSupported&&!this.sidebarRewardClaimed&&!this.sidebarGuideOpen){var floatDrag=this.sidebarFloatDrag,leftDock=this.sidebarFloatX<163,hitLeft=this.sidebarReturned&&!leftDock?this.sidebarFloatX-60:this.sidebarFloatX,hitRight=this.sidebarReturned&&leftDock?this.sidebarFloatX+124:this.sidebarFloatX+72,hitTop=this.sidebarFloatY-8,hitBottom=this.sidebarFloatY+64;if(phase==='cancel'&&floatDrag){this.sidebarFloatDrag=null;return;}if(phase==='start'&&x>=hitLeft&&x<hitRight&&y>=hitTop&&y<hitBottom){this.sidebarFloatDrag={startX:x,startY:y,floatX:this.sidebarFloatX,floatY:this.sidebarFloatY,moved:false};return;}if(floatDrag){var fdx=x-floatDrag.startX,fdy=y-floatDrag.startY;if(fdx*fdx+fdy*fdy>100)floatDrag.moved=true;if(phase==='move'&&floatDrag.moved){this.sidebarFloatX=clamp(floatDrag.floatX+fdx,8,318);this.sidebarFloatY=clamp(floatDrag.floatY+fdy,92,610);}if(phase==='end'){this.sidebarFloatDrag=null;if(floatDrag.moved){this.sidebarFloatX=this.sidebarFloatX<163?8:318;this.settings.sidebarFloatX=this.sidebarFloatX;this.settings.sidebarFloatY=Math.round(this.sidebarFloatY);this.saveSettings();}else if(this.sidebarReturned)this.claimSidebarReward();else{this.sidebarGuideOpen=true;this.p.playSfx('tap');}}return;}}if(this.screen==='account'&&this.profileEditor){var gesture=this.profileEditorGesture;if(phase==='cancel'){this.profileEditorGesture=null;return;}if(phase==='start'){this.profileEditorGesture={startX:x,startY:y,startAvatarScroll:this.profileAvatarScroll||0,startHomeScroll:this.profileHomeScroll||0,avatarRail:y>=454&&y<526,homeRail:y>=590&&y<644,moved:false,axis:''};return;}if(!gesture)return;var dx=x-gesture.startX,dy=y-gesture.startY;if(dx*dx+dy*dy>100){gesture.moved=true;if(!gesture.axis)gesture.axis=(gesture.avatarRail||gesture.homeRail)&&Math.abs(dx)>Math.abs(dy)?'horizontal':'vertical';}if(phase==='move'&&gesture.moved&&gesture.axis==='horizontal'){if(gesture.avatarRail)this.profileAvatarScroll=clamp(gesture.startAvatarScroll-dx,0,288);else this.profileHomeScroll=clamp(gesture.startHomeScroll-dx,0,610);}if(phase==='end'){this.profileEditorGesture=null;if(!gesture.moved)this.profileEditorTap(x,y);}return;}touchWithoutProfileHomeCarousel.call(this,x,y,phase);};
var accountPageWithoutEditorScrollReset=accountCommand;
var accountReset=function(){if(!this.profileEditor)this.profileEditorScroll=0;return accountPageWithoutEditorScrollReset.call(this);};

// Route Command UI refinement layer. These final overrides intentionally sit beside the
// effective drawing methods so visual geometry and touch geometry remain easy to audit.
var previousPresentation_hud=function(){var c=this.c,alive=0;for(var i=0;i<this.enemies.length;i++)if(!this.enemies[i].dead)alive++;var remaining=alive+this.spawnLeft,status=this.running&&!this.paused?UI.red:UI.teal;c.fillStyle=UI.bg;c.fillRect(0,0,390,138);rr(c,16,42,358,86,18,UI.surface,UI.line);c.fillStyle=status;c.fillRect(16,60,4,50);text(c,'波次',34,63,9,UI.muted,'left',800);metric(c,this.wave<10?'0'+this.wave:''+this.wave,34,96,28,UI.ink,'left',900);c.strokeStyle='#D9E6E1';c.lineWidth=1;c.beginPath();c.moveTo(96,56);c.lineTo(96,114);c.moveTo(236,56);c.lineTo(236,114);c.moveTo(108,85);c.lineTo(362,85);c.stroke();var cells=[['侵体',remaining,112,220,64,status],['布防资金',this.energy,250,360,64,UI.orange],['生命',this.core,112,220,104,UI.red],['积分',compact(this.score),250,360,104,UI.teal]];for(i=0;i<cells.length;i++){text(c,cells[i][0],cells[i][2],cells[i][4],9,UI.muted,'left',800);metric(c,''+cells[i][1],cells[i][3],cells[i][4],16,cells[i][5],'right',900);}};

var routeCommandBottomBase=bottomRangeRenderer;
var previousPresentation_bottom=function(){
  routeCommandBottomBase.call(this);var c=this.c;c.fillStyle=UI.bg;c.fillRect(0,550,390,16);
  c.fillStyle='#FFFFFF';c.fillRect(18,704,30,25);icon(c,'home',33,716,UI.teal,18);c.fillRect(74,704,30,25);icon(c,'restart',89,716,UI.teal,18);
  if(this.inspect||this.inspectEnemy)return;
  c.fillStyle=UI.bg;c.fillRect(0,566,390,110);c.save();c.beginPath();c.rect(8,566,DEVICE_VIEW_W,108);c.clip();
  for(var i=0;i<CFG.towers.length;i++){
    var t=CFG.towers[i],x=8+i*DEVICE_CARD_STEP-this.deviceScroll,isBlock=t.attack==='block',level=isBlock?1:(this.placementLevels[t.id]||1),on=t.id===this.selected,cost=this.placementCost(t,level),afford=this.energy>=cost,fg=afford?UI.ink:UI.muted;
    rr(c,x,566,144,108,14,on?UI.surface:UI.soft,on?t.color:UI.line);
    this.paintDevice(t,x+18,585,19);text(c,fitText(c,translate(t.name,ACTIVE_LANG),102,12,900),x+36,585,12,fg,'left',900);
    text(c,fitText(c,isBlock?'路线改造':'伤 '+compact(this.towerDamage(t,level))+' / 距 '+this.towerRange(t,level),128,9,800),x+8,607,9,UI.muted,'left',800);
    text(c,'放置费用',x+8,620,9,UI.muted,'left',750);metric(c,compact(cost),x+134,620,9,afford?UI.orange:UI.muted,'right',900);
    rr(c,x+4,628,136,44,10,on?t.color:UI.surface,on?t.color:UI.line);
    if(isBlock)text(c,'固定等级 · 路障',x+72,650,10,on?'#FFFFFF':UI.muted,'center',850);
    else{
      c.strokeStyle=on?'rgba(255,255,255,.4)':UI.line;c.lineWidth=1;c.beginPath();c.moveTo(x+49,636);c.lineTo(x+49,664);c.moveTo(x+94,636);c.lineTo(x+94,664);c.stroke();
      text(c,'−',x+26,650,18,on?'#FFFFFF':level>1?UI.teal:UI.muted,'center',900);
      text(c,fitText(c,'Lv.'+level,40,10,850),x+72,650,10,on?'#FFFFFF':UI.ink,'center',850);
      text(c,'+',x+117,650,18,on?'#FFFFFF':UI.teal,'center',900);
    }
  }c.restore();
};

var previousPresentation_home=homeBaseRenderer;
Game.prototype.homeEnemies=function(x0,y0,cell){var c=this.c,mid=cell/2,route=[[0,0],[2,0],[2,4],[5,4],[5,6],[9,6],[9,7],[12,7]],points=[],segments=[],total=0;for(var i=0;i<route.length;i++)points.push({x:x0+route[i][0]*cell+mid,y:y0+route[i][1]*cell+mid});for(i=0;i<points.length-1;i++){var dx=points[i+1].x-points[i].x,dy=points[i+1].y-points[i].y,len=Math.sqrt(dx*dx+dy*dy);segments.push({a:points[i],dx:dx,dy:dy,len:len});total+=len;}var colors=['#FF6F85','#FF9B6A','#A68AE8'];for(var e=0;e<3;e++){var travel=(this.settings.reduceMotion?e*total/3:this.time*28+e*total/3)%total,seg=segments[0];for(i=0;i<segments.length;i++){if(travel<=segments[i].len){seg=segments[i];break;}travel-=segments[i].len;}var ratio=travel/seg.len,px=seg.a.x+seg.dx*ratio,py=seg.a.y+seg.dy*ratio,angle=Math.atan2(seg.dy,seg.dx),color=colors[e];c.save();c.globalAlpha=.18;c.fillStyle=color;c.beginPath();c.arc(px-Math.cos(angle)*6,py-Math.sin(angle)*6,4,0,TAU);c.fill();c.globalAlpha=1;c.translate(px,py);c.rotate(angle+Math.PI/2);c.fillStyle='#FFFFFF';c.strokeStyle=color;c.lineWidth=1.4;c.beginPath();c.moveTo(0,-5);c.lineTo(4,4);c.lineTo(-4,4);c.closePath();c.fill();c.stroke();c.fillStyle=color;c.beginPath();c.arc(0,1,1.5,0,TAU);c.fill();c.restore();}};

var routeCommandAccountBase=accountReset;
function identityHeader(game,title){var c=game.c;c.strokeStyle=UI.ink;c.lineWidth=2.5;c.beginPath();c.moveTo(30,26);c.lineTo(20,38);c.lineTo(30,50);c.stroke();text(c,'返回',40,38,13,UI.ink,'left',850);text(c,title,195,38,21,UI.ink,'center',900);}
var previousPresentation_accountPage=function(){
  if(this.profileEditor)return;this.ensureProfile();var c=this.c;c.fillStyle=UI.bg;c.fillRect(0,0,390,780);this.paintProfile();identityHeader(this,'玩家资料');
  this.drawIdentityAvatar(195,178,54);
  text(c,fitText(c,this.localNickName,342,28,900),195,270,28,UI.ink,'center',900);
  text(c,fitText(c,this.localMotto,326,17,750),195,309,17,UI.muted,'center',750);
  text(c,this.localDefenseZone,195,348,14,UI.muted,'center',750);
  rr(c,107,380,176,48,10,UI.teal,null);editIcon(c,135,404,'#FFFFFF',18);text(c,'编辑资料',207,404,15,'#FFFFFF','center',850);
  this.collectionEntries(true);this.collectionAccountRecord();
  rr(c,24,490,342,64,12,UI.surface,null);icon(c,'restart',54,522,UI.teal,24);text(c,this.profileBusy?'正在更新…':'从抖音更新头像和昵称',84,522,14,UI.ink,'left',850);text(c,'›',344,522,25,UI.ink,'center',750);
  if(this.profileStatus&&this.profileStatus!=='玩家资料')text(c,fitText(c,this.profileStatus,326,11,750),195,579,11,UI.muted,'center',750);
  rr(c,24,718,342,48,9,null,UI.teal);icon(c,'home',137,742,UI.teal,19);text(c,'返回首页',215,742,16,UI.teal,'center',850);
};
var routeCommandLeaderboardBase=leaderboardCommand;
var leaderboardRoute=function(){routeCommandLeaderboardBase.call(this);var c=this.c,onIndex=this.leaderboardTab==='week'?0:this.leaderboardTab==='month'?1:2;c.fillStyle=UI.teal;c.fillRect(32+onIndex*120,150,80,3);};

var routeCommandSettingsBase=settingsPageBaseRenderer;
var previousPresentation_settingsPage=function(){routeCommandSettingsBase.call(this);var c=this.c,index=['audio','battle','display','system'].indexOf(this.settingsTab);c.fillStyle=UI.teal;c.fillRect(32+index*90,130,53,3);};

var routeCommandGuideBase=guideBaseRenderer;
var previousPresentation_guide=function(){routeCommandGuideBase.call(this);var c=this.c,step=clamp(this.tutorial||1,1,3);rr(c,24,18,88,30,12,'rgba(255,255,255,.94)','#BFD4CD');text(c,'引导 '+step+' / 3',68,33,10,UI.teal,'center',900);};

function routeDialogSignal(c,y,color){c.strokeStyle='#C4D9D1';c.lineWidth=2;c.beginPath();c.moveTo(126,y);c.lineTo(174,y);c.lineTo(174,y-8);c.lineTo(216,y-8);c.lineTo(216,y);c.lineTo(264,y);c.stroke();c.fillStyle=color;c.beginPath();c.arc(264,y,4,0,TAU);c.fill();}
var routeCommandRestartBase=restartConfirmBase;
var previousPresentation_restartConfirm=function(){routeCommandRestartBase.call(this);routeDialogSignal(this.c,430,UI.red);};
var routeCommandRecycleBase=recycleConfirmBase;
var previousPresentation_recycleConfirm=function(){routeCommandRecycleBase.call(this);routeDialogSignal(this.c,430,UI.red);};
var routeCommandHomeConfirmBase=homeConfirmBase;
var previousPresentation_homeConfirm=function(){routeCommandHomeConfirmBase.call(this);routeDialogSignal(this.c,430,UI.orange);};
var routeCommandResultBase=resultBaseRenderer;
var previousPresentation_modal=function(){routeCommandResultBase.call(this);routeDialogSignal(this.c,496,UI.orange);};

var routeCommandLoadingBase=loadingBaseRenderer;
var previousPresentation_loading=function(){routeCommandLoadingBase.call(this);var c=this.c,state=this.startup||{};if(state.failed){rr(c,44,548,302,44,13,'#FFF1F2','#D99BA6');nativeText(c,'重新执行启动检查',195,570,11,UI.red,'center',900);}};

var routeCommandPageHeaderBase=pageHeaderBaseRenderer;
var previousPresentation_pageHeader=function(title,subtitle){
  var c=this.c;rr(c,16,16,52,52,15,UI.surface,UI.line);c.strokeStyle=UI.ink;c.lineWidth=2;c.beginPath();c.moveTo(47,30);c.lineTo(36,42);c.lineTo(47,54);c.stroke();
  text(c,title,84,34,22,UI.ink,'left',900);text(c,fitText(c,translate(subtitle,ACTIVE_LANG),286,10,750),84,62,10,UI.muted,'left',750);
};

var routeCommandDrawBase=drawPressFeedback;
var drawRouteTransition=function(){var previous=this.routeCommandScreen;if(previous!==this.screen){this.routeCommandScreen=this.screen;this.routeCommandChangedAt=this.time||0;}routeCommandDrawBase.call(this);if(this.settings.reduceMotion||this.screen==='loading'||this.screen==='game')return;var age=(this.time||0)-(this.routeCommandChangedAt||0);if(age<0||age>.24)return;var c=this.c,s=this.scale,p=age/.24,barX=Math.round(24+336*p);c.save();c.setTransform(this.p.dpr*s,0,0,this.p.dpr*s,this.p.dpr*this.ox,this.p.dpr*this.oy);c.globalAlpha=1-p;c.fillStyle=UI.teal;c.fillRect(24,74,Math.round(336*p),3);c.fillStyle=UI.orange;c.fillRect(barX-3,72,6,7);c.restore();};
// Route Command 2.0 shared interaction geometry. Every final renderer and touch
// route below consumes these rectangles so visible controls and hit areas cannot drift.
var RC2={
  editorAvatar:{x:153,y:80,w:84,h:84},avatarPanel:{x:16,y:252,w:358,h:144},avatarClose:{x:24,y:574,w:342,h:44},
  editorName:{x:16,y:280,w:358,h:72},editorMotto:{x:16,y:364,w:358,h:72},
  accountBack:{x:16,y:16,w:84,h:44},accountHome:{x:24,y:718,w:342,h:48},accountEdit:{x:107,y:380,w:176,h:48},accountAdopt:{x:32,y:440,w:158,h:48},
  accountRefresh:{x:202,y:440,w:156,h:48},accountConnect:{x:24,y:490,w:342,h:64},
  back:{x:16,y:16,w:52,h:52}, settingsHome:{x:16,y:704,w:358,h:56},
  loadingRetry:{x:44,y:548,w:302,h:44}, leaderboardViewport:{x:16,y:204,w:358,h:466},
  profileAlbum:{x:32,y:280,w:326,h:44}, profileCamera:{x:32,y:336,w:326,h:44},
  avatarRail:{x:16,y:190,w:358,h:66}, homeRail:{x:16,y:486,w:358,h:62},
  profileCancel:{x:16,y:596,w:170,h:56},profileDone:{x:204,y:596,w:170,h:56}, deviceRail:{x:8,y:566,w:374,h:108}
};
function rcHit(r,x,y){return x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h;}
Game.prototype.draw=drawRouteTransition;
Game.prototype.uiGeometry=function(){return RC2;};
Game.prototype.avatarMenuGeometry=function(){var x=clamp((this.avatarMenuX||195)-64,16,246),y=clamp((this.avatarMenuY||122)+8,70,668);return{panel:{x:x,y:y,w:128,h:96},album:{x:x+4,y:y+4,w:120,h:44},camera:{x:x+4,y:y+48,w:120,h:44}};};
Game.prototype.profileEditorTap=function(x,y){
  if(this.cloudProfilePending)return;
  if(this.avatarPickerOpen){
    var menu=this.avatarMenuGeometry();
    if(rcHit(menu.album,x,y)){this.avatarPickerOpen=false;this.editPlayerAvatar('album');return;}
    if(rcHit(menu.camera,x,y)){this.avatarPickerOpen=false;this.editPlayerAvatar('camera');return;}

    if(!rcHit(menu.panel,x,y))this.avatarPickerOpen=false;
    return;
  }

  if(rcHit(RC2.avatarRail,x,y)){var ah=x+(this.profileAvatarScroll||0)-21,ai=Math.floor(ah/78);if(ai>=0&&ai<8&&ah-ai*78<=68)this.selectDefaultAvatar(ai);return;}
  if(rcHit(RC2.editorAvatar,x,y)){this.avatarMenuX=x;this.avatarMenuY=y;this.avatarPickerOpen=true;this.p.playSfx('tap');return;}
  if(rcHit(RC2.accountBack,x,y)){this.endIdentityEdit(false);this.p.vibrate();return;}
  if(rcHit(RC2.editorName,x,y)){this.editPlayerNickname();return;}
  if(rcHit(RC2.editorMotto,x,y)){this.editPlayerMotto();return;}
  if(rcHit(RC2.homeRail,x,y)){var hx=x+(this.profileHomeScroll||0)-16,hi=Math.floor(hx/122);if(hi>=0&&hi<DEFENSE_ZONES.length&&hx-hi*122<=114){this.localDefenseZone=DEFENSE_ZONES[hi];this.persistIdentity();this.p.playSfx('tap');this.p.vibrate();}return;}
  if(rcHit(RC2.profileCancel,x,y)&&this.identityChanged()){this.endIdentityEdit(false);this.beginIdentityEdit();this.p.playSfx('tap');this.p.vibrate();return;}
  if(rcHit(RC2.profileDone,x,y)&&this.identityChanged()){this.endIdentityEdit(true);this.p.playSfx('upgrade');this.p.vibrate();}
};
var previousPresentation_profileEditorModal=function(){
  if(!this.identityDraft)this.beginIdentityEdit();var c=this.c;this.profileAvatarScroll=clamp(this.profileAvatarScroll||0,0,260);this.profileHomeScroll=clamp(this.profileHomeScroll||0,0,610);
  c.fillStyle=UI.bg;c.fillRect(0,0,390,780);this.paintProfile();identityHeader(this,'编辑资料');
  this.drawIdentityAvatar(195,122,42);rr(c,216,140,24,24,8,UI.teal,null);icon(c,'camera',228,152,'#FFFFFF',14);
  c.save();c.beginPath();c.rect(16,190,358,66);c.clip();
  for(var i=0;i<8;i++){var x=21+i*78-this.profileAvatarScroll,on=!this.localAvatarUrl&&this.localAvatarStyle===i;
    if(on)rr(c,x,190,68,66,16,UI.tealSoft,UI.teal);
    this.drawLocalAvatar(x+34,223,26,i);
    if(on){c.fillStyle=UI.teal;c.beginPath();c.arc(x+58,200,8,0,TAU);c.fill();text(c,'✓',x+58,200,9,'#FFF','center',900);}
  }c.restore();
  var fields=[[RC2.editorName,'昵称',this.localNickName],[RC2.editorMotto,'防线宣言',this.localMotto]];
  for(var f=0;f<fields.length;f++){var r=fields[f][0];rr(c,r.x,r.y,r.w,r.h,16,UI.surface,null);text(c,fields[f][1],32,r.y+20,11,UI.muted,'left',750);text(c,fitText(c,fields[f][2],274,16,850),32,r.y+48,16,UI.ink,'left',850);editIcon(c,344,r.y+36,UI.teal,18);}
  text(c,'虚拟家园',16,466,15,UI.ink,'left',900);text(c,'当前 · '+this.localDefenseZone,374,466,11,UI.teal,'right',750);
  c.save();c.beginPath();c.rect(RC2.homeRail.x,RC2.homeRail.y,RC2.homeRail.w,RC2.homeRail.h);c.clip();
  for(var i=0;i<DEFENSE_ZONES.length;i++){var hx=16+i*122-this.profileHomeScroll,selected=this.localDefenseZone===DEFENSE_ZONES[i];
    rr(c,hx,486,114,62,14,selected?UI.tealSoft:UI.surface,selected?UI.teal:UI.line);
    text(c,DEFENSE_ZONES[i],hx+14,510,13,selected?UI.teal:UI.ink,'left',850);
    c.strokeStyle=selected?'#93BBAE':'#DCE7E2';c.lineWidth=1;c.beginPath();c.moveTo(hx+14,535);c.lineTo(hx+38,527);c.lineTo(hx+62,538);c.lineTo(hx+91,524);c.stroke();
    if(selected)text(c,'✓',hx+99,508,12,UI.teal,'center',900);
  }c.restore();
  if(this.identityChanged()){var cancel=RC2.profileCancel,save=RC2.profileDone;rr(c,cancel.x,cancel.y,cancel.w,cancel.h,14,UI.surface,UI.line);text(c,'取消变更',cancel.x+cancel.w/2,cancel.y+cancel.h/2,16,UI.teal,'center',850);rr(c,save.x,save.y,save.w,save.h,14,UI.teal,null);text(c,'保存变更',save.x+save.w/2,save.y+save.h/2,16,'#FFFFFF','center',900);}
  if(this.avatarPickerOpen){var menu=this.avatarMenuGeometry(),panel=menu.panel;c.save();c.shadowColor='rgba(20,55,45,.18)';c.shadowBlur=16;c.shadowOffsetY=4;rr(c,panel.x,panel.y,panel.w,panel.h,12,UI.surface,UI.line);c.restore();
  var sources=[[menu.album,'image','相册选择'],[menu.camera,'camera','拍照上传']];
  for(var k=0;k<sources.length;k++){var q=sources[k][0];if(k){c.fillStyle=UI.line;c.fillRect(q.x+8,q.y,q.w-16,1);}icon(c,sources[k][1],q.x+16,q.y+22,UI.teal,15);text(c,sources[k][2],q.x+34,q.y+22,12,UI.ink,'left',850);}

}
};
var rc2Touch=sidebarTouch;
Game.prototype.touch=function(x,y,phase){
  phase=phase||'start';
  if(this.presentationTouch(x,y,phase))return;
  if(this.collectionTouch(x,y,phase))return;
  if(this.screen==='leaderboard'){
    var lg=this.leaderboardGesture;
    if(phase==='cancel'){this.leaderboardGesture=null;return;}
    if(phase==='start'&&rcHit(RC2.leaderboardViewport,x,y)){this.leaderboardGesture={x:x,y:y,scroll:this.leaderboardScroll||0,moved:false};return;}
    if(lg){var ldy=y-lg.y;if(ldy*ldy>100)lg.moved=true;if(phase==='move'&&lg.moved){var max=Math.max(0,this.leaderboardScores().length*94-RC2.leaderboardViewport.h);this.leaderboardScroll=clamp(lg.scroll-ldy,0,max);}if(phase==='end'){this.leaderboardGesture=null;}return;}
  }
  if(this.screen==='account'&&this.profileEditor){var g=this.profileEditorGesture;if(phase==='cancel'){this.profileEditorGesture=null;return;}if(phase==='start'){this.profileEditorGesture={x:x,y:y,avatar:!this.avatarPickerOpen&&rcHit(RC2.avatarRail,x,y),home:!this.avatarPickerOpen&&rcHit(RC2.homeRail,x,y),as:this.profileAvatarScroll||0,hs:this.profileHomeScroll||0,moved:false};return;}if(!g)return;var dx=x-g.x,dy=y-g.y;if(dx*dx+dy*dy>100)g.moved=true;if(phase==='move'&&g.moved&&(g.avatar||g.home)&&Math.abs(dx)>Math.abs(dy)){if(g.avatar)this.profileAvatarScroll=clamp(g.as-dx,0,260);else this.profileHomeScroll=clamp(g.hs-dx,0,610);}if(phase==='end'){this.profileEditorGesture=null;if(!g.moved)this.profileEditorTap(x,y);}return;}
  rc2Touch.call(this,x,y,phase);
};
var rc2Leaderboard=leaderboardRoute;
var previousPresentation_leaderboard=function(){
  this.ensureProfile();var c=this.c,scores=this.leaderboardScores(),view=RC2.leaderboardViewport;
  this.leaderboardScroll=clamp(this.leaderboardScroll||0,0,Math.max(0,scores.length*94-view.h));
  c.fillStyle=UI.bg;c.fillRect(0,0,390,780);this.pageHeader('战绩中心','每名玩家仅记录周期最高成绩');
  var tabs=[['周榜','week'],['月榜','month'],['总榜','all']];
  for(var i=0;i<3;i++){var x=16+i*120,on=this.leaderboardTab===tabs[i][1];rr(c,x,100,112,54,15,on?UI.teal:UI.surface,on?UI.teal:UI.line);text(c,tabs[i][0],x+56,127,12,on?'#FFFFFF':UI.muted,'center',850);}
  text(c,'排名 / 玩家',24,182,11,UI.muted,'left',800);text(c,'最高得分',354,182,11,UI.muted,'right',800);
  c.save();c.beginPath();c.rect(view.x,view.y,view.w,view.h);c.clip();
  if(!scores.length){rr(c,16,204,358,220,20,UI.surface,UI.line);rankIcon(c,195,260,UI.teal,28);text(c,'还没有战绩',195,314,20,UI.ink,'center',900);text(c,'完成一次挑战后，最高成绩会出现在这里',195,356,11,UI.muted,'center',750);}
  for(i=0;i<scores.length;i++){
    var y=204+i*94-this.leaderboardScroll;if(y+82<view.y||y>view.y+view.h)continue;
    var row=scores[i],name=row.nickName||this.localNickName,motto=row.motto||this.localMotto,zone=DEFENSE_ZONES.indexOf(row.zone)>=0?row.zone:this.localDefenseZone;
    this.paintRecord(16,y,358,82);
    metric(c,''+(i+1),34,y+28,12,i===0?UI.orange:UI.muted,'center',900);this.drawIdentityAvatar(70,y+30,18);
    text(c,fitText(c,name,138,12,900),98,y+24,12,UI.ink,'left',900);
    metric(c,fitText(c,compact(row.score),104,14,900),354,y+25,14,UI.orange,'right',900);
    text(c,fitText(c,motto,250,10,750),98,y+46,10,UI.muted,'left',750);
    text(c,fitText(c,zone+' · 第'+(+row.wave||0)+'波 · '+durationText(row.duration),250,10,800),98,y+66,10,UI.teal,'left',800);
  }c.restore();text(c,'本机战绩 · 完成挑战后自动保存',195,714,11,UI.muted,'center',750);
};
Game.prototype.findBoardTarget=function(x,y){var direct=this.cellAt(x,y);if(direct)return direct;var best=null,bestD=18*18;for(var row=0;row<CFG.grid.rows;row++)for(var col=0;col<CFG.grid.cols;col++){var cx=this.gx(col),cy=this.gy(row),dx=x-cx,dy=y-cy,d=dx*dx+dy*dy;if(d<bestD){bestD=d;best={col:col,row:row,x:cx,y:cy};}}return best;};
Game.prototype.findEnemyTarget=function(x,y){var best=null,bestD=22*22;for(var i=this.enemies.length-1;i>=0;i--){var e=this.enemies[i],dx=x-e.x,dy=y-e.y,d=dx*dx+dy*dy;if(!e.dead&&d<bestD){best=e;bestD=d;}}return best;};
require('./collection-ui')(Game,{rr:rr,pxBox:pxBox,pixelSprite:pixelSprite,text:text,icon:icon,fit:fitText,hit:rcHit,colors:UI});
require('./presentation')(Game,{colors:UI,rr:rr,pxBox:pxBox,pixelSprite:pixelSprite,text:text,native:nativeText,metric:metric,fit:fitText,icon:icon,hit:rcHit,compact:compact,duration:durationText,geometry:RC2,deviceBar:DEVICE_BAR,zones:DEFENSE_ZONES});
require('./cloud-game')(Game);
module.exports=Game;

};
M["src/main.js"]=function(module,exports,require){
var createPlatform = require('./platform');
var createAuth = require('./auth');
var config = require('./config');
var Game = require('./starport-game');
var platform = createPlatform();
platform.auth = createAuth(platform,{
  endpoint:config.authEndpoint&&(platform.authEndpoint||(platform.name!=='web'?config.authEndpoint:'')),
  gameId:config.gameId
});
var game = new Game(platform);
game.start();
platform.onShow(function(){game.refreshCloud();if(game.screen==='leaderboard')game.refreshLeaderboard();});
game.runStartup(function(report,done){
  platform.checkStartup(config,report,function(results){done(results);game.refreshCloud();});
});

};
M["game.js"]=function(module,exports,require){
require('./src/main');

};
require("game.js");})();
