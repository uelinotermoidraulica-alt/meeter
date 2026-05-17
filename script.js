const content = document.getElementById("content");

const state = {
  page: "home",
  selectedInterests: JSON.parse(localStorage.getItem("mr_interests") || "[]"),
  profile: JSON.parse(localStorage.getItem("mr_profile") || "{}"),
  game: Array(9).fill(""),
  turn: "X"
};

function setActive(page){
  document.querySelectorAll(".nav-btn").forEach(btn=>{
    btn.classList.toggle("active", btn.dataset.page === page);
  });
}

function render(page){
  state.page = page;
  setActive(page);

  if(page === "home") renderHome();
  if(page === "sticker") renderSticker();
  if(page === "chat") renderChat();
  if(page === "profilo") renderProfilo();
  if(page === "tris") renderTris();
}

function renderHome(){
  content.innerHTML = `
    <section class="page">
      <div class="hero">
        <h1>Meet & React</h1>
        <p>Solo persone reali entro 300 metri.</p>
      </div>

      <div class="card">
        <h2>Home</h2>
        <p>Accedi, attiva il GPS e scopri chi è davvero vicino a te.</p>

        <div class="login-box">
          <input id="email" type="email" placeholder="Email">
          <input id="password" type="password" placeholder="Password">
          <button class="primary" id="loginBtn">Login / Registrati</button>
        </div>

        <hr style="border:0;border-top:1px solid #e5d2bc;margin:22px 0">

        <button class="secondary" id="gpsBtn">Aggiorna posizione GPS</button>
        <div id="homeStatus" class="status"></div>
      </div>
    </section>
  `;

  document.getElementById("loginBtn").onclick = ()=>{
    const email = document.getElementById("email").value.trim();
    if(!email){
      document.getElementById("homeStatus").textContent = "Inserisci una email.";
      return;
    }
    localStorage.setItem("mr_user", email);
    document.getElementById("homeStatus").textContent = "Login demo attivo. Per login reale serve Firebase.";
  };

  document.getElementById("gpsBtn").onclick = ()=>{
    const status = document.getElementById("homeStatus");
    if(!navigator.geolocation){
      status.textContent = "GPS non disponibile.";
      return;
    }
    status.textContent = "Richiesta posizione...";
    navigator.geolocation.getCurrentPosition(pos=>{
      localStorage.setItem("mr_location", JSON.stringify({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        time: Date.now()
      }));
      status.textContent = "GPS aggiornato. Ora sei visibile entro 300 metri.";
    }, ()=>{
      status.textContent = "Permesso GPS negato o non disponibile.";
    }, {enableHighAccuracy:true, timeout:10000});
  };
}

function renderSticker(){
  content.innerHTML = `
    <section class="page">
      <div class="card">
        <h2>Sticker</h2>
        <p>Invia una reazione veloce a una persona vicina.</p>
        <div class="sticker-list">
          <button class="sticker">☕ Caffè insieme?</button>
          <button class="sticker">🍹 Drink?</button>
          <button class="sticker">🔥 Tanta roba!</button>
          <button class="sticker">🍑 Che culo!</button>
          <button class="sticker">🍋 Bacetti?</button>
          <button class="sticker">🧹 Motel?</button>
          <button class="sticker">🍐 Che pere!</button>
        </div>
      </div>
    </section>
  `;
}

function renderChat(){
  content.innerHTML = `
    <section class="page">
      <div class="card">
        <h2>Chat</h2>
        <p>La chat si attiva dopo uno scambio reale o dopo la sfida a tris.</p>
        <div class="empty">Nessuna conversazione attiva.</div>
      </div>
    </section>
  `;
}

