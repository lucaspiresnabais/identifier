const express = require('express');
const router = express.Router();
const path = require('path')

router.get('/pages/scanner', (req, res) => {
    res.sendFile(path.join(__dirname + '/../public/scanner.html'));
});

router.get('/pages/scanner.js', (req, res) => {
    res.sendFile(path.join(__dirname + '/../public/scanner.js'));
})

module.exports = router;
