/**
 * Created by eqo on 19/12/16.
 */

function model_agenda() {
    var mongoose = getDependency('mongoose');
    var Schema = mongoose.Schema;

    var agenda = new Schema({
        //incomplete
        date: {type: Date, required: true},
    });

    return mongoose.model('agenda', agenda);
}