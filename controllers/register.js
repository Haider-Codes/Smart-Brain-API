const handleRegister = (req, res, bcrypt, database) => {
        const { first_name, last_name, email, password } = req.body;
        const password_hash = bcrypt.hashSync(password, 10);
    
        if(first_name && email && password) {
        //     database.users.push(
        //         {
        //             id: "03",
        //             name: req.body.name,
        //             email: req.body.email,
        //             password: req.body.password,
        //             entries:0,
        //             joined: new Date()
        //         }
        //     )        
        // return res.status(201).json(database.users[database.users.length-1]);
    
            database.transaction( trx=> {
                trx.withSchema('smart_brain_user').insert({
                    email: email,
                    password_hash: password_hash
                })
                .into('login')
                .returning('email')
                .then(loginEmail => {
                    return trx.withSchema('smart_brain_user').insert({
                        first_name: first_name,
                        last_name: last_name,
                        email: loginEmail[0].email,
                        joined: new Date()
                    })
                    .into('users')
                    .returning('*');
                })
                .then(user=> {
                    res.json(user[0]);
                })
                .then(trx.commit)
                .catch(trx.rollback);
            } )
        }
        else
            res.status(400).json("Please fill all the required fields.");
    
}

export default handleRegister;