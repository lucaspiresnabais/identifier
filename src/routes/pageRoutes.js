const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/pages/scanner", (req, res) => {
  res.sendFile(path.join(__dirname + "/../public/scanner.html"));
});
router.get("/pages/styles.css", (req, res) => {
  res.sendFile(path.join(__dirname + "/../public/js/styles.css"));
});

router.get("/pages/scanner.js", (req, res) => {
  res.sendFile(path.join(__dirname + "/../public/js/scanner.js"));
});

router.get("/pages/scanner2", (req, res) => {
  res.sendFile(path.join(__dirname + "/../public/scanner2.html"));
});

router.get("/pages/scanner2.js", (req, res) => {
  res.sendFile(path.join(__dirname + "/../public/js/scanner2.js"));
});

router.get("/pages/qr-scanner.min.js", (req, res) => {
  res.sendFile(path.join(__dirname + "/../public/js/qr-scanner.min.js"));
});
router.get("/pages/qr-scanner-worker.min.js", (req, res) => {
  res.sendFile(path.join(__dirname + "/../public/js/qr-scanner-worker.min.js"));
});
router.get("/pages/qr-scanner-worker.min.js.map", (req, res) => {
  res.sendFile(
    path.join(__dirname + "/../public/js/qr-scanner-worker.min.js.map")
  );
});
router.get("/pages/qr-scanner.min.js.map", (req, res) => {
  res.sendFile(path.join(__dirname + "/../public/js/qr-scanner.min.js.map"));
});

module.exports = router;
