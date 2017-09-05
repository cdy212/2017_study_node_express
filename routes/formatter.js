
/**
 * @detail JSON response formatter
 * @author youniforever
 * @param result 200
 * @param data {}
 * @param error ''
 */
exports.jsonCapsule = function(result, data, error) {
    var ret = {};
    ret['result'] = result;
    ret['data'] = data;
    ret['error'] = error;
    
    return ret;
};

/**
 * @detail JSONP response formatter
 * @author youniforever
 * @param result 200
 * @param data {}
 * @param error ''
 */
exports.jsonpCapsule = function(result, data, error) {
    var ret = {};
    ret['result'] = result;
    ret['data'] = data;
    ret['error'] = error;
    
    return '_drmzCallback_(' + JSON.stringify(ret) + ')';
};