// Sol & Água — interatividade do site

// Inicializa o recurso VLibras, quando a biblioteca estiver disponível.
if (window.VLibras) {
  new window.VLibras.Widget('https://vlibras.gov.br/app');
}

const $ = (id) => document.getElementById(id);
const sun = $('sunRange'), temp = $('tempRange'), air = $('airRange'), cover = $('coverCheck');
function updateSim(){
 const s = Number(sun.value), t = Number(temp.value), a = Number(air.value), c = cover.checked;
 $('sunVal').textContent = s + '%';
 $('tempVal').textContent = t + ' °C';
 $('airVal').textContent = a + ' °C';
 $('solarResult').textContent = s + '%';
 const gap = t-a;
 let loss = gap <= 0 ? 'Baixa' : gap < 5 ? 'Moderada' : 'Alta';
 if(c && gap > 0) loss = gap < 5 ? 'Baixa' : 'Moderada';
 $('lossResult').textContent = loss;
 const score = s*.65 - Math.max(0,gap)*4 + (c?12:0);
 $('balanceResult').textContent = score > 45 ? 'Favorável' : score > 15 ? 'Equilibrado' : 'Desfavorável';
 $('heatFill').style.height = Math.max(8,Math.min(90,s*.65 + (c?12:0))) + '%';
 $('poolThermo').textContent = t + ' °C';
 $('poolVisual').classList.toggle('covered',c);
 $('status').textContent = c ? 'Capa ligada: tendência de menor perda por evaporação.' : 'Capa desligada: a evaporação pode aumentar a perda de calor.';
 $('sensorTemp').textContent = t + ' °C';
 $('sensorLight').textContent = s + '%';
 $('tempGauge').style.width = Math.min(100,Math.max(0,(t-15)/25*100)) + '%';
 $('lightGauge').style.width = s + '%';
 $('ledTemp').classList.toggle('warn',t>32 || t<20);
 const decision = (t < 28 && s >= 45) ? 'Condição favorável para considerar aquecimento solar' : (t >= 28 ? 'Meta de temperatura atingida' : 'Observar condições; energia solar baixa');
 $('sensorDecision').textContent = 'Sistema: ' + decision;
 $('ledSystem').classList.toggle('warn',!(t < 28 && s >= 45));
}
[sun,temp,air,cover].forEach(el=>el.addEventListener('input',updateSim));
$('resetSim').addEventListener('click',()=>{sun.value=70;temp.value=26;air.value=22;cover.checked=false;updateSim();});
$('contrastBtn').addEventListener('click',()=>{const on=document.body.classList.toggle('high-contrast');$('contrastBtn').setAttribute('aria-pressed',String(on));$('contrastBtn').textContent=on?'◐ Contraste: ligado':'◐ Contraste';});
$('dyslexiaBtn').addEventListener('click',()=>{const on=document.body.classList.toggle('dyslexia');$('dyslexiaBtn').setAttribute('aria-pressed',String(on));$('dyslexiaBtn').textContent=on?'Aa Leitura: ligada':'Aa Leitura';});
updateSim();
