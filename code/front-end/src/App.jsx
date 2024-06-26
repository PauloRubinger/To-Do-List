import Home from "./pages/Home";
import { ConfigProvider } from "antd";
import ptBR from 'antd/lib/locale/pt_BR';

function App() {
  return (
    <ConfigProvider
      locale={ptBR}
    >
      <Home>
      </Home>
    </ConfigProvider>
  );
}

export default App;
