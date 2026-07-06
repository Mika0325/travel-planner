"use strict";

/* ==========================================
   Travel Planner
   Preview
========================================== */

const MEMO_STORAGE_KEY = "travelPlannerMemo";
const PLAN_STORAGE_KEY = "travelPlannerPlans";

/* ==========================================
   要素取得
========================================== */

const schedulePreview = document.getElementById("schedulePreview");
const memoPreview = document.getElementById("memoPreview");

const printButton = document.getElementById("printButton");
const shareButton = document.getElementById("shareButton");

/* ==========================================
   データ取得
========================================== */

const memos = loadData(MEMO_STORAGE_KEY, []);
const plans = loadData(PLAN_STORAGE_KEY, []);

/* ==========================================
   初期表示
========================================== */

renderSchedule();
renderMemo();

/* ==========================================
   印刷
========================================== */

printButton.addEventListener("click", () => {

    window.print();

});

/* ==========================================
   共有
========================================== */

shareButton.addEventListener("click", sharePage);

async function sharePage() {

    const shareData = {

        title: "旅のしおり",

        text: "旅行の予定を共有します",

        url: location.href

    };

    if (navigator.share) {

        try {

            await navigator.share(shareData);

            showToast("共有しました");

        }

        catch (e) {

            // キャンセル時は何もしない

        }

    }

    else {

        try {

            await navigator.clipboard.writeText(location.href);

            showToast("URLをコピーしました");

        }

        catch {

            showToast("共有に対応していません", "warning");

        }

    }

}

/* ==========================================
   スケジュール表示
========================================== */

function renderSchedule() {

    schedulePreview.innerHTML = "";

    if (plans.length === 0) {

        schedulePreview.innerHTML = `
            <div class="empty-data">
                スケジュールはありません。
            </div>
        `;

        return;

    }

    plans
        .sort((a, b) => a.start.localeCompare(b.start))
        .forEach(plan => {

            const item = document.createElement("div");

            item.className = "schedule-item";

            item.innerHTML = `

                <div class="schedule-time">

                    ${plan.start} ～ ${plan.end}

                </div>

                <div class="schedule-destination">

                    ${escapeHtml(plan.destination)}

                </div>

                <div class="schedule-memo">

                    ${escapeHtml(plan.memo || "")}

                </div>

                <div class="schedule-links">

                    ${plan.map
                    ? `
                        <a
                            href="${plan.map}"
                            target="_blank"
                            class="schedule-link">

                            GoogleMap

                        </a>
                        `
                    : ""
                }

                    ${plan.image
                    ? `
                        <a
                            href="${plan.image}"
                            target="_blank"
                            class="schedule-link">

                            画像

                        </a>
                        `
                    : ""
                }

                </div>

            `;

            schedulePreview.appendChild(item);

        });

}

/* ==========================================
   メモ表示
========================================== */

function renderMemo() {

    memoPreview.innerHTML = "";

    if (memos.length === 0) {

        memoPreview.innerHTML = `
            <div class="empty-data">
                メモはありません。
            </div>
        `;

        return;

    }

    memos.forEach(memo => {

        const item = document.createElement("div");

        item.className = "memo-item";

        item.innerHTML = `

            <div class="memo-check">

                ${memo.completed ? "☑" : "☐"}

            </div>

            <div class="memo-content">

                <div>

                    ${escapeHtml(memo.text)}

                </div>

                <div class="memo-category">

                    ${escapeHtml(memo.category)}

                </div>

            </div>

        `;

        memoPreview.appendChild(item);

    });

}