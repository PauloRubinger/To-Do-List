import HomePage from "./pages/HomePage";
import { ConfigProvider } from "antd";
import ptBR from 'antd/lib/locale/pt_BR';

function App() {
  return (
    <ConfigProvider
      locale={ptBR}
    >
      <HomePage>
      </HomePage>
    </ConfigProvider>
  );
}

export default App;
