/* eslint-disable*/
const Excel = require('exceljs')
export  async function exportExcel(luckysheet) { // 参数为luckysheet.getluckysheetfile()获取的对象
  // 1.创建工作簿，可以为工作簿添加属性
  const workbook = new Excel.Workbook();
  // 2.创建表格，第二个参数可以配置创建什么样的工作表
  luckysheet.every(function (table) {
    if (table.data.length === 0) return true;
    const worksheet = workbook.addWorksheet(name);
    // 3.设置单元格合并,设置单元格边框,设置单元格样式,设置值
    setStyleAndValue(table.data, worksheet);
    setMerge(table.config.merge, worksheet);
    setBorder(table, worksheet);
    setImages(table, worksheet, workbook);
    return true;
  })
  // 4.写入 buffer
  const buffer = await workbook.xlsx.writeBuffer();
  // 5.保存为文件
  saveFile(buffer,name);
}

var saveFile = function(buf) {
  let blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
  const downloadElement = document.createElement('a');
  let href = window.URL.createObjectURL(blob);
  downloadElement.href = href;
  downloadElement.download = document.getElementById("luckysheet_info_detail_input").value; // 文件名字
  document.body.appendChild(downloadElement);
  downloadElement.click();
  document.body.removeChild(downloadElement); // 下载完成移除元素
  window.URL.revokeObjectURL(href); // 释放掉blob对象
}


var setMerge = function (luckyMerge = {}, worksheet) {
  const mergearr = Object.values(luckyMerge);
  mergearr.forEach(function (elem) { // elem格式：{r: 0, c: 0, rs: 1, cs: 2}
    // 按开始行，开始列，结束行，结束列合并（相当于 K10:M12）
    worksheet.mergeCells(elem.r + 1, elem.c + 1, elem.r + elem.rs, elem.c + elem.cs);
  });
}

//获取图片在单元格的位置
var  getImagePosition =function(num,arr){
  let index = 0;
  let minIndex;
  let maxIndex;
  for (let i = 0; i < arr.length; i++) {
    if (num < arr[i]) {
      index = i;
      break;
    }
  }

  if(index==0){
    minIndex = 0;
    maxIndex = 1;
  }
  else if(index == arr.length-1){
    minIndex = arr.length-2;
    maxIndex = arr.length-1;
  }
  else{
    minIndex = index-1;
    maxIndex = index;
  }
  let min = arr[minIndex];
  let max = arr[maxIndex];
  let radio = Math.abs((num-min)/(max-min))+index
  return radio;
}

var setImages = function (table, worksheet, workbook) {
  let {
    images,
    visibledatacolumn,//所有行的位置
    visibledatarow //所有列的位置
  } = {...table}
  if (typeof images != 'object') return;
  for (let key in images) {
    // 通过 base64  将图像添加到工作簿
    const myBase64Image = images[key].src;
    //开始行 开始列 结束行 结束列
    const item = images[key];
    const imageId = workbook.addImage({
      base64: myBase64Image,
      extension: 'png'
    });

    const col_st = getImagePosition(item.default.left,visibledatacolumn);
    const row_st = getImagePosition(item.default.top,visibledatarow);

    //模式1，图片左侧与luckysheet位置一样，像素比例保持不变，但是，右侧位置可能与原图所在单元格不一致
    worksheet.addImage(imageId, {
      tl: { col: col_st, row: row_st},
      ext: { width: item.default.width, height: item.default.height },
    });
    //模式2,图片四个角位置没有变动，但是图片像素比例可能和原图不一样
    // const w_ed = item.default.left+item.default.width;
    // const h_ed = item.default.top+item.default.height;
    // const col_ed = getImagePosition(w_ed,visibledatacolumn);
    // const row_ed = getImagePosition(h_ed,visibledatarow);
    // worksheet.addImage(imageId, {
    //   tl: { col: col_st, row: row_st},
    //   br: { col: col_ed, row: row_ed},
    // });
  }
};

var setBorder = function (lucksheetfile, worksheet) {
  if (!lucksheetfile) return;
  const luckyToExcel = {
    style: {
      0: 'none',
      1: 'thin',
      2: 'hair',
      3: 'dotted',
      4: 'dashDot', // 'Dashed',
      5: 'dashDot',
      6: 'dashDotDot',
      7: 'double',
      8: 'medium',
      9: 'mediumDashed',
      10: 'mediumDashDot',
      11: 'mediumDashDotDot',
      12: 'slantDashDot',
      13: 'thick'
    }
  }
  //获取所有的单元格边框的信息
  const borderInfoCompute = getBorderInfo(lucksheetfile);
  for (let x in borderInfoCompute) {
    let border = {};
    let info = borderInfoCompute[x];
    let row = parseInt(x.substr(0, x.indexOf('_')));
    let column = parseInt(x.substr(x.indexOf('_') + 1));
    if(info.t!=undefined){
      const tcolor = info.t.color.indexOf('rgb')>-1 ?rgb2hex(info.t.color):info.t.color;
      border['top'] = {style:luckyToExcel.style[info.t.style],color: {argb: tcolor.replace('#', '')}};
    }
    if(info.r!=undefined){
      const rcolor = info.r.color.indexOf('rgb')>-1 ?rgb2hex(info.r.color):info.r.color;
      border['right'] = {style:luckyToExcel.style[info.r.style],color: {argb: rcolor.replace('#', '')}};
    }
    if(info.b!=undefined){
      const bcolor = info.b.color.indexOf('rgb')>-1 ?rgb2hex(info.b.color):info.b.color;
      border['bottom'] = {style:luckyToExcel.style[info.b.style],color: {argb: bcolor.replace('#', '')}};
    }
    if(info.l!=undefined){
      const lcolor = info.l.color.indexOf('rgb')>-1 ?rgb2hex(info.l.color):info.l.color;
      border['left'] = {style:luckyToExcel.style[info.l.style],color: {argb: lcolor.replace('#', '')}};
    }
    worksheet.getCell(row + 1, column + 1).border = border;
  }
}

