export const mqttOptions = {
  uri: 'wss://2c3bf9f59f854d31acdaa3ad9ce7a0f7.s1.eu.hivemq.cloud:8884/mqtt',
  clientId: 'mobile-app-' + Math.random().toString(16).substr(2, 8),
  userName: 'Client1',
  password: '123a321A',
  cleanSession: true,
  keepAliveInterval: 60,
  timeout: 10,
  useSSL: true
}