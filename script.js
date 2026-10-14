// Energia Solar: Ciência e Sustentabilidade — interatividade do site

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


// Curiosidades rotativas para explorar o conteúdo de um jeito leve.
const facts = [
 'A energia do Sol chega à Terra por radiação eletromagnética, atravessando o espaço quase vazio.',
 'Uma capa térmica ajuda a diminuir a evaporação, uma das principais formas de perda de calor de uma piscina.',
 'Sensores de luminosidade transformam a luz recebida em sinais que podem ser interpretados por um circuito.',
 'Painéis fotovoltaicos convertem parte da energia luminosa em energia elétrica.',
 'A temperatura é medida em graus Celsius no dia a dia, mas fórmulas de radiação térmica usam a escala Kelvin.'
];
let factIndex = 0;
const factButton = $('newFact');
if (factButton) factButton.addEventListener('click', () => {
 factIndex = (factIndex + 1) % facts.length;
 $('factText').textContent = facts[factIndex];
});

// Quiz de três perguntas, com retorno imediato e pontuação.
const questions = [
 {q:'Como a energia do Sol chega até a Terra?', a:['Por ondas sonoras','Por radiação eletromagnética','Somente pelo vento'], correct:1, why:'Isso mesmo! A radiação eletromagnética consegue se propagar pelo espaço.'},
 {q:'Para que serve principalmente a capa térmica da piscina?', a:['Criar energia solar','Aumentar a evaporação','Reduzir perdas de calor e evaporação'], correct:2, why:'Correto! A capa ajuda a conservar o calor, principalmente reduzindo a evaporação.'},
 {q:'O que um painel fotovoltaico transforma?', a:['Luz em energia elétrica','Água em combustível','Calor em água'], correct:0, why:'Muito bem! Células fotovoltaicas convertem parte da energia luminosa em eletricidade.'}
];
let questionIndex = 0, score = 0, answered = false;
const quizQuestion = $('quizQuestion'), quizOptions = $('quizOptions'), nextQuestion = $('nextQuestion');
function renderQuestion(){
 if (!quizQuestion || !quizOptions) return;
 const item = questions[questionIndex]; answered = false;
 $('quizCount').innerHTML = '<strong>Pergunta ' + (questionIndex+1) + ' de ' + questions.length + '</strong>';
 quizQuestion.textContent = item.q; quizOptions.innerHTML = '';
 item.a.forEach((answer, index) => {
  const button = document.createElement('button'); button.type='button'; button.textContent=answer;
  button.addEventListener('click', () => {
   if (answered) return; answered = true;
   const correct = index === item.correct; if (correct) score++;
   [...quizOptions.querySelectorAll('button')].forEach((b,i)=>{b.disabled=true;if(i===item.correct)b.classList.add('correct');else if(i===index)b.classList.add('incorrect');});
   $('quizFeedback').textContent = (correct ? 'Acertou! 💖 ' : 'Quase! 🌷 ') + item.why;
   nextQuestion.disabled = false;
   nextQuestion.textContent = questionIndex === questions.length-1 ? 'Ver resultado ✨' : 'Próxima pergunta →';
  }); quizOptions.appendChild(button);
 });
 $('quizFeedback').textContent='Escolha uma resposta!'; nextQuestion.disabled=true; $('quizScore').textContent='';
}
if (nextQuestion) nextQuestion.addEventListener('click',()=>{
 if (!answered) return;
 if (questionIndex < questions.length-1) { questionIndex++; renderQuestion(); }
 else {
  quizQuestion.textContent = score === 3 ? 'Perfeito! Você arrasou! ☀️' : score === 2 ? 'Muito bem! Você aprendeu bastante! 💗' : 'Boa tentativa! Vale revisar os conceitos 🌸';
  quizOptions.innerHTML=''; $('quizCount').innerHTML='<strong>Quiz concluído</strong>';
  $('quizFeedback').textContent='Você acertou ' + score + ' de ' + questions.length + ' perguntas.';
  nextQuestion.textContent='Tentar novamente ↻'; nextQuestion.disabled=false;
  nextQuestion.onclick = () => {questionIndex=0;score=0;nextQuestion.onclick=null;renderQuestion();};
 }
});
renderQuestion();

// Indicador de leitura e botão de voltar ao topo.
function updateScrollUI(){
 const doc = document.documentElement;
 const max = doc.scrollHeight - doc.clientHeight;
 const percent = max > 0 ? (doc.scrollTop / max) * 100 : 0;
 const progress = $('readingProgress'); if (progress) progress.style.width = percent + '%';
 const topButton = $('backTop'); if (topButton) topButton.classList.toggle('visible', doc.scrollTop > 420);
}
window.addEventListener('scroll', updateScrollUI, {passive:true});
if ($('backTop')) $('backTop').addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
updateScrollUI();
