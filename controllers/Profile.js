const User = require("../modals/user");
const Profile = require("../modals/profile");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.updateProfile = async (req, res) => {
  try {
    const { gender, dateOfBirth = "", about = "", contactNumber } = req.body;
    const id = req.user.id;
    const userDetails = await User.findById(id);
    const allprofile = await User.findByIdAndUpdate(
      userDetails.additionalDetails
    );
    allprofile.dateOfBirth = dateOfBirth;
    allprofile.about = about;
    allprofile.gender = gender;
    allprofile.contactNumber = contactNumber;

    await allprofile.save();
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      allprofile,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findByIdAndDelete({ _id: id });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    await Profile.findByIdAndDelete({ _id: user.additionalDetails });

    await User.findByIdAndDelete({ _id: id });
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be deleted successfully",
    });
  }
};

exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id;
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();
    console.log(userDetails);

    return res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    console.log(image);
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    );
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const id = req.user.id;
    const userDetails = await User.findOne({ _id: id })
      .populate("courses")
      .exec();

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `could not found user with id ${userDetails}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
