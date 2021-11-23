
var dsnv = new DanhSachNhanVien();
var validation = new Validation();

function getEle(id) {
  return document.getElementById(id);
}


getLocalStorage();


function layDuLieuDauVao(isAdd) {
  var _maNV = getEle("txtMaNV").value;
  var _tenNV = getEle("txtTenNV").value;
  var _ngaySinh = getEle("txtNgaySinh").value;


  var isValid = true;

 
  if (isAdd) {
    isValid &=
      validation.kiemTraRong(_maNV, "divMaErr", "(*) Mã NV k dc rỗng") &&
      validation.kiemTraDoDaiKyTu(
        _maNV,
        "divMaErr",
        "(*) Độ dài ký tự từ 4 - 10",
        4,
        10
      ) &&
      validation.kiemTraMaNVTrung(
        _maNV,
        "divMaErr",
        "(*) Mã NV đã tồn tại!",
        dsnv.list
      );
  }

  isValid &=
    validation.kiemTraRong(_tenNV, "divTenErr", "(*) Ten NV k dc rong") &&
    validation.kiemTraKyTuChuoi(_tenNV, "divTenErr", "(*) Tên NV phải là chữ");

  isValid &=
    validation.kiemTraRong(
      _ngaySinh,
      "divNgaySinhErr",
      "(*) Ngay sinh k dc rong"
    ) &&
    validation.kiemTraNgaySinh(
      _ngaySinh,
      "divNgaySinhErr",
      "(*) Ngày sinh k đúng định dạng!"
    );


  if (isValid) {
    var nhanVien = new NhanVien(
      _maNV,
      _tenNV,
      _ngaySinh
    );
    return nhanVien;
  }
  return null;
}


getEle("btnAdd").addEventListener("click", function (event) {

  event.preventDefault();

  var nhanVien = layDuLieuDauVao(true);


  if (nhanVien) {
    dsnv.themNhanVien(nhanVien);
    buildTable(dsnv.list);

   
    setLocalStorage();
  }
});

function taoBang(arr) {
 
  getEle("tbodyNhanVien").innerHTML = "";
  for (var i = 0; i < arr.length; i++) {
  
    var tagTR = document.createElement("tr");

   
    var tagTD_MaNV = document.createElement("td");
    var tagTD_TenNV = document.createElement("td");
    var tagTD_NgaySinh = document.createElement("td");

    

   
    tagTD_MaNV.innerHTML = arr[i].maNV;
    tagTD_TenNV.innerHTML = arr[i].tenNV;
    tagTD_NgaySinh.innerHTML = arr[i].ngaySinh;
    

    
    tagTR.appendChild(tagTD_MaNV);
    tagTR.appendChild(tagTD_TenNV);

    tagTR.appendChild(tagTD_NgaySinh);

   

    
    getEle("tbodyNhanVien").appendChild(tagTR);
  }
}


function xoaNhanVien(maNV) {
  dsnv._xoaNhanVien(maNV);
  buildTable(dsnv.list);
  setLocalStorage();
}


function suaNhanVien(maNV) {
  var nhanVien = dsnv.layThongTinNhanVien(maNV);

  
  getEle("btnUpdate").style.display = "inline-block";


  getEle("txtMaNV").value = nhanVien.maNV;
  getEle("txtMaNV").disabled = true;

  getEle("txtTenNV").value = nhanVien.tenNV;

  getEle("txtNgaySinh").value = nhanVien.ngaySinh;
}


getEle("btnUpdate").addEventListener("click", function () {
  
  var nhanVien = layDuLieuDauVao(false);
  dsnv.capNhatNhanVien(nhanVien);
  buildTable(dsnv.list);
  setLocalStorage();
});


getEle("btnReset").addEventListener("click", function () {

  getEle("formNV").reset();
  getEle("btnUpdate").style.display = "none";
  getEle("txtMaNV").disabled = false;

 
});


getEle("txtSearch").addEventListener("keyup", function () {
  var keyWord = getEle("txtSearch").value;
  var mangTimKiem = dsnv.timKiemNhanVien(keyWord);
  taoBang(mangTimKiem);
});

function setLocalStorage() {
  
  var arrString = JSON.stringify(dsnv.list);
  localStorage.setItem("DSNV", arrString);
}

function getLocalStorage() {
 
  if (localStorage.getItem("DSNV")) {
    var data = localStorage.getItem("DSNV");
    dsnv.list = JSON.parse(data);

  }
 
}

var state = {
    'querySet': dsnv.list,

    'page': 1,
    'rows': 5,
    'window': 5,
}


console.log(state.querySet);
function pagination(querySet, page, rows) {

    var trimStart = (page - 1) * rows
    var trimEnd = trimStart + rows

    var trimmedData = querySet.slice(trimStart, trimEnd)

    var pages = Math.round(querySet.length / rows);

    return {
        'querySet': trimmedData,
        'pages': pages,
    }
}
function pageButtons(pages) {
    var wrapper = document.getElementById('pagination-wrapper')

    wrapper.innerHTML = ``
	console.log('Pages:', pages)

    var maxLeft = (state.page - Math.floor(state.window / 2))
    var maxRight = (state.page + Math.floor(state.window / 2))

    if (maxLeft < 1) {
        maxLeft = 1
        maxRight = state.window
    }

    if (maxRight > pages) {
        maxLeft = pages - (state.window - 1)
        
        if (maxLeft < 1){
        	maxLeft = 1
        }
        maxRight = pages
    }
    
    

    for (var page = maxLeft; page <= maxRight; page++) {
    	wrapper.innerHTML += `<button value=${page} class="page btn btn-sm btn-info">${page}</button>`
    }

    if (state.page != 1) {
        wrapper.innerHTML = `<button value=${1} class="page btn btn-sm btn-info">&#171; First</button>` + wrapper.innerHTML
    }

    if (state.page != pages) {
        wrapper.innerHTML += `<button value=${pages} class="page btn btn-sm btn-info">Last &#187;</button>`
    }

    $('.page').on('click', function() {
        $('#tbodyNhanVien').empty()

        state.page = Number($(this).val())

        buildTable()
    })

}
function buildTable() {
    var table = $('#tbodyNhanVien')

    var data = pagination(state.querySet, state.page, state.rows)
    var myList = data.querySet
  console.log(myList);
    for (var i = 1 in myList) {
        
        var row = `<tr>
                  <td>${myList[i].maNV}</td>
                  <td>${myList[i].tenNV}</td>
                  <td>${myList[i].ngaySinh}</td>
                    <td><button  onclick="suaNhanVien(${myList[i].maNV})">Sửa<span ></span></button></td>
                    <td><button  onclick="xoaNhanVien(${myList[i].maNV})">Xóa<span ></span></button></td>
                  `
    // var tagTD_Button_Edit = document.createElement("td");
    // var tagTD_Button_Delete = document.createElement("td");
    // tagTD_Button_Edit.innerHTML =
    //   '<button class="btn btn-info" onclick="suaNhanVien(\'' +
    //   myList[i].maNV +
    //   "')\">Sửa</button>";
    // tagTD_Button_Delete.innerHTML =
    //   '<button class="btn btn-danger" onclick="xoaNhanVien(\'' +
    //   myList[i].maNV +
    //   "')\">Xóa</button>";
      // var tagTR = document.createElement("tr");
      // tagTR.appendChild(tagTD_Button_Edit);
      // tagTR.appendChild(tagTD_Button_Delete);
        table.append(row)
    }
    
    pageButtons(data.pages)
}



