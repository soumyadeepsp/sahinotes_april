let btn = document.getElementById('btn');
var notes_view = document.getElementById('notes_view');

function removeChildElements(htmlElement) {
  while (htmlElement.firstChild) {
    htmlElement.removeChild(htmlElement.firstChild);
  }
}

btn.addEventListener('click', () => {
    fetch('/users/show_all_notes')
  .then((response) => response.json())
  .then((notes) => {
    removeChildElements(notes_view);
    for (var i=0; i<notes.length; i++) {
        var new_div = document.createElement('div');
        var new_note_id = document.createElement('p');
        console.log(notes[i].name);
        new_note_id.innerHTML = notes[i].name;
        new_div.appendChild(new_note_id);
        new_div.style.border = '1px solid black';
        var filename = notes[i].file;
        new_note_id.addEventListener('click', (e) => {
            console.log(e.target);
            window.location = `/users/show_single_notes/${filename}`;
        });
        new_note_id.style.cursor = 'pointer';
        notes_view.appendChild(new_div);
    }
  })
  .catch((error) => console.log(error));
});