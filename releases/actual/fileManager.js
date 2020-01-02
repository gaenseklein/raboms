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
      rb.innerText=this.fs[px].basepath;
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
    //directory.dirlist.sort(function(a,b){if(a.basepath < b.basepath)return 1; else return -1});
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
  lsPath:function(ppath){
    path = ppath;
    if(this.fs.length===0)return;
    if(!path)path=this.lastUsedPath;
    if(!path)path=this.fs[0].basepath;
    var directory = this.getDirectoryOfPath(path);
    this.ls(directory);
    this.lastUsedPath = path;
    document.getElementById("fileManagerDialog").classList.add("show");
  },
  fileChosen:function(fullpath){
    let filename = fullpath.substring(fullpath.lastIndexOf("/")+1);
    let basepath = fullpath.substring(0,fullpath.lastIndexOf("/")+1);
    raBoms.finishFile(filename,basepath);
    document.getElementById("fileManagerDialog").classList.remove("show");
  }
}
