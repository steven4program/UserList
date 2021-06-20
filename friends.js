const BASIC_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASIC_URL + "/api/v1/users/";
const friendList = JSON.parse(localStorage.getItem("friends")) || [];
const dataPanel = document.querySelector("#data-panel");
const wholeModal = document.querySelector("#whole-modal");

function renderUserList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `
      <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 my-4">
        <div class="card">
          <img src="${item.avatar}" class="card-img-top" alt="user avatar">
          <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
            <p class="card-text">Age: ${item.age}</p>
          </div>
          <div class="card-footer">
            <button type="button" class="btn btn-primary btn-show-user" data-toggle="modal" data-target="#user-modal"
                    data-id="${item.id}">More</button>
            <button class="btn btn-danger btn-remove-friend" data-id="${item.id}">X</button>
          </div>
        </div>
      </div>
    `;
  });

  dataPanel.innerHTML = rawHTML;
}

renderUserList(friendList);

function renderModalInfo(id) {
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data;

    wholeModal.innerHTML = `
  <div class="modal-header justify-content-center">
    <h5 class="modal-title">${data.name} ${data.surname}</h5>
  </div>
  <div class="modal-body">
    <div class="row justify-content-center">
      <div class="col-sm-3 ml-5" id="modal-user-avatar">
        <img src="${data.avatar}" alt="User Avatar" class="img-fluid">
      </div>
      <div class=" col-sm-5 mt-2 mb-2">
        <ul>
          <li id="modal-email">${data.email}</li>
          <li id="modal-gender">${data.gender}</li>
          <li id="modal-age">${data.age}</li>
          <li id="modal-region">${data.region}</li>
          <li id="modal-birthday">${data.birthday}</li>
        </ul>
      </div>
    </div>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
  </div>
  `;
  });
}

function removeFromFriends(id) {
  const friendIndex = friendList.findIndex((user) => user.id === id);
  friendList.splice(friendIndex, 1);
  localStorage.setItem("friends", JSON.stringify(friendList));
  renderUserList(friendList);
}

dataPanel.addEventListener("click", function (event) {
  if (event.target.matches(".btn-show-user")) {
    renderModalInfo(event.target.dataset.id);
  } else if (event.target.matches(".btn-remove-friend")) {
    removeFromFriends(Number(event.target.dataset.id));
  }
});