var getBorderInfo=function(luckysheetfile){
  let borderInfoCompute = {};
  let cfg = luckysheetfile.config;
  let data = luckysheetfile.data;
  let borderInfo = cfg["borderInfo"];
  //设置需要计算边框的区域
  let dataset_row_st = 0,dataset_row_ed = data.length,dataset_col_st=0,dataset_col_ed=data[0].length;
  if(borderInfo != null && borderInfo.length > 0){
    for(let i = 0; i < borderInfo.length; i++){
      let rangeType = borderInfo[i].rangeType;

      if(rangeType == "range"){
        let borderType = borderInfo[i].borderType;
        let borderColor = borderInfo[i].color;
        let borderStyle = borderInfo[i].style;

        let borderRange = borderInfo[i].range;

        for(let j = 0; j < borderRange.length; j++){
          let bd_r1 = borderRange[j].row[0], bd_r2 = borderRange[j].row[1];
          let bd_c1 = borderRange[j].column[0], bd_c2 = borderRange[j].column[1];

          if(bd_r1<dataset_row_st){
            bd_r1 = dataset_row_st;
          }

          if(bd_r2>dataset_row_ed){
            bd_r2 = dataset_row_ed;
          }

          if(bd_c1<dataset_col_st){
            bd_c1 = dataset_col_st;
          }

          if(bd_c2>dataset_col_ed){
            bd_c2 = dataset_col_ed;
          }

          if(borderType == "border-left"){
            for(let bd_r = bd_r1; bd_r <= bd_r2; bd_r++){
              if (cfg["rowhidden"] != null && cfg["rowhidden"][bd_r] != null) {
                continue;
              }

              if(borderInfoCompute[bd_r + "_" + bd_c1] == null){
                borderInfoCompute[bd_r + "_" + bd_c1] = {};
              }

              borderInfoCompute[bd_r + "_" + bd_c1].l = { "color": borderColor, "style": borderStyle };

              let bd_c_left = bd_c1 - 1;

              if(bd_c_left >= 0 && borderInfoCompute[bd_r + "_" + bd_c_left]){
                if(data[bd_r] != null && getObjType(data[bd_r][bd_c_left]) == "object" && data[bd_r][bd_c_left].mc != null){
                  let cell_left = data[bd_r][bd_c_left];

                  let mc = cfg["merge"][cell_left.mc.r + "_" + cell_left.mc.c];

                  if(mc.c + mc.cs - 1 == bd_c_left){
                    borderInfoCompute[bd_r + "_" + bd_c_left].r = { "color": borderColor, "style": borderStyle };
                  }
                }
                else{
                  borderInfoCompute[bd_r + "_" + bd_c_left].r = { "color": borderColor, "style": borderStyle };
                }
              }

              let mc = cfg["merge"] || {};
              for (const key in mc) {
                let {c,r,cs,rs} = mc[key];
                if(bd_c1 <= c + cs - 1 && bd_c1 > c && bd_r >= r && bd_r <= r + rs -1){
                  borderInfoCompute[bd_r + "_" + bd_c1].l = null;
                }
              }
            }
          }
          else if(borderType == "border-right"){
            for(let bd_r = bd_r1; bd_r <= bd_r2; bd_r++){
              if (cfg["rowhidden"] != null && cfg["rowhidden"][bd_r] != null) {
                continue;
              }

              if(borderInfoCompute[bd_r + "_" + bd_c2] == null){
                borderInfoCompute[bd_r + "_" + bd_c2] = {};
              }

              borderInfoCompute[bd_r + "_" + bd_c2].r = { "color": borderColor, "style": borderStyle };

              let bd_c_right = bd_c2 + 1;

              if(bd_c_right < data[0].length && borderInfoCompute[bd_r + "_" + bd_c_right]){
                if(data[bd_r] != null && getObjType(data[bd_r][bd_c_right]) == "object" && data[bd_r][bd_c_right].mc != null){
                  let cell_right = data[bd_r][bd_c_right];

                  let mc = cfg["merge"][cell_right.mc.r + "_" + cell_right.mc.c];

                  if(mc.c == bd_c_right){
                    borderInfoCompute[bd_r + "_" + bd_c_right].l = { "color": borderColor, "style": borderStyle };
                  }
                }
                else{
                  borderInfoCompute[bd_r + "_" + bd_c_right].l = { "color": borderColor, "style": borderStyle };
                }
              }
              let mc = cfg["merge"] || {};
              for (const key in mc) {
                let {c,r,cs,rs} = mc[key];
                if(bd_c2 < c + cs - 1 && bd_c2 >= c && bd_r >= r && bd_r <= r + rs -1){
                  borderInfoCompute[bd_r + "_" + bd_c2].r = null;
                }
              }
            }
          }
          else if(borderType == "border-top"){
            if (cfg["rowhidden"] != null && cfg["rowhidden"][bd_r1] != null) {
              continue;
            }

            for(let bd_c = bd_c1; bd_c <= bd_c2; bd_c++){
              if(borderInfoCompute[bd_r1 + "_" + bd_c] == null){
                borderInfoCompute[bd_r1 + "_" + bd_c] = {};
              }

              borderInfoCompute[bd_r1 + "_" + bd_c].t = { "color": borderColor, "style": borderStyle };

              let bd_r_top = bd_r1 - 1;

              if(bd_r_top >= 0 && borderInfoCompute[bd_r_top + "_" + bd_c]){
                if(data[bd_r_top] != null && getObjType(data[bd_r_top][bd_c]) == "object" && data[bd_r_top][bd_c].mc != null){
                  let cell_top = data[bd_r_top][bd_c];

                  let mc = cfg["merge"][cell_top.mc.r + "_" + cell_top.mc.c];

                  if(mc.r + mc.rs - 1 == bd_r_top){
                    borderInfoCompute[bd_r_top + "_" + bd_c].b = { "color": borderColor, "style": borderStyle };
                  }
                }
                else{
                  borderInfoCompute[bd_r_top + "_" + bd_c].b = { "color": borderColor, "style": borderStyle };
                }
              }

              let mc = cfg["merge"] || {};
              for (const key in mc) {
                let {c,r,cs,rs} = mc[key];
                if(bd_r1 <= r + rs - 1 && bd_r1 > r && bd_c >= c && bd_c <= c + cs -1){
                  borderInfoCompute[bd_r1 + "_" + bd_c].t = null;
                }
              }
            }
          }
          else if(borderType == "border-bottom"){
            if (cfg["rowhidden"] != null && cfg["rowhidden"][bd_r2] != null) {
              continue;
            }

            for(let bd_c = bd_c1; bd_c <= bd_c2; bd_c++){
              if(borderInfoCompute[bd_r2 + "_" + bd_c] == null){
                borderInfoCompute[bd_r2 + "_" + bd_c] = {};
              }

              borderInfoCompute[bd_r2 + "_" + bd_c].b = { "color": borderColor, "style": borderStyle };

              let bd_r_bottom = bd_r2 + 1;

              if(bd_r_bottom < data.length && borderInfoCompute[bd_r_bottom + "_" + bd_c]){
                if(data[bd_r_bottom] != null && getObjType(data[bd_r_bottom][bd_c]) == "object" && data[bd_r_bottom][bd_c].mc != null){
                  let cell_bottom = data[bd_r_bottom][bd_c];

                  let mc = cfg["merge"][cell_bottom.mc.r + "_" + cell_bottom.mc.c];

                  if(mc.r == bd_r_bottom){
                    borderInfoCompute[bd_r_bottom + "_" + bd_c].t = { "color": borderColor, "style": borderStyle };
                  }
                }
                else{
                  borderInfoCompute[bd_r_bottom + "_" + bd_c].t = { "color": borderColor, "style": borderStyle };
                }
              }

              let mc = cfg["merge"] || {};
              for (const key in mc) {
                let {c,r,cs,rs} = mc[key];
                if(bd_r2 < r + rs - 1 && bd_r2 >= r && bd_c >= c && bd_c <= c + cs -1){
                  borderInfoCompute[bd_r2 + "_" + bd_c].b = null;
                }
              }
            }
          }
          else if(borderType == "border-all"){
            for(let bd_r = bd_r1; bd_r <= bd_r2; bd_r++){
              if (cfg["rowhidden"] != null && cfg["rowhidden"][bd_r] != null) {
                continue;
              }

              for(let bd_c = bd_c1; bd_c <= bd_c2; bd_c++){
                if(data[bd_r] != null && getObjType(data[bd_r][bd_c]) == "object" && data[bd_r][bd_c].mc != null){
                  let cell = data[bd_r][bd_c];

                  let mc = cfg["merge"][cell.mc.r + "_" + cell.mc.c];
                  if(mc==undefined || mc==null){
                    continue
                  };
                  if(mc.r == bd_r){
                    if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                      borderInfoCompute[bd_r + "_" + bd_c] = {};
                    }

                    borderInfoCompute[bd_r + "_" + bd_c].t = { "color": borderColor, "style": borderStyle };
                  }

                  if(mc.r + mc.rs - 1 == bd_r){
                    if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                      borderInfoCompute[bd_r + "_" + bd_c] = {};
                    }

                    borderInfoCompute[bd_r + "_" + bd_c].b = { "color": borderColor, "style": borderStyle };
                  }

                  if(mc.c == bd_c){
                    if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                      borderInfoCompute[bd_r + "_" + bd_c] = {};
                    }

                    borderInfoCompute[bd_r + "_" + bd_c].l = { "color": borderColor, "style": borderStyle };
                  }

                  if(mc.c + mc.cs - 1 == bd_c){
                    if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                      borderInfoCompute[bd_r + "_" + bd_c] = {};
                    }

                    borderInfoCompute[bd_r + "_" + bd_c].r = { "color": borderColor, "style": borderStyle };
                  }
                }
                else{
                  if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                    borderInfoCompute[bd_r + "_" + bd_c] = {};
                  }

                  borderInfoCompute[bd_r + "_" + bd_c].l = { "color": borderColor, "style": borderStyle };
                  borderInfoCompute[bd_r + "_" + bd_c].r = { "color": borderColor, "style": borderStyle };
                  borderInfoCompute[bd_r + "_" + bd_c].t = { "color": borderColor, "style": borderStyle };
                  borderInfoCompute[bd_r + "_" + bd_c].b = { "color": borderColor, "style": borderStyle };
                }

                if(bd_r == bd_r1){
                  let bd_r_top = bd_r1 - 1;

                  if(bd_r_top >= 0 && borderInfoCompute[bd_r_top + "_" + bd_c]){
                    if(data[bd_r_top] != null && getObjType(data[bd_r_top][bd_c]) == "object" && data[bd_r_top][bd_c].mc != null){
                      let cell_top = data[bd_r_top][bd_c];

                      let mc = cfg["merge"][cell_top.mc.r + "_" + cell_top.mc.c];

                      if(mc.r + mc.rs - 1 == bd_r_top){
                        borderInfoCompute[bd_r_top + "_" + bd_c].b = { "color": borderColor, "style": borderStyle };
                      }
                    }
                    else{
                      borderInfoCompute[bd_r_top + "_" + bd_c].b = { "color": borderColor, "style": borderStyle };
                    }
                  }
                }

                if(bd_r == bd_r2){
                  let bd_r_bottom = bd_r2 + 1;

                  if(bd_r_bottom < data.length && borderInfoCompute[bd_r_bottom + "_" + bd_c]){
                    if(data[bd_r_bottom] != null && getObjType(data[bd_r_bottom][bd_c]) == "object" && data[bd_r_bottom][bd_c].mc != null){
                      let cell_bottom = data[bd_r_bottom][bd_c];

                      let mc = cfg["merge"][cell_bottom.mc.r + "_" + cell_bottom.mc.c];

                      if(mc.r == bd_r_bottom){
                        borderInfoCompute[bd_r_bottom + "_" + bd_c].t = { "color": borderColor, "style": borderStyle };
                      }
                    }
                    else{
                      borderInfoCompute[bd_r_bottom + "_" + bd_c].t = { "color": borderColor, "style": borderStyle };
                    }
                  }
                }

                if(bd_c == bd_c1){
                  let bd_c_left = bd_c1 - 1;

                  if(bd_c_left >= 0 && borderInfoCompute[bd_r + "_" + bd_c_left]){
                    if(data[bd_r] != null && getObjType(data[bd_r][bd_c_left]) == "object" && data[bd_r][bd_c_left].mc != null){
                      let cell_left = data[bd_r][bd_c_left];

                      let mc = cfg["merge"][cell_left.mc.r + "_" + cell_left.mc.c];

                      if(mc.c + mc.cs - 1 == bd_c_left){
                        borderInfoCompute[bd_r + "_" + bd_c_left].r = { "color": borderColor, "style": borderStyle };
                      }
                    }
                    else{
                      borderInfoCompute[bd_r + "_" + bd_c_left].r = { "color": borderColor, "style": borderStyle };
                    }
                  }
                }

                if(bd_c == bd_c2){
                  let bd_c_right = bd_c2 + 1;

                  if(bd_c_right < data[0].length && borderInfoCompute[bd_r + "_" + bd_c_right]){
                    if(data[bd_r] != null && getObjType(data[bd_r][bd_c_right]) == "object" && data[bd_r][bd_c_right].mc != null){
                      let cell_right = data[bd_r][bd_c_right];

                      let mc = cfg["merge"][cell_right.mc.r + "_" + cell_right.mc.c];

                      if(mc.c == bd_c_right){
                        borderInfoCompute[bd_r + "_" + bd_c_right].l = { "color": borderColor, "style": borderStyle };
                      }
                    }
                    else{
                      borderInfoCompute[bd_r + "_" + bd_c_right].l = { "color": borderColor, "style": borderStyle };
                    }
                  }
                }
              }
            }
          }
          else if(borderType == "border-outside"){
            for(let bd_r = bd_r1; bd_r <= bd_r2; bd_r++){
              if (cfg["rowhidden"] != null && cfg["rowhidden"][bd_r] != null) {
                continue;
              }

              for(let bd_c = bd_c1; bd_c <= bd_c2; bd_c++){
                if(!(bd_r == bd_r1 || bd_r == bd_r2 || bd_c == bd_c1 || bd_c == bd_c2)){
                  continue;
                }

                if(bd_r == bd_r1){
                  if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                    borderInfoCompute[bd_r + "_" + bd_c] = {};
                  }

                  borderInfoCompute[bd_r + "_" + bd_c].t = { "color": borderColor, "style": borderStyle };

                  let bd_r_top = bd_r1 - 1;

                  if(bd_r_top >= 0 && borderInfoCompute[bd_r_top + "_" + bd_c]){
                    if(data[bd_r_top] != null && getObjType(data[bd_r_top][bd_c]) == "object" && data[bd_r_top][bd_c].mc != null){
                      let cell_top = data[bd_r_top][bd_c];

                      let mc = cfg["merge"][cell_top.mc.r + "_" + cell_top.mc.c];

                      if(mc.r + mc.rs - 1 == bd_r_top){
                        borderInfoCompute[bd_r_top + "_" + bd_c].b = { "color": borderColor, "style": borderStyle };
                      }
                    }
                    else{
                      borderInfoCompute[bd_r_top + "_" + bd_c].b = { "color": borderColor, "style": borderStyle };
                    }
                  }
                }

                if(bd_r == bd_r2){
                  if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                    borderInfoCompute[bd_r + "_" + bd_c] = {};
                  }

                  borderInfoCompute[bd_r + "_" + bd_c].b = { "color": borderColor, "style": borderStyle };

                  let bd_r_bottom = bd_r2 + 1;

                  if(bd_r_bottom < data.length && borderInfoCompute[bd_r_bottom + "_" + bd_c]){
                    if(data[bd_r_bottom] != null && getObjType(data[bd_r_bottom][bd_c]) == "object" && data[bd_r_bottom][bd_c].mc != null){
                      let cell_bottom = data[bd_r_bottom][bd_c];

                      let mc = cfg["merge"][cell_bottom.mc.r + "_" + cell_bottom.mc.c];

                      if(mc.r == bd_r_bottom){
                        borderInfoCompute[bd_r_bottom + "_" + bd_c].t = { "color": borderColor, "style": borderStyle };
                      }
                    }
                    else{
                      borderInfoCompute[bd_r_bottom + "_" + bd_c].t = { "color": borderColor, "style": borderStyle };
                    }
                  }
                }

                if(bd_c == bd_c1){
                  if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                    borderInfoCompute[bd_r + "_" + bd_c] = {};
                  }

                  borderInfoCompute[bd_r + "_" + bd_c].l = { "color": borderColor, "style": borderStyle };

                  let bd_c_left = bd_c1 - 1;

                  if(bd_c_left >= 0 && borderInfoCompute[bd_r + "_" + bd_c_left]){
                    if(data[bd_r] != null && getObjType(data[bd_r][bd_c_left]) == "object" && data[bd_r][bd_c_left].mc != null){
                      let cell_left = data[bd_r][bd_c_left];

                      let mc = cfg["merge"][cell_left.mc.r + "_" + cell_left.mc.c];

                      if(mc.c + mc.cs - 1 == bd_c_left){
                        borderInfoCompute[bd_r + "_" + bd_c_left].r = { "color": borderColor, "style": borderStyle };
                      }
                    }
                    else{
                      borderInfoCompute[bd_r + "_" + bd_c_left].r = { "color": borderColor, "style": borderStyle };
                    }
                  }
                }

                if(bd_c == bd_c2){
                  if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                    borderInfoCompute[bd_r + "_" + bd_c] = {};
                  }

                  borderInfoCompute[bd_r + "_" + bd_c].r = { "color": borderColor, "style": borderStyle };

                  let bd_c_right = bd_c2 + 1;

                  if(bd_c_right < data[0].length && borderInfoCompute[bd_r + "_" + bd_c_right]){
                    if(data[bd_r] != null && getObjType(data[bd_r][bd_c_right]) == "object" && data[bd_r][bd_c_right].mc != null){
                      let cell_right = data[bd_r][bd_c_right];

                      let mc = cfg["merge"][cell_right.mc.r + "_" + cell_right.mc.c];

                      if(mc.c == bd_c_right){
                        borderInfoCompute[bd_r + "_" + bd_c_right].l = { "color": borderColor, "style": borderStyle };
                      }
                    }
                    else{
                      borderInfoCompute[bd_r + "_" + bd_c_right].l = { "color": borderColor, "style": borderStyle };
                    }
                  }
                }
              }
            }
          }
          else if(borderType == "border-inside"){
            for(let bd_r = bd_r1; bd_r <= bd_r2; bd_r++){
              if (cfg["rowhidden"] != null && cfg["rowhidden"][bd_r] != null) {
                continue;
              }

              for(let bd_c = bd_c1; bd_c <= bd_c2; bd_c++){
                if(bd_r == bd_r1 && bd_c == bd_c1){
                  if(data[bd_r] != null && getObjType(data[bd_r][bd_c]) == "object" && data[bd_r][bd_c].mc != null){

                  }
                  else{
                    if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                      borderInfoCompute[bd_r + "_" + bd_c] = {};
                    }

                    borderInfoCompute[bd_r + "_" + bd_c].r = { "color": borderColor, "style": borderStyle };
                    borderInfoCompute[bd_r + "_" + bd_c].b = { "color": borderColor, "style": borderStyle };
                  }
                }
                else if(bd_r == bd_r2 && bd_c == bd_c1){
                  if(data[bd_r] != null && getObjType(data[bd_r][bd_c]) == "object" && data[bd_r][bd_c].mc != null){

                  }
                  else{
                    if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                      borderInfoCompute[bd_r + "_" + bd_c] = {};
                    }

                    borderInfoCompute[bd_r + "_" + bd_c].r = { "color": borderColor, "style": borderStyle };
                    borderInfoCompute[bd_r + "_" + bd_c].t = { "color": borderColor, "style": borderStyle };
                  }
                }
                else if(bd_r == bd_r1 && bd_c == bd_c2){
                  if(data[bd_r] != null && getObjType(data[bd_r][bd_c]) == "object" && data[bd_r][bd_c].mc != null){

                  }
                  else{
                    if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                      borderInfoCompute[bd_r + "_" + bd_c] = {};
                    }

                    borderInfoCompute[bd_r + "_" + bd_c].l = { "color": borderColor, "style": borderStyle };
                    borderInfoCompute[bd_r + "_" + bd_c].b = { "color": borderColor, "style": borderStyle };
                  }
                }
                else if(bd_r == bd_r2 && bd_c == bd_c2){
                  if(data[bd_r] != null && getObjType(data[bd_r][bd_c]) == "object" && data[bd_r][bd_c].mc != null){

                  }
                  else{
                    if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                      borderInfoCompute[bd_r + "_" + bd_c] = {};
                    }

                    borderInfoCompute[bd_r + "_" + bd_c].l = { "color": borderColor, "style": borderStyle };
                    borderInfoCompute[bd_r + "_" + bd_c].t = { "color": borderColor, "style": borderStyle };
                  }
                }
                else if(bd_r == bd_r1){
                  if(data[bd_r] != null && getObjType(data[bd_r][bd_c]) == "object" && data[bd_r][bd_c].mc != null){
                    let cell = data[bd_r][bd_c];

                    let mc = cfg["merge"][cell.mc.r + "_" + cell.mc.c];

                    if(mc.c == bd_c){
                      if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                        borderInfoCompute[bd_r + "_" + bd_c] = {};
                      }

                      borderInfoCompute[bd_r + "_" + bd_c].l = { "color": borderColor, "style": borderStyle };
                    }
                    else if(mc.c + mc.cs - 1 == bd_c){
                      if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                        borderInfoCompute[bd_r + "_" + bd_c] = {};
                      }

                      borderInfoCompute[bd_r + "_" + bd_c].r = { "color": borderColor, "style": borderStyle };
                    }
                  }
                  else{
                    if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                      borderInfoCompute[bd_r + "_" + bd_c] = {};
                    }

                    borderInfoCompute[bd_r + "_" + bd_c].l = { "color": borderColor, "style": borderStyle };
                    borderInfoCompute[bd_r + "_" + bd_c].r = { "color": borderColor, "style": borderStyle };
                    borderInfoCompute[bd_r + "_" + bd_c].b = { "color": borderColor, "style": borderStyle };
                  }
                }
                else if(bd_r == bd_r2){
                  if(data[bd_r] != null && getObjType(data[bd_r][bd_c]) == "object" && data[bd_r][bd_c].mc != null){
                    let cell = data[bd_r][bd_c];

                    let mc = cfg["merge"][cell.mc.r + "_" + cell.mc.c];

                    if(mc.c == bd_c){
                      if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                        borderInfoCompute[bd_r + "_" + bd_c] = {};
                      }

                      borderInfoCompute[bd_r + "_" + bd_c].l = { "color": borderColor, "style": borderStyle };
                    }
                    else if(mc.c + mc.cs - 1 == bd_c){
                      if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                        borderInfoCompute[bd_r + "_" + bd_c] = {};
                      }

                      borderInfoCompute[bd_r + "_" + bd_c].r = { "color": borderColor, "style": borderStyle };
                    }
                  }
                  else{
                    if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                      borderInfoCompute[bd_r + "_" + bd_c] = {};
                    }

                    borderInfoCompute[bd_r + "_" + bd_c].l = { "color": borderColor, "style": borderStyle };
                    borderInfoCompute[bd_r + "_" + bd_c].r = { "color": borderColor, "style": borderStyle };
                    borderInfoCompute[bd_r + "_" + bd_c].t = { "color": borderColor, "style": borderStyle };
                  }
                }
                else if(bd_c == bd_c1){
                  if(data[bd_r] != null && getObjType(data[bd_r][bd_c]) == "object" && data[bd_r][bd_c].mc != null){
                    let cell = data[bd_r][bd_c];

                    let mc = cfg["merge"][cell.mc.r + "_" + cell.mc.c];

                    if(mc.r == bd_r){
                      if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                        borderInfoCompute[bd_r + "_" + bd_c] = {};
                      }

                      borderInfoCompute[bd_r + "_" + bd_c].t = { "color": borderColor, "style": borderStyle };
                    }
                    else if(mc.r + mc.rs - 1 == bd_r){
                      if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                        borderInfoCompute[bd_r + "_" + bd_c] = {};
                      }

                      borderInfoCompute[bd_r + "_" + bd_c].b = { "color": borderColor, "style": borderStyle };
                    }
                  }
                  else{
                    if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                      borderInfoCompute[bd_r + "_" + bd_c] = {};
                    }

                    borderInfoCompute[bd_r + "_" + bd_c].r = { "color": borderColor, "style": borderStyle };
                    borderInfoCompute[bd_r + "_" + bd_c].t = { "color": borderColor, "style": borderStyle };
                    borderInfoCompute[bd_r + "_" + bd_c].b = { "color": borderColor, "style": borderStyle };
                  }
                }
                else if(bd_c == bd_c2){
                  if(data[bd_r] != null && getObjType(data[bd_r][bd_c]) == "object" && data[bd_r][bd_c].mc != null){
                    let cell = data[bd_r][bd_c];

                    let mc = cfg["merge"][cell.mc.r + "_" + cell.mc.c];

                    if(mc.r == bd_r){
                      if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                        borderInfoCompute[bd_r + "_" + bd_c] = {};
                      }

                      borderInfoCompute[bd_r + "_" + bd_c].t = { "color": borderColor, "style": borderStyle };
                    }
                    else if(mc.r + mc.rs - 1 == bd_r){
                      if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                        borderInfoCompute[bd_r + "_" + bd_c] = {};
                      }

                      borderInfoCompute[bd_r + "_" + bd_c].b = { "color": borderColor, "style": borderStyle };
                    }
                  }
                  else{
                    if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                      borderInfoCompute[bd_r + "_" + bd_c] = {};
                    }

                    borderInfoCompute[bd_r + "_" + bd_c].l = { "color": borderColor, "style": borderStyle };
                    borderInfoCompute[bd_r + "_" + bd_c].t = { "color": borderColor, "style": borderStyle };
                    borderInfoCompute[bd_r + "_" + bd_c].b = { "color": borderColor, "style": borderStyle };
                  }
                }
                else{
                  if(data[bd_r] != null && getObjType(data[bd_r][bd_c]) == "object" && data[bd_r][bd_c].mc != null){
                    let cell = data[bd_r][bd_c];

                    let mc = cfg["merge"][cell.mc.r + "_" + cell.mc.c];

                    if(mc.r == bd_r){
                      if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                        borderInfoCompute[bd_r + "_" + bd_c] = {};
                      }

                      borderInfoCompute[bd_r + "_" + bd_c].t = { "color": borderColor, "style": borderStyle };
                    }
                    else if(mc.r + mc.rs - 1 == bd_r){
                      if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                        borderInfoCompute[bd_r + "_" + bd_c] = {};
                      }

                      borderInfoCompute[bd_r + "_" + bd_c].b = { "color": borderColor, "style": borderStyle };
                    }

                    if(mc.c == bd_c){
                      if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                        borderInfoCompute[bd_r + "_" + bd_c] = {};
                      }

                      borderInfoCompute[bd_r + "_" + bd_c].l = { "color": borderColor, "style": borderStyle };
                    }
                    else if(mc.c + mc.cs - 1 == bd_c){
                      if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                        borderInfoCompute[bd_r + "_" + bd_c] = {};
                      }

                      borderInfoCompute[bd_r + "_" + bd_c].r = { "color": borderColor, "style": borderStyle };
                    }
                  }
                  else{
                    if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                      borderInfoCompute[bd_r + "_" + bd_c] = {};
                    }

                    borderInfoCompute[bd_r + "_" + bd_c].l = { "color": borderColor, "style": borderStyle };
                    borderInfoCompute[bd_r + "_" + bd_c].r = { "color": borderColor, "style": borderStyle };
                    borderInfoCompute[bd_r + "_" + bd_c].t = { "color": borderColor, "style": borderStyle };
                    borderInfoCompute[bd_r + "_" + bd_c].b = { "color": borderColor, "style": borderStyle };
                  }
                }
              }
            }
          }
          else if(borderType == "border-horizontal"){
            for(let bd_r = bd_r1; bd_r <= bd_r2; bd_r++){
              if (cfg["rowhidden"] != null && cfg["rowhidden"][bd_r] != null) {
                continue;
              }

              for(let bd_c = bd_c1; bd_c <= bd_c2; bd_c++){
                if(bd_r == bd_r1){
                  if(data[bd_r] != null && getObjType(data[bd_r][bd_c]) == "object" && data[bd_r][bd_c].mc != null){

                  }
                  else{
                    if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                      borderInfoCompute[bd_r + "_" + bd_c] = {};
                    }

                    borderInfoCompute[bd_r + "_" + bd_c].b = { "color": borderColor, "style": borderStyle };
                  }
                }
                else if(bd_r == bd_r2){
                  if(data[bd_r] != null && getObjType(data[bd_r][bd_c]) == "object" && data[bd_r][bd_c].mc != null){

                  }
                  else{
                    if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                      borderInfoCompute[bd_r + "_" + bd_c] = {};
                    }

                    borderInfoCompute[bd_r + "_" + bd_c].t = { "color": borderColor, "style": borderStyle };
                  }
                }
                else{
                  if(data[bd_r] != null && getObjType(data[bd_r][bd_c]) == "object" && data[bd_r][bd_c].mc != null){
                    let cell = data[bd_r][bd_c];

                    let mc = cfg["merge"][cell.mc.r + "_" + cell.mc.c];

                    if(mc.r == bd_r){
                      if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                        borderInfoCompute[bd_r + "_" + bd_c] = {};
                      }

                      borderInfoCompute[bd_r + "_" + bd_c].t = { "color": borderColor, "style": borderStyle };
                    }
                    else if(mc.r + mc.rs - 1 == bd_r){
                      if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                        borderInfoCompute[bd_r + "_" + bd_c] = {};
                      }

                      borderInfoCompute[bd_r + "_" + bd_c].b = { "color": borderColor, "style": borderStyle };
                    }
                  }
                  else{
                    if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                      borderInfoCompute[bd_r + "_" + bd_c] = {};
                    }

                    borderInfoCompute[bd_r + "_" + bd_c].t = { "color": borderColor, "style": borderStyle };
                    borderInfoCompute[bd_r + "_" + bd_c].b = { "color": borderColor, "style": borderStyle };
                  }
                }
              }
            }
          }
          else if(borderType == "border-vertical"){
            for(let bd_r = bd_r1; bd_r <= bd_r2; bd_r++){
              if (cfg["rowhidden"] != null && cfg["rowhidden"][bd_r] != null) {
                continue;
              }

              for(let bd_c = bd_c1; bd_c <= bd_c2; bd_c++){
                if(bd_c == bd_c1){
                  if(data[bd_r] != null && getObjType(data[bd_r][bd_c]) == "object" && data[bd_r][bd_c].mc != null){

                  }
                  else{
                    if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                      borderInfoCompute[bd_r + "_" + bd_c] = {};
                    }

                    borderInfoCompute[bd_r + "_" + bd_c].r = { "color": borderColor, "style": borderStyle };
                  }
                }
                else if(bd_c == bd_c2){
                  if(data[bd_r] != null && getObjType(data[bd_r][bd_c]) == "object" && data[bd_r][bd_c].mc != null){

                  }
                  else{
                    if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                      borderInfoCompute[bd_r + "_" + bd_c] = {};
                    }

                    borderInfoCompute[bd_r + "_" + bd_c].l = { "color": borderColor, "style": borderStyle };
                  }
                }
                else{
                  if(data[bd_r] != null && getObjType(data[bd_r][bd_c]) == "object" && data[bd_r][bd_c].mc != null){
                    let cell = data[bd_r][bd_c];

                    let mc = cfg["merge"][cell.mc.r + "_" + cell.mc.c] || {};

                    if(mc.c == bd_c){
                      if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                        borderInfoCompute[bd_r + "_" + bd_c] = {};
                      }

                      borderInfoCompute[bd_r + "_" + bd_c].l = { "color": borderColor, "style": borderStyle };
                    }
                    else if(mc.c + mc.cs - 1 == bd_c){
                      if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                        borderInfoCompute[bd_r + "_" + bd_c] = {};
                      }

                      borderInfoCompute[bd_r + "_" + bd_c].r = { "color": borderColor, "style": borderStyle };
                    }
                  }
                  else{
                    if(borderInfoCompute[bd_r + "_" + bd_c] == null){
                      borderInfoCompute[bd_r + "_" + bd_c] = {};
                    }

                    borderInfoCompute[bd_r + "_" + bd_c].l = { "color": borderColor, "style": borderStyle };
                    borderInfoCompute[bd_r + "_" + bd_c].r = { "color": borderColor, "style": borderStyle };
                  }
                }
              }
            }
          }
          else if(borderType == "border-none"){
            for(let bd_r = bd_r1; bd_r <= bd_r2; bd_r++){
              if (cfg["rowhidden"] != null && cfg["rowhidden"][bd_r] != null) {
                continue;
              }

              for(let bd_c = bd_c1; bd_c <= bd_c2; bd_c++){
                if(borderInfoCompute[bd_r + "_" + bd_c] != null){
                  delete borderInfoCompute[bd_r + "_" + bd_c];
                }

                if(bd_r == bd_r1){
                  let bd_r_top = bd_r1 - 1;

                  if(bd_r_top >= 0 && borderInfoCompute[bd_r_top + "_" + bd_c]){
                    delete borderInfoCompute[bd_r_top + "_" + bd_c].b;
                  }
                }

                if(bd_r == bd_r2){
                  let bd_r_bottom = bd_r2 + 1;

                  if(bd_r_bottom < data.length && borderInfoCompute[bd_r_bottom + "_" + bd_c]){
                    delete borderInfoCompute[bd_r_bottom + "_" + bd_c].t;
                  }
                }

                if(bd_c == bd_c1){
                  let bd_c_left = bd_c1 - 1;

                  if(bd_c_left >= 0 && borderInfoCompute[bd_r + "_" + bd_c_left]){
                    delete borderInfoCompute[bd_r + "_" + bd_c_left].r;
                  }
                }

                if(bd_c == bd_c2){
                  let bd_c_right = bd_c2 + 1;

                  if(bd_c_right < data[0].length && borderInfoCompute[bd_r + "_" + bd_c_right]){
                    delete borderInfoCompute[bd_r + "_" + bd_c_right].l;
                  }
                }
              }
            }
          }
        }
      }
      else if(rangeType == "cell"){
        let value = borderInfo[i].value;

        let bd_r = value.row_index, bd_c = value.col_index;

        if(bd_r < dataset_row_st || bd_r > dataset_row_ed || bd_c < dataset_col_st || bd_c > dataset_col_ed){
          continue;
        }

        if (cfg["rowhidden"] != null && cfg["rowhidden"][bd_r] != null) {
          continue;
        }

        if(value.l != null || value.r != null || value.t != null || value.b != null){
          if(borderInfoCompute[bd_r + "_" + bd_c] == null){
            borderInfoCompute[bd_r + "_" + bd_c] = {};
          }

          if(data[bd_r] != null && getObjType(data[bd_r][bd_c]) == "object" && data[bd_r][bd_c].mc != null){
            let cell = data[bd_r][bd_c];
            let mc = cfg["merge"][cell.mc.r + "_" + cell.mc.c] || {};

            if(value.l != null && bd_c == mc.c){ //左边框
              borderInfoCompute[bd_r + "_" + bd_c].l = { "color": value.l.color, "style": value.l.style };

              let bd_c_left = bd_c - 1;

              if(bd_c_left >= 0 && borderInfoCompute[bd_r + "_" + bd_c_left]){
                if(data[bd_r] != null && getObjType(data[bd_r][bd_c_left]) == "object" && data[bd_r][bd_c_left].mc != null){
                  let cell_left = data[bd_r][bd_c_left];

                  let mc_l = cfg["merge"][cell_left.mc.r + "_" + cell_left.mc.c];

                  if(mc_l.c + mc_l.cs - 1 == bd_c_left){
                    borderInfoCompute[bd_r + "_" + bd_c_left].r = { "color": value.l.color, "style": value.l.style };
                  }
                }
                else{
                  borderInfoCompute[bd_r + "_" + bd_c_left].r = { "color": value.l.color, "style": value.l.style };
                }
              }
            }
            else{
              borderInfoCompute[bd_r + "_" + bd_c].l = null;
            }

            if(value.r != null && bd_c == mc.c + mc.cs - 1){ //右边框
              borderInfoCompute[bd_r + "_" + bd_c].r = { "color": value.r.color, "style": value.r.style };

              let bd_c_right = bd_c + 1;

              if(bd_c_right < data[0].length && borderInfoCompute[bd_r + "_" + bd_c_right]){
                if(data[bd_r] != null && getObjType(data[bd_r][bd_c_right]) == "object" && data[bd_r][bd_c_right].mc != null){
                  let cell_right = data[bd_r][bd_c_right];

                  let mc_r = cfg["merge"][cell_right.mc.r + "_" + cell_right.mc.c];

                  if(mc_r.c == bd_c_right){
                    borderInfoCompute[bd_r + "_" + bd_c_right].l = { "color": value.r.color, "style": value.r.style };
                  }
                }
                else{
                  borderInfoCompute[bd_r + "_" + bd_c_right].l = { "color": value.r.color, "style": value.r.style };
                }
              }
            }
            else{
              borderInfoCompute[bd_r + "_" + bd_c].r = null;
            }

            if(value.t != null && bd_r == mc.r){ //上边框
              borderInfoCompute[bd_r + "_" + bd_c].t = { "color": value.t.color, "style": value.t.style };

              let bd_r_top = bd_r - 1;

              if(bd_r_top >= 0 && borderInfoCompute[bd_r_top + "_" + bd_c]){
                if(data[bd_r_top] != null && getObjType(data[bd_r_top][bd_c]) == "object" && data[bd_r_top][bd_c].mc != null){
                  let cell_top = data[bd_r_top][bd_c];

                  let mc_t = cfg["merge"][cell_top.mc.r + "_" + cell_top.mc.c];

                  if(mc_t.r + mc_t.rs - 1 == bd_r_top){
                    borderInfoCompute[bd_r_top + "_" + bd_c].b = { "color": value.t.color, "style": value.t.style };
                  }
                }
                else{
                  borderInfoCompute[bd_r_top + "_" + bd_c].b = { "color": value.t.color, "style": value.t.style };
                }
              }
            }
            else{
              borderInfoCompute[bd_r + "_" + bd_c].t = null;
            }

            if(value.b != null && bd_r == mc.r + mc.rs - 1){ //下边框
              borderInfoCompute[bd_r + "_" + bd_c].b = { "color": value.b.color, "style": value.b.style };

              let bd_r_bottom = bd_r + 1;

              if(bd_r_bottom < data.length && borderInfoCompute[bd_r_bottom + "_" + bd_c]){
                if(data[bd_r_bottom] != null && getObjType(data[bd_r_bottom][bd_c]) == "object" && data[bd_r_bottom][bd_c].mc != null){
                  let cell_bottom = data[bd_r_bottom][bd_c];

                  let mc_b = cfg["merge"][cell_bottom.mc.r + "_" + cell_bottom.mc.c];

                  if(mc_b.r == bd_r_bottom){
                    borderInfoCompute[bd_r_bottom + "_" + bd_c].t = { "color": value.b.color, "style": value.b.style };
                  }
                }
                else{
                  borderInfoCompute[bd_r_bottom + "_" + bd_c].t = { "color": value.b.color, "style": value.b.style };
                }
              }
            }
            else{
              borderInfoCompute[bd_r + "_" + bd_c].b = null;
            }
          }
          else{
            if(value.l != null){ //左边框
              borderInfoCompute[bd_r + "_" + bd_c].l = { "color": value.l.color, "style": value.l.style };

              let bd_c_left = bd_c - 1;

              if(bd_c_left >= 0 && borderInfoCompute[bd_r + "_" + bd_c_left]){
                if(data[bd_r] != null && getObjType(data[bd_r][bd_c_left]) == "object" && data[bd_r][bd_c_left].mc != null){
                  let cell_left = data[bd_r][bd_c_left];

                  let mc_l = cfg["merge"][cell_left.mc.r + "_" + cell_left.mc.c];

                  if(mc_l.c + mc_l.cs - 1 == bd_c_left){
                    borderInfoCompute[bd_r + "_" + bd_c_left].r = { "color": value.l.color, "style": value.l.style };
                  }
                }
                else{
                  borderInfoCompute[bd_r + "_" + bd_c_left].r = { "color": value.l.color, "style": value.l.style };
                }
              }
            }
            else{
              borderInfoCompute[bd_r + "_" + bd_c].l = null;
            }

            if(value.r != null){ //右边框
              borderInfoCompute[bd_r + "_" + bd_c].r = { "color": value.r.color, "style": value.r.style };

              let bd_c_right = bd_c + 1;

              if(bd_c_right < data[0].length && borderInfoCompute[bd_r + "_" + bd_c_right]){
                if(data[bd_r] != null && getObjType(data[bd_r][bd_c_right]) == "object" && data[bd_r][bd_c_right].mc != null){
                  let cell_right = data[bd_r][bd_c_right];

                  let mc_r = cfg["merge"][cell_right.mc.r + "_" + cell_right.mc.c];

                  if(mc_r.c == bd_c_right){
                    borderInfoCompute[bd_r + "_" + bd_c_right].l = { "color": value.r.color, "style": value.r.style };
                  }
                }
                else{
                  borderInfoCompute[bd_r + "_" + bd_c_right].l = { "color": value.r.color, "style": value.r.style };
                }
              }
            }
            else{
              borderInfoCompute[bd_r + "_" + bd_c].r = null;
            }

            if(value.t != null){ //上边框
              borderInfoCompute[bd_r + "_" + bd_c].t = { "color": value.t.color, "style": value.t.style };

              let bd_r_top = bd_r - 1;

              if(bd_r_top >= 0 && borderInfoCompute[bd_r_top + "_" + bd_c]){
                if(data[bd_r_top] != null && getObjType(data[bd_r_top][bd_c]) == "object" && data[bd_r_top][bd_c].mc != null){
                  let cell_top = data[bd_r_top][bd_c];

                  let mc_t = cfg["merge"][cell_top.mc.r + "_" + cell_top.mc.c];

                  if(mc_t.r + mc_t.rs - 1 == bd_r_top){
                    borderInfoCompute[bd_r_top + "_" + bd_c].b = { "color": value.t.color, "style": value.t.style };
                  }
                }
                else{
                  borderInfoCompute[bd_r_top + "_" + bd_c].b = { "color": value.t.color, "style": value.t.style };
                }
              }
            }
            else{
              borderInfoCompute[bd_r + "_" + bd_c].t = null;
            }

            if(value.b != null){ //下边框
              borderInfoCompute[bd_r + "_" + bd_c].b = { "color": value.b.color, "style": value.b.style };

              let bd_r_bottom = bd_r + 1;

              if(bd_r_bottom < data.length && borderInfoCompute[bd_r_bottom + "_" + bd_c]){
                if(data[bd_r_bottom] != null && getObjType(data[bd_r_bottom][bd_c]) == "object" && data[bd_r_bottom][bd_c].mc != null){
                  let cell_bottom = data[bd_r_bottom][bd_c];

                  let mc_b = cfg["merge"][cell_bottom.mc.r + "_" + cell_bottom.mc.c];

                  if(mc_b.r == bd_r_bottom){
                    borderInfoCompute[bd_r_bottom + "_" + bd_c].t = { "color": value.b.color, "style": value.b.style };
                  }
                }
                else{
                  borderInfoCompute[bd_r_bottom + "_" + bd_c].t = { "color": value.b.color, "style": value.b.style };
                }
              }
            }
            else{
              borderInfoCompute[bd_r + "_" + bd_c].b = null;
            }
          }
        }
        else{
          delete borderInfoCompute[bd_r + "_" + bd_c];
        }
      }
    }
  }
  return borderInfoCompute;
}

