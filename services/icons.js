define(function(require, exports){
    var container = {
        as: {icon: 'icon-prog-actionscript', color: '#C01424' },
        js: { icon: 'icon-prog-js02', color: '#F1DA4E' },
        ts: { icon: 'icon-twitter-2', color: '#3767A1' },
        ejs: { icon: 'icon-prog-js02', color: '#f4bf75' },
        coffee: { icon: 'icon-prog-coffeescr', color: '#c9905e' },
        css: { icon: 'icon-css3-02', color: '#34B0D4' },
        scss: { icon: 'icon-css3-02', color: '#c6538c' },
        sass: { icon: 'icon-css3-02', color: '#c6538c' },
        less: { icon: 'icon-css3-02', color: '#1F4262' },
        styl: { icon: 'icon-css3-02', color: '#b3d107' },
        html: { icon: 'icon-html5-02', color: '#FF4202' },
        xml: { icon: 'fa fa-code', color: '#B23E3F' },
        php: { icon: 'icon-prog-php02', color:'#6976c3'},
        sql: { icon: 'icon-dbs-postgresql', color:'#336691'},
        java: { icon: 'icon-prog-java', color:'#3767A1'},
        "class": { icon: 'icon-prog-java', color:'#3767A1'},
        png: { icon: 'fa fa-file-image-o', color: '#dbb1a9' },
        jpg: { icon: 'fa fa-file-image-o', color: '#dedfa3' },
        jpeg: { icon: 'fa fa-file-image-o', color: '#dedfa3' },
        tiff: { icon: 'fa fa-file-image-o', color: '#dedfa3' },
        ico: { icon: 'fa fa-file-image-o', color: '#dedfa3' },
        svg: { icon: 'fa fa-file-image-o', color: '#dedfa3' },
        gif: { icon: 'fa fa-file-image-o', color: '#dedfa3' },
        mp4: { icon: 'fa fa-file-video-o', color: '#dedfa3' },
        webm: { icon: 'fa fa-file-video-o', color: '#dedfa3' },
        ogg: { icon: 'fa fa-file-video-o', color: '#dedfa3' },
        ttf: { icon: 'fa fa-font'},
        eot: { icon: 'fa fa-font'},
        woff: { icon: 'fa fa-font'},
        md: { icon: 'fa fa-file-text-o', color: '#c36b35'},
        markdown: { icon: 'fa fa-file-text-o', color: '#c36b35'},
        gitignore: { icon: 'icon-vc-git', color: '#a0422e' },
        gitmodules: { icon: 'icon-vc-git'},
        gitattributes: { icon: 'icon-vc-git'},
        htaccess: { icon: 'fa fa-cog' },
        htpasswd: { icon: 'fa fa-cog' },
        conf: { icon: 'fa fa-cog' },
        project: { icon: 'fa fa-cog' },
        jscsrc: { icon: 'fa fa-cog' },
        jshintrc: { icon: 'fa fa-cog' },
        csslintrc: { icon: 'fa fa-cog' },
        todo: { icon: 'fa fa-cog' },
        classpath: { icon: 'fa fa-cog' },
        dart: { icon: 'icon-prog-dart', color: '#1C94C6' },
        clj: { icon: 'icon-prog-clojure', color: '#6BB13D' },
        go : { icon: 'icon-prog-golang02', color: '#1C94C6' },
        hs: { icon: 'icon-prog-haskell', color: '#342849' },
        scala: { icon: 'icon-prog-scala', color: '#C81B1F' },
        lsp: { icon: 'icon-prog-lisp', color: '#C30803' },
        c: { icon: 'icon-prog-c'},
        ruby: { icon: 'icon-prog-ruby', color: '#AF0B05' },
        cs: { icon: 'icon-prog-csharp', color: '#483F90' },
        py: { icon: 'icon-prog-python', color: '#3B6DA2' },
        lua: { icon: 'icon-prog-lua02', color: '#01257B' },
        erl: { icon: 'icon-prog-erlang', color: '#8C002E' },
        sh: { icon: 'icon-prog-bash02' }
    };

    exports.get = function(fileName){
        var splitName = fileName.split('.'), ext;
        if (splitName[splitName.length - 1] && splitName.length > 0){
            ext = splitName[splitName.length - 1];
            return container[ext] ? container[ext].icon : 'fa fa-file';
        }
        return 'fa fa-file';
    }

    exports.color = function(fileName){
        var splitName = fileName.split('.'), ext;
        if (splitName[splitName.length - 1] && splitName.length > 0){
            ext = splitName[splitName.length - 1];
            return container[ext] ? container[ext].color || "white" : 'white';
        }
        return 'white';
    }
});
