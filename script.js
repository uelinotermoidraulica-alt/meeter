const screen = document.getElementById("screen");

const state = {
  page: "home",
  interests: JSON.parse(localStorage.getItem("meet_interests") || "[]"),
  profile: JSON.parse(localStorage.getItem("meet_profile") || "{}"),
  premiumTris: localStorage.getItem("premium_tris") === "true"
};

function statusbar(){
  return `<div class="statusbar"><span>9:41</span><span>⌁ ◔ ▰</span></div>`;
}

function setPage(page){
  state.page = page;
  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.page === page);
  });

  if(page === "home") return renderHome();
  if(page === "sticker") return renderSticker();
  if(page === "chat") return renderChat();
  if(page === "profilo") return renderProfilo();
  if(page === "shop") return renderShop();
}

document.querySelectorAll(".nav-item").forEach(btn => {
  btn.addEventListener("click", () => setPage(btn.dataset.page));
});

function renderHome(){
  screen.innerHTML = `
    ${statusbar()}
    <section class="page hero">
      <img class="hero-icon" src="nav-home.jpg" alt="">
      <h1>Meet & React</h1>
      <p>Solo persone reali entro 300 metri</p>

      <div class="card center">
        <h2>Accedi per iniziare</h2>
        <p>Scopri chi è davvero vicino a te.</p>

        <div class="input-wrap"><span>👤</span><input id="email" type="email" placeholder="Email"></div>
        <div class="input-wrap"><span>🔒</span><input id="password" type="password" placeholder="Password"></div>

        <button class="primary" id="loginBtn">Accedi</button>
        <p class="small-note">Non hai un account? <button class="link-btn" id="registerBtn">Registrati</button></p>
        <button class="secondary" id="gpsBtn" style="margin-top:12px">Aggiorna posizione GPS</button>
        <div class="status" id="homeStatus"></div>
      </div>
    </section>
  `;

  document.getElementById("loginBtn").onclick = () => {
    const email = document.getElementById("email").value.trim();
    document.getElementById("homeStatus").textContent = email ? "Login demo attivo. Per login reale collega Firebase." : "Inserisci una email.";
    if(email) localStorage.setItem("meet_user", email);
  };

  document.getElementById("registerBtn").onclick = () => {
    document.getElementById("homeStatus").textContent = "Registrazione demo pronta. Per account reali serve Firebase Auth.";
  };

  document.getElementById("gpsBtn").onclick = () => {
    const out = document.getElementById("homeStatus");
    if(!navigator.geolocation){
      out.textContent = "GPS non disponibile.";
      return;
    }
    out.textContent = "Richiesta posizione...";
    navigator.geolocation.getCurrentPosition(pos => {
      localStorage.setItem("meet_location", JSON.stringify({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        time: Date.now()
      }));
      out.textContent = "GPS aggiornato. Visibilità entro 300 metri attiva.";
    }, () => {
      out.textContent = "Permesso GPS negato o non disponibile.";
    }, {enableHighAccuracy:true, timeout:10000});
  };
}

function renderSticker(){
  const stickers = [
    ["☕","Caffè insieme?"],
    ["🍸","Drink?"],
    ["🔥","Sei tanta roba"],
    ["🍑","Che culo!"],
    ["📍","Sono qui"],
    ["🕐","Due minuti?"],
    ["👣","Due passi?"],
    ["🛍️","Shopping?"],
    ["🍕","Pizza?"],
    ["❤️","Mi piaci"],
    ["👍","Top!"],
    ["🎁","Per te"]
  ];

  screen.innerHTML = `
    ${statusbar()}
    <section class="page">
      <h1 class="page-title">Sticker</h1>
      <p class="subtitle">Invia sticker divertenti nelle chat 😄</p>

      <div class="tabs">
        <button class="tab active">Tutti</button>
        <button class="tab">Cibo</button>
        <button class="tab">Bevande</button>
        <button class="tab">Oggetti</button>
        <button class="tab">Altro</button>
      </div>

      <div class="sticker-grid">
        ${stickers.map(([emoji,label]) => `
          <button class="sticker-card"><span class="emoji">${emoji}</span><span>${label}</span></button>
        `).join("")}
      </div>
    </section>
  `;
}

function renderChat(){
  screen.innerHTML = `
    ${statusbar()}
    <section class="page">
      <h1 class="page-title">Chat</h1>
      <p class="subtitle">Le tue conversazioni</p>
      <div class="card empty-card">
        <img class="empty-icon" src="nav-sticker.jpg" alt="">
        <h2>Nessuna conversazione attiva</h2>
        <p>Inizia a chattare dopo uno scambio reale o una sfida a tris.</p>
      </div>
    </section>
  `;
}

