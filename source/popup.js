$(function() {
  var sManager = function() {
    _this = this;
    var tabUrls = new Array;
    var tabSettings = "";
    var globalSessilnObject = [0];
    _this.readTabs = function () {
      chrome.tabs.query({},function(tabs){
        var _tabs = new Array;
        var _tabs2 = new Array;
        for (var i = tabs.length - 1; i >= 0; i--) {
          var trueb = 0;
          for (var j = _tabs2.length - 1; j >= 0; j--) {
            if (tabs[i].url ==_tabs2[j]) {
              trueb = 1;
            };
          };
          if ((tabs[i].url).match("chrome://history/") == null && (tabs[i].url).match("chrome-devtools://") == null && (tabs[i].url).match("chrome-search://") == null && trueb == 0) {

            var _icon = tabs[i].favIconUrl!=undefined?tabs[i].favIconUrl:"images/favicon.png";
            _tabs2[i] = tabs[i].url
            _tabs[i] = "<li><img alt='' width='16' src='"+_icon+"'><span class='url'>"+tabs[i].url+"</span><span class='title'>"+tabs[i].title+"</span><button class='delete'><img src='images/delete.png' alt=''></button></li>";
          };   
          
        };
        document.getElementById("linksArray").innerHTML=_tabs;
      });
      setTimeout(function() {
        tabUrls = new Array;
        for (var i = $("#linksArray li").length - 1; i >= 0; i--) {
          tabUrls[i] = $("#linksArray li").eq(i).find(".url").html();
        };
        tabSettings = $("#linksArray").html();
      },500);
    };
    _this.openTabs = function (tabUrls) {
      for (var i = tabUrls.length - 1; i >= 0; i--) {
        if (tabUrls[i] != null) {
          chrome.tabs.create({'url': tabUrls[i]}, function() {});
        };
      };
    };
    _this.preGenerateSession = function() {
      _this.readTabs();
      setTimeout(function() {
        $(".popupAdding").css({"display":"block","min-height":$(window).height()-60+"px"});
        var _settings = tabSettings;
        $(".listOfItems").html(_settings);
      }, 600);
    };
    _this.preGenRemove = function(thiss) {
      var _url = thiss.parent().find(".url").html();
      thiss.parent().remove();
      tabSettings = $(".listOfItems").html();
      _settings = $(".listOfItems").html();
      for (var i = tabUrls.length - 1; i >= 0; i--) {
        if (tabUrls[i] ==_url) {
          delete tabUrls[i];
        };
      };
      
      return tabUrls;
    };
    _this.generateSession = function() {
      if ($(".popupAdding input").val() == "") {
        $(".popupAdding input").val("Нова сесія")
      };
      var _name = $(".popupAdding input").val();
      var _settings = tabSettings;
      var _urls = tabUrls;
      if (globalSessilnObject!=null) {
        var _id = globalSessilnObject.length;
        globalSessilnObject.push({"id": _id,"name": _name,"urls": _urls,"settings": _settings})
      } else {
        var _id = 0;
        globalSessilnObject = new Array;
        globalSessilnObject[0] = {"id": _id,"name": _name,"urls": _urls,"settings": _settings};
      };
      localStorage.setItem('sManager', JSON.stringify(globalSessilnObject));
      $(".popupAdding input").val("")
      $(".listOfItems").html("")
      $(".popupAdding").css({"display":"none"});
      _this.loading();
    };
    _this.canselGenerateSession = function() {
      $(".popupAdding input").val("")
      $(".listOfItems").html("")
      $(".popupAdding").css({"display":"none"});
    };
    _this.deleteSession = function(id) {
      var _id = id;
      for (var i = globalSessilnObject.length - 1; i >= 0; i--) {
        if (globalSessilnObject[i] != null && globalSessilnObject[i].id == _id) {
          delete globalSessilnObject[i];
          localStorage.setItem('sManager', JSON.stringify(globalSessilnObject));
           _this.loading();
        };
      };
    };
    _this.openSettings = function() {
      
    };
    // NOTE: to get button deleting link uncoment here
    _this.loading = function() {
      $("#sessionList").html("");
      globalSessilnObject = JSON.parse(localStorage.getItem('sManager'));
      if (globalSessilnObject != undefined) {
        globalSessilnObject = $.map(globalSessilnObject, function(value, index) {
          return [value];
        });    
      };
      if (globalSessilnObject != null) {
        $("#sessionNull").css("display","none");
        for (var i = globalSessilnObject.length - 1; i >= 0; i--) {
          if (globalSessilnObject[i] != undefined) {
            $("#sessionList").append("<li><span class='sesOpener' data-id='"+globalSessilnObject[i].id+"''>"+globalSessilnObject[i].name+"</span><!--span class='edSession' data-id='"+globalSessilnObject[i].id+"''><img src='images/edit.png' alt=''></span--><span class='delSession' data-id='"+globalSessilnObject[i].id+"''><img src='images/delete.png' alt=''></span></li>");
          };
        };
      } else{
        $("#sessionNull").css("display","block");
      };
      _this.readTabs();
    };
    _this.eventBindings = function() {
      $(".sesOpener").live("click",function() {
        var _thisButton = $(this).attr("data-id");
        for (var i = globalSessilnObject.length - 1; i >= 0; i--) {
          if (globalSessilnObject[i] != null && globalSessilnObject[i].id == _thisButton) {
            _this.openTabs(globalSessilnObject[i].urls)
          };
        };
      });
      $(".delSession").live("click",function() {
        var _thisButton = $(this).attr("data-id");
        for (var i = globalSessilnObject.length - 1; i >= 0; i--) {
          if (globalSessilnObject[i] != null && globalSessilnObject[i].id == _thisButton) {
            _this.deleteSession(globalSessilnObject[i].id)
          };
        };
      });
      $(".listOfItems button").live("click",function() {
        _this.preGenRemove($(this));
      })
      $(".header .settings").live("click",function() {
        $(".popupSettings").css({"display":"block","height":$(window).height()-60+"px"});
      })
      $(".popupSettings .cansel").live("click",function() {
        $(".popupSettings").css({"display":"none"});
      })
      $(".popupSettings .clearData").live("click",function() {
        var thiss = $(this);
        thiss.html("Базу даних очищено");
        localStorage.clear();
        setTimeout(function() {thiss.html("Очистити дані (повне видалення сесій)");}, 10000);
      })
      $(".header .info").live("click",function() {
        $(".popupAbout").css({"display":"block","height":$(window).height()-60+"px"});
      })
      $(".popupAbout .cansel").live("click",function() {
        $(".popupAbout").css({"display":"none"});
      })
      $(".popupAbout .site").live("click",function() {
        chrome.tabs.create({'url': "http://"+$(this).html()}, function() {});
      })
      $(".sesAdder").live("click",function() {
        _this.preGenerateSession();
      });
      $(".popupAdding .done").live("click",function() {
        _this.generateSession();
      });
      $(".popupAdding .cansel").live("click",function() {
        _this.canselGenerateSession();
      });
    };
    _this.loading();
    _this.eventBindings();
  }
  sManager();
})



