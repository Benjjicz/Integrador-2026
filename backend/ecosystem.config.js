module.exports = {
  apps: [
    {
      name: 'gestor-de-proyectos',
      script: 'dist/main.js',
      time: true, 

      env: {
        NODE_ENV: 'production',
        PORT: 3000,             
        DB_HOST: 'localhost',
        DB_PORT: 5432,          
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'admin',   
        DB_NAME: 'gestion_proyectos2',      
        DB_LOGGING: 'false',
        SWAGGER_HABILITADO: 'false',
        JWT_SECRET: 'gtT0zY6&5Sx%7c29x&O4@^@73D&uz^xQ'
      }
    }
  ]
};