/**
 * Created by eqo on 19/12/16.
 */

function model_statistics() {
    var mongoose = getDependency('mongoose');
    var Schema = mongoose.Schema;

    var statistics = new Schema({
        //incomplete
        name:       {type: String,   required: true},
    });

    return mongoose.model('statistics', statistics);
}