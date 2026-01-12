(function(){
var api_key='3fd2be6f0c70a2a598f084ddfb75487c';
function searchTMDB(query){
return fetch('https://api.themoviedb.org/3/search/multi?api_key='+api_key+'&language=ru-RU&query='+encodeURIComponent(query)+'&page=1')
.then(r=>r.json()).then(d=>d.results||[]);
}
function addButton(){
if(document.querySelector('.ai-search'))return;
var menu=document.querySelector('.menu,.menu-items,.categories,[class*="menu"]');
if(!menu)return;
var btn=document.createElement('div');
btn.className='ai-search selector';
btn.innerHTML='<div style="font-size:30px;padding:20px">🔍 AI Поиск</div>';
btn.onclick=function(){
var q=prompt('Фильмы про что?');
if(!q)return;
searchTMDB(q).then(function(results){
if(results.length){
Lampa.Noty.show(results.length+' найдено');
Controller.toContent({search:q});
}else{
Lampa.Noty.show('Не найдено');
}
});
};
menu.appendChild(btn);
Lampa.Noty.show('AI добавлен!');
}
setTimeout(addButton,3000);
setInterval(addButton,2000);
})();
