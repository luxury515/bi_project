const { PASS_SEC } = require("../config/authConfig");
const User = require("../models/User");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();

//수정
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(req.body.password, PASS_SEC).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({ code: 200, data: updatedUser, message: "수정성공!" });
  } catch (err) {
    res.status(500).json({ code: 500, data: [], message: err });
  }
});

//삭제
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ code: 200, data: [], message: "삭제성공!" });
  } catch (err) {
    res.status(500).json({ code: 500, data: [], message: err });
  }
});

//상세
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json({ code: 200, data: others, message: "" });
  } catch (err) {
    res.status(500).json({ code: 500, data: [], message: err });
  }
});

// 전체
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query ? await User.find().sort({ _id: -1 }).limit(5) : await User.find();
    res.status(200).json({ code: 200, data: users, message: "" });
  } catch (err) {
    res.status(500).json({ code: 500, data: [], message: err });
  }
});

//상태

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
