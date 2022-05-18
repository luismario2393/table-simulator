const nameInput = document.querySelector("#name");
const lastNameInput = document.querySelector("#lastName");
const emailInput = document.querySelector("#email");
const dateInput = document.querySelector("#date");
const btnEdit = document.querySelector("#edit");
const btnDelete = document.querySelector("#delete");
const main = document.querySelector("#main");

const form = document.querySelector("#form");

const table = document.querySelector("#table");

let editing;

class Users {
  constructor() {
    this.users = [];
  }

  addUsers(user) {
    this.users = [...this.users, user];
    console.log(this.users);
  }

  deleteUsers(id) {
    this.users = this.users.filter((user) => user.id != id);
  }

  editUsers(userEdit) {
    this.users = this.users.map((user) =>
      user.id === userEdit.id ? userEdit : user
    );
  }
}

class UI {
  msgAlert(msg, type) {
    const alert = document.querySelector(".message");

    if (!alert) {
      const divMsg = document.createElement("div");
      divMsg.classList.add("message");

      if (type === "error") {
        divMsg.classList.add("error");
      } else {
        divMsg.classList.add("success");
      }

      divMsg.textContent = msg;

      main.appendChild(divMsg);

      setTimeout(() => {
        divMsg.remove();
      }, 3000);
    }
  }

  addTable({ users }) {
    let html = "";

    users.forEach((user) => {
      const { id, first_name, last_name, email, date } = user;

      html += `
         <tr>
           <td>${id.toString().slice(0, 2)}</td>
           <td>${first_name ?? ""}</td>
           <td>${last_name ?? ""}</td>
           <td>${email ?? ""}</td>
           <td>${date ?? ""}</td>
           <td class="container-button">
             <button  class="edit" id="edit" onclick="loadEdition(${id})">Editar</button>
             <button" class="delete" id="delete" onclick="deleteUsers(${id})">Eliminar</button>
           </td>
         </tr>
       `;
    });

    table.innerHTML = html;
  }
}

const ui = new UI();
const users = new Users();

const usersObj = {
  first_name: "",
  last_name: "",
  email: "",
  date: "",
};

const fetchApi = async () => {
  const data = await fetch("https://reqres.in/api/users?page=1")
    .then((res) => res.json())
    .then((res) => {
      res.data.map((user) => {
        usersObj.id = user.id;
        usersObj.first_name = user.first_name;
        usersObj.last_name = user.last_name;
        usersObj.email = user.email;

        users.addUsers({ ...usersObj });
        ui.addTable(users);
        resetObject();
      });
    });

  return data;
};

eventListeners();
function eventListeners() {
  addEventListener("DOMContentLoaded", fetchApi);
  nameInput.addEventListener("input", dataUser);
  lastNameInput.addEventListener("input", dataUser);
  emailInput.addEventListener("input", dataUser);
  dateInput.addEventListener("input", dataUser);

  form.addEventListener("submit", addUser);
}

function dataUser(e) {
  usersObj[e.target.name] = e.target.value;
}

function addUser(e) {
  e.preventDefault();

  const { first_name, last_name, email, date } = usersObj;

  if (
    first_name.trim() === "" ||
    last_name.trim() === "" ||
    email.trim() === "" ||
    date.trim === ""
  ) {
    ui.msgAlert("Todos los campos son obligatorios", "error");
    return;
  }

  if (editing) {
    users.editUsers({ ...usersObj });
    ui.msgAlert("Usuario editado correctamente", "success");
    ui.addTable(users);
    resetObject();
    editing = false;
  } else {
    usersObj.id = Date.now();

    users.addUsers({ ...usersObj });
    ui.msgAlert("Usuario Agregado correctamente", "success");
  }

  resetObject();

  form.reset();

  ui.addTable(users);
}

function resetObject() {
  (usersObj.first_name = ""),
    (usersObj.last_name = ""),
    (usersObj.email = ""),
    (usersObj.date = "");
}

function deleteUsers(id) {
  users.deleteUsers(id);
  ui.msgAlert("Usuario eliminado correctamente", "success");
  ui.addTable(users);
}

function loadEdition(id) {
  const userEdit = users.users.filter((user) => user.id === id);

  nameInput.value = userEdit[0].first_name;
  lastNameInput.value = userEdit[0].last_name;
  emailInput.value = userEdit[0].email;
  dateInput.value = userEdit[0].date;

  usersObj.id = userEdit[0].id;
  usersObj.first_name = userEdit[0].first_name;
  usersObj.last_name = userEdit[0].last_name;
  usersObj.email = userEdit[0].email;
  usersObj.date = userEdit[0].date;

  editing = true;
}
