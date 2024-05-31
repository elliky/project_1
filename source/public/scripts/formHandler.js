
const form = document.getElementById("form");
const title = document.getElementById("title");
const description = document.getElementById("description");
const importance = document.getElementById("importance");
const duedate = document.getElementById("duedate");

form.addEventListener("submit", (event) => {
    event.preventDefault();
  
    const message = `
      Title: ${title.value}
      Description: ${description.value}
      Importance: ${importance.value}
      Duedate: ${duedate.value}
    `;
  
    alert(message);
  });
  