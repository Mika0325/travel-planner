"use strict";

const CACHE_NAME = "travel-planner-v1";

// キャッシュするファイル
const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./memo.html",
    "./planner.html",
    "./preview.html",

    "./css/reset.css",
    "./css/common.css",
    "./css/home.css",
    "./css/memo.css",
    "./css/planner.css",
    "./css/preview.css",

    "./js/common.js",
    "./js/memo.js",
    "./js/planner.js",
    "./js/preview.js",

    "./manifest.json"
];

/* ==========================================
   install
========================================== */

self.addEventListener("install", (event) => {

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(FILES_TO_CACHE);
            })
    );

    self.skipWaiting();

});

/* ==========================================
   activate
========================================== */

self.addEventListener("activate", (event) => {

    event.waitUntil(
        caches.keys().then((keys) => {

            return Promise.all(
                keys.map((key) => {

                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }

                })
            );

        })
    );

    self.clients.claim();

});

/* ==========================================
   fetch
========================================== */

self.addEventListener("fetch", (event) => {

    event.respondWith(
        caches.match(event.request)
            .then((cached) => {

                if (cached) {
                    return cached;
                }

                return fetch(event.request);
            })
    );

});