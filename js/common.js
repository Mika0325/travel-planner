/**
 * ==========================================
 * Travel Planner
 * Common JavaScript
 * ==========================================
 */

"use strict";

/* ==========================================
   初期化
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    setActiveNavigation();

});

/* ==========================================
   ナビゲーション
========================================== */

function setActiveNavigation() {

    const currentPage = location.pathname.split("/").pop();

    const links = document.querySelectorAll("nav a");

    links.forEach(link => {

        const href = link.getAttribute("href");

        if (href === currentPage) {

            link.classList.add("active");

        }

    });

}

/* ==========================================
   Toast
========================================== */

function showToast(message, type = "success") {

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;

    toast.textContent = message;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {

        toast.classList.add("show");

    });

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 2500);

}

/* ==========================================
   LocalStorage
========================================== */

function saveData(key, data) {

    localStorage.setItem(key, JSON.stringify(data));

}

function loadData(key, defaultValue = []) {

    const data = localStorage.getItem(key);

    if (!data) {

        return defaultValue;

    }

    try {

        return JSON.parse(data);

    }

    catch (error) {

        console.error(error);

        return defaultValue;

    }

}

/* ==========================================
   日時
========================================== */

function formatDate(date) {

    return new Intl.DateTimeFormat("ja-JP", {

        year: "numeric",

        month: "2-digit",

        day: "2-digit"

    }).format(date);

}

/* ==========================================
   UUID
========================================== */

function createId() {

    return crypto.randomUUID();

}

/* ==========================================
   エスケープ
========================================== */

function escapeHtml(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}