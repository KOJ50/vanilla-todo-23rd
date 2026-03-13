const currentDateText = document.querySelector("#currentDateText");
const home = document.querySelector(".title");
const menuButton = document.querySelector(".menuButton");
const menuList = document.querySelector(".menuList");
const closeMenu = document.querySelector(".closeMenu");
const prev7 = document.querySelector("#previousWeek");
const next7 = document.querySelector("#nextWeek");
const todoDate = document.querySelector("#calendar");
const prev1 = document.querySelector("#previousDate");
const next1 = document.querySelector("#nextDate");
const todoInput = document.querySelector(".input");
const enterButton = document.querySelector(".enter");
const todoList = document.querySelector("#todoList");
const total = document.querySelector("#total");
const darkModeButton = document.querySelector(".darkMode");

// 0) 메인화면 날짜 표시
function formatKoreanDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${Number(year)}년 ${Number(month)}월 ${Number(day)}일`;
}

function updateCurrentDateText() {
  currentDateText.textContent = formatKoreanDate(todoDate.value);
}

// 공통 날짜 포맷
function formatInputDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 1) 제목 누르면 오늘로 돌아가기
function homeButton() {
  todoDate.value = formatInputDate(new Date());
  updateCurrentDateText();
  renderTodoList();
}

// 2) 사이드바 열기/닫기
function openSidebar() {
  menuList.style.left = "0";
}

function closeSidebar() {
  menuList.style.left = "-100%";
}
// 공통 날짜 변경 포멧
function formatChangeDate(currentDate) {
  todoDate.value = formatInputDate(currentDate);
  updateCurrentDateText();
  renderTodoList();
}
// 2-1) 이전 주 / 다음 주
function minusWeek() {
  const currentDate = new Date(todoDate.value);
  currentDate.setDate(currentDate.getDate() - 7);
  formatChangeDate(currentDate);
}

function plusWeek() {
  const currentDate = new Date(todoDate.value);
  currentDate.setDate(currentDate.getDate() + 7);
  formatChangeDate(currentDate);
}

// 3) 이전 날짜 / 다음 날짜
function minusDay() {
  const currentDate = new Date(todoDate.value);
  currentDate.setDate(currentDate.getDate() - 1);
  formatChangeDate(currentDate);
}

function plusDay() {
  const currentDate = new Date(todoDate.value);
  currentDate.setDate(currentDate.getDate() + 1);
  formatChangeDate(currentDate);
}

// 4) 날짜별 todo 저장/불러오기
function getDateKey() {
  return todoDate.value;
}

function getTodoListByDate() {
  const dateKey = getDateKey();
  return JSON.parse(localStorage.getItem(dateKey)) || [];
}

function saveTodoListByDate(todoArray) {
  const dateKey = getDateKey();
  localStorage.setItem(dateKey, JSON.stringify(todoArray));
}

// 4-1) 남은 todo 개수 표시
function updateTotal() {
  const todoArray = getTodoListByDate();
  const remainingCount = todoArray.filter(function (todo) {
    return !todo.completed;
  }).length;

  total.textContent = `남은 할 일 ${remainingCount}개`;
}

// 4) todo 목록 화면에 그리기
function renderTodoList() {
  const todoArray = getTodoListByDate();
  todoList.innerHTML = "";

  todoArray.forEach(function (todo, index) {
    const listItem = document.createElement("li");
    const checkbox = document.createElement("input");
    const todoText = document.createElement("span");
    const deleteButton = document.createElement("button");

    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    todoText.textContent = todo.text;
    deleteButton.textContent = "X";

    if (todo.completed) {
      todoText.style.textDecoration = "line-through";
    } else {
      todoText.style.textDecoration = "none";
    }

    checkbox.addEventListener("change", function () {
      const currentTodoArray = getTodoListByDate();
      currentTodoArray[index].completed = checkbox.checked;
      saveTodoListByDate(currentTodoArray);
      renderTodoList();
    });

    deleteButton.addEventListener("click", function () {
      const currentTodoArray = getTodoListByDate();
      currentTodoArray.splice(index, 1);
      saveTodoListByDate(currentTodoArray);
      renderTodoList();
    });

    listItem.appendChild(checkbox);
    listItem.appendChild(todoText);
    listItem.appendChild(deleteButton);
    todoList.appendChild(listItem);
  });

  updateTotal();
}

// 4) todo 추가
function addTodo() {
  const inputValue = todoInput.value.trim();

  if (inputValue === "") {
    return;
  }

  const todoArray = getTodoListByDate();

  const newTodo = {
    text: inputValue,
    completed: false,
  };

  todoArray.push(newTodo);
  saveTodoListByDate(todoArray);
  todoInput.value = "";
  renderTodoList();
}

//이벤트 연결
home.addEventListener("click", homeButton);
menuButton.addEventListener("click", openSidebar);
closeMenu.addEventListener("click", closeSidebar);
prev7.addEventListener("click", minusWeek);
next7.addEventListener("click", plusWeek);
prev1.addEventListener("click", minusDay);
next1.addEventListener("click", plusDay);
enterButton.addEventListener("click", addTodo);

todoInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTodo();
  }
});

todoDate.addEventListener("change", function () {
  updateCurrentDateText();
  renderTodoList();
});

todoDate.value = new Date().toISOString().split("T")[0];
updateCurrentDateText();
renderTodoList();

// 다크모드 구현
function toggleDarkMode() {
  document.body.classList.toggle("darkTheme");

  if (document.body.classList.contains("darkTheme")) {
    darkModeButton.textContent = "☀️";
  } else {
    darkModeButton.textContent = "🌙";
  }
}

darkModeButton.addEventListener("click", toggleDarkMode);
