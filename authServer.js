require('dotenv').config()

const express = require("express");
const app = express();

const jwt = require('jsonwebtoken')

app.use(express.json())

let refreshTokens = []

app.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
        if(!refreshToken.includes(refreshToken)) return res.sendStatus(403)
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        const acessToken = generateAccessToken({ name: user.name})
        res.json({accessToken: accessToken})
            })
})

// const posts = [
//     {
//         username: 'jack',
//         title: 'post 1'
//     },
//     {
//         username: 'daniels',
//         title: 'post 2'
//     }
// ]

// app.get('/posts',  (req,res) => {

//     res.json(posts.filter(post => post.username === req.user.name))
// })

app.delete('/logout', (req,res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

app.post('/login', (req,res) => {
    //Authenticate User
    const username = req.body.username
    const user = { name: username}
    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.json({ accessToken: accessToken, refreshToken: refreshToken})
})

function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60s' })
}



app.listen(4000)