import { Toaster } from 'react-hot-toast';

import { AppRouter } from '@/routes/AppRouter';

function App() {
  return (
    <>
      <AppRouter />

      <Toaster
        position="top-center"
        containerStyle={{
          top: '76px',
          zIndex: 9999,
        }}
        toastOptions={{
          duration: 2500,
          style: {
            minWidth: '320px',
            padding: '14px 18px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 600,
            direction: 'rtl',
          },
        }}
      />
    </>
  );
}

export default App;
