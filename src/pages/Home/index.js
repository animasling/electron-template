const btn = document.getElementById('btn');
const btn2 = document.getElementById('btn2');
const btn3 = document.getElementById('btn3');
const input = document.getElementById('input');
const text = document.getElementById('text');

btn.onclick = () => {
  alert(api.electron);
}

btn2.onclick = () => {
  api.saveFile(input.value)
}

btn3.onclick = async () => {
  const fileContent = await api.readFile();
  text.innerHTML = fileContent;
}

window.onload = () => {
  api.getMessage((event, message) => {console.log(event, message)});
}
