const handleProfile = (req, res, database) => {
        const { id } = req.params;
    // database.users.forEach( user => {
    //     if(id === user.id) {
    //         return res.json(user);
    //     }
    // } )

    database.withSchema('smart_brain_user').select('*').from('users')
            .where('id','=',id)
            .then(user=> {
                if(user[0].id) {
                    return res.json(user[0]);
                }
                else {
                    throw error;
                }
            })
            .catch(error=> res.status(404).json('No User with the id: '+id+' found'))

    //res.status(404).json('No User with the id: '+id+' found');

}

export default handleProfile;