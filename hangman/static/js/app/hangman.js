function set_words(){
    const url = `${BASE_URL}/api/hangman/setting_words`
    fetch(url, {
        method: "GET",
    })
        .then((response) => response.json())
        .then((result) => {
            if(result.success){
                var str_html = "";
                for(var i = 0; i < result.data.length; i++){
                    var html_btn = `
                    <div style="text-align: center;  display: inline-block;"> 
                        <button onclick="select_word()" type="button" id="valueId" VALUE="old" class="btn btn-lg" style="font-size: xx-large; padding: 10px 30px; margin-top: 100px; background-color:#BDB76B; color: white; margin: 15px;">old</button>
                    </div>`
                    html_btn = html_btn.replaceAll("old", result.data[i]);
                    str_html = str_html + html_btn + "\n";
                }
                $('#word_btn').empty();
                $('#word_btn').append(str_html);
            }else{
                alert(result.errors);
            }
        }) 
}

function select_word(){
    localStorage.clear();
    const word =  event.target.value;
    const url = `${BASE_URL}/api/hangman/setting_word`
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"},
        body: JSON.stringify({
            word: word
        }),
    })
        .then((response) => response.json())
        .then((result) => {
            if(result.success){
                localStorage.setItem("id", result.data)
                location.href='hmStart.html'
            }else{
                alert(result.errors);
            }
        })   
}

function set_blank(){
    const id = localStorage.getItem("id");

    const url = `${BASE_URL}/api/hangman/setting_word/`+id;
    fetch(url, {
        method: "GET",
    })
        .then((response) => response.json())
        .then((result) => {
            if(result.success){
                var str_html = "";
                
                var blank = `<div id= "answer", style="font-size: xx-large; margin: 20px; text-align: center;  display: inline-block;">__ __ __ __ __ __</div>`;
                var oldAnswer = result.data;

                for(let i = 0; i < oldAnswer.length; i++){
                    str_html += "__ ";
                }
                
                $('#answer').empty();
                $('#answer').append(str_html);
            }else{
                alert(result.errors);
            }
        }) 

}

function start_game(){
    const id = localStorage.getItem("id");
    const url = `${BASE_URL}/api/hangman/game_start/`+id;
    const button = event.target;
    const alphabet = button.dataset.letter;

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"},
        body: JSON.stringify({
            alphabet: alphabet
        }),
    })
        .then((response) => response.json())
        .then((result) => {
            if(result.success){
                // 게임에 이김
                if(result.data.win){
                    window.open('hmWin.html', "new", "width=500,height=500,history=no,resizable=no,status=no,scrollbars=yes,menubar=no")
                    location.href= 'hmHome.html';
                }
                // 알파벳이 맞음
                else if(result.data.correct){
                    var oldAnswer = result.data.currentWord;
                    var newAnswer = "";
                    for(let i = 0; i < oldAnswer.length; i++){
                        if(oldAnswer[i] == "*"){
                            newAnswer += "__ ";
                        }else{
                            newAnswer += oldAnswer[i] + " ";
                        }
                    }
                    $('#answer').empty();
                    $('#answer').append(newAnswer);
                }else{
                    const new_html = `
                        <img src="static/images/step`+ (result.data.count) +`.png" alt="Hangman Image" style="height: 20;width: 20; margin: 20px;"/>
                        `;
                    $('#hangman_image').empty();
                    $('#hangman_image').append(new_html);
                    
                }
            }
            else{
                if(result.errors == "게임 오버"){
                    window.open('hmLose.html', "new", "width=500,height=500,history=no,resizable=no,status=no,scrollbars=yes,menubar=no")
                    location.href='hmHome.html';
                }
                    
            }
        }) 
}

function restart(){
    const id = localStorage.getItem("id");
    const url = `${BASE_URL}/api/hangman/game_start/restart/`+id;
    const button = event.target;

    fetch(url, {
        method: "POST",
    })
        .then((response) => response.json())
        .then((result) => {
            // disable 제거
            btn_on();
            // 다시 그려주고
            set_blank();
            const new_html = `
                <img src="static/images/step0.png" alt="Hangman Image" style="height: 20;width: 20; margin: 20px;"/>
                `;
            $('#hangman_image').empty();
            $('#hangman_image').append(new_html);

        })   
}

function btn_off() {
    const button = event.target;
    button.style.backgroundColor = "indianred";
    button.style.pointerEvents = "none";
    button.disabled = 'disabled';
}

function btn_on(){
    var buttons = document.getElementsByClassName("letter");

    for(var i = 0; i < buttons.length; i++){
        buttons[i].style.backgroundColor = "darkkhaki";
        buttons[i].style.pointerEvents = "auto";  
        buttons[i].disabled=false;
    }

}

function reload_restart(){
    if(location.reload){
        restart();
    }
}