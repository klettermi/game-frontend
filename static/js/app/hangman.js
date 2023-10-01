function set_words(){
    const url = `http://localhost:8080/api/hangman/setting_words`
    fetch(url, {
        method: "GET",
    })
        .then((response) => response.json())
        .then((result) => {
            console.log(result);
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
    const url = `http://localhost:8080/api/hangman/setting_word`
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
            console.log(result);
            if(result.success){
                localStorage.setItem("id", result.data)
                location.href='../start.html'
            }else{
                alert(result.errors);
            }
        })   
}

function set_blank(){
    const id = localStorage.getItem("id");

    const url = `http://localhost:8080/api/hangman/setting_word/`+id;
    fetch(url, {
        method: "GET",
    })
        .then((response) => response.json())
        .then((result) => {
            console.log(result);
            if(result.success){
                var str_html = "";
                
                var blank = `<div id= "answer", style="font-size: xx-large; margin: 20px; text-align: center;  display: inline-block;">__ __ __ __ __ __</div>`;
                var oldAnswer = result.data;
                console.log(oldAnswer)
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
    const url = `http://localhost:8080/api/hangman/game_start/`+id;
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
            console.log(result);
            // 선택한 버튼 비활성화
            
            
            if(result.success){
                // 게임에 이김
                if(result.data.win){
                    window.open("../win.html", "new", "width=500,height=500,history=no,resizable=no,status=no,scrollbars=yes,menubar=no")
                    location.href= `../index.html`
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
                    alert("선택하신 알파벳은 단어에 없습니다!");
                }
            
            }else{
                alert(result.errors);
                if(result.errors == "게임 오버")
                    location.href= `../index.html`;
            }
        }) 
}

function btn_off() {
    const button = event.target;
    button.style.backgroundColor = "grey";
    button.style.pointerEvents = "none";
    button.disabled = 'disabled';
}