let core_toggle = 0;
let core_select = -1;

let core_select_btns = document.getElementsByClassName("core-btn");

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