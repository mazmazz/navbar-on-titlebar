var navbarontop_prefsWindow = {
  prefs: null,
  
  pref_persistUnMaximized: true,
  pref_marginLeft: 0,
  pref_marginRight: 0,
  pref_minimumWidth: 640,
  pref_minimumWidthEnable: true,
  
  onLoad: function() {
    this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
      .getService(Components.interfaces.nsIPrefService)
      .getBranch("extensions.navbarontop.");
    this.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
    //this.prefs.addObserver("", this, false);
	
	pref_persistUnMaximized = this.prefs.getBoolPref("persistUnMaximized");
	pref_marginLeft = this.prefs.getIntPref("marginLeft");
	pref_marginRight = this.prefs.getIntPref("marginRight");
	pref_minimumWidth = this.prefs.getIntPref("minimumWidth");
	pref_minimumWidthEnable = this.prefs.getBoolPref("minimumWidthEnable");
  },
  
  onDialogCancel: function() {
    this.prefs.setBoolPref("persistUnMaximized", pref_persistUnMaximized);
	this.prefs.setIntPref("marginLeft", pref_marginLeft);
	this.prefs.setIntPref("marginRight", pref_marginRight);
	this.prefs.setIntPref("minimumWidth", pref_minimumWidth);
	this.prefs.setBoolPref("minimumWidthEnable", pref_minimumWidthEnable);
  }

};