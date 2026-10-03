import { app } from './app';

// Se re-exporta para que el contrato de import del material (`../src/index`)
// siga siendo valido sin arrastrar el arranque del servidor a los tests.
export { app };

const PORT = Number(process.env.PORT) || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[server]: API Service running on port ${PORT}`);
  });
}