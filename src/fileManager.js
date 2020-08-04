var fileManager = {
  fs:[],
  importFs:function(basepath, filestring){
      var newdir = {
        basepath:basepath,
        subdirectorys:[],
        dirlist:[],
        files:[]
      };
      var fileLines = filestring.split("\n");
      for(var x=0;x<fileLines.length;x++){
        var actline = fileLines[x];
        var posOfTab = actline.indexOf(" \t");
        if(posOfTab==-1)continue; //do nothing on no tab found
        var actsize = actline.substring(0,posOfTab);
        if(actsize * 1 == actsize){
          let ending = " Byte";
          if(actsize>1024){
            actsize = actsize / 1024;
            ending = " KB";
          }
          if(actsize>1024){
            actsize = actsize / 1024;
            ending = " MB";
          }
          actsize = Math.floor(actsize*100)/100;
          actsize += ending;
        }
        actline = actline.substring(actline.indexOf(basepath)+basepath.length);

        var actl = actline.split("/");
        var actfilename = actl.pop();
        var actsource = basepath + actline;
        var actdir = newdir;
        for(var fx=0;fx<actl.length;fx++){
          if(actdir.dirlist.indexOf(actl[fx])===-1){
            let actnewdir = {
              basepath:actdir.basepath+actl[fx]+"/",
              subdirectorys:[],
              dirlist:[],
              files:[]};
            actdir.subdirectorys.push(actnewdir);
            actdir.dirlist.push(actl[fx]);
            actdir = actnewdir;
          }else{
            actdir = actdir.subdirectorys[actdir.dirlist.indexOf(actl[fx])];
          }
        }//for(fx)
        actdir.files.push({
          filename:actfilename,
          source:actsource,
          size:actsize,
          basepath:actdir.basepath
        });
      }//for(x)
      this.fs.push(newdir);
  },
  getRootDirectoryOfPath:function(path){
    var actdir;
    for(var x=0;x<this.fs.length;x++){
      if(path.indexOf(this.fs[x].basepath)===0)actdir=this.fs[x];
    }
    //console.log(this.fs[0].basepath);
    return actdir;
  },
  getDirectoryOfPath:function(path){
    var actdir = this.getRootDirectoryOfPath(path);
    if(!actdir)return "error: "+path + " not found";
    var patharr=path.substring(actdir.basepath.length).split("/");
    while(patharr.length>0){
      let actp=patharr.shift();
      if(actdir.dirlist.indexOf(actp)>-1)
        actdir=actdir.subdirectorys[actdir.dirlist.indexOf(actp)];
    }//while
    return actdir;
  },
  ls:function(directory){
    var rdiv = document.createElement("div");
    rdiv.classList.add("fileManagerLs");
    var actpath = document.createElement("div");
    actpath.classList.add("fileManagerLsPath");
    var path = directory.basepath;
    var rootpath = this.getRootDirectoryOfPath(directory.basepath).basepath;
    var patharr = new Array();

    var rootsdiv = document.createElement("div")
    rootsdiv.classList.add("roots");
    for(var px = 0;px<this.fs.length;px++){
      var rb = document.createElement("button");
      if(rootpath === this.fs[px].basepath)rb.classList.add("active");
      rb.classList.add("rootButton");
      rb.value = this.fs[px].basepath
      rb.onclick=function(){fileManager.lsPath(this.value);};
      rb.innerText=this.fs[px].basepath.substring(this.fs[px].basepath.lastIndexOf("/")+1)+'/';
      rootsdiv.appendChild(rb);
    }
    actpath.appendChild(rootsdiv);

    //patharr.push(rootpath);
    var actpp = path.indexOf("/",rootpath.length+1);
    while(actpp>0){
      patharr.push(path.substring(0,actpp+1));
      actpp = path.indexOf("/",actpp+1);
    }
    console.log(patharr);
    for(var x=0;x<patharr.length;x++){
      var pb = document.createElement("button");
      if(patharr[x]===rootpath)pb.classList.add("activeRoot");
      pb.value = patharr[x];
      pb.innerText = patharr[x].substring(patharr[x].lastIndexOf("/",patharr[x].length-2)+1);
      pb.onclick=function(){fileManager.lsPath(this.value);};
      actpath.appendChild(pb);
    }
    rdiv.appendChild(actpath);
    var wrapper = document.createElement("div");
    wrapper.classList.add("fileManagerLsWrapper");
    var dir = document.createElement("ul");
    dir.classList.add("fileManagerLsDir");
    directory.dirlist.sort(function(a,b){if(a.toUpperCase()<b.toUpperCase())return -1; else return 1});
    for(var x=0;x<directory.dirlist.length;x++){
      var li = document.createElement("li");
      var button = document.createElement("button");
      button.innerText = "📁 | "+directory.dirlist[x];
      button.value=directory.basepath+directory.dirlist[x];
      button.onclick = function(){fileManager.lsPath(this.value)};
      li.appendChild(button);
      dir.appendChild(li);
    }
    wrapper.appendChild(dir);
    var files = document.createElement("ul");
    files.classList.add("fileManagerLsFiles");
    directory.files.sort(function(a,b){if(a.filename<b.filename)return -1; else return 1;});
    for(var x=0;x<directory.files.length;x++){
      var li=document.createElement("li");
      var button = document.createElement("button");
      button.innerText = "🔊 | "+directory.files[x].filename;
      button.value = directory.files[x].source;
      button.onclick=function(){fileManager.fileChosen(this.value)};
      var size = document.createElement("span");
      size.innerText = directory.files[x].size;
      li.appendChild(button);
      li.appendChild(size);
      files.appendChild(li);
    }
    wrapper.appendChild(files);
    rdiv.appendChild(wrapper);
    var target = document.getElementById("fileManagerLsTarget");
    target.innerHTML = "";
    target.appendChild(rdiv);
  },
  lsPath:function(ppath, options){
    path = ppath;
    if(this.fs.length===0)return;
    if(!path)path=this.lastUsedPath;
    if(!path)path=this.fs[0].basepath;
    var directory = this.getDirectoryOfPath(path);
    this.ls(directory);
    this.lastUsedPath = path;
    document.getElementById("fileManagerDialog").classList.add("show");
    if(options && options.playlist){
      document.getElementById("fileManagerPlaylistArea").classList.add("show");
      this.actualOptions = options;
      this.showPlaylist();
    }
  },
  fileChosen:function(fullpath){
    let filename = fullpath.substring(fullpath.lastIndexOf("/")+1);
    let basepath = fullpath.substring(0,fullpath.lastIndexOf("/")+1);
    if(this.actualOptions===null || this.actualOptions===undefined){
      raBoms.finishFile(filename,basepath);
      document.getElementById("fileManagerDialog").classList.remove("show");
    }else if(this.actualOptions && this.actualOptions.playlist){
      this.actualOptions.playlist.push({filename:filename,basepath:basepath});
      this.showPlaylist();
    }
  },
  showPlaylist:function(){
    var playlistdiv = document.getElementById("fileManagerPlaylist");
    playlistdiv.innerHTML = "";
    for(var x=0;x<this.actualOptions.playlist.length;x++){
      var acp = this.actualOptions.playlist[x];
      var wrapper = document.createElement("div");
      wrapper.classList.add("playlistentry");
      var filename = document.createElement("div");
      filename.innerText = acp.filename;

      var del = document.createElement("button");
      del.title = "borrar / delete "+acp.filename;
      del.innerText="x";

      del.name=x;
      del.onclick = function(){
        fileManager.deleteFromPlaylist(this.name);
      }
      var up = document.createElement("button");
      up.title = "más adelante / up";
      up.innerText="⏫";
      up.name=x;
      up.onclick=function(){
        var pos = this.name;
        if(!pos>0)return;
        var playlist = fileManager.actualOptions.playlist;
        var olditem = playlist[pos];
        playlist.splice(pos,1);
        playlist.splice(pos-1,0,olditem);
        fileManager.showPlaylist();
      }
      wrapper.appendChild(filename);
      wrapper.appendChild(del);
      wrapper.appendChild(up);
      playlistdiv.appendChild(wrapper);
    }
  },
  deleteFromPlaylist:function(number){
    if(!this.actualOptions.playlist || this.actualOptions.playlist.length<=number)return;
    this.actualOptions.playlist.splice(number,1);
    this.showPlaylist();
  },
  chosePlaylist:function(){
    if(this.id3database){
      for(var x=0;x<this.actualOptions.playlist.length;x++){
        let act=this.actualOptions.playlist[x];
        let audiotags = this.id3database.getTagsOfFile(act.basepath+act.filename);
        if(audiotags)this.actualOptions.playlist[x].audiotitle = audiotags.artist+" - "+audiotags.title;
      }
    }
    raBoms.finishFile(this.actualOptions);
    this.actualOptions = null;
    document.getElementById("fileManagerDialog").classList.remove("show");
    document.getElementById("fileManagerPlaylistArea").classList.remove("show");
  },
  buildId3Database:function(){
    if(!id3tagString || id3tagString.length<2)return;
    var id3tags = new Array();
    var id3lines = id3tagString.split("\n");
    var id3id = -1;
    var id3tagstyle = id3lines[1];
    if(id3tagstyle==="id3tool"){
      for(var x=2;x<id3lines.length;x++){
        var actline = id3lines[x];
        if(actline.indexOf("Filename")>=0){
          id3id++;
          var filename = actline.split(": ")[1];
          id3tags.push({filename:filename})
        }
        if(id3id==-1 || id3id>=id3tags.length){
          console.log("something went wrong on id "+id3id);
          continue;
        }
        if(actline.indexOf("No ID3 Tag")>=0){
          id3tags[id3id].title="unknown";
          id3tags[id3id].genre="unknown";
          id3tags[id3id].artist="unknown";
        }
        if(actline.indexOf(":\t")>0){
          var keyValue = actline.split(":\t");
          var key = keyValue[0];
          if(keyValue[0]==="Song Title")key="title";
          key = key.toLowerCase();
          id3tags[id3id][key] = keyValue[1];
        }
      }
    }else if(id3tagstyle==="mediainfo"){
      var tagsByFile = id3tagString.split("###NewFile###\n");
      if(tagsByFile.length<2)return;
      for(var x=2;x<tagsByFile.length;x++){
        var actf = tagsByFile[x].split("\n");
        var tmpobj = {filename:actf[0]};
        for(var y=1;y<actf.length;y++){
          if(actf[y].indexOf(":")>0){
            tmpobj[actf[y].substring(0,actf[y].indexOf(":")).toLowerCase()]=actf[y].substring(actf[y].indexOf(":")+1);
          }
        }
        //we always want some content for important values unset:
        if(tmpobj.artist===undefined || tmpobj.artist==="")tmpobj.artist="unknown";
        if(tmpobj.genre===undefined || tmpobj.genre==="")tmpobj.genre="unknown";
        if(tmpobj.album===undefined || tmpobj.album==="")tmpobj.album="unknown";
        if(tmpobj.title===undefined || tmpobj.title==="")tmpobj.title=tmpobj.filename.substring(tmpobj.filename.lastIndexOf("/")+1);
        id3tags.push(tmpobj);
      }
    }
    var genres = new Array();
    var artists = new Array();
    var albums = new Array();

    for(var x=0;x<id3tags.length;x++){
      let checkgen = id3tags[x].genre;
      let checkart = id3tags[x].artist;
      let checkalb = id3tags[x].album;
      if(checkgen && checkgen.length>0 && checkgen!=" " && genres.indexOf(id3tags[x].genre)===-1)genres.push(id3tags[x].genre);
      if(checkart && checkart.length>0 && checkart!=" " && artists.indexOf(id3tags[x].artist)===-1)artists.push(id3tags[x].artist);
      if(checkalb && checkalb.length>0 && checkalb!=" " && albums.indexOf(id3tags[x].album)===-1)albums.push(id3tags[x].album);
    }
    genres.sort();
    artists.sort();
    albums.sort();

    this.id3database = {id3tags:id3tags, genres:genres, artists:artists, albums:albums};
    this.id3database.getAllByArtist = function(artistname){
      var result = new Array();
      for(var x=0;x<this.id3tags.length;x++){
        if(this.id3tags[x].artist===undefined)continue;
        if(this.id3tags[x].artist.indexOf(artistname)>=0)result.push(this.id3tags[x]);
      }
      return result;
    }
    this.id3database.getAllByGenre = function(genrename){
      var result = new Array();
      for(var x=0;x<this.id3tags.length;x++){
        if(this.id3tags[x].genre===undefined)continue;
        if(this.id3tags[x].genre.indexOf(genrename)>=0)result.push(this.id3tags[x]);
      }
      return result;
    }
    this.id3database.search = function(searchterm){
      var result = new Array();
      for(var x=0;x<this.id3tags.length;x++){
        var actsearchstring = this.id3tags[x].filename + this.id3tags[x].title + this.id3tags[x].artist + this.id3tags[x].genre;
        if(actsearchstring.indexOf(searchterm)>=0)result.push(this.id3tags[x]);
      }
      return result;
    }
    this.id3database.getTagsOfFile = function(fullFilename){
      for(var x=this.id3tags.length-1;x>=0;x--){
        if(this.id3tags[x].filename===fullFilename)return this.id3tags[x];
      }
    }
  },
  viewType: "filename", //standardviewType is filename
  selectViewType: function(type){
    let dialog = document.getElementById("fileManagerDialog");
    dialog.classList.remove(this.viewType);
    this.viewType = type;
    dialog.classList.add(type);
    if(type==="id3")this.initId3ViewForm();
  },
  initId3ViewForm: function(){
    this.id3ViewForm = {};
    this.id3ViewForm.genre=null;
    this.id3ViewForm.artist=null;
    this.id3ViewForm.search="";
    this.id3ViewForm.album=null;
    this.renderId3GenreArtistSelection();
    this.updateId3View();
  },
  renderId3GenreArtistSelection:function(newgenre,newartist, newalbum){
    let genreul = document.getElementById("fileManagerId3Genre");
    let artistul = document.getElementById("fileManagerId3Artist");
    let albumul = document.getElementById("fileManagerId3Album");
    let genres = newgenre || this.id3database.genres;
    let artists = newartist || this.id3database.artists;
    let albums = newalbum || this.id3database.albums;
    if(albums===undefined)albums=new Array();
    //genres:
    genreul.innerHTML="";
    let allli = document.createElement("li");
    let allb = document.createElement("button");
    allb.innerText="All ("+genres.length+")";
    allb.onclick=function(){
      fileManager.id3ViewForm.genre=null;
      fileManager.updateId3View();
    }
    if(!newgenre)allb.classList.add("selected");
    allli.appendChild(allb);
    genreul.appendChild(allli);
    for(var x=0;x<genres.length;x++){
      let li = document.createElement("li");
      let button = document.createElement("button");
      button.innerText = genres[x];
      button.onclick = function(){
        fileManager.id3ViewForm.genre=this.innerText;
        fileManager.updateId3View();
      }
      button.classList.toggle("active",(genres[x]===this.id3ViewForm.genre));
      li.appendChild(button);
      genreul.appendChild(li);
    }
    //artists:
    artistul.innerHTML="";
    let allali = document.createElement("li");
    let allab = document.createElement("button");
    allab.innerText="All ("+artists.length+")";
    allab.onclick=function(){
      fileManager.id3ViewForm.artist=null;
      fileManager.updateId3View();
    }
    if(!newartist)allab.classList.add("selected");
    allali.appendChild(allab);
    artistul.appendChild(allali);
    for(var x=0;x<artists.length;x++){
      let li = document.createElement("li");
      let button = document.createElement("button");
      button.innerText = artists[x];
      button.onclick = function(){
        fileManager.id3ViewForm.artist=this.innerText;
        fileManager.updateId3View();
      }
      button.classList.toggle("active",(artists[x]===this.id3ViewForm.artist));
      li.appendChild(button);
      artistul.appendChild(li);
    }
    //albums:
    albumul.innerHTML="";
    let allalbli = document.createElement("li");
    let allalbbutton = document.createElement("button");
    allalbbutton.innerText="All ("+albums.length+")";
    allalbbutton.onclick=function(){
      fileManager.id3ViewForm.album=null;
      fileManager.updateId3View();
    }
    if(!newalbum)allalbbutton.classList.add("selected");
    allalbli.appendChild(allalbbutton);
    albumul.appendChild(allalbli);
    for(var x=0;x<albums.length;x++){
      let li = document.createElement("li");
      let button = document.createElement("button");
      button.innerText = albums[x];
      button.onclick = function(){
        fileManager.id3ViewForm.album=this.innerText;
        fileManager.updateId3View();
      }
      button.classList.toggle("active",(albums[x]===this.id3ViewForm.album));
      li.appendChild(button);
      albumul.appendChild(li);
    }
  },
  updateId3View:function(full){
    let target = document.getElementById("fileManagerId3Result");
    let newList = new Array();
    let artist = this.id3ViewForm.artist;
    let genre = this.id3ViewForm.genre;
    let album = this.id3ViewForm.album;
    let search = this.id3ViewForm.search;
    let db = this.id3database.id3tags;
    for(var x=0;x<db.length;x++){
      let act = db[x];
      let actsearchstring = act.artist + act.filename+ act.title + act.genre + act.album;

      if((artist===null || (act.artist !=undefined && act.artist==artist))&&
        (genre===null || (act.genre!=undefined && act.genre.indexOf(genre)>-1))&&
        (album===null || (act.album!=undefined && act.album.indexOf(album)>-1))&&
        (search===null || search==="" || actsearchstring.indexOf(search)>-1)){
        newList.push(act);
      }
    }
    let newgenres = new Array();
    let newartists = new Array();
    let newalbums = new Array();
    for(var x=0;x<newList.length;x++){
      if(newgenres.indexOf(newList[x].genre)===-1)newgenres.push(newList[x].genre);
      if(newartists.indexOf(newList[x].artist)===-1)newartists.push(newList[x].artist);
      if(newalbums.indexOf(newList[x].album)===-1)newalbums.push(newList[x].album);

    }
    var simplesort = function(a,b){
      if(a.toLowerCase()<b.toLowerCase())return -1;
      if(a.toLowerCase()<b.toLowerCase())return 1;
    }
    newgenres.sort(simplesort);
    newartists.sort(simplesort);
    newalbums.sort(simplesort);
    this.renderId3GenreArtistSelection(newgenres,newartists,newalbums);

    //sort newList:
    newList.sort(function(a,b){
      //first artist:
      if(a.artist.toLowerCase()<b.artist.toLowerCase())return -1;
      if(a.artist.toLowerCase()>b.artist.toLowerCase())return 1;
      //second title:
      if(a.title.toLowerCase()<b.title.toLowerCase())return -1;
      if(a.title.toLowerCase()>b.title.toLowerCase())return 1;
    });

    target.innerHTML="";
    for(var x=0;x<newList.length;x++){
      if(x>100 && full!=true)break;
      let li = document.createElement("li");
      let button = document.createElement("button");
      let dur = newList[x].duration;
      if(dur){
        let durmin = Math.floor(dur/60000);
        let dursec = Math.floor((dur/1000) - (durmin*60));
        dursec+="";
        if(dursec.length===1)dursec = 0+dursec;
        dur = durmin+":"+dursec;
      }
      button.innerText = newList[x].artist+" - "+newList[x].title + " ("+dur+")";
      button.filename = newList[x].filename;
      button.title = newList[x].filename;
      button.onclick= function(){
        fileManager.fileChosen(this.filename);
      }
      li.appendChild(button);
      target.appendChild(li);
    }
    if(newList.length>=100 && full!=true){
      let li = document.createElement("li");
      let button = document.createElement("button")
      button.innerHTML = '<span class="langen">show '+(newList.length-100)+' more</span>'+
                         '<span class="langes">muestra '+(newList.length-100)+' más</span>';
      button.onclick= function(){fileManager.updateId3View(true);};
      button.classList.add("more");
      li.appendChild(button);
      target.appendChild(li);
    }
  }

}
