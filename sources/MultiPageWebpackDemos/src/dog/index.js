import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

const CmsMain = () => {
    return (
        <div className="main">
            <div className="mainIco">

            </div>
            dog
            <p>点击下面的链接可跳转</p>
            <a href="http://localhost:8080">小兔页（index）</a>
            <br/>
            <a href="http://localhost:8080/cat">小猫页(cat)</a>
        </div>
    )
};

ReactDOM.render(<CmsMain/>, document.querySelector("#root"));