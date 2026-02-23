export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { initializeMSWOnServer } = await import(
      '@/configs/msw/initializeMSWOnServer'
    );
    initializeMSWOnServer();
  }
}
