"use strict";

/* ==========================================
   Travel Planner
   Planner
========================================== */

const STORAGE_KEY = "travelPlannerPlans";

/* ==========================================
   要素取得
========================================== */

const startTimeInput = document.getElementById("startTime");
const endTimeInput = document.getElementById("endTime");
const destinationInput = document.getElementById("destination");
const memoInput = document.getElementById("planMemo");
const imageUrlInput = document.getElementById("imageUrl");
const mapUrlInput = document.getElementById("mapUrl");

const addButton = document.getElementById("addPlanButton");

const planListElement = document.getElementById("planList");
const planCountElement = document.getElementById("planCount");

/* ==========================================
   データ
========================================== */

let plans = loadData(STORAGE_KEY, []);

/* ==========================================
   初期表示
========================================== */

renderPlans();

addButton.addEventListener("click", addPlan);

/* ==========================================
   保存
========================================== */

function savePlans() {

    saveData(STORAGE_KEY, plans);

}

/* ==========================================
   予定追加
========================================== */

function addPlan() {

    const start = startTimeInput.value;

    const end = endTimeInput.value;

    const destination = destinationInput.value.trim();

    const memo = memoInput.value.trim();

    const image = imageUrlInput.value.trim();

    const map = mapUrlInput.value.trim();

    if (
        start === "" ||
        end === "" ||
        destination === ""
    ) {

        showToast("開始時間・終了時間・目的地は必須です", "warning");

        return;

    }

    plans.push({

        id: createId(),

        start,

        end,

        destination,

        memo,

        image,

        map

    });

    sortPlans();

    savePlans();

    renderPlans();

    clearForm();

    showToast("予定を追加しました");

}

/* ==========================================
   並び替え
========================================== */

function sortPlans() {

    plans.sort((a, b) => {

        return a.start.localeCompare(b.start);

    });

}

/* ==========================================
   フォーム初期化
========================================== */

function clearForm() {

    startTimeInput.value = "";

    endTimeInput.value = "";

    destinationInput.value = "";

    memoInput.value = "";

    imageUrlInput.value = "";

    mapUrlInput.value = "";

}

/* ==========================================
   描画
========================================== */

function renderPlans() {

    planListElement.innerHTML = "";

    planCountElement.textContent = plans.length;

    if (plans.length === 0) {

        planListElement.innerHTML = `
            <div class="empty-plan">

                <h2>予定がありません</h2>

                <p>上のフォームから追加してください。</p>

            </div>
        `;

        return;

    }

    plans.forEach(plan => {

        const card = document.createElement("div");

        card.className = "plan-card";

        card.innerHTML = `

            <div class="plan-left">

                <div class="plan-time">

                    ${plan.start} ～ ${plan.end}

                </div>

                <div class="plan-destination">

                    ${escapeHtml(plan.destination)}

                </div>

                <div class="plan-memo">

                    ${escapeHtml(plan.memo)}

                </div>

                <div class="plan-links">

                    ${plan.map
                ? `<a
                            class="plan-link"
                            href="${plan.map}"
                            target="_blank">
                            Googleマップ
                           </a>`
                : ""
            }

                    ${plan.image
                ? `<a
                            class="plan-link"
                            href="${plan.image}"
                            target="_blank">
                            画像を開く
                           </a>`
                : ""
            }

                </div>

                <div class="plan-actions">

                    <button
                        class="edit-btn">

                        編集

                    </button>

                    <button
                        class="delete-btn">

                        削除

                    </button>

                </div>

            </div>

            ${plan.image
                ? `
                <div class="plan-image">

                    <img
                        src="${plan.image}"
                        alt="目的地">

                </div>
                `
                : ""
            }

        `;

        /* 編集 */

        card.querySelector(".edit-btn")
            .addEventListener("click", () => {

                editPlan(plan.id);

            });

        /* 削除 */

        card.querySelector(".delete-btn")
            .addEventListener("click", () => {

                deletePlan(plan.id);

            });

        planListElement.appendChild(card);

    });

}

/* ==========================================
   編集
========================================== */

function editPlan(id) {

    const plan = plans.find(p => p.id === id);

    if (!plan) return;

    const destination = prompt("目的地", plan.destination);

    if (destination === null) return;

    if (destination.trim() === "") return;

    const memo = prompt("補足メモ", plan.memo);

    if (memo === null) return;

    plan.destination = destination.trim();

    plan.memo = memo.trim();

    savePlans();

    renderPlans();

    showToast("予定を更新しました");

}

/* ==========================================
   削除
========================================== */

function deletePlan(id) {

    if (!confirm("この予定を削除しますか？")) {

        return;

    }

    plans = plans.filter(plan => plan.id !== id);

    savePlans();

    renderPlans();

    showToast("削除しました");

}