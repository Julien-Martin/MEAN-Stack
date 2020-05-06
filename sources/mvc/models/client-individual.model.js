/**
 * Created by eqo on 19/12/16.
 */

function model_client_individual() {
    var mongoose = getDependency('mongoose');
    var Schema = mongoose.Schema;

    var individual = new Schema({
        name:           {type: String,   required: true},
        surname:        {type: String,   required: true},
        address:        {type: String,   required: true},
        postalCode:     {type: String,   required: true},
        city:           {type: String,   required: true},
        phoneNumber1:   {type: Number,   required: true},
        phoneNumber2:   {type: Number,   required: true},
        fax:            {type: Number,   required: true},
        mobile:         {type: Number,   required: true},
        infos:          {type: String,   required: true},
        state:          {type: String,   required: true},
        user:           {type: objectId, required: true},
    });

    return mongoose.model('individual', individual);
}