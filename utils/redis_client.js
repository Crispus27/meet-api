const redis = require('redis'),
    util = require('util'),
    redisClient =  redis.createClient(
         //{host:cst.REDIS_HOST,port:cst.REDIS_PORT}
    );
redisClient.get = util.promisify(redisClient.get);
module.exports =  redisClient;