var selectGridItem;
var lib, 
    exportRoot,
    dataLen,
    areaGrid,
    stg_map;
var canvas;
var ctx; 
var _mainMc;
var cvs,
    lastX,
    lastY;
var dragStart,
    dragged;
var libidxArr= [],
    mcArr = [],
    dataArr = [],
    areaArr = [],
    allDataArr = [],
    tempArr = [];
var mClipArr = 
[
        "area0","area1","area2","area3","area4",
        "area5","area6","area7","area8","area9",
        "area10","area11","area12","area13","area14",
        "area15","area16"
];
var posArr = 
[
        "강원도","경기도","경상남도","경상북도","광주광역시",
        "대구광역시","대전광역시","부산광역시","서울특별시","세종시",
        "울산광역시","인천광역시","전라남도","전라북도","제주특별자치도",
        "충청남도","충청북도"
];
var tempAreaMc; 
var tempAreaId;
var lib_topX=[];
var modal;
var tempId = "all";
$(function()
{
        cvs = document.getElementById("cvs_map");
        ctx = cvs.getContext('2d');
        trackTransforms(ctx);
        lastX=cvs.width/2,
        lastY=cvs.height/2;
        cvsComplete({}, AdobeAn.getComposition("1CC4A79D4EA2164FB183D743A085A396"));
        function cvsComplete(e, comp)
        {
                lib = comp.getLibrary();
                exportRoot = new lib.Kmap();
                stg_map = new createjs.Stage(cvs);
                dataLen = mArr.length;
                allDataArr = processeingData(mArr);
                setCvsEvent();
                buttonClick("all");
                initbar(lib_topX);
                modal = document.getElementById('myModal');
                setModalFn();
        }
});
function setModalFn()
{
        var span = document.getElementsByClassName("modalClose")[0];
        span.onclick = function()
        {
                modal.style.display = "none";
        }
        window.onclick = function(event)
        {
                if (event.target == modal)
                {
                        modal.style.display = "none";
                }
        }
}
function getSortXnum(arr,num)
{
        var topLip = arr.sort(function(a, b) { 
                return b - a;
        });
        arr = topLip.splice(0,num);
        return arr;
}
function getObjSortNum(arr,num,field)
{
        var topLip = arr.sort(function(a, b) { 
                return (b[field]*1) - (a[field]*1);
        });
        arr = topLip.splice(0,num);
        return arr;
}
function processeingData(arr)
{
        var i;
        _mainMc = new lib.mainMc;
        var _mapMc = _mainMc.mapMc;        
        var len = posArr.length;
        _mapMc.name = "mapMc";
        for(i=0; i<len; ++i)
        {
                var libObjArr=[];
                libidxArr.push(libObjArr);
                areaArr.push(_mapMc[mClipArr[i]]);
        }
        var _arr = [];
        _arr = arr;
        for(i=0; i<dataLen; ++i)
        {
                var posName = mArr[i].시도명;
                var k;
                for( k=0; k < len; ++k)
                {
                        if(posName == posArr[k])
                        {
                                libidxArr[k].push(i);
                        }
                }
                _arr[i].평일운영시간 = mArr[i].평일운영시작시각 +' - '+mArr[i].평일운영종료시각;
                delete _arr[i].평일운영시작시각;
                delete _arr[i].평일운영종료시각;
                _arr[i].토요일운영시간 = mArr[i].토요일운영시작시각 +' - '+mArr[i].토요일운영종료시각;
                delete _arr[i].토요일운영시작시각;
                delete _arr[i].토요일운영종료시각;
                _arr[i].공휴일운영시간 = mArr[i].공휴일운영시작시각 +' - '+mArr[i].공휴일운영종료시각;
                delete _arr[i].공휴일운영시작시각;
                delete _arr[i].공휴일운영종료시각;
                var libTop = {};
                libTop.name = mArr[i].도서관명;
                libTop.num = mArr[i].도서;
                libTop.idx = i;
                lib_topX.push(libTop);
        }
        lib_topX = getObjSortNum(lib_topX,20,"num");
        for(i=0; i<len; ++i)
        {
                var mc = new lib.pointMc();
                mc.name = posArr[i];
                mc.num = libidxArr[i].length;
                mcArr.push(mc);
                if(mc.num != 0)
                {
                        var mapMc = _mapMc[mClipArr[i]];
                        mapMc.addEventListener("click", areaClickFn);
                }
        }

        stg_map.addChild(_mainMc);
        stg_map.update();
        return _arr;
}
function drawPoint(id)
{
        removeAllPoint();
        var mcLen = mcArr.length;
        var mMc = _mainMc.mapMc;
        if(id == "all")
        {
                for(i=0; i<mcLen; ++i)
                {
                        var mc = mcArr[i];
                        mc.txt.text = mc.num;
                        if(mc.num != 0)
                        {
                                mc.x = areaArr[i].x*mMc.scaleX;
                                mc.y = areaArr[i].y*mMc.scaleY;
                                mc.addEventListener("click", pMcClickFn);
                                mc.n = i;
                                mc.cursor = 'pointer';
                                _mainMc.dotMc.addChild(mc);
                        }
                }
        }
        else
        {
                var thisLibIdxArr = libidxArr[id];
                var len = thisLibIdxArr.length;
                var i;
                var mc = mcArr[id];
                mc.txt.text = mc.num;
                if(mc.num != 0)
                {
                        mc.x = areaArr[id].x*mMc.scaleX;
                        mc.y = areaArr[id].y*mMc.scaleY;
                        _mainMc.dotMc.addChild(mc);
                }
        }
        tempId = id;       
        stg_map.update();
}
function removeAllPoint()
{
        var pMc = _mainMc.dotMc;
        pMc.removeAllChildren();
        stg_map.update();
}
function pMcClickFn(e)
{
        if(!dragged)
        {
                var id = e.target.parent.n;
                viewAreaFn(id);
                buttonClick(id);
        }       
}
function areaClickFn(e)
{
        if(!dragged)
        {
                var mc = e.target.parent;
                var id = mc.name.substr(4);
                viewAreaFn(id);
                buttonClick(id);
        }
}
function viewAreaFn(id)
{
        var parentMC;
        if(id == "all")
        {
                if(tempAreaMc != undefined)
                {
                        parentMC = tempAreaMc.parent;
                        parentMC.scaleX = 0.05;
                        parentMC.scaleY = 0.05;
                        parentMC.x = 249.9;
                        parentMC.y = 303.9;
                        parentMC.parent.dotMc.x = parentMC.x;
                        parentMC.parent.dotMc.y = parentMC.y;
                        tempAreaMc.gotoAndStop(0);
                        stg_map.update();
                }     
        }
        else
        {
                var mc = areaArr[id];
                if(tempAreaMc != undefined)
                {
                        tempAreaMc.gotoAndStop(0);
                }
                mc.gotoAndStop(1);
                parentMC = mc.parent;
                parentMC.scaleX = 0.11;
                parentMC.scaleY = 0.11;
                parentMC.x = 249.9 - mc.x * parentMC.scaleX;
                parentMC.y = 303.9 - mc.y * parentMC.scaleY;
                parentMC.parent.dotMc.x = parentMC.x;
                parentMC.parent.dotMc.y = parentMC.y;
                stg_map.update();
                tempAreaMc = mc;      
        }
        drawPoint(id);
}
var tempEle;
function buttonClick(id)
{
        if(tempAreaId==id)
        {
                return;
        }
        var _id;
        var num;
        var tempArr=[];
        var _dataArr;
        if(id == "all")
        {
                _id =  id;
                _dataArr = allDataArr;
        }
        else
        {
            _id = "area"+id;
            _dataArr = viewArea(libidxArr[id]);
            var o = {}, 
            i, 
            r=[];
            var l = _dataArr.length;
    
            for (i = 0; i < l; i++)
            {
                    o[_dataArr[i].시군구명] = _dataArr[i].시군구명;
            }
            for (i in o)
            {
                    r.push(o[i]);
            }
        }
        initGrid(_dataArr);
        viewAreaFn(id);
        var el = document.getElementById(_id);
        el.className = "button grayOn";
        if(tempEle != undefined && tempEle != el)
        {
                tempEle.className = "button gray";
        }
        tempEle = el;
        tempAreaId=id;
}
function viewArea(idxArr)
{
        var _arr = [];
        var i;
        var k=0;
        for(i=0; i < dataLen; ++i)
        {
                if(i == idxArr[k])
                {
                        _arr.push(mArr[i]);
                        ++k;
                }
        }
        idxArr = null;
        return _arr;    
}
function initGrid(data)
{
        areaGrid = null;
        areaGrid = new ax5.ui.grid(
        {
                target: $('[data-ax5grid="areaGrid"]'),
                header: 
                {
                        align: "center", height: 40,
                },
                columns: 
                [
                        { key: "시도명",          label: "시도명",              align: "center", width: 80, sortable: true},
                        { key: "시군구명",        label: "시군구명",            align: "center", width: 80 , sortable: true},
                        { key: "도서관명",        label: "도서관명",            align: "center",  width: 163, sortable: true },
                        { key: "도서관유형",      label: "도서관유형",          align: "center",  width: 85, sortable: true},
                        { key: "휴관일",          label: "휴관일",             align: "center", width: 113},
                        { key: "열람좌석수",    label: "좌석수",               align: "center",  width: 60, sortable: true},
                        { key: "도서",          label: "도서",                align: "center", width: 70, sortable: true},
                        { key: "연속간행물",    label: "연속간행물",           align: "center", width: 85, sortable: true},
                        { key: "비도서",        label: "비도서",               align: "center", width: 60, sortable: true},
                        { key: "대출가능권수",  label: "대출가능권수",          align: "center", width: 95, sortable: true},
                        { key: "도서관전화번호", label: "전화번호",             align: "center", width: 110, sortable: true},
                        { key: "",   label: "상세정보",         align: "center", width: 60,
                                formatter: function()
                                {
                                        var str = "<input class='topNavi_img' type='image' src='resources/images/bn_i.png' onclick='viewDetail("+ JSON.stringify(this.item) + ");' value='i' id='all' style='margin-top: 0px;'>";
                                        return str;
                                }
                        },
                        { key: "홈페이지주소",   label: "홈페이지",         align: "center", width: 60,
                                formatter: function()
                                {
                                        var str = this.value;
                                        var url = '"' + this.value + '"';
                                        var btn = "<input class='topNavi_img' type='image' src='resources/images/bn_go.png' onclick='goWebPopup(" + url + ");' id='all' style='margin-top: 0px;'>";
                                        str = (str.substr(0,2)=="ht") ?  btn : "-";
                                        return str;
                                }
                        },
                        { key: "경도",   label: "구글지도",         align: "center", width: 60,
                                formatter: function()
                                {
                                        var str = this.value;
                                        var btn;

                                        if(str != null && str < 200)
                                        {
                                                btn = "<input class='topNavi_img' type='image' src='resources/images/bn_go.png' onclick='gomapPopup(" + JSON.stringify(this.item) + ");' id='all' style='margin-top: 0px;'>";

                                        }else{
                                                btn = "-"
                                        }
                                        return btn;
                                }
                        },
                ],
                body: 
                {
                    columnHeight: 26,
                    onClick:function(){
                        var n = this.dindex;
                        selectArea(n);
                    }
                },
        });
        areaGrid.setConfig(
        {
                frozenColumnIndex: 3,
                frozenRowIndex: 0,
                showLineNumber: true,
                showRowSelector: false,
                lineNumberColumnWidth: 40,
                rowSelectorColumnWidth: 30
        });
        areaGrid.setData(data);
        areaGrid.select(0, { selectedClear: true });
}
function selectArea(n)
{
        areaGrid.focus(n);
}
function goWebPopup(url)
{
        var openNewWindow = window.open("about:blank");
        openNewWindow.location.href = url;
}
function gomapPopup(obj)
{
        var openNewWindow = window.open("about:blank");
        openNewWindow.location.href = "https://www.google.com/maps/place/" + obj.위도 + "," + obj.경도;
}
function trackTransforms(ctx)
{
        var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
        var xform = svg.createSVGMatrix();
        ctx.getTransform = function()
        {
                return xform; 
        };    
        var savedTransforms = [];
        var save = ctx.save;
        ctx.save = function()
        {
                savedTransforms.push(xform.translate(0,0));
                return save.call(ctx);
        };
        var restore = ctx.restore;
        ctx.restore = function()
        {
                xform = savedTransforms.pop();
                return restore.call(ctx);
        };
        var scale = ctx.scale;
        ctx.scale = function(sx,sy)
        {
                xform = xform.scaleNonUniform(sx,sy);
                return scale.call(ctx,sx,sy);
        };
        var rotate = ctx.rotate;
        ctx.rotate = function(radians)
        {
                xform = xform.rotate(radians*180/Math.PI);
                return rotate.call(ctx,radians);
        };
        var translate = ctx.translate;
        ctx.translate = function(dx,dy)
        {
                xform = xform.translate(dx,dy);
                return translate.call(ctx,dx,dy);
        };
        var transform = ctx.transform;
        ctx.transform = function(a,b,c,d,e,f)
        {
                var m2 = svg.createSVGMatrix();
                m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
                xform = xform.multiply(m2);
                return transform.call(ctx,a,b,c,d,e,f);
        };
        var setTransform = ctx.setTransform;
        ctx.setTransform = function(a,b,c,d,e,f)
        {
                xform.a = a;
                xform.b = b;
                xform.c = c;
                xform.d = d;
                xform.e = e;
                xform.f = f;
                return setTransform.call(ctx,a,b,c,d,e,f);
        };
        var pt  = svg.createSVGPoint();
        ctx.transformedPoint = function(x,y)
        {
                pt.x=x; pt.y=y;
                return pt.matrixTransform(xform.inverse());
        }
}
function setCvsEvent()
{
    cvs.addEventListener('mousedown',function(e)
    {
            lastX = e.offsetX;
            lastY = e.offsetY;
            dragStart = ctx.transformedPoint(lastX,lastY);
            dragged = false;
    },false);
    cvs.addEventListener('mousemove',function(e)
    {
        dragged = true;

        if (dragStart)
        {
            var pt = ctx.transformedPoint(lastX,lastY);
            ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
            var dragX = e.offsetX - lastX;
            var dragY = e.offsetY - lastY;
            _mainMc.dotMc.x = _mainMc.mapMc.x += dragX;
            _mainMc.dotMc.y = _mainMc.mapMc.y += dragY;
            lastX = e.offsetX;
            lastY = e.offsetY;
            stg_map.update();
        }
    },false);
    cvs.addEventListener('mouseup',function(e)
    {
        dragStart = null;
    },false);
    var scaleFactor = 1.1;
    var zoom = function(clicks)
    {                        
            var factor = Math.pow(scaleFactor,clicks);
            var tempScale = _mainMc.mapMc.scaleX;
            _mainMc.mapMc.scaleY = _mainMc.mapMc.scaleX *= factor;
            
            if(_mainMc.mapMc.scaleX < 0.04 )
            {
                    _mainMc.mapMc.scaleY = _mainMc.mapMc.scaleX = tempScale;
            }

                drawPoint(tempId);
            stg_map.update();
    }
    var handleScroll = function(e)
    {
            var delta = e.wheelDelta ? e.wheelDelta/40 : e.detail ? -e.detail : 0;
            
            if (delta)
            {
                    zoom(delta);
            };
            return e.preventDefault() && false;
    };
    cvs.addEventListener('DOMMouseScroll',handleScroll,false);
    cvs.addEventListener('mousewheel',handleScroll,false);
}
var barCanvas,
barStage;           
function initbar(arr)
{
        var barPadding = 7,
            barHeight;
        var numBars = arr.length;
        var i;
        var baseY = 0;
        if(barStage)
        {
                clearCanvas(barStage);
        }
        barCanvas = document.getElementById("cvs_bar");
        barStage = new createjs.Stage(barCanvas);
        var barWidth = ((barCanvas.width - 150 - (numBars - 1) * barPadding) / numBars) * 1;
        barHeight = barCanvas.height - 150;
        var bg = new createjs.Shape();
        bg.y = -10;
        for (i = 0; i < 10; i++)
        {
                var endPointY = (barCanvas.height - 80 - (i / 10) * barHeight) + 0.5;
                bg.graphics.beginStroke(i % 2 ? "#555840" : "#444850")
                .moveTo(50, endPointY)
                .lineTo(barCanvas.width - 60, endPointY);
        }
        barStage.addChild(bg);
        label = new createjs.Text("도서수 Top 20", "bold 18px 굴림", "#FFF");
        label.textAlign = "center";
        label.x = 90;
        label.y = baseY + 20;
        barStage.addChild(label);
        for (i = 0; i < numBars; i++)
        {
                var bar = new createjs.Container();
                bar.name = "bar"+i;
                bar.n = arr[i]["num"];
                bar.idx = arr[i]["idx"];
                var hue = bar.hue = i / numBars * 360;
                var front = new createjs.Shape();
                front.graphics.beginLinearGradientFill(
                [createjs.Graphics.getHSL(hue, 100, 60, 0.9), createjs.Graphics.getHSL(hue, 100, 20, 0.75)],
                [0, 1], 
                0,
                -100,
                barWidth, 0)
                .drawRect(0, -100, barWidth + 1, 100);
                var label = new createjs.Text("ㆍ"+(lib_topX[i]["name"]), "12px 굴림", "#FFF");
                label.textAlign = "left";
                label.x = barWidth / 2  + 1;
                label.y = 5;
                label.rotation = 20;
                var value = new createjs.Text("", "14px Arial", "#fff");
                value.textAlign = "right";//"center";
                value.text = numberWithCommas(bar.n);
                value.x = barWidth / 2 + 8;
                value.visible = true;
                value.y = -10;
                value.rotation = 90;
                bar.addChild(front, value, label);
                bar.x = i * (barWidth + barPadding) + 60;
                bar.y = barCanvas.height - 90;
                var xxx = numMap((lib_topX[i]["num"]*1), (lib_topX[0]["num"]*1), (lib_topX[lib_topX.length-1]["num"]*1), 100, 0);
                front.scaleY = Math.round(xxx)*0.01 + 0.1;
                bar.addEventListener('mousedown',function(e)
                {
                        var mc = e.target.parent;
                },false);
                barStage.addChild(bar);
                barStage.update();
        }
        function clearCanvas(barStage)
        {
                barStage.removeAllChildren();
                barStage.update();
        }
}
function numberWithCommas(x)
{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function numMap(x, in_min, in_max, out_min, out_max)
{
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
function viewDetail(n)
{
        var area01 = (n.건물면적 == null || n.건물면적 == undefined) ? "-" : n.건물면적;
        var area02 = (n.부지면적 == null) ? "-" : n.부지면적;
        var website0 = n.홈페이지주소;
        website = (website0.substr(0,2)=="ht") ?  '<a href="' + n.홈페이지주소  +   '" target="_blank">' + n.홈페이지주소 +'</a>' : "-";
        var myTable = '';
        myTable += '<div style="position:absolute;width:103px;height:26px;margin-top:10px;margin-left:0px; border:1px solid #444444;background-color:#0CC2D0;color:#333333; text-align:center;font:14px/100% 굴림;font-weight:bold; padding: .8em 0.85em .1em;">도서</div>';
        myTable += '<div style="position:absolute;width:103px;height:26px;margin-top:43px;margin-left:0px; border:1px solid #444444;background-color:#666666;color:#ededed; text-align:center;font:14px/100% 굴림; padding: .8em 0.85em .1em;"> ' + n.도서 +'</div>';
        myTable += '<div style="position:absolute;width:103px;height:26px;margin-top:10px;margin-left:128px; border:1px solid #444444;background-color:#0CC2D0;color:#333333; text-align:center;font:14px/100% 굴림;font-weight:bold; padding: .8em 0.85em .1em;">연속간행물</div>';
        myTable += '<div style="position:absolute;width:103px;height:26px;margin-top:43px;margin-left:128px; border:1px solid #444444;background-color:#666666;color:#ededed; text-align:center;font:14px/100% 굴림; padding: .8em 0.85em .1em;"> ' + n.연속간행물 +'</div>';
        myTable += '<div style="position:absolute;width:103px;height:26px;margin-top:10px;margin-left:256px; border:1px solid #444444;background-color:#0CC2D0;color:#333333; text-align:center;font:14px/100% 굴림;font-weight:bold; padding: .8em 0.85em .1em;">비도서</div>';
        myTable += '<div style="position:absolute;width:103px;height:26px;margin-top:43px;margin-left:256px; border:1px solid #444444;background-color:#666666;color:#ededed; text-align:center;font:14px/100% 굴림; padding: .8em 0.85em .1em;"> ' + n.비도서 +'</div>';
        myTable += '<div style="position:absolute;width:103px;height:26px;margin-top:10px;margin-left:384px; border:1px solid #444444;background-color:#0CC2D0;color:#333333; text-align:center;font:14px/100% 굴림;font-weight:bold; padding: .8em 0.85em .1em;">열람좌석수</div>';
        myTable += '<div style="position:absolute;width:103px;height:26px;margin-top:43px;margin-left:384px; border:1px solid #444444;background-color:#666666;color:#ededed; text-align:center;font:14px/100% 굴림; padding: .8em 0.85em .1em;"> ' + n.열람좌석수 +'</div>';
        myTable += '<div style="position:absolute;width:103px;height:26px;margin-top:10px;margin-left:512px; border:1px solid #444444;background-color:#0CC2D0;color:#333333; text-align:center;font:14px/100% 굴림;font-weight:bold; padding: .8em 0.85em .1em;">대출 가능권수</div>';
        myTable += '<div style="position:absolute;width:103px;height:26px;margin-top:43px;margin-left:512px; border:1px solid #444444;background-color:#666666;color:#ededed; text-align:center;font:14px/100% 굴림; padding: .8em 0.85em .1em;"> ' + n.대출가능권수 +'</div>';
        myTable += '<div style="position:absolute;width:103px;height:26px;margin-top:10px;margin-left:640px; border:1px solid #444444;background-color:#0CC2D0;color:#333333; text-align:center;font:14px/100% 굴림;font-weight:bold; padding: .8em 0.85em .1em;">대출 가능일수</div>';
        myTable += '<div style="position:absolute;width:103px;height:26px;margin-top:43px;margin-left:640px; border:1px solid #444444;background-color:#666666;color:#ededed; text-align:center;font:14px/100% 굴림; padding: .8em 0.85em .1em;"> ' + n.대출가능일수 +'</div>';
        myTable += '<div style="position:absolute;width:143px;height:26px;margin-top:110px;margin-left:0px; border:1px solid #444444;background-color:#0CC2D0;color:#333333; text-align:center;font:14px/100% 굴림;font-weight:bold; padding: .8em 0.85em .1em;">평일 운영시간</div>';
        myTable += '<div style="position:absolute;width:143px;height:26px;margin-top:143px;margin-left:0px; border:1px solid #444444;background-color:#666666;color:#ededed; text-align:center;font:14px/100% 굴림; padding: .8em 0.85em .1em;"> ' + n.평일운영시간 +'</div>';
        myTable += '<div style="position:absolute;width:143px;height:26px;margin-top:110px;margin-left:168px; border:1px solid #444444;background-color:#0CC2D0;color:#333333; text-align:center;font:14px/100% 굴림;font-weight:bold; padding: .8em 0.85em .1em;">토요일 운영시간</div>';
        myTable += '<div style="position:absolute;width:143px;height:26px;margin-top:143px;margin-left:168px; border:1px solid #444444;background-color:#666666;color:#ededed; text-align:center;font:14px/100% 굴림; padding: .8em 0.85em .1em;"> ' + n.토요일운영시간 +'</div>';
        myTable += '<div style="position:absolute;width:143px;height:26px;margin-top:110px;margin-left:336px; border:1px solid #444444;background-color:#0CC2D0;color:#333333; text-align:center;font:14px/100% 굴림;font-weight:bold; padding: .8em 0.85em .1em;">공휴일 운영시간</div>';
        myTable += '<div style="position:absolute;width:143px;height:26px;margin-top:143px;margin-left:336px; border:1px solid #444444;background-color:#666666;color:#ededed; text-align:center;font:14px/100% 굴림; padding: .8em 0.85em .1em;"> ' + n.공휴일운영시간 +'</div>';
        myTable += '<div style="position:absolute;width:241px;height:26px;margin-top:110px;margin-left:504px; border:1px solid #444444;background-color:#0CC2D0;color:#333333; text-align:center;font:14px/100% 굴림;font-weight:bold; padding: .8em 0.85em .1em;">휴관일</div>';
        myTable += '<div style="position:absolute;width:241px;height:26px;margin-top:143px;margin-left:504px; border:1px solid #444444;background-color:#666666;color:#ededed; text-align:center;font:14px/100% 굴림; padding: .8em 0.85em .1em;"> ' + n.휴관일 +'</div>';
        myTable += '<div style="position:absolute;width:93px;height:26px;margin-top:210px;margin-left:0px; border:1px solid #444444;background-color:#0CC2D0;color:#333333; text-align:center;font:14px/100% 굴림;font-weight:bold; padding: .8em 0.85em .1em;">시도명</div>';
        myTable += '<div style="position:absolute;width:93px;height:26px;margin-top:243px;margin-left:0px; border:1px solid #444444;background-color:#666666;color:#ededed; text-align:center;font:14px/100% 굴림; padding: .8em 0.85em .1em;"> ' + n.시도명 +'</div>';
        myTable += '<div style="position:absolute;width:93px;height:26px;margin-top:210px;margin-left:118px; border:1px solid #444444;background-color:#0CC2D0;color:#333333; text-align:center;font:14px/100% 굴림;font-weight:bold; padding: .8em 0.85em .1em;">시군구명</div>';
        myTable += '<div style="position:absolute;width:93px;height:26px;margin-top:243px;margin-left:118px; border:1px solid #444444;background-color:#666666;color:#ededed; text-align:center;font:14px/100% 굴림; padding: .8em 0.85em .1em;"> ' + n.시군구명 +'</div>';
        myTable += '<div style="position:absolute;width:509px;height:26px;margin-top:210px;margin-left:236px; border:1px solid #444444;background-color:#0CC2D0;color:#333333; text-align:center;font:14px/100% 굴림;font-weight:bold; padding: .8em 0.85em .1em;">소재지 도로명주소</div>';
        myTable += '<div style="position:absolute;width:509px;height:26px;margin-top:243px;margin-left:236px; border:1px solid #444444;background-color:#666666;color:#ededed; text-align:center;font:14px/100% 굴림; padding: .8em 0.85em .1em;"> ' + n.소재지도로명주소 +'</div>'; 
        myTable += '<div style="position:absolute;width:93px;height:26px;margin-top:310px;margin-left:0px; border:1px solid #444444;background-color:#0CC2D0;color:#333333; text-align:center;font:14px/100% 굴림;font-weight:bold; padding: .8em 0.85em .1em;">건물면적</div>';
        myTable += '<div style="position:absolute;width:93px;height:26px;margin-top:343px;margin-left:0px; border:1px solid #444444;background-color:#666666;color:#ededed; text-align:center;font:14px/100% 굴림; padding: .8em 0.85em .1em;"> ' + area01 +'</div>';
        myTable += '<div style="position:absolute;width:93px;height:26px;margin-top:310px;margin-left:118px; border:1px solid #444444;background-color:#0CC2D0;color:#333333; text-align:center;font:14px/100% 굴림;font-weight:bold; padding: .8em 0.85em .1em;">부지면적</div>';
        myTable += '<div style="position:absolute;width:93px;height:26px;margin-top:343px;margin-left:118px; border:1px solid #444444;background-color:#666666;color:#ededed; text-align:center;font:14px/100% 굴림; padding: .8em 0.85em .1em;"> ' + area02 +'</div>';
        myTable += '<div style="position:absolute;width:509px;height:26px;margin-top:310px;margin-left:236px; border:1px solid #444444;background-color:#0CC2D0;color:#333333; text-align:center;font:14px/100% 굴림;font-weight:bold; padding: .8em 0.85em .1em;">운영기관명</div>';
        myTable += '<div style="position:absolute;width:509px;height:26px;margin-top:343px;margin-left:236px; border:1px solid #444444;background-color:#666666;color:#ededed; text-align:center;font:14px/100% 굴림; padding: .8em 0.85em .1em;"> ' + n.운영기관명 +'</div>';
        myTable += '<div style="position:absolute;width:211px;height:26px;margin-top:410px;margin-left:0px; border:1px solid #444444;background-color:#0CC2D0;color:#333333; text-align:center;font:14px/100% 굴림;font-weight:bold; padding: .8em 0.85em .1em;">도서관 전화번호</div>';
        myTable += '<div style="position:absolute;width:211px;height:26px;margin-top:443px;margin-left:0px; border:1px solid #444444;background-color:#666666;color:#ededed; text-align:center;font:14px/100% 굴림; padding: .8em 0.85em .1em;"> ' + n.도서관전화번호 +'</div>';
        myTable += '<div style="position:absolute;width:509px;height:26px;margin-top:410px;margin-left:236px; border:1px solid #444444;background-color:#0CC2D0;color:#333333; text-align:center;font:14px/100% 굴림;font-weight:bold; padding: .8em 0.85em .1em;">홈페이지 주소</div>';
        myTable += '<div style="position:absolute;width:509px;height:26px;margin-top:443px;margin-left:236px; border:1px solid #444444;background-color:#666666;color:#ededed; text-align:center;font:14px/100% 굴림; padding: .8em 0.85em .1em;"> ' + website + '</div>';
        document.getElementsByClassName("modal-content")[0].children[1].innerHTML = "<h4>" + n.도서관명 +"  [ "+ n.도서관유형 +" - " + n.데이터기준일자  +"일 기준 ]</h4>";
        document.getElementById("modalTable").innerHTML = myTable;
        modal.style.display = "block";
}