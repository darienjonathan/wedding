const LOCAL_DOMAIN_NAME = 'subdomain.local-domain.com'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  modules: ['@pinia/nuxt', 'nuxt-multi-tenancy', '@nuxt/image'],
  build: {
    transpile: ['@googlemaps/js-api-loader'],
  },
  devServer: {
    host: LOCAL_DOMAIN_NAME,
  },
  image: {
    quality: 50,
  },
  nitro: {
    firebase: {
      gen: 2,
      httpsOptions: {
        region: 'asia-southeast2',
      },
    },
  },
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/icon?family=Material+Icons+Outlined',
        },
      ],
    },
  },
  multiTenancy: {
    tenantDynamicRoute: 'site',
    rootDomains: [`${LOCAL_DOMAIN_NAME}:3000`, 'localhost:3000'],
  },
  runtimeConfig: {
    public: {
      firebaseConfig: {
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        projectId: process.env.PROJECT_ID,
        storageBucket: process.env.STORAGE_BUCKET,
        messagingSenderId: process.env.MESSAGING_SENDER_ID,
        appId: process.env.APP_ID,
      },
      firebaseEmulator: {
        host: process.env.EMULATOR_HOST,
        authPort: process.env.EMULATOR_AUTH_PORT,
        functionsPort: process.env.EMULATOR_FUNCTIONS_PORT,
        firestorePort: process.env.EMULATOR_FIRESTORE_PORT,
        hostingPort: process.env.EMULATOR_HOSTING_PORT,
        storagePort: process.env.EMULATOR_STORAGE_PORT,
        authEmail: process.env.EMULATOR_AUTH_EMAIL,
        authPassword: process.env.EMULATOR_AUTH_PASSWORD,
      },
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
    functionsBaseURL: process.env.FIREBASE_FUNCTIONS_BASE_API_URL,
  },
  css: ['@/assets/css/global.scss'],
})
