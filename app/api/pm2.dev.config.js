module.exports = {
  apps: [
    {
      name: 'http',
      script: './app-http.js',
      instances: 2,
      watch: ['src'],
      autorestart: true,
      watch_delay: 1000,
      max_memory_restart: '128M',
      ignore_watch: ['node_modules', 'coverage'],
    },
    // {
    //   name: 'worker',
    //   script: './app-worker.js',
    //   instances: 1,
    //   watch: ['src'],
    //   autorestart: true,
    //   watch_delay: 1000,
    //   max_memory_restart: '128M',
    //   ignore_watch: ['node_modules', 'coverage'],
    // },
  ],
};
