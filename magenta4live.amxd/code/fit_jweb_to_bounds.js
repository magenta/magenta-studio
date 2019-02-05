function getsize() {
	if (!this.patcher.box)
		return;

	var r = this.patcher.box.rect;
	var w = r[2] - r[0];
	var h = r[3] - r[1];

	outlet(0, "size", w, h);
}
