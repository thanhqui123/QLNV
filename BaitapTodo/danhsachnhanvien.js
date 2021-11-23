function DanhSachNhanVien() {
  this.list = [];

  this.themNhanVien = function (nv) {
    this.list.push(nv);
  };

  this._timViTri = function (maNV) {
    var index = -1;
    for (var i = 0; i < this.list.length; i++) {
      if (this.list[i].maNV == maNV) {
        index = i;
        break;
      }
    }
    return index;
  };

  this._xoaNhanVien = function (maNV) {
    var index = this._timViTri(maNV);

    if (index !== -1) {
      this.list.splice(index, 1);
    }
  };

  this.layThongTinNhanVien = function (maNV) {
    var index = this._timViTri(maNV);

    if (index !== -1) {
      return this.list[index];
    }
  };

  this.capNhatNhanVien = function (NhanVien) {
    var index = this._timViTri(NhanVien.maNV);

    if (index !== -1) {
      this.list[index] = NhanVien;
    }
  };
}

DanhSachNhanVien.prototype.timKiemNhanVien = function (keyword) {
  var mangTimKiem = [];
  for (var i = 0; i < this.list.length; i++) {
    if (
      this.list[i].tenNV.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
    ) {
      mangTimKiem.push(this.list[i]);
    }
  }
  return mangTimKiem;
};
