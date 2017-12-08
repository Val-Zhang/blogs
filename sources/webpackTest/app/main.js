import React from 'react';
import {render} from 'react-dom';
import Greeter from './Greeter';
import {AppContainer} from 'react-hot-loader'

import './main.css'; //使用require导入css文件

render(
  <AppContainer>
  <Greeter/>
</AppContainer>, document.getElementById('root'));