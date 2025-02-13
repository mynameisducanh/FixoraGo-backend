module.exports = {
  apps: [
    {
      name: 'fixorago-backend',
      script: 'dist/main.js',
      instances: 1,
      watch: true,
      ignore_watch: ['node_modules', 'uploads/images', 'uploads/clients'],
      max_memory_restart: '1G',
    },
  ],
};
