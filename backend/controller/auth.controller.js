// it's a controller file where we only controls what happen when the signup routes called

export const signup = async (req, res) => {
    res.send("it's Signup")
}

export const signin = async (req, res) => {
    res.send("it's Signin")
}

export const logout = async (req, res) => {
    res.send("it's logout")
}