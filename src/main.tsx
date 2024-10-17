import { createRoot } from 'react-dom/client'
import { Offline, Online } from "react-detect-offline";
import { Provider } from "react-redux";
import App from './components/app//app'
import store from "./store"
import './main.css'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <Online>
      <App />
    </Online>
    <Offline>
      <span className="offline">Something bad happened to your Internet</span>
    </Offline>
  </Provider>
)
