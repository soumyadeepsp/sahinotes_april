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
        new_note_id.addEventListener('click', (e) => {
            console.log(e.target);
            var filename = e.target.innerHTML;
            window.location = `/users/show_single_notes/${filename}`;
        });
        var delete_button = document.createElement('button');
        delete_button.innerHTML = 'delete';
        delete_button.setAttribute('id', notes[i].file);
        new_div.appendChild(delete_button);
        delete_button.addEventListener('click', (e) => {
            var name = e.target.getAttribute('id');
            fetch(`/users/delete_note/${name}`, { method: 'DELETE' })
            .then(() => console.log('Delete successful'));
        })
        new_note_id.style.cursor = 'pointer';
        notes_view.appendChild(new_div);
    }
  })
  .catch((error) => console.log(error));
});