function renderProfilo(){
  const interests = ["⚽ Sport","🎵 Musica","✈️ Viaggi","🎬 Cinema","🍔 Cibo","📖 Lettura","📷 Fotografia","🎨 Arte","💻 Tecnologia","🐾 Animali","🌿 Natura","🏋️ Fitness"];

  screen.innerHTML = `
    ${statusbar()}
    <section class="page">
      <h1 class="page-title">Profilo</h1>
      <p class="subtitle">Completa il tuo profilo per farti scoprire</p>

      <div class="profile-avatar" id="avatarBox">
        ${state.profile.photo ? `<img src="${state.profile.photo}" alt="">` : `<img class="avatar-img" src="nav-profilo.jpg" alt="">`}
        <button class="camera" id="photoBtn">📷</button>
      </div>
      <input id="photoInput" type="file" accept="image/*" style="display:none">

      <div class="field">
        <label>Nome</label>
        <input id="name" placeholder="Il tuo nome" value="${state.profile.name || ""}">
      </div>

      <div class="form-row">
        <div class="field">
          <label>Età</label>
          <input id="age" type="number" min="18" placeholder="La tua età" value="${state.profile.age || ""}">
        </div>
        <div class="field">
          <label>Bio</label>
          <textarea id="bio" placeholder="Racconta qualcosa di te...">${state.profile.bio || ""}</textarea>
        </div>
      </div>

      <div class="interest-title">I tuoi interessi</div>
      <p class="subtitle">Seleziona almeno 3 interessi</p>
      <div class="interest-grid">
        ${interests.map(i => `<button class="interest ${state.interests.includes(i) ? "selected" : ""}" data-interest="${i}">${i}</button>`).join("")}
      </div>

      <button class="primary" id="saveProfile" style="margin-top:18px">Salva profilo</button>
      <div class="status" id="profileStatus"></div>
    </section>
  `;

  document.querySelectorAll(".interest").forEach(btn => {
    btn.onclick = () => {
      const val = btn.dataset.interest;
      if(state.interests.includes(val)){
        state.interests = state.interests.filter(x => x !== val);
      }else{
        state.interests.push(val);
      }
      localStorage.setItem("meet_interests", JSON.stringify(state.interests));
      btn.classList.toggle("selected");
    };
  });

  document.getElementById("photoBtn").onclick = () => document.getElementById("photoInput").click();

  document.getElementById("photoInput").onchange = e => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      state.profile.photo = reader.result;
      document.getElementById("avatarBox").innerHTML = `<img src="${reader.result}" alt=""><button class="camera" id="photoBtn">📷</button>`;
      document.getElementById("photoBtn").onclick = () => document.getElementById("photoInput").click();
    };
    reader.readAsDataURL(file);
  };

  document.getElementById("saveProfile").onclick = () => {
    state.profile = {
      ...state.profile,
      name: document.getElementById("name").value.trim(),
      age: document.getElementById("age").value.trim(),
      bio: document.getElementById("bio").value.trim(),
      interests: state.interests
    };
    localStorage.setItem("meet_profile", JSON.stringify(state.profile));
    document.getElementById("profileStatus").textContent = "Profilo salvato.";
  };
}

function renderShop(){
  screen.innerHTML = `
    ${statusbar()}
    <section class="page">
      <h1 class="page-title">Shop</h1>
      <p class="subtitle">Sblocca funzionalità premium</p>

      <div class="card shop-card">
        <img src="nav-shop.jpg" alt="">
        <div>
          <h2>Gioco del Tris 👑</h2>
          <p>Sfida gli altri utenti a partite di tris e vinci ricompense!</p>
          <ul class="checks">
            <li>✓ Sfide illimitate</li>
            <li>✓ Statistiche partite</li>
            <li>✓ Classifica globale</li>
            <li>✓ Nessuna pubblicità</li>
          </ul>
          <div class="price-row">
            <span class="price">2,99 €</span>
            <button class="primary" id="unlockTris" style="width:auto">Sblocca ora</button>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>Altre funzionalità in arrivo</h3>
        <div class="lock-list">
          <div class="lock-item"><span>🙂</span><div><strong>Sticker premium</strong><small>Nuovi sticker esclusivi</small></div><span class="lock">🔒</span></div>
          <div class="lock-item"><span>🏅</span><div><strong>Badge speciali</strong><small>Mostra i tuoi achievement</small></div><span class="lock">🔒</span></div>
          <div class="lock-item"><span>👁️</span><div><strong>Modalità invisibile</strong><small>Naviga senza essere visto</small></div><span class="lock">🔒</span></div>
        </div>
      </div>

      <div class="card center" id="trisPreview">
        <h2>Gioco del Tris</h2>
        <div class="tris-board">
          ${Array.from({length:9}).map((_,i)=>`<button class="cell">${["×","","○","○","","","○","","×"][i]}</button>`).join("")}
        </div>
        <div class="paid-lock">🔒</div>
        <h2>👑 Sblocca il gioco del Tris</h2>
        <p>Il tris è una funzionalità a pagamento nello Shop.</p>
      </div>
    </section>
  `;

  document.getElementById("unlockTris").onclick = () => {
    localStorage.setItem("premium_tris", "true");
    alert("Demo: opzione Tris sbloccata. Per pagamento reale serve Stripe/App Store.");
  };
}

setPage("home");
