// config/eureka.js
const Eureka = require('eureka-js-client').Eureka;

const eurekaClient = new Eureka({
  instance: {
    app: 'auth', // Name of your service
    hostName: 'localhost', // Hostname of your service
    ipAddr: '127.0.0.1', // IP address of your service
    port: {
      '$': 3000, // Port your service is running on
      '@enabled': true,
    },
    vipAddress: 'nodejs-service', // VIP address for your service
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn', // Data center name
    },
  },
  eureka: {
    host: 'localhost', // Eureka server host
    port: 8761, // Eureka server port (default is 8761)
    servicePath: '/eureka/apps/', // Eureka service path
  },
});

module.exports = eurekaClient;