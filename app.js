let balance = parseInt(localStorage.getItem('balance') || '500000');

function saveBalance() {
  localStorage.setItem('balance', balance.toString());
  document.getElementById('balance').innerText = balance.toLocaleString('en-US');
}

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + name).classList.add('active');
  if (name === 'online') loadRooms();
}

function showBalance() {
  alert('💰 موجودی: ' + balance.toLocaleString('en-US'));
}

async function playOffline(emoji) {
  let amountStr = prompt('مبلغ شرط:', '10000');
  if (!amountStr) return;
  let amount = parseInt(amountStr);
  if (isNaN(amount) || amount <= 0 || amount > balance) { alert('❌ مبلغ نامعتبر!'); return; }
  balance -= amount;
  saveBalance();
  showScreen('result');
  document.getElementById('result-dice').innerText = emoji;
  document.getElementById('result-text').innerText = 'در حال پرتاب...';
  await sleep(1500);
  let u = Math.floor(Math.random() * 6) + 1;
  let b = Math.floor(Math.random() * 6) + 1;
  document.getElementById('result-dice').innerText = emoji + ' ' + u + '  |  ' + emoji + ' ' + b;
  let text = '👤 شما: ' + u + '\n🤖 بات: ' + b + '\n\n';
  if (u > b) { let p = amount * 2; balance += p; text += '🏆 بردید!\n💰 ' + p.toLocaleString('en-US'); }
  else if (u < b) { text += '😢 باختی!\n💰 ' + amount.toLocaleString('en-US'); }
  else { balance += amount; text += '🤝 مساوی!\n💰 برگشت.'; }
  text += '\n💼 موجودی: ' + balance.toLocaleString('en-US');
  saveBalance();
  document.getElementById('result-text').innerText = text;
}

let currentRooms = [];

function createRoom() {
  let choice = prompt('بازی:\n1. 🎲\n2. 🎰\n3. 🎳\n4. ⚽\n5. 🎯');
  if (!choice) return;
  let games = { '1': '🎲', '2': '🎰', '3': '🎳', '4': '⚽', '5': '🎯' };
  if (!games[choice]) return;
  let amountStr = prompt('مبلغ:', '10000');
  let amount = parseInt(amountStr);
  if (isNaN(amount) || amount <= 0 || amount > balance) { alert('❌'); return; }
  currentRooms.push({ id: Date.now(), game: games[choice], amount: amount, creator: 'شما', players: 1 });
  renderRooms();
  alert('✅ ساخته شد!');
}

function loadRooms() {
  if (currentRooms.length === 0) {
    currentRooms = [
      { id: 1, game: '🎲', amount: 50000, creator: 'کاربر ۱', players: 1 },
      { id: 2, game: '🎰', amount: 100000, creator: 'کاربر ۲', players: 1 }
    ];
  }
  renderRooms();
}

function renderRooms() {
  let html = '';
  currentRooms.forEach(r => {
    html += '<div class="room-item"><div><div>' + r.game + ' ' + r.amount.toLocaleString('en-US') + '</div><small style="color:#888;">' + r.creator + '</small></div><button onclick="joinRoom(' + r.id + ')">🚪 جوین</button></div>';
  });
  document.getElementById('rooms-list').innerHTML = html;
}

function joinRoom(id) {
  let room = currentRooms.find(r => r.id === id);
  if (!room || room.amount > balance) { alert('❌'); return; }
  playOnline(room);
}

async function playOnline(room) {
  balance -= room.amount;
  saveBalance();
  showScreen('result');
  document.getElementById('result-dice').innerText = room.game;
  await sleep(2000);
  let u = Math.floor(Math.random() * 6) + 1;
  let o = Math.floor(Math.random() * 6) + 1;
  document.getElementById('result-dice').innerText = room.game + ' ' + u + '  |  ' + room.game + ' ' + o;
  let text = '👤 شما: ' + u + '\n👥 حریف: ' + o + '\n\n';
  let pot = room.amount * 2;
  if (u > o) { balance += pot; text += '🏆 بردید!\n💰 ' + pot.toLocaleString('en-US'); }
  else if (u < o) { text += '😢 باختی!'; }
  else { balance += room.amount; text += '🤝 مساوی!'; }
  text += '\n💼 موجودی: ' + balance.toLocaleString('en-US');
  saveBalance();
  document.getElementById('result-text').innerText = text;
  currentRooms = currentRooms.filter(r => r.id !== room.id);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
saveBalance();