//获取数据类型
var getObjType = function (obj) {
  let toString = Object.prototype.toString;

  let map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  return map[toString.call(obj)];
}


var setStyleAndValue = function (cellArr, worksheet) {
  if (!Array.isArray(cellArr)) return;

  cellArr.forEach(function (row, rowid) {
    const dbrow = worksheet.getRow(rowid+1);
    //设置单元格行高,默认乘以1.2倍
    dbrow.height=luckysheet.getRowHeight([rowid])[rowid]*1.2;
    row.every(function (cell, columnid) {
      if (!cell) return true;
      if(rowid===0){
        const dobCol = worksheet.getColumn(columnid+1);
        //设置单元格列宽除以8
        dobCol.width=luckysheet.getColumnWidth([columnid])[columnid]/8;
      }
      let fill = fillConvert(cell.bg);
      let font = fontConvert(cell.ff, cell.fc, cell.bl, cell.it, cell.fs, cell.cl, cell.ul);
      let alignment = alignmentConvert(cell.vt, cell.ht, cell.tb, cell.tr);
      let value;

      var v='';
      if(cell.ct&&cell.ct.t=='inlineStr'){
        var s=cell.ct.s;
        s.forEach(function(val,num){
          v+=val.v;
        })
      }else{
        v=cell.v;
      }
      if (cell.f) {
        value = { formula: cell.f, result: v };
      } else {
        value = v;
      }
      let target = worksheet.getCell(rowid + 1, columnid + 1);
      target.fill = fill;
      target.font = font;
      target.alignment = alignment;
      target.value = value;
      return true;
    })
  })
}

