/**
 * Created by eqo on 19/12/16.
 */

function model_user() {
    var mongoose = getDependency('mongoose');
    var Schema = mongoose.Schema;

    var user = new Schema({
        name:       {type: String,   required: true},
        surname:    {type: String,   required: true},
        logId:      {type: String,   required: true},
        password:   {type: String,   required: true},
        rank:       {type: Number,   required: true},
        stats:      {type: objectId, required: true},
    });

    return mongoose.model('user', user);
}