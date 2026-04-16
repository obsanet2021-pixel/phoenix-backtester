const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    supports_search: true,
    supports_group_request: false,
    supports_marks: false,
    supports_timescale_marks: false,
    supports_time: true,
    exchanges: [
      { value: "FX", name: "Forex", desc: "Forex Market" },
      { value: "INDEX", name: "Indices", desc: "Stock Indices" }
    ],
    symbols_types: [
      { name: "Forex", value: "forex" },
      { name: "Index", value: "index" }
    ]
  });
});

module.exports = router;
