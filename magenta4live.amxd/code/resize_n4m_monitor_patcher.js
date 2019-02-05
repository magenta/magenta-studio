function resize() {
	this.patcher.box.varname = "bp_" + Math.random()*10000;
	this.patcher.parentpatcher.message("script", "sendbox", this.patcher.box.varname, "patching_size", 400, 220);
	this.patcher.box.varname = "";
}