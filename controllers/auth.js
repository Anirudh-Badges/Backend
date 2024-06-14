const User = require("../modals/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Profile = require("../modals/profile");

require("dotenv").config();


exports.signup  = async (req,res) => {
  try {
    const {firstName,lastName,email,password,confirmPassword,accountType} = req.body;
    
    if(!firstName || !lastName || !email || !password || !confirmPassword || !accountType){
      return res.status(403).json({
        success: false,
        message:"All field has to be filled",
      });
    }
    const userExistOrNot = await User.findOne({email});
    if(userExistOrNot){
      return res.status(400).json({
        success: false,
        message:"User is already Exists please try with another email",
      })
    }

    if(password !== confirmPassword){
      return res.status(400).json({
        success: false,
        message: "password and confirmpassword has to be same",
      })
    }

    const hashpassword = await bcrypt.hash(password,10);

    // const approved = null;
    // if(approved === true) {
    //   approved = true;
    // }else{
    //   approved = false;
    // }

    const profileInfo = await Profile.create({
      gender:null,
      about:null,
      dateOfBirth:null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName:firstName,
      lastName:lastName,
      email:email,
      password:hashpassword,
      confirmPassword:hashpassword,
      additionalDetails:profileInfo,
      accountType:accountType,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    })

    return res.status(200).json({
      success: true,
      message:"User created Successfully....",
    })

  } catch (error) {
    return res.status(500).json({
      success:false,
      message:error.message
    })
  }
}
// exports.Signup = async (req, res) => {
//   try {
//     const {
//       firstName,
//       lastName,
//       email,
//       password,
//       confirmPassword,
//       accountType,
//     } = req.body;
//     if (
//       !firstName ||
//       !lastName ||
//       !email ||
//       !password ||
//       !confirmPassword ||
//       !accountType
//     ) {
//       return res.status(403).send({
//         success: false,
//         message: "Please fills all fields  ",
//       });
//     }
//     if (password !== confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "Password and Confirm Password do not match.",
//       });
//     }

//     const alreadyExists = await User.findOne({ email });
//     if (alreadyExists) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists",
//       });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);

//     let approved = "";
//     approved === "Instructor" ? (approved = false) : (approved = true);

//     const profile = await Profile.create({
//       gender: null,
//       dateOfBirth: null,
//       about: null,
//       contactNumber: null,
//     });
//     const user = await User.create({
//       firstName,
//       lastName,
//       email,
//       password: hashedPassword,
//       confirmPassword: confirmPassword,
//       accountType: accountType,
//       approved: approved,
//       additionalDetails: profile._id,
//       image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
//     });

//     return res.status(200).json({
//       success: true,
//       user,
//       message: "User registered successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "User cannot be registered",
//     });
//   }
// };

exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User is not registered" });
    }
    const payload = {
      email: user.email,
      id: user._id,
      accountType: user.accountType,
    };

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });
      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Login Successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login Failed",
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userDetails = await User.findById(req.user.id);
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    const Matchpassoword = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );

    if (!Matchpassoword) {
      return res.status(401).json({
        success: false,
        message: "password not matched",
      });
    }

    if(newPassword !== confirmNewPassword){
      return res.status(401).json({
        success: false,
        message: "new password and confirm new password did not match"
      });
    }

    const hashNewPassword = await bcrypt.hash(newPassword, 10);
		const updateUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: hashNewPassword },
			{ new: true }
		)


    return res.status(200).json({
      success: true,
      message: "password changed successfully",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Password cannot changed",
    });
  }
};
