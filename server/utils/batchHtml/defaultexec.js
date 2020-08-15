
function json_format(json) {
    return JSON.stringify(json, null, '   ');
  };

var globaindex = 0;
var globalnum = 0;
var globalexecnum = 0;

const axiosobj = axios.create({
    baseURL: '/',
    timeout: 100000,
    headers: {'X-Custom-Header': 'foobar'}
});

$(function(){
    batchexec(globaindex);
    checkallbatch();;
})

function batchexecsever(index){
    if(!index){
        index=0;
    }
    var colData = reportarr[index];
    var colid = colData._id;

    axiosobj.get("/api/open/run_auto_all_test?id="+colid+"&token="+globaldata.token+"&mode=json&email=false&download=false&descendants=false") .then(function(response) {
        console.log(response.data);
        console.log(response.status);
        console.log(response.statusText);
        console.log(response.headers);
        console.log(response.config);

        index = index+1;
        batchexecsever(index++);
    });
    

}


function checkallbatch(){

    globalnum = 0;
    globalexecnum = 0;
    for(var i=0;i<reportarr.length;i++){

        
        var colData = reportarr[i];
        var caseList = colData.caseList;
        var reportList = colData.test_report;
        var allcode = 0; 


        for(var j=0; j < caseList.length; j++){
            var colobj = caseList[j];
      

            var id = colobj._id;
            var code  = 1;
            try {
                var item = reportList[id];
                code = item.code;

            } catch (e) {
                
            }
    
            if(code != 0){
                allcode = code;
            }else{
                globalexecnum ++;
            }
     
            globalnum ++;
        }
       
        var codehtml = codeHtml(allcode);;
        $("#status_"+colData._id).html(codehtml);
    }

    $("#batchexecseverbtn").val("自动化测试("+globalexecnum+"/"+globalnum+")");

    
    
}



function batchexec(index){
    if(!index){
        index = globaindex;
    }
   
    var colData = reportarr[index];
  
    var allcode =  colexec(colData);
    var codehtml = codeHtml(allcode);;
    $("#status_"+colData._id).html(codehtml); 
    
}








function colexec(colData){
    var pid = colData._id;
    var caseList = colData.caseList;
    var reportList = colData.test_report;
    var allcode = 0;

    var lefthtml = "";
    var mdTemplate = "";
    
    for(var i=0; i < caseList.length; i++){
        var colobj = caseList[i];
        var id = colobj._id;
        var name = colobj.casename;

        var code  = 1;
        var ishavedata = false;
        try {
            var item = reportList[id];
            code = item.code;
            ishavedata = true;
        } catch (e) {
            
        }

        if(code != 0){
            allcode = code;
        }
     

        let html = `
            <div class="list-content">
                <a class="list" href="#${pid}_${id}">${name}</a>
                ${codeHtml(code)}
            </div>
        `;
        lefthtml +=  html

        if(ishavedata == true){
            mdTemplate += baseHtml(`${pid}_${id}`, colobj.casename, colobj.path, item.status);
            mdTemplate += validHtml(item.validRes);
            mdTemplate += requestHtml(item.url, item.headers, item.data);
            mdTemplate += reponseHtml(item.res_header, item.res_body);
        }
       
    }


  
  

    $("#menu-left").html(lefthtml);

    $("#tp").html(mdTemplate);

    return allcode;
}



function codeHtml(code) {
    let codeHtml = ``;
    switch (code) {
      case 0:
        codeHtml += `<div title="验证通过" class="status status-ok"><i class="icon icon-check-circle"></i></div>`;
        break;
      case 400:
        codeHtml += `<div title="请求异常" class="status status-ko"><i class="icon icon-close-circle"></i></div>`;
        break;
      case 1:
        codeHtml += `<div title="验证失败" class="status status-warning"><i class="icon icon-warning-circle"></i></div>`;
        break;
      default:
        codeHtml += `<div title="验证通过" class="status status-warning"><i class="icon icon-warning-circle"></i></div>`;
        break;
    }
    return codeHtml;
  }
  

function requestHtml(url, headers, params) {
    headers = json_format(headers, null, '   ');
    params = json_format(params);
    let html = ``;
    html += `
    <div>
      <h3>Request</h3>
      <div class="row case-report">
       <div class="col-3 case-report-title">Url</div>
       <div class="col-21">${url}</div>
      </div>`;
    html += headers
      ? `<div class="row case-report">
      <div class="col-3 case-report-title">Headers</div>
      <div class="col-21">
       <pre>${headers}</pre>
      </div>
     </div>`
      : ``;
  
    html += params
      ? ` <div class="row case-report">
     <div class="col-3 case-report-title">Body</div>
     <div class="col-21">
      <pre>${params}</pre>
     </div>
     </div>`
      : ``;
    html += `</div>`;
  
    return html;
  }
  
  function reponseHtml(res_header, res_body) {
    res_header = json_format(res_header, null, '   ');
    res_body = json_format(res_body, null, '   ');
    let html = ``;
    html += `<div><h3>Reponse</h3>`;
  
    html += res_header
      ? `
    <div class="row case-report">
     <div class="col-3 case-report-title">Headers</div>
     <div class="col-21">
      <pre>${res_header}</pre>
     </div>
    </div>`
      : ``;
  
    html += res_body
      ? ` <div class="row case-report">
    <div class="col-3 case-report-title">Body</div>
    <div class="col-21">
     <pre>${res_body}</pre>
    </div>
   </div>`
      : ``;
  
    html += `</div>`;
  
    return html;
  }
  
  function validHtml(validRes) {
    if (validRes && Array.isArray(validRes)) {
      validRes = validRes.map((item, index) => {
        return `<div key=${index}>${item.message}</div>`;
      });
    }
    let html = `
    <div>
      <div class="row case-report">
       <div class="col-3 case-report-title">验证结果</div>
       <div class="col-21">
        ${validRes}
       </div>
      </div>
    </div>
    
    `;
  
    return html;
  }
  
  function baseHtml(index, name, path, status) {
    let html = `
    <div>
      <h2 id=${index}>${name}</h2>
      <h3>基本信息</h3>
      <div class="row case-report">
      <div class="col-3 case-report-title">Path</div>
      <div class="col-21">${path}</div>
     </div>
     <div class="row case-report">
      <div class="col-3 case-report-title">Status</div>
      <div class="col-21">${status}</div>
     </div>
    </div>
    `;
  
    return html;
  }


