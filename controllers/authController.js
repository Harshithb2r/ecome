import { comparePassward, hashPassword } from "../helper/authHelper.js"
import userModel from "../models/userModel.js"
import JWT from 'jsonwebtoken'

export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, question } = req.body

        if (!name) {
            return res.send({ message: 'name is required' })
        }
        if (!email) {
            return res.send({ message: 'email is required' })
        }
        if (!password) {
            return res.send({ message: 'password is required' })
        }
        if (!phone) {
            return res.send({ message: 'phone no is required' })
        }
        if (!address) {
            return res.send({ message: 'address is required' })
        }
        if (!question) {
            return res.send({ message: 'question is required' })
        }

        const existinguser = await userModel.findOne({ email })

        if (existinguser) {
            return res.status(200).send({
                success: false,
                message: 'already registered please login'
            })
        }

        const hashedPassword = await hashPassword(password)

        const user = await new userModel({ name, email, phone, address, password: hashedPassword, question }).save()

        res.status(201).send({
            success: true,
            message: 'registration successful',
            user
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'error in registration',
            error
        })
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: 'Invaild username or password'
            })
        }
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success: false,
                message: 'email is not registered'
            })
        }
        const match = await comparePassward(password, user.password)
        if(!match){
            return res.status(200).send({
                success: false,
                message: "Invaild password"
            })
        }

        const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET,{expiresIn: '7d'})
        res.status(200).send({
            success: true,
            message: "Login successfull",
            user:{
                name: user.name,
                emial: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            token,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in login',
            error
        })
    }
}

export const forgotPasswordController = async(req, res) =>{
    try {
        const {email,question,newPassword} = req.body
        if(!email){
            res.status(400).send({ message:'email is required'})
        }
        if(!question){
            res.status(400).send({ message:'question is required'})
        }
        if(!newPassword){
            res.status(400).send({ message:'new Password is required'})
        }
        const user = await userModel.findOne({email, question})
        if(!user){
            return res.status(404).send({
                success: false,
                message: 'email is not registered'
            })
        }
        const hashed = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id,{password: hashed})
        res.status(200).send({
            success: true,
            message: "Password Resent successfull",
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error
        })
    }
}

export const testController = (req, res) =>{
    res.send("protected")
}
