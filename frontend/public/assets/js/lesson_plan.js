let core_toggle = 0;
let core_select = -1;

let core_select_btns = document.getElementsByClassName("core-btn");
let eventList  = [0 , 0 , 0 , 0 , 0]
let student_list = [{number : 3 , name:"王小明"} , {number : 12 , name:"小美"}] // 這邊留給後端之後抓班級回傳用

//console.log(core_select_btns)

function generateHTMLbyStudentList(para , target){

    let return_string = ["" , ""]
    return_string[0] += "<div>"

        return_string[0] += "<div class='image'></div>"

        return_string[0] += "<div>"

            return_string[0] += "<div class='name'>" + target.name + "</div>"
            return_string[0] += "<div class='info'>" + para + "班 " + target.number + "號</div>"

        return_string[1] += "</div>"

    return_string[1] += "</div>"


    return return_string

}

function select_class(para){

    if(para == ''){
        document.getElementsByClassName("class_empty_hint")[0].style.display = 'flex'
        document.getElementsByClassName("selected-class_student_list")[0].style.display = 'none'
    }

    else{
        document.getElementsByClassName("class_empty_hint")[0].style.display = 'none'
        document.getElementsByClassName("selected-class_student_list")[0].style.display = 'block'

        var label = document.getElementsByClassName("selected-class_student_list")[0];
        label.innerHTML = ""
        for(var i=0;i<8;i++){
            if(i < student_list.length) label.innerHTML += generateHTMLbyStudentList(para , student_list[i])
        }
    }
    
}

for(var i=0;i<core_select_btns.length;i++){

    core_select_btns[i].style.backgroundImage = "";
    core_select_btns[i].onclick = core_selected(i)

}

let core_labels = document.getElementsByClassName("core-expand-toggle-label");

for(var i=0;i<core_labels.length;i++){
    core_labels[i].style.display = "none";
}

function core_selected(para){

    return function(){
        //console.log(para)
        core_select = para;
        for(var i=0;i<core_select_btns.length;i++){

            if(para != i) core_select_btns[i].style.backgroundImage = "";
            else core_select_btns[i].style.backgroundImage = "url('./assets/images/teacher_lesson_plan/Checkbox.svg')";

        }
    }

}

function core_expand_toggle(){

    core_toggle = core_toggle ? 0 : 1;

    let btn = document.getElementsByClassName("core-expand-btn")[0];

    btn.style.backgroundImage = "url('./assets/images/teacher_lesson_plan/Expand_down_light.svg')";

    

    for(var i=0;i<core_labels.length;i++){
        core_labels[i].style.display = "flex";
    }


    if(!core_toggle){
        for(var i=0;i<core_labels.length;i++){
            core_labels[i].style.display = "none";
        }
        btn.style.backgroundImage = "url('./assets/images/teacher_lesson_plan/Expand_up_light.svg')";
    }

}


function eventDelete(idx){
    eventList[idx] = 0
    toDelete = document.querySelectorAll("#event" + idx)
    for(var i=0;i<toDelete.length;i++) toDelete[i].remove()

    var cnt = 0
    for(var i=0;i<5;i++) if(eventList[i]) cnt += 1
    if(cnt == 0) document.querySelector(".event-row").style.display = "flex"
    
}

function eventAdd(){

    var idx = 0 
    while(idx < 5 && eventList[idx] == 1) idx += 1
    if(idx == 5) return

    eventList[idx] = 1

    document.querySelector(".event-row").style.display = "flex"

    const parentEle = document.querySelector(".event-label")
    parentEle.innerHTML += 
    `
    <div class="event-row" id="event${idx}" style="background: #FFF;">
              <input class="event-row-title-input" placeholder="請輸入活動名稱">
              <button class="event-delete-btn" onclick="eventDelete(${idx})"></button>
            </div>
            <div class="event-row" id="event${idx}">
              <input class="event-row-title" style="width: 45%;" placeholder="請輸入學習內容及實施方式"></input>
              <input class="event-row-title" style="width: 17.5%;" placeholder="請輸入時間"></input>
              <input class="event-row-title" style="width: 37.5%;" placeholder="請輸入標準答案"></input>
            </div>
    `

}
