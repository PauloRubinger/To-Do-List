import Home from "./pages/Home";
import { ConfigProvider } from "antd";
import enUS from 'antd/lib/locale/en_US';

function App() {
  return (
    <ConfigProvider
      locale={enUS}
    >
      <Home>
      </Home>
    </ConfigProvider>
  );
}

export default App;
