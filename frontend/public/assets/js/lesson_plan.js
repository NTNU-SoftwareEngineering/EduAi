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

            if(para != i) {
                core_select_btns[i].style.backgroundImage = "";
                core_select_btns[i].classList.remove("core-btn-selected");
            }
            else {
                core_select_btns[i].style.backgroundImage = "url('./assets/images/teacher_lesson_plan/Checkbox.svg')";
                core_select_btns[i].classList.add("core-btn-selected");
            }
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


async function eventDelete(idx){

    console.log(idx)
    toDelete = document.querySelectorAll('#' + idx)
  
    for(var i=0;i<toDelete.length;i++) toDelete[i].remove()

    var q = await cnt_event()

    for(var i=q;i<5;i++){
        while(document.getElementById("event"+Number(i+1))){
            document.getElementById("event"+Number(i+1)).id = "event"+Number(i)
            document.getElementById("event"+Number(i+1)).id = "event"+Number(i)
        }
        
    }
    
    
}

async function cnt_event(){
  for(var i=0;i<5;i++){
    if(!document.getElementById("event"+i)) return i
  }
  return 5
}

async function eventAdd(){

  
  var idx = await cnt_event()
  
  if(idx == 5) return


  document.querySelector(".event-row").style.display = "flex"

  const parentEle = document.querySelector(".event-label")

  var div1 = document.createElement('div');
  div1.className = 'event-row';
  div1.id = 'event' + idx;
  div1.style.background = '#FFF';

  var input1 = document.createElement('input');
  input1.className = 'event-row-title-textarea event-name';
  input1.placeholder = '請輸入活動名稱';
  input1.maxLength = 20;

  var button1 = document.createElement('button');
  button1.className = 'event-delete-btn';
  button1.id = 'event' + idx;
  button1.onclick = function() { eventDelete(this.id); };

  div1.appendChild(input1);
  div1.appendChild(button1);

  var div2 = document.createElement('div');
  div2.className = 'event-row';
  div2.id = 'event' + idx;

  var input2 = document.createElement('input');
  input2.className = 'event-row-title-textareacontent event-description';
  input2.style.width = '45%';
  input2.placeholder = '請輸入學習內容及實施方式';
  input2.maxLength = 40;

  var input3 = document.createElement('input');
  input3.className = 'event-row-title-textareacontent event-time';
  input3.style.width = '17.5%';
  input3.placeholder = '請輸入時間(min)，ex. 5';
  input3.type = 'number'; 
  input3.min = 0;
  input3.max = 99;

  var input4 = document.createElement('input');
  input4.className = 'event-row-title-textareacontent event-answer';
  input4.style.width = '37.5%';
  input4.placeholder = '請輸入標準答案';
  input4.maxLength = 50;

  div2.appendChild(input2);
  div2.appendChild(input3);
  div2.appendChild(input4);

  parentEle.appendChild(div1);
  parentEle.appendChild(div2);

}

// below are codes for custom select box

// var x, i, j, l, ll, selElmnt, a, b, c;
// /* Look for any elements with the class "custom-select": */
// x = document.getElementsByClassName("class-selector");
// l = x.length;
// for (i = 0; i < l; i++) {
//   selElmnt = x[i].getElementsByTagName("select")[0];
//   ll = selElmnt.length;
//   /* For each element, create a new DIV that will act as the selected item: */
//   a = document.createElement("DIV");
//   a.setAttribute("class", "select-selected");
//   a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
//   x[i].appendChild(a);
//   /* For each element, create a new DIV that will contain the option list: */
//   b = document.createElement("DIV");
//   b.setAttribute("class", "select-items select-hide");
//   for (j = 1; j < ll; j++) {
//     /* For each option in the original select element,
//     create a new DIV that will act as an option item: */
//     c = document.createElement("DIV");
//     c.innerHTML = selElmnt.options[j].innerHTML;
//     c.addEventListener("click", function(e) {
//         /* When an item is clicked, update the original select box,
//         and the selected item: */
//         var y, i, k, s, h, sl, yl;
//         s = this.parentNode.parentNode.getElementsByTagName("select")[0];
//         sl = s.length;
//         h = this.parentNode.previousSibling;
//         for (i = 0; i < sl; i++) {
//           if (s.options[i].innerHTML == this.innerHTML) {
//             s.selectedIndex = i;
//             h.innerHTML = this.innerHTML;
//             y = this.parentNode.getElementsByClassName("same-as-selected");
//             yl = y.length;
//             for (k = 0; k < yl; k++) {
//               y[k].removeAttribute("class");
//             }
//             this.setAttribute("class", "same-as-selected");
//             break;
//           }
//         }
//         h.click();
//     });
//     b.appendChild(c);
//   }
//   x[i].appendChild(b);
//   a.addEventListener("click", function(e) {
//     /* When the select box is clicked, close any other select boxes,
//     and open/close the current select box: */
//     e.stopPropagation();
//     closeAllSelect(this);
//     this.nextSibling.classList.toggle("select-hide");
//     this.classList.toggle("select-arrow-active");
//   });
// }

// function closeAllSelect(elmnt) {
//   /* A function that will close all select boxes in the document,
//   except the current select box: */
//   var x, y, i, xl, yl, arrNo = [];
//   x = document.getElementsByClassName("select-items");
//   y = document.getElementsByClassName("select-selected");
//   xl = x.length;
//   yl = y.length;
//   for (i = 0; i < yl; i++) {
//     if (elmnt == y[i]) {
//       arrNo.push(i)
//     } else {
//       y[i].classList.remove("select-arrow-active");
//     }
//   }
//   for (i = 0; i < xl; i++) {
//     if (arrNo.indexOf(i)) {
//       x[i].classList.add("select-hide");
//     }
//   }
// }

// /* If the user clicks anywhere outside the select box,
// then close all select boxes: */
// document.addEventListener("click", closeAllSelect);
