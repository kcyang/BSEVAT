/**
 * Created by KC on 2014-09-19.
 */
var query_config = require('../lib/getConfig.js');

exports.server = function(config_name,callback){

    console.info('[INFO] getServerConfig.js Function Start!!');

    query_config.toml(config_name,function(err,config_string){

        if(err){ //err일 때,
            console.error('Can\'t load config file['+err+']');
            callback(true,config_string);

        }else {   //성공적으로 config 파일을 잘 읽어오면,
            if(typeof config_string === 'undefined'){
                // 받은 결과값이 이상한겨.
                console.error('Config result has something wrong!!');
                callback(true,'Wrong Object from getConfig.js');

            }else {
                //다 잘 받아온겨
                console.info('Successfully fetch the config file information!!');

                var json_string = JSON.parse(config_string);

                callback(false,json_string);

            }
        }

    });
};