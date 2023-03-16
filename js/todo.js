
const input = document.querySelector("input[type='text']");
const notes_holder = document.querySelector(".notes_holder");
console.log(input, notes_holder);

function add_clicked() {
    if(input.value != "") {
        let divNote = document.createElement("div");
        let pNote = document.createElement("p");
        let divCross = document.createElement("div");
        let aCross = document.createElement("a");

        divNote.className = "note";
        divCross.className = "cross";
        aCross.addEventListener("click", cross_clicked);
        aCross.href = "javascript: void()";
        aCross.textContent = "X";

        pNote.textContent = input.value;
        divNote.appendChild(pNote);
        divCross.appendChild(aCross);
        divNote.appendChild(divCross);

        notes_holder.appendChild(divNote);
        input.value = "";
        (document.querySelector(".task_msg")).style.visibility = "hidden";
    }
}

function cross_clicked( elem ) {
    if(confirm("Are you sure???")) {
        elem.target.parentNode.parentNode.remove();
        input.value = "";
        if(document.querySelectorAll(".note").length == 0) (document.querySelector(".task_msg")).style.visibility = "visible";
    }
}