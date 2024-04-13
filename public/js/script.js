let addmaterialsBtn = document.getElementById('addmaterialsBtn');
let materialList = document.querySelector('.materialList');
let materialDiv = document.querySelectorAll('.materialDiv')[0];

addmaterialsBtn.addEventListener('click', function(){
  let newMaterials = materialDiv.cloneNode(true);
  let input = newMaterials.getElementsByTagName('input')[0];
  input.value = '';
  materialList.appendChild(newMaterials);
});