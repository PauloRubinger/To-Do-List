import Home from "./pages/Home";
import { ConfigProvider } from "antd";
import enUS from 'antd/lib/locale/en_US';

function App() {
  return (
    <ConfigProvider
      locale={enUS}
      theme={{ token: { colorPrimary: "#49c78f" } }}
    >
      <Home>
      </Home>
    </ConfigProvider>
  );
}

export default App;
