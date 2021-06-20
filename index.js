const BASIC_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASIC_URL + "/api/v1/users/";
const users = [];
const dataPanel = document.querySelector("#data-panel");
const wholeModal = document.querySelector("#whole-modal");
const paginator = document.querySelector("#paginator");
const USERS_PER_PAGE = 24;
const filter = document.querySelector("#filter");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const submit = document.querySelector("#search-submit-button");
const suggestBox = document.querySelector("#auto-box");
let filteredUsers = [];

// render user list
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
            <button type="button" class="btn btn-secondary btn-show-user" data-toggle="modal" data-target="#user-modal"
                    data-id="${item.id}">More</button>
            <i class="btn red fas fa-heart btn-add-friend" data-id="${item.id}"></i>
          </div>
        </div>
      </div>
    `;
  });

  dataPanel.innerHTML = rawHTML;
}

//user filter
filter.addEventListener("click", function onFilterUse(event) {
  const target = event.target;
  if (target.matches("#male")) {
    filteredUsers = users.filter((user) => user.gender === "male");
  } else if (target.matches("#female")) {
    filteredUsers = users.filter((user) => user.gender === "female");
  } else if (target.matches("#clear")) {
    filteredUsers = users;
  }

  renderPaginator(filteredUsers.length);
  renderUserList(getUserByPage(1));
});

// search function
searchForm.addEventListener("submit", function onSearchSubmitted(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();
  let searchedUsers = [];

  searchedUsers = users.filter((user) =>
    user.name.toLowerCase().includes(keyword)
  );

  if (searchedUsers.length === 0) {
    return alert(`No corresponding results`);
  }
  renderUserList(searchedUsers);
});

// autocomplete function under construction .....

// function showSuggest(list) {
//   let rawData = "";
//   if (!list.length) {
//     inputValue = searchInput.value;
//     rawData = `<li>${inputValue}</li>`;
//   } else {
//     rawData = list.join("");
//   }
//   suggestBox.innerHTML = rawData;
// }

// function select(option) {
//   let name = option.textContent;
//   searchInput.value = name;
//   searchForm.classList.remove("active");
// }

// searchInput.addEventListener("keyup", function searchSuggest(event) {
//   let wordTyped = event.target.value.trim().toLowerCase();
//   let suggestList = [];
//   if (wordTyped) {
//     suggestList = users.filter((user) =>
//       user.name.toLowerCase().startsWith(wordTyped)
//     );
//     suggestList = suggestList.map((user) => {
//       return (data = `<li>${user.name}</li>`);
//     });

//     searchForm.classList.add("active");
//     showSuggest(suggestList);
//     let allList = suggestBox.querySelectorAll("li");
//     for (let i = 0; i < allList.length; i++) {
//       allList[i].setAttribute("onclick", "select(this)");
//     }
//   } else {
//     searchForm.classList.remove("active");
//   }
// });

// add to friends
function addToFriends(id) {
  const list = JSON.parse(localStorage.getItem("friends")) || [];
  const friend = users.find((user) => user.id === id);
  if (list.some((user) => user.id === id)) {
    return alert("This user has already been added");
  }
  list.push(friend);
  localStorage.setItem("friends", JSON.stringify(list));
}

// render paginator
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / USERS_PER_PAGE);
  let rawHTML = "";
  for (let page = 1; page < numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
  }
  paginator.innerHTML = rawHTML;
}

function getUserByPage(page) {
  const data =
    filteredUsers.length < 200 && filteredUsers.length !== 0
      ? filteredUsers
      : users;
  const startIndex = (page - 1) * USERS_PER_PAGE;
  return data.slice(startIndex, startIndex + USERS_PER_PAGE);
}

paginator.addEventListener("click", function onPaginatorClicked(event) {
  if (event.target.tagName !== "A") {
    return;
  } else {
    let page = event.target.dataset.page;
    renderUserList(getUserByPage(page));
  }
});

// render modal
function renderModalInfo(id) {
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data;
    const addFriend = document.querySelector(".btn-add-friend");

    wholeModal.innerHTML = `
  <div class="modal-header justify-content-center">
    <h5 class="modal-title">${data.name} ${data.surname}</h5>
  </div>
  <div class="modal-body">
    <div class="row justify-content-center">
      <div class="col-sm-3 ml-5" id="modal-user-avatar">
        <img src="${data.avatar}" alt="User Avatar" class="avatar img-fluid">
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

// get data
axios
  .get(INDEX_URL)
  .then(function (response) {
    users.push(...response.data.results);
    renderPaginator(users.length);
    renderUserList(getUserByPage(1));

    dataPanel.addEventListener("click", function (event) {
      const target = event.target;
      if (target.matches(".btn-show-user")) {
        renderModalInfo(target.dataset.id);
      } else if (target.matches(".btn-add-friend")) {
        addToFriends(Number(target.dataset.id));
      }
    });
  })
  .catch(function (error) {
    console.log(error);
  });
