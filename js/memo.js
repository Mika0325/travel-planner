"use strict";

const STORAGE_KEY = "travelPlannerMemo";

let memoList = loadData(STORAGE_KEY, []);

const memoContainer = document.getElementById("memoList");
const memoInput = document.getElementById("memoInput");
const categoryInput = document.getElementById("memoCategory");
const addButton = document.getElementById("addButton");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("category");
const memoCount = document.getElementById("memoCount");

/* -----------------------------
   初期表示
----------------------------- */

render();

addButton.addEventListener("click", addMemo);

memoInput.addEventListener("keydown", e => {

    if (e.key === "Enter") {

        addMemo();

    }

});

searchInput.addEventListener("input", render);

categoryFilter.addEventListener("change", render);

/* -----------------------------
   追加
----------------------------- */

function addMemo() {

    const text = memoInput.value.trim();

    if (text === "") {

        showToast("メモを入力してください", "warning");
        return;

    }

    memoList.unshift({

        id: createId(),

        text: text,

        category: categoryInput.value,

        completed: false,

        created: new Date().toISOString()

    });

    save();

    memoInput.value = "";

    memoInput.focus();

}

/* -----------------------------
   保存
----------------------------- */

function save() {

    saveData(STORAGE_KEY, memoList);

    render();

    showToast("保存しました");

}

/* -----------------------------
   描画
----------------------------- */

function render() {

    memoContainer.innerHTML = "";

    let list = [...memoList];

    const keyword = searchInput.value.toLowerCase();

    if (keyword) {

        list = list.filter(m => m.text.toLowerCase().includes(keyword));

    }

    if (categoryFilter.value !== "all") {

        list = list.filter(m => m.category === categoryFilter.value);

    }

    memoCount.textContent = list.length;

    if (list.length === 0) {

        memoContainer.innerHTML = `
            <div class="empty">
                <h2>メモがありません</h2>
                <p>上から追加してください。</p>
            </div>
        `;

        return;

    }

    list.forEach(createMemoCard);

}

/* -----------------------------
   カード生成
----------------------------- */

function createMemoCard(memo) {

    const card = document.createElement("div");

    card.className = "memo-card";

    card.innerHTML = `

        <div class="memo-left">

            <input
                type="checkbox"
                ${memo.completed ? "checked" : ""}>

            <div>

                <div class="memo-text ${memo.completed ? "completed" : ""}">
                    ${escapeHtml(memo.text)}
                </div>

                <small>${memo.category}</small>

            </div>

        </div>

        <div class="memo-actions">

            <button class="icon-btn edit-btn">
                ✏️
            </button>

            <button class="icon-btn delete-btn">
                🗑️
            </button>

        </div>

    `;

    const checkbox = card.querySelector("input");

    checkbox.addEventListener("change", () => {

        memo.completed = !memo.completed;

        save();

    });

    card.querySelector(".delete-btn")
        .addEventListener("click", () => {

            if (confirm("削除しますか？")) {

                memoList = memoList.filter(m => m.id !== memo.id);

                save();

            }

        });

    card.querySelector(".edit-btn")
        .addEventListener("click", () => {

            const text = prompt("編集", memo.text);

            if (text === null) return;

            if (text.trim() === "") return;

            memo.text = text.trim();

            save();

        });

    memoContainer.appendChild(card);

}