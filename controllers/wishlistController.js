const User = require("../models/user");

const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");

    res.json({
      success: true,
      wishlist: user.wishlist,
    });
  } catch (err) {
    next(err);
  }
};

const toggleWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    const { productId } = req.params;

    const exists = user.wishlist.some(
      (id) => id.toString() === productId,
    );

    if (exists) {
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== productId,
      );
    } else {
      user.wishlist.push(productId);
    }

    await user.save();

    res.json({
      success: true,
      wishlist: user.wishlist,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getWishlist,
  toggleWishlist,
};