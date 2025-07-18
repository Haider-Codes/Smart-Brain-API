export const handleClarifaiApiCall = (req, res) => {
    const imageUrl = req.body.imageUrl;
    console.log('Image Url is: ', imageUrl);
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // In this section, we set the user authentication, user and app ID, model details, and the URL
    // of the image we want as an input. Change these strings to run your own example.
    //////////////////////////////////////////////////////////////////////////////////////////////////
    const setupClarifaiApi = (imageUrl) => {
        // Your PAT (Personal Access Token) can be found in the Account's Security section
        const PAT = '8df93409ba8f4982a2334f94a1ba902f';
        // Specify the correct user_id/app_id pairings
        // Since you're making inferences outside your app's scope
        const USER_ID = 'lhwyqkpd85j2';
        const APP_ID = 'faceRecognition';
        // Change these to whatever model and image URL you want to use
        //const MODEL_ID = 'face-detection';
        const IMAGE_URL = imageUrl;
        console.log('IMAGE_URL: ', imageUrl);
        const raw = JSON.stringify({
            "user_app_id": {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            "inputs": [
                {
                    "data": {
                        "image": {
                            "url": IMAGE_URL
                            // "base64": IMAGE_BYTES_STRING
                        }
                    }
                }
            ]
        });

        const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Key ' + PAT
            },
            body: raw
        };

        return requestOptions;
    }

    fetch("https://api.clarifai.com/v2/models/face-detection/versions/6dc7e46bc9124c5c8824be4822abe105/outputs", setupClarifaiApi(imageUrl))
    .then(response=> response.json())
    .then(result => {
        if(result) {
            res.json(result);
        }
    })
}

export const handleFaceDetectionEntries = (req, res, database) => {
     const { id } = req.body;
    // database.users.forEach( user => {
    //     if(id === user.id) {
    //         user.entries ++;
    //         return res.json(user);
    //     }
    // })

    database.withSchema('smart_brain_user').from('users').where('id','=',id)
            .increment('entries', 1)
            .returning('*')
            .then(data=> {
                if(data[0].entries > 0)
                    return res.json(data[0]);
                else
                    throw error;
            })
            .catch(err=> res.status(404).json('No User with the id: '+id+' found'));

}