var like_button = document.getElementById('like_button');
var note_name = document.getElementById('note_name').innerHTML;
fetch(`/users/get_number_of_likes/${note_name}`)
.then((response) => response.json())
.then((n) => {
    var likes = document.getElementById('likes');
    likes.innerHTML = n;
    console.log("n === ",n);
})
like_button.addEventListener('click', () => {
    fetch(`/users/like_notes/${note_name}`, {method: 'PUT'})
    .then((response) => response.json())
    .then(() => {
        console.log('like done successfully');
        var likes = document.getElementById('likes');
        likes.innerHTML = parseInt(likes.innerHTML) + 1;
    })
    .catch((error) => console.log(error));
});

var add_comment_to_note = document.getElementById("add_comment_to_note");
var add_comment_to_note_btn = document.getElementById("add_comment_to_note_btn");
var comments_section = document.getElementById("comments_section");

add_comment_to_note_btn.addEventListener("click", function() {
    if (add_comment_to_note.value!="") {
        var data = {
            "file": note_name,
            "text": add_comment_to_note.value,
            "type": "Notes",
            "comment": null
        }
        fetch(`/users/new_note_comment`, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        add_comment_to_note.value = "";
    }
});

function fetchAllComments() {
    fetch(`/users/get_all_comments/${note_name}`)
    .then((response) => response.json())
    .then((comments_response) => {
        console.log(comments_response);
        var keys = Object.keys(comments_response);
        for (var i of keys) {
            var comment_div = document.createElement("div");
            var parent_comment_p = document.createElement("p");
            parent_comment_p.innerHTML = comments_response[i]["text"];
            var input = document.createElement("input");
            var submit = document.createElement("input");
            input.type = "text";
            submit.type = "submit";
            submit.value = "add comment";
            comment_div.appendChild(parent_comment_p);
            comment_div.appendChild(input);
            comment_div.appendChild(submit);
        }
    });
}
fetchAllComments();