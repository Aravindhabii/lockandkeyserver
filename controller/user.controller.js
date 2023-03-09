
 const login = (req, res) => {
    const {email, password} = req.body;
    db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, resp)=>{
        if (err) {
            console.log(err);
        }else{
            res.send(resp);
        }
    })
}

module.exports = login
