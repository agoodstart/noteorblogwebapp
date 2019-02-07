// Use queryselectorAll to create an array of all buttons...
let buttons = document.querySelectorAll(".AJAXRequest");

// ... so we can use an foreach loop to add eventlisteners
buttons.forEach(button => {
  button.addEventListener("click", getData);
});

// eventlistener get data;
async function getData(e) {
  console.log(e.target);
  const _id = e.target.name;
  const thisDiv = e.target.parentNode;
  const url = `/dashboard/note/${_id}`;
  const request = new Request(url, {
    method: "GET",
    headers: {
      "Content-type": "text/xml"
    },
    mode: "cors"
  });

  await fetch(request).then(res => DOMUpdate(res, thisDiv, url));
  e.target.textContent = "Close";
  e.target.removeEventListener("click", getData);
  e.target.addEventListener("click", closeForm);
}

const updateRequest = e => {
  e.preventDefault();

  const thisDiv = e.target.thisDiv;
  const url = e.target.url;
  const oldForm = e.target.form;

  //
  const noteTitle = thisDiv.querySelector("input");
  const noteBody = thisDiv.querySelector("textarea");
  const anchor = thisDiv.querySelector("a");

  const data = {
    noteTitle: noteTitle.value,
    noteBody: noteBody.value
  };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json;charset=UTF-8"
    },
    body: JSON.stringify(data)
  }).then(res => DOMUpdate(res, thisDiv, url, oldForm, noteTitle, anchor));
};

function DOMUpdate(res, thisDiv, url, oldForm, noteTitle, anchor) {
  return res
    .text()
    .then(res => new window.DOMParser().parseFromString(res, "text/xml"))
    .then(data => {
      const form = data.querySelector(".AJAXForm");

      if (oldForm) {
        oldForm.remove();
        anchor.textContent = noteTitle.value;
        thisDiv.className = noteTitle.value;
      }

      thisDiv.insertAdjacentHTML("beforeend", form.outerHTML);
      return form;
    })
    .then(form => {
      const updateButton = document.querySelector(".AJAXUpdate");
      updateButton.addEventListener("click", updateRequest);

      updateButton.thisDiv = thisDiv;
      updateButton.url = url;
      updateButton.form = form;
    });
}

function closeForm(e) {
  const thisForm = document.querySelector(".AJAXForm");
  thisForm.remove();
  e.target.removeEventListener("click", closeForm);
  e.target.textContent = "Open here";
  e.target.addEventListener("click", getData);
}
