// ===============================
// メモ管理
// ===============================

const STORAGE_KEY = "travelPlannerMemos";

let memos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const memoInput = document.getElementById("memoText");
const addButton = document.getElementById("addMemo");
const memoList = document.getElementById("memoList");

// 保存
function saveMemos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
}

// 表示
function displayMemos() {

    memoList.innerHTML = "";

    memos.forEach((memo, index) => {

        const card = document.createElement("div");
        card.className = "memo-card";

        card.innerHTML = `
            <div class="memo-left">
                <input
                    type="checkbox"
                    ${memo.checked ? "checked" : ""}
                    onchange="toggleMemo(${index})">

                <span class="${memo.checked ? "done" : ""}">
                    ${memo.text}
                </span>
            </div>

            <div class="memo-buttons">

                <button onclick="editMemo(${index})">
                    編集
                </button>

                <button class="delete-button"
                        onclick="deleteMemo(${index})">
                    削除
                </button>

            </div>
        `;

        memoList.appendChild(card);

    });

}

// 追加
function addMemo() {

    const text = memoInput.value.trim();

    if (text === "") {
        alert("メモを入力してください。");
        return;
    }

    memos.push({
        text: text,
        checked: false
    });

    memoInput.value = "";

    saveMemos();
    displayMemos();

}

// 削除
function deleteMemo(index) {

    if (!confirm("削除しますか？")) {
        return;
    }

    memos.splice(index, 1);

    saveMemos();
    displayMemos();

}

// 編集
function editMemo(index) {

    const result = prompt("編集", memos[index].text);

    if (result === null) return;

    const text = result.trim();

    if (text === "") return;

    memos[index].text = text;

    saveMemos();
    displayMemos();

}

// チェック
function toggleMemo(index) {

    memos[index].checked = !memos[index].checked;

    saveMemos();
    displayMemos();

}

// Enterキー
memoInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {

        addMemo();

    }

});

addButton.addEventListener("click", addMemo);

// 初回表示
displayMemos();