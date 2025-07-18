const handleSignIn = (req, res, bcrypt, database) => {
    
    // database.users.forEach( user => {
    //     if(req.body.email === user.email && req.body.password === user.password) {
    //         return res.json(user);
    //     }
    // })

    database.withSchema('smart_brain_user').select('email', 'password_hash').from('login')
            .where('email','=',req.body.email)
            .then(data=> {
                if(data[0]) {
                    const isValid = bcrypt.compareSync(req.body.password, data[0].password_hash);
                    if(isValid) {
                        return database.withSchema('smart_brain_user').select('*').from('users')
                                        .where('email','=',req.body.email)
                                        .then(user=> {
                                            return res.json(user[0]);
                                        })
                                        .catch(err=> res.status(400).json('Invalid Credentials'));
                    }
                    return res.status(400).json('Invalid Credentials');
                }
                    return res.status(401).json('Incorrect Username or Password');
            })
            .catch(err=> res.status(401).json('wrong credentials'));

}

export default handleSignIn;