function renderProfilo(){
  content.innerHTML = `
    <section class="page">
      <div class="card">
        <h2>Profilo</h2>

        <label>Foto profilo</label>
        <input id="photoInput" type="file" accept="image/*">
        <div id="photoPreview" class="photo">◉</div>

        <label>Nome</label>
        <input id="name" placeholder="Il tuo nome">

        <label>Età</label>
        <input id="age" type="number" min="18" placeholder="Età">

        <label>Bio</label>
        <textarea id="bio" placeholder="Due righe su di te"></textarea>

        <label>Interessi</label>
        <div class="interests" id="interests">
          ${["Caffè","Drink","Trekking","Musica","Cinema","Sport","Viaggi","Metal detecting","Cucina","Natura"].map(x=>`<button class="interest" data-interest="${x}">${x}</button>`).join("")}
        </div>

        <button class="primary" id="saveProfile" style="margin-top:18px">Salva profilo</button>
        <div id="profileStatus" class="status"></div>
      </div>
    </section>
  `;

  const p = state.profile;
  document.getElementById("name").value = p.name || "";
  document.getElementById("age").value = p.age || "";
  document.getElementById("bio").value = p.bio || "";
  if(p.photo) document.getElementById("photoPreview").innerHTML = `<img src="${p.photo}">`;

  document.querySelectorAll(".interest").forEach(btn=>{
    btn.classList.toggle("selected", state.selectedInterests.includes(btn.dataset.interest));
    btn.onclick = ()=>{
      const v = btn.dataset.interest;
      if(state.selectedInterests.includes(v)){
        state.selectedInterests = state.selectedInterests.filter(x=>x!==v);
      }else{
        state.selectedInterests.push(v);
      }
      localStorage.setItem("mr_interests", JSON.stringify(state.selectedInterests));
      btn.classList.toggle("selected");
    };
  });

  document.getElementById("photoInput").onchange = e=>{
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ()=>{
      state.profile.photo = reader.result;
      document.getElementById("photoPreview").innerHTML = `<img src="${reader.result}">`;
    };
    reader.readAsDataURL(file);
  };

  document.getElementById("saveProfile").onclick = ()=>{
    state.profile = {
      ...state.profile,
      name: document.getElementById("name").value.trim(),
      age: document.getElementById("age").value.trim(),
      bio: document.getElementById("bio").value.trim(),
      interests: state.selectedInterests
    };
    localStorage.setItem("mr_profile", JSON.stringify(state.profile));
    document.getElementById("profileStatus").textContent = "Profilo salvato.";
  };
}

function renderTris(){
  content.innerHTML = `
    <section class="page">
      <div class="card">
        <h2>Gioco del tris</h2>
        <p>Chi perde deve presentarsi.</p>
        <div class="board" id="board"></div>
        <button class="secondary" id="reset">Ricomincia</button>
        <div id="gameStatus" class="status"></div>
      </div>
    </section>
  `;

  const board = document.getElementById("board");
  const status = document.getElementById("gameStatus");
  const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

  function check(){
    for(const [a,b,c] of wins){
      if(state.game[a] && state.game[a] === state.game[b] && state.game[a] === state.game[c]){
        return state.game[a];
      }
    }
    return state.game.every(Boolean) ? "Pareggio" : "";
  }

  function draw(){
    board.innerHTML = "";
    state.game.forEach((v,i)=>{
      const cell = document.createElement("button");
      cell.className = "cell";
      cell.textContent = v;
      cell.onclick = ()=>{
        if(state.game[i] || check()) return;
        state.game[i] = state.turn;
        state.turn = state.turn === "X" ? "O" : "X";
        draw();
      };
      board.appendChild(cell);
    });
    const result = check();
    status.textContent = result ? `Risultato: ${result}` : `Turno: ${state.turn}`;
  }

  document.getElementById("reset").onclick = ()=>{
    state.game = Array(9).fill("");
    state.turn = "X";
    draw();
  };

  draw();
}

document.querySelectorAll(".nav-btn").forEach(btn=>{
  btn.onclick = ()=>render(btn.dataset.page);
});

render("home");
