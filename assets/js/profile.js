let btn = document.getElementById('btn');
var notes_view = document.getElementById('notes_view');
btn.addEventListener('click', async () => {
    fetch('/users/show_all_notes')
  .then((response) => response.json())
  .then((notes) => {
    console.log(notes);
    for (var i=0; i<notes.length; i++) {
        var new_div = document.createElement('div');
        var new_note_id = document.createElement('p');
        new_note_id.innerHTML = notes[i]._id;
        new_div.appendChild(new_note_id);
        new_div.style.border = '1px solid black';
        new_note_id.addEventListener('click', (e) => {
            console.log(e.target);
            fetch(`/users/show_all_notes/${notes[i].file}`);
        });
        new_note_id.style.cursor = 'pointer';
        notes_view.appendChild(new_div);
    }
  })
  .catch((error) => console.log(error));
});