/*
  I wanted to make an ajax request to the corresponding note so it can show up on the dashboard without reloading the page,
  but I didn't know how to do it. I also didn't want to use jQuery but rather vanilla js, so I decided to do some research.
  This is the result:

  Sources:
  1. https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX/Getting_Started#Step_3_%E2%80%93_A_Simple_Example 
     Literally copy/pasted the code.

  2. https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/overrideMimeType
     This was needed to set the right mime type(will be set to document otherwise)

  3. https://stackoverflow.com/questions/9136117/how-to-extract-data-from-ajaxs-responsetext
     Used this to extract the form from the entire HTML

  4. https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
     Finally, Inserted the form in the page
*/

// Setup
let httpRequest;
let buttons = document.querySelectorAll(".AJAXRequest");

buttons.forEach(button => {
  button.addEventListener("click", makeRequest);
});

// 1.
function makeRequest(e) {
  let thisDiv = e.target.parentNode;

  httpRequest = new XMLHttpRequest();
  httpRequest.overrideMimeType("text/xml");

  if (!httpRequest) {
    alert("Giving up :( Cannot create an XMLHTTP instance");
    return false;
  }

  httpRequest.open("GET", e.target.attributes.formaction.value);
  httpRequest.send();

  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        const thisForm = httpRequest.responseXML.querySelector(".AJAXForm");
        thisDiv.insertAdjacentHTML("beforeend", thisForm.outerHTML);
        callMe(thisDiv);
      } else {
        alert("There was a problem with the request.");
      }
    }
  };
}

function callMe(thisDiv) {
  let httpUpdate;
  let updateButton = document.querySelector(".AJAXUpdate");
  updateButton.addEventListener("click", makeRequest);

  function makeRequest(e) {
    e.preventDefault();
    const noteTitle = thisDiv.children["3"][0];
    const noteBody = thisDiv.children["3"][1];
    const _id = noteTitle.id;

    const data = {
      noteTitle: noteTitle.value,
      noteBody: noteBody.value
    };

    httpUpdate = new XMLHttpRequest();
    httpUpdate.open("POST", `/dashboard/updatenote/${_id}`, true);
    httpUpdate.setRequestHeader(
      "Content-Type",
      "application/json;charset=UTF-8"
    );
    httpUpdate.send(JSON.stringify(data));

    httpUpdate.onreadystatechange = function() {
      if (httpUpdate.readyState === XMLHttpRequest.DONE) {
        if (httpUpdate.status === 200) {
          const oldForm = thisDiv.children[3];
          const anchor = thisDiv.children[0];
          const newForm = httpUpdate.responseXML.querySelector(".AJAXForm");

          oldForm.remove();
          thisDiv.insertAdjacentHTML("beforeend", newForm.outerHTML);
          anchor.textContent = noteTitle.value;
          thisDiv.className = noteTitle.value;

          callMe(thisDiv);
        } else {
          alert("There was a problem with the request.");
        }
      }
    };
  }
}
