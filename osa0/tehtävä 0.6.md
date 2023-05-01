sequenceDiagram
    participant xhttp
    participant XMLHttpRequest
    participant ul
    participant li
    participant notesElement
    participant notes
    participant note
    participant form
    participant e
    participant console

    xhttp ->> XMLHttpRequest: create new XMLHttpRequest
    XMLHttpRequest ->> xhttp: XMLHttpRequest instance
    xhttp ->> XMLHttpRequest: set onreadystatechange function
    XMLHttpRequest ->> xhttp: readyState = 4 and status = 200
    xhttp ->> notes: update notes array with JSON data
    xhttp ->> redrawNotes: redraw notes on the page
    redrawNotes ->> ul: create ul element
    ul ->> li: create li element
    li ->> ul: append li to ul
    li ->> li: add note content as text node to li
    redrawNotes ->> notesElement: get notes element
    notesElement ->> notesElement: remove any existing child nodes
    notesElement ->> notesElement: append ul to notes element
    form ->> e: get form element
    e ->> note: create new note object with form data
    note ->> notes: add new note to notes array
    form ->> e: reset form input field
    redrawNotes ->> ul: create ul element
    ul ->> li: create li element
    li ->> ul: append li to ul
    li ->> li: add note content as text node to li
    redrawNotes ->> notesElement: get notes element
    notesElement ->> notesElement: remove any existing child nodes
    notesElement ->> notesElement: append ul to notes element
    note ->> sendToServer: send note data to server
    sendToServer ->> xhttpForPost: create new XMLHttpRequest
    xhttpForPost ->> sendToServer: XMLHttpRequest instance
    sendToServer ->> xhttpForPost: set onreadystatechange function
    xhttpForPost ->> sendToServer: readyState = 4 and status = 201
    console ->> sendToServer: log response text
