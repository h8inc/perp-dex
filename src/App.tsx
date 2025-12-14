import { useMemo } from 'react';
import { Container, Theme } from './settings/types';
import { CryptoSwapWidget } from './components/generated/CryptoSwapWidget';
import { Header } from './components/generated/Header';
// %IMPORT_STATEMENT

let theme: Theme = 'dark';
// only use 'centered' container for standalone components, never for full page apps or websites.
let container: Container = 'centered';

function App() {
  function setTheme(theme: Theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  setTheme(theme);

  const generatedComponent = useMemo(() => {
    // THIS IS WHERE THE TOP LEVEL GENRATED COMPONENT WILL BE RETURNED!
    return <CryptoSwapWidget />; // %EXPORT_STATEMENT%
  }, []);

  if (container === 'centered') {
    return (
      <div className="min-h-screen w-full flex flex-col items-center bg-[#0b0e11]">
        <Header />
        <main className="w-full flex flex-col items-center gap-8">
          {generatedComponent}
        </main>
      </div>
    );
  } else {
    return (
      <>
        <Header />
        <main className="w-full flex flex-col items-center gap-8">
          {generatedComponent}
        </main>
      </>
    );
  }
}

export default App;