const content=document.getElementById('content');

const pages={
vicini:`<div class="page"><h2>Persone vicine</h2><p>Attiva il GPS e scopri chi è vicino a te.</p><button onclick="gps()">Aggiorna GPS</button><div id="gps"></div></div>`,
sticker:`<div class="page"><h2>Sticker</h2><div class="sticker">☕ Caffè insieme?</div><div class="sticker">🍹 Drink?</div><div class="sticker">🔥 Tanta roba!</div><div class="sticker">🍑 Che culo!</div><div class="sticker">🍋 Bacetti?</div><div class="sticker">🧹 Motel?</div><div class="sticker">🍐 Che pere!</div></div>`,
chat:`<div class="page"><h2>Chat</h2><p>Nessuna conversazione attiva.</p></div>`,
profilo:`<div class="page"><h2>Profilo</h2><input placeholder="Nome"><br><br><textarea placeholder="Bio"></textarea></div>`,
tris:`<div class="page"><h2>Gioco del tris</h2><div class="board" id="board"></div></div>`
};

function render(page){
content.innerHTML=pages[page];
if(page==='tris') setupTris();
}

document.querySelectorAll('.nav-btn').forEach(btn=>{
btn.onclick=()=>render(btn.dataset.page);
});

function gps(){
navigator.geolocation.getCurrentPosition(
()=>document.getElementById('gps').innerHTML='GPS aggiornato',
()=>document.getElementById('gps').innerHTML='GPS non disponibile'
);
}

function setupTris(){
const board=document.getElementById('board');
let turn='X';
let cells=Array(9).fill('');
for(let i=0;i<9;i++){
const b=document.createElement('button');
b.className='cell';
b.onclick=()=>{
if(cells[i]) return;
cells[i]=turn;
b.innerText=turn;
turn=turn==='X'?'O':'X';
};
board.appendChild(b);
}
}

render('vicini');
