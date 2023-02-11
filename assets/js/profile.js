let btn = document.getElementById('btn');
var notes_view = document.getElementById('notes_view');
var upload_form = document.getElementById('upload_form');
var url = window.location.href;
var profile_id = url.substring(url.indexOf('profile/')+8);

function removeChildElements(htmlElement) {
  while (htmlElement.firstChild) {
    htmlElement.removeChild(htmlElement.firstChild);
  }
}

window.addEventListener('load', () => {
    fetch(`/users/show_all_notes/${profile_id}`)
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

var users_view = document.getElementById('users_view');
console.log(users_view);
window.addEventListener('load', () => {
  fetch('/users/get_all_users')
.then((response) => response.json())
.then((users) => {
  removeChildElements(users_view);
  console.log(users);
  for (var i=0; i<users.length; i++) {
      var list_item = document.createElement('p');
      list_item.innerHTML = users[i].name;
      list_item.setAttribute('id', users[i].id);
      list_item.style.cursor = 'pointer';
      list_item.addEventListener('click', function(e) {
        var id = e.target.getAttribute('id');
        window.location.href = `/users/profile/${id}`;
      });
      console.log(users_view);
      users_view.appendChild(list_item);
  }
})
.catch((error) => console.log(error));
});

var logged_in_user_id = document.getElementById('logged_in_user_id');
console.log(logged_in_user_id);
logged_in_user_id.style.display = 'none';
logged_in_user_id = logged_in_user_id.innerHTML;
if (logged_in_user_id!=profile_id) {
  upload_form.style.display = 'none';
}