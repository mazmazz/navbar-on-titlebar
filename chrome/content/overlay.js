var navbarontop = {
  prefs: null,
  onLoad: function() {
    // initialization code
    this.initialized = true;
    this.strings = document.getElementById("navbarontop-strings");
    
    this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
      .getService(Components.interfaces.nsIPrefService)
      .getBranch("extensions.navbarontop.");
    this.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
    this.prefs.addObserver("", this, false);
    
    // Set method overrides here. x_base is the original method.
		// The replacement method is usually a switcher to account for user prefs or required things to make navbar-on-top work
		// See METHODS EXTENSIONS section below.
    TabsInTitlebar._update_base = TabsInTitlebar._update;
    TabsInTitlebar.allowedBy_base = TabsInTitlebar.allowedBy;
    TabsInTitlebar.allowedBy = this.allowedBy_switcher;
    TabsInTitlebar._update = this._update_switcher;
    
    // pref: Read margin prefs, set them right away
    this._updatePrefs(false, "marginLeft");
    this._updatePrefs(false, "marginRight");
		this._updatePrefs(true, "persistUnMaximized"); // don't activate this right away.
        
    // Check if user set navbarontop. If so, then refresh state.
		this._updatePrefs(true, "enabled");
		this._refreshNavbarontopState();
  },
  
	/*
	 *
	 * START PREFERENCES BLOCK
	 *
	 */
	
  _pref_persistUnMaximized: true,
  _pref_marginLeft: 0,
  _pref_marginRight: 0,
  _pref_enabled: false,
  _pref_minimumWidth: 640,
  _pref_minimumWidthEnable: true,
  
  set pref_persistUnMaximized (val) { 
    this._pref_persistUnMaximized = val;
    this._refreshMaximizeTitlebarState();
  },
  set pref_marginLeft (val) {
    this._pref_marginLeft = val;
    this._setTitlebarMarginLeft(val);
  },
  set pref_marginRight (val) {
    this._pref_marginRight = val;
    this._setTitlebarMarginRight(val);
  },
  set pref_enabled (val) {
    this._pref_enabled = val;
    this._refreshNavbarontopState();
  },
  set pref_minimumWidth (val) {
    this._pref_minimumWidth = val;
    this._refreshMaximizeTitlebarState();
  },
  set pref_minimumWidthEnable (val) {
    this._pref_minimumWidthEnable = val;
    this._refreshMaximizeTitlebarState();
  },
  get pref_persistUnMaximized () { return this._pref_persistUnMaximized; },
  get pref_marginLeft () { return this._pref_marginLeft; },
  get pref_marginRight() { return this._pref_marginRight; },
  get pref_enabled() { return this._pref_enabled; },
  get pref_minimumWidth() { return this._pref_minimumWidth; },
  get pref_minimumWidthEnable() { return this._pref_minimumWidthEnable; },
  
  _refreshNavbarontopState: function() {
    if(this.pref_enabled != this.enabled) this.toggle();
  },
  
  _refreshMaximizeTitlebarState: function () {
    var sizemode = document.documentElement.getAttribute("sizemode");
    TabsInTitlebar.allowedBy("sizemode",
                               sizemode == "maximized" || sizemode == "fullscreen");
  },
  
  _setTitlebarMarginLeft: function (pxVal) {
    document.getElementById("navbarontop_placeholderAppmenu").style.marginRight = pxVal + "px";
  },
  
  _setTitlebarMarginRight: function (pxVal) {
    // this margin-right is 22px by default. adjust from that.
    document.getElementById("navbarontop_placeholderCaption").style.marginLeft = (pxVal+22) + "px";
  },
  
  _updatePrefs: function(valuesOnly, prefName) {
	  // valuesOnly: Gets values, but not setter methods.
		// prefName: Gets only a certain preference name
    if(typeof prefName == "undefined" || !prefName) prefName = "";
		
    if(valuesOnly) {
      switch(prefName) {
        case "persistUnMaximized":
          this._pref_persistUnMaximized = this.prefs.getBoolPref("persistUnMaximized");
          break;
          
        case "marginLeft":
          this._pref_marginLeft = this.prefs.getIntPref("marginLeft");
          break;
          
        case "marginRight":
          this._pref_marginRight = this.prefs.getIntPref("marginRight");
          break;
        case "enabled":
          this._pref_enabled = this.prefs.getBoolPref("enabled");
          break;
        case "minimumWidth":
          this._pref_minimumWidth = this.prefs.getIntPref("minimumWidth");
          break;
        case "minimumWidthEnable":
          this._pref_minimumWidthEnable = this.prefs.getBoolPref("minimumWidthEnable");
          break;        
  
        default:
          this._pref_persistUnMaximized = this.prefs.getBoolPref("persistUnMaximized");
          this._pref_marginLeft = this.prefs.getIntPref("marginLeft");
          this._pref_marginRight = this.prefs.getIntPref("marginRight");
          this._pref_enabled = this.prefs.getBoolPref("enabled");
          this._pref_minimumWidth = this.prefs.getIntPref("minimumWidth");
          this._pref_minimumWidthEnable = this.prefs.getBoolPref("minimumWidthEnable");
          break;
      }
    } else {
      switch(prefName) {
        case "persistUnMaximized":
          this.pref_persistUnMaximized = this.prefs.getBoolPref("persistUnMaximized");
          break;
          
        case "marginLeft":
          this.pref_marginLeft = this.prefs.getIntPref("marginLeft");
          break;
          
        case "marginRight":
          this.pref_marginRight = this.prefs.getIntPref("marginRight");
          break;
        case "enabled":
          this.pref_enabled = this.prefs.getBoolPref("enabled");
          break;
        case "minimumWidth":
          this.pref_minimumWidth = this.prefs.getIntPref("minimumWidth");
          break;
        case "minimumWidthEnable":
          this.pref_minimumWidthEnable = this.prefs.getBoolPref("minimumWidthEnable");
          break;
          
        default:
          this.pref_persistUnMaximized = this.prefs.getBoolPref("persistUnMaximized");
          this.pref_marginLeft = this.prefs.getIntPref("marginLeft");
          this.pref_marginRight = this.prefs.getIntPref("marginRight");
          this.pref_enabled = this.prefs.getBoolPref("enabled");
          this.pref_minimumWidth = this.prefs.getIntPref("minimumWidth");
          this.pref_minimumWidthEnable = this.prefs.getBoolPref("minimumWidthEnable");
          break;
      }
    }
  },
  
  observe: function(subject, topic, data) {
    if(topic != "nsPref:changed") return;
    
    switch(data)
    {
      case "persistUnMaximized":
        this.pref_persistUnMaximized = this.prefs.getBoolPref("persistUnMaximized");
        break;
        
      case "marginLeft":
        this.pref_marginLeft = this.prefs.getIntPref("marginLeft");
        break;
        
      case "marginRight":
        this.pref_marginRight = this.prefs.getIntPref("marginRight");
        break;
        
      case "enabled":
        this.pref_enabled = this.prefs.getBoolPref("enabled");
        break;
        
      case "minimumWidth":
        this.pref_minimumWidth = this.prefs.getIntPref("minimumWidth");
        break;
        
      case "minimumWidthEnable":
        this.pref_minimumWidthEnable = this.prefs.getBoolPref("minimumWidthEnable");
        break;
        
      //case "topMargin": // unmaximized windows only
      //  this.pref_topMargin = this.prefs.getIntPref("topMargin");
      //  break;
    }
  },
	
	/*
	 *
	 * END PREFERENCES BLOCK
	 *
	 * START METHODS EXTENSIONS BLOCK
	 *
	 */
  
	// TabsInTitlebar.allowedBy() and ._update() determine whether toolbars can be drawn in caption
  // If any condition (string) is found in TabsInTitlebar._disallowed array, or if browser.tabs.drawintitlebar is false,
  // then _update() assumes to not draw in caption.
  // Else, if everything clears, then caption is drawable.
  //
  // Conditions:
  // drawing-in-titlebar, displayAppButton option
  // customizing-toolbars, false when "customize" window is open, set back to true when not
  // tabs-on-top, enabled given option
  // sizemode, true if sizemode==maximized or sizemode==fullscreen
	
	// Override TabsInTitlebar.allowedBy()
	// Why? To intercept whether or not "sizemode" should prevent toolbars from being drawn to title bar,
	// depending on user setting.
  allowedBy_switcher: function(condition, allow) {
    // prefs: Allow navbarontop/tabsontop even when not maximized
    if(navbarontop.pref_persistUnMaximized
      && condition == "sizemode" && !allow && document.documentElement.getAttribute("sizemode") != "fullscreen") {
			
		  // pref: if minimumWidth is enabled and we're below pref_minwidth, let "sizemode" restriction through.
      // This piggy-backs on the "resize" event listener that TabsInTitlebar.init() made. By design (i assume),
      // the "resize" event only fires once in a while, so the UI isn't perfectly in sync.
      // This happens with the tab bar, too.			
			// alert(navbarontop.pref_minimumWidthEnable+"|"+navbarontop.pref_minimumWidth+"|"+document.documentElement.getAttribute("width"));
      if(navbarontop.pref_minimumWidthEnable && document.documentElement.getAttribute("width") < navbarontop.pref_minimumWidth) {
        TabsInTitlebar.allowedBy_base(condition, allow);
        return;
      }
      
			// Magic happens here: If minimum width requirement is set and pref_persistUnMaximized is set, allow sizemode.
      if("sizemode" in TabsInTitlebar._disallowed) {
        TabsInTitlebar.allowedBy_base("sizemode", true);
      }
      return;
    }
      else TabsInTitlebar.allowedBy_base(condition, allow);
  },
  
	// Override TabsInTitlebar._update()
	// Why? Need to differentiate between navbarontop/navbarintitlebar and tabsontop/tabsintitlebar.
	// This is desirable because, 1. Different places in UI call for tabsintitlebar to be set, but navbarintitlebar
	// needs to be set instead. 2. navbar and tabs are mutually exclusive, so one call can replace the other.
  _update_switcher: function() {
      if(navbarontop.enabled) {
			  // tabs-on-top needs to be deleted as a restriction in order for navbar to be able to draw on titlebar.
        if ("tabs-on-top" in TabsInTitlebar._disallowed) 
          delete TabsInTitlebar._disallowed["tabs-on-top"];
          
        navbarontop._update_navbar(); 
      } else {
			  // When disabling navbarontop, we need to set back tabs-on-top as a restriction if TabsOnTop was never re-enabled.
        if(!TabsOnTop.enabled)
          if (!("tabs-on-top" in TabsInTitlebar._disallowed))
            TabsInTitlebar._disallowed["tabs-on-top"] = null;
            
        TabsInTitlebar._update_base();
      }
    },
  
  _update_navbar: function () {
    if (!TabsInTitlebar._initialized || window.fullScreen)
      return;

    var allowed = true;
    for (var something in TabsInTitlebar._disallowed) {
      allowed = false;
      break;
    }

    // might be important if we have to look for iconsize=small/big on the fly
    var docElement = document.documentElement;
    if (allowed == (docElement.getAttribute("navbarintitlebar") == "true"))
      return;

    function $(id) document.getElementById(id);
    var titlebar = $("titlebar");

    if (allowed) {
      function rect(ele)   ele.getBoundingClientRect(); 
			
      var navbar       = $("nav-bar");

      var appmenuButtonBox  = $("appmenu-button-container");
      var captionButtonsBox = $("titlebar-buttonbox");
      TabsInTitlebar._sizePlaceholder("appmenu-button", rect(appmenuButtonBox).width);
      TabsInTitlebar._sizePlaceholder("caption-buttons", rect(captionButtonsBox).width);

      var navbarRect = rect(navbar);
      var urlbarRect = rect($("urlbar"));
      var titlebarRect = rect($("titlebar-content"));
      var titlebarTop = rect($("titlebar-content")).top;
      
			// THE MAGIC of moving toolbars up to the titlebar ALL HAPPENS HERE
			// If all the restriction checks pass, titlebar.margin-bottom is set to a negative value
			// and navbarintitlebar (for window element) is set to true.
			
      var iconSizeIsSmall = document.getElementById("navigator-toolbox").getAttribute("iconsize");
      
      if(iconSizeIsSmall == "small") {
			  // Base positioning on top of address bar, so Fitts' law can make it easier to click.
        var navbarPaddingTop = urlbarRect.top;
        // 40|9|38|0
        // 33|0|31|30
        //alert(urlbarRect.top+"|"+titlebarTop+"|"+navbarRect.top+"|"+navbarRect.height);
        titlebar.style.marginBottom = 0 - Math.min(urlbarRect.top - titlebarTop,
                                                 navbarRect.top) + "px";
      } else {
        titlebar.style.marginBottom = - Math.min(navbarRect.top - titlebarTop,
                                                 navbarRect.height) + "px";
      }

      docElement.setAttribute("navbarintitlebar", "true");

      if (!TabsInTitlebar._draghandle) {
        var tmp = {};
        Components.utils.import("resource://gre/modules/WindowDraggingUtils.jsm", tmp);
        TabsInTitlebar._draghandle = new tmp.WindowDraggingElement(navbar, window);
        TabsInTitlebar._draghandle.mouseDownCheck = function () {
          return !this._dragBindingAlive &&
                 this.ownerDocument.documentElement
                     .getAttribute("navbarintitlebar") == "true";
        };
      }
    } else {
      docElement.removeAttribute("navbarintitlebar");

      titlebar.style.marginBottom = "";
    }
  },
  
	/*
	 *
	 * END PREFERENCES BLOCK
	 *
	 * START GENERAL BLOCK
	 *
	 */
	
  onToggleTabsOnTop: function(e) {
    // This needs to happen BEFORE the command fires.
    if(navbarontop.enabled&&!TabsOnTop.enabled)navbarontop.toggle();
  },
  
  /*debug_seeTabsInTitleBarDisallowed: function(e) {
    var outputString = "";
    for(disallowedItem in TabsInTitlebar._disallowed) {
        outputString += disallowedItem+"\r\n";
    }
    alert("DEBUG: See tabs in title bar disallowed:\r\n\r\n"+outputString);
  },*/
  
  toggle: function(e) {
    this.enabled = !this.enabled;
  },
	
  get enabled() {
    return gNavToolbox.getAttribute("navbarontop") == "true";
  },
  
  set enabled(val) {
    gNavToolbox.setAttribute("navbarontop", !!val);
    this.syncCommand();
  },
  
  syncCommand: function() {
    var enabled = this.enabled;
    document.getElementById("cmd_ToggleNavBarOnTop").setAttribute("checked", enabled);
    document.getElementById("nav-bar").setAttribute("navbarontop", enabled);
    document.documentElement.setAttribute("navbarontop", enabled);
    this.prefs.setBoolPref("enabled", enabled);
    
    //gBrowser.tabContainer.setAttribute("navbarontop", enabled); // this isn't included
    //TabsInTitlebar.allowedBy("navbar-on-top", enabled); // shouldn't include this. 
    this._update(); // do this instead of calling allowedBy().
  },
  
  _update: function() {
    var docElement = document.documentElement;
    if(this.enabled) {
      if(TabsOnTop.enabled) { // When enabling navbar, tabs-on-top needs to be disabled.
        // workaround: to trigger TabsOnTitlebar._update for TABS BAR, !NOT! NAVBAR, set navbarontab = false to divert the
				// _update() override (see METHOD EXTENSION block above). then set it back.
        gNavToolbox.setAttribute("navbarontop", false);
        TabsOnTop.toggle();
        gNavToolbox.setAttribute("navbarontop", true);
      }
    
		  // Then remove the "tabs-on-top" restriction again. This also sets off our _update navbar override,
			// doing the dirty work to put the navbar on the title bar.
      TabsInTitlebar.allowedBy("tabs-on-top", true); 
    } else {
      // Check if TabsOnTop is still disabled
      // if it is, set it back as a restriction in TabsInTitlebar.allowedBy()
      if(!TabsOnTop.enabled) {
        TabsInTitlebar.allowedBy("tabs-on-top", false);
        document.getElementById("titlebar").style.marginBottom = "";
      }
      
      docElement.removeAttribute("navbarintitlebar");
    }
  }
	
	/*
	 *
	 * END GENERAL BLOCK
	 *
	 *
	 */
};

window.addEventListener("load", function () { navbarontop.onLoad(); }, false);