//转换颜色
var rgb2hex =function(rgb) {
  if (rgb.charAt(0) == '#'){
    return rgb;
  }

  var ds = rgb.split(/\D+/);
  var decimal = Number(ds[1]) * 65536 + Number(ds[2]) * 256 + Number(ds[3]);
  return "#" + zero_fill_hex(decimal, 6);

  function zero_fill_hex(num, digits) {
    var s = num.toString(16);
    while (s.length < digits)
      s = "0" + s;
    return s;
  }
}

var fillConvert = function (bg) {
  if (!bg) {
    return null;
    // return {
    // 	type: 'pattern',
    // 	pattern: 'solid',
    // 	fgColor:{argb:'#ffffff'.replace('#','')}
    // }
  }
  bg  = bg.indexOf('rgb')>-1 ?rgb2hex(bg):bg;
  let fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: {argb: bg.replace('#', '')}
  }
  return fill
}

var fontConvert = function (ff = 0, fc = '#000000', bl = 0, it = 0, fs = 10, cl = 0, ul = 0) { // luckysheet：ff(样式), fc(颜色), bl(粗体), it(斜体), fs(大小), cl(删除线), ul(下划线)
  const luckyToExcel = {
    0: '微软雅黑',
    1: '宋体（Song）',
    2: '黑体（ST Heiti）',
    3: '楷体（ST Kaiti）',
    4: '仿宋（ST FangSong）',
    5: '新宋体（ST Song）',
    6: '华文新魏',
    7: '华文行楷',
    8: '华文隶书',
    9: 'Arial',
    10: 'Times New Roman ',
    11: 'Tahoma ',
    12: 'Verdana',
    num2bl: function (num) {
      return num === 0 ? false : true
    }
  }

  let font = {
    name:ff,
    family: 1,
    size: fs,
    color: {argb: fc.replace('#', '')},
    bold: luckyToExcel.num2bl(bl),
    italic: luckyToExcel.num2bl(it),
    underline: luckyToExcel.num2bl(ul),
    strike: luckyToExcel.num2bl(cl)
  }

  return font;
}

var alignmentConvert = function (vt = 'default', ht = 'default', tb = 'default', tr = 'default') { // luckysheet:vt(垂直), ht(水平), tb(换行), tr(旋转)
  const luckyToExcel = {
    vertical: {
      0: 'middle',
      1: 'top',
      2: 'bottom',
      default: 'top'
    },
    horizontal: {
      0: 'center',
      1: 'left',
      2: 'right',
      default: 'left'
    },
    wrapText: {
      0: false,
      1: false,
      2: true,
      default: false
    },
    textRotation: {
      0: 0,
      1: 45,
      2: -45,
      3: 'vertical',
      4: 90,
      5: -90,
      default: 0
    }
  }

  let alignment = {
    vertical: luckyToExcel.vertical[vt],
    horizontal: luckyToExcel.horizontal[ht],
    wrapText: luckyToExcel.wrapText[tb],
    textRotation: luckyToExcel.textRotation[tr]
  }
  return alignment;

